<template>
  <div class="chat-page">
    <!-- 顶部导航 -->
    <header class="chat-header">
      <div class="header-container">
        <div class="header-content">
          <!-- Logo 和导航 -->
          <div class="nav-section">
            <NuxtLink to="/" class="logo-link">
              🤖 DiFlow
            </NuxtLink>
            <nav class="nav-menu">
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
          <div class="user-section">
            <a-dropdown>
              <a-button type="text" class="user-button">
                <a-avatar :size="32" class="user-avatar">
                  {{ authStore.user?.username?.charAt(0).toUpperCase() }}
                </a-avatar>
                <span class="username">{{ authStore.user?.username }}</span>
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
    <main class="chat-main">
      <div class="chat-container">
        <!-- 聊天历史侧边栏 -->
        <div class="chat-sidebar">
          <div class="sidebar-header">
            <h3 class="sidebar-title">聊天历史</h3>
            <a-button
              type="primary"
              size="small"
              @click="startNewChat"
              class="new-chat-btn"
            >
              ✨ 新对话
            </a-button>
          </div>
          
          <div class="chat-history">
            <div
              v-for="chat in chatHistory"
              :key="chat.id"
              :class="[
                'chat-item',
                currentChatId === chat.id ? 'active' : ''
              ]"
              @click="selectChat(chat.id)"
            >
              <div class="chat-title">{{ chat.title }}</div>
              <div class="chat-date">
                {{ formatDate(chat.updatedAt) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 主聊天区域 -->
        <div class="chat-content">
          <!-- 模型选择 -->
          <div class="model-selector">
            <div class="model-section">
              <span class="model-label">🧠 AI 模型：</span>
              <a-select
                v-model:value="selectedModel"
                class="model-select"
              >
                <a-select-option value="deepseek-chat">
                  🧠 DeepSeek Chat
                </a-select-option>
              </a-select>
            </div>
          </div>

          <!-- 聊天消息区域 -->
          <div class="messages-area">
            <div
              ref="messagesContainer"
              class="messages-container"
            >
              <div
                v-for="message in currentMessages"
                :key="message.id"
                class="message-wrapper"
                :class="message.role === 'user' ? 'user-message' : 'assistant-message'"
              >
                <div class="message-bubble">
                  <div class="message-content">{{ message.content }}</div>
                  <div class="message-time">
                    {{ formatTime(message.timestamp) }}
                  </div>
                </div>
              </div>
              
              <!-- 加载指示器 -->
              <div v-if="isLoading" class="loading-message">
                <div class="message-bubble assistant-bubble">
                  <div class="loading-content">
                    <a-spin size="small" />
                    <span>AI 正在思考...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 输入区域 -->
          <div class="input-area">
            <div class="input-container">
              <a-textarea
                v-model:value="inputMessage"
                placeholder="输入您的消息..."
                :rows="3"
                class="message-input"
                @keydown.enter.exact.prevent="sendMessage"
                @keydown.enter.shift.exact="() => {}"
              />
              <a-button
                type="primary"
                size="large"
                :loading="isLoading"
                :disabled="!inputMessage.trim()"
                @click="sendMessage"
                class="send-button"
              >
                🚀 发送
              </a-button>
            </div>
            <div class="input-hint">
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

<style scoped lang="scss">
.chat-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%);
    animation: backgroundShift 20s ease-in-out infinite;
  }
}

@keyframes backgroundShift {
  0%, 100% { transform: translateX(0) translateY(0); }
  33% { transform: translateX(-20px) translateY(-10px); }
  66% { transform: translateX(20px) translateY(10px); }
}

.chat-header {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
}

.nav-section {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo-link {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
}

.nav-menu {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  padding: 0.5rem 1rem;
  border-radius: 12px;
  text-decoration: none;
  color: #666;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
    transform: translateY(-2px);
  }
  
  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
}

.user-section {
  display: flex;
  align-items: center;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }
}

.user-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

.username {
  font-weight: 500;
  color: #333;
  
  @media (max-width: 640px) {
    display: none;
  }
}

.chat-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  position: relative;
  z-index: 1;
}

.chat-container {
  display: flex;
  height: calc(100vh - 12rem);
  gap: 1.5rem;
}

.chat-sidebar {
  width: 320px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.sidebar-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.new-chat-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none !important;
  border-radius: 12px !important;
  font-weight: 500 !important;
  transition: all 0.3s ease !important;
  
  &:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4) !important;
  }
}

