'use client'

import { useState, useEffect } from 'react'

interface Workflow {
  id: string
  name: string
  status: string
  updatedAt: Date
  nodes: WorkflowNode[]
}

interface WorkflowNode {
  id: string
  name: string
  type: string
  x: number
  y: number
}

interface NodeType {
  type: string
  name: string
  icon: string
  description: string
}

export default function WorkflowEditorPage() {
  const [workflows] = useState<Workflow[]>([
    {
      id: '1',
      name: '邮件自动化流程',
      status: '运行中',
      updatedAt: new Date(),
      nodes: [
        { id: 'node1', name: '邮件接收', type: 'input', x: 100, y: 100 },
        { id: 'node2', name: 'AI分析', type: 'ai', x: 300, y: 100 },
        { id: 'node3', name: '自动回复', type: 'output', x: 500, y: 100 }
      ]
    },
    {
      id: '2',
      name: '数据处理工作流',
      status: '草稿',
      updatedAt: new Date(),
      nodes: []
    }
  ])

  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>('1')
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  const nodeTypes: NodeType[] = [
    { type: 'input', name: '输入节点', icon: '📥', description: '接收外部数据' },
    { type: 'ai', name: 'AI处理', icon: '🤖', description: 'AI模型处理' },
    { type: 'output', name: '输出节点', icon: '📤', description: '输出结果' },
    { type: 'condition', name: '条件判断', icon: '❓', description: '条件分支' },
    { type: 'transform', name: '数据转换', icon: '🔄', description: '转换数据格式' }
  ]

  const selectedWorkflow = workflows.find(w => w.id === selectedWorkflowId)

  const createWorkflow = () => {
    // TODO: 实现创建新工作流
    console.log('创建新工作流')
  }

  const selectWorkflow = (id: string) => {
    setSelectedWorkflowId(id)
    setSelectedNodeId(null)
  }

  const saveWorkflow = async () => {
    setIsSaving(true)
    // TODO: 实现保存工作流逻辑
    setTimeout(() => setIsSaving(false), 1000)
  }

  const runWorkflow = async () => {
    setIsRunning(true)
    // TODO: 实现运行工作流逻辑
    setTimeout(() => setIsRunning(false), 2000)
  }

  const addNode = (nodeType: NodeType) => {
    // TODO: 实现添加节点逻辑
    console.log('添加节点:', nodeType)
  }

  const selectNode = (nodeId: string) => {
    setSelectedNodeId(nodeId)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN')
  }

  const getNodeType = (type: string) => {
    return nodeTypes.find(nt => nt.type === type)
  }

  return (
    <div className="workflow-page min-h-screen bg-gray-50">
      {/* 工作流主要内容 */}
      <main className="workflow-main pt-16">
        <div className="workflow-container flex h-screen">
          {/* 左侧工作流列表 */}
          <div className="workflow-sidebar w-80 bg-white border-r border-gray-200 p-4">
            <div className="sidebar-header flex justify-between items-center mb-4">
              <h3 className="sidebar-title text-lg font-bold text-gray-900">我的工作流</h3>
              <button
                onClick={createWorkflow}
                className="new-workflow-btn px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                ✨ 新建
              </button>
            </div>
            
            <div className="workflow-list space-y-2">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className={`workflow-item p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedWorkflowId === workflow.id 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => selectWorkflow(workflow.id)}
                >
                  <div className="workflow-name font-medium text-gray-900">{workflow.name}</div>
                  <div className="workflow-meta text-sm text-gray-500">
                    {workflow.status} • {formatDate(workflow.updatedAt)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 主工作区域 */}
          <div className="workflow-content flex-1 flex flex-col">
            {/* 工具栏 */}
            <div className="workflow-toolbar flex justify-between items-center p-4 bg-white border-b border-gray-200">
              <div className="toolbar-info">
                <span className="current-label text-gray-500">当前工作流：</span>
                <span className="current-name font-medium text-gray-900 ml-2">
                  {selectedWorkflow?.name || '请选择工作流'}
                </span>
              </div>
              <div className="toolbar-actions flex space-x-2">
                {selectedWorkflow && (
                  <>
                    <button 
                      onClick={saveWorkflow}
                      disabled={isSaving}
                      className="save-btn px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? '保存中...' : '💾 保存'}
                    </button>
                    <button 
                      onClick={runWorkflow}
                      disabled={isRunning}
                      className="run-btn px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                      {isRunning ? '运行中...' : '▶️ 运行'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* 工作流画布 */}
            <div className="workflow-canvas-area flex-1 flex">
              {!selectedWorkflow ? (
                <div className="empty-state flex-1 flex items-center justify-center">
                  <div className="empty-content text-center">
                    <div className="empty-icon text-6xl mb-4">🔄</div>
                    <h3 className="empty-title text-2xl font-bold text-gray-900 mb-2">工作流设计器</h3>
                    <p className="empty-description text-gray-600">选择一个工作流开始编辑，或创建新的工作流</p>
                  </div>
                </div>
              ) : (
                <div className="canvas-layout flex flex-1">
                  {/* 节点面板 */}
                  <div className="node-panel w-64 bg-white border-r border-gray-200 p-4">
                    <h4 className="panel-title text-lg font-bold text-gray-900 mb-4">节点库</h4>
                    <div className="node-types space-y-2">
                      {nodeTypes.map((nodeType) => (
                        <div
                          key={nodeType.type}
                          className="node-type-item p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => addNode(nodeType)}
                        >
                          <div className="node-type-content flex items-start space-x-3">
                            <span className="node-icon text-2xl">{nodeType.icon}</span>
                            <div className="node-info flex-1">
                              <div className="node-name font-medium text-gray-900">{nodeType.name}</div>
                              <div className="node-description text-sm text-gray-500">{nodeType.description}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 画布区域 */}
                  <div className="canvas-container flex-1 relative bg-gray-50 overflow-hidden">
                    <div className="canvas relative w-full h-full">
                      {/* 工作流节点 */}
                      {selectedWorkflow.nodes.map((node) => (
                        <div
                          key={node.id}
                          style={{ 
                            position: 'absolute', 
                            left: node.x + 'px', 
                            top: node.y + 'px' 
                          }}
                          className="workflow-node"
                          onClick={() => selectNode(node.id)}
                        >
                          <div 
                            className={`node-card p-4 bg-white rounded-xl shadow-md border-2 cursor-pointer transition-all ${
                              selectedNodeId === node.id 
                                ? 'border-blue-500 shadow-lg' 
                                : 'border-gray-200 hover:shadow-lg'
                            }`}
                          >
                            <div className="node-header flex items-center space-x-2 mb-2">
                              <span className="node-icon text-lg">{getNodeType(node.type)?.icon}</span>
                              <span className="node-title font-medium text-gray-900">{node.name}</span>
                            </div>
                            <div className="node-type text-sm text-gray-500">{node.type}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 