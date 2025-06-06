'use client'

import { useState } from 'react'

interface WorkflowCard {
  id: string
  name: string
  description: string
  status: 'active' | 'draft' | 'archived'
  lastModified: string
  runs: number
  success_rate: number
}

export default function WorkflowPage() {
  // 模拟工作流数据
  const workflows: WorkflowCard[] = [
    {
      id: '1',
      name: '邮件自动化',
      description: '自动处理客户邮件，智能分类和回复常见问题',
      status: 'active',
      lastModified: '2024-01-15',
      runs: 24,
      success_rate: 100
    },
    {
      id: '2',
      name: '文档生成器',
      description: '根据数据自动生成报告和文档，支持多种格式导出',
      status: 'active',
      lastModified: '2024-01-14',
      runs: 12,
      success_rate: 100
    },
    {
      id: '3',
      name: '数据分析流水线',
      description: '自动收集、清洗和分析数据，生成可视化报表',
      status: 'active',
      lastModified: '2024-01-13',
      runs: 8,
      success_rate: 100
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'draft':
        return 'bg-yellow-500'
      case 'archived':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '运行中'
      case 'draft':
        return '暂停中'
      case 'archived':
        return '已完成'
      default:
        return '未知'
    }
  }

  const getButtonColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-500 hover:bg-blue-600'
      case 'draft':
        return 'bg-purple-500 hover:bg-purple-600'
      case 'archived':
        return 'bg-green-500 hover:bg-green-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-16">
      {/* 工作流页面内容 */}
      <div className="p-8">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🔮</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">智能工作流</h1>
          <p className="text-xl text-gray-600">让AI为您自动化复杂的业务流程</p>
        </div>

        {/* 操作工具栏 */}
        <div className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
          <div className="flex space-x-4">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg font-medium">
              ➕ 创建新工作流
            </button>
            <button className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors font-medium">
              📥 导入工作流
            </button>
            <button className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors font-medium">
              📑 模板库
            </button>
          </div>
          
          <div className="flex space-x-3">
            <div className="relative">
              <input 
                type="text" 
                placeholder="搜索工作流..."
                className="pl-10 pr-4 py-3 w-80 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
            <select className="px-4 py-3 rounded-2xl border border-gray-300 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>全部状态</option>
              <option>运行中</option>
              <option>已暂停</option>
              <option>已完成</option>
              <option>失败</option>
            </select>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 max-w-7xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">📊</div>
              <div className="text-sm text-gray-500">总计</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">24</div>
            <div className="text-sm text-gray-600">已创建工作流</div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">⚡</div>
              <div className="text-sm text-green-500">+12%</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">8</div>
            <div className="text-sm text-gray-600">运行中</div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">✅</div>
              <div className="text-sm text-green-500">+5%</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">156</div>
            <div className="text-sm text-gray-600">已完成任务</div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">💾</div>
              <div className="text-sm text-blue-500">-8min</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">2.4h</div>
            <div className="text-sm text-gray-600">节省时间</div>
          </div>
        </div>

        {/* 工作流列表 */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* 工作流卡片 */}
            {workflows.map((workflow) => (
              <div key={workflow.id} className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${getStatusColor(workflow.status)} rounded-2xl flex items-center justify-center text-white text-xl`}>
                      {workflow.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{workflow.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span className={`w-2 h-2 ${getStatusColor(workflow.status)} rounded-full`}></span>
                        <span>{getStatusText(workflow.status)}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">⋯</button>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm">
                  {workflow.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-500">最后修改: {workflow.lastModified}</div>
                  <button className={`px-4 py-2 ${getButtonColor(workflow.status)} text-white rounded-xl transition-colors text-sm`}>
                    查看详情
                  </button>
                </div>
              </div>
            ))}

            {/* 创建新工作流卡片 */}
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 border-2 border-dashed border-gray-300 hover:border-primary-400 transition-all duration-300 group cursor-pointer">
              <div className="text-center py-8">
                <div className="text-6xl mb-4 opacity-50 group-hover:opacity-100 transition-opacity">➕</div>
                <h3 className="text-lg font-bold text-gray-700 mb-2">创建新工作流</h3>
                <p className="text-gray-500 text-sm mb-6">从模板开始或者从头创建</p>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all text-sm">
                    从模板创建
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                    从头开始
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 最近活动 */}
        <div className="mt-12 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">最近活动</h2>
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 hover:bg-gray-50/50 rounded-2xl transition-colors">
                <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center">
                  ✅
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">邮件自动化工作流完成了24个任务</div>
                  <div className="text-sm text-gray-500">2分钟前</div>
                </div>
                <div className="text-sm text-green-600 font-medium">+24 处理量</div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 hover:bg-gray-50/50 rounded-2xl transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
                  🔄
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">数据分析流水线开始新的运行周期</div>
                  <div className="text-sm text-gray-500">30分钟前</div>
                </div>
                <div className="text-sm text-blue-600 font-medium">运行中</div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 hover:bg-gray-50/50 rounded-2xl transition-colors">
                <div className="w-10 h-10 bg-yellow-100 rounded-2xl flex items-center justify-center">
                  ⏸️
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">文档生成器已暂停</div>
                  <div className="text-sm text-gray-500">1小时前</div>
                </div>
                <div className="text-sm text-yellow-600 font-medium">需要注意</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 