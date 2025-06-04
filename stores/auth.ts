import { defineStore } from 'pinia'
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const init = () => {
    if (process.client) {
      const savedToken = localStorage.getItem('auth_token')
      const savedUser = localStorage.getItem('auth_user')
      
      if (savedToken && savedUser) {
        token.value = savedToken
        user.value = JSON.parse(savedUser)
      }
    }
  }

  const login = async (credentials: LoginRequest): Promise<void> => {
    isLoading.value = true
    console.log('正在尝试登录:', credentials.username)
    
    try {
      // 调试：记录发送请求前的状态
      console.log('发送登录请求:', {
        url: '/api/auth/login',
        method: 'POST',
        body: { username: credentials.username, password: '***' }
      })
      
      const response = await $fetch<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: credentials
      })
      
      // 调试：记录响应
      console.log('登录响应:', response)

      if (response.success && response.data) {
        token.value = response.data.token
        user.value = response.data.user
        
        if (process.client) {
          localStorage.setItem('auth_token', response.data.token)
          localStorage.setItem('auth_user', JSON.stringify(response.data.user))
        }
        console.log('登录成功，用户信息已保存')
      } else {
        // API返回success: false时，抛出错误并携带message
        console.log('登录失败:', response.message)
        const error = new Error(response.message || '登录失败')
        // 为了保持与错误通知组件的兼容性，设置statusCode和statusMessage
        ;(error as any).statusCode = 200
        ;(error as any).statusMessage = response.message
        ;(error as any).message = response.message
        throw error
      }
    } catch (error: any) {
      // 调试：详细记录错误
      console.error('登录错误:', error)
      console.error('详细错误信息:', {
        message: error.message,
        statusCode: error.statusCode,
        statusMessage: error.statusMessage,
        data: error.data,
        stack: error.stack
      })
      
      // 重新抛出错误，让页面的错误处理逻辑处理
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const register = async (credentials: RegisterRequest): Promise<void> => {
    isLoading.value = true
    console.log('正在尝试注册:', credentials.username)
    
    try {
      // 调试：记录发送请求前的状态
      console.log('发送注册请求:', {
        url: '/api/auth/register',
        method: 'POST',
        body: { username: credentials.username, password: '***' }
      })
      
      const response = await $fetch<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: credentials
      })
      
      // 调试：记录响应
      console.log('注册响应:', response)

      if (response.success && response.data) {
        token.value = response.data.token
        user.value = response.data.user
        
        if (process.client) {
          localStorage.setItem('auth_token', response.data.token)
          localStorage.setItem('auth_user', JSON.stringify(response.data.user))
        }
        console.log('注册成功，用户信息已保存')
      } else {
        console.error('注册响应成功但数据无效:', response)
        throw new Error(response.error || 'Registration failed')
      }
    } catch (error: any) {
      // 调试：详细记录错误
      console.error('注册错误:', error)
      console.error('详细错误信息:', {
        message: error.message,
        data: error.data,
        stack: error.stack
      })
      throw new Error(error.data?.message || error.message || 'Registration failed')
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    
    if (process.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
    
    navigateTo('/auth/login')
  }

  const getAuthHeaders = () => {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  return {
    user: readonly(user),
    token: readonly(token),
    isLoading: readonly(isLoading),
    isAuthenticated,
    init,
    login,
    register,
    logout,
    getAuthHeaders
  }
}) 