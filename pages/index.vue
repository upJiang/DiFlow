<template>
  <div class="h-screen overflow-hidden">
    <!-- 主内容区域 -->
    <div class="h-full flex flex-col">
      <!-- 欢迎区域 -->
      <div v-if="!authStore.isAuthenticated" class="flex-1 flex items-center justify-center p-8">
        <div class="text-center max-w-2xl">
          <div class="text-8xl mb-8">🤖</div>
          <h1 class="text-5xl font-bold text-gray-800 mb-6">
            欢迎使用 <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">DiFlow</span>
          </h1>
          <p class="text-xl text-gray-600 mb-12 leading-relaxed">
            智能对话 · 工作流自动化 · 实用工具集合<br>
            让AI成为您最得力的工作助手
          </p>
          
          <!-- 功能特色卡片 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div class="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div class="text-4xl mb-4">💬</div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">智能对话</h3>
              <p class="text-gray-600 text-sm">与AI进行自然对话，获得专业建议和解答</p>
            </div>
            
            <div class="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div class="text-4xl mb-4">⚡</div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">工作流自动化</h3>
              <p class="text-gray-600 text-sm">设计和运行自动化工作流，提升效率</p>
            </div>
            
            <div class="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div class="text-4xl mb-4">🛠️</div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">实用工具</h3>
              <p class="text-gray-600 text-sm">丰富的工具集合，满足各种工作需求</p>
            </div>
          </div>

          <div class="text-sm text-gray-500">
            请先登录以开始使用所有功能
          </div>
        </div>
      </div>

      <!-- 已登录用户的对话界面 -->
      <div v-else class="flex-1 flex flex-col">
        <!-- 对话区域 -->
        <div class="flex-1 overflow-auto p-6">
          <div class="max-w-4xl mx-auto">
            <!-- 空状态 -->
            <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-center py-16">
              <div class="text-6xl mb-6">💭</div>
              <h2 class="text-2xl font-bold text-gray-800 mb-4">开始新的对话</h2>
              <p class="text-gray-600 mb-8">向AI提问任何问题，或者选择下面的示例开始</p>
              
              <!-- 示例问题 -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                <button 
                  @click="sendExampleMessage('如何优化网站的SEO？')"
                  class="p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all text-left"
                >
                  <div class="text-lg mb-2">🔍</div>
                  <div class="font-medium text-gray-900">SEO优化建议</div>
                  <div class="text-sm text-gray-600">获取专业的搜索引擎优化建议</div>
                </button>
                
                <button 
                  @click="sendExampleMessage('帮我写一个Python数据分析脚本')"
                  class="p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all text-left"
                >
                  <div class="text-lg mb-2">🐍</div>
                  <div class="font-medium text-gray-900">编程帮助</div>
                  <div class="text-sm text-gray-600">获取代码示例和编程指导</div>
                </button>
                
                <button 
                  @click="sendExampleMessage('解释一下机器学习的基本概念')"
                  class="p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all text-left"
                >
                  <div class="text-lg mb-2">🧠</div>
                  <div class="font-medium text-gray-900">知识学习</div>
                  <div class="text-sm text-gray-600">学习新概念和技术知识</div>
                </button>
                
                <button 
                  @click="sendExampleMessage('创建一个项目管理工作流')"
                  class="p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all text-left"
                >
                  <div class="text-lg mb-2">📋</div>
                  <div class="font-medium text-gray-900">工作流设计</div>
                  <div class="text-sm text-gray-600">设计自动化的工作流程</div>
                </button>
              </div>
            </div>

            <!-- 消息列表 -->
            <div v-else class="space-y-6">
              <div 
                v-for="message in messages" 
                :key="message.id"
                class="flex items-start space-x-4"
                :class="{ 'flex-row-reverse space-x-reverse': message.role === 'user' }"
              >
                <!-- 头像 -->
                <div class="flex-shrink-0">
                  <div v-if="message.role === 'user'" class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-medium">
                    {{ authStore.user?.name?.charAt(0) || 'U' }}
                  </div>
                  <div v-else class="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center text-white">
                    🤖
                  </div>
                </div>

                <!-- 消息内容 -->
                <div class="flex-1 max-w-3xl">
                  <div 
                    class="p-4 rounded-2xl shadow-sm"
                    :class="message.role === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                      : 'bg-white/70 backdrop-blur-sm border border-gray-200/50'"
                  >
                    <div class="whitespace-pre-wrap break-words">{{ message.content }}</div>
                  </div>
                  <div class="text-xs text-gray-500 mt-2" :class="{ 'text-right': message.role === 'user' }">
                    {{ formatTime(message.timestamp) }}
                  </div>
                </div>
              </div>

              <!-- 加载状态 -->
              <div v-if="loading" class="flex items-start space-x-4">
                <div class="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center text-white">
                  🤖
                </div>
                <div class="flex-1 max-w-3xl">
                  <div class="p-4 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl">
                    <div class="flex items-center space-x-2">
                      <div class="flex space-x-1">
                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                      </div>
                      <span class="text-gray-500 text-sm">AI正在思考...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="border-t border-gray-200/50 bg-white/80 backdrop-blur-md p-6">
          <div class="max-w-4xl mx-auto">
            <form @submit.prevent="sendMessage" class="flex items-end space-x-4">
              <div class="flex-1">
                <textarea
                  v-model="inputMessage"
                  @keydown.enter.prevent="handleEnter"
                  placeholder="输入您的问题..."
                  rows="1"
                  class="w-full p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white/80 backdrop-blur-sm"
                  style="min-height: 56px; max-height: 200px;"
                ></textarea>
              </div>
              <button
                type="submit"
                :disabled="!inputMessage.trim() || loading"
                class="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg font-medium"
              >
                发送
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

