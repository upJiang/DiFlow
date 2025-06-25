# DiFlow LangChain 功能说明文档

## 概述

DiFlow 的 LangChain 集成提供了完整的 AI 对话和知识库功能，包括文档处理、向量存储、会话记忆和智能问答。本文档详细记录了各个模块的功能和实现方式，确保后续维护时不会出现问题。

## 架构图

```
用户输入 → ChatBox → API路由 → QueryService → 向量存储/记忆管理 → LLM → 返回结果
```

## 核心模块说明

### 1. 文档加载器 (documentLoader.ts)

**功能**: 处理用户上传的文档，将其转换为可搜索的文档块

**关键功能**:

- 支持多种文件格式：PDF, DOCX, TXT, MD, CSV, JSON
- 文档分块处理，便于向量化存储
- Base64 文件内容解码

**关键代码**:

```typescript
/**
 * 处理文本内容，生成文档块
 */
export async function processTextContent(
  content: string,
  metadata: Record<string, any> = {},
  id: string
): Promise<ProcessedDocument> {
  // 创建文本分割器
  const textSplitter = createTextSplitter();

  // 创建原始文档
  const document = new Document({
    pageContent: content,
    metadata: { ...metadata, id, timestamp: new Date().toISOString() },
  });

  // 分割文档
  const chunks = await textSplitter.splitDocuments([document]);

  return { id, content, metadata: document.metadata, chunks };
}

/**
 * 从Base64字符串处理文件内容
 */
export async function processFileFromBase64(
  base64Content: string,
  filename: string,
  id: string
): Promise<ProcessedDocument> {
  const buffer = Buffer.from(base64Content, "base64");
  const content = buffer.toString("utf-8");

  const metadata = {
    filename,
    fileType: getFileType(filename),
    fileSize: buffer.length,
    uploadTime: new Date().toISOString(),
  };

  return await processTextContent(content, metadata, id);
}
```

**配置参数**:

- `DEFAULT_CHUNK_SIZE = 1000`: 默认分块大小
- `DEFAULT_CHUNK_OVERLAP = 200`: 分块重叠大小
- 分隔符: `["\n\n", "\n", "。", "！", "？", "；", " ", ""]`

### 2. 嵌入模型 (embeddings.ts)

**功能**: 创建和管理 OpenAI 嵌入模型，用于文档向量化

**关键功能**:

- 支持自定义 API 端点
- 统一的嵌入模型配置
- 错误处理和重试机制

**关键代码**:

```typescript
/**
 * 创建嵌入模型
 */
export function createEmbeddingModel(
  apiKey?: string,
  endpoint?: string
): OpenAIEmbeddings {
  const actualApiKey = apiKey || process.env.OPENAI_API_KEY;
  if (!actualApiKey) {
    throw new Error("未提供API密钥且环境变量中不存在OPENAI_API_KEY");
  }

  const options: any = {
    openAIApiKey: actualApiKey,
    modelName: "text-embedding-ada-002",
    timeout: 60000,
    maxRetries: 3,
  };

  if (endpoint || process.env.OPENAI_API_ENDPOINT) {
    options.configuration = {
      baseURL: endpoint || process.env.OPENAI_API_ENDPOINT,
    };
  }

  return new OpenAIEmbeddings(options);
}
```

**环境变量**:

- `OPENAI_API_KEY`: OpenAI API 密钥
- `OPENAI_API_ENDPOINT`: 自定义 API 端点（可选）

### 3. 会话记忆 (memory.ts)

**功能**: 管理用户对话历史，提供上下文记忆功能

**关键功能**:

- 基于会话 ID 的记忆隔离
- 自动清理过期会话
- 格式化历史记录输出

**关键代码**:

