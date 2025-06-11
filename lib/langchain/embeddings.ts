import { OpenAIEmbeddings } from "@langchain/openai";

/**
 * 创建嵌入模型
 * @param apiKey API密钥
 * @param endpoint API端点
 * @returns OpenAI嵌入模型实例
 */
export function createEmbeddingModel(
  apiKey?: string,
  endpoint?: string
): OpenAIEmbeddings {
  const actualApiKey = apiKey || process.env.OPENAI_API_KEY;
  if (!actualApiKey) {
    throw new Error("未提供API密钥且环境变量中不存在OPENAI_API_KEY");
  }

  const actualEndpoint = endpoint || process.env.OPENAI_API_ENDPOINT;
  console.log(`使用OpenAI嵌入API端点: ${actualEndpoint || "默认官方API"}`);

  const options: any = {
    openAIApiKey: actualApiKey,
    modelName: "text-embedding-ada-002",
    timeout: 60000,
    maxRetries: 3,
  };

  if (actualEndpoint) {
    options.configuration = {
      baseURL: actualEndpoint,
    };
  }

  return new OpenAIEmbeddings(options);
}

/**
 * 获取默认嵌入模型实例
 * @returns 默认嵌入模型
 */
export function getDefaultEmbeddingModel(): OpenAIEmbeddings {
  return createEmbeddingModel();
}
