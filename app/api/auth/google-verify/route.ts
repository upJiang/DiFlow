import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateAccessToken } from "@/lib/auth";

/**
 * Base64 URL解码函数，支持UTF-8编码
 * @param str Base64编码的字符串
 * @returns 解码后的字符串
 */
function base64UrlDecode(str: string): string {
  try {
    // 替换URL安全的base64字符
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");

    // 添加必要的填充
    while (base64.length % 4) {
      base64 += "=";
    }

    // 在Node.js环境中使用Buffer进行解码
    if (typeof window === "undefined") {
      return Buffer.from(base64, "base64").toString("utf-8");
    } else {
      // 在浏览器环境中的后备方案
      const decoded = atob(base64);
      return decodeURIComponent(escape(decoded));
    }
  } catch (error) {
    console.error("Base64解码失败:", error);
    throw new Error("Invalid base64 encoding");
  }
}

/**
 * 解码Google JWT令牌
 * @param token Google JWT令牌
 * @returns 用户信息对象
 */
function decodeGoogleJWT(token: string) {
  try {
    // 分割JWT token
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format");
    }

    // 解码payload
    const decodedPayload = base64UrlDecode(parts[1]);
    const userInfo = JSON.parse(decodedPayload);

    console.log("解码的Google用户信息:", {
      email: userInfo.email,
      name: userInfo.name,
      given_name: userInfo.given_name,
      family_name: userInfo.family_name,
      picture: userInfo.picture,
      iss: userInfo.iss,
      aud: userInfo.aud,
      exp: userInfo.exp,
    });

    // 验证JWT的基本有效性
    if (!userInfo.email || !userInfo.iss || !userInfo.aud) {
      throw new Error("JWT missing required fields");
    }

    // 验证issuer
    if (
      userInfo.iss !== "https://accounts.google.com" &&
      userInfo.iss !== "accounts.google.com"
    ) {
      throw new Error("Invalid JWT issuer");
    }

    // 验证audience (client_id)
    const expectedClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (userInfo.aud !== expectedClientId) {
      throw new Error("Invalid JWT audience");
    }

    // 验证是否过期
    const currentTime = Math.floor(Date.now() / 1000);
    if (userInfo.exp && userInfo.exp < currentTime) {
      throw new Error("JWT has expired");
    }

    return userInfo;
  } catch (error) {
    console.error("JWT解码失败:", error);
    throw new Error("Invalid JWT token");
  }
}

/**
 * 验证Google JWT并创建用户会话
 * @param request NextRequest对象
 * @returns 验证结果响应
 */
export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json();

    if (!credential) {
      return NextResponse.json({ error: "缺少Google凭证" }, { status: 400 });
    }

    console.log("开始验证Google JWT token");

    // 解码并验证Google JWT
    const googleUser = decodeGoogleJWT(credential);

    // 构建用户名，优先使用name，其次使用given_name + family_name
    let userName = googleUser.name;
    if (!userName && (googleUser.given_name || googleUser.family_name)) {
      userName = `${googleUser.family_name || ""}${
        googleUser.given_name || ""
      }`.trim();
    }
    if (!userName) {
      userName = googleUser.email.split("@")[0];
    }

    console.log("处理后的用户信息:", {
      email: googleUser.email,
      name: userName,
      picture: googleUser.picture,
    });

    // 查找或创建用户
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      console.log("创建新用户:", googleUser.email);
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: userName,
          image: googleUser.picture || null,
        },
      });
    } else {
      console.log("更新现有用户信息:", googleUser.email);
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: userName || user.name,
          image: googleUser.picture || user.image,
        },
      });
    }

    // 生成应用JWT令牌
    const jwt = generateAccessToken(user);
    console.log("生成应用JWT令牌成功，用户ID:", user.id);

    // 创建响应并设置cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      },
    });

    // 设置认证cookie
    response.cookies.set("auth-token", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7天
      path: "/",
    });

    console.log("Google登录验证完成成功！");
    return response;
  } catch (error: any) {
    console.error("Google JWT验证失败:", {
      message: error.message,
      stack: error.stack?.split("\n").slice(0, 3).join("\n"),
    });

    return NextResponse.json(
      {
        error: error.message || "Google登录验证失败",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 400 }
    );
  }
}
