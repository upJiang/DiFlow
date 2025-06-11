import { NextRequest } from "next/server";
import { verify, sign } from "jsonwebtoken";
import { User } from "@prisma/client";

// JWT密钥
const JWT_SECRET = process.env.JWT_PRIVATE_KEY;

if (!JWT_SECRET) {
  console.error("JWT_PRIVATE_KEY 环境变量未设置");
  throw new Error("JWT_PRIVATE_KEY 环境变量未设置");
}

// 确保JWT_SECRET是字符串类型
const JWT_KEY = JWT_SECRET as string;

// 用户会话接口
export interface UserSession {
  userId: string;
  email: string;
  name?: string;
  image?: string;
}

/**
 * 生成JWT访问令牌
 * @param user 用户信息
 * @returns JWT token
 */
export function generateAccessToken(user: User): string {
  return sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
    },
    JWT_KEY,
    { expiresIn: "7d" } // 7天过期
  );
}

/**
 * 验证JWT访问令牌
 * @param token JWT token
 * @returns 解析后的用户会话或null
 */
export function verifyAccessToken(token: string): UserSession | null {
  try {
    const decoded = verify(token, JWT_KEY) as any;
    return {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      image: decoded.image,
    };
  } catch (error) {
    return null;
  }
}

/**
 * 从请求中获取用户会话（不强制要求认证）
 * @param request NextRequest对象
 * @returns 用户会话或null
 */
export function getSessionFromRequest(
  request: NextRequest
): UserSession | null {
  try {
    // 从cookie中获取token
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return null;
    }

    return verifyAccessToken(token);
  } catch (error) {
    console.error("获取用户会话失败:", error);
    return null;
  }
}

/**
 * 强制要求用户认证，如果未认证则抛出错误
 * @param request NextRequest对象
 * @returns 用户会话
 * @throws 如果未认证则抛出错误
 */
export function requireAuth(request: NextRequest): UserSession {
  const session = getSessionFromRequest(request);

  if (!session) {
    const error = new Error("Authentication required");
    (error as any).statusCode = 401;
    throw error;
  }

  return session;
}

// NextAuth配置（用于兼容）
export const authOptions = {
  providers: [],
  callbacks: {
    async session({ session, token }: any) {
      return session;
    },
    async jwt({ token, user }: any) {
      return token;
    },
  },
  secret: JWT_KEY,
};
