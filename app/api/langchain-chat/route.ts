import { NextRequest, NextResponse } from "next/server";
import { processQuery, QueryParams } from "@/lib/langchain/queryService";
import { processMultipleDocuments } from "@/lib/langchain/documentLoader";
import {
  addDocumentsToVectorStore,
  isVectorStoreEmpty,
} from "@/lib/langchain/vectorStore";
import {
  getSessionMemory,
  getSessionStats,
  clearMemory,
} from "@/lib/langchain/memory";
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
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_PRIVATE_KEY;
    if (!secret) {
      throw new Error("JWT_PRIVATE_KEY not configured");
    }

    const decoded = jwt.verify(token, secret) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error("JWT验证失败:", error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "未授权访问" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // 检查是否是清除记忆的请求
    if (body.action === "clearMemory" && body.sessionId) {
      clearMemory(body.sessionId);
      return NextResponse.json({
        success: true,
        message: "会话记忆已清除",
      });
    }

    const { messages, files, sessionId, useVectorStore, temperature } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: "消息数组不能为空" },
        { status: 400 }
      );
    }

    // 处理文件上传（如果有）
    let processedDocuments = null;
    if (files && files.length > 0) {
      try {
        const documentsData = files.map((file: any, index: number) => ({
          id: `${sessionId}_file_${index}_${Date.now()}`,
          base64Content: file.content,
          filename: file.name,
          metadata: {
            type: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString(),
          },
        }));

        processedDocuments = await processMultipleDocuments(documentsData);

        // 添加到向量存储
        if (processedDocuments && processedDocuments.length > 0) {
          await addDocumentsToVectorStore(processedDocuments);
        }
      } catch (error) {
        console.error("文档处理失败:", error);
        return NextResponse.json(
          {
            success: false,
            error: `文档处理失败: ${
              error instanceof Error ? error.message : "未知错误"
            }`,
          },
          { status: 500 }
        );
      }
    }

    // 获取最后一条用户消息
    const lastUserMessage = messages
      .filter((msg: any) => msg.role === "user")
      .pop();

    if (!lastUserMessage) {
      return NextResponse.json(
        { success: false, error: "未找到用户消息" },
        { status: 400 }
      );
    }

    // 准备查询参数
    const queryParams = {
      question: lastUserMessage.content,
      sessionId: sessionId || "anonymous",
      useVectorStore: useVectorStore ?? true,
      temperature: temperature || 0.7,
      conversationHistory: messages.slice(-10), // 保留最近10条消息作为上下文
    };

    // 执行查询
    const result = await processQuery(queryParams);

    return NextResponse.json({
      success: true,
      data: {
        response: result.response,
        sources: result.sources || [],
        usedVectorStore: result.usedVectorStore || false,
        processedDocuments: processedDocuments
          ? {
              count: processedDocuments.length,
              totalChunks: processedDocuments.reduce(
                (sum, doc) => sum + doc.chunks.length,
                0
              ),
            }
          : null,
      },
    });
  } catch (error) {
    console.error("LangChain聊天API错误:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "内部服务器错误",
      },
      { status: 500 }
    );
  }
}

// 支持流式响应的GET方法
export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId") || "default";

    // 获取会话内存
    const stats = await getSessionStats(sessionId);

    // 检查向量存储状态
    const hasVectorStore = !(await isVectorStoreEmpty());

    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        messageCount: stats.messageCount,
        vectorStoreAvailable: hasVectorStore,
        lastActivity: new Date().toISOString(),
        user: user.email,
      },
    });
  } catch (error) {
    console.error("获取会话信息错误:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "内部服务器错误",
      },
      { status: 500 }
    );
  }
}
