import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { clearMemory } from "@/lib/langchain/memory";

interface JWTPayload {
  id: string;
  email: string;
  name: string;
  image?: string;
}

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
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "会话ID不能为空" },
        { status: 400 }
      );
    }

    // 清除会话记忆
    clearMemory(sessionId);

    return NextResponse.json({
      success: true,
      message: "会话记忆已清除",
    });
  } catch (error) {
    console.error("清除会话记忆失败:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "内部服务器错误",
      },
      { status: 500 }
    );
  }
}
