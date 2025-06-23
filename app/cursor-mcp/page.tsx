"use client";

import { useState } from "react";
import Image from "next/image";

// 真实的 Cursor Rules 数据
const cursorRulesData = {
  general: {
    codeQuality: `# 代码质量规则

## 基本原则
- 优先使用 TypeScript 而不是 JavaScript
- 使用 ESLint 和 Prettier 进行代码格式化
- 遵循 SOLID 原则编写可维护的代码
- 为复杂逻辑编写单元测试
- 使用有意义的变量和函数名
- 避免深度嵌套，保持代码扁平化
- 添加必要的注释和文档

## 错误处理
- 使用 try-catch 处理异步操作
- 提供有意义的错误信息
- 记录错误日志便于调试

## 性能优化
- 避免不必要的重新渲染
- 使用适当的缓存策略
- 优化图片和资源加载`,

    naming: `# 命名规范

## 变量命名
- 使用 camelCase 命名变量和函数
- 使用 PascalCase 命名类和组件
- 使用 UPPER_CASE 命名常量
- 布尔变量使用 is/has/can 前缀

## 函数命名
- 函数名应该是动词，表示动作
- 使用描述性的名称，避免缩写
- 事件处理函数使用 handle 前缀

## 文件命名
- 组件文件使用 PascalCase
- 工具函数文件使用 camelCase
- 常量文件使用 UPPER_CASE`,
  },

  react: `# React 开发规则

## 组件规范
- 优先使用函数组件和 React Hooks
- 使用 TypeScript 定义 Props 接口
- 组件文件结构：imports -> types -> component -> export
- 使用 forwardRef 处理 ref 传递

## 状态管理
- 优先使用 useState 和 useContext
- 复杂状态使用 useReducer
- 避免 prop drilling，合理使用 Context
- 使用 useMemo 和 useCallback 优化性能

## 生命周期
- 使用 useEffect 处理副作用
- 清理定时器和事件监听器
- 正确设置依赖数组

## 样式处理
- 使用 CSS Modules 或 styled-components
- 避免内联样式，除非动态样式
- 使用 Tailwind CSS 的实用类

参考资源：
- React 官方文档：https://react.dev/
- React TypeScript 指南：https://react-typescript-cheatsheet.netlify.app/`,

  vue: `# Vue 开发规则

## Composition API
- 优先使用 Composition API 而不是 Options API
- 使用 <script setup> 语法糖
- 合理组织 composables

## 响应式数据
- 基本类型使用 ref()
- 对象类型使用 reactive()
- 使用 computed() 处理派生状态
- 使用 watch() 监听数据变化

## 组件通信
- 使用 props 向下传递数据
- 使用 emit 向上传递事件
- 使用 provide/inject 处理跨层级通信

## 模板语法
- 使用 v-for 时总是添加 key
- 避免在模板中使用复杂表达式
- 使用 v-show 而不是 v-if 处理频繁切换

参考资源：
- Vue 3 官方文档：https://vuejs.org/
- Vue 3 迁移指南：https://v3-migration.vuejs.org/`,

  nextjs: `# Next.js 开发规则

## App Router
- 使用 App Router 而不是 Pages Router
- 合理使用 Server Components 和 Client Components
- 使用 layout.tsx 定义布局

## 数据获取
- 使用 fetch() 进行数据获取
- 合理使用缓存策略：force-cache, no-store, revalidate
- 使用 Suspense 处理加载状态

## 路由和导航
- 使用 Link 组件进行导航
- 使用 useRouter hook 进行编程式导航
- 使用动态路由处理参数

## 性能优化
- 使用 Image 组件优化图片
- 使用 dynamic() 进行代码分割
- 合理使用 generateStaticParams

参考资源：
- Next.js 官方文档：https://nextjs.org/docs
- Next.js 最佳实践：https://nextjs.org/docs/pages/building-your-application/deploying/production-checklist`,

  nodejs: `# Node.js/Nest.js 开发规则

## 模块化
- 使用 ES6 模块语法 import/export
- 合理组织目录结构
- 使用 index.ts 文件作为模块入口

## 错误处理
- 使用统一的异常处理机制
- 创建自定义错误类
- 记录详细的错误日志

## 依赖注入 (Nest.js)
- 使用 @Injectable() 装饰器
- 合理使用 DI 容器
- 使用接口定义服务契约

## API 设计
- 遵循 RESTful 设计原则
- 使用适当的 HTTP 状态码
- 实现请求验证和响应序列化

参考资源：
- Node.js 官方文档：https://nodejs.org/docs/
- Nest.js 官方文档：https://docs.nestjs.com/`,

  nuxt: `# Nuxt 开发规则

## 渲染模式
- 根据需求选择 SSR/SSG/SPA
- 使用 nuxt.config.ts 配置渲染策略
- 合理使用 hybrid 渲染

## 自动导入
- 利用 Nuxt 的自动导入功能
- 组件放在 components/ 目录
- Composables 放在 composables/ 目录

## 模块生态
- 优先使用官方模块
- 使用 @nuxtjs/tailwindcss 处理样式
- 使用 @pinia/nuxt 进行状态管理

参考资源：
- Nuxt 3 官方文档：https://nuxt.com/docs
- Nuxt 模块列表：https://nuxt.com/modules`,

  electron: `# Electron 开发规则

## 进程通信
- 使用 IPC 进行主进程和渲染进程通信
- 使用 preload 脚本暴露安全的 API
- 避免在渲染进程中直接使用 Node.js API

## 安全性
- 禁用 Node.js 集成在渲染进程中
- 启用上下文隔离
- 验证所有 IPC 消息

## 性能优化
- 合理管理窗口生命周期
- 使用 webSecurity 控制安全策略
- 优化应用启动时间

参考资源：
- Electron 官方文档：https://www.electronjs.org/docs
- Electron 安全指南：https://www.electronjs.org/docs/tutorial/security`,
};

