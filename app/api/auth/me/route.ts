import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";

/**
 * 获取当前用户信息
 * @param request NextRequest对象
 * @returns 用户信息或错误响应
 */
export async function GET(request: NextRequest) {
  try {
    // 获取用户会话
    const session = getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: session.userId,
        email: session.email,
        name: session.name,
        image: session.image,
      },
    });
  } catch (error) {
    console.error("获取用户信息失败:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
