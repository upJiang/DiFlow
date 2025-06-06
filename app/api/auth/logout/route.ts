import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);

    if (session) {
      // 从数据库删除会话记录
      try {
        await prisma.session.deleteMany({
          where: {
            userId: session.userId,
          },
        });
      } catch (dbError) {
        console.error("删除会话记录失败:", dbError);
        // 即使数据库操作失败，也继续清除cookie
      }
    }

    // 创建响应并清除cookie
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // 清除会话cookie
    response.cookies.set("session-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // 立即过期
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
