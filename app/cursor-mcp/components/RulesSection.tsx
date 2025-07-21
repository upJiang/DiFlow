"use client";

import { useState } from "react";

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

    projectStructure: `# 项目结构规范

## Next.js 项目结构
\`\`\`
├── app/
│   ├── (auth)/           # 认证相关路由
│   ├── (dashboard)/      # 仪表板路由
│   ├── api/              # API 路由
│   └── layout.tsx        # 根布局
├── components/
│   ├── shared/           # 共享 UI 组件
│   ├── features/         # 功能特定组件
│   └── ui/               # Shadcn UI 组件
├── lib/
│   ├── supabase/         # Supabase 客户端和工具
│   ├── constants/        # 全局常量
│   ├── hooks/            # 自定义 React hooks
│   ├── middleware/       # 自定义中间件
│   └── utils/           # 共享工具函数
└── ...
\`\`\`

## 文档结构
\`\`\`
ProjectDocs/
├── Build_Notes/
│   ├── active/          # 当前构建笔记
│   ├── completed/       # 完成的构建笔记
│   └── archived/        # 已归档构建笔记
└── contexts/
    ├── projectContext.md    # 主项目上下文
    ├── appFlow.md          # 应用流程文档
    ├── authFlow.md         # 认证流程文档
    └── ...                 # 其他上下文文件
\`\`\``,

    security: `# 安全开发规范

## 数据验证
- 始终验证用户输入
- 使用 Zod 或 Joi 进行模式验证
- 防止 SQL 注入和 XSS 攻击
- 对敏感数据进行加密存储

## 认证与授权
- 使用强密码策略
- 实施多因素认证
- 正确处理 JWT 令牌
- 定期轮换 API 密钥

## 环境变量
- 敏感信息存储在环境变量中
- 使用 .env.example 文件作为模板
- 永不提交实际的 .env 文件到版本控制`,

    testing: `# 测试规范

## 单元测试
- 使用 Jest 和 React Testing Library
- 测试覆盖率至少 80%
- 为关键业务逻辑编写测试
- 使用描述性的测试名称

## 集成测试
- 测试 API 端点
- 测试数据库交互
- 使用测试数据库

## E2E 测试
- 使用 Playwright 或 Cypress
- 测试关键用户流程
- 在 CI/CD 中自动运行`,
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

  python: `# Python 开发规则

## 代码风格
- 遵循 PEP 8 代码风格指南
- 使用 Black 进行代码格式化
- 使用 isort 排序导入语句
- 使用 flake8 进行代码检查

## 类型提示
- 使用 type hints 提高代码可读性
- 使用 mypy 进行静态类型检查
- 为函数参数和返回值添加类型注解

## 项目结构
\`\`\`
project/
├── src/
│   └── package/
│       ├── __init__.py
│       └── module.py
├── tests/
├── requirements.txt
├── setup.py
└── README.md
\`\`\`

## 异常处理
- 使用具体的异常类型而不是裸露的 except
- 提供有意义的错误信息
- 使用 logging 模块记录错误

参考资源：
- Python 官方文档：https://docs.python.org/
- PEP 8：https://pep8.org/`,

  tailwind: `# Tailwind CSS 开发规则

## 类名组织
- 按功能分组类名：布局 -> 外观 -> 交互
- 使用 clsx 或 cn 函数组合条件类名
- 避免过长的类名字符串

## 响应式设计
- 移动优先设计原则
- 使用断点前缀：sm:, md:, lg:, xl:
- 合理使用容器查询

## 自定义样式
- 在 tailwind.config.js 中扩展主题
- 使用 @apply 指令复用样式组合
- 创建自定义组件类

## 性能优化
- 使用 Tailwind 的 purge 功能
- 避免在 HTML 中使用未定义的类
- 使用 JIT 模式提高构建速度

参考资源：
- Tailwind CSS 官方文档：https://tailwindcss.com/docs
- Tailwind UI：https://tailwindui.com/`,

  typescript: `# TypeScript 开发规则

## 类型定义
- 优先使用 interface 而不是 type（除非需要联合类型）
- 使用泛型提高代码复用性
- 避免使用 any，使用 unknown 替代

## 严格模式
- 启用 strict 模式
- 使用 noImplicitAny 和 strictNullChecks
- 处理所有可能的 undefined 情况

## 模块系统
- 使用 ES6 模块语法
- 正确配置 tsconfig.json 路径映射
- 使用 barrel exports（index.ts）

## 实用类型
- 使用 Partial, Required, Pick, Omit 等实用类型
- 创建自定义实用类型
- 使用条件类型处理复杂场景

参考资源：
- TypeScript 官方文档：https://www.typescriptlang.org/docs/
- TypeScript 手册：https://www.typescriptlang.org/docs/handbook/intro.html`,

  docker: `# Docker 开发规则

## Dockerfile 最佳实践
- 使用多阶段构建减少镜像大小
- 合理排序指令利用缓存层
- 使用 .dockerignore 排除不必要文件
- 以非 root 用户运行应用

## 镜像优化
- 选择合适的基础镜像
- 清理包管理器缓存
- 合并 RUN 指令减少层数
- 使用 Alpine Linux 减少镜像大小

## 容器编排
- 使用 docker-compose.yml 管理多容器应用
- 合理配置环境变量
- 使用健康检查确保服务可用性
- 配置适当的资源限制

## 安全性
- 定期更新基础镜像
- 扫描镜像漏洞
- 使用官方镜像或可信来源
- 避免在镜像中存储敏感信息

参考资源：
- Docker 官方文档：https://docs.docker.com/
- Docker 最佳实践：https://docs.docker.com/develop/dev-best-practices/`,

  git: `# Git 工作流规范

## 分支策略
- 使用 Git Flow 或 GitHub Flow
- 主分支保持稳定可部署状态
- 功能分支命名：feature/功能名
- 修复分支命名：hotfix/问题描述

## 提交规范
- 使用 Conventional Commits 格式
- 提交信息格式：type(scope): description
- 类型：feat, fix, docs, style, refactor, test, chore
- 每个提交只包含一个逻辑变更

## 代码审查
- 所有代码必须经过 Pull Request 审查
- 审查者检查代码质量、安全性、性能
- 使用自动化测试确保代码质量
- 合并前确保 CI/CD 通过

## 版本管理
- 使用语义化版本号：MAJOR.MINOR.PATCH
- 为重要版本创建标签
- 维护 CHANGELOG.md 文件
- 使用 release 分支准备发布

参考资源：
- Git 官方文档：https://git-scm.com/doc
- Conventional Commits：https://www.conventionalcommits.org/`,
};