// 页面元信息
useHead({
  title: 'DiFlow - AI 工作流平台',
  meta: [
    {
      name: 'description',
      content: '智能对话、工作流自动化、实用工具集合 - 让AI成为您最得力的工作助手'
    }
  ]
})

// 响应式数据
const authStore = useAuthStore()
const inputMessage = ref('')
const messages = ref<Array<{ id: string, role: 'user' | 'assistant', content: string, timestamp: Date }>>([])
const loading = ref(false)

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || loading.value) return

  const userMessage = {
    id: Date.now().toString(),
    role: 'user' as const,
    content: inputMessage.value.trim(),
    timestamp: new Date()
  }

  messages.value.push(userMessage)
  const messageContent = inputMessage.value.trim()
  inputMessage.value = ''
  loading.value = true

  try {
    const response = await $fetch('/api/chat/send', {
      method: 'POST',
      body: {
        message: messageContent,
        model: 'deepseek-chat'
      }
    })

    if (response.success) {
      messages.value.push({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.reply,
        timestamp: new Date()
      })
    } else {
      throw new Error(response.message || '发送失败')
    }
  } catch (error) {
    console.error('发送消息失败:', error)
    messages.value.push({
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '抱歉，发送消息时遇到了问题。请稍后再试。',
      timestamp: new Date()
    })
  } finally {
    loading.value = false
    await nextTick()
    scrollToBottom()
  }
}

// 发送示例消息
const sendExampleMessage = (message: string) => {
  inputMessage.value = message
  sendMessage()
}

// 处理回车键
const handleEnter = (event: KeyboardEvent) => {
  if (event.shiftKey) {
    // Shift + Enter 换行
    return
  }
  event.preventDefault()
  sendMessage()
}

// 滚动到底部
const scrollToBottom = () => {
  const chatContainer = document.querySelector('.overflow-auto')
  if (chatContainer) {
    chatContainer.scrollTop = chatContainer.scrollHeight
  }
}

// 格式化时间
const formatTime = (date: Date) => {
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}
</script> 