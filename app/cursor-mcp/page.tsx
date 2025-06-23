"use client";

import { useState } from "react";
import Image from "next/image";

export default function CursorMCPPage() {
  const [activeTab, setActiveTab] = useState<"plugin" | "rules" | "mcp">(
    "plugin"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">🎯</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Cursor & MCP 生态系统
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            探索 DiFlow 插件，收集优质 Cursor Rules，发现强大的 MCP 服务
          </p>
        </div>

        {/* 标签页导航 */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/50">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("plugin")}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === "plugin"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <span className="mr-2">🔌</span>DiFlow 插件
              </button>
              <button
                onClick={() => setActiveTab("rules")}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === "rules"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <span className="mr-2">📋</span>Rule 收录
              </button>
              <button
                onClick={() => setActiveTab("mcp")}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === "mcp"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <span className="mr-2">🔗</span>MCP 收录
              </button>
            </div>
          </div>
        </div>

        {/* DiFlow 插件介绍 */}
        {activeTab === "plugin" && (
          <div className="space-y-12">
            {/* 插件简介 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">🚀</div>
                <h2 className="text-3xl font-bold text-gray-800">
                  DiFlow VSCode 插件
                </h2>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                DiFlow 是一个专为 Cursor IDE 设计的 VSCode 插件，旨在简化 Cursor
                Rules 和 MCP 服务的同步与分享。 通过
                DiFlow，您可以轻松管理项目配置，与团队成员共享最佳实践，提升开发效率。
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl mb-2">⚡</div>
                  <h3 className="font-semibold text-gray-800 mb-2">快速同步</h3>
                  <p className="text-sm text-gray-600">
                    一键同步 Cursor Rules 和 MCP 配置
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl mb-2">🤝</div>
                  <h3 className="font-semibold text-gray-800 mb-2">团队协作</h3>
                  <p className="text-sm text-gray-600">
                    轻松分享配置给团队成员
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl mb-2">📦</div>
                  <h3 className="font-semibold text-gray-800 mb-2">配置管理</h3>
                  <p className="text-sm text-gray-600">
                    统一管理多项目配置文件
                  </p>
                </div>
              </div>
            </div>

            {/* 安装使用教程 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-2xl mr-3">📖</span>安装与使用教程
              </h2>

              <div className="space-y-8">
                {/* 安装步骤 */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    📥 安装步骤
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-medium">打开 VSCode 扩展商店</p>
                        <p className="text-sm text-gray-600">
                          使用快捷键{" "}
                          <code className="bg-gray-200 px-2 py-1 rounded">
                            Ctrl+Shift+X
                          </code>{" "}
                          (Windows/Linux) 或{" "}
                          <code className="bg-gray-200 px-2 py-1 rounded">
                            Cmd+Shift+X
                          </code>{" "}
                          (Mac)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                        2
                      </div>
                      <div>
                        <p className="font-medium">搜索 "DiFlow"</p>
                        <p className="text-sm text-gray-600">
                          在搜索框中输入 "DiFlow" 并按回车
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                        3
                      </div>
                      <div>
                        <p className="font-medium">安装插件</p>
                        <p className="text-sm text-gray-600">
                          点击 "Install" 按钮完成安装
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 功能介绍 */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    ✨ 主要功能
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <span className="mr-2">🔄</span>Rules 同步
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• 一键导入/导出 .cursorrules 文件</li>
                        <li>• 支持多项目配置管理</li>
                        <li>• 自动检测配置变更</li>
                      </ul>
                      <div className="mt-4 p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-500 mb-2">
                          预留图片位置：Rules 同步界面截图
                        </p>
                        <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400">📷 图片占位符</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <span className="mr-2">🔗</span>MCP 配置
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• 可视化 MCP 服务配置</li>
                        <li>• 预设常用 MCP 服务模板</li>
                        <li>• 配置验证与测试</li>
                      </ul>
                      <div className="mt-4 p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-500 mb-2">
                          预留图片位置：MCP 配置界面截图
                        </p>
                        <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400">📷 图片占位符</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 使用方法 */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    🎮 使用方法
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <kbd className="px-3 py-1 bg-gray-800 text-white rounded">
                          Ctrl+Shift+P
                        </kbd>
                        <span className="text-gray-600">打开命令面板</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <code className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
                          DiFlow: Sync Rules
                        </code>
                        <span className="text-gray-600">同步 Cursor Rules</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <code className="px-3 py-1 bg-purple-100 text-purple-800 rounded">
                          DiFlow: Configure MCP
                        </code>
                        <span className="text-gray-600">配置 MCP 服务</span>
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-white rounded-lg">
                      <p className="text-xs text-gray-500 mb-2">
                        预留图片位置：命令面板使用截图
                      </p>
                      <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">📷 图片占位符</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rule 收录板块 */}
        {activeTab === "rules" && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                📋 Cursor Rules 收录
              </h2>
              <p className="text-lg text-gray-600">
                精选适合程序员的 Cursor Rules，按技术栈分类整理
              </p>
            </div>

            {/* User Rules */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-3">👤</span>通用 User Rules
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    代码质量规则
                  </h4>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono mb-4">
                    <div>// 优先使用 TypeScript</div>
                    <div>// 使用 ESLint 和 Prettier</div>
                    <div>// 遵循 SOLID 原则</div>
                    <div>// 编写单元测试</div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    📋 复制规则
                  </button>
                </div>
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-3">命名规范</h4>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono mb-4">
                    <div>// 使用 camelCase 命名变量</div>
                    <div>// 使用 PascalCase 命名类</div>
                    <div>// 使用 UPPER_CASE 命名常量</div>
                    <div>// 函数名应该是动词</div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    📋 复制规则
                  </button>
                </div>
              </div>
            </div>

            {/* 项目 Rules 分类 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-3">🏗️</span>项目 Rules 分类
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {/* React Rules */}
                <div className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">⚛️</span>
                    <h4 className="font-semibold text-gray-800">React</h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-white rounded-lg">
                      <p className="font-medium">组件规范</p>
                      <p className="text-gray-600">使用函数组件和 Hooks</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="font-medium">状态管理</p>
                      <p className="text-gray-600">
                        优先使用 useState 和 useContext
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="font-medium">性能优化</p>
                      <p className="text-gray-600">合理使用 memo 和 useMemo</p>
                    </div>
                  </div>
                  <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    📋 查看完整规则
                  </button>
                </div>

                {/* Vue Rules */}
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">💚</span>
                    <h4 className="font-semibold text-gray-800">Vue</h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-white rounded-lg">
                      <p className="font-medium">Composition API</p>
                      <p className="text-gray-600">优先使用 Composition API</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="font-medium">响应式数据</p>
                      <p className="text-gray-600">合理使用 ref 和 reactive</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="font-medium">组件通信</p>
                      <p className="text-gray-600">使用 props 和 emit</p>
                    </div>
                  </div>
                  <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    📋 查看完整规则
                  </button>
                </div>

                {/* Next.js Rules */}
                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">▲</span>
                    <h4 className="font-semibold text-gray-800">Next.js</h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-white rounded-lg">
                      <p className="font-medium">App Router</p>
                      <p className="text-gray-600">使用 App Router 架构</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="font-medium">服务端组件</p>
                      <p className="text-gray-600">
                        优先使用 Server Components
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="font-medium">数据获取</p>
                      <p className="text-gray-600">使用 fetch 和缓存策略</p>
                    </div>
                  </div>
                  <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    📋 查看完整规则
                  </button>
                </div>

                {/* Node.js/Nest.js Rules */}
                <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">🟢</span>
                    <h4 className="font-semibold text-gray-800">
                      Node.js/Nest.js
                    </h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-white rounded-lg">
                      <p className="font-medium">模块化</p>
                      <p className="text-gray-600">使用 ES6 模块语法</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="font-medium">错误处理</p>
                      <p className="text-gray-600">统一异常处理机制</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="font-medium">依赖注入</p>
                      <p className="text-gray-600">使用装饰器和 DI 容器</p>
                    </div>
                  </div>
                  <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    📋 查看完整规则
                  </button>
                </div>

                {/* Nuxt Rules */}
                <div className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">💎</span>
                    <h4 className="font-semibold text-gray-800">Nuxt</h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-white rounded-lg">
                      <p className="font-medium">SSR/SSG</p>
                      <p className="text-gray-600">合理选择渲染模式</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="font-medium">自动导入</p>
                      <p className="text-gray-600">利用 Nuxt 自动导入功能</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="font-medium">模块生态</p>
                      <p className="text-gray-600">使用官方和社区模块</p>
                    </div>
                  </div>
                  <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    📋 查看完整规则
                  </button>
                </div>

                {/* Electron Rules */}
                <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">⚡</span>
                    <h4 className="font-semibold text-gray-800">Electron</h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-white rounded-lg">
                      <p className="font-medium">进程通信</p>
                      <p className="text-gray-600">
                        使用 IPC 进行主渲染进程通信
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="font-medium">安全性</p>
                      <p className="text-gray-600">禁用 Node.js 集成</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg">
                      <p className="font-medium">性能优化</p>
                      <p className="text-gray-600">合理管理窗口和内存</p>
                    </div>
                  </div>
                  <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    📋 查看完整规则
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MCP 收录板块 */}
        {activeTab === "mcp" && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                🔗 MCP 服务收录
              </h2>
              <p className="text-lg text-gray-600">
                精选对程序员有用的 MCP 服务，提升 AI 开发体验
              </p>
            </div>

            {/* 设计与开发类 MCP */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-3">🎨</span>设计与开发
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Figma MCP */}
                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">🎯</span>
                    <h4 className="font-semibold text-gray-800">
                      Figma Context MCP
                    </h4>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    连接 Figma 设计文件，让 AI 理解设计布局并生成相应代码
                  </p>
                  <div className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono mb-4">
                    <div>{`{`}</div>
                    <div>&nbsp;&nbsp;"mcpServers": {`{`}</div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;"Figma MCP": {`{`}</div>
                    <div>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"command": "npx",
                    </div>
                    <div>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"args": ["-y",
                      "figma-developer-mcp",
                    </div>
                    <div>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"--figma-api-key=YOUR-KEY",
                      "--stdio"]
                    </div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;{`}`}</div>
                    <div>&nbsp;&nbsp;{`}`}</div>
                    <div>{`}`}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">⭐ 8.9 信任度</span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      📋 复制配置
                    </button>
                  </div>
                </div>

                {/* Browser Use MCP */}
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">🌐</span>
                    <h4 className="font-semibold text-gray-800">
                      Browser Use MCP
                    </h4>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    让 AI 能够控制浏览器，自动化网页操作和数据抓取
                  </p>
                  <div className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono mb-4">
                    <div>{`{`}</div>
                    <div>&nbsp;&nbsp;"mcpServers": {`{`}</div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;"Browser Use": {`{`}</div>
                    <div>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"command": "npx",
                    </div>
                    <div>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"args": ["-y",
                      "browser-use-mcp-server"]
                    </div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;{`}`}</div>
                    <div>&nbsp;&nbsp;{`}`}</div>
                    <div>{`}`}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">⭐ 7.3 信任度</span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      📋 复制配置
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 文档与知识类 MCP */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-3">📚</span>文档与知识
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Context7 MCP */}
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">📖</span>
                    <h4 className="font-semibold text-gray-800">Context7</h4>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    提供最新的技术文档和库信息，帮助 AI 获取准确的编程知识
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-white rounded border-l-4 border-green-400">
                      <p className="font-medium">支持库：</p>
                      <p className="text-gray-600">
                        React, Vue, Next.js, Node.js, Python...
                      </p>
                    </div>
                    <div className="p-2 bg-white rounded border-l-4 border-blue-400">
                      <p className="font-medium">功能：</p>
                      <p className="text-gray-600">
                        实时文档查询、代码示例、最佳实践
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-gray-500">
                      ⭐ 9.0+ 信任度
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      📋 查看配置
                    </button>
                  </div>
                </div>

                {/* DeepWiki MCP */}
                <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-100">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">🧠</span>
                    <h4 className="font-semibold text-gray-800">DeepWiki</h4>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    深度解析 GitHub 项目文档，提供项目结构和使用指南
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-white rounded border-l-4 border-orange-400">
                      <p className="font-medium">功能：</p>
                      <p className="text-gray-600">
                        项目文档分析、代码结构解读
                      </p>
                    </div>
                    <div className="p-2 bg-white rounded border-l-4 border-red-400">
                      <p className="font-medium">支持：</p>
                      <p className="text-gray-600">GitHub 仓库、README、Wiki</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-gray-500">⭐ 8.5 信任度</span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      📋 查看配置
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 开发工具类 MCP */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-3">🛠️</span>开发工具
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {/* File System MCP */}
                <div className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">📁</span>
                    <h4 className="font-semibold text-gray-800">File System</h4>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    让 AI 访问文件系统，读取和操作项目文件
                  </p>
                  <div className="bg-gray-900 text-green-400 p-2 rounded text-xs font-mono mb-3">
                    <div>npx @modelcontextprotocol/</div>
                    <div>server-filesystem /path</div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    📋 配置
                  </button>
                </div>

                {/* Git MCP */}
                <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">🔀</span>
                    <h4 className="font-semibold text-gray-800">Git</h4>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    Git 版本控制集成，查看提交历史和分支信息
                  </p>
                  <div className="bg-gray-900 text-green-400 p-2 rounded text-xs font-mono mb-3">
                    <div>npx @modelcontextprotocol/</div>
                    <div>server-git /repo/path</div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    📋 配置
                  </button>
                </div>

                {/* Database MCP */}
                <div className="p-6 bg-gradient-to-br from-teal-50 to-green-50 rounded-xl border border-teal-100">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">🗄️</span>
                    <h4 className="font-semibold text-gray-800">Database</h4>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    数据库连接和查询，支持多种数据库类型
                  </p>
                  <div className="bg-gray-900 text-green-400 p-2 rounded text-xs font-mono mb-3">
                    <div>npx @modelcontextprotocol/</div>
                    <div>server-sqlite db.sqlite</div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    📋 配置
                  </button>
                </div>
              </div>
            </div>

            {/* API 与服务类 MCP */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-3">🌐</span>API 与服务
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Playwright MCP */}
                <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">🎭</span>
                    <h4 className="font-semibold text-gray-800">Playwright</h4>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    自动化浏览器测试和网页操作，支持多浏览器
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-white rounded border-l-4 border-yellow-400">
                      <p className="font-medium">功能：</p>
                      <p className="text-gray-600">
                        页面截图、表单填写、点击操作
                      </p>
                    </div>
                    <div className="p-2 bg-white rounded border-l-4 border-orange-400">
                      <p className="font-medium">支持：</p>
                      <p className="text-gray-600">Chrome, Firefox, Safari</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-4">
                    📋 查看配置
                  </button>
                </div>

                {/* HTTP MCP */}
                <div className="p-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-100">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">🌍</span>
                    <h4 className="font-semibold text-gray-800">HTTP Client</h4>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    HTTP 请求客户端，支持 REST API 调用和测试
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-white rounded border-l-4 border-rose-400">
                      <p className="font-medium">支持：</p>
                      <p className="text-gray-600">GET, POST, PUT, DELETE</p>
                    </div>
                    <div className="p-2 bg-white rounded border-l-4 border-pink-400">
                      <p className="font-medium">功能：</p>
                      <p className="text-gray-600">
                        请求头设置、认证、响应解析
                      </p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-4">
                    📋 查看配置
                  </button>
                </div>
              </div>
            </div>

            {/* 配置示例 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-3">⚙️</span>配置示例
              </h3>
              <div className="bg-gray-900 text-green-400 p-6 rounded-xl font-mono text-sm">
                <div className="text-gray-500 mb-2">
                  // Cursor settings.json MCP 配置示例
                </div>
                <div>{`{`}</div>
                <div>&nbsp;&nbsp;"mcpServers": {`{`}</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;"figma": {`{`}</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"command": "npx",</div>
                <div>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"args": ["-y",
                  "figma-developer-mcp", "--figma-api-key=YOUR_KEY", "--stdio"]
                </div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;{`},`}</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;"browser-use": {`{`}</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"command": "npx",</div>
                <div>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"args": ["-y",
                  "browser-use-mcp-server", "--stdio"]
                </div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;{`},`}</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;"filesystem": {`{`}</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"command": "npx",</div>
                <div>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"args": ["-y",
                  "@modelcontextprotocol/server-filesystem", "/path/to/project"]
                </div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;{`}`}</div>
                <div>&nbsp;&nbsp;{`}`}</div>
                <div>{`}`}</div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  将此配置添加到 Cursor 的 settings.json 文件中
                </p>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  📋 复制完整配置
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
