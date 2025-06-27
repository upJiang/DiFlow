import { NextRequest, NextResponse } from "next/server";
import { getAnswerFromWebSearch } from "@/lib/langchain/webSearchService";

/**
 * POST /api/web-search
 * 处理网络搜索请求
 * @param {NextRequest} request 请求对象
 * @returns {Promise<NextResponse>} 响应对象
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { query }: { query: string } = await request.json();

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "查询内容不能为空" },
        { status: 400 }
      );
    }

    console.log(`收到网络搜索请求: "${query}"`);

    // 调用网络搜索服务
    const result = await getAnswerFromWebSearch(query);

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
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
