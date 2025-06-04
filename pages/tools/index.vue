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
                class="nav-link"
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
                class="nav-link active"
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

    <!-- 工具主要内容 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 工具分类导航 -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-3xl font-bold text-gray-900">🛠️ 工具箱</h1>
          <div class="flex items-center space-x-4">
            <a-input-search
              v-model:value="searchQuery"
              placeholder="搜索工具..."
              size="large"
              class="w-80"
              @search="onSearch"
            />
            <a-button 
              type="primary"
              @click="showCreateTool = true"
              class="btn-cartoon btn-primary"
            >
              ➕ 添加工具
            </a-button>
          </div>
        </div>

        <a-tabs v-model:activeKey="activeCategory" size="large" class="tool-tabs">
          <a-tab-pane key="all" tab="全部工具" />
          <a-tab-pane key="text" tab="📝 文本处理" />
          <a-tab-pane key="image" tab="🎨 图像处理" />
          <a-tab-pane key="data" tab="📊 数据分析" />
          <a-tab-pane key="code" tab="💻 编程工具" />
          <a-tab-pane key="ai" tab="🤖 AI工具" />
          <a-tab-pane key="custom" tab="⚙️ 自定义" />
        </a-tabs>
      </div>

      <!-- 工具网格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="tool in filteredTools"
          :key="tool.id"
          class="tool-card bg-white/70 backdrop-blur-sm rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-200/50"
          @click="openTool(tool)"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="text-4xl">{{ tool.icon }}</div>
            <a-dropdown>
              <a-button type="text" size="small" class="text-gray-400 hover:text-gray-600">
                <MoreOutlined />
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="edit" @click.stop="editTool(tool)">
                    <EditOutlined />
                    编辑
                  </a-menu-item>
                  <a-menu-item key="copy" @click.stop="copyTool(tool)">
                    <CopyOutlined />
                    复制
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="delete" @click.stop="deleteTool(tool)" class="text-red-500">
                    <DeleteOutlined />
                    删除
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>

          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ tool.name }}</h3>
          <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ tool.description }}</p>

          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-lg">
                {{ getCategoryName(tool.category) }}
              </span>
              <span class="text-xs text-gray-500">{{ tool.usage }}次使用</span>
            </div>
            <div class="flex items-center space-x-1 text-yellow-500">
              <StarFilled v-for="i in Math.floor(tool.rating)" :key="i" class="text-xs" />
              <span class="text-xs text-gray-500">{{ tool.rating }}</span>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredTools.length === 0" class="col-span-full flex flex-col items-center justify-center py-16">
          <div class="text-6xl mb-4">🔍</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">没有找到相关工具</h3>
          <p class="text-gray-500 mb-4">尝试调整搜索关键词或选择其他分类</p>
          <a-button type="primary" @click="clearSearch" class="btn-cartoon">
            清除搜索
          </a-button>
        </div>
      </div>
    </main>

    <!-- 工具详情模态框 -->
    <a-modal
      v-model:open="showToolDetail"
      :title="selectedTool?.name"
      width="80%"
      :footer="null"
      class="tool-detail-modal"
    >
      <div v-if="selectedTool" class="tool-detail">
        <div class="flex items-center space-x-4 mb-6">
          <div class="text-6xl">{{ selectedTool.icon }}</div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">{{ selectedTool.name }}</h2>
            <p class="text-gray-600">{{ selectedTool.description }}</p>
            <div class="flex items-center space-x-4 mt-2">
              <span class="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-lg">
                {{ getCategoryName(selectedTool.category) }}
              </span>
              <div class="flex items-center space-x-1 text-yellow-500">
                <StarFilled v-for="i in Math.floor(selectedTool.rating)" :key="i" />
                <span class="text-gray-700 ml-1">{{ selectedTool.rating }} ({{ selectedTool.usage }}次使用)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 工具界面 -->
        <div class="tool-interface bg-gray-50 rounded-xl p-6">
          <div v-if="selectedTool.type === 'text-processor'">
            <h3 class="text-lg font-semibold mb-4">文本处理</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">输入文本</label>
                <a-textarea
                  v-model:value="toolInput"
                  :rows="6"
                  placeholder="输入要处理的文本..."
                  class="w-full"
                />
              </div>
              <div class="flex space-x-2">
                <a-button 
                  type="primary" 
                  @click="processTool"
                  :loading="toolProcessing"
                  class="btn-cartoon btn-primary"
                >
                  处理文本
                </a-button>
                <a-button @click="clearToolData" class="btn-cartoon">
                  清空
                </a-button>
              </div>
              <div v-if="toolOutput">
                <label class="block text-sm font-medium text-gray-700 mb-2">处理结果</label>
                <a-textarea
                  v-model:value="toolOutput"
                  :rows="6"
                  readonly
                  class="w-full bg-white"
                />
              </div>
            </div>
          </div>

          <div v-else-if="selectedTool.type === 'image-processor'">
            <h3 class="text-lg font-semibold mb-4">图像处理</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">上传图片</label>
                <a-upload-dragger
                  v-model:fileList="imageFiles"
                  :before-upload="beforeUpload"
                  accept="image/*"
                  class="w-full"
                >
                  <p class="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p class="ant-upload-text">点击或拖动文件到此区域上传</p>
                  <p class="ant-upload-hint">支持单次上传单个文件</p>
                </a-upload-dragger>
              </div>
              <div class="flex space-x-2">
                <a-button 
                  type="primary" 
                  @click="processTool"
                  :loading="toolProcessing"
                  :disabled="!imageFiles.length"
                  class="btn-cartoon btn-primary"
                >
                  处理图片
                </a-button>
                <a-button @click="clearToolData" class="btn-cartoon">
                  清空
                </a-button>
              </div>
            </div>
          </div>

          <div v-else>
            <div class="text-center text-gray-500 py-8">
              <div class="text-4xl mb-4">⚠️</div>
              <p>该工具类型暂不支持在线使用</p>
            </div>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 创建工具模态框 -->
    <a-modal
      v-model:open="showCreateTool"
      title="添加新工具"
      width="600px"
      @ok="createTool"
      @cancel="resetCreateForm"
    >
      <a-form :model="newTool" layout="vertical">
        <a-form-item label="工具名称" required>
          <a-input v-model:value="newTool.name" placeholder="输入工具名称" />
        </a-form-item>
        <a-form-item label="工具描述" required>
          <a-textarea v-model:value="newTool.description" :rows="3" placeholder="描述这个工具的功能" />
        </a-form-item>
        <a-form-item label="工具图标" required>
          <a-input v-model:value="newTool.icon" placeholder="输入一个emoji作为图标" />
        </a-form-item>
        <a-form-item label="工具类别" required>
          <a-select v-model:value="newTool.category" placeholder="选择工具类别">
            <a-select-option value="text">文本处理</a-select-option>
            <a-select-option value="image">图像处理</a-select-option>
            <a-select-option value="data">数据分析</a-select-option>
            <a-select-option value="code">编程工具</a-select-option>
            <a-select-option value="ai">AI工具</a-select-option>
            <a-select-option value="custom">自定义</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="工具类型" required>
          <a-select v-model:value="newTool.type" placeholder="选择工具类型">
            <a-select-option value="text-processor">文本处理器</a-select-option>
            <a-select-option value="image-processor">图像处理器</a-select-option>
            <a-select-option value="data-analyzer">数据分析器</a-select-option>
            <a-select-option value="custom">自定义</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { 
  DownOutlined, 
  LogoutOutlined, 
  MoreOutlined, 
  EditOutlined, 
  CopyOutlined, 
  DeleteOutlined,
  StarFilled,
  InboxOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

// 页面元数据
definePageMeta({
  middleware: 'auth'
})

// 状态管理
const authStore = useAuthStore()

// 响应式数据
const activeCategory = ref('all')
const searchQuery = ref('')
const showToolDetail = ref(false)
const showCreateTool = ref(false)
const selectedTool = ref(null)
const toolInput = ref('')
const toolOutput = ref('')
const toolProcessing = ref(false)
const imageFiles = ref([])

// 新工具表单
const newTool = ref({
  name: '',
  description: '',
  icon: '',
  category: '',
  type: ''
})

// 工具数据
const tools = ref([
  {
    id: '1',
    name: '文本格式化',
    description: '格式化各种文本，包括JSON、XML、HTML等格式的美化和压缩',
    icon: '📝',
    category: 'text',
    type: 'text-processor',
    rating: 4.8,
    usage: 1245
  },
  {
    id: '2',
    name: 'JSON 验证器',
    description: '验证JSON格式的正确性，并提供详细的错误提示',
    icon: '🔍',
    category: 'text',
    type: 'text-processor',
    rating: 4.9,
    usage: 892
  },
  {
    id: '3',
    name: '图片压缩',
    description: '无损压缩图片，减小文件大小同时保持质量',
    icon: '🗜️',
    category: 'image',
    type: 'image-processor',
    rating: 4.7,
    usage: 2341
  },
  {
    id: '4',
    name: '代码高亮',
    description: '为代码添加语法高亮，支持多种编程语言',
    icon: '🎨',
    category: 'code',
    type: 'text-processor',
    rating: 4.6,
    usage: 567
  },
  {
    id: '5',
    name: '文本翻译',
    description: '基于AI的多语言文本翻译工具',
    icon: '🈯',
    category: 'ai',
    type: 'text-processor',
    rating: 4.5,
    usage: 3421
  },
  {
    id: '6',
    name: '数据可视化',
    description: '将数据转换为各种图表和可视化图形',
    icon: '📊',
    category: 'data',
    type: 'data-analyzer',
    rating: 4.4,
    usage: 678
  }
])

// 计算属性
const filteredTools = computed(() => {
  let filtered = tools.value

  // 按分类筛选
  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(tool => tool.category === activeCategory.value)
  }

  // 按搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(tool => 
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query)
    )
  }

  return filtered
})

