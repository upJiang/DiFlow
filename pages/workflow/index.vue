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

    <!-- 工作流主要内容 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex h-[calc(100vh-12rem)]">
        <!-- 左侧工作流列表 -->
        <div class="w-80 bg-white/70 backdrop-blur-sm rounded-2xl p-4 mr-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-800">我的工作流</h3>
            <a-button
              type="primary"
              size="small"
              @click="createWorkflow"
              class="btn-cartoon btn-primary"
            >
              新建
            </a-button>
          </div>
          
          <div class="space-y-2 max-h-96 overflow-y-auto">
            <div
              v-for="workflow in workflows"
              :key="workflow.id"
              :class="[
                'p-3 rounded-xl cursor-pointer transition-all duration-200',
                selectedWorkflowId === workflow.id
                  ? 'bg-primary-100 border-2 border-primary-300'
                  : 'bg-gray-50 hover:bg-gray-100'
              ]"
              @click="selectWorkflow(workflow.id)"
            >
              <div class="font-medium text-sm truncate">{{ workflow.name }}</div>
              <div class="text-xs text-gray-500 mt-1">
                {{ workflow.status }} • {{ formatDate(workflow.updatedAt) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 主工作区域 -->
        <div class="flex-1 flex flex-col">
          <!-- 工具栏 -->
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-4 mb-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <span class="text-sm font-medium text-gray-700">当前工作流：</span>
                <span class="text-primary-600 font-semibold">
                  {{ selectedWorkflow?.name || '请选择工作流' }}
                </span>
              </div>
              <div class="flex space-x-2">
                <a-button 
                  v-if="selectedWorkflow"
                  @click="saveWorkflow"
                  :loading="isSaving"
                  class="btn-cartoon"
                >
                  💾 保存
                </a-button>
                <a-button 
                  v-if="selectedWorkflow"
                  @click="runWorkflow"
                  :loading="isRunning"
                  class="btn-cartoon btn-primary"
                >
                  ▶️ 运行
                </a-button>
              </div>
            </div>
          </div>

          <!-- 工作流画布 -->
          <div class="flex-1 bg-white/70 backdrop-blur-sm rounded-2xl p-4 overflow-hidden relative">
            <div 
              v-if="!selectedWorkflow"
              class="absolute inset-0 flex items-center justify-center"
            >
              <div class="text-center text-gray-500">
                <div class="text-6xl mb-4">🔄</div>
                <h3 class="text-xl font-semibold mb-2">工作流设计器</h3>
                <p>选择一个工作流开始编辑，或创建新的工作流</p>
              </div>
            </div>

            <div v-else class="h-full flex">
              <!-- 节点面板 -->
              <div class="w-64 bg-gray-50/80 rounded-xl p-4 mr-4">
                <h4 class="font-semibold text-gray-800 mb-4">节点库</h4>
                <div class="space-y-2">
                  <div
                    v-for="nodeType in nodeTypes"
                    :key="nodeType.type"
                    class="p-3 bg-white rounded-lg cursor-pointer hover:bg-primary-50 transition-colors border border-gray-200"
                    @click="addNode(nodeType)"
                  >
                    <div class="flex items-center space-x-2">
                      <span>{{ nodeType.icon }}</span>
                      <div>
                        <div class="font-medium text-sm">{{ nodeType.name }}</div>
                        <div class="text-xs text-gray-500">{{ nodeType.description }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 画布区域 -->
              <div class="flex-1 bg-gray-100/50 rounded-xl p-4 relative overflow-auto">
                <div 
                  ref="canvas"
                  class="relative min-h-full"
                  style="background-image: radial-gradient(circle, #ddd 1px, transparent 1px); background-size: 20px 20px;"
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
                        'p-4 bg-white rounded-xl shadow-lg border-2 cursor-move min-w-32',
                        selectedNodeId === node.id 
                          ? 'border-primary-400' 
                          : 'border-gray-200'
                      ]"
                    >
                      <div class="flex items-center space-x-2 mb-2">
                        <span>{{ getNodeType(node.type)?.icon }}</span>
                        <span class="font-medium text-sm">{{ node.name }}</span>
                      </div>
                      <div class="text-xs text-gray-500">{{ node.type }}</div>
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

<style scoped>
/* 导航链接样式 */
.nav-link {
  @apply px-4 py-2 rounded-xl text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 font-medium;
}

.nav-link.active {
  @apply text-primary-600 bg-primary-100;
}

/* 工作流节点样式 */
.workflow-node {
  @apply select-none;
}

.workflow-node:hover {
  @apply z-10;
}
</style> 