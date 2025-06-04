<template>
  <div class="workflow-page">
    <!-- 顶部导航 -->
    <header class="workflow-header">
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
                class="nav-link active"
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

    <!-- 工作流主要内容 -->
    <main class="workflow-main">
      <div class="workflow-container">
        <!-- 左侧工作流列表 -->
        <div class="workflow-sidebar">
          <div class="sidebar-header">
            <h3 class="sidebar-title">我的工作流</h3>
            <a-button
              type="primary"
              size="small"
              @click="createWorkflow"
              class="new-workflow-btn"
            >
              ✨ 新建
            </a-button>
          </div>
          
          <div class="workflow-list">
            <div
              v-for="workflow in workflows"
              :key="workflow.id"
              :class="[
                'workflow-item',
                selectedWorkflowId === workflow.id ? 'active' : ''
              ]"
              @click="selectWorkflow(workflow.id)"
            >
              <div class="workflow-name">{{ workflow.name }}</div>
              <div class="workflow-meta">
                {{ workflow.status }} • {{ formatDate(workflow.updatedAt) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 主工作区域 -->
        <div class="workflow-content">
          <!-- 工具栏 -->
          <div class="workflow-toolbar">
            <div class="toolbar-info">
              <span class="current-label">当前工作流：</span>
              <span class="current-name">
                {{ selectedWorkflow?.name || '请选择工作流' }}
              </span>
            </div>
            <div class="toolbar-actions">
              <a-button 
                v-if="selectedWorkflow"
                @click="saveWorkflow"
                :loading="isSaving"
                class="save-btn"
              >
                💾 保存
              </a-button>
              <a-button 
                v-if="selectedWorkflow"
                @click="runWorkflow"
                :loading="isRunning"
                class="run-btn"
              >
                ▶️ 运行
              </a-button>
            </div>
          </div>

          <!-- 工作流画布 -->
          <div class="workflow-canvas-area">
            <div 
              v-if="!selectedWorkflow"
              class="empty-state"
            >
              <div class="empty-content">
                <div class="empty-icon">🔄</div>
                <h3 class="empty-title">工作流设计器</h3>
                <p class="empty-description">选择一个工作流开始编辑，或创建新的工作流</p>
              </div>
            </div>

            <div v-else class="canvas-layout">
              <!-- 节点面板 -->
              <div class="node-panel">
                <h4 class="panel-title">节点库</h4>
                <div class="node-types">
                  <div
                    v-for="nodeType in nodeTypes"
                    :key="nodeType.type"
                    class="node-type-item"
                    @click="addNode(nodeType)"
                  >
                    <div class="node-type-content">
                      <span class="node-icon">{{ nodeType.icon }}</span>
                      <div class="node-info">
                        <div class="node-name">{{ nodeType.name }}</div>
                        <div class="node-description">{{ nodeType.description }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 画布区域 -->
              <div class="canvas-container">
                <div 
                  ref="canvas"
                  class="canvas"
                >
                  <!-- 工作流节点 -->
                  <div
                    v-for="node in selectedWorkflow.nodes"
                    :key="node.id"
                    :style="{ 
                      position: 'absolute', 
                      left: node.x + 'px', 
                      top: node.y + 'px' 
                    }"
                    class="workflow-node"
                    @click="selectNode(node.id)"
                    @mousedown="startDrag(node.id, $event)"
                  >
                    <div 
                      :class="[
                        'node-card',
                        selectedNodeId === node.id ? 'selected' : ''
                      ]"
                    >
                      <div class="node-header">
                        <span class="node-icon">{{ getNodeType(node.type)?.icon }}</span>
                        <span class="node-title">{{ node.name }}</span>
                      </div>
                      <div class="node-type">{{ node.type }}</div>
                    </div>
                  </div>
                </div>
              </div>
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

// 页面元数据
definePageMeta({
  middleware: 'auth'
})

// 状态管理
const authStore = useAuthStore()

// 响应式数据
const workflows = ref([
  {
    id: '1',
    name: '示例工作流',
    status: '草稿',
    updatedAt: new Date().toISOString(),
    nodes: [
      {
        id: 'node1',
        type: 'start',
        name: '开始',
        x: 100,
        y: 100
      },
      {
        id: 'node2',
        type: 'llm',
        name: 'AI 处理',
        x: 300,
        y: 100
      }
    ]
  }
])

const selectedWorkflowId = ref<string | null>(null)
const selectedWorkflow = computed(() => 
  workflows.value.find(w => w.id === selectedWorkflowId.value)
)
const selectedNodeId = ref<string | null>(null)

const isSaving = ref(false)
const isRunning = ref(false)

// 节点类型定义
const nodeTypes = ref([
  {
    type: 'start',
    name: '开始',
    icon: '🟢',
    description: '工作流开始节点'
  },
  {
    type: 'llm',
    name: 'LLM',
    icon: '🧠',
    description: '大语言模型处理'
  },
  {
    type: 'code',
    name: '代码执行',
    icon: '💻',
    description: '执行自定义代码'
  },
  {
    type: 'condition',
    name: '条件判断',
    icon: '🔀',
    description: '根据条件分支'
  },
  {
    type: 'end',
    name: '结束',
    icon: '🔴',
    description: '工作流结束节点'
  }
])

// 拖拽相关
const isDragging = ref(false)
const dragNodeId = ref<string | null>(null)
const dragOffset = ref({ x: 0, y: 0 })

// 创建工作流
const createWorkflow = () => {
  const newWorkflow = {
    id: Date.now().toString(),
    name: `工作流 ${workflows.value.length + 1}`,
    status: '草稿',
    updatedAt: new Date().toISOString(),
    nodes: []
  }
  workflows.value.push(newWorkflow)
  selectedWorkflowId.value = newWorkflow.id
  message.success('创建工作流成功')
}

// 选择工作流
const selectWorkflow = (id: string) => {
  selectedWorkflowId.value = id
  selectedNodeId.value = null
}

// 添加节点
const addNode = (nodeType: any) => {
  if (!selectedWorkflow.value) return
  
  const newNode = {
    id: `node_${Date.now()}`,
    type: nodeType.type,
    name: nodeType.name,
    x: 200,
    y: 200
  }
  
  selectedWorkflow.value.nodes.push(newNode)
  message.success(`添加 ${nodeType.name} 节点成功`)
}

// 选择节点
const selectNode = (nodeId: string) => {
  selectedNodeId.value = nodeId
}

// 获取节点类型信息
const getNodeType = (type: string) => {
  return nodeTypes.value.find(nt => nt.type === type)
}

// 开始拖拽
const startDrag = (nodeId: string, event: MouseEvent) => {
  isDragging.value = true
  dragNodeId.value = nodeId
  
  const node = selectedWorkflow.value?.nodes.find(n => n.id === nodeId)
  if (node) {
    dragOffset.value = {
      x: event.clientX - node.x,
      y: event.clientY - node.y
    }
  }
  
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

// 拖拽中
const onDrag = (event: MouseEvent) => {
  if (!isDragging.value || !dragNodeId.value || !selectedWorkflow.value) return
  
  const node = selectedWorkflow.value.nodes.find(n => n.id === dragNodeId.value)
  if (node) {
    node.x = event.clientX - dragOffset.value.x
    node.y = event.clientY - dragOffset.value.y
  }
}

// 停止拖拽
const stopDrag = () => {
  isDragging.value = false
  dragNodeId.value = null
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// 保存工作流
const saveWorkflow = async () => {
  if (!selectedWorkflow.value) return
  
  isSaving.value = true
  try {
    // 这里应该调用 API 保存工作流
    await new Promise(resolve => setTimeout(resolve, 1000))
    selectedWorkflow.value.updatedAt = new Date().toISOString()
    message.success('保存成功')
  } catch (error) {
    message.error('保存失败')
  } finally {
    isSaving.value = false
  }
}

// 运行工作流
const runWorkflow = async () => {
  if (!selectedWorkflow.value) return
  
  isRunning.value = true
  try {
    // 这里应该调用 API 运行工作流
    await new Promise(resolve => setTimeout(resolve, 2000))
    message.success('工作流运行完成')
  } catch (error) {
    message.error('运行失败')
  } finally {
    isRunning.value = false
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

// 处理登出
const handleLogout = () => {
  authStore.logout()
  message.success('已退出登录')
}

// 初始化
onMounted(() => {
  authStore.init()
})

// 清理事件监听器
onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<style scoped lang="scss">
.workflow-page {
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

.workflow-header {
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

.workflow-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  position: relative;
  z-index: 1;
}

.workflow-container {
  display: flex;
  height: calc(100vh - 12rem);
  gap: 1.5rem;
}

.workflow-sidebar {
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

.new-workflow-btn {
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

.workflow-list {
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

.workflow-item {
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

.workflow-name {
  font-weight: 500;
  font-size: 0.875rem;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.workflow-meta {
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.25rem;
}

.workflow-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.workflow-toolbar {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 1rem 1.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.current-label {
  font-weight: 500;
  color: #666;
  font-size: 0.875rem;
}

.current-name {
  font-weight: 600;
  color: #667eea;
  font-size: 0.875rem;
}

.toolbar-actions {
  display: flex;
  gap: 0.5rem;
}

.save-btn, .run-btn {
  border-radius: 12px !important;
  font-weight: 500 !important;
  transition: all 0.3s ease !important;
  
  &:hover {
    transform: translateY(-2px) !important;
  }
}

.save-btn {
  background: rgba(102, 126, 234, 0.1) !important;
  border-color: rgba(102, 126, 234, 0.3) !important;
  color: #667eea !important;
  
  &:hover {
    background: rgba(102, 126, 234, 0.2) !important;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
  }
}

.run-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none !important;
  
  &:hover {
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4) !important;
  }
}

.workflow-canvas-area {
  flex: 1;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 1.5rem;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
}

.empty-state {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-content {
  text-align: center;
  color: #666;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.empty-description {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
}

.canvas-layout {
  height: 100%;
  display: flex;
  gap: 1rem;
}

.node-panel {
  width: 256px;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 16px;
  padding: 1rem;
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.panel-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.node-types {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.node-type-item {
  padding: 0.75rem;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(102, 126, 234, 0.1);
  
  &:hover {
    background: rgba(102, 126, 234, 0.05);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  }
}

.node-type-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.node-icon {
  font-size: 1.25rem;
}

.node-info {
  flex: 1;
}

.node-name {
  font-weight: 500;
  font-size: 0.875rem;
  color: #333;
}

.node-description {
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.125rem;
}

.canvas-container {
  flex: 1;
  background: rgba(248, 250, 252, 0.5);
  border-radius: 16px;
  padding: 1rem;
  position: relative;
  overflow: auto;
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.canvas {
  position: relative;
  min-height: 100%;
  background-image: radial-gradient(circle, rgba(102, 126, 234, 0.2) 1px, transparent 1px);
  background-size: 20px 20px;
}

.workflow-node {
  position: absolute;
  z-index: 10;
}

.node-card {
  padding: 1rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(102, 126, 234, 0.2);
  cursor: move;
  min-width: 128px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
  
  &.selected {
    border-color: #667eea;
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }
}

.node-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.node-title {
  font-weight: 500;
  font-size: 0.875rem;
  color: #333;
}

.node-type {
  font-size: 0.75rem;
  color: #666;
}

// 响应式设计
@media (max-width: 1024px) {
  .workflow-container {
    flex-direction: column;
    height: auto;
  }
  
  .workflow-sidebar {
    width: 100%;
    order: 2;
  }
  
  .workflow-content {
    order: 1;
    min-height: 60vh;
  }
  
  .canvas-layout {
    flex-direction: column;
  }
  
  .node-panel {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .workflow-main {
    padding: 1rem;
  }
  
  .workflow-container {
    gap: 1rem;
  }
  
  .workflow-sidebar,
  .workflow-toolbar,
  .workflow-canvas-area {
    padding: 1rem;
  }
  
  .toolbar-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .toolbar-actions {
    margin-top: 0.5rem;
  }
}
</style> 