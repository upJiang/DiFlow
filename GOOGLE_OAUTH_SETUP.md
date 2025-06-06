# Google OAuth 配置指南

## 前提条件

- Google Cloud Console 账户
- 已启用的项目

## 步骤 1：创建 Google Cloud 项目

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 点击右上角的"选择项目"
3. 点击"新建项目"
4. 输入项目名称（例如：DiFlow）
5. 点击"创建"

## 步骤 2：启用必要的 API

1. 在 Google Cloud Console 中，转到"API 和服务" > "库"
2. 搜索并启用以下 API：
   - **Google Identity API** (主要使用)
   - **Google+ API** (兼容性)

## 步骤 3：创建 OAuth 2.0 凭据

1. 转到"API 和服务" > "凭据"
2. 点击"创建凭据" > "OAuth 客户端 ID"
3. 如果是首次创建，需要先配置 OAuth 同意屏幕：
   - 选择"外部"用户类型
   - 填写应用程序名称：DiFlow
   - 用户支持电子邮件：您的邮箱
   - 开发者联系信息：您的邮箱
   - 点击"保存并继续"

## 步骤 4：配置 OAuth 客户端

1. 选择应用程序类型："Web 应用程序"
2. 名称：DiFlow OAuth
3. **已获授权的 JavaScript 来源**：
   - 开发环境：`http://localhost:3333`
   - 生产环境：`https://yourdomain.com`
4. **已获授权的重定向 URI**：
   - ⚠️ **注意：使用前端 SDK 时不需要重定向 URI**
   - 留空或设置为 `http://localhost:3333` (仅作备用)
5. 点击"创建"

## 步骤 5：获取凭据

创建完成后，您将看到：

- **客户端 ID** (前端使用)
- **客户端密钥** (服务器端验证使用)

## 步骤 6：配置环境变量

在项目根目录的 `.env` 文件中添加：

```bash
# Google OAuth 配置 (前端SDK)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# Google OAuth 配置 (服务器端验证)
GOOGLE_OAUTH_CLIENT_ID=your_google_client_id_here
GOOGLE_OAUTH_CLIENT_SECRET=your_google_client_secret_here
```

## 步骤 7：测试配置

1. 重启开发服务器：`yarn dev`
2. 访问 `http://localhost:3333`
3. 点击页面上的 Google 官方登录按钮
4. 完成 Google 授权流程

## 前端 SDK 登录流程

1. **用户点击 Google 按钮** → Google 官方登录界面
2. **用户授权** → Google 返回 JWT 凭据
3. **前端发送凭据到服务器** → `/api/auth/google`
4. **服务器验证凭据** → 创建用户会话
5. **登录完成** → 用户状态更新

## 优势

✅ **无网络超时**：前端直接与 Google 交互  
✅ **官方 UI**：使用 Google 官方登录按钮  
✅ **更安全**：JWT 凭据验证  
✅ **更快速**：无需服务器端网络请求  
✅ **更稳定**：不依赖服务器网络环境

## 常见问题解决

### 1. 授权 JavaScript 来源不匹配

确保 Google Console 中的 JavaScript 来源与您的应用程序域名完全匹配。

### 2. Google 按钮不显示

- 检查 `NEXT_PUBLIC_GOOGLE_CLIENT_ID` 是否正确设置
- 确保 Google Identity Services 脚本已加载
- 查看浏览器控制台是否有错误

### 3. 凭据验证失败

- 检查服务器端的 `GOOGLE_OAUTH_CLIENT_ID` 是否与前端一致
- 确保客户端密钥正确设置

### 4. 跨域问题

- 确保在 Google Console 中配置了正确的 JavaScript 来源域

## 安全建议

1. 不要在客户端代码中暴露 `GOOGLE_OAUTH_CLIENT_SECRET`
2. 定期轮换 OAuth 凭据
3. 限制 OAuth 应用程序的权限范围
4. 在生产环境中使用 HTTPS
5. 验证 JWT 凭据的有效性和来源

## 支持的功能

- ✅ 用户登录（前端 SDK）
- ✅ 获取用户基本信息（邮箱、姓名、头像）
- ✅ 自动创建用户账户
- ✅ JWT 凭据验证
- ✅ 会话管理
- ✅ Google 官方登录按钮

## 迁移说明

从传统 OAuth 重定向流程迁移到前端 SDK：

1. ❌ 删除 `/auth/callback` 页面
2. ❌ 删除 `/api/auth/google/callback` 路由
3. ✅ 添加 Google Identity Services 脚本
4. ✅ 使用 `renderButton` API
5. ✅ 创建 `/api/auth/google` 路由处理 JWT 凭据

## 下一步

配置完成后，您可以：

1. 自定义 Google 登录按钮样式
2. 添加更多身份验证提供商
3. 实现角色和权限管理
4. 集成更多 Google API 服务
