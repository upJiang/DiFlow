import { NextRequest, NextResponse } from "next/server";
import { processMultipleDocuments } from "@/lib/langchain/documentLoader";
import { addDocumentsToVectorStore } from "@/lib/langchain/vectorStore";
import jwt from "jsonwebtoken";

interface JWTPayload {
  id: string;
  email: string;
  name: string;
  image?: string;
}

/**
 * 从请求中获取用户认证信息
 */
function getUserFromRequest(request: NextRequest): JWTPayload | null {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_PRIVATE_KEY!
    ) as JWTPayload;

    return decoded;
  } catch (error) {
    console.error("获取用户认证失败:", error);
    return null;
  }
}

/**
 * 上传并处理文档，构建向量存储
 */
export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    const formData = await req.formData();
    const sessionId = formData.get("sessionId") as string;

    // 获取上传的文件
    const files: Array<{
      id: string;
      base64Content: string;
      filename: string;
      metadata?: Record<string, any>;
    }> = [];

    // 使用Array.from来处理FormData的entries
    const formEntries = Array.from(formData.entries());

    for (const [key, value] of formEntries) {
      if (key.startsWith("file_") && value instanceof File) {
        const fileContent = await value.arrayBuffer();
        const base64Content = Buffer.from(fileContent).toString("base64");

        files.push({
          id: crypto.randomUUID(),
          base64Content,
          filename: value.name,
          metadata: {
            type: value.type,
            size: value.size,
            lastModified: value.lastModified,
          },
        });
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, message: "没有找到有效文件" },
        { status: 400 }
      );
    }

    console.log(`处理 ${files.length} 个上传文件`);

    // 处理文档
    const processedDocuments = await processMultipleDocuments(files);

    if (!processedDocuments || processedDocuments.length === 0) {
      return NextResponse.json(
        { success: false, message: "文档处理失败" },
        { status: 400 }
      );
    }

    // 添加到向量存储
    const totalChunks = await addDocumentsToVectorStore(processedDocuments);

    console.log(
      `成功处理 ${processedDocuments.length} 个文档，生成 ${totalChunks} 个向量块`
    );

    return NextResponse.json({
      success: true,
      message: "文档上传成功",
      documents: processedDocuments.length,
      chunks: totalChunks,
      sessionId,
    });
  } catch (error) {
    console.error("文档上传API错误:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "文档处理失败",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}
