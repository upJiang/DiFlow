<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-16">
    <!-- 左侧工具栏占位 -->
    <div class="ml-16">
      <!-- 工作流页面内容 -->
      <div class="p-8">
        <div class="text-center mb-12">
          <div class="text-6xl mb-4">⚡</div>
          <h1 class="text-4xl font-bold text-gray-800 mb-4">工作流引擎</h1>
          <p class="text-xl text-gray-600">让AI为您自动化复杂的工作流程</p>
        </div>

        <!-- 操作工具栏 -->
        <div class="flex justify-between items-center mb-8 max-w-7xl mx-auto">
          <div class="flex space-x-4">
            <button class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg font-medium">
              ➕ 创建新工作流
            </button>
            <button class="px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors font-medium">
              📥 导入工作流
            </button>
            <button class="px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors font-medium">
              📑 模板库
            </button>
          </div>
          
          <div class="flex space-x-3">
            <div class="relative">
              <input 
                type="text" 
                placeholder="搜索工作流..."
                class="pl-10 pr-4 py-3 w-80 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
              >
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
            <select class="px-4 py-3 rounded-2xl border border-gray-300 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>全部状态</option>
              <option>运行中</option>
              <option>已暂停</option>
              <option>已完成</option>
              <option>失败</option>
            </select>
          </div>
        </div>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 max-w-7xl mx-auto">
          <div class="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50">
            <div class="flex items-center justify-between mb-4">
              <div class="text-3xl">📊</div>
              <div class="text-sm text-gray-500">总计</div>
            </div>
            <div class="text-2xl font-bold text-gray-900 mb-1">24</div>
            <div class="text-sm text-gray-600">已创建工作流</div>
          </div>
          
          <div class="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50">
            <div class="flex items-center justify-between mb-4">
              <div class="text-3xl">⚡</div>
              <div class="text-sm text-green-500">+12%</div>
            </div>
            <div class="text-2xl font-bold text-gray-900 mb-1">8</div>
            <div class="text-sm text-gray-600">运行中</div>
          </div>
          
          <div class="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50">
            <div class="flex items-center justify-between mb-4">
              <div class="text-3xl">✅</div>
              <div class="text-sm text-green-500">+5%</div>
            </div>
            <div class="text-2xl font-bold text-gray-900 mb-1">156</div>
            <div class="text-sm text-gray-600">已完成任务</div>
          </div>
          
          <div class="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50">
            <div class="flex items-center justify-between mb-4">
              <div class="text-3xl">💾</div>
              <div class="text-sm text-blue-500">-8min</div>
            </div>
            <div class="text-2xl font-bold text-gray-900 mb-1">2.4h</div>
            <div class="text-sm text-gray-600">节省时间</div>
          </div>
        </div>

        <!-- 工作流列表 -->
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <!-- 工作流卡片 1 -->
            <div class="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 hover:shadow-xl transition-all duration-300 group">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl">
                    📧
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-gray-900">邮件自动化</h3>
                    <div class="flex items-center space-x-2 text-sm text-gray-500">
                      <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>运行中</span>
                    </div>
                  </div>
                </div>
                <button class="text-gray-400 hover:text-gray-600">⋯</button>
              </div>
              
              <p class="text-gray-600 mb-4 text-sm">
                自动处理客户邮件，智能分类和回复常见问题
              </p>
              
              <div class="flex items-center justify-between mb-4">
                <div class="flex space-x-2">
                  <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">邮件处理</span>
                  <span class="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs">AI回复</span>
                </div>
                <div class="text-sm text-gray-500">今日: 24次</div>
              </div>
              
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2 text-sm text-gray-500">
                  <span>📅 2024-01-15</span>
                  <span>⏱️ 2分钟前</span>
                </div>
                <button class="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm">
                  查看详情
                </button>
              </div>
            </div>

            <!-- 工作流卡片 2 -->
            <div class="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 hover:shadow-xl transition-all duration-300 group">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white text-xl">
                    📄
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-gray-900">文档生成器</h3>
                    <div class="flex items-center space-x-2 text-sm text-gray-500">
                      <span class="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      <span>暂停中</span>
                    </div>
                  </div>
                </div>
                <button class="text-gray-400 hover:text-gray-600">⋯</button>
              </div>
              
              <p class="text-gray-600 mb-4 text-sm">
                根据数据自动生成报告和文档，支持多种格式导出
              </p>
              
              <div class="flex items-center justify-between mb-4">
                <div class="flex space-x-2">
                  <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs">文档处理</span>
                  <span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs">自动化</span>
                </div>
                <div class="text-sm text-gray-500">今日: 12次</div>
              </div>
              
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2 text-sm text-gray-500">
                  <span>📅 2024-01-14</span>
                  <span>⏱️ 1小时前</span>
                </div>
                <button class="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors text-sm">
                  查看详情
                </button>
              </div>
            </div>

            <!-- 工作流卡片 3 -->
            <div class="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 hover:shadow-xl transition-all duration-300 group">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-xl">
                    🎯
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-gray-900">数据分析流水线</h3>
                    <div class="flex items-center space-x-2 text-sm text-gray-500">
                      <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>运行中</span>
                    </div>
                  </div>
                </div>
                <button class="text-gray-400 hover:text-gray-600">⋯</button>
              </div>
              
              <p class="text-gray-600 mb-4 text-sm">
                自动收集、清洗和分析数据，生成可视化报表
              </p>
              
              <div class="flex items-center justify-between mb-4">
                <div class="flex space-x-2">
                  <span class="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs">数据分析</span>
                  <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">可视化</span>
                </div>
                <div class="text-sm text-gray-500">今日: 8次</div>
              </div>
              
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2 text-sm text-gray-500">
                  <span>📅 2024-01-13</span>
                  <span>⏱️ 30分钟前</span>
                </div>
                <button class="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-sm">
                  查看详情
                </button>
              </div>
            </div>

            <!-- 创建新工作流卡片 -->
            <div class="bg-white/50 backdrop-blur-sm rounded-3xl p-6 border-2 border-dashed border-gray-300 hover:border-primary-400 transition-all duration-300 group cursor-pointer">
              <div class="text-center py-8">
                <div class="text-6xl mb-4 opacity-50 group-hover:opacity-100 transition-opacity">➕</div>
                <h3 class="text-lg font-bold text-gray-700 mb-2">创建新工作流</h3>
                <p class="text-gray-500 text-sm mb-6">从模板开始或者从头创建</p>
                <div class="space-y-3">
                  <button class="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all text-sm">
                    从模板创建
                  </button>
                  <button class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                    从头开始
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 最近活动 -->
        <div class="mt-12 max-w-7xl mx-auto">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">最近活动</h2>
          <div class="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50">
            <div class="space-y-4">
              <div class="flex items-center space-x-4 p-4 hover:bg-gray-50/50 rounded-2xl transition-colors">
                <div class="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center">
                  ✅
                </div>
                <div class="flex-1">
                  <div class="font-medium text-gray-900">邮件自动化工作流完成了24个任务</div>
                  <div class="text-sm text-gray-500">2分钟前</div>
                </div>
                <div class="text-sm text-green-600 font-medium">+24 处理量</div>
              </div>
              
              <div class="flex items-center space-x-4 p-4 hover:bg-gray-50/50 rounded-2xl transition-colors">
                <div class="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
                  🔄
                </div>
                <div class="flex-1">
                  <div class="font-medium text-gray-900">数据分析流水线开始新的运行周期</div>
                  <div class="text-sm text-gray-500">30分钟前</div>
                </div>
                <div class="text-sm text-blue-600 font-medium">运行中</div>
              </div>
              
              <div class="flex items-center space-x-4 p-4 hover:bg-gray-50/50 rounded-2xl transition-colors">
                <div class="w-10 h-10 bg-yellow-100 rounded-2xl flex items-center justify-center">
                  ⏸️
                </div>
                <div class="flex-1">
                  <div class="font-medium text-gray-900">文档生成器已暂停</div>
                  <div class="text-sm text-gray-500">1小时前</div>
                </div>
                <div class="text-sm text-yellow-600 font-medium">需要注意</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 页面元信息
useHead({
  title: '工作流 - DiFlow',
  meta: [
    {
      name: 'description',
      content: '智能工作流引擎，让AI为您自动化复杂的工作流程'
    }
  ]
})
</script> 