import { NextResponse } from "next/server";
import { getAnswerFromWebSearch } from "@/lib/webSearchService";

/**
 * POST /api/web-search
 * 处理网络搜索请求
 */
export async function POST(request) {
  try {
    const { query } = await request.json();

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
  } catch (error) {
    console.error("网络搜索API错误:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "网络搜索失败",
      },
      { status: 500 }
    );
  }
}
