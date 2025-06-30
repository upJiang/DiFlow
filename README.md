# DiFlow - AI 工作流平台

DiFlow 是一个集成对话、工作流和工具的智能平台，采用现代化的技术栈构建，提供美观的用户界面和强大的功能。

## 🚀 功能特性

- **智能对话**: 与 AI 进行自然对话，支持多轮对话和历史记录
- **工作流管理**: 可视化设计和执行自动化工作流程
- **实用工具**: 丰富的工具集合，包括文本处理、数据分析等
- **Google OAuth**: 安全便捷的 Google 账号登录
- **响应式设计**: 支持桌面和移动设备
- **现代化 UI**: 采用卡通风格设计，视觉体验舒适

## 🛠️ 技术栈

- **前端**: Nuxt 3 + Vue 3 + TypeScript
- **样式**: Tailwind CSS
- **状态管理**: Pinia
- **数据库**: MySQL + Prisma ORM
- **认证**: JWT + Google OAuth 2.0
- **AI 集成**: DeepSeek API

## 📦 安装和设置

### 1. 克隆项目

```bash
git clone <repository-url>
cd DiFlow
```

### 2. 安装依赖

```bash
npm install
```

### 3. 环境配置

复制环境变量示例文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置以下变量：

```env
# 数据库配置
DATABASE_URL="mysql://username:password@localhost:3306/diflow"

# JWT 密钥
JWT_SECRET="your-jwt-secret-key-here"

# Google OAuth 配置
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI API 配置 (用于 DeepSeek)
OPENAI_API_KEY="your-deepseek-api-key"

# 认证密钥
AUTH_SECRET="your-auth-secret-key"
```

### 4. 数据库设置

```bash
# 推送数据库架构
npm run db:push

# 或者使用迁移
npm run db:migrate
```

### 5. 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:3333` 启动。

## 🔧 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产版本
- `npm run lint` - 运行代码检查
- `npm run db:push` - 推送数据库架构
- `npm run db:migrate` - 运行数据库迁移
- `npm run db:generate` - 生成 Prisma 客户端
- `npm run db:studio` - 启动 Prisma Studio

## 🔐 Google OAuth 设置

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API
4. 创建 OAuth 2.0 客户端 ID
5. 设置授权重定向 URI：`http://localhost:3333/auth/callback`
6. 将客户端 ID 和密钥添加到 `.env` 文件

## 📁 项目结构

```
DiFlow/
├── components/          # Vue组件
├── composables/         # 组合式函数
├── pages/              # 页面路由
├── server/             # 服务端API
│   ├── api/            # API端点
│   └── utils/          # 服务端工具函数
├── stores/             # Pinia状态管理
├── types/              # TypeScript类型定义
├── prisma/             # 数据库架构
└── assets/             # 静态资源
```

## 🎨 设计特色

- **卡通风格**: 采用友好的卡通风格设计
- **渐变背景**: 美观的渐变色背景
- **毛玻璃效果**: 现代化的毛玻璃效果
- **响应式布局**: 适配各种屏幕尺寸
- **可折叠侧边栏**: 灵活的导航体验

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进项目。

## �� 许可证

MIT License