// 真实的 MCP 服务数据
const mcpServersData = [
  {
    name: "Figma Context MCP",
    icon: "🎯",
    description: "连接 Figma 设计文件，让 AI 理解设计布局并生成相应代码",
    category: "design",
    trust: 8.9,
    config: `{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--figma-api-key=YOUR_KEY", "--stdio"]
    }
  }
}`,
    link: "https://github.com/figma/figma-developer-mcp",
  },
  {
    name: "Browser Use MCP",
    icon: "🌐",
    description: "让 AI 能够控制浏览器，自动化网页操作和数据抓取",
    category: "design",
    trust: 7.3,
    config: `{
  "mcpServers": {
    "browser-use": {
      "command": "npx",
      "args": ["-y", "browser-use-mcp-server", "--stdio"]
    }
  }
}`,
    link: "https://github.com/browser-use/mcp-server",
  },
  {
    name: "Context7",
    icon: "📖",
    description: "提供最新的技术文档和库信息，帮助 AI 获取准确的编程知识",
    category: "docs",
    trust: 9.2,
    config: "通过 MCP 客户端自动配置",
    link: "https://context7.ai/",
  },
  {
    name: "DeepWiki",
    icon: "🧠",
    description: "深度解析 GitHub 项目文档，提供项目结构和使用指南",
    category: "docs",
    trust: 8.5,
    config: "通过 MCP 客户端自动配置",
    link: "https://deepwiki.ai/",
  },
  {
    name: "File System MCP",
    icon: "📁",
    description: "让 AI 访问文件系统，读取和操作项目文件",
    category: "tools",
    trust: 9.0,
    config: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/project", "--stdio"]
    }
  }
}`,
    link: "https://github.com/modelcontextprotocol/servers",
  },
  {
    name: "Git MCP",
    icon: "🔀",
    description: "Git 版本控制集成，查看提交历史和分支信息",
    category: "tools",
    trust: 8.8,
    config: `{
  "mcpServers": {
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git", "/repo/path", "--stdio"]
    }
  }
}`,
    link: "https://github.com/modelcontextprotocol/servers",
  },
  {
    name: "Database MCP",
    icon: "🗄️",
    description: "数据库连接和查询，支持多种数据库类型",
    category: "tools",
    trust: 8.6,
    config: `{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sqlite", "database.db", "--stdio"]
    }
  }
}`,
    link: "https://github.com/modelcontextprotocol/servers",
  },
  {
    name: "Playwright MCP",
    icon: "🎭",
    description: "自动化浏览器测试和网页操作，支持多浏览器",
    category: "api",
    trust: 8.4,
    config: "通过 MCP 客户端自动配置",
    link: "https://playwright.dev/",
  },
  {
    name: "HTTP Client MCP",
    icon: "🌍",
    description: "HTTP 请求客户端，支持 REST API 调用和测试",
    category: "api",
    trust: 8.2,
    config: `{
  "mcpServers": {
    "http": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-http", "--stdio"]
    }
  }
}`,
    link: "https://github.com/modelcontextprotocol/servers",
  },
];

export default function CursorMCPPage() {
  const [activeTab, setActiveTab] = useState<"plugin" | "rules" | "mcp">(
    "plugin"
  );
  const [selectedRule, setSelectedRule] = useState<string | null>(null);
  const [selectedMCP, setSelectedMCP] = useState<any>(null);
  const [copiedText, setCopiedText] = useState<string>("");

  /**
   * 复制文本到剪贴板
   * @param text 要复制的文本内容
   * @param type 复制类型，用于显示提示
   */
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      setTimeout(() => setCopiedText(""), 2000);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  /**
   * 打开外部链接
   * @param url 要打开的链接地址
   */
  const openExternalLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 pt-16">
      {/* 复制成功提示 */}
      {copiedText && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-delay">
          ✅ {copiedText} 已复制到剪贴板
        </div>
      )}

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
          <div className="mt-4 flex justify-center space-x-4">
            <a
              href="https://mcp.so/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              🔗 访问 MCP.so 获取更多服务
            </a>
            <a
              href="https://github.com/modelcontextprotocol/servers"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              📚 官方 MCP 服务器仓库
            </a>
          </div>
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

        {/* 标签页内容 */}
        <div className="max-w-6xl mx-auto">
          {/* DiFlow 插件介绍 */}
          {activeTab === "plugin" && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">⚡</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  DiFlow 智能开发插件
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  专为 Cursor 设计的智能开发助手，集成 Rules 同步、MCP
                  配置、代码优化等功能
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                    <span className="mr-2">🎯</span>核心功能
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>智能 Rules 同步与管理</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>一键 MCP 服务配置</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>代码质量实时检测</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>项目模板快速生成</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                  <h3 className="text-xl font-semibold text-purple-800 mb-4 flex items-center">
                    <span className="mr-2">📦</span>安装指南
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 border border-purple-200">
                      <p className="text-sm text-gray-600 mb-2">
                        1. 从扩展市场安装
                      </p>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        Cursor Extensions → 搜索 "DiFlow"
                      </code>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-purple-200">
                      <p className="text-sm text-gray-600 mb-2">
                        2. 或手动安装
                      </p>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        下载 .vsix 文件并安装
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                  <span className="mr-2">🚀</span>使用指南
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="text-2xl mb-2">1️⃣</div>
                    <h4 className="font-medium text-green-800 mb-2">
                      配置 Rules
                    </h4>
                    <p className="text-sm text-gray-600">
                      从 Rule 收录中选择适合的规则，一键同步到项目
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="text-2xl mb-2">2️⃣</div>
                    <h4 className="font-medium text-green-800 mb-2">
                      配置 MCP
                    </h4>
                    <p className="text-sm text-gray-600">
                      选择需要的 MCP 服务，自动生成配置文件
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="text-2xl mb-2">3️⃣</div>
                    <h4 className="font-medium text-green-800 mb-2">
                      开始开发
                    </h4>
                    <p className="text-sm text-gray-600">
                      享受智能提示和代码优化建议
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rule 收录 */}
          {activeTab === "rules" && (
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                  <span className="mr-3">📋</span>Cursor Rules 收录
                </h2>
                <p className="text-lg text-gray-600 text-center mb-8">
                  精选高质量的 Cursor Rules，提升开发效率和代码质量
                </p>

                {/* 规则分类 */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* 通用规则 */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                    <h3 className="text-xl font-semibold text-blue-800 mb-4">
                      🔧 通用规则
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() =>
                          setSelectedRule(cursorRulesData.general.codeQuality)
                        }
                        className="w-full text-left p-3 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                      >
                        <div className="font-medium text-blue-800">
                          代码质量
                        </div>
                        <div className="text-sm text-gray-600">
                          基本原则、错误处理、性能优化
                        </div>
                      </button>
                      <button
                        onClick={() =>
                          setSelectedRule(cursorRulesData.general.naming)
                        }
                        className="w-full text-left p-3 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                      >
                        <div className="font-medium text-blue-800">
                          命名规范
                        </div>
                        <div className="text-sm text-gray-600">
                          变量、函数、文件命名规则
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* React 规则 */}
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100">
                    <h3 className="text-xl font-semibold text-cyan-800 mb-4">
                      ⚛️ React
                    </h3>
                    <button
                      onClick={() => setSelectedRule(cursorRulesData.react)}
                      className="w-full text-left p-3 bg-white rounded-lg border border-cyan-200 hover:bg-cyan-50 transition-colors"
                    >
                      <div className="font-medium text-cyan-800">
                        React 开发规则
                      </div>
                      <div className="text-sm text-gray-600">
                        组件、Hooks、性能优化
                      </div>
                    </button>
                  </div>

                  {/* Vue 规则 */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                    <h3 className="text-xl font-semibold text-green-800 mb-4">
                      🔥 Vue
                    </h3>
                    <button
                      onClick={() => setSelectedRule(cursorRulesData.vue)}
                      className="w-full text-left p-3 bg-white rounded-lg border border-green-200 hover:bg-green-50 transition-colors"
                    >
                      <div className="font-medium text-green-800">
                        Vue 开发规则
                      </div>
                      <div className="text-sm text-gray-600">
                        Composition API、响应式
                      </div>
                    </button>
                  </div>

                  {/* Next.js 规则 */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                    <h3 className="text-xl font-semibold text-purple-800 mb-4">
                      ▲ Next.js
                    </h3>
                    <button
                      onClick={() => setSelectedRule(cursorRulesData.nextjs)}
                      className="w-full text-left p-3 bg-white rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors"
                    >
                      <div className="font-medium text-purple-800">
                        Next.js 开发规则
                      </div>
                      <div className="text-sm text-gray-600">
                        App Router、SSR、优化
                      </div>
                    </button>
                  </div>

                  {/* Node.js 规则 */}
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100">
                    <h3 className="text-xl font-semibold text-yellow-800 mb-4">
                      🟢 Node.js
                    </h3>
                    <button
                      onClick={() => setSelectedRule(cursorRulesData.nodejs)}
                      className="w-full text-left p-3 bg-white rounded-lg border border-yellow-200 hover:bg-yellow-50 transition-colors"
                    >
                      <div className="font-medium text-yellow-800">
                        Node.js/Nest.js 规则
                      </div>
                      <div className="text-sm text-gray-600">
                        模块化、错误处理、API
                      </div>
                    </button>
                  </div>

                  {/* Nuxt 规则 */}
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100">
                    <h3 className="text-xl font-semibold text-teal-800 mb-4">
                      💚 Nuxt
                    </h3>
                    <button
                      onClick={() => setSelectedRule(cursorRulesData.nuxt)}
                      className="w-full text-left p-3 bg-white rounded-lg border border-teal-200 hover:bg-teal-50 transition-colors"
                    >
                      <div className="font-medium text-teal-800">
                        Nuxt 开发规则
                      </div>
                      <div className="text-sm text-gray-600">
                        SSR、自动导入、模块
                      </div>
                    </button>
                  </div>

                  {/* Electron 规则 */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                    <h3 className="text-xl font-semibold text-indigo-800 mb-4">
                      🖥️ Electron
                    </h3>
                    <button
                      onClick={() => setSelectedRule(cursorRulesData.electron)}
                      className="w-full text-left p-3 bg-white rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors"
                    >
                      <div className="font-medium text-indigo-800">
                        Electron 开发规则
                      </div>
                      <div className="text-sm text-gray-600">
                        进程通信、安全性、性能
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* 规则详情弹窗 */}
              {selectedRule && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-2xl font-bold text-gray-800">
                        规则详情
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            copyToClipboard(selectedRule, "规则内容")
                          }
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          📋 复制
                        </button>
                        <button
                          onClick={() => setSelectedRule(null)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          ✕ 关闭
                        </button>
                      </div>
                    </div>
                    <div className="p-6 overflow-y-auto max-h-[60vh]">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                        {selectedRule}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MCP 收录 */}
          {activeTab === "mcp" && (
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                  <span className="mr-3">🔗</span>MCP 服务收录
                </h2>
                <p className="text-lg text-gray-600 text-center mb-8">
                  精选优质的 Model Context Protocol 服务，扩展 AI 能力边界
                </p>

                {/* MCP 服务网格 */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mcpServersData.map((server, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedMCP(server)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-3xl">{server.icon}</div>
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-sm font-medium text-gray-600">
                            {server.trust}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {server.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {server.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {server.category}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openExternalLink(server.link);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          查看详情 →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MCP 详情弹窗 */}
              {selectedMCP && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{selectedMCP.icon}</span>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800">
                            {selectedMCP.name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm text-gray-600">
                              信任度: {selectedMCP.trust}/10
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            copyToClipboard(selectedMCP.config, "MCP 配置")
                          }
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          📋 复制配置
                        </button>
                        <button
                          onClick={() => openExternalLink(selectedMCP.link)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          🔗 访问链接
                        </button>
                        <button
                          onClick={() => setSelectedMCP(null)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          ✕ 关闭
                        </button>
                      </div>
                    </div>
                    <div className="p-6 overflow-y-auto max-h-[60vh]">
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                          服务描述
                        </h4>
                        <p className="text-gray-600">
                          {selectedMCP.description}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                          配置信息
                        </h4>
                        <pre className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 overflow-x-auto">
                          {selectedMCP.config}
                        </pre>
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
  );
}
