"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NotesPage from "./components/NotesPage";

/**
 * 随手记主页面
 */
export default function Notes() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const router = useRouter();

  /**
   * 检查用户认证状态
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("认证检查失败:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [router]);

  // 自动消失定时器
  useEffect(() => {
    if (showLoginPrompt) {
      const timer = setTimeout(() => {
        setShowLoginPrompt(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showLoginPrompt]);

  /**
   * 处理需要登录的操作
   */
  const handleAuthRequired = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return false;
    }
    return true;
  };

  /**
   * 处理登录提示弹窗关闭
   */
  const handleCloseLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  // 认证状态检查中
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">检查登录状态...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-gradient-to-br from-blue-50 via-white to-purple-50 relative"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <div>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          }
        >
          <NotesPage
            isAuthenticated={isAuthenticated}
            onAuthRequired={handleAuthRequired}
          />
        </Suspense>
      </div>

      {/* 登录提示弹窗 */}
      {showLoginPrompt && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-sm transform transition-all duration-500 ease-out ${
              showLoginPrompt
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }`}
            style={{
              animation: showLoginPrompt
                ? "slideInFromRight 0.5s ease-out forwards"
                : "slideOutToRight 0.3s ease-in forwards",
            }}
          >
            {/* 关闭按钮 */}
            <button
              onClick={handleCloseLoginPrompt}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* 通知内容 */}
            <div className="flex items-start space-x-3 pr-6">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  需要登录
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  请先登录您的账户，然后就可以开始记录笔记了
                </p>

                <button
                  onClick={() => {
                    handleCloseLoginPrompt();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm rounded-md hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                  去登录
                </button>
              </div>
            </div>

            {/* 进度条 */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 rounded-b-lg overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-b-lg"
                style={{
                  animation: "progressBar 3s linear forwards",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 添加动画样式 */}
      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOutToRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        @keyframes progressBar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
