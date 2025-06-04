# DiFlow - AI 工作流平台

一个类似 Dify 的 AI 工作流网站，支持对话、工作流和工具功能。

## 技术栈

- **前端框架**: Nuxt3 + Vue3 + TypeScript
- **UI 组件库**: Ant Design Vue + Tailwind CSS
- **状态管理**: Pinia
- **数据库**: Prisma + SQLite
- **身份验证**: JWT
- **AI 模型**: DeepSeek (通过硅基流动)
- **构建工具**: Vite
- **代码规范**: ESLint + TypeScript

## 项目结构

```
DiFlow/
├── assets/              # 静态资源
├── components/          # Vue 组件
│   ├── common/         # 通用组件
│   ├── chat/           # 对话组件
│   ├── workflow/       # 工作流组件
│   └── tools/          # 工具组件
├── layouts/            # 布局文件
├── middleware/         # 中间件
├── pages/              # 页面路由
├── plugins/            # 插件
├── prisma/             # 数据库配置
├── server/             # 服务端 API
│   ├── api/            # API 路由
│   └── utils/          # 服务端工具
├── stores/             # Pinia 状态管理
├── types/              # TypeScript 类型定义
└── utils/              # 客户端工具函数
```

## 快速开始

1. 安装依赖：
```bash
npm install
```

2. 配置环境变量：
```bash
cp .env.example .env
# 编辑 .env 文件，填入你的配置
```

3. 初始化数据库：
```bash
npm run db:generate
npm run db:push
```

4. 启动开发服务器：
```bash
npm run dev
```

## 功能特性

- ✅ 用户注册/登录系统
- ✅ JWT 身份验证
- ✅ AI 对话功能 (DeepSeek)
- ✅ 模型选择和配置
- 🚧 工作流设计器 (开发中)
- 🚧 工具集成 (开发中)

## 环境变量

- `JWT_SECRET`: JWT 密钥
- `OPENAI_API_KEY`: AI 模型 API 密钥
- `DATABASE_URL`: 数据库连接字符串

## 开发指南

请查看各个文件夹下的 README.md 文件了解具体的开发规范和使用说明。

## 许可证

MIT License
