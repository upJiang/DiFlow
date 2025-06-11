import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";

export interface ProcessedDocument {
  id: string;
  content: string;
  metadata: Record<string, any>;
  chunks: Document[];
}

/**
 * 文本分割器配置
 */
const DEFAULT_CHUNK_SIZE = 1000;
const DEFAULT_CHUNK_OVERLAP = 200;

/**
 * 创建文本分割器
 * @param chunkSize 分块大小
 * @param chunkOverlap 分块重叠
 * @returns 文本分割器
 */
export function createTextSplitter(
  chunkSize = DEFAULT_CHUNK_SIZE,
  chunkOverlap = DEFAULT_CHUNK_OVERLAP
) {
  return new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
    separators: ["\n\n", "\n", "。", "！", "？", "；", " ", ""],
  });
}

/**
 * 处理文本内容，生成文档块
 * @param content 文本内容
 * @param metadata 元数据
 * @param id 文档ID
 * @returns 处理后的文档
 */
export async function processTextContent(
  content: string,
  metadata: Record<string, any> = {},
  id: string
): Promise<ProcessedDocument> {
  if (!content || content.trim().length === 0) {
    throw new Error("文档内容不能为空");
  }

  // 创建文本分割器
  const textSplitter = createTextSplitter();

  // 创建原始文档
  const document = new Document({
    pageContent: content,
    metadata: {
      ...metadata,
      id,
      timestamp: new Date().toISOString(),
    },
  });

  // 分割文档
  const chunks = await textSplitter.splitDocuments([document]);

  console.log(`文档 ${id} 被分割为 ${chunks.length} 个块`);

  return {
    id,
    content,
    metadata: document.metadata,
    chunks,
  };
}

/**
 * 根据文件扩展名确定文件类型
 * @param filename 文件名
 * @returns 文件类型
 */
export function getFileType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "txt":
      return "text/plain";
    case "md":
      return "text/markdown";
    case "pdf":
      return "application/pdf";
    case "doc":
    case "docx":
      return "application/msword";
    case "json":
      return "application/json";
    default:
      return "text/plain";
  }
}

/**
 * 从Base64字符串处理文件内容
 * @param base64Content Base64编码的文件内容
 * @param filename 文件名
 * @param id 文档ID
 * @returns 处理后的文档
 */
export async function processFileFromBase64(
  base64Content: string,
  filename: string,
  id: string
): Promise<ProcessedDocument> {
  try {
    // 解码Base64内容
    const buffer = Buffer.from(base64Content, "base64");
    const content = buffer.toString("utf-8");

    const metadata = {
      filename,
      fileType: getFileType(filename),
      fileSize: buffer.length,
      uploadTime: new Date().toISOString(),
    };

    return await processTextContent(content, metadata, id);
  } catch (error) {
    console.error(`处理文件 ${filename} 失败:`, error);
    throw new Error(`无法处理文件 ${filename}: ${(error as Error).message}`);
  }
}

/**
 * 批处理多个文档
 * @param documents 文档列表
 * @returns 处理后的文档列表
 */
export async function processMultipleDocuments(
  documents: Array<{
    content?: string;
    base64Content?: string;
    filename?: string;
    id: string;
    metadata?: Record<string, any>;
  }>
): Promise<ProcessedDocument[]> {
  const processedDocs: ProcessedDocument[] = [];

  for (const doc of documents) {
    try {
      let processedDoc: ProcessedDocument;

      if (doc.base64Content && doc.filename) {
        // 处理Base64文件
        processedDoc = await processFileFromBase64(
          doc.base64Content,
          doc.filename,
          doc.id
        );
      } else if (doc.content) {
        // 处理纯文本
        processedDoc = await processTextContent(
          doc.content,
          doc.metadata || {},
          doc.id
        );
      } else {
        console.warn(`跳过无效文档: ${doc.id}`);
        continue;
      }

      processedDocs.push(processedDoc);
    } catch (error) {
      console.error(`处理文档 ${doc.id} 失败:`, error);
      // 继续处理其他文档，不中断整个流程
    }
  }

  return processedDocs;
}
