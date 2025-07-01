"use client";

import { useState, useEffect, useRef } from "react";
import { User } from "@/types/user";
import MarkdownRenderer from "./MarkdownRenderer";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  attachments?: File[];
  sources?: Array<{
    content: string;
    metadata: Record<string, any>;
  }>;
  usedVectorStore?: boolean;
}

interface StreamingMessage {
  content: string;
}

interface ChatBoxProps {
  user: {
    user: User | null;
  };
  onError?: (error: string) => void;
  onClose?: () => void;
  placeholder?: string;
  showHeader?: boolean;
  height?: string;
  sessionId?: string;
  className?: string;
  isModal?: boolean;
}

export default function ChatBox({
  user,
  onError,
  onClose,
  placeholder = "请输入您的问题...",
  showHeader = true,
  height = "h-96",
  sessionId,
  className = "",
  isModal = false,
}: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<StreamingMessage>({
    content: "",
  });
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [hasKnowledgeBase, setHasKnowledgeBase] = useState(false);
  const [processingFiles, setProcessingFiles] = useState<string[]>([]);
  const [useKnowledgeMode, setUseKnowledgeMode] = useState(false);
  const [useWebSearch, setUseWebSearch] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  /**
   * 滚动到底部
   */
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  /**
   * 格式化时间
   */
  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /**
   * 获取用户头像文字
   */
  const getAvatarText = (name: string) => {
    if (!name) return "U";
    const trimmedName = name.trim();
    if (!trimmedName) return "U";

    if (trimmedName.length >= 2) {
      const lastTwoChars = trimmedName.slice(-2);
      return lastTwoChars
        .split("")
        .map((char) => {
          return /[a-zA-Z]/.test(char) ? char.toUpperCase() : char;
        })
        .join("");
    }

    const singleChar = trimmedName.charAt(0);
    return /[a-zA-Z]/.test(singleChar) ? singleChar.toUpperCase() : singleChar;
  };

  /**
   * 处理文件选择
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        "text/plain",
        "text/markdown",
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/csv",
        "application/json",
        "application/msword",
      ];

      if (file.size > maxSize) {
        onError?.(`文件 ${file.name} 超过10MB大小限制`);
        return false;
      }

      if (!allowedTypes.includes(file.type)) {
        onError?.(`不支持的文件类型: ${file.name}`);
        return false;
      }

      return true;
    });

    setAttachedFiles((prev) => [...prev, ...validFiles]);

    // 清空input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /**
   * 移除文件
   */
  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * 上传文件并构建向量存储
   */
  const uploadAndProcessFiles = async (files: File[]): Promise<boolean> => {
    if (files.length === 0) return true;

    setUploadingFiles(true);
    setProcessingFiles(files.map((f) => f.name));

    // 添加系统消息，告知用户文件正在处理
    const systemMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "system",
      content: `📁 正在处理 ${files.length} 个文件，构建知识库中...`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, systemMsg]);

    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });
      formData.append("sessionId", sessionId || "anonymous");

      const response = await fetch("/api/upload-documents", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`文件上传失败: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setHasKnowledgeBase(true);

        // 更新系统消息
        const successMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "system",
          content: `✅ 文件处理完成！已构建包含 ${
            result.chunks || 0
          } 个文档块的知识库。现在您可以基于这些文件内容进行智能问答了。`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev.slice(0, -1), successMsg]);
        return true;
      } else {
        throw new Error(result.message || "文件处理失败");
      }
    } catch (error) {
      console.error("文件处理失败:", error);
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "system",
        content: `❌ 文件处理失败: ${
          error instanceof Error ? error.message : "未知错误"
        }`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev.slice(0, -1), errorMsg]);
      onError?.(
        `文件处理失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
      return false;
    } finally {
      setUploadingFiles(false);
      setProcessingFiles([]);
    }
  };

  /**
   * 将文件转换为Base64
   */
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // 移除data:xxx;base64,前缀，只保留base64内容
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  /**
   * 获取认证 token（增强版，支持重试和缓存）
   */
  const getAuthToken = async (): Promise<string | null> => {
    const maxRetries = 3;
    const retryDelay = 500; // 500ms
    const requestTimeout = 5000; // 5秒超时

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`获取认证token - 尝试 ${attempt}/${maxRetries}`);

        // 创建带超时的请求
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), requestTimeout);

        const response = await fetch("/api/auth/token", {
          signal: controller.signal,
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data.token) {
            console.log(`认证token获取成功 - 尝试 ${attempt}/${maxRetries}`);
            return data.token;
          } else {
            console.warn(`认证token为空 - 尝试 ${attempt}/${maxRetries}`);
          }
        } else {
          console.warn(
            `认证API响应错误: ${response.status} - 尝试 ${attempt}/${maxRetries}`
          );
        }
      } catch (error) {
        console.error(
          `获取认证token失败 - 尝试 ${attempt}/${maxRetries}:`,
          error
        );

        // 如果是最后一次尝试，不再重试
        if (attempt === maxRetries) {
          console.error("所有认证token获取尝试均失败");
          return null;
        }

        // 等待后重试
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * attempt)
        );
      }
    }

    return null;
  };

  /**
   * 发送消息
   */
  const sendMessage = async () => {
    if (!user) {
      onError?.("请先登录才能使用AI助手功能");
      return;
    }

    const userMessageContent = inputMessage.trim();
    const currentFiles = [...attachedFiles];

    if (!userMessageContent && currentFiles.length === 0) return;
    if (loading || streamingMessage.content || uploadingFiles) return;

    setInputMessage("");
    setLoading(true);

    try {
      // 如果有文件需要处理，先处理文件并等待完成
      if (currentFiles.length > 0) {
        setAttachedFiles([]);

        // 等待文件处理完成
        const fileProcessSuccess = await uploadAndProcessFiles(currentFiles);

        // 如果文件处理失败，不继续发送消息
        if (!fileProcessSuccess) {
          setLoading(false);
          return;
        }

        // 文件处理成功，hasKnowledgeBase已经在uploadAndProcessFiles中设置为true
        console.log("文件处理完成，当前知识库状态:", hasKnowledgeBase);

        // 文件处理成功后，等待一小段时间确保知识库完全构建
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // 如果只是上传文件没有问题，直接返回
      if (!userMessageContent) {
        setLoading(false);
        return;
      }

      // 添加用户消息
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: userMessageContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);

      setTimeout(() => {
        scrollToBottom();
      }, 100);

      // 如果是对话模式且开启了网络搜索，使用网络搜索API
      if (!useKnowledgeMode && useWebSearch) {
        try {
          // 过滤掉系统消息，只传递用户和助手的对话历史用于上下文
          const conversationHistory = messages
            .filter((msg) => msg.role !== "system")
            .map((msg) => ({
              role: msg.role,
              content: msg.content,
            }));

          const response = await fetch("/api/web-search", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: userMessageContent,
              conversationHistory: conversationHistory,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.error || `HTTP error! status: ${response.status}`
            );
          }

          const data = await response.json();

          if (!data.success) {
            throw new Error(data.error || "网络搜索失败");
          }

          // 添加AI回复
          const assistantMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: data.data.response,
            timestamp: new Date(),
            sources:
              data.data.searchResults?.map((result: any) => ({
                content: result.snippet,
                metadata: {
                  title: result.title,
                  url: result.link,
                },
              })) || [],
            usedVectorStore: false, // 网络搜索不使用向量存储
          };

          setMessages((prev) => [...prev, assistantMessage]);
          setLoading(false);
          setTimeout(() => {
            scrollToBottom();
          }, 100);
          return;
        } catch (error) {
          console.error("网络搜索失败:", error);
          const errorMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: "system",
            content: `网络搜索失败: ${
              error instanceof Error ? error.message : "未知错误"
            }`,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
          setLoading(false);
          setTimeout(() => {
            scrollToBottom();
          }, 100);
          return;
        }
      }

      // 原有的langchain-chat API逻辑
      // 获取认证 token
      console.log("Cookie内容:", document.cookie);
      const authToken = await getAuthToken();
      console.log("获取到的token:", authToken ? "存在" : "不存在");

      if (!authToken) {
        // 提供更友好的错误提示，建议用户重试
        const friendlyError = new Error(
          "认证状态异常，请稍后重试或刷新页面重新登录"
        );
        friendlyError.name = "AuthTokenError";
        throw friendlyError;
      }

      // 准备文件数据 - 将File对象转换为可序列化的格式
      const files = [];
      if (currentFiles.length > 0) {
        for (const file of currentFiles) {
          try {
            const base64Content = await convertFileToBase64(file);
            files.push({
              name: file.name,
              type: file.type,
              content: base64Content, // Base64内容
              size: file.size,
            });
          } catch (error) {
            console.error(`处理文件 ${file.name} 失败:`, error);
            onError?.(`处理文件 ${file.name} 失败`);
          }
        }
      }

      // 调用新的LangChain API
      // 过滤掉系统消息，只传递用户和助手的对话历史
      const conversationMessages = messages.filter(
        (msg) => msg.role !== "system"
      );

      // 如果刚刚处理了文件，直接使用true；否则根据用户选择的模式决定
      const shouldUseVectorStore =
        useKnowledgeMode && (currentFiles.length > 0 || hasKnowledgeBase);

      console.log("API调用参数:", {
        messageCount: conversationMessages.length,
        hasKnowledgeBase,
        useKnowledgeMode,
        shouldUseVectorStore,
        hadFiles: currentFiles.length > 0,
        sessionId: sessionId || "anonymous",
      });

      const response = await fetch("/api/langchain-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          messages: [...conversationMessages, userMsg],
          files,
          sessionId: sessionId || "anonymous",
          useVectorStore: shouldUseVectorStore,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "请求失败");
      }

      console.log("API响应数据:", {
        usedVectorStore: data.data.usedVectorStore,
        hasSources: data.data.sources?.length > 0,
        responseLength: data.data.response?.length,
      });

      // 添加AI回复
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.data.response,
        timestamp: new Date(),
        sources: data.data.sources,
        usedVectorStore: data.data.usedVectorStore,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("发送消息失败:", error);

      // 根据错误类型提供不同的提示
      let errorContent = "";
      let shouldShowRetryHint = false;

      if (error instanceof Error) {
        if (error.name === "AuthTokenError") {
          errorContent = `🔐 ${error.message}`;
          shouldShowRetryHint = true;
        } else if (
          error.message.includes("网络") ||
          error.message.includes("timeout") ||
          error.message.includes("fetch")
        ) {
          errorContent = `🌐 网络连接异常: ${error.message}`;
          shouldShowRetryHint = true;
        } else {
          errorContent = `❌ 发送失败: ${error.message}`;
          shouldShowRetryHint = true;
        }
      } else {
        errorContent = "❌ 发送失败: 未知错误";
        shouldShowRetryHint = true;
      }

      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "system",
        content:
          errorContent +
          (shouldShowRetryHint
            ? "\n💡 建议：点击重新发送或刷新页面后重试"
            : ""),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);

      // 为认证错误提供特殊的错误回调
      if (error instanceof Error && error.name === "AuthTokenError") {
        onError?.("认证状态异常，请重试或刷新页面");
      } else {
        onError?.("发送消息失败，请重试");
      }
    } finally {
      setLoading(false);
    }

    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  /**
   * 清空聊天
   */
  const clearChat = async () => {
    setMessages([]);
    setStreamingMessage({ content: "" });

    // 重新检查向量存储状态，而不是直接设置为false
    try {
      const response = await fetch(
        `/api/langchain-chat?sessionId=${sessionId || "default"}`
      );
      if (response.ok) {
        const data = await response.json();
        setHasKnowledgeBase(data.data.vectorStoreAvailable || false);
      }
    } catch (error) {
      console.error("检查向量存储状态失败:", error);
    }

    // 如果有会话ID，清除服务器端的会话记忆
    if (sessionId) {
      try {
        // 获取认证 token
        const authToken = await getAuthToken();
        if (!authToken) {
          console.warn(
            "认证状态异常，无法清除服务器端会话记忆，但本地聊天记录已清空"
          );
          return;
        }

        const response = await fetch("/api/langchain-chat/clear-memory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ sessionId }),
        });

        if (response.ok) {
          console.log("会话记忆已清除");
        } else {
          console.warn("清除会话记忆失败");
        }
      } catch (error) {
        console.error("清除会话记忆时出错:", error);
      }
    }
  };

  /**
   * 处理Enter键
   */
  const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /**
   * 处理模态框外部点击
   */
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isModal && e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  /**
   * 检查向量存储状态
   */
  useEffect(() => {
    const checkVectorStoreStatus = async () => {
      try {
        const response = await fetch(
          `/api/langchain-chat?sessionId=${sessionId || "default"}`
        );
        if (response.ok) {
          const data = await response.json();
          setHasKnowledgeBase(data.data.vectorStoreAvailable || false);
        }
      } catch (error) {
        console.error("检查向量存储状态失败:", error);
        setHasKnowledgeBase(false);
      }
    };

    if (user?.user) {
      checkVectorStoreStatus();
    }
  }, [sessionId, user]);

  /**
   * 切换模式处理函数
   */
  const handleModeToggle = (enabled: boolean) => {
    setUseKnowledgeMode(enabled);

    // 如果切换到对话模式，清空已附加的文件
    if (!enabled && attachedFiles.length > 0) {
      setAttachedFiles([]);
    }

    // 如果切换到知识库模式但没有知识库，给用户提示
    if (enabled && !hasKnowledgeBase) {
      const systemMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "system",
        content:
          "💡 您已切换到知识库模式，请先上传文档构建知识库，然后就可以基于文档内容进行智能问答了。",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, systemMsg]);

      // 3秒后自动移除提示消息
      setTimeout(() => {
        setMessages((prev) => prev.filter((msg) => msg.id !== systemMsg.id));
      }, 3000);
    }
  };

  const chatContent = (
    <div
      className={`bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col ${
        isModal ? "h-full" : height
      } ${className}`}
    >
      {/* 聊天头部 */}
      {showHeader && (
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl flex-shrink-0">
          <div className="flex items-center justify-between">
            {/* 左侧：头像 + 标题 */}
            <div className="flex items-center space-x-3 flex-1 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white flex items-center justify-center text-lg flex-shrink-0">
                ⚡️
              </div>
              <div className="overflow-hidden">
                <h3 className="font-semibold text-gray-800 text-sm truncate">
                  DiFlow AI
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {useKnowledgeMode ? "📚 知识库模式" : "💬 对话模式"}
                  </span>
                  {/* 模式切换开关 */}
                  <button
                    onClick={() => handleModeToggle(!useKnowledgeMode)}
                    className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none flex-shrink-0 ${
                      useKnowledgeMode ? "bg-blue-500" : "bg-gray-300"
                    }`}
                    style={{ boxSizing: "border-box" }}
                    title={
                      useKnowledgeMode ? "切换到对话模式" : "切换到知识库模式"
                    }
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ease-in-out flex-shrink-0 ${
                        useKnowledgeMode ? "translate-x-3.5" : "translate-x-0.5"
                      }`}
                      style={{ boxSizing: "border-box" }}
                    />
                  </button>

                  {/* 网络搜索开关 - 只在对话模式下显示 */}
                  {!useKnowledgeMode && (
                    <>
                      <span className="text-xs text-gray-400">|</span>
                      <span className="text-xs text-gray-500">🌐 网络搜索</span>
                      <button
                        onClick={() => setUseWebSearch(!useWebSearch)}
                        className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none flex-shrink-0 ${
                          useWebSearch ? "bg-green-500" : "bg-gray-300"
                        }`}
                        style={{ boxSizing: "border-box" }}
                        title={useWebSearch ? "关闭网络搜索" : "开启网络搜索"}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ease-in-out flex-shrink-0 ${
                            useWebSearch ? "translate-x-3.5" : "translate-x-0.5"
                          }`}
                          style={{ boxSizing: "border-box" }}
                        />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 右侧：按钮组 */}
            <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
              {/* 记忆状态 - 只在大屏显示 */}
              <div className="hidden md:flex text-xs text-gray-500 bg-white px-2 py-1 rounded-lg flex-shrink-0">
                💾 记忆开启
              </div>

              {/* 清空按钮 */}
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="w-8 h-8 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center flex-shrink-0"
                  title="清空对话"
                >
                  🗑️
                </button>
              )}

              {/* 关闭按钮 */}
              {isModal && onClose && (
                <button
                  onClick={onClose}
                  className="w-8 h-8 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center flex-shrink-0"
                  title="关闭"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 聊天消息区域 */}
      <div className="flex-1 overflow-hidden min-h-0">
        <div
          ref={chatContainerRef}
          className="h-full overflow-y-auto p-4 space-y-4"
          style={{ scrollbarWidth: "thin" }}
        >
          {messages.length === 0 && !streamingMessage.content && (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                欢迎使用 DiFlow AI
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                {useKnowledgeMode ? (
                  <>
                    <p className="flex items-center justify-center space-x-2">
                      <span>📚</span>
                      <span>知识库模式 - 基于文档智能问答</span>
                    </p>
                    <p className="flex items-center justify-center space-x-2">
                      <span>📄</span>
                      <span>上传文档构建专属知识库</span>
                    </p>
                    <p className="flex items-center justify-center space-x-2">
                      <span>💡</span>
                      <span>AI将优先使用文档内容回答</span>
                    </p>
                  </>
                ) : (
                  <>
                    <p className="flex items-center justify-center space-x-2">
                      <span>💬</span>
                      <span>
                        对话模式 -{" "}
                        {useWebSearch ? "网络搜索增强" : "自由聊天交流"}
                      </span>
                    </p>
                    <p className="flex items-center justify-center space-x-2">
                      <span>{useWebSearch ? "🌐" : "🤖"}</span>
                      <span>
                        {useWebSearch
                          ? "AI基于网络搜索结果回答"
                          : "AI基于通用知识回答问题"}
                      </span>
                    </p>
                    <p className="flex items-center justify-center space-x-2">
                      <span>🧠</span>
                      <span>自动记忆对话历史</span>
                    </p>
                  </>
                )}
              </div>
              <div className="mt-4 text-xs text-gray-500 bg-blue-50 px-3 py-2 rounded-lg">
                {useKnowledgeMode
                  ? "支持: PDF, DOCX, TXT, MD, CSV, JSON 格式"
                  : useWebSearch
                  ? "🌐 网络搜索模式 - 获取最新信息"
                  : "点击左上角开关切换到知识库模式或开启网络搜索"}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user"
                  ? "justify-end"
                  : message.role === "system"
                  ? "justify-center"
                  : "justify-start"
              }`}
            >
              {message.role === "system" ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 max-w-[80%]">
                  <div className="text-sm text-yellow-800 text-center">
                    {message.content}
                  </div>
                </div>
              ) : (
                <div
                  className={`flex ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  } items-start ${
                    message.role === "user"
                      ? "space-x-reverse space-x-4"
                      : "space-x-4"
                  } max-w-[80%]`}
                >
                  <div className="flex-shrink-0">
                    {message.role === "user" ? (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                        {getAvatarText(user?.user?.name || "")}
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white flex items-center justify-center text-lg">
                        ⚡️
                      </div>
                    )}
                  </div>

                  <div
                    className={`rounded-2xl px-4 py-2 shadow-sm group ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        : "bg-gray-100 text-gray-800 relative"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <MarkdownRenderer
                        content={message.content}
                        showCopyButton={true}
                        className="text-sm"
                      />
                    ) : (
                      <div className="whitespace-pre-wrap break-words text-sm">
                        {message.content}
                      </div>
                    )}

                    <div
                      className={`text-xs mt-1 ${
                        message.role === "user"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                      {message.usedVectorStore && (
                        <span className="ml-2 bg-green-100 text-green-700 px-1 rounded text-xs">
                          📚 知识库
                        </span>
                      )}
                      {message.role === "assistant" &&
                        message.sources &&
                        message.sources.length > 0 &&
                        !message.usedVectorStore && (
                          <span className="ml-2 bg-blue-100 text-blue-700 px-1 rounded text-xs">
                            🌐 网络搜索
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* 流式消息 */}
          {streamingMessage.content && (
            <div className="flex justify-start">
              <div className="flex flex-row items-start space-x-4 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white flex items-center justify-center text-lg">
                  ⚡️
                </div>
                <div className="bg-gray-100 text-gray-800 rounded-2xl px-4 py-2 shadow-sm relative">
                  <MarkdownRenderer
                    content={streamingMessage.content}
                    showCopyButton={false}
                    className="text-sm"
                  />
                  <div className="flex items-center mt-2 text-gray-500">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-1 h-1 bg-purple-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-1 h-1 bg-pink-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs">生成中...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 文件处理中 */}
          {uploadingFiles && (
            <div className="flex justify-center">
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 max-w-[80%]">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold">正在处理文件...</p>
                    <ul className="text-xs mt-1 space-y-1">
                      {processingFiles.map((fileName, index) => (
                        <li key={index} className="flex items-center space-x-1">
                          <span>📄</span>
                          <span>{fileName}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 加载指示器 */}
          {loading && (
            <div className="flex justify-start">
              <div className="flex flex-row items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white flex items-center justify-center text-lg">
                  ⚡️
                </div>
                <div className="bg-gray-100 text-gray-800 rounded-2xl px-4 py-2 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">AI正在思考中...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 输入区域 */}
      <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-2xl flex-shrink-0">
        {/* 附件显示 */}
        {attachedFiles.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                <span>📎</span>
                <span>{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-blue-600 hover:text-blue-800 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex space-x-2">
          <div className="flex-1 flex space-x-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleEnter}
              placeholder={
                user
                  ? attachedFiles.length > 0
                    ? "上传文件并提问..."
                    : useKnowledgeMode
                    ? hasKnowledgeBase
                      ? "基于已上传文档提问..."
                      : "请先上传文档构建知识库..."
                    : useWebSearch
                    ? "提问获取最新网络信息..."
                    : "开始对话..."
                  : "请先登录才能使用AI助手"
              }
              rows={2}
              className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              disabled={
                !user || loading || !!streamingMessage.content || uploadingFiles
              }
            />

            {/* 文件上传按钮 */}
            <div className="flex flex-col space-y-1">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                accept=".txt,.md,.pdf,.docx,.csv,.json,.doc"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={
                  !user ||
                  !useKnowledgeMode || // 对话模式下禁用文件上传
                  loading ||
                  !!streamingMessage.content ||
                  uploadingFiles
                }
                className={`px-3 py-2 text-gray-500 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg text-lg border border-gray-300 hover:border-blue-300 ${
                  !useKnowledgeMode ? "bg-gray-100" : ""
                }`}
                title={
                  !useKnowledgeMode
                    ? "请切换到知识库模式后上传文档"
                    : "上传文档构建知识库"
                }
              >
                📁
              </button>

              <button
                onClick={sendMessage}
                disabled={
                  !user ||
                  (!inputMessage.trim() && attachedFiles.length === 0) ||
                  loading ||
                  !!streamingMessage.content ||
                  uploadingFiles
                }
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm text-sm"
              >
                {loading || streamingMessage.content || uploadingFiles ? (
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  "⚡"
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-2 flex justify-between items-center">
          <span>支持文件：PDF, DOCX, TXT, MD, CSV, JSON (最大10MB)</span>
          <span>Enter发送 / Shift+Enter换行</span>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleModalClick}
      >
        <div
          className="w-full max-w-4xl h-[70vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {chatContent}
        </div>
      </div>
    );
  }

  return chatContent;
}
