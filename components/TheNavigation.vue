<template>
  <!-- 顶部导航栏 -->
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
    <div class="px-6 py-4">
      <div class="flex items-center justify-between">
        <!-- 左侧：Logo和菜单 -->
        <div class="flex items-center space-x-8">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-3 group">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
                <path d="M8 12l2 2 4-4" stroke="white" stroke-width="2" fill="none"/>
              </svg>
            </div>
            <span class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DiFlow
            </span>
          </NuxtLink>

          <!-- 主导航菜单 -->
          <div class="hidden lg:flex items-center space-x-1">
            <NuxtLink 
              to="/" 
              class="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              :class="{ 'bg-blue-50 text-blue-600': $route.path === '/' }"
            >
              <span class="text-lg">💬</span>
              <span class="font-medium">对话</span>
            </NuxtLink>
            
            <NuxtLink 
              to="/workflow" 
              class="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
              :class="{ 'bg-purple-50 text-purple-600': $route.path === '/workflow' }"
            >
              <span class="text-lg">⚡</span>
              <span class="font-medium">工作流</span>
            </NuxtLink>
            
            <NuxtLink 
              to="/tools" 
              class="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
              :class="{ 'bg-green-50 text-green-600': $route.path === '/tools' }"
            >
              <span class="text-lg">🛠️</span>
              <span class="font-medium">工具</span>
            </NuxtLink>
          </div>
        </div>

        <!-- 右侧：搜索和用户 -->
        <div class="flex items-center space-x-4">
          <!-- 搜索框（隐藏在小屏幕） -->
          <div class="hidden md:block relative">
            <input 
              type="text" 
              placeholder="搜索..." 
              class="w-64 pl-10 pr-4 py-2 bg-gray-100/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            >
            <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>

          <!-- 通知按钮 -->
          <button class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
            <span class="text-xl">🔔</span>
            <span class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
          </button>

          <!-- 用户菜单 -->
          <div class="flex items-center space-x-4">
            <div v-if="!authStore.isAuthenticated" class="flex items-center space-x-2">
              <button
                @click="handleGoogleLogin"
                class="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Google 登录</span>
              </button>
            </div>
            <div v-else class="flex items-center space-x-4">
              <div class="flex items-center space-x-2">
                <img
                  v-if="authStore.user?.image"
                  :src="authStore.user.image"
                  :alt="authStore.user.name"
                  class="w-8 h-8 rounded-full"
                >
                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm" v-else>
                  {{ authStore.user?.name?.charAt(0).toUpperCase() || 'U' }}
                </div>
                <span class="text-white">{{ authStore.user?.name || authStore.user?.email }}</span>
              </div>
              <button
                @click="handleLogout"
                class="text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                登出
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- 侧边栏 -->
  <aside class="fixed left-0 top-16 bottom-0 w-16 bg-white/80 backdrop-blur-md border-r border-gray-200/50 z-40 transition-all duration-300 hover:w-64 group">
    <div class="p-3">
      <!-- 侧边栏切换按钮 -->
      <button 
        @click="toggleSidebar"
        class="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors mb-4"
      >
        <span class="text-lg" :class="{ 'rotate-180': sidebarExpanded }">📋</span>
      </button>

      <!-- 快速操作 -->
      <div class="space-y-2">
        <!-- 新建对话 -->
        <button class="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors group/item">
          <span class="text-lg">💬</span>
          <div class="absolute left-16 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 group-hover/item:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            新建对话
          </div>
        </button>

        <!-- 新建工作流 -->
        <button class="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors group/item">
          <span class="text-lg">⚡</span>
          <div class="absolute left-16 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 group-hover/item:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            新建工作流
          </div>
        </button>

        <!-- 历史记录 -->
        <button class="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors group/item">
          <span class="text-lg">📚</span>
          <div class="absolute left-16 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 group-hover/item:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            历史记录
          </div>
        </button>

        <!-- 设置 -->
        <button class="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors group/item">
          <span class="text-lg">⚙️</span>
          <div class="absolute left-16 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 group-hover/item:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            设置
          </div>
        </button>
      </div>
    </div>

    <!-- 展开状态下的侧边栏内容 -->
    <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-16 left-16 right-0 bottom-0 bg-white/95 backdrop-blur-md border-l border-gray-200/50 p-4">
      <div class="space-y-4">
        <div>
          <h3 class="text-sm font-medium text-gray-900 mb-2">最近对话</h3>
          <div class="space-y-2">
            <div class="p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div class="text-sm font-medium text-gray-900 truncate">如何优化数据库查询？</div>
              <div class="text-xs text-gray-500">2分钟前</div>
            </div>
            <div class="p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div class="text-sm font-medium text-gray-900 truncate">Vue 3 Composition API最佳实践</div>
              <div class="text-xs text-gray-500">1小时前</div>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-900 mb-2">活跃工作流</h3>
          <div class="space-y-2">
            <div class="p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div class="flex items-center space-x-2">
                <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                <div class="text-sm font-medium text-gray-900 truncate">邮件自动化</div>
              </div>
              <div class="text-xs text-gray-500">运行中</div>
            </div>
            <div class="p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div class="flex items-center space-x-2">
                <span class="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <div class="text-sm font-medium text-gray-900 truncate">文档生成器</div>
              </div>
              <div class="text-xs text-gray-500">暂停中</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 侧边栏状态
const sidebarExpanded = ref(false)

// 获取认证状态
const authStore = useAuthStore()

// 切换侧边栏
const toggleSidebar = () => {
  sidebarExpanded.value = !sidebarExpanded.value
}

// Google 登录
const handleGoogleLogin = async () => {
  try {
    await useAuth().signIn('google')
  } catch (error: any) {
    console.error('Google登录失败:', error)
    // 可以在这里添加用户友好的错误提示
    alert('登录失败，请稍后重试')
  }
}

// 登出
const handleLogout = () => {
  authStore.logout()
}
</script> 