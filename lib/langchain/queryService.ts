import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import {
  addToMemory,
  getFormattedHistory,
  getMemoryForSession,
} from "./memory";

/**
 * 创建聊天模型
 * @param apiKey API密钥
 * @param modelName 模型名称
 * @param endpoint API端点
 * @returns ChatOpenAI聊天模型
 */
export function createChatModel(
  apiKey?: string,
  modelName?: string,
  endpoint?: string
): ChatOpenAI {
  // 调试信息
  console.log("环境变量调试:", {
    OPENAI_API_KEY_EXISTS: !!process.env.OPENAI_API_KEY,
    OPENAI_API_KEY_LENGTH: process.env.OPENAI_API_KEY?.length || 0,
    OPENAI_API_ENDPOINT: process.env.OPENAI_API_ENDPOINT,
    MODEL_NAME: process.env.MODEL_NAME,
    DEEPSEEK_API_KEY_EXISTS: !!process.env.DEEPSEEK_API_KEY,
  });

  // 使用传入的apiKey或环境变量
  const actualApiKey = apiKey || process.env.OPENAI_API_KEY;
  if (!actualApiKey) {
    throw new Error("未提供API密钥且环境变量中不存在OPENAI_API_KEY");
  }

  // 使用传入的endpoint或环境变量
  const actualEndpoint = endpoint || process.env.OPENAI_API_ENDPOINT;
  console.log(`使用API端点: ${actualEndpoint || "默认官方API"}`);

  const options: any = {
    openAIApiKey: actualApiKey,
    modelName: modelName || process.env.MODEL_NAME || "gpt-3.5-turbo",
    temperature: 0.7,
    maxTokens: 2000,
    timeout: 60000,
    maxRetries: 3,
  };

  // 如果有自定义端点，设置baseURL
  if (actualEndpoint) {
    options.configuration = {
      baseURL: actualEndpoint,
    };
  }

  return new ChatOpenAI(options);
}

/**
 * 使用通用模型回答问题（无文档上下文）
 * @param query 用户问题
 * @param sessionId 会话ID
 * @param conversationHistory 对话历史
 * @returns 模型回答
 */
export async function queryGeneralModel(
  query: string,
  sessionId?: string,
  conversationHistory?: Array<{
    role: string;
    content: string;
  }>
): Promise<string> {
  if (!query || query.trim().length === 0) {
    throw new Error("未提供问题内容");
  }

  const llm = createChatModel();

  try {
    console.log(
      `使用通用模型回答问题: "${query.substring(0, 100)}${
        query.length > 100 ? "..." : ""
      }"`
    );

    // 构建上下文
    let contextText = "";

    // 优先使用传入的对话历史
    if (conversationHistory && conversationHistory.length > 0) {
      console.log(
        `使用传入的对话历史，包含 ${conversationHistory.length} 条消息`
      );

      // 格式化对话历史
      const formattedHistory = conversationHistory
        .filter((msg) => msg.role !== "system") // 过滤掉系统消息
        .slice(-8) // 保留最近8条消息
        .map((msg) => {
          const roleText = msg.role === "user" ? "用户" : "AI助手";
          return `${roleText}: ${msg.content}`;
        })
        .join("\n");

      if (formattedHistory) {
        contextText = `以下是之前的对话历史:
${formattedHistory}

`;
      }
    } else if (sessionId) {
      // 如果没有传入对话历史，则使用会话记忆
      console.log(`使用会话ID: ${sessionId} 的记忆处理问题`);
      const historyText = await getFormattedHistory(sessionId);
      if (historyText) {
        contextText = `以下是之前的对话历史:
${historyText}

`;
      }
    }

    // 构建提示模板
    const template = contextText
      ? `${contextText}基于以上历史，回答用户的问题: {question}
请用中文简明扼要地回答:`
      : `请回答以下问题，如果你不确定答案，请直接说不知道，不要编造信息。

问题: {question}

请用中文简明扼要地回答:`;

    const prompt = PromptTemplate.fromTemplate(template);
    const formattedPrompt = await prompt.format({ question: query });

    // 使用LLM直接调用
    const response = await llm.invoke(formattedPrompt);
    const answer =
      typeof response.content === "string"
        ? response.content
        : String(response.content);

    // 更新会话历史（如果有会话ID）
    if (sessionId) {
      await addToMemory(sessionId, query, answer);
    }

    return answer;
  } catch (error) {
    console.error("通用模型回答失败:", error);
    throw error;
  }
}

/**
 * 创建问答链（基于文档检索）
 * @param vectorStore 向量存储
 * @param sessionId 会话ID
 * @param promptTemplate 自定义提示模板
 * @returns 问答链
 */
