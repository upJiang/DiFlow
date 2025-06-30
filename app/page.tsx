"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { User } from "@/types/user";

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
  const [showMeteor, setShowMeteor] = useState(false);

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

  /**
   * 打开AI对话弹窗 - 触发GlobalChatButton的显示
   */
  const openChatBox = () => {
    if (!user) {
      setError("请先登录Google账号才能使用AI对话功能");
      return;
    }

    // 触发GlobalChatButton显示对话框
    const globalChatButton = document.querySelector(
      "[data-global-chat-button]"
    ) as HTMLButtonElement;
    if (globalChatButton) {
      globalChatButton.click();
    }
  };

  useEffect(() => {
    fetchUser();

    // 流星动画定时器
    const interval = setInterval(() => {
      setShowMeteor(true);
      setTimeout(() => setShowMeteor(false), 1500); // 动画持续1.5秒
    }, 5000); // 每5秒触发一次

    return () => clearInterval(interval);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* 背景动画元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        {/* 浮动粒子 */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-purple-400 rounded-full opacity-30 animate-float animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-pink-400 rounded-full opacity-25 animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-indigo-400 rounded-full opacity-40 animate-float animation-delay-3000"></div>

        {/* 更多浮动粒子 */}
        <div className="absolute top-3/4 left-1/2 w-1 h-1 bg-cyan-400 rounded-full opacity-50 animate-float animation-delay-4000"></div>
        <div className="absolute top-1/5 left-2/3 w-3 h-3 bg-emerald-400 rounded-full opacity-30 animate-float animation-delay-5000"></div>
        <div className="absolute bottom-1/3 right-1/5 w-2 h-2 bg-yellow-400 rounded-full opacity-35 animate-float animation-delay-6000"></div>

        {/* 几何图形 */}
        <div className="absolute top-20 right-20 w-20 h-20 border-2 border-blue-300 rounded-lg opacity-20 animate-spin-slow"></div>
        <div className="absolute bottom-20 left-20 w-16 h-16 border-2 border-purple-300 transform rotate-45 opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-10 w-12 h-12 border-2 border-pink-300 rounded-full opacity-15 animate-ping animation-delay-2000"></div>
        <div className="absolute bottom-1/3 right-10 w-8 h-8 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full opacity-20 animate-bounce animation-delay-3000"></div>

        {/* 流动光效 */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-pink-400 to-transparent opacity-20 animate-pulse animation-delay-1000"></div>
        <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-20 animate-pulse animation-delay-3000"></div>

        {/* 流星动画 */}
        {showMeteor && (
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-gradient-to-r from-white via-blue-400 to-transparent rounded-full opacity-80 animate-meteor"></div>
        )}
      </div>

      <Suspense fallback={null}>
        <SearchParamsHandler setError={setError} />
      </Suspense>

      {/* 错误消息 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 mx-4 mt-4 relative z-10">
          <div className="flex items-center">
            <span className="text-red-500 mr-2">⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* 主要内容 */}
      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        {/* 头部标题 */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6 relative">
            <div className="text-8xl mb-4 animate-glow relative">
              {/* 主logo */}
              <div className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                  ⚡
                </span>
                {/* 发光效果 */}
                <div className="absolute inset-0 text-8xl blur-xl opacity-50 animate-ping">
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    ⚡
                  </span>
                </div>
                {/* 旋转光环 */}
                <div className="absolute -inset-4 rounded-full opacity-30 animate-spin-slow">
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 p-0.5">
                    <div className="w-full h-full rounded-full bg-white/90"></div>
                  </div>
                </div>
                <div className="absolute -inset-6 rounded-full opacity-20 animate-spin-slow animation-delay-1000">
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-pink-400 via-blue-400 to-purple-400 p-0.5">
                    <div className="w-full h-full rounded-full bg-white/90"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 animate-slide-up">
            DiFlow AI 工作台
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay">
            一站式AI智能工作平台，集成先进的AI对话、文档智能分析和效率工具，
            <br />
            助力程序员和知识工作者提升工作效率，让智能化工作触手可及。
          </p>

          {/* 科技感装饰线条 */}
          <div className="mt-8 flex justify-center items-center space-x-4">
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent to-blue-500 animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
            <div className="w-20 h-0.5 bg-gradient-to-l from-transparent to-purple-500 animate-pulse animation-delay-1000"></div>
          </div>
        </div>

        {/* 功能特色卡片 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 hover:-translate-y-3 animate-card-up">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
              ⚡️
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">AI智能对话</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              强大的AI助手，支持多种交互模式：
              <br />• 💬 <strong>对话模式</strong>：自由聊天，上下文记忆
              <br />• 🌐 <strong>网络搜索</strong>：获取最新信息，实时搜索
              <br />• 📚 <strong>知识库模式</strong>：上传文档，智能分析问答
              <br />• 📄 支持PDF、DOCX、TXT、MD等多种格式
            </p>
            <button
              onClick={openChatBox}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>⚡</span>
              <span>立即体验AI对话</span>
            </button>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-green-200 hover:-translate-y-3 animate-card-up animation-delay-200">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
              🎯
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Cursor & MCP
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Cursor IDE使用技巧分享，MCP协议实践应用，提升开发效率的秘籍大全
            </p>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-orange-200 hover:-translate-y-3 animate-card-up animation-delay-400">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
              🛠️
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">效率工具集</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              精选优质效率工具推荐，涵盖开发、设计、办公等多个领域，助力提升工作效率
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
