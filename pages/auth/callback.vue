<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
      <div class="text-center">
        <!-- 加载状态 -->
        <div v-if="status === 'processing'" class="space-y-4">
          <div class="w-16 h-16 mx-auto mb-4">
            <svg class="animate-spin w-full h-full text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-800">正在处理登录...</h2>
          <p class="text-gray-600">请稍候，我们正在验证您的身份。</p>
        </div>

        <!-- 成功状态 -->
        <div v-else-if="status === 'success'" class="space-y-4">
          <div class="w-16 h-16 mx-auto mb-4 text-green-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-full h-full">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-800">登录成功！</h2>
          <p class="text-gray-600">正在跳转到主页...</p>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="status === 'error'" class="space-y-4">
          <div class="w-16 h-16 mx-auto mb-4 text-red-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-full h-full">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-800">登录失败</h2>
          <p class="text-gray-600 text-sm">{{ errorMessage }}</p>
          <button 
            @click="retry" 
            class="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const status = ref('processing')
const errorMessage = ref('')

// 页面元数据
definePageMeta({
  layout: false,
  title: 'Google 登录回调 - DiFlow'
})

// 处理授权回调
onMounted(async () => {
  try {
    const code = route.query.code
    const error = route.query.error
    
    if (error) {
      throw new Error(`Google授权失败: ${error}`)
    }
    
    if (!code) {
      throw new Error('未收到授权码')
    }

    console.log('收到授权码，开始处理...')
    
    // 调用API处理授权码
    const response = await $fetch('/api/auth/google/callback', {
      method: 'POST',
      body: { code: code as string }
    })
    
    // 显示成功状态
    status.value = 'success'
    
    // 通知父窗口授权成功
    if (window.opener) {
      window.opener.postMessage({
        type: 'GOOGLE_AUTH_SUCCESS',
        user: response.user,
        token: response.token
      }, window.location.origin)
      
      // 延迟关闭窗口，给父窗口时间处理
      setTimeout(() => {
        window.close()
      }, 1000)
    } else {
      // 如果不是弹窗模式，跳转到主页
      navigateTo('/')
    }
    
  } catch (error) {
    console.error('登录回调处理失败:', error)
    status.value = 'error'
    
    // 设置用户友好的错误信息
    if (error.message?.includes('授权')) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = '登录过程中出现错误，请重试'
    }
    
    // 通知父窗口登录失败
    if (window.opener) {
      window.opener.postMessage({
        type: 'GOOGLE_AUTH_ERROR',
        error: errorMessage.value
      }, window.location.origin)
    }
  }
})

// 重试函数
const retry = () => {
  if (window.opener) {
    window.close()
  } else {
    navigateTo('/')
  }
}
</script> 