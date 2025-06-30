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
    // 直接触发GlobalChatButton的点击，让它处理登录检查和显示逻辑
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
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              专业的开发规则与协议指南：
              <br />• 🎨 <strong>Cursor Rules</strong>
              ：React、Vue、Next.js等框架开发规范
              <br />• 🔌 <strong>MCP协议</strong>：Model Context
              Protocol实践应用
              <br />• 📋 <strong>代码规范</strong>：命名规范、代码质量、最佳实践
              <br />• 🚀 <strong>效率提升</strong>：IDE配置、插件推荐、开发技巧
            </p>
            <button
              onClick={() => (window.location.href = "/cursor-mcp")}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>🎯</span>
              <span>查看开发规范</span>
            </button>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-orange-200 hover:-translate-y-3 animate-card-up animation-delay-400">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
              🛠️
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">效率工具集</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              精选实用的在线开发工具：
              <br />• 📄 <strong>JSON格式化</strong>：格式化、压缩、验证JSON数据
              <br />• 🔍 <strong>正则测试</strong>：实时测试正则表达式匹配
              <br />• 🍎 <strong>Mac软件</strong>：开发、设计、生产力工具推荐
              <br />• 🔐 <strong>编码工具</strong>：Base64、URL编码、Hash生成等
            </p>
            <button
              onClick={() => (window.location.href = "/tools")}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>🛠️</span>
              <span>探索工具集</span>
            </button>
          </div>
        </div>

        {/* SEO内容区域 */}
        <div className="mt-20 max-w-4xl mx-auto">
          {/* 关于DiFlow */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 mb-12 shadow-lg border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              为什么选择 DiFlow AI 工作流平台？
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  🚀 专为程序员设计
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  DiFlow深度理解程序员的工作需求，提供代码辅助、技术文档分析、API文档查询等专业功能。
                  无论是前端开发、后端架构还是全栈开发，DiFlow都能成为您的得力助手。
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  🧠 智能化工作流
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  通过AI驱动的智能工作流，DiFlow能够自动化处理重复性任务，让您专注于创造性工作。
                  从需求分析到代码生成，从测试到部署，全流程智能化支持。
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  📚 强大的知识库
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  DiFlow支持上传各种技术文档、API文档、项目文档，构建专属知识库。
                  通过向量搜索和语义理解，快速找到所需信息，提升工作效率。
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  🌐 实时信息获取
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  集成网络搜索功能，DiFlow能够获取最新的技术资讯、开源项目、解决方案。
                  让您始终保持技术前沿，掌握最新的开发动态。
                </p>
              </div>
            </div>
          </section>

          {/* 功能特色详解 */}
          <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-12 border border-blue-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              DiFlow 核心功能详解
            </h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0">
                  💬
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    AI智能对话系统
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    DiFlow的AI对话系统基于先进的大语言模型，支持上下文记忆、多轮对话、代码生成等功能。
                    无论是技术咨询、代码调试还是架构设计，DiFlow都能提供专业的建议和解决方案。
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0">
                  📄
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    文档智能分析
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    上传PDF、Word、Markdown等格式的技术文档，DiFlow能够智能解析内容，
                    构建知识图谱，支持基于文档内容的精准问答和信息检索。
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0">
                  🔍
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    网络搜索增强
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    集成实时网络搜索，DiFlow能够获取最新的技术资讯、开源项目、API文档等信息，
                    结合AI分析能力，为您提供准确、及时的技术支持。
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 使用场景 */}
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              DiFlow 适用场景
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  👨‍💻
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  软件开发
                </h3>
                <p className="text-gray-600 text-sm">
                  代码审查、架构设计、技术选型、调试支持
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  📊
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  项目管理
                </h3>
                <p className="text-gray-600 text-sm">
                  需求分析、进度跟踪、文档管理、团队协作
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  🎓
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  技术学习
                </h3>
                <p className="text-gray-600 text-sm">
                  知识整理、概念理解、最佳实践、技能提升
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
