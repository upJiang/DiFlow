# Google OAuth 配置指南

## 前提条件
- Google Cloud Console 账户
- 已启用的项目

## 步骤1：创建 Google Cloud 项目

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 点击右上角的"选择项目"
3. 点击"新建项目"
4. 输入项目名称（例如：DiFlow）
5. 点击"创建"

## 步骤2：启用 Google+ API

1. 在 Google Cloud Console 中，转到"API 和服务" > "库"
2. 搜索 "Google+ API"
3. 点击启用
4. 也可以启用 "Google OAuth2 API"

## 步骤3：创建 OAuth 2.0 凭据

1. 转到"API 和服务" > "凭据"
2. 点击"创建凭据" > "OAuth 客户端 ID"
3. 如果是首次创建，需要先配置 OAuth 同意屏幕：
   - 选择"外部"用户类型
   - 填写应用程序名称：DiFlow
   - 用户支持电子邮件：您的邮箱
   - 开发者联系信息：您的邮箱
   - 点击"保存并继续"
4. 添加测试用户（可选）
5. 点击"保存并继续"

## 步骤4：配置 OAuth 客户端

1. 选择应用程序类型："Web 应用程序"
2. 名称：DiFlow OAuth
3. 已获授权的重定向 URI：
   - 开发环境：`http://localhost:3333/auth/callback`
   - 生产环境：`https://yourdomain.com/auth/callback`
4. 点击"创建"

## 步骤5：获取凭据

创建完成后，您将看到：
- 客户端 ID
- 客户端密钥

## 步骤6：配置环境变量

在项目根目录的 `.env` 文件中添加：

```bash
# Google OAuth 配置
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## 步骤7：测试配置

1. 重启开发服务器：`npm run dev`
2. 访问 `http://localhost:3333`
3. 点击"Google 登录"按钮
4. 完成 Google 授权流程

## 常见问题解决

### 1. 重定向 URI 不匹配
确保 Google Console 中的重定向 URI 与您的应用程序 URL 完全匹配。

### 2. 网络超时
- 检查网络连接
- 确保防火墙允许 Google API 请求

### 3. 凭据无效
- 检查 `.env` 文件中的 Google 凭据是否正确
- 确保没有多余的空格或换行符

### 4. 跨域问题
- 确保在 Google Console 中配置了正确的来源域

## 安全建议

1. 不要在客户端代码中暴露 `GOOGLE_CLIENT_SECRET`
2. 定期轮换 OAuth 凭据
3. 限制 OAuth 应用程序的权限范围
4. 在生产环境中使用 HTTPS

## 支持的功能

- 用户登录
- 获取用户基本信息（邮箱、姓名、头像）
- 自动创建用户账户
- JWT 令牌生成
- 会话管理

## 下一步

配置完成后，您可以：
1. 自定义用户界面
2. 添加更多 OAuth 提供商
3. 实现角色和权限管理
4. 集成更多 Google API 服务 