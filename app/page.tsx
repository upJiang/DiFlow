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

export default function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState("deepseek-chat");
  const [loading, setLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<StreamingMessage>({
    content: "",
  });
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

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
    setInputMessage(message);
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  const sendMessage = async () => {
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
      // 模拟AI回复（实际项目中这里应该调用真实的API）
      setLoading(false);

      // 模拟打字机效果
      const aiResponse = `这是对您问题"${userMessage}"的回复。我是DiFlow AI助手，可以帮助您解决各种问题。我具有强大的学习能力和创造力，可以协助您完成编程、写作、数据分析等多种任务。`;

      let currentContent = "";
      const chars = aiResponse.split("");

      for (let i = 0; i < chars.length; i++) {
        currentContent += chars[i];
        setStreamingMessage({ content: currentContent });
        await new Promise((resolve) => setTimeout(resolve, 20));
      }

      // 完成流式输出后，将消息添加到正式消息列表
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setStreamingMessage({ content: "" });
    } catch (error) {
      console.error("发送消息失败:", error);
      setLoading(false);
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
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 错误提示组件 */}
      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-red-800">登录失败</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={() => setError(null)}
                  className="inline-flex text-red-400 hover:text-red-600 focus:outline-none"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 主内容区域 */}
      <div className="h-full flex flex-col pt-16">
        {/* 对话界面 */}
        <div className="flex-1 flex flex-col">
          {/* 对话区域 */}
          <div ref={chatContainerRef} className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl mx-auto">
              {/* 空状态 - 显示介绍 */}
              {messages.length === 0 && !streamingMessage.content && (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="text-8xl mb-8">🎭</div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                    DiFlow AI 助手
                  </h1>
                  <div className="text-lg text-gray-600 mb-12 max-w-2xl leading-relaxed">
                    <p className="mb-4">🌟 欢迎来到DiFlow的奇妙世界！</p>
                    <p className="mb-4">
                      我是你的专属AI小助手，拥有超强的学习能力和创造力！
                    </p>
                    <p>
                      ✨
                      无论是编程、写作、分析数据，还是天马行空的创意，我都能陪你一起探索！
                    </p>
                  </div>

                  {/* 示例问题 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                    <button
                      onClick={() => sendExampleMessage("如何优化网站的SEO？")}
                      className="group p-6 bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-3xl border-2 border-blue-100 hover:border-blue-200 hover:shadow-xl transition-all text-left transform hover:scale-105"
                    >
                      <div className="text-3xl mb-4 group-hover:animate-bounce">
                        🔍
                      </div>
                      <div className="font-bold text-gray-900 text-lg mb-2">
                        SEO优化大师
                      </div>
                      <div className="text-sm text-gray-600">
                        让你的网站在搜索引擎中闪闪发光！
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        sendExampleMessage("帮我写一个Python数据分析脚本")
                      }
                      className="group p-6 bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 rounded-3xl border-2 border-emerald-100 hover:border-emerald-200 hover:shadow-xl transition-all text-left transform hover:scale-105"
                    >
                      <div className="text-3xl mb-4 group-hover:animate-bounce">
                        🐍
                      </div>
                      <div className="font-bold text-gray-900 text-lg mb-2">
                        编程魔法师
                      </div>
                      <div className="text-sm text-gray-600">
                        用代码创造无限可能，让数据说话！
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        sendExampleMessage("解释一下机器学习的基本概念")
                      }
                      className="group p-6 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-3xl border-2 border-purple-100 hover:border-purple-200 hover:shadow-xl transition-all text-left transform hover:scale-105"
                    >
                      <div className="text-3xl mb-4 group-hover:animate-bounce">
                        🧠
                      </div>
                      <div className="font-bold text-gray-900 text-lg mb-2">
                        知识探索家
                      </div>
                      <div className="text-sm text-gray-600">
                        和我一起遨游知识的海洋吧！
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        sendExampleMessage("创建一个项目管理工作流")
                      }
                      className="group p-6 bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 rounded-3xl border-2 border-orange-100 hover:border-orange-200 hover:shadow-xl transition-all text-left transform hover:scale-105"
                    >
                      <div className="text-3xl mb-4 group-hover:animate-bounce">
                        🚀
                      </div>
                      <div className="font-bold text-gray-900 text-lg mb-2">
                        效率提升器
                      </div>
                      <div className="text-sm text-gray-600">
                        让工作变得井井有条，事半功倍！
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* 消息列表 */}
              {(messages.length > 0 || streamingMessage.content) && (
                <div className="space-y-6 pb-32">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-4 ${
                        message.role === "user"
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      {/* 头像 */}
                      <div className="flex-shrink-0">
                        {message.role === "user" ? (
                          <div className="w-12 h-12 bg-gradient-to-r from-slate-400 to-slate-500 rounded-2xl flex items-center justify-center text-white text-sm font-medium">
                            <span className="whitespace-nowrap">U</span>
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center text-white">
                            🤖
                          </div>
                        )}
                      </div>

                      {/* 消息内容 */}
                      <div className="flex-1 max-w-3xl">
                        <div
                          className={`p-4 rounded-2xl shadow-sm ${
                            message.role === "user"
                              ? "bg-gradient-to-r from-slate-100 to-slate-200 text-gray-800 border border-slate-200"
                              : "bg-white/70 backdrop-blur-sm border border-gray-200/50"
                          }`}
                        >
                          <div className="whitespace-pre-wrap break-words">
                            {message.content}
                          </div>
                        </div>
                        <div
                          className={`text-xs text-gray-500 mt-2 ${
                            message.role === "user" ? "text-right" : ""
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* 加载状态 */}
                  {loading && (
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center text-white">
                        🤖
                      </div>
                      <div className="flex-1 max-w-3xl">
                        <div className="p-4 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 流式消息（打字机效果） */}
                  {streamingMessage.content && (
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center text-white">
                        🤖
                      </div>
                      <div className="flex-1 max-w-3xl">
                        <div className="p-4 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl">
                          <div className="whitespace-pre-wrap break-words">
                            {streamingMessage.content}
                            <span className="animate-pulse">|</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 固定底部输入区域 */}
      <div className="fixed bottom-0 left-0 right-0 p-6">
        <div className="max-w-4xl mx-auto">
          {/* 输入框上方的控制栏 */}
          <div className="flex items-center justify-between mb-4">
            {/* 左上方模型选择 */}
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="px-4 py-2 border border-gray-300/50 rounded-xl bg-white/80 backdrop-blur-md text-sm shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="deepseek-chat">💬 DeepSeek Chat</option>
              <option value="deepseek-coder">💻 DeepSeek Coder</option>
            </select>

            {/* 右上方清空按钮 */}
            <button
              onClick={clearChat}
              disabled={messages.length === 0 && !streamingMessage.content}
              className="p-3 text-gray-500 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-white/80 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl"
              title="清空对话"
            >
              🗑️
            </button>
          </div>

          {/* 输入框 */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-end space-x-4"
          >
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value);
                  adjustTextareaHeight(e);
                }}
                onKeyDown={handleEnter}
                placeholder="在这里输入消息..."
                rows={1}
                className="w-full p-4 border border-gray-300/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none bg-white/10 backdrop-blur-md placeholder-gray-500 shadow-lg"
                style={{ minHeight: "56px", maxHeight: "200px" }}
                disabled={loading || !!streamingMessage.content}
              />
            </div>
            <button
              type="submit"
              disabled={
                !inputMessage.trim() || loading || !!streamingMessage.content
              }
              className="flex-shrink-0 p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
              style={{ height: "56px", width: "56px" }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
