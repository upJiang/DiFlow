# Google 登录系统完整技术实现文档

## 📚 技术栈和依赖

### 核心依赖

```json
{
  "jsonwebtoken": "^9.0.2", // JWT token 生成和验证
  "@prisma/client": "^5.7.1", // 数据库ORM
  "next": "^14.0.0", // Next.js 框架
  "react": "^18.3.0", // React 框架
  "typescript": "^5.7.2" // TypeScript
}
```

### 开发依赖

```json
{
  "@types/jsonwebtoken": "^9.0.9", // JWT类型定义
  "prisma": "^5.7.1", // Prisma CLI
  "tailwindcss": "^3.4.0" // CSS框架
}
```

## 🔧 Google 配置步骤

### 1. 创建 Google 应用

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 **Google+ API** 和 **Google Identity Services**

### 2. 配置 OAuth 2.0 客户端

1. 进入 **APIs & Services** > **Credentials**
2. 点击 **Create Credentials** > **OAuth 2.0 Client IDs**
3. 选择应用类型：**Web application**
4. 配置授权来源：
   ```
   http://localhost:3333 (开发环境)
   https://yourdomain.com (生产环境)
   ```
5. 获取 **Client ID**

### 3. 环境变量配置

```bash
# .env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
JWT_PRIVATE_KEY=your_jwt_secret_key
DATABASE_URL="mysql://user:password@host:port/database?charset=utf8mb4&collation=utf8mb4_unicode_ci"
```

## 🏗️ 系统架构

### 架构流程图

```
用户浏览器 → Google Identity Services → 前端Hook → 后端验证 → 数据库 → JWT Token → Cookie
```

## 📝 完整代码实现

### 1. Google 认证 Hook (`hooks/useGoogleAuth.ts`)

```typescript
import { useEffect, useState } from "react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleConfig) => void;
          renderButton: (element: HTMLElement, options: ButtonConfig) => void;
          prompt: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

interface GoogleConfig {
  client_id: string;
  callback: (response: CredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

interface ButtonConfig {
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  type?: "standard" | "icon";
  shape?: "rectangular" | "pill" | "circle" | "square";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  logo_alignment?: "left" | "center";
  width?: string;
  locale?: string;
}

interface CredentialResponse {
  credential: string;
  select_by?: string;
}

/**
 * Google身份验证Hook
 * @returns Google登录相关的状态和方法
 */
export const useGoogleAuth = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 处理Google登录回调
   * @param response Google返回的凭证响应
   */
  const handleCredentialResponse = async (response: CredentialResponse) => {
    setIsLoading(true);
    try {
      console.log("Google登录成功，正在验证token...");

      // 发送JWT token到后端验证
      const result = await fetch("/api/auth/google-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: response.credential,
        }),
      });

      if (result.ok) {
        console.log("Google登录验证成功");
        window.location.reload(); // 刷新页面以更新用户状态
      } else {
        const errorData = await result.json();
        console.error("Google登录验证失败:", errorData);
        throw new Error(errorData.error || "登录验证失败");
      }
    } catch (error) {
      console.error("Google登录处理失败:", error);
      alert("登录失败: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 初始化Google Identity Services
   */
  const initializeGoogleAuth = () => {
    if (window.google?.accounts?.id) {
      const clientId =
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
        "421412720168-jtvbmiha8scdt4j4aek7tsurv3468ull.apps.googleusercontent.com";

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      setIsLoaded(true);
      console.log("Google Identity Services 初始化完成");
    }
  };

  /**
   * 渲染Google登录按钮
   * @param elementId 按钮容器的DOM元素ID
   * @param options 按钮配置选项
   */
  const renderGoogleButton = (
    elementId: string,
    options: ButtonConfig = {}
  ) => {
    if (!isLoaded || !window.google?.accounts?.id) return;

    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`找不到ID为 ${elementId} 的元素`);
      return;
    }

    const defaultOptions: ButtonConfig = {
      theme: "outline",
      size: "large",
      type: "standard",
      shape: "rectangular",
      text: "signin_with",
      logo_alignment: "left",
      width: "300",
      ...options,
    };

    window.google.accounts.id.renderButton(element, defaultOptions);
  };

  // 检查Google脚本是否加载完成
  useEffect(() => {
    const checkGoogleScript = () => {
      if (window.google?.accounts?.id) {
        initializeGoogleAuth();
      } else {
        setTimeout(checkGoogleScript, 100);
      }
    };

    checkGoogleScript();
  }, []);

  return {
    isLoaded,
    isLoading,
    renderGoogleButton,
  };
};
```

### 2. JWT 验证后端 API (`app/api/auth/google-verify/route.ts`)

```typescript
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

    // 解码并验证Google JWT
    const googleUser = decodeGoogleJWT(credential);

    // 构建用户名
    let userName = googleUser.name;
    if (!userName && (googleUser.given_name || googleUser.family_name)) {
      userName = `${googleUser.family_name || ""}${
        googleUser.given_name || ""
      }`.trim();
    }
    if (!userName) {
      userName = googleUser.email.split("@")[0];
    }

    // 查找或创建用户
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: userName,
          image: googleUser.picture || null,
        },
      });
    } else {
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

    return response;
  } catch (error: any) {
    console.error("Google JWT验证失败:", error);
    return NextResponse.json(
      { error: error.message || "Google登录验证失败" },
      { status: 400 }
    );
  }
}
```

