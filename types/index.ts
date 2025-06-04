// 用户相关类型
export interface User {
  id: string
  username: string
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
}

export interface AuthResponse {
  success: boolean
  data?: {
    user: User
    token: string
  }
  message?: string
  error?: string
}

// 聊天相关类型
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface Chat {
  id: string
  userId: string
  title: string
  messages: ChatMessage[]
  model: string
  createdAt: string
  updatedAt: string
}

export interface ChatRequest {
  message: string
  model?: string
  chatId?: string
}

export interface ChatResponse {
  success: boolean
  data?: {
    message: ChatMessage
    chatId: string
  }
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
  createdAt: string
  updatedAt: string
}

// API 响应基础类型
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
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
} 