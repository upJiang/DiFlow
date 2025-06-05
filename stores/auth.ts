import { defineStore } from 'pinia'
import type { User, GoogleAuthRequest, AuthResponse } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)

  // 计算属性
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // 初始化
  const init = () => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('auth_token')
      const savedUser = localStorage.getItem('auth_user')
      
      if (savedToken && savedUser) {
        token.value = savedToken
        try {
          user.value = JSON.parse(savedUser)
        } catch (error) {
          console.error('解析用户信息失败:', error)
          logout()
        }
      }
    }
  }

  // 直接设置认证信息
  const setAuth = (authToken: string, userData: User) => {
    token.value = authToken
    user.value = userData
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', authToken)
      localStorage.setItem('auth_user', JSON.stringify(userData))
    }
  }

  // Google OAuth 登录
  const googleLogin = async (accessToken: string): Promise<AuthResponse> => {
    loading.value = true
    try {
      const response = await $fetch<AuthResponse>('/api/auth/google', {
        method: 'POST',
        body: { accessToken }
      })

      if (response.success && response.data) {
        setAuth(response.data.token, response.data.user)
      }

      return response
    } catch (error: any) {
      console.error('Google 登录失败:', error)
      return {
        success: false,
        error: error.data?.message || '登录失败'
      }
    } finally {
      loading.value = false
    }
  }

  // 登出
  const logout = () => {
    user.value = null
    token.value = null
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
  }

  // 获取用户信息
  const getCurrentUser = async () => {
    if (!token.value) return null

    try {
      const response = await $fetch<{ success: boolean; data: User }>('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })

      if (response.success && response.data) {
        user.value = response.data
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_user', JSON.stringify(response.data))
        }
      }

      return response.data
    } catch (error) {
      console.error('获取用户信息失败:', error)
      logout()
      return null
    }
  }

  return {
    // 状态
    user,
    token,
    loading: readonly(loading),
    
    // 计算属性
    isAuthenticated,
    
    // 方法
    init,
    setAuth,
    googleLogin,
    logout,
    getCurrentUser
  }
}) 