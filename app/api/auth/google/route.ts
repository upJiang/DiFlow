import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { generateSessionToken } from "@/lib/auth";
import { OAuth2Client } from "google-auth-library";

const prisma = new PrismaClient();

interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log("开始处理Google登录凭据");

    const { credential } = await request.json();

    if (!credential) {
      console.error("缺少Google凭据");
      return NextResponse.json({ error: "缺少Google凭据" }, { status: 400 });
    }

    console.log("已接收Google凭据");

    // 验证环境变量
    const googleClientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    if (!googleClientId) {
      console.error("缺少Google Client ID配置");
      return NextResponse.json({ error: "服务器配置错误" }, { status: 500 });
    }

    console.log("Google Client ID已配置");

    // 验证Google JWT凭据
    const client = new OAuth2Client(googleClientId);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      console.error("无效的Google凭据");
      return NextResponse.json({ error: "无效的Google凭据" }, { status: 400 });
    }

    console.log("Google凭据验证成功", { email: payload.email });

    const googleUser: GoogleUserInfo = {
      id: payload.sub!,
      email: payload.email!,
      name: payload.name!,
      picture: payload.picture,
    };

    // 查找或创建用户
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (user) {
      console.log("找到现有用户", { email: user.email });
      // 更新现有用户信息
      user = await prisma.user.update({
        where: { email: googleUser.email },
        data: {
          name: googleUser.name,
          image: googleUser.picture,
        },
      });
    } else {
      console.log("创建新用户", { email: googleUser.email });
      // 创建新用户
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          image: googleUser.picture,
          googleId: googleUser.id,
        },
      });
    }

    console.log("用户数据已保存/更新", { userId: user.id });

    // 生成会话令牌
    const sessionToken = generateSessionToken({
      id: user.id,
      email: user.email,
      name: user.name || googleUser.name,
    });

    console.log("已生成会话令牌");

    // 设置Cookie
    const response = NextResponse.json({
      message: "登录成功",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      },
    });

    response.cookies.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7天
      path: "/",
    });

    console.log("已设置会话Cookie");

    return response;
  } catch (error) {
    console.error("Google登录处理失败:", error);

    if (error instanceof Error) {
      if (
        error.message.includes("network") ||
        error.message.includes("timeout")
      ) {
        console.error("网络错误:", error.message);
        return NextResponse.json(
          { error: "网络连接失败，请检查网络设置或稍后重试" },
          { status: 503 }
        );
      }

      if (error.message.includes("Invalid token")) {
        console.error("令牌验证失败:", error.message);
        return NextResponse.json({ error: "令牌验证失败" }, { status: 400 });
      }
    }

    return NextResponse.json(
      { error: "登录失败，请稍后重试" },
      { status: 500 }
    );
  }
}
