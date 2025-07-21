"use client";

import { useState } from "react";

/**
 * DiFlow 插件介绍组件
 * 展示插件的核心功能、安装指南和使用说明
 */
export default function PluginSection() {
  const [copySuccess, setCopySuccess] = useState(false);

  /**
   * 处理复制命令行安装指令
   */
  const handleCopyInstallCommand = async () => {
    try {
      await navigator.clipboard.writeText(
        "code --install-extension junfeng.diflow"
      );
      setCopySuccess(true);
      // 3秒后隐藏提示
      setTimeout(() => {
        setCopySuccess(false);
      }, 3000);
    } catch (error) {
      console.error("复制失败:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* 主要介绍区域 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⚡</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            DiFlow - 开发工具包
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            一个强大的 Visual Studio Code 扩展，通过智能代码管理、AI
            驱动的助手和无缝 Cursor 集成来简化您的开发工作流程
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="https://marketplace.visualstudio.com/items?itemName=junfeng.diflow"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              🔗 VS Code 市场下载
            </a>
            <div className="relative">
              <button
                onClick={handleCopyInstallCommand}
                className={`px-6 py-3 rounded-lg transition-all duration-300 font-medium ${
                  copySuccess
                    ? "bg-green-600 text-white"
                    : "bg-gray-600 text-white hover:bg-gray-700"
                }`}
              >
                {copySuccess ? "✅ 复制成功" : "📋 复制命令行安装"}
              </button>

              {/* 复制成功提示动画 */}
              {copySuccess && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap animate-bounce">
                  <div className="relative">
                    安装命令已复制到剪贴板
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-green-500"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 核心功能介绍 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* 技术架构 */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
            <h3 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center">
              <span className="mr-2">🏗️</span>技术架构
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>前端：Vue 3 + TypeScript + Vite</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>后端：TypeScript + VS Code Extension API</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>服务端：Nest.js 后端服务</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>对话功能：LangChain.js 实现</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>UI 框架：Ant Design Vue</span>
              </li>
            </ul>
          </div>

          {/* Cursor 集成 */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100">
            <h3 className="text-xl font-semibold text-cyan-800 mb-4 flex items-center">
              <span className="mr-2">⚡</span>Cursor 集成
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="text-cyan-500 mr-2">•</span>
                <span>智能 Rules 同步 - 一键同步开发规则到 Cursor</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-500 mr-2">•</span>
                <span>MCP 服务同步 - 自动配置和同步 MCP 服务</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-500 mr-2">•</span>
                <span>云端数据同步 - 跨设备同步配置和数据</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-500 mr-2">•</span>
                <span>团队协作分享 - 分享 Rules 和 MCP 配置</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-500 mr-2">•</span>
                <span>实时状态监控 - 监控同步状态和服务健康</span>
              </li>
            </ul>
          </div>

          {/* 智能代码块创建 */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
              <span className="mr-2">🧱</span>智能代码块创建
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>
                  一键代码块模板 - 在 `/materials/blocks` 预配置代码块并即时部署
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>
                  上下文感知部署 - 右键任意文件夹选择 "DiFlow → 创建代码块"
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>模板管理 - 组织和重用最常用的代码结构</span>
              </li>
            </ul>
          </div>

          {/* 智能代码片段 */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
            <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
              <span className="mr-2">📝</span>智能代码片段
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>
                  可视化片段创建器 - 通过直观的 webview 界面创建代码片段
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>
                  自动集成 - 片段自动保存到项目的 `.vscode/test.code-snippets`
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>即时可用 - 创建后立即可以使用您的片段</span>
              </li>
            </ul>
          </div>

          {/* AI 驱动的代码助手 */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
            <h3 className="text-xl font-semibold text-purple-800 mb-4 flex items-center">
              <span className="mr-2">🤖</span>AI 驱动的代码助手
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                <span>ChatGPT 集成 - 内置 ChatGPT 界面用于代码协助和解释</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                <span>代码解释 - 选择任何代码并获得即时 AI 驱动的解释</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                <span>支持多种 AI 模型 (gpt-3.5-turbo, gpt-4 等)</span>
              </li>
            </ul>
          </div>

          {/* 现代化界面 */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100">
            <h3 className="text-xl font-semibold text-yellow-800 mb-4 flex items-center">
              <span className="mr-2">🎨</span>现代化界面
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                <span>活动栏集成 - 活动栏中的专用 DiFlow 面板</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                <span>Webview 组件 - 现代 Vue.js 驱动的界面</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                <span>响应式设计 - 与 VS Code 主题匹配的清洁直观界面</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 使用指南 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          <span className="mr-3">🚀</span>使用指南
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="border-l-4 border-cyan-500 pl-4">
              <h4 className="font-semibold text-gray-800 mb-2">
                Cursor 集成同步
              </h4>
              <p className="text-sm text-gray-600">
                登录账户后，在云端同步面板中选择需要同步的 Rules 和 MCP
                服务，一键同步到 Cursor 编辑器，支持团队共享和跨设备同步
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-800 mb-2">创建代码块</h4>
              <p className="text-sm text-gray-600">
                在 `/materials/blocks/` 目录中创建模板文件，右键任意文件夹选择
                "DiFlow → 创建代码块"，模板内容将被复制到选定文件夹
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-gray-800 mb-2">创建代码片段</h4>
              <p className="text-sm text-gray-600">
                在任何代码编辑器中右键，选择 "DiFlow → 创建代码片段"，使用
                webview 界面配置片段，自动保存并立即可用
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-gray-800 mb-2">AI 代码解释</h4>
              <p className="text-sm text-gray-600">
                选择任何代码，右键选择 "DiFlow → 解释此代码"，在 ChatGPT
                面板中查看 AI 生成的解释
              </p>
            </div>
            <div className="border-l-4 border-indigo-500 pl-4">
              <h4 className="font-semibold text-gray-800 mb-2">MCP 服务管理</h4>
              <p className="text-sm text-gray-600">
                在 MCP 管理面板中添加、配置和监控各种 MCP
                服务器，支持一键部署和环境变量管理
              </p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-semibold text-gray-800 mb-2">团队协作分享</h4>
              <p className="text-sm text-gray-600">
                通过云端同步功能，团队成员可以共享 Rules 配置和 MCP
                服务设置，确保开发环境的一致性
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 配置说明 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          <span className="mr-3">⚙️</span>配置说明
        </h3>
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-4">
            通过 VS Code 设置配置 DiFlow：
          </p>
          <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
            {`{
  "DiFlow.hostname": "https://api.openai.com",
  "DiFlow.apiKey": "your-api-key-here",
  "DiFlow.model": "gpt-3.5-turbo"
}`}
          </pre>
          <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong className="text-gray-800">DiFlow.hostname</strong>
              <p className="text-gray-600">AI 服务的第三方代理地址</p>
            </div>
            <div>
              <strong className="text-gray-800">DiFlow.apiKey</strong>
              <p className="text-gray-600">AI 服务认证的 API 密钥</p>
            </div>
            <div>
              <strong className="text-gray-800">DiFlow.model</strong>
              <p className="text-gray-600">要使用的 ChatGPT 模型</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
