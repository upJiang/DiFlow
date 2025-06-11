"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { User } from "@/types/user";
import ChatBox from "@/components/ChatBox";

function SearchParamsHandler({
  setError,
}: {
  setError: (error: string) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      // 5秒后清除错误消息
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, setError]);

  return null;
}

export default function HomePage() {
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showChatBox, setShowChatBox] = useState(false);

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
      console.error("获取用户信息失败:", error);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">载入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Suspense fallback={null}>
        <SearchParamsHandler setError={setError} />
      </Suspense>

      {/* 错误消息 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 mx-4 mt-4">
          <div className="flex items-center">
            <span className="text-red-500 mr-2">⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* 主要内容 */}
      <div className="container mx-auto px-4 py-12">
        {/* 头部标题 */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="text-8xl mb-4 animate-bounce">⚡</div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            DiFlow AI 工作台
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            一站式AI智能工作平台，集成先进的AI对话、文档智能分析、工作流自动化和效率工具，
            <br />
            助力程序员和知识工作者提升工作效率，让智能化工作触手可及。
          </p>
        </div>

        {/* 功能特色卡片 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-2">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
              🤖
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">AI智能对话</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              基于先进大语言模型，支持文档上传分析，智能问答，上下文记忆，让AI成为你的专属智能助手
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-2">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
              🔄
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              工作流自动化
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              可视化拖拽式工作流设计，支持节点连接，数据流转，让复杂任务自动化执行
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-2">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
              🎯
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Cursor & MCP
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Cursor IDE使用技巧分享，MCP协议实践应用，提升开发效率的秘籍大全
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-200 hover:-translate-y-2">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
              🛠️
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">效率工具集</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              精选优质效率工具推荐，涵盖开发、设计、办公等多个领域，助力提升工作效率
            </p>
          </div>
        </div>

        {/* 使用统计 */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            📊 平台数据概览
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                1,234+
              </div>
              <div className="text-gray-600 text-sm">活跃用户</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                5,678+
              </div>
              <div className="text-gray-600 text-sm">对话会话</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                2,345+
              </div>
              <div className="text-gray-600 text-sm">工作流创建</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                98.5%
              </div>
              <div className="text-gray-600 text-sm">用户满意度</div>
            </div>
          </div>
        </div>

        {/* 最新更新 */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            🎉 最新功能更新
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl">🤖</div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  AI对话系统重大升级
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  新增文档上传分析功能，支持PDF、Word、Markdown等多种格式，智能向量化存储，基于文档内容进行精准问答
                </p>
                <span className="text-xs text-blue-600 font-medium">
                  2024-01-15
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl">🔄</div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  工作流编辑器正式上线
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  全新可视化工作流设计器，支持拖拽节点，连接数据流，自动化执行复杂任务，提升工作效率
                </p>
                <span className="text-xs text-purple-600 font-medium">
                  2024-01-10
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl">
              <div className="text-2xl">🎯</div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Cursor IDE 使用指南发布
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  全面的Cursor使用技巧和MCP协议应用指南，帮助开发者最大化利用AI编程助手的能力
                </p>
                <span className="text-xs text-green-600 font-medium">
                  2024-01-05
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 悬浮快速对话按钮 */}
      {user && (
        <button
          onClick={() => setShowChatBox(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center text-2xl hover:scale-110 z-40 animate-pulse hover:animate-none group"
          title="快速对话"
        >
          <span className="group-hover:scale-125 transition-transform">💬</span>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-bounce">
            AI
          </div>
        </button>
      )}

      {/* ChatBox 模态框 */}
      {showChatBox && (
        <ChatBox
          user={user}
          onError={setError}
          onClose={() => setShowChatBox(false)}
          sessionId="homepage-chat"
          height="h-[80vh]"
          isModal={true}
        />
      )}
    </div>
  );
}