// 方法
const getCategoryName = (category: string) => {
  const categoryMap = {
    text: '文本处理',
    image: '图像处理',
    data: '数据分析',
    code: '编程工具',
    ai: 'AI工具',
    custom: '自定义'
  }
  return categoryMap[category] || category
}

const onSearch = (value: string) => {
  searchQuery.value = value
}

const clearSearch = () => {
  searchQuery.value = ''
  activeCategory.value = 'all'
}

const openTool = (tool: any) => {
  selectedTool.value = tool
  showToolDetail.value = true
  toolInput.value = ''
  toolOutput.value = ''
}

const editTool = (tool: any) => {
  message.info('编辑工具功能开发中...')
}

const copyTool = (tool: any) => {
  message.success('工具已复制到剪贴板')
}

const deleteTool = (tool: any) => {
  const index = tools.value.findIndex(t => t.id === tool.id)
  if (index > -1) {
    tools.value.splice(index, 1)
    message.success('工具已删除')
  }
}

const processTool = async () => {
  if (!selectedTool.value) return
  
  toolProcessing.value = true
  try {
    // 模拟工具处理
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (selectedTool.value.type === 'text-processor') {
      // 模拟文本处理结果
      toolOutput.value = `处理结果：\n${toolInput.value}\n\n字符数：${toolInput.value.length}\n单词数：${toolInput.value.split(' ').length}`
    }
    
    message.success('处理完成')
    
    // 更新使用次数
    selectedTool.value.usage++
  } catch (error) {
    message.error('处理失败')
  } finally {
    toolProcessing.value = false
  }
}

