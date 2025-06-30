"use client";

import { useState, useEffect } from "react";
import ChatBox from "@/components/ChatBox";

export default function GlobalChatButton() {
  const [showChatBox, setShowChatBox] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    // 检查用户登录状态
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("检查认证状态失败:", error);
      }
    };

    // 生成或获取持久的会话ID
    const initSessionId = () => {
      const stored = localStorage.getItem("diflow_chat_session_id");
      if (stored) {
        setSessionId(stored);
      } else {
        const newSessionId = crypto.randomUUID();
        localStorage.setItem("diflow_chat_session_id", newSessionId);
        setSessionId(newSessionId);
      }
    };

    checkAuth();
    initSessionId();
    setIsInitialized(true);
  }, []);

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
   * 处理聊天按钮点击
   */
  const handleChatButtonClick = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    setShowChatBox(!showChatBox);
  };

  /**
   * 处理对话框关闭
   */
  const handleCloseChatBox = () => {
    setShowChatBox(false);
  };

  /**
   * 处理登录提示弹窗关闭
   */
  const handleCloseLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  return (
    <>
      {/* 悬浮对话按钮 */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          data-global-chat-button
          onClick={handleChatButtonClick}
          className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative"
          title="快速对话"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>

          {/* 提示文字 */}
          <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            快速对话
          </div>
        </button>
      </div>

      {/* 对话框 - 保持挂载状态，只控制显示隐藏 */}
      {isInitialized && user && sessionId && (
        <div
          className={`fixed inset-0 z-40 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity duration-300 ${
            showChatBox
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseChatBox();
            }
          }}
        >
          <div
            className={`relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[70vh] overflow-hidden transform transition-transform duration-300 ${
              showChatBox ? "scale-100" : "scale-95"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseChatBox}
              className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                className="w-6 h-6"
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
            <ChatBox
              user={user}
              sessionId={sessionId}
              onClose={handleCloseChatBox}
              isModal={true}
            />
          </div>
        </div>
      )}

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
                  请先登录您的账户，然后就可以开始与 AI 对话了
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
    </>
  );
}