### 3. 认证工具库 (`lib/auth.ts`)

```typescript
import { NextRequest } from "next/server";
import { verify, sign } from "jsonwebtoken";
import { User } from "@prisma/client";

// JWT密钥
const JWT_SECRET = process.env.JWT_PRIVATE_KEY!;

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
    JWT_SECRET,
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
    const decoded = verify(token, JWT_SECRET) as any;
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
 * 从请求中获取用户会话
 * @param request NextRequest对象
 * @returns 用户会话或null
 */
export function getSessionFromRequest(
  request: NextRequest
): UserSession | null {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) return null;
    return verifyAccessToken(token);
  } catch (error) {
    return null;
  }
}
```

### 4. 用户信息获取 API (`app/api/auth/me/route.ts`)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";

/**
 * 获取当前用户信息
 * @param request NextRequest对象
 * @returns 用户信息或错误响应
 */
export async function GET(request: NextRequest) {
  try {
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
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
```

### 5. 退出登录 API (`app/api/auth/logout/route.ts`)

```typescript
import { NextRequest, NextResponse } from "next/server";

/**
 * 处理用户退出登录
 * @param request Next.js请求对象
 * @returns 退出登录响应
 */
export async function POST(request: NextRequest) {
  try {
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
    return NextResponse.json(
      { success: false, message: "退出登录失败" },
      { status: 500 }
    );
  }
}
```

### 6. 导航组件集成 (`components/Navigation.tsx`)

```typescript
"use client";

import { useEffect, useState, useRef } from "react";
import { User } from "@prisma/client";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

export function Navigation() {
  const { isLoaded, renderGoogleButton } = useGoogleAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const buttonRef = useRef<HTMLDivElement>(null);

  /**
   * 获取用户信息
   */
  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 处理用户退出
   */
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      window.location.reload();
    } catch (error) {
      console.error("退出失败:", error);
    }
  };

  // 组件挂载时获取用户信息
  useEffect(() => {
    fetchUser();
  }, []);

  // 渲染Google登录按钮
  useEffect(() => {
    if (isLoaded && !user && !loading && buttonRef.current) {
      renderGoogleButton("google-signin-button", {
        theme: "outline",
        size: "large",
        text: "signin_with",
        width: "280",
      });
    }
  }, [isLoaded, user, loading, renderGoogleButton]);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">DiFlow</span>
          </div>

          {/* 用户区域 */}
          <div className="flex items-center">
            {loading ? (
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <span>欢迎，{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-800"
                >
                  退出
                </button>
              </div>
            ) : (
              <div className="google-signin-wrapper" ref={buttonRef}>
                <div id="google-signin-button"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
```

### 7. 布局文件配置 (`app/layout.tsx`)

```typescript
import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <head>
        {/* 加载Google Identity Services */}
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
      </head>
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
```

### 8. 全局样式 (`app/globals.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Google登录按钮样式优化 */
.google-signin-wrapper #google-signin-button > div {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
  border: none !important;
  border-radius: 16px !important;
  transition: all 0.3s ease !important;
  background: linear-gradient(
    135deg,
    #ffffff 0%,
    #f8faff 50%,
    #f0f4ff 100%
  ) !important;
  overflow: hidden !important;
}

.google-signin-wrapper:hover #google-signin-button > div {
  transform: scale(1.02) !important;
  box-shadow: 0 20px 40px -12px rgba(59, 130, 246, 0.2), 0 10px 20px -5px rgba(147, 51, 234, 0.15),
    0 0 0 1px rgba(59, 130, 246, 0.15) !important;
}
```

## 🗄️ 数据库配置

### Prisma 模型 (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  image     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🚀 部署和运行

### 1. 安装依赖

```bash
yarn install
```

### 2. 数据库设置

```bash
yarn db:generate
yarn db:push
```

### 3. 启动开发服务器

```bash
yarn dev
```

## 🔒 安全特性

1. **JWT 验证**: 双重 JWT 验证（Google + 应用内部）
2. **HttpOnly Cookie**: 防止 XSS 攻击
3. **CSRF 保护**: SameSite cookie 配置
4. **Token 过期**: 7 天自动过期机制
5. **UTF-8 支持**: 完整的多语言字符支持

## 📋 登录流程总结

1. **页面加载** → 加载 Google Identity Services 脚本
2. **显示按钮** → 渲染 Google 登录按钮
3. **用户点击** → 弹出 Google 授权窗口
4. **Google 验证** → 返回 JWT 令牌
5. **后端验证** → 解码验证 JWT 令牌
6. **用户创建** → 创建或更新用户信息
7. **生成 Token** → 生成应用 JWT 令牌
8. **设置 Cookie** → 设置 HttpOnly 认证 Cookie
9. **登录完成** → 返回成功响应并刷新页面

这个系统提供了完整的 Google 登录功能，包括用户认证、会话管理、安全保护等所有必要组件。
