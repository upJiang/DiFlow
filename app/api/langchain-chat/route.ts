import { NextRequest, NextResponse } from "next/server";
import { processQuery, QueryParams } from "@/lib/langchain/queryService";
import { processMultipleDocuments } from "@/lib/langchain/documentLoader";
import {
  addDocumentsToVectorStore,
  isVectorStoreEmpty,
} from "@/lib/langchain/vectorStore";
import { getSessionMemory, getSessionStats } from "@/lib/langchain/memory";
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

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    const body = await req.json();
    const {
      messages,
      files,
      sessionId = "default",
      useVectorStore = true,
      temperature = 0.7,
    } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        {
          error: "没有提供消息",
        },
        { status: 400 }
      );
    }

    // 获取最新的用户消息
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== "user") {
      return NextResponse.json(
        {
          error: "最后一条消息必须是用户消息",
        },
        { status: 400 }
      );
    }

    let processedDocuments = null;
    let vectorStoreUsed = false;

    // 如果有文件上传，处理文档
    if (files && files.length > 0) {
      console.log(`处理 ${files.length} 个上传的文件`);

      try {
        processedDocuments = await processMultipleDocuments(files);

        if (processedDocuments && processedDocuments.length > 0) {
          const totalChunks = await addDocumentsToVectorStore(
            processedDocuments
          );
          console.log(`成功向量化 ${totalChunks} 个文档块`);
          vectorStoreUsed = true;
        }
      } catch (error) {
        console.error("文档处理失败:", error);
        return NextResponse.json(
          {
            error: "文档处理失败，请检查文件格式",
          },
          { status: 400 }
        );
      }
    }

    // 检查是否有向量存储可用
    const hasVectorStore = !(await isVectorStoreEmpty());

    // 准备查询参数
    const queryParams: QueryParams = {
      question: lastMessage.content,
      sessionId,
      useVectorStore: useVectorStore && hasVectorStore,
      temperature,
      maxTokens: 2000,
      conversationHistory: messages.slice(0, -1), // 排除最后一条消息，因为它是当前查询
    };

    console.log("执行查询:", {
      sessionId,
      useVectorStore: queryParams.useVectorStore,
      hasVectorStore,
      messageCount: messages.length,
    });

    // 执行查询
    const result = await processQuery(queryParams);

    // 获取会话内存统计
    const stats = await getSessionStats(sessionId);

    // 返回结果
    return NextResponse.json({
      success: true,
      data: {
        response: result.response,
        sources: result.sources || [],
        usedVectorStore: result.usedVectorStore || false,
        sessionId,
        processedDocuments: processedDocuments
          ? {
              count: processedDocuments.length,
              totalChunks: processedDocuments.reduce(
                (sum, doc) => sum + doc.chunks.length,
                0
              ),
            }
          : null,
        memoryStats: {
          messageCount: stats.messageCount,
          sessionId,
        },
        metadata: {
          timestamp: new Date().toISOString(),
          vectorStoreAvailable: hasVectorStore,
          temperature,
          model: "deepseek-chat",
        },
      },
    });
  } catch (error) {
    console.error("LangChain聊天API错误:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "内部服务器错误",
        details: process.env.NODE_ENV === "development" ? error : undefined,
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