interface RulesSectionProps {
  onCopy: (text: string, type: string) => void;
  onOpenLink: (url: string) => void;
}

/**
 * Cursor Rules 收录组件
 * 展示各种框架和技术的开发规则
 */
export default function RulesSection({
  onCopy,
  onOpenLink,
}: RulesSectionProps) {
  const [selectedRule, setSelectedRule] = useState<string | null>(null);

  return (
    <div>
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          <span className="mr-3">📋</span>Cursor Rules 收录
        </h2>
        <p className="text-lg text-gray-600 text-center mb-6">
          精选高质量的 Cursor Rules，提升开发效率和代码质量
        </p>

        {/* 官方资源链接 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 border border-blue-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            <span className="mr-2">🌐</span>官方资源与社区
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="text-center">
              <button
                onClick={() => onOpenLink("https://dotcursorrules.com/rules")}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <span className="mr-2">🏠</span>
                Cursor Rules 官网
              </button>
              <p className="text-sm text-gray-600 mt-2">
                官方规则收录网站，提供最新的规则模板
              </p>
            </div>
            <div className="text-center">
              <button
                onClick={() =>
                  onOpenLink(
                    "https://github.com/PatrickJS/awesome-cursorrules/tree/main/rules"
                  )
                }
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <span className="mr-2">⭐</span>
                Awesome Cursor Rules
              </button>
              <p className="text-sm text-gray-600 mt-2">
                社区维护的优质规则集合，持续更新
              </p>
            </div>
          </div>
        </div>

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
                <div className="font-medium text-blue-800">代码质量</div>
                <div className="text-sm text-gray-600">
                  基本原则、错误处理、性能优化
                </div>
              </button>
              <button
                onClick={() => setSelectedRule(cursorRulesData.general.naming)}
                className="w-full text-left p-3 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium text-blue-800">命名规范</div>
                <div className="text-sm text-gray-600">
                  变量、函数、文件命名规则
                </div>
              </button>
              <button
                onClick={() =>
                  setSelectedRule(cursorRulesData.general.projectStructure)
                }
                className="w-full text-left p-3 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium text-blue-800">项目结构</div>
                <div className="text-sm text-gray-600">
                  目录组织、文档结构规范
                </div>
              </button>
              <button
                onClick={() =>
                  setSelectedRule(cursorRulesData.general.security)
                }
                className="w-full text-left p-3 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium text-blue-800">安全规范</div>
                <div className="text-sm text-gray-600">
                  数据验证、认证授权、环境变量
                </div>
              </button>
              <button
                onClick={() => setSelectedRule(cursorRulesData.general.testing)}
                className="w-full text-left p-3 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium text-blue-800">测试规范</div>
                <div className="text-sm text-gray-600">
                  单元测试、集成测试、E2E 测试
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
              <div className="font-medium text-cyan-800">React 开发规则</div>
              <div className="text-sm text-gray-600">组件、Hooks、性能优化</div>
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
              <div className="font-medium text-green-800">Vue 开发规则</div>
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
              <div className="text-sm text-gray-600">App Router、SSR、优化</div>
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
              <div className="text-sm text-gray-600">模块化、错误处理、API</div>
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
              <div className="font-medium text-teal-800">Nuxt 开发规则</div>
              <div className="text-sm text-gray-600">SSR、自动导入、模块</div>
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

          {/* Python 规则 */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100">
            <h3 className="text-xl font-semibold text-amber-800 mb-4">
              🐍 Python
            </h3>
            <button
              onClick={() => setSelectedRule(cursorRulesData.python)}
              className="w-full text-left p-3 bg-white rounded-lg border border-amber-200 hover:bg-amber-50 transition-colors"
            >
              <div className="font-medium text-amber-800">Python 开发规则</div>
              <div className="text-sm text-gray-600">
                PEP 8、类型提示、项目结构
              </div>
            </button>
          </div>

          {/* Tailwind CSS 规则 */}
          <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-6 border border-sky-100">
            <h3 className="text-xl font-semibold text-sky-800 mb-4">
              🎨 Tailwind CSS
            </h3>
            <button
              onClick={() => setSelectedRule(cursorRulesData.tailwind)}
              className="w-full text-left p-3 bg-white rounded-lg border border-sky-200 hover:bg-sky-50 transition-colors"
            >
              <div className="font-medium text-sky-800">Tailwind CSS 规则</div>
              <div className="text-sm text-gray-600">
                类名组织、响应式、性能优化
              </div>
            </button>
          </div>

          {/* TypeScript 规则 */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">
              📘 TypeScript
            </h3>
            <button
              onClick={() => setSelectedRule(cursorRulesData.typescript)}
              className="w-full text-left p-3 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
            >
              <div className="font-medium text-blue-800">TypeScript 规则</div>
              <div className="text-sm text-gray-600">
                类型定义、严格模式、实用类型
              </div>
            </button>
          </div>

          {/* Docker 规则 */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">
              🐳 Docker
            </h3>
            <button
              onClick={() => setSelectedRule(cursorRulesData.docker)}
              className="w-full text-left p-3 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
            >
              <div className="font-medium text-blue-800">Docker 规则</div>
              <div className="text-sm text-gray-600">
                Dockerfile、镜像优化、安全性
              </div>
            </button>
          </div>

          {/* Git 规则 */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
            <h3 className="text-xl font-semibold text-orange-800 mb-4">
              🔀 Git
            </h3>
            <button
              onClick={() => setSelectedRule(cursorRulesData.git)}
              className="w-full text-left p-3 bg-white rounded-lg border border-orange-200 hover:bg-orange-50 transition-colors"
            >
              <div className="font-medium text-orange-800">Git 工作流</div>
              <div className="text-sm text-gray-600">
                分支策略、提交规范、代码审查
              </div>
            </button>
          </div>
        </div>

        {/* 快速工具 */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            <span className="mr-2">🛠️</span>快速工具
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                使用 CLI 工具快速安装规则：
              </p>
              <div className="bg-gray-800 text-green-400 p-3 rounded-lg text-sm font-mono">
                pip install cursor-rules
                <br />
                cursor-rules
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                扫描项目并自动安装匹配的规则：
              </p>
              <div className="bg-gray-800 text-green-400 p-3 rounded-lg text-sm font-mono">
                cursor-rules -d /path/to/project
                <br />
                cursor-rules --libraries "react,tailwind"
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 规则详情弹窗 */}
      {selectedRule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800">规则详情</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => onCopy(selectedRule, "规则内容")}
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
  );
}
