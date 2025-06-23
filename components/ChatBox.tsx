"use client";

import { useState, useEffect, useRef, Suspense } from "react";
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
  user: User | null;
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
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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
  const uploadAndProcessFiles = async (files: File[]) => {
    if (files.length === 0) return;

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
      formData.append("sessionId", sessionId || crypto.randomUUID());

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

    // 如果有文件需要处理，先处理文件
    if (currentFiles.length > 0) {
      await uploadAndProcessFiles(currentFiles);
      setAttachedFiles([]);
    }

    // 如果只是上传文件没有问题，直接返回
    if (!userMessageContent) {
      return;
    }

    setInputMessage("");
    setLoading(true);

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

    try {
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
      const response = await fetch("/api/langchain-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          files,
          sessionId: sessionId || "anonymous",
          useVectorStore: true,
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

      // 移除文件处理的系统消息
      if (files.length > 0) {
        setMessages((prev) => prev.filter((msg) => msg.role !== "system"));
        setUploadingFiles(false);
        setAttachedFiles([]); // 清空已上传的文件
      }

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

      // 如果处理了文档，显示处理结果
      if (data.data.processedDocuments) {
        const docInfo = data.data.processedDocuments;
        const infoMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: "system",
          content: `✅ 已成功处理 ${docInfo.count} 个文档，生成 ${docInfo.totalChunks} 个知识块。现在你可以基于上传的文档内容进行对话了！`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, infoMessage]);
      }
    } catch (error) {
      console.error("发送消息失败:", error);
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "system",
        content: `发送失败: ${
          error instanceof Error ? error.message : "未知错误"
        }`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setLoading(false);
      onError?.("发送消息失败，请重试");
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
  const clearChat = () => {
    setMessages([]);
    setStreamingMessage({ content: "" });
    setHasKnowledgeBase(false);
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

  const chatContent = (
    <div
      className={`bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col ${height} ${className}`}
    >
      {/* 聊天头部 */}
      {showHeader && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white flex items-center justify-center text-lg">
              ⚡️
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">DiFlow AI</h3>
              <p className="text-xs text-gray-500">
                {hasKnowledgeBase ? "📚 知识库模式" : "💬 对话模式"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-lg">
              💾 记忆开启
            </div>
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="text-gray-400 hover:text-red-500 text-sm p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                title="清空对话"
              >
                🗑️
              </button>
            )}
            {isModal && onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-lg p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                title="关闭"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* 聊天消息区域 */}
      <div className="flex-1 overflow-hidden">
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
                <p className="flex items-center justify-center space-x-2">
                  <span>📄</span>
                  <span>上传文档构建专属知识库</span>
                </p>
                <p className="flex items-center justify-center space-x-2">
                  <span>💬</span>
                  <span>基于文档内容智能问答</span>
                </p>
                <p className="flex items-center justify-center space-x-2">
                  <span>🧠</span>
                  <span>自动记忆对话历史</span>
                </p>
              </div>
              <div className="mt-4 text-xs text-gray-500 bg-blue-50 px-3 py-2 rounded-lg">
                支持: PDF, DOCX, TXT, MD, CSV, JSON 格式
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
                        {getAvatarText(user?.name || "")}
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
      <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-2xl">
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
                    : hasKnowledgeBase
                    ? "基于已上传文档提问..."
                    : placeholder
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
                  loading ||
                  !!streamingMessage.content ||
                  uploadingFiles
                }
                className="px-3 py-2 text-gray-500 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg text-lg border border-gray-300 hover:border-blue-300"
                title="上传文档构建知识库"
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
          className="w-full max-w-4xl max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {chatContent}
        </div>
      </div>
    );
  }

  return chatContent;
}