```typescript
/**
 * 获取会话记忆实例
 */
export function getMemoryForSession(sessionId: string): BufferMemory {
  let sessionMemory = sessionMemories.get(sessionId);

  if (!sessionMemory) {
    const history = new ChatMessageHistory();
    const memory = new BufferMemory({
      chatHistory: history,
      memoryKey: "chat_history",
      returnMessages: true,
      inputKey: "question",
      outputKey: "answer",
    });

    sessionMemory = { memory, history, lastUsed: new Date() };
    sessionMemories.set(sessionId, sessionMemory);
  } else {
    sessionMemory.lastUsed = new Date();
  }

  return sessionMemory.memory;
}

/**
 * 添加消息到会话记忆
 */
export async function addToMemory(
  sessionId: string,
  userMessage: string,
  aiMessage: string
): Promise<void> {
  const memory = getMemoryForSession(sessionId);
  await memory.saveContext({ question: userMessage }, { answer: aiMessage });
}
```

**配置参数**:

- `CLEANUP_INTERVAL = 30 * 60 * 1000`: 自动清理间隔（30 分钟）
- `SESSION_TIMEOUT = 2 * 60 * 60 * 1000`: 会话过期时间（2 小时）

### 4. 向量存储 (vectorStore.ts)

**功能**: 管理文档向量存储，提供相似性搜索功能

**关键功能**:

- 全局向量存储实例管理
- 文档向量化和存储
- 相似性搜索和评分

**关键代码**:

```typescript
// 全局向量存储实例
let globalVectorStore: MemoryVectorStore | null = null;

/**
 * 创建或获取向量存储实例
 */
export async function getVectorStore(): Promise<MemoryVectorStore> {
  if (!globalVectorStore) {
    const embeddings = createEmbeddingModel();
    globalVectorStore = new MemoryVectorStore(embeddings);
    console.log("创建新的向量存储实例");
  }
  return globalVectorStore;
}

/**
 * 将文档添加到向量存储
 */
export async function addDocumentsToVectorStore(
  documents: ProcessedDocument[]
): Promise<number> {
  const vectorStore = await getVectorStore();
  let totalChunks = 0;

  for (const doc of documents) {
    await vectorStore.addDocuments(doc.chunks);
    totalChunks += doc.chunks.length;
  }

  return totalChunks;
}

/**
 * 相似性搜索
 */
export async function similaritySearch(
  query: string,
  k: number = 4
): Promise<Document[]> {
  const vectorStore = await getVectorStore();
  return await vectorStore.similaritySearch(query, k);
}
```

### 5. 查询服务 (queryService.ts)

**功能**: 核心查询处理服务，协调各个模块完成智能问答

**关键功能**:

- 通用模型对话（无文档上下文）
- 基于文档的检索问答
- 会话记忆集成
- 自动模式切换

**关键代码**:

```typescript
/**
 * 创建聊天模型
 */
export function createChatModel(
  apiKey?: string,
  modelName?: string,
  endpoint?: string
): ChatOpenAI {
  const actualApiKey = apiKey || process.env.OPENAI_API_KEY;
  const options: any = {
    openAIApiKey: actualApiKey,
    modelName: modelName || process.env.MODEL_NAME || "gpt-3.5-turbo",
    temperature: 0.7,
    maxTokens: 2000,
    timeout: 60000,
    maxRetries: 3,
  };

  if (endpoint || process.env.OPENAI_API_ENDPOINT) {
    options.configuration = {
      baseURL: endpoint || process.env.OPENAI_API_ENDPOINT,
    };
  }

  return new ChatOpenAI(options);
}

/**
 * 处理查询的主函数
 */
export async function processQuery(params: QueryParams): Promise<{
  response: string;
  sources?: Array<{ content: string; metadata: Record<string, any> }>;
  usedVectorStore?: boolean;
}> {
  const { question, sessionId, useVectorStore = false } = params;

  if (useVectorStore) {
    try {
      const { getVectorStore } = await import("./vectorStore");
      const vectorStore = await getVectorStore();

      const result = await executeDocumentQuery(
        question,
        vectorStore,
        sessionId
      );
      return {
        response: result.answer,
        sources: result.sources,
        usedVectorStore: true,
      };
    } catch (vectorError) {
      console.warn("向量存储查询失败，回退到通用模型:", vectorError);
    }
  }

  // 回退到通用模型
  const response = await queryGeneralModel(question, sessionId);
  return { response, usedVectorStore: false };
}
```