const clearToolData = () => {
  toolInput.value = ''
  toolOutput.value = ''
  imageFiles.value = []
}

const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件!')
    return false
  }
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    message.error('图片大小不能超过5MB!')
    return false
  }
  return false // 阻止自动上传
}

const createTool = () => {
  if (!newTool.value.name || !newTool.value.description || !newTool.value.category) {
    message.error('请填写完整的工具信息')
    return
  }

  const tool = {
    id: Date.now().toString(),
    ...newTool.value,
    rating: 5.0,
    usage: 0
  }

  tools.value.push(tool)
  message.success('工具添加成功')
  showCreateTool.value = false
  resetCreateForm()
}

const resetCreateForm = () => {
  newTool.value = {
    name: '',
    description: '',
    icon: '',
    category: '',
    type: ''
  }
}

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
/* 导航链接样式 */
.nav-link {
  @apply px-4 py-2 rounded-xl text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 font-medium;
}

.nav-link.active {
  @apply text-primary-600 bg-primary-100;
}

/* 工具卡片样式 */
.tool-card {
  @apply cursor-pointer transform hover:scale-105;
}

.tool-card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* 工具详情模态框样式 */
:deep(.tool-detail-modal .ant-modal-content) {
  @apply overflow-hidden;
}

/* 标签页样式 */
:deep(.tool-tabs .ant-tabs-tab) {
  @apply px-6 py-3 rounded-lg;
}

:deep(.tool-tabs .ant-tabs-tab-active) {
  @apply bg-primary-50 text-primary-600;
}

/* 行截断样式 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 