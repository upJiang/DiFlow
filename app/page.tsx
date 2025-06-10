"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface StreamingMessage {
  content: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
}

export default function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<StreamingMessage>({
    content: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  // 获取用户信息
  useEffect(() => {
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
        console.error("获取用户信息失败:", error);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    fetchUser();
  }, []);

  // 检查URL中的错误参数
  useEffect(() => {
    const errorParam = searchParams?.get("error");
    if (errorParam) {
      switch (errorParam) {
        case "oauth_error":
          setError("Google授权失败，请重试");
          break;
        default:
          setError("登录过程中发生错误，请重试");
      }

      // 5秒后自动清除错误消息
      const timer = setTimeout(() => {
        setError(null);
        // 清除URL中的错误参数
        window.history.replaceState({}, "", window.location.pathname);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sendExampleMessage = (message: string) => {
    if (!user) {
      setError("请先登录才能使用AI助手功能");
      return;
    }
    setInputMessage(message);
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  const sendMessage = async () => {
    if (!user) {
      setError("请先登录才能使用AI助手功能");
      return;
    }

    if (!inputMessage.trim() || loading || streamingMessage.content) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setLoading(true);

    // 添加用户消息
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // 滚动到底部
    setTimeout(() => {
      scrollToBottom();
    }, 100);

    try {
      // 真实API调用
      const response = await fetch("/api/chat-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          messages: messages,
        }),
      });

      if (response.status === 401) {
        const errorData = await response.json();
        setError(errorData.error || "请先登录才能使用AI助手功能");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }

      setLoading(false);

      // 处理流式响应
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let currentContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((line) => line.trim() !== "");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  currentContent += data.content;
                  setStreamingMessage({ content: currentContent });
                }

                if (data.done) {
                  // 完成流式输出后，将消息添加到正式消息列表
                  const aiMsg: ChatMessage = {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: currentContent,
                    timestamp: new Date(),
                  };
                  setMessages((prev) => [...prev, aiMsg]);
                  setStreamingMessage({ content: "" });
                  break;
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("发送消息失败:", error);
      setLoading(false);
      setError("发送消息失败，请重试");
    }

    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  const clearChat = () => {
    setMessages([]);
    setStreamingMessage({ content: "" });
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 自动调整textarea高度
  const adjustTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🎭</div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 overflow-hidden">
      {/* 错误提示 */}
      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}

      {/* 主容器 */}
      <div className="flex flex-col h-full pt-16">
        {/* 聊天区域容器 */}
        <div className="flex-1 max-w-4xl mx-auto w-full px-4 overflow-hidden">
          <div
            ref={chatContainerRef}
            className="h-full pb-40 overflow-y-auto py-6 scrollbar-hide"
            style={{
              maxHeight: "calc(100vh - 16rem)",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {/* 空状态 - 显示介绍 */}
            {messages.length === 0 && !streamingMessage.content && (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <div className="text-6xl mb-6 animate-bounce">🎭</div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  DiFlow AI 助手
                </h1>
                <p className="text-gray-600 mb-8 max-w-lg">
                  ✨ 我是你的专属AI助手，可以帮助你解决各种问题！
                </p>

                {/* 示例问题卡片 - 紧凑布局 */}
                <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                  {[
                    {
                      icon: "💻",
                      title: "编程",
                      question: "帮我写一个React组件",
                    },
                    { icon: "✍️", title: "写作", question: "写一首关于AI的诗" },
                    { icon: "📊", title: "分析", question: "如何分析数据？" },
                    { icon: "🎨", title: "设计", question: "设计网站布局" },
                  ].map((example, index) => (
                    <div
                      key={index}
                      onClick={() => sendExampleMessage(example.question)}
                      className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 border border-white/50"
                    >
                      <div className="text-2xl mb-2">{example.icon}</div>
                      <h3 className="font-semibold text-gray-800 text-sm mb-1">
                        {example.title}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {example.question}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 聊天消息区域 */}
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex ${
                        message.role === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
                      } items-start space-x-3 max-w-2xl`}
                    >
                      {/* 头像 */}
                      <div
                        className={`flex-shrink-0 ${
                          message.role === "user" ? "ml-3" : "mr-3"
                        }`}
                      >
                        {message.role === "user" ? (
                          <img
                            src={
                              user?.image ||
                              "https://via.placeholder.com/40x40/4F46E5/FFFFFF?text=U"
                            }
                            alt="用户头像"
                            className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                "https://via.placeholder.com/40x40/4F46E5/FFFFFF?text=U";
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white flex items-center justify-center text-lg shadow-md">
                            🤖
                          </div>
                        )}
                      </div>

                      {/* 消息内容 */}
                      <div
                        className={`rounded-2xl px-6 py-4 shadow-lg ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                            : "bg-white/80 backdrop-blur-sm text-gray-800 border border-white/50"
                        }`}
                      >
                        <div className="whitespace-pre-wrap break-words">
                          {message.content}
                        </div>
                        <div
                          className={`text-xs mt-2 ${
                            message.role === "user"
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* 流式消息 */}
                {streamingMessage.content && (
                  <div className="flex justify-start">
                    <div className="flex flex-row items-start space-x-3 max-w-2xl">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white flex items-center justify-center text-lg shadow-md">
                          🤖
                        </div>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm text-gray-800 border border-white/50 rounded-2xl px-6 py-4 shadow-lg">
                        <div className="whitespace-pre-wrap break-words">
                          {streamingMessage.content}
                        </div>
                        <div className="flex items-center mt-2 text-gray-500">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="ml-2 text-xs">正在生成中...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 加载指示器 */}
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex flex-row items-start space-x-3 max-w-2xl">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white flex items-center justify-center text-lg shadow-md">
                          🤖
                        </div>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm text-gray-800 border border-white/50 rounded-2xl px-6 py-4 shadow-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-1">
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                            <div
                              className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">
                            AI正在思考中...
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 输入区域 - 固定在底部 */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white/90 to-transparent backdrop-blur-md shadow-2xl">
          <div className="max-w-4xl mx-auto p-6">
            {/* 输入框容器 */}
            <div
              className="backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            >
              <div className="flex space-x-4">
                <textarea
                  value={inputMessage}
                  onChange={(e) => {
                    setInputMessage(e.target.value);
                    adjustTextareaHeight(e);
                  }}
                  onKeyDown={handleEnter}
                  placeholder={
                    user ? "请输入您的问题..." : "请先登录才能使用AI助手"
                  }
                  rows={2}
                  className="flex-1 resize-none border-0 bg-transparent focus:outline-none text-gray-800 placeholder-gray-500 text-sm leading-relaxed"
                  disabled={!user || loading || !!streamingMessage.content}
                />
                <button
                  onClick={sendMessage}
                  disabled={
                    !user ||
                    !inputMessage.trim() ||
                    loading ||
                    !!streamingMessage.content
                  }
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg text-sm"
                >
                  {loading || streamingMessage.content ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>发送</span>
                    </div>
                  ) : (
                    "🚀"
                  )}
                </button>
              </div>

              {/* 底部控制区域 */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200/30">
                <div className="flex items-center space-x-4">
                  {/* 清空对话 */}
                  <button
                    onClick={clearChat}
                    disabled={
                      !user ||
                      (messages.length === 0 && !streamingMessage.content)
                    }
                    className="px-3 py-1 text-gray-500 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg text-sm"
                    title="清空对话"
                  >
                    🗑️ 清空
                  </button>

                  {/* 模型显示 */}
                  <div className="text-xs text-gray-600 bg-white/50 px-3 py-1 rounded-lg">
                    🧠 Qwen QwQ-32B
                  </div>
                </div>

                {/* 右下角提示文本 */}
                <div className="text-xs text-gray-500">
                  {user ? "按 Enter 发送，Shift + Enter 换行" : "请先登录"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
