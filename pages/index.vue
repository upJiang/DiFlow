<template>
  <div class="min-h-screen">
    <!-- 主页横幅 -->
    <header class="relative overflow-hidden bg-gradient-to-br from-primary-50 to-blue-50">
      <div class="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-blue-600/10"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <!-- Logo -->
          <div class="flex justify-center items-center mb-8">
            <div class="text-6xl mb-4">🤖</div>
          </div>
          
          <h1 class="text-5xl font-bold text-gray-900 mb-6">
            欢迎使用 <span class="text-primary-600">DiFlow</span>
          </h1>
          
          <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            集成对话、工作流和工具的智能平台，让您的工作更高效、更智能
          </p>

          <!-- 用户信息卡片 -->
          <div v-if="authStore.user" class="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-white/20 mb-8">
            <a-avatar :size="48" class="bg-primary-500 mr-4">
              {{ authStore.user.username?.charAt(0).toUpperCase() }}
            </a-avatar>
            <div class="text-left">
              <div class="font-semibold text-gray-900">{{ authStore.user.username }}</div>
              <div class="text-sm text-gray-600">欢迎回来！</div>
            </div>
            <a-dropdown class="ml-4">
              <a-button type="text" class="text-gray-600 hover:text-gray-800">
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

    <!-- 功能导航区域 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">选择您需要的功能</h2>
        <p class="text-lg text-gray-600">点击下方卡片开始使用对应功能</p>
      </div>

      <!-- 功能卡片网格 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <!-- 对话功能卡片 -->
        <div 
          class="feature-card group cursor-pointer"
          @click="navigateTo('/chat')"
        >
          <div class="bg-white/70 backdrop-blur-sm rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-200/50 group-hover:border-primary-300">
            <div class="text-center">
              <div class="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">💬</div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4">智能对话</h3>
              <p class="text-gray-600 mb-6 leading-relaxed">
                与AI进行自然对话，获得智能回答和建议。支持多轮对话，记录历史聊天。
              </p>
              <div class="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-6">
                <span class="flex items-center">
                  <span class="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  多轮对话
                </span>
                <span class="flex items-center">
                  <span class="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  历史记录
                </span>
              </div>
              <a-button 
                type="primary" 
                size="large" 
                class="btn-cartoon btn-primary group-hover:scale-105 transition-transform duration-200"
              >
                开始对话
              </a-button>
            </div>
          </div>
        </div>

        <!-- 工作流功能卡片 -->
        <div 
          class="feature-card group cursor-pointer"
          @click="navigateTo('/workflow')"
        >
          <div class="bg-white/70 backdrop-blur-sm rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-200/50 group-hover:border-primary-300">
            <div class="text-center">
              <div class="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">🔄</div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4">智能工作流</h3>
              <p class="text-gray-600 mb-6 leading-relaxed">
                设计和执行自动化工作流程，提高工作效率。拖拽式设计，简单易用。
              </p>
              <div class="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-6">
                <span class="flex items-center">
                  <span class="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                  可视化设计
                </span>
                <span class="flex items-center">
                  <span class="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                  自动执行
                </span>
              </div>
              <a-button 
                type="primary" 
                size="large" 
                class="btn-cartoon btn-primary group-hover:scale-105 transition-transform duration-200"
              >
                创建工作流
              </a-button>
            </div>
          </div>
        </div>

        <!-- 工具功能卡片 -->
        <div 
          class="feature-card group cursor-pointer"
          @click="navigateTo('/tools')"
        >
          <div class="bg-white/70 backdrop-blur-sm rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-200/50 group-hover:border-primary-300">
            <div class="text-center">
              <div class="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">🛠️</div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4">实用工具</h3>
              <p class="text-gray-600 mb-6 leading-relaxed">
                丰富的实用工具集合，包括文本处理、图像处理、数据分析等多种工具。
              </p>
              <div class="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-6">
                <span class="flex items-center">
                  <span class="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                  多种工具
                </span>
                <span class="flex items-center">
                  <span class="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                  即用即走
                </span>
              </div>
              <a-button 
                type="primary" 
                size="large" 
                class="btn-cartoon btn-primary group-hover:scale-105 transition-transform duration-200"
              >
                使用工具
              </a-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 特性介绍 -->
      <div class="bg-white/50 backdrop-blur-sm rounded-3xl p-12 border border-gray-200/50">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">为什么选择 DiFlow？</h2>
          <p class="text-lg text-gray-600">强大的功能，简洁的界面，为您带来极致的使用体验</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="text-4xl mb-4">⚡</div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">快速高效</h3>
            <p class="text-gray-600 text-sm">响应迅速，操作简便，提升工作效率</p>
          </div>
          <div class="text-center">
            <div class="text-4xl mb-4">🎨</div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">美观界面</h3>
            <p class="text-gray-600 text-sm">现代化设计，视觉体验舒适</p>
          </div>
          <div class="text-center">
            <div class="text-4xl mb-4">🔒</div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">安全可靠</h3>
            <p class="text-gray-600 text-sm">数据加密存储，保护隐私安全</p>
          </div>
          <div class="text-center">
            <div class="text-4xl mb-4">🚀</div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">持续更新</h3>
            <p class="text-gray-600 text-sm">定期添加新功能，持续改进体验</p>
          </div>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="bg-gray-50/50 backdrop-blur-sm border-t border-gray-200/50 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center text-gray-600">
          <p>&copy; 2024 DiFlow. 让工作更智能.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { DownOutlined, LogoutOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

// 页面元数据
definePageMeta({
  middleware: 'auth'
})

// 状态管理
const authStore = useAuthStore()

// 处理登出
const handleLogout = () => {
  authStore.logout()
  message.success('已退出登录')
}

// 初始化
onMounted(() => {
  authStore.init()
})
</script>

<style scoped>
/* 功能卡片悬停效果 */
.feature-card:hover {
  transform: translateY(-8px);
}

.feature-card:hover .bg-white\/70 {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
}

/* 背景装饰 */
.min-h-screen {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-attachment: fixed;
}

/* 玻璃态效果 */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

/* 按钮动画 */
.btn-cartoon {
  @apply transform transition-all duration-200 hover:scale-105;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6c5b7b 100%);
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}
</style> 