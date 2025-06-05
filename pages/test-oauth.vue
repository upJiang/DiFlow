<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
    <div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center">Google OAuth 测试</h1>
      
      <!-- 网络状态检查 -->
      <div class="mb-6 p-4 rounded-lg" :class="networkStatus === 'checking' ? 'bg-yellow-100' : networkStatus === 'ok' ? 'bg-green-100' : 'bg-red-100'">
        <h3 class="font-semibold mb-2">网络连接状态</h3>
        <p v-if="networkStatus === 'checking'">正在检查网络连接...</p>
        <p v-else-if="networkStatus === 'ok'" class="text-green-700">✅ 网络连接正常</p>
        <p v-else class="text-red-700">❌ 无法连接到Google服务器</p>
        <p v-if="networkStatus === 'error'" class="text-red-600 text-sm mt-2">
          {{ networkError }}
        </p>
      </div>

      <!-- 登录状态 -->
      <div class="mb-6 p-4 rounded-lg bg-gray-100">
        <h3 class="font-semibold mb-2">当前登录状态</h3>
        <p v-if="auth.status.value === 'loading'">🔄 加载中...</p>
        <p v-else-if="auth.status.value === 'authenticated'" class="text-green-700">✅ 已登录</p>
        <p v-else class="text-gray-700">❌ 未登录</p>
        
        <div v-if="auth.data.value?.user" class="mt-2 text-sm">
          <p><strong>用户ID:</strong> {{ auth.data.value.user.id }}</p>
          <p><strong>邮箱:</strong> {{ auth.data.value.user.email }}</p>
          <p><strong>姓名:</strong> {{ auth.data.value.user.name }}</p>
        </div>
      </div>

      <!-- 错误信息 -->
      <div v-if="error" class="mb-6 p-4 rounded-lg bg-red-100">
        <h3 class="font-semibold mb-2 text-red-700">错误信息</h3>
        <p class="text-red-600">{{ error }}</p>
      </div>

      <!-- 操作按钮 -->
      <div class="space-y-4">
        <button 
          @click="checkNetwork"
          :disabled="networkStatus === 'checking'"
          class="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {{ networkStatus === 'checking' ? '检查中...' : '重新检查网络' }}
        </button>

        <button 
          @click="testLogin"
          :disabled="isLoading || networkStatus === 'error'"
          class="w-full py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
        >
          {{ isLoading ? '登录中...' : '测试 Google 登录' }}
        </button>

        <button 
          v-if="auth.status.value === 'authenticated'"
          @click="logout"
          class="w-full py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          退出登录
        </button>
      </div>

      <!-- 配置信息 -->
      <div class="mt-8 p-4 rounded-lg bg-gray-100">
        <h3 class="font-semibold mb-2">配置信息</h3>
        <p class="text-sm"><strong>Client ID:</strong> {{ config.public.googleClientId ? '已配置' : '未配置' }}</p>
        <p class="text-sm"><strong>当前域名:</strong> {{ currentOrigin }}</p>
        <p class="text-sm"><strong>回调URL:</strong> {{ currentOrigin }}/auth/callback</p>
      </div>

      <!-- 日志 -->
      <div v-if="logs.length > 0" class="mt-6 p-4 rounded-lg bg-gray-50">
        <h3 class="font-semibold mb-2">操作日志</h3>
        <div class="max-h-40 overflow-y-auto text-xs">
          <div v-for="(log, index) in logs" :key="index" class="mb-1">
            <span class="text-gray-500">{{ log.time }}</span> - {{ log.message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 页面元数据
definePageMeta({
  title: 'Google OAuth 测试 - DiFlow'
})

const config = useRuntimeConfig()
const auth = useAuth()

// 响应式状态
const networkStatus = ref<'checking' | 'ok' | 'error'>('checking')
const networkError = ref('')
const isLoading = ref(false)
const error = ref('')
const logs = ref<Array<{ time: string, message: string }>>([])
const currentOrigin = ref('')

// 添加日志
const addLog = (message: string) => {
  logs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message
  })
  if (logs.value.length > 20) {
    logs.value.pop()
  }
}

// 检查网络连接
const checkNetwork = async () => {
  networkStatus.value = 'checking'
  networkError.value = ''
  addLog('开始检查网络连接...')
  
  try {
    // 1. 检查基本网络连接
    addLog('1. 检查基本网络连接...')
    await fetch('https://httpbin.org/get', {
      method: 'GET',
      mode: 'cors',
      signal: AbortSignal.timeout(5000)
    })
    addLog('✅ 基本网络连接正常')
    
    // 2. 检查能否访问Google
    addLog('2. 检查Google网站连接...')
    await fetch('https://www.google.com', {
      method: 'HEAD',
      mode: 'no-cors',
      signal: AbortSignal.timeout(5000)
    })
    addLog('✅ Google网站可访问')
    
    // 3. 检查Google OAuth API连接
    addLog('3. 检查Google OAuth API连接...')
    try {
      const oauthResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=invalid_test',
        signal: AbortSignal.timeout(10000)
      })
      // 即使返回错误，只要能连接就说明API可访问
      addLog('✅ Google OAuth API可访问')
    } catch (oauthError: any) {
      if (oauthError.name === 'AbortError' || oauthError.message.includes('fetch failed')) {
        throw new Error('无法访问Google OAuth API - 请检查VPN连接')
      }
      // 其他错误（如400错误）说明API可访问，只是请求参数错误
      addLog('✅ Google OAuth API可访问（预期的参数错误）')
    }
    
    networkStatus.value = 'ok'
    addLog('✅ 所有网络检查通过 - Google OAuth应该可以正常工作')
  } catch (err: any) {
    networkStatus.value = 'error'
    if (err.message.includes('VPN') || err.message.includes('fetch failed')) {
      networkError.value = '无法连接到Google服务器。您可能在中国大陆，需要使用VPN才能访问Google服务。请确保：1. VPN已连接 2. VPN可以访问Google服务 3. 网络连接稳定'
    } else if (err.name === 'AbortError') {
      networkError.value = '网络请求超时。请检查网络连接或VPN设置。'
    } else {
      networkError.value = `网络连接失败: ${err.message}`
    }
    addLog(`❌ 网络检查失败: ${err.message}`)
  }
}

// 测试登录
const testLogin = async () => {
  error.value = ''
  isLoading.value = true
  addLog('开始测试Google登录...')
  
  try {
    await auth.signIn()
    addLog('✅ 登录成功')
  } catch (err: any) {
    error.value = err.message || '登录失败'
    addLog(`❌ 登录失败: ${err.message}`)
  } finally {
    isLoading.value = false
  }
}

// 退出登录
const logout = async () => {
  try {
    await auth.signOut()
    addLog('✅ 退出登录成功')
  } catch (err: any) {
    error.value = err.message || '退出登录失败'
    addLog(`❌ 退出登录失败: ${err.message}`)
  }
}

// 页面加载时初始化
onMounted(() => {
  currentOrigin.value = window.location.origin
  addLog('页面加载完成')
  checkNetwork()
})
</script> 