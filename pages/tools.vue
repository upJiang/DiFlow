<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-16">
    <!-- 左侧工具栏占位 -->
    <div class="ml-16">
      <!-- 工具箱页面内容 -->
      <div class="p-8">
        <div class="text-center mb-12">
          <div class="text-6xl mb-4">🛠️</div>
          <h1 class="text-4xl font-bold text-gray-800 mb-4">工具箱</h1>
          <p class="text-xl text-gray-600">丰富的实用工具集合，提升您的工作效率</p>
        </div>

        <!-- 搜索栏 -->
        <div class="max-w-2xl mx-auto mb-12">
          <div class="relative">
            <input 
              type="text" 
              placeholder="搜索工具..."
              class="w-full px-6 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
            >
            <button class="absolute right-3 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors">
              搜索
            </button>
          </div>
        </div>

        <!-- 工具分类标签 -->
        <div class="flex flex-wrap justify-center gap-4 mb-12">
          <button class="px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:bg-primary-50 hover:border-primary-300 transition-colors font-medium">
            全部工具
          </button>
          <button class="px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:bg-primary-50 hover:border-primary-300 transition-colors font-medium">
            📝 文本处理
          </button>
          <button class="px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:bg-primary-50 hover:border-primary-300 transition-colors font-medium">
            🎨 图像处理
          </button>
          <button class="px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:bg-primary-50 hover:border-primary-300 transition-colors font-medium">
            📊 数据分析
          </button>
          <button class="px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:bg-primary-50 hover:border-primary-300 transition-colors font-medium">
            🔧 编程工具
          </button>
          <button class="px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:bg-primary-50 hover:border-primary-300 transition-colors font-medium">
            🌐 自定义
          </button>
        </div>

        <!-- 工具网格 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <!-- 文本格式化 -->
          <div class="bg-white/70 backdrop-blur-sm rounded-3xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-primary-300 group cursor-pointer">
            <div class="text-center">
              <div class="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📝</div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">文本格式化</h3>
              <p class="text-gray-600 mb-4 text-sm">
                格式化各种文本，包括JSON、XML、HTML等格式的美化和压缩
              </p>
              <div class="flex justify-center space-x-2 text-xs text-gray-500 mb-4">
                <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg">文本处理</span>
                <span class="px-2 py-1 bg-green-100 text-green-700 rounded-lg">1246次使用</span>
              </div>
              <div class="flex justify-center space-x-1 mb-4">
                <span class="text-yellow-400">⭐</span>
                <span class="text-yellow-400">⭐</span>
                <span class="text-yellow-400">⭐</span>
                <span class="text-yellow-400">⭐</span>
                <span class="text-gray-300">⭐</span>
                <span class="text-xs text-gray-500 ml-2">4.3</span>
              </div>
            </div>
          </div>

          <!-- JSON验证器 -->
          <div class="bg-white/70 backdrop-blur-sm rounded-3xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-primary-300 group cursor-pointer">
            <div class="text-center">
              <div class="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🔍</div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">JSON验证器</h3>
              <p class="text-gray-600 mb-4 text-sm">
                验证JSON格式的正确性，并提供详细的错误信息提示
              </p>
              <div class="flex justify-center space-x-2 text-xs text-gray-500 mb-4">
                <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg">文本处理</span>
                <span class="px-2 py-1 bg-green-100 text-green-700 rounded-lg">892次使用</span>
              </div>
              <div class="flex justify-center space-x-1 mb-4">
                <span class="text-yellow-400">⭐</span>
                <span class="text-yellow-400">⭐</span>
                <span class="text-yellow-400">⭐</span>
                <span class="text-yellow-400">⭐</span>
                <span class="text-yellow-400">⭐</span>
                <span class="text-xs text-gray-500 ml-2">4.9</span>
              </div>
            </div>
          </div>

          <!-- 图片压缩 -->
          <div class="bg-white/70 backdrop-blur-sm rounded-3xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-primary-300 group cursor-pointer">
            <div class="text-center">
              <div class="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🗜️</div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">图片压缩</h3>
              <p class="text-gray-600 mb-4 text-sm">
                无损压缩图片，减小文件大小，支持多种图片格式
              </p>
              <div class="flex justify-center space-x-2 text-xs text-gray-500 mb-4">
                <span class="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg">图像处理</span>
                <span class="px-2 py-1 bg-green-100 text-green-700 rounded-lg">2341次使用</span>
              </div>
              <div class="flex justify-center space-x-1 mb-4">
                <span class="text-yellow-400">⭐</span>
                <span class="text-yellow-400">⭐</span>
                <span class="text-yellow-400">⭐</span>
                <span class="text-yellow-400">⭐</span>
                <span class="text-gray-300">⭐</span>
                <span class="text-xs text-gray-500 ml-2">4.7</span>
              </div>
            </div>
          </div>

          <!-- 代码高亮 -->
          <div class="bg-white/70 backdrop-blur-sm rounded-3xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-primary-300 group cursor-pointer">
            <div class="text-center">
              <div class="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🎨</div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">代码高亮</h3>
              <p class="text-gray-600 mb-4 text-sm">
                为代码添加语法高亮，支持多种编程语言和主题
              </p>
              <div class="flex justify-center space-x-2 text-xs text-gray-500 mb-4">
                <span class="px-2 py-1 bg-orange-100 text-orange-700 rounded-lg">编程工具</span>
                <span class="px-2 py-1 bg-green-100 text-green-700 rounded-lg">567次使用</span>
              </div>
              <div class="flex justify-center space-x-1 mb-4">
                <span class="text-yellow-400">⭐</span>
                <span class="text-yellow-400">⭐</span>
                <span class="text-yellow-400">⭐</span>
                <span class="text-yellow-400">⭐</span>
                <span class="text-gray-300">⭐</span>
                <span class="text-xs text-gray-500 ml-2">4.6</span>
              </div>
            </div>
          </div>

          <!-- 文本翻译 -->
          <div class="bg-white/70 backdrop-blur-sm rounded-3xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-primary-300 group cursor-pointer">
            <div class="text-center">
              <div class="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🌐</div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">文本翻译</h3>
              <p class="text-gray-600 mb-4 text-sm">
                基于AI的高质量文本翻译，支持多种语言和翻译模式
              </p>
              <div class="flex justify-center space-x-2 text-xs text-gray-500 mb-4">
                <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg">AI工具</span>
                <span class="px-2 py-1 bg-green-100 text-green-700 rounded-lg">3421次使用</span>
              </div>
              <div class="flex justify-center space-x-1 mb-4">
                <span class="text-yellow-400">⭐</span>
                <span class="text-yellow-400">⭐</span>
                <span class="text-yellow-400">⭐</span>
                <span class="text-yellow-400">⭐</span>
                <span class="text-yellow-400">⭐</span>
                <span class="text-xs text-gray-500 ml-2">4.5</span>
              </div>
            </div>
          </div>

          <!-- 数据可视化 -->
          <div class="bg-white/70 backdrop-blur-sm rounded-3xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-primary-300 group cursor-pointer">
            <div class="text-center">
              <div class="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📊</div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">数据可视化</h3>
              <p class="text-gray-600 mb-4 text-sm">
                将数据转换为各种图表和可视化图形，便于分析
              </p>
              <div class="flex justify-center space-x-2 text-xs text-gray-500 mb-4">
                <span class="px-2 py-1 bg-red-100 text-red-700 rounded-lg">数据分析</span>
                <span class="px-2 py-1 bg-green-100 text-green-700 rounded-lg">678次使用</span>
              </div>
              <div class="flex justify-center space-x-1 mb-4">
                <span class="text-yellow-400">⭐</span>
                <span class="text-yellow-400">⭐</span>
                <span class="text-yellow-400">⭐</span>
                <span class="text-yellow-400">⭐</span>
                <span class="text-gray-300">⭐</span>
                <span class="text-xs text-gray-500 ml-2">4.4</span>
              </div>
            </div>
          </div>

          <!-- 添加更多工具... -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 页面元信息
useHead({
  title: '工具箱 - DiFlow',
  meta: [
    {
      name: 'description',
      content: '丰富的实用工具集合，提升您的工作效率'
    }
  ]
})
</script> 