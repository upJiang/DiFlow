"use client";

import { useState } from "react";
import PluginSection from "./components/PluginSection";
import RulesSection from "./components/RulesSection";
import MCPSection from "./components/MCPSection";

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

// 真实的 MCP 服务数据 - 基于用户的实际配置
const mcpServersData = [
  {
    name: "Figma Developer MCP",
    icon: "🎯",
    description: "连接 Figma 设计文件，让 AI 理解设计布局并生成相应代码",
    category: "design",
    trust: 8.9,
    config: `{
  "mcpServers": {
    "Framelink Figma MCP": {
      "command": "npx",
      "args": [
        "-y",
        "figma-developer-mcp",
        "--figma-api-key=YOUR_FIGMA_API_KEY",
        "--stdio"
      ]
    }
  }
}`,
    link: "https://github.com/figma/figma-developer-mcp",
  },
  {
    name: "Playwright MCP",
    icon: "🎭",
    description: "自动化浏览器测试和网页操作，支持多浏览器",
    category: "api",
    trust: 8.4,
    config: `{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@executeautomation/playwright-mcp-server"]
    }
  }
}`,
    link: "https://github.com/executeautomation/playwright-mcp-server",
  },
  {
    name: "Sequential Thinking MCP",
    icon: "🧠",
    description: "提供结构化思维和推理能力，增强 AI 的逻辑处理",
    category: "tools",
    trust: 8.7,
    config: `{
  "mcpServers": {
    "sequentialthinking": {
      "command": "npx",
      "args": ["-y", "mcprouter"],
      "env": {
        "SERVER_KEY": "YOUR_SERVER_KEY"
      }
    }
  }
}`,
    link: "https://github.com/sequentialthinking/mcp-router",
  },
  {
    name: "Browser Tools MCP",
    icon: "🌐",
    description: "浏览器自动化工具集，支持网页抓取和操作",
    category: "tools",
    trust: 8.2,
    config: `{
  "mcpServers": {
    "browser-tools": {
      "command": "npx",
      "args": ["-y", "@agentdeskai/browser-tools-mcp@1.2.0"]
    }
  }
}`,
    link: "https://github.com/agentdeskai/browser-tools-mcp",
  },
  {
    name: "Exa Search MCP",
    icon: "🔍",
    description: "强大的搜索引擎 API，提供精准的网络搜索能力",
    category: "api",
    trust: 8.5,
    config: `{
  "mcpServers": {
    "exa": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://mcp.exa.ai/mcp?exaApiKey=YOUR_EXA_API_KEY"
      ]
    }
  }
}`,
    link: "https://exa.ai/",
  },
  {
    name: "DeepWiki SSE",
    icon: "📖",
    description: "深度解析 GitHub 项目文档，提供项目结构和使用指南",
    category: "docs",
    trust: 8.6,
    config: `{
  "mcpServers": {
    "deepwiki-sse": {
      "url": "https://mcp.deepwiki.com/sse"
    }
  }
}`,
    link: "https://deepwiki.ai/",
  },
  {
    name: "Context7 MCP",
    icon: "📚",
    description: "提供最新的技术文档和库信息，帮助 AI 获取准确的编程知识",
    category: "docs",
    trust: 9.2,
    config: `{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}`,
    link: "https://context7.ai/",
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
];

export default function CursorMCPPage() {
  const [activeTab, setActiveTab] = useState("plugin");
  const [copyMessage, setCopyMessage] = useState("");

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage(`${type} 已复制到剪贴板`);
      setTimeout(() => setCopyMessage(""), 3000);
    } catch (err) {
      console.error("复制失败:", err);
      setCopyMessage("复制失败，请手动复制");
      setTimeout(() => setCopyMessage(""), 3000);
    }
  };

  const handleOpenLink = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* 头部 */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            <span className="mr-4">🚀</span>DiFlow 开发工具集
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            集成插件、编程规范和 MCP 服务的一站式开发平台
          </p>
        </div>

        {/* 导航标签 */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/50">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("plugin")}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === "plugin"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <span className="mr-2">🔌</span>DiFlow 插件
              </button>
              <button
                onClick={() => setActiveTab("rules")}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === "rules"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <span className="mr-2">📋</span>Cursor 规则
              </button>
              <button
                onClick={() => setActiveTab("mcp")}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === "mcp"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <span className="mr-2">🔗</span>MCP 服务
              </button>
            </div>
          </div>
        </div>

        {/* 复制成功提示 */}
        {copyMessage && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {copyMessage}
          </div>
        )}

        {/* 内容区域 */}
        <div className="max-w-6xl mx-auto">
          {activeTab === "plugin" && <PluginSection />}
          {activeTab === "rules" && (
            <RulesSection onCopy={handleCopy} onOpenLink={handleOpenLink} />
          )}
          {activeTab === "mcp" && (
            <MCPSection onCopy={handleCopy} onOpenLink={handleOpenLink} />
          )}
        </div>
      </div>
    </div>
  );
}
