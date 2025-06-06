'use client'

import { useState, useEffect, useRef } from 'react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface Chat {
  id: string
  title: string
  updatedAt: string
  messages: ChatMessage[]
}

interface User {
  username: string
}

export default function ChatPage() {
  const [inputMessage, setInputMessage] = useState('')
  const [selectedModel, setSelectedModel] = useState('deepseek-chat')
  const [isLoading, setIsLoading] = useState(false)
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([])
  const [chatHistory, setChatHistory] = useState<Chat[]>([
    {
      id: '1',
      title: 'AI 助手介绍',
      updatedAt: new Date().toISOString(),
      messages: []
    },
    {
      id: '2',
      title: '代码生成问题',
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      messages: []
    },
    {
      id: '3',
      title: '数据分析咨询',
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
      messages: []
    }
  ])
  const [showUserMenu, setShowUserMenu] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // 模拟用户信息
  const user: User = { username: '用户' }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    setIsLoading(true)

    // 添加用户消息到界面
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    }
    setCurrentMessages(prev => [...prev, userMsg])

    // 滚动到底部
    setTimeout(() => {
      scrollToBottom()
    }, 100)

    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 添加 AI 回复到界面
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `这是对您消息的回复：${userMessage}。我是AI助手，可以帮助您解决各种问题。`,
        timestamp: new Date().toISOString()
      }
      setCurrentMessages(prev => [...prev, aiMsg])
    } catch (error) {
      console.error('发送失败:', error)
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        scrollToBottom()
      }, 100)
    }
  }

  const startNewChat = () => {
    setCurrentChatId(null)
    setCurrentMessages([])
  }

  const selectChat = (chatId: string) => {
    setCurrentChatId(chatId)
    // 模拟加载聊天记录
    const chat = chatHistory.find(c => c.id === chatId)
    if (chat) {
      setCurrentMessages(chat.messages)
      setTimeout(() => {
        scrollToBottom()
      }, 100)
    }
  }

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleLogout = () => {
    console.log('退出登录')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="chat-page min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-purple-600 relative">
      {/* 背景动画层 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-blue-500/30 to-purple-600/30 animate-pulse"></div>
      
      {/* 聊天主要内容 */}
      <main className="chat-main pt-16 relative z-10">
        <div className="chat-container max-w-7xl mx-auto h-screen flex">
          {/* 聊天历史侧边栏 */}
          <div className="chat-sidebar w-80 bg-white/90 backdrop-blur-lg border-r border-white/20 p-4">
            <div className="sidebar-header flex justify-between items-center mb-4">
              <h3 className="sidebar-title text-lg font-bold text-gray-900">聊天历史</h3>
              <button
                onClick={startNewChat}
                className="new-chat-btn px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                ✨ 新对话
              </button>
            </div>
            
            <div className="chat-history space-y-2">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className={`chat-item p-3 rounded-lg cursor-pointer transition-colors ${
                    currentChatId === chat.id 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => selectChat(chat.id)}
                >
                  <div className="chat-title font-medium text-gray-900 truncate">{chat.title}</div>
                  <div className="chat-date text-sm text-gray-500">
                    {formatDate(chat.updatedAt)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 主聊天区域 */}
          <div className="chat-content flex-1 flex flex-col bg-white/80 backdrop-blur-lg">
            {/* 模型选择 */}
            <div className="model-selector p-4 bg-white/90 backdrop-blur-lg border-b border-gray-200">
              <div className="model-section flex items-center space-x-2">
                <span className="model-label text-gray-700 font-medium">🧠 AI 模型：</span>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="model-select px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="deepseek-chat">🧠 DeepSeek Chat</option>
                </select>
              </div>
            </div>

            {/* 聊天消息区域 */}
            <div className="messages-area flex-1 p-4">
              <div
                ref={messagesContainerRef}
                className="messages-container h-full overflow-y-auto space-y-4 pr-2"
              >
                {currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`message-wrapper flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div 
                      className={`message-bubble max-w-2xl px-4 py-3 rounded-2xl ${
                        message.role === 'user' 
                          ? 'bg-blue-500 text-white ml-auto' 
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="message-content whitespace-pre-wrap">{message.content}</div>
                      <div className={`message-time text-xs mt-1 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* 加载指示器 */}
                {isLoading && (
                  <div className="loading-message flex justify-start">
                    <div className="message-bubble max-w-2xl px-4 py-3 rounded-2xl bg-gray-100 text-gray-900">
                      <div className="loading-content flex items-center space-x-2">
                        <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                        <span>AI 正在思考...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 输入区域 */}
            <div className="input-area p-4 bg-white/90 backdrop-blur-lg border-t border-gray-200">
              <div className="input-container flex space-x-3">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入您的消息..."
                  rows={3}
                  className="message-input flex-1 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="send-button px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isLoading ? '发送中...' : '🚀 发送'}
                </button>
              </div>
              <div className="input-hint text-xs text-gray-500 mt-2">
                按 Enter 发送，Shift + Enter 换行
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 