export async function createQAChain(
  vectorStore: any,
  sessionId?: string,
  promptTemplate?: string
) {
  const llm = createChatModel();

  if (!vectorStore) {
    throw new Error("未提供向量存储");
  }

  // 获取会话的记忆实例
  const memory = sessionId ? getMemoryForSession(sessionId) : undefined;

  // 默认QA提示模板
  const qaTemplate =
    promptTemplate ||
    `请根据以下信息回答用户的问题。如果无法从提供的信息中找到答案，请明确告知您不知道，不要编造信息。

信息:
{context}

用户问题: {input}

请用中文简明扼要地回答:`;

  const PROMPT = PromptTemplate.fromTemplate(qaTemplate);

  // 创建文档合并链
  const documentChain = await createStuffDocumentsChain({
    llm,
    prompt: PROMPT,
  });

  // 创建检索链
  return createRetrievalChain({
    retriever: vectorStore.asRetriever(),
    combineDocsChain: documentChain,
  });
}

/**
 * 执行基于文档的查询
 * @param query 查询文本
 * @param vectorStore 向量存储
 * @param sessionId 会话ID
 * @param conversationHistory 对话历史
 * @returns 查询结果
 */
export async function executeDocumentQuery(
  query: string,
  vectorStore: any,
  sessionId?: string,
  conversationHistory?: Array<{
    role: string;
    content: string;
  }>
): Promise<{
  answer: string;
  sources: any[];
  usedVectorStore: boolean;
}> {
  if (!query || query.trim().length === 0) {
    throw new Error("未提供查询内容");
  }

  if (!vectorStore) {
    throw new Error("未提供向量存储");
  }

  try {
    console.log(
      `执行基于文档的查询: "${query.substring(0, 100)}${
        query.length > 100 ? "..." : ""
      }"`
    );

    // 构建包含对话历史的提示模板
    let qaTemplate = `请根据以下信息回答用户的问题。如果无法从提供的信息中找到答案，请明确告知您不知道，不要编造信息。

信息:
{context}`;

    // 如果有对话历史，添加到提示中
    if (conversationHistory && conversationHistory.length > 0) {
      const formattedHistory = conversationHistory
        .filter((msg) => msg.role !== "system")
        .slice(-6) // 保留最近6条消息
        .map((msg) => {
          const roleText = msg.role === "user" ? "用户" : "AI助手";
          return `${roleText}: ${msg.content}`;
        })
        .join("\n");

      if (formattedHistory) {
        qaTemplate = `请根据以下信息回答用户的问题。如果无法从提供的信息中找到答案，请明确告知您不知道，不要编造信息。

以下是之前的对话历史:
${formattedHistory}

信息:
{context}`;
      }
    }

    qaTemplate += `

用户问题: {input}

请用中文简明扼要地回答:`;

    // 创建QA链
    const qaChain = await createQAChain(vectorStore, sessionId, qaTemplate);

    // 执行查询
    const result = await qaChain.invoke({
      input: query,
    });

    // 提取源文档
    const sources = result.source_documents || result.sourceDocuments || [];
    const sourceArray = Array.isArray(sources) ? sources : [];

    // 如果有会话ID，保存到记忆中
    if (sessionId) {
      await addToMemory(sessionId, query, result.answer);
    }

    return {
      answer: result.answer,
      sources: sourceArray.map((doc: any) => ({
        content: doc.pageContent,
        metadata: doc.metadata,
      })),
      usedVectorStore: true,
    };
  } catch (error) {
    console.error("基于文档的查询失败:", error);
    throw error;
  }
}

/**
 * 查询参数接口
 */
export interface QueryParams {
  question: string;
  sessionId: string;
  useVectorStore?: boolean;
  temperature?: number;
  maxTokens?: number;
  conversationHistory?: Array<{
    role: string;
    content: string;
  }>;
}

/**
 * 处理查询的主函数
 * @param params 查询参数
 * @returns 查询结果
 */
export async function processQuery(params: QueryParams): Promise<{
  response: string;
  sources?: Array<{
    content: string;
    metadata: Record<string, any>;
  }>;
  usedVectorStore?: boolean;
}> {
  const {
    question,
    sessionId,
    useVectorStore = false,
    conversationHistory,
  } = params;

  if (!question || question.trim().length === 0) {
    throw new Error("问题不能为空");
  }

  try {
    if (useVectorStore) {
      // 尝试使用向量存储进行查询
      try {
        const { getVectorStore } = await import("./vectorStore");
        const vectorStore = await getVectorStore();

        const result = await executeDocumentQuery(
          question,
          vectorStore,
          sessionId,
          conversationHistory
        );

        return {
          response: result.answer,
          sources: result.sources,
          usedVectorStore: true,
        };
      } catch (vectorError) {
        console.warn("向量存储查询失败，回退到通用模型:", vectorError);
        // 回退到通用模型
      }
    }

    // 使用通用模型，传递对话历史
    const response = await queryGeneralModel(
      question,
      sessionId,
      conversationHistory
    );

    return {
      response,
      usedVectorStore: false,
    };
  } catch (error) {
    console.error("查询处理失败:", error);
    throw error;
  }
}
