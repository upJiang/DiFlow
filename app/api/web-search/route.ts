import { NextRequest, NextResponse } from "next/server";
import {
  getAnswerFromWebSearchWithContext,
  ChatMessage,
} from "@/lib/langchain/webSearchService";

/**
 * POST API route for web search with context
 * @param {NextRequest} request - The request object
 * @returns {Promise<NextResponse>} The response object
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const {
      query,
      conversationHistory = [],
    }: {
      query: string;
      conversationHistory?: ChatMessage[];
    } = await request.json();

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: "查询不能为空" }, { status: 400 });
    }

    console.log(`收到网络搜索请求: "${query}"`);

    // 调用网络搜索服务
    const result = await getAnswerFromWebSearchWithContext(
      query,
      conversationHistory
    );

    return NextResponse.json({
      success: true,
      data: {
        response: result.answer,
        searchResults: result.searchResults,
        usedWebSearch: true,
      },
    });
  } catch (error: unknown) {
    console.error("网络搜索API错误:", error);
    const errorMessage =
      error instanceof Error ? error.message : "网络搜索失败";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
