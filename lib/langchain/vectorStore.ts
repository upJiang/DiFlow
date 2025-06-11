import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import { createEmbeddingModel } from "./embeddings";
import { ProcessedDocument } from "./documentLoader";

// 全局向量存储实例
let globalVectorStore: MemoryVectorStore | null = null;

/**
 * 创建或获取向量存储实例
 * @returns 向量存储实例
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
 * @param documents 处理后的文档列表
 * @returns 添加的文档数量
 */
export async function addDocumentsToVectorStore(
  documents: ProcessedDocument[]
): Promise<number> {
  if (!documents || documents.length === 0) {
    throw new Error("没有提供文档进行向量化");
  }

  const vectorStore = await getVectorStore();
  let totalChunks = 0;

  for (const doc of documents) {
    try {
      // 添加文档块到向量存储
      await vectorStore.addDocuments(doc.chunks);
      totalChunks += doc.chunks.length;
      console.log(
        `文档 ${doc.id} 的 ${doc.chunks.length} 个块已添加到向量存储`
      );
    } catch (error) {
      console.error(`添加文档 ${doc.id} 到向量存储失败:`, error);
    }
  }

  console.log(`总共添加了 ${totalChunks} 个文档块到向量存储`);
  return totalChunks;
}

/**
 * 相似性搜索
 * @param query 查询文本
 * @param k 返回结果数量
 * @returns 相似文档列表
 */
export async function similaritySearch(
  query: string,
  k: number = 4
): Promise<Document[]> {
  if (!query || query.trim().length === 0) {
    throw new Error("查询内容不能为空");
  }

  const vectorStore = await getVectorStore();

  try {
    const results = await vectorStore.similaritySearch(query, k);
    console.log(`相似性搜索返回 ${results.length} 个结果`);
    return results;
  } catch (error) {
    console.error("相似性搜索失败:", error);
    throw error;
  }
}

/**
 * 带分数的相似性搜索
 * @param query 查询文本
 * @param k 返回结果数量
 * @returns 相似文档和分数列表
 */
export async function similaritySearchWithScore(
  query: string,
  k: number = 4
): Promise<Array<[Document, number]>> {
  if (!query || query.trim().length === 0) {
    throw new Error("查询内容不能为空");
  }

  const vectorStore = await getVectorStore();

  try {
    const results = await vectorStore.similaritySearchWithScore(query, k);
    console.log(`带分数的相似性搜索返回 ${results.length} 个结果`);
    return results;
  } catch (error) {
    console.error("带分数的相似性搜索失败:", error);
    throw error;
  }
}

/**
 * 清空向量存储
 */
export function clearVectorStore(): void {
  globalVectorStore = null;
  console.log("向量存储已清空");
}

/**
 * 获取向量存储中的文档数量
 * @returns 文档数量
 */
export async function getVectorStoreSize(): Promise<number> {
  const vectorStore = await getVectorStore();

  // MemoryVectorStore 没有直接的大小方法，我们通过搜索来估算
  try {
    const testSearch = await vectorStore.similaritySearch("test", 1000);
    return testSearch.length;
  } catch {
    return 0;
  }
}

/**
 * 从文档块创建向量存储
 * @param documents 文档块列表
 * @returns 新的向量存储实例
 */
export async function createVectorStoreFromDocuments(
  documents: Document[]
): Promise<MemoryVectorStore> {
  if (!documents || documents.length === 0) {
    throw new Error("没有提供文档创建向量存储");
  }

  const embeddings = createEmbeddingModel();
  const vectorStore = await MemoryVectorStore.fromDocuments(
    documents,
    embeddings
  );

  console.log(`从 ${documents.length} 个文档创建了新的向量存储`);
  return vectorStore;
}

/**
 * 检查向量存储是否为空
 * @returns 是否为空
 */
export async function isVectorStoreEmpty(): Promise<boolean> {
  if (!globalVectorStore) {
    return true;
  }

  const size = await getVectorStoreSize();
  return size === 0;
}
