import { NextRequest, NextResponse } from "next/server";

// 强制动态路由
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // 从环境变量获取模型配置
    const models = [
      {
        id: "gpt-3.5-turbo",
        name: "GPT-3.5 Turbo",
        provider: "openai",
        description: "OpenAI的快速、经济的模型，适合日常对话",
      },
      {
        id: "gpt-4",
        name: "GPT-4",
        provider: "openai",
        description: "更强大的推理能力，适合复杂任务",
      },
      {
        id: "claude-3-sonnet",
        name: "Claude 3 Sonnet",
        provider: "anthropic",
        description: "Anthropic的平衡性能和速度的模型",
      },
    ];

    return NextResponse.json({ models });
  } catch (error: any) {
    console.error("获取模型列表错误:", error);

    if (error.statusCode) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json({ error: "获取模型列表失败" }, { status: 500 });
  }
}
