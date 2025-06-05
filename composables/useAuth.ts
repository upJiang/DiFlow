import type { User, GoogleAuthRequest, AuthResponse } from '~/types'

interface AuthData {
  user: User | null
}

interface AuthStatus {
  status: 'loading' | 'authenticated' | 'unauthenticated'
  data: AuthData | null
}

export const useAuth = () => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()
  
  // 响应式状态
  const status = computed(() => authStore.loading ? 'loading' : authStore.token ? 'authenticated' : 'unauthenticated')
  const data = computed((): { user: User | null } => ({ user: authStore.user || null }))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 处理授权码
  const handleAuthCode = async (code: string) => {
    try {
      const response = await $fetch<AuthResponse>('/api/auth/google/callback', {
        method: 'POST',
        body: { code },
        timeout: 10000
      })

      if (response.success && response.data) {
        authStore.setAuth(response.data.token, response.data.user)
      } else {
        throw new Error('服务器返回登录失败')
      }
    } catch (error: any) {
      console.error('处理授权码失败:', error)
      throw new Error(error.message || '登录处理失败')
    }
  }

  // Google登录
  const signIn = async (): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      // 构建 Google OAuth URL
      const googleOAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
      googleOAuthUrl.searchParams.set('client_id', config.public.googleClientId)
      googleOAuthUrl.searchParams.set('redirect_uri', `${window.location.origin}/auth/callback`)
      googleOAuthUrl.searchParams.set('response_type', 'code')
      googleOAuthUrl.searchParams.set('scope', 'email profile')
      googleOAuthUrl.searchParams.set('access_type', 'offline')
      googleOAuthUrl.searchParams.set('prompt', 'consent')
      googleOAuthUrl.searchParams.set('state', 'state')

      console.log('OAuth URL:', googleOAuthUrl.toString())

      // 弹窗选项 - 修复COEP问题
      const popupFeatures = [
        'width=500',
        'height=600',
        'scrollbars=yes',
        'resizable=yes',
        'status=yes',
        'location=yes',
        'toolbar=no',
        'menubar=no'
      ].join(',')

      // 打开弹窗
      const popup = window.open(googleOAuthUrl.toString(), 'google-auth', popupFeatures)
      
      if (!popup) {
        throw new Error('弹窗被阻止，请允许弹窗并重试')
      }

      // 创建Promise来处理授权结果
      return new Promise((resolve, reject) => {
        const timeout = 5 * 60 * 1000 // 5分钟超时
        let isResolved = false

        // 监听消息
        const messageHandler = (event: MessageEvent) => {
          // 验证消息来源
          if (event.origin !== window.location.origin) {
            console.warn('收到来自未知来源的消息:', event.origin)
            return
          }

          console.log('收到弹窗消息:', event.data)

          if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
            if (!isResolved) {
              isResolved = true
              window.removeEventListener('message', messageHandler)
              
              // 直接设置认证信息
              authStore.setAuth(event.data.token, event.data.user)
              isLoading.value = false
              resolve()
            }
          } else if (event.data?.type === 'GOOGLE_AUTH_ERROR') {
            if (!isResolved) {
              isResolved = true
              window.removeEventListener('message', messageHandler)
              isLoading.value = false
              reject(new Error(event.data.error || '授权失败'))
            }
          }
        }

        window.addEventListener('message', messageHandler)

        // 定期检查弹窗状态（修复COEP问题的替代方案）
        const checkClosed = setInterval(() => {
          try {
            // 使用try-catch包装，避免COEP错误
            if (popup.closed) {
              clearInterval(checkClosed)
              if (!isResolved) {
                isResolved = true
                window.removeEventListener('message', messageHandler)
                isLoading.value = false
                reject(new Error('用户取消了登录'))
              }
            }
          } catch (err: unknown) {
            // COEP错误，使用备用方案
            const errorMessage = err instanceof Error ? err.message : '未知错误'
            console.warn('无法检查弹窗状态 (COEP限制):', errorMessage)
          }
        }, 1000)

        // 超时处理
        setTimeout(() => {
          clearInterval(checkClosed)
          if (!isResolved) {
            isResolved = true
            window.removeEventListener('message', messageHandler)
            
            // 安全地关闭弹窗
            try {
              if (popup && !popup.closed) {
                popup.close()
              }
            } catch (err: unknown) {
              const errorMessage = err instanceof Error ? err.message : '未知错误'
              console.warn('无法关闭弹窗:', errorMessage)
            }
            
            isLoading.value = false
            reject(new Error('登录超时，请重试'))
          }
        }, timeout)
      })

    } catch (err: unknown) {
      isLoading.value = false
      error.value = err instanceof Error ? err.message : '登录过程中发生错误'
      console.error('登录错误:', err)
      throw err
    }
  }

  // 登出
  const signOut = async () => {
    try {
      authStore.logout()
    } catch (error) {
      console.error('Sign out failed:', error)
      throw error
    }
  }

  // 初始化认证状态
  onMounted(() => {
    authStore.init()
  })

  return {
    status: readonly(status),
    data: readonly(data),
    signIn,
    signOut
  }
} 