## 工作流程

### 1. 文档上传流程

```
用户上传文件 → Base64编码 → documentLoader处理 → 文档分块 → 向量化 → 存储到vectorStore
```

### 2. 对话查询流程

```
用户提问 → 检查是否有知识库 →
├─ 有知识库: 向量搜索 → 检索相关文档 → 结合上下文生成回答
└─ 无知识库: 直接使用通用模型 → 结合会话记忆生成回答
```

### 3. 会话记忆流程

```
每次对话 → 保存到sessionMemory → 下次对话时获取历史 → 提供上下文
```

## 关键配置

### 环境变量

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_API_ENDPOINT=https://your-custom-endpoint.com  # 可选
MODEL_NAME=gpt-3.5-turbo  # 可选，默认gpt-3.5-turbo
```

### 文件支持

- **支持格式**: PDF, DOCX, TXT, MD, CSV, JSON
- **文件大小限制**: 10MB
- **编码**: 统一使用 UTF-8

### 性能参数

- **文档分块大小**: 1000 字符
- **分块重叠**: 200 字符
- **相似性搜索结果数**: 4 个
- **LLM 温度**: 0.7
- **最大令牌数**: 2000
- **请求超时**: 60 秒
- **最大重试次数**: 3 次

## 状态管理

### 前端状态

- `hasKnowledgeBase`: 是否有知识库
- `messages`: 聊天消息列表
- `sessionId`: 会话 ID
- `loading`: 加载状态

### 后端状态

- `globalVectorStore`: 全局向量存储实例
- `sessionMemories`: 会话记忆映射表

## 错误处理

### 常见错误类型

1. **API 密钥错误**: 检查环境变量配置
2. **文件格式不支持**: 确认文件类型在支持列表中
3. **文件过大**: 检查文件大小是否超过 10MB
4. **向量存储为空**: 确认文档已成功上传和处理
5. **会话过期**: 自动清理机制会处理过期会话

### 错误恢复机制

- 向量存储查询失败时自动回退到通用模型
- 文件处理失败时跳过该文件继续处理其他文件
- API 请求失败时进行重试

## 维护注意事项

### 1. 不要随意修改的部分

- 文档分块配置（可能影响检索效果）
- 向量存储的全局实例管理
- 会话记忆的清理机制
- API 重试和超时配置

### 2. 可以安全修改的部分

- 提示模板内容
- 文件大小限制
- 支持的文件类型
- UI 显示文本

### 3. 修改时需要注意的地方

- 修改嵌入模型时要清空现有向量存储
- 修改分块配置时需要重新处理所有文档
- 修改会话配置时要考虑现有会话的兼容性

### 4. 测试检查点

- 文档上传和处理是否正常
- 向量搜索是否返回相关结果
- 会话记忆是否正确保存和恢复
- 错误情况下的回退机制是否工作

## 性能优化建议

1. **向量存储优化**: 考虑使用持久化存储替代内存存储
2. **文档处理优化**: 大文件可以考虑分批处理
3. **缓存优化**: 对频繁查询的结果进行缓存
4. **并发控制**: 限制同时处理的文件数量

## 版本历史

- **v1.0**: 基础功能实现，支持文档上传和对话
- **v1.1**: 添加会话记忆功能
- **v1.2**: 优化错误处理和状态管理
- **v1.3**: 改进向量存储状态检查和清空逻辑

---

**重要提醒**: 修改任何核心功能前，请先备份当前代码，并在测试环境中验证修改的影响。
