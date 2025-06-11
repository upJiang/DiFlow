import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// 强制动态路由
export const dynamic = "force-dynamic";

interface JWTPayload {
  id: string;
  email: string;
  name: string;
  image?: string;
}

/**
 * 获取当前用户信息
 * @param request NextRequest对象
 * @returns 用户信息或错误响应
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_PRIVATE_KEY!
    ) as JWTPayload;

    return NextResponse.json({
      user: {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        image: decoded.image,
      },
    });
  } catch (error) {
    console.error("获取用户会话失败:", error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
