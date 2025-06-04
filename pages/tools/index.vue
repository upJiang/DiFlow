<template>
  <div class="tools-page">
    <!-- 顶部导航 -->
    <header class="tools-header">
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

    <!-- 工具主要内容 -->
    <main class="tools-main">
      <!-- 工具分类导航 -->
      <div class="tools-header-section">
        <div class="tools-title-bar">
          <h1 class="page-title">🛠️ 工具箱</h1>
          <div class="tools-actions">
            <a-input-search
              v-model:value="searchQuery"
              placeholder="搜索工具..."
              size="large"
              class="search-input"
              @search="onSearch"
            />
            <a-button 
              type="primary"
              @click="showCreateTool = true"
              class="add-tool-btn"
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
      <div class="tools-grid">
        <div
          v-for="tool in filteredTools"
          :key="tool.id"
          class="tool-card"
          @click="openTool(tool)"
        >
          <div class="tool-card-header">
            <div class="tool-icon">{{ tool.icon }}</div>
            <a-dropdown>
              <a-button type="text" size="small" class="tool-menu-btn">
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
                  <a-menu-item key="delete" @click.stop="deleteTool(tool)" class="delete-item">
                    <DeleteOutlined />
                    删除
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>

          <h3 class="tool-name">{{ tool.name }}</h3>
          <p class="tool-description">{{ tool.description }}</p>

          <div class="tool-footer">
            <div class="tool-meta">
              <span class="tool-category">
                {{ getCategoryName(tool.category) }}
              </span>
              <span class="tool-usage">{{ tool.usage }}次使用</span>
            </div>
            <div class="tool-rating">
              <StarFilled v-for="i in Math.floor(tool.rating)" :key="i" class="star-icon" />
              <span class="rating-text">{{ tool.rating }}</span>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredTools.length === 0" class="empty-state">
          <div class="empty-content">
            <div class="empty-icon">🔍</div>
            <h3 class="empty-title">没有找到相关工具</h3>
            <p class="empty-description">尝试调整搜索关键词或选择其他分类</p>
            <a-button type="primary" @click="clearSearch" class="clear-search-btn">
              清除搜索
            </a-button>
          </div>
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
        <div class="tool-detail-header">
          <div class="detail-icon">{{ selectedTool.icon }}</div>
          <div class="detail-info">
            <h2 class="detail-title">{{ selectedTool.name }}</h2>
            <p class="detail-description">{{ selectedTool.description }}</p>
            <div class="detail-meta">
              <span class="detail-category">
                {{ getCategoryName(selectedTool.category) }}
              </span>
              <div class="detail-rating">
                <StarFilled v-for="i in Math.floor(selectedTool.rating)" :key="i" />
                <span class="rating-info">{{ selectedTool.rating }} ({{ selectedTool.usage }}次使用)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 工具界面 -->
        <div class="tool-interface">
          <div v-if="selectedTool.type === 'text-processor'">
            <h3 class="interface-title">文本处理</h3>
            <div class="interface-content">
              <div class="input-section">
                <label class="input-label">输入文本</label>
                <a-textarea
                  v-model:value="toolInput"
                  :rows="6"
                  placeholder="输入要处理的文本..."
                  class="tool-textarea"
                />
              </div>
              <div class="action-buttons">
                <a-button 
                  type="primary" 
                  @click="processTool"
                  :loading="toolProcessing"
                  class="process-btn"
                >
                  🚀 处理
                </a-button>
                <a-button @click="clearToolInput" class="clear-btn">
                  🗑️ 清空
                </a-button>
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

<style scoped lang="scss">
.tools-page {
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

.tools-header {
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

.tools-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  position: relative;
  z-index: 1;
}

.tools-header-section {
  margin-bottom: 2rem;
}

.tools-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tools-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
}

.search-input {
  width: 320px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
  
  :deep(.ant-input) {
    border-radius: 16px !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    background: rgba(255, 255, 255, 0.9) !important;
    
    &:focus {
      border-color: #667eea !important;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) !important;
    }
  }
  
  :deep(.ant-input-search-button) {
    border-radius: 0 16px 16px 0 !important;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    border: none !important;
  }
}

