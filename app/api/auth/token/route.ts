import { NextRequest, NextResponse } from "next/server";

/**
 * 获取当前用户的认证token
 * @param request NextRequest对象
 * @returns token或错误响应
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "未找到认证令牌" }, { status: 401 });
    }

    return NextResponse.json({ token });
  } catch (error) {
    console.error("获取token失败:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
