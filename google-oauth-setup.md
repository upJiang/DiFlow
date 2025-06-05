# Google OAuth 配置指南

## 第一步：创建 Google Cloud 项目

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 在搜索栏中搜索 "APIs & Services"
4. 点击 "APIs & Services" -> "Dashboard"

## 第二步：启用 Google+ API

1. 在 APIs & Services Dashboard 中，点击 "+ ENABLE APIS AND SERVICES"
2. 搜索 "Google+ API" 或 "Google OAuth2 API"
3. 点击启用 API

## 第三步：创建 OAuth 2.0 凭据

1. 在左侧菜单中选择 "Credentials"
2. 点击 "+ CREATE CREDENTIALS"
3. 选择 "OAuth client ID"
4. 如果是首次创建，需要先配置 OAuth consent screen：
   - 选择 "External" 用户类型
   - 填写应用信息：
     - App name: DiFlow
     - User support email: 你的邮箱
     - Developer contact information: 你的邮箱
   - 在 Scopes 页面，添加以下权限：
     - `userinfo.email`
     - `userinfo.profile`
     - `openid`
   - 在 Test users 页面，添加你的测试邮箱

## 第四步：配置 OAuth Client ID

1. 选择应用类型为 "Web application"
2. 设置名称为 "DiFlow Web Client"
3. 在 "Authorized JavaScript origins" 中添加：
   ```
   http://localhost:3333
   ```
4. 在 "Authorized redirect URIs" 中添加：
   ```
   http://localhost:3333/auth/callback
   ```
5. 点击 "CREATE"

## 第五步：获取凭据

创建成功后，你会看到：
- **Client ID**: 类似 `421412720168-xxxxx.apps.googleusercontent.com`
- **Client Secret**: 类似 `GOCSPX-xxxxx`

## 第六步：配置环境变量

将获取到的凭据添加到 `.env` 文件中：

```env
# Google OAuth 配置
GOOGLE_CLIENT_ID=421412720168-jtvbmiha8scdt4j4aek7tsurv3468ull.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_actual_client_secret_here
```

**注意**: 
- 将 `GOCSPX-your_actual_client_secret_here` 替换为你的真实 Client Secret
- 保持 Client ID 不变（这个已经配置好了）

## 第七步：重启开发服务器

修改 `.env` 文件后，需要重启开发服务器：

```bash
npm run dev
```

## 测试 Google 登录

1. 访问 `http://localhost:3333`
2. 点击 "Google 登录" 按钮
3. 会打开 Google 授权页面
4. 授权后会自动登录到应用

## 常见问题

### 1. "Error 400: redirect_uri_mismatch"
- 检查 Google Cloud Console 中的 Authorized redirect URIs 是否包含 `http://localhost:3333/auth/callback`
- 确保 URL 完全匹配（包括协议、端口）

### 2. "Google Client ID not configured"
- 检查 `.env` 文件中的 `GOOGLE_CLIENT_ID` 是否正确
- 重启开发服务器

### 3. "Access blocked: This app's request is invalid"
- 确保在 OAuth consent screen 中正确配置了应用信息
- 检查 Scopes 是否包含必要的权限

### 4. 弹窗被阻止
- 允许浏览器显示弹窗
- 或者在浏览器设置中允许 localhost:3333 的弹窗

## 生产环境配置

在生产环境中，需要：

1. 在 Google Cloud Console 中添加生产域名到 Authorized JavaScript origins
2. 添加生产回调 URL 到 Authorized redirect URIs
3. 将 OAuth consent screen 发布为 "Production"
4. 更新环境变量中的域名配置

## 获取 DeepSeek API 密钥

DiFlow 使用 DeepSeek API 提供 AI 对话功能：

1. 访问 [DeepSeek 官网](https://platform.deepseek.com/)
2. 注册账户并登录
3. 在控制台中创建 API 密钥
4. 将密钥添加到 `.env` 文件中的 `DEEPSEEK_API_KEY` 字段

---

完成以上配置后，您的 DiFlow 应用就可以使用 Google OAuth 登录和 AI 对话功能了！ 