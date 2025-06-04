<template>
  <div class="min-h-screen">
    <!-- 顶部导航 -->
    <header class="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo 和导航 -->
          <div class="flex items-center space-x-8">
            <NuxtLink to="/" class="text-2xl font-bold text-primary-600">
              🤖 DiFlow
            </NuxtLink>
            <nav class="flex space-x-6">
              <NuxtLink 
                to="/chat" 
                class="nav-link active"
              >
                💬 对话
              </NuxtLink>
              <NuxtLink 
                to="/workflow" 
                class="nav-link"
              >
                🔄 工作流
              </NuxtLink>
              <NuxtLink 
                to="/tools" 
                class="nav-link"
              >
                🛠️ 工具
              </NuxtLink>
            </nav>
          </div>

          <!-- 用户信息 -->
          <div class="flex items-center space-x-4">
            <a-dropdown>
              <a-button type="text" class="flex items-center space-x-2">
                <a-avatar :size="32" class="bg-primary-500">
                  {{ authStore.user?.username?.charAt(0).toUpperCase() }}
                </a-avatar>
                <span class="hidden sm:inline">{{ authStore.user?.username }}</span>
                <DownOutlined />
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="logout" @click="handleLogout">
                    <LogoutOutlined />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>
      </div>
    </header>

    <!-- 聊天主要内容 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex h-[calc(100vh-12rem)]">
        <!-- 聊天历史侧边栏 -->
        <div class="w-80 bg-white/70 backdrop-blur-sm rounded-2xl p-4 mr-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-800">聊天历史</h3>
            <a-button
              type="primary"
              size="small"
              @click="startNewChat"
              class="btn-cartoon btn-primary"
            >
              新对话
            </a-button>
          </div>
          
          <div class="space-y-2 max-h-96 overflow-y-auto">
            <div
              v-for="chat in chatHistory"
              :key="chat.id"
              :class="[
                'p-3 rounded-xl cursor-pointer transition-all duration-200',
                currentChatId === chat.id
                  ? 'bg-primary-100 border-2 border-primary-300'
                  : 'bg-gray-50 hover:bg-gray-100'
              ]"
              @click="selectChat(chat.id)"
            >
              <div class="font-medium text-sm truncate">{{ chat.title }}</div>
              <div class="text-xs text-gray-500 mt-1">
                {{ formatDate(chat.updatedAt) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 主聊天区域 -->
        <div class="flex-1 flex flex-col">
          <!-- 模型选择 -->
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-4 mb-4">
            <div class="flex items-center space-x-4">
              <span class="text-sm font-medium text-gray-700">AI 模型：</span>
              <a-select
                v-model:value="selectedModel"
                style="width: 200px"
                class="rounded-xl"
              >
                <a-select-option value="deepseek-chat">
                  🧠 DeepSeek Chat
                </a-select-option>
              </a-select>
            </div>
          </div>

          <!-- 聊天消息区域 -->
          <div class="flex-1 bg-white/70 backdrop-blur-sm rounded-2xl p-4 mb-4 overflow-hidden">
            <div
              ref="messagesContainer"
              class="h-full overflow-y-auto space-y-4 pr-2"
            >
              <div
                v-for="message in currentMessages"
                :key="message.id"
                class="flex"
                :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
              >
                <div
                  :class="[
                    'max-w-xs lg:max-w-md px-4 py-3 rounded-2xl',
                    message.role === 'user'
                      ? 'chat-bubble-user'
                      : 'chat-bubble-assistant'
                  ]"
                >
                  <div class="text-sm whitespace-pre-wrap">{{ message.content }}</div>
                  <div class="text-xs opacity-70 mt-2">
                    {{ formatTime(message.timestamp) }}
                  </div>
                </div>
              </div>
              
              <!-- 加载指示器 -->
              <div v-if="isLoading" class="flex justify-start">
                <div class="chat-bubble-assistant">
                  <div class="flex items-center space-x-2">
                    <a-spin size="small" />
                    <span class="text-sm">AI 正在思考...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 输入区域 -->
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
            <div class="flex space-x-3">
              <a-textarea
                v-model:value="inputMessage"
                placeholder="输入您的消息..."
                :rows="3"
                class="flex-1 input-cartoon resize-none"
                @keydown.enter.exact.prevent="sendMessage"
                @keydown.enter.shift.exact="() => {}"
              />
              <a-button
                type="primary"
                size="large"
                :loading="isLoading"
                :disabled="!inputMessage.trim()"
                @click="sendMessage"
                class="btn-cartoon btn-primary px-8"
              >
                发送
              </a-button>
            </div>
            <div class="text-xs text-gray-500 mt-2">
              按 Enter 发送，Shift + Enter 换行
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { DownOutlined, LogoutOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { ChatMessage, Chat } from '~/types'

// 页面元数据
definePageMeta({
  middleware: 'auth'
})

// 状态管理
const authStore = useAuthStore()

// 响应式数据
const inputMessage = ref('')
const selectedModel = ref('deepseek-chat')
const isLoading = ref(false)
const currentChatId = ref<string | null>(null)
const currentMessages = ref<ChatMessage[]>([])
const chatHistory = ref<Chat[]>([])
const messagesContainer = ref<HTMLElement>()

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return

  const userMessage = inputMessage.value.trim()
  inputMessage.value = ''
  isLoading.value = true

  // 添加用户消息到界面
  const userMsg: ChatMessage = {
    id: crypto.randomUUID(),
    role: 'user',
    content: userMessage,
    timestamp: new Date().toISOString()
  }
  currentMessages.value.push(userMsg)

  // 滚动到底部
  nextTick(() => {
    scrollToBottom()
  })

  try {
    const response = await $fetch('/api/chat/send', {
      method: 'POST',
      headers: authStore.getAuthHeaders(),
      body: {
        message: userMessage,
        model: selectedModel.value,
        chatId: currentChatId.value
      }
    })

    if (response.success && response.data) {
      // 添加 AI 回复到界面
      currentMessages.value.push(response.data.message)
      currentChatId.value = response.data.chatId

      // 更新聊天历史
      await loadChatHistory()
    }
  } catch (error: any) {
    message.error(error.data?.message || '发送失败')
  } finally {
    isLoading.value = false
    nextTick(() => {
      scrollToBottom()
    })
  }
}

// 开始新对话
const startNewChat = () => {
  currentChatId.value = null
  currentMessages.value = []
}

// 选择聊天
const selectChat = async (chatId: string) => {
  try {
    const response = await $fetch(`/api/chat/${chatId}`, {
      headers: authStore.getAuthHeaders()
    })

    if (response.success && response.data) {
      currentChatId.value = chatId
      currentMessages.value = response.data.messages
      nextTick(() => {
        scrollToBottom()
      })
    }
  } catch (error: any) {
    message.error('加载聊天记录失败')
  }
}

// 加载聊天历史
const loadChatHistory = async () => {
  try {
    const response = await $fetch('/api/chat/history', {
      headers: authStore.getAuthHeaders()
    })

    if (response.success && response.data) {
      chatHistory.value = response.data
    }
  } catch (error: any) {
    console.error('加载聊天历史失败:', error)
  }
}

// 滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return '今天'
  } else if (days === 1) {
    return '昨天'
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString()
  }
}

// 格式化时间
const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 处理登出
const handleLogout = () => {
  authStore.logout()
  message.success('已退出登录')
}

// 初始化
onMounted(() => {
  authStore.init()
  loadChatHistory()
})
</script>

<style scoped>
/* 导航链接样式 */
.nav-link {
  @apply px-4 py-2 rounded-xl text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 font-medium;
}

.nav-link.active {
  @apply text-primary-600 bg-primary-100;
}

/* 自定义样式 */
.ant-select {
  @apply rounded-xl;
}

:deep(.ant-select-selector) {
  @apply rounded-xl border-2 border-cute-purple/30;
}

:deep(.ant-textarea) {
  @apply input-cartoon;
}
</style> 