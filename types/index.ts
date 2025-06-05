// 用户相关类型
export interface User {
  id: string
  email: string
  name?: string
  image?: string
}

// Google OAuth 相关类型
export interface GoogleAuthRequest {
  accessToken: string
}

export interface AuthResponse {
  success: boolean
  data?: {
    token: string
    user: User
  }
  message?: string
  error?: string
}

// 聊天相关类型
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface Chat {
  id: string
  title: string
  messages: ChatMessage[]
  model: string
  createdAt: Date
  updatedAt: Date
}

export interface SendMessageRequest {
  chatId?: string
  message: string
  model?: string
}

export interface ChatResponse {
  success: boolean
  data?: {
    chatId: string
    message: ChatMessage
  }
  message?: string
  error?: string
}

// 模型相关类型
export interface ModelConfig {
  id: string
  name: string
  displayName: string
  apiKey?: string
  baseUrl?: string
  enabled: boolean
}

// API 响应格式
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// 分页类型
export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
} 