.add-tool-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none !important;
  border-radius: 16px !important;
  font-weight: 500 !important;
  transition: all 0.3s ease !important;
  
  &:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4) !important;
  }
}

.tool-tabs {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 0.5rem 1rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  :deep(.ant-tabs-nav) {
    margin: 0;
  }
  
  :deep(.ant-tabs-tab) {
    padding: 0.5rem 1rem !important;
    border-radius: 12px !important;
    margin: 0 0.25rem !important;
    transition: all 0.3s ease !important;
    
    &:hover {
      background: rgba(102, 126, 234, 0.1) !important;
    }
    
    &.ant-tabs-tab-active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      
      .ant-tabs-tab-btn {
        color: white !important;
      }
    }
  }
  
  :deep(.ant-tabs-ink-bar) {
    display: none;
  }
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.tool-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
    border-color: rgba(102, 126, 234, 0.3);
  }
}

.tool-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.tool-icon {
  font-size: 2.5rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

.tool-menu-btn {
  color: #999 !important;
  transition: all 0.3s ease !important;
  
  &:hover {
    color: #667eea !important;
    background: rgba(102, 126, 234, 0.1) !important;
  }
}

.delete-item {
  color: #ff4d4f !important;
  
  &:hover {
    background: rgba(255, 77, 79, 0.1) !important;
  }
}

.tool-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.tool-description {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tool-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tool-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tool-category {
  padding: 0.25rem 0.5rem;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  font-size: 0.75rem;
  border-radius: 8px;
  font-weight: 500;
}

.tool-usage {
  font-size: 0.75rem;
  color: #999;
}

.tool-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.star-icon {
  color: #ffd700;
  font-size: 0.75rem;
}

.rating-text {
  font-size: 0.75rem;
  color: #999;
}

.empty-state {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
}

.empty-content {
  text-align: center;
  color: white;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.empty-description {
  font-size: 0.875rem;
  opacity: 0.8;
  margin-bottom: 1.5rem;
}

.clear-search-btn {
  background: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  color: white !important;
  border-radius: 12px !important;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3) !important;
    transform: translateY(-2px) !important;
  }
}

// 模态框样式
.tool-detail-modal {
  :deep(.ant-modal-content) {
    border-radius: 20px !important;
    overflow: hidden;
  }
  
  :deep(.ant-modal-header) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    border: none !important;
    
    .ant-modal-title {
      color: white !important;
      font-weight: 600 !important;
    }
  }
  
  :deep(.ant-modal-close) {
    color: white !important;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1) !important;
    }
  }
}

.tool-detail {
  padding: 1rem 0;
}

.tool-detail-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.detail-icon {
  font-size: 4rem;
  animation: float 3s ease-in-out infinite;
}

.detail-info {
  flex: 1;
}

.detail-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.detail-description {
  color: #666;
  margin-bottom: 0.75rem;
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.detail-category {
  padding: 0.375rem 0.75rem;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  font-size: 0.875rem;
  border-radius: 12px;
  font-weight: 500;
}

.detail-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #ffd700;
}

.rating-info {
  color: #666;
  margin-left: 0.25rem;
}

.tool-interface {
  background: rgba(248, 250, 252, 0.8);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.interface-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.interface-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  font-weight: 500;
  color: #555;
  font-size: 0.875rem;
}

.tool-textarea {
  :deep(.ant-input) {
    border-radius: 12px !important;
    border: 1px solid rgba(102, 126, 234, 0.2) !important;
    
    &:focus {
      border-color: #667eea !important;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) !important;
    }
  }
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
}

.process-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none !important;
  border-radius: 12px !important;
  font-weight: 500 !important;
  
  &:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4) !important;
  }
}

.clear-btn {
  border-radius: 12px !important;
  border-color: rgba(102, 126, 234, 0.3) !important;
  color: #667eea !important;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1) !important;
    border-color: #667eea !important;
    transform: translateY(-2px) !important;
  }
}
</style> 