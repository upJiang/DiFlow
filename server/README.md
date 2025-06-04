# Server 服务端目录

此目录包含所有服务端代码，包括 API 路由、中间件和工具函数。

## 目录结构

- `api/` - API 路由处理器
  - `auth/` - 身份验证相关 API
  - `chat/` - 对话功能 API
  - `models/` - 模型管理 API
- `utils/` - 服务端工具函数

## API 开发规范

1. **路由命名**: 使用 RESTful 风格的路由命名
2. **错误处理**: 统一的错误处理和响应格式
3. **身份验证**: 所有需要认证的接口都要验证 JWT token
4. **类型安全**: 使用 TypeScript 定义请求和响应类型

## 身份验证

所有 API 接口（除了登录和注册）都需要在请求头中包含 JWT token：

```
Authorization: Bearer <token>
```

## 响应格式

统一的 API 响应格式：

```typescript
{
  success: boolean
  data?: any
  message?: string
  error?: string
}
```