.chat-history {
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(102, 126, 234, 0.3);
    border-radius: 3px;
    
    &:hover {
      background: rgba(102, 126, 234, 0.5);
    }
  }
}

.chat-item {
  padding: 0.75rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid transparent;
  
  &:hover {
    background: rgba(102, 126, 234, 0.05);
    transform: translateY(-1px);
  }
  
  &.active {
    background: rgba(102, 126, 234, 0.1);
    border-color: rgba(102, 126, 234, 0.3);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  }
}

.chat-title {
  font-weight: 500;
  font-size: 0.875rem;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-date {
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.25rem;
}

.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.model-selector {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 1rem 1.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.model-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.model-label {
  font-weight: 500;
  color: #333;
  font-size: 0.875rem;
}

.model-select {
  width: 200px;
  
  :deep(.ant-select-selector) {
    border-radius: 12px !important;
    border: 1px solid rgba(102, 126, 234, 0.2) !important;
    
    &:hover {
      border-color: rgba(102, 126, 234, 0.4) !important;
    }
  }
  
  :deep(.ant-select-focused .ant-select-selector) {
    border-color: #667eea !important;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) !important;
  }
}

.messages-area {
  flex: 1;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 1.5rem;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.messages-container {
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-right: 0.5rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(102, 126, 234, 0.3);
    border-radius: 3px;
    
    &:hover {
      background: rgba(102, 126, 234, 0.5);
    }
  }
}

.message-wrapper {
  display: flex;
  
  &.user-message {
    justify-content: flex-end;
  }
  
  &.assistant-message {
    justify-content: flex-start;
  }
}

.message-bubble {
  max-width: 70%;
  padding: 1rem 1.25rem;
  border-radius: 20px;
  position: relative;
  animation: messageSlideIn 0.3s ease-out;
  
  .user-message & {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-bottom-right-radius: 8px;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      right: -8px;
      width: 0;
      height: 0;
      border: 8px solid transparent;
      border-left-color: #764ba2;
      border-bottom: none;
      border-right: none;
    }
  }
  
  .assistant-message & {
    background: rgba(248, 250, 252, 0.9);
    color: #333;
    border: 1px solid rgba(102, 126, 234, 0.1);
    border-bottom-left-radius: 8px;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: -8px;
      width: 0;
      height: 0;
      border: 8px solid transparent;
      border-right-color: rgba(248, 250, 252, 0.9);
      border-bottom: none;
      border-left: none;
    }
  }
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-content {
  font-size: 0.875rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 0.5rem;
}

.loading-message {
  display: flex;
  justify-content: flex-start;
}

.assistant-bubble {
  background: rgba(248, 250, 252, 0.9) !important;
  color: #333 !important;
  border: 1px solid rgba(102, 126, 234, 0.1) !important;
}

.loading-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.input-area {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.input-container {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.message-input {
  flex: 1;
  resize: none;
  
  :deep(.ant-input) {
    border-radius: 16px !important;
    border: 1px solid rgba(102, 126, 234, 0.2) !important;
    padding: 0.75rem 1rem !important;
    font-size: 0.875rem !important;
    
    &:hover {
      border-color: rgba(102, 126, 234, 0.4) !important;
    }
    
    &:focus {
      border-color: #667eea !important;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) !important;
    }
  }
}

.send-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none !important;
  border-radius: 16px !important;
  padding: 0 2rem !important;
  font-weight: 500 !important;
  transition: all 0.3s ease !important;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4) !important;
  }
  
  &:disabled {
    opacity: 0.6 !important;
    cursor: not-allowed !important;
  }
}

.input-hint {
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.5rem;
  text-align: center;
}

// 响应式设计
@media (max-width: 1024px) {
  .chat-container {
    flex-direction: column;
    height: auto;
  }
  
  .chat-sidebar {
    width: 100%;
    order: 2;
  }
  
  .chat-content {
    order: 1;
    min-height: 60vh;
  }
}

@media (max-width: 640px) {
  .chat-main {
    padding: 1rem;
  }
  
  .chat-container {
    gap: 1rem;
  }
  
  .chat-sidebar,
  .model-selector,
  .messages-area,
  .input-area {
    padding: 1rem;
  }
  
  .message-bubble {
    max-width: 85%;
  }
}
</style> 