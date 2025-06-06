"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Navigation() {
  const { isAuthenticated, user, signOut } = useAuth();
  const pathname = usePathname();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await signOut();
      console.log("退出成功");
    } catch (error) {
      console.error("退出出错:", error);
    }
  };

  const isActivePath = (path: string) => {
    return pathname === path || (path !== "/" && pathname.startsWith(path));
  };

  useEffect(() => {
    // 确保Google Identity Services已加载并且用户未登录
    if (!isAuthenticated && window.google && googleButtonRef.current) {
      console.log("初始化Google登录按钮");

      // 清空之前的按钮
      googleButtonRef.current.innerHTML = "";

      // 初始化Google Identity Services
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: async (response) => {
          try {
            console.log("收到Google凭据:", response);

            // 发送凭据到服务器
            const apiResponse = await fetch("/api/auth/google", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ credential: response.credential }),
            });

            if (apiResponse.ok) {
              const data = await apiResponse.json();
              console.log("登录成功:", data);
              window.location.reload(); // 刷新页面以更新状态
            } else {
              const error = await apiResponse.json();
              console.error("登录失败:", error);
            }
          } catch (error) {
            console.error("处理Google登录失败:", error);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // 渲染Google官方登录按钮
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
        width: "240",
      });
    }
  }, [isAuthenticated]);

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              DiFlow
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActivePath("/")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              对话
            </Link>
            <Link
              href="/workflow"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActivePath("/workflow")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              工作流
            </Link>
            <Link
              href="/tools"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActivePath("/tools")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              工具
            </Link>
            <Link
              href="/chat"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActivePath("/chat")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              聊天历史
            </Link>
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-gray-700">欢迎, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  退出
                </button>
              </div>
            ) : (
              <div ref={googleButtonRef} className="flex items-center">
                {/* Google按钮将在这里渲染 */}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
