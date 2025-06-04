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
    
    try {
      const response = await $fetch<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: credentials
      })

      if (response.success && response.data) {
        token.value = response.data.token
        user.value = response.data.user
        
        if (process.client) {
          localStorage.setItem('auth_token', response.data.token)
          localStorage.setItem('auth_user', JSON.stringify(response.data.user))
        }
      } else {
        throw new Error(response.error || 'Login failed')
      }
    } catch (error: any) {
      throw new Error(error.data?.message || error.message || 'Login failed')
    } finally {
      isLoading.value = false
    }
  }

  const register = async (credentials: RegisterRequest): Promise<void> => {
    isLoading.value = true
    
    try {
      const response = await $fetch<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: credentials
      })

      if (response.success && response.data) {
        token.value = response.data.token
        user.value = response.data.user
        
        if (process.client) {
          localStorage.setItem('auth_token', response.data.token)
          localStorage.setItem('auth_user', JSON.stringify(response.data.user))
        }
      } else {
        throw new Error(response.error || 'Registration failed')
      }
    } catch (error: any) {
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