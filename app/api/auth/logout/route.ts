import { NextRequest, NextResponse } from "next/server";

/**
 * 处理用户退出登录
 * @param request - Next.js请求对象
 * @returns 退出登录响应
 */
export async function POST(request: NextRequest) {
  try {
    // 创建响应
    const response = NextResponse.json({
      success: true,
      message: "退出登录成功",
    });

    // 清除认证cookie
    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: -1, // 立即过期
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("退出登录错误:", error);
    return NextResponse.json(
      { success: false, message: "退出登录失败" },
      { status: 500 }
    );
  }
}
