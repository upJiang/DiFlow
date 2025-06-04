import { ref, readonly } from 'vue'

interface NotificationState {
  visible: boolean
  title: string
  message: string
  duration: number
}

const notificationState = ref<NotificationState>({
  visible: false,
  title: '',
  message: '',
  duration: 5000
})

export const useErrorNotification = () => {
  const showError = (message: string, title?: string, duration?: number) => {
    notificationState.value = {
      visible: true,
      title: title || '错误',
      message,
      duration: duration || 5000
    }
  }

  const hideError = () => {
    notificationState.value.visible = false
  }

  const showApiError = (error: any) => {
    let message = '发生未知错误'
    let title = '请求失败'

    // 处理API返回success: false的情况（statusCode为200）
    if (error?.statusCode === 200 && error?.statusMessage) {
      title = '登录失败'
      message = error.statusMessage
    } 
    // 处理其他错误情况
    else if (error?.data?.message) {
      message = error.data.message
    } else if (error?.message) {
      message = error.message
    } else if (error?.statusMessage) {
      message = error.statusMessage
    }

    // 根据状态码显示不同的标题
    if (error?.statusCode && error.statusCode !== 200) {
      switch (error.statusCode) {
        case 400:
          title = '请求参数错误'
          break
        case 401:
          title = '认证失败'
          break
        case 403:
          title = '权限不足'
          break
        case 404:
          title = '资源不存在'
          break
        case 500:
          title = '服务器错误'
          break
        default:
          title = `请求失败 (${error.statusCode})`
      }
    }

    showError(message, title)
  }

  return {
    notificationState: readonly(notificationState),
    showError,
    hideError,
    showApiError
  }
} 