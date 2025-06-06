"use client";

import { useState, useEffect, createContext, useContext } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  googleId: string;
}

interface AuthData {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

interface AuthStatus {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}

interface AuthContextType extends AuthStatus {
  signIn: () => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();

    // 添加超时机制，确保loading不会永远持续
    const timeout = setTimeout(() => {
      console.log("⏰ 认证检查超时，强制设置loading为false");
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  const checkAuthStatus = async () => {
    console.log("🔍 开始检查认证状态...");
    try {
      const response = await fetch("/api/auth/status", {
        credentials: "include",
      });

      console.log("📡 认证状态响应:", response.status, response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log("📊 认证数据:", data);
        if (data.isAuthenticated && data.user) {
          setUser(data.user);
        }
      }
    } catch (error) {
      console.error("❌ 检查认证状态失败:", error);
    } finally {
      console.log("✅ 认证状态检查完成，设置loading为false");
      setIsLoading(false);
    }
  };

  const signIn = async (): Promise<boolean> => {
    const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!CLIENT_ID) {
      console.error("Google Client ID not configured");
      return false;
    }

    const redirectUri = `${window.location.origin}/auth/callback`;
    const scope = "openid email profile";
    const responseType = "code";

    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `response_type=${responseType}&` +
      `access_type=offline&` +
      `prompt=consent`;

    // 使用重定向而不是弹窗
    window.location.href = authUrl;
    return true;
  };

  const signOut = async (): Promise<void> => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signOut,
  };
};

export const AuthProvider = AuthContext.Provider;
