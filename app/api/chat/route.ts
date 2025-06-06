import { NextRequest, NextResponse } from 'next/server'
import { getAIManager } from '@/lib/ai/manager'
import type { ChatMessage } from '@/lib/ai/types'

interface ChatRequest {
  message: string
  messages?: Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>
  model?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    
    if (!body.message?.trim()) {
      return NextResponse.json(
        { error: '消息内容不能为空' },
        { status: 400 }
      )
    }

    // 构建消息历史
    const messages: ChatMessage[] = []
    
    // 添加系统提示
    messages.push({
      role: 'system',
      content: '你是一个智能助手，专门帮助用户解决各种问题。请用中文回答，回答要准确、有用、简洁。'
    })
    
    // 添加对话历史（只保留最近10条）
    if (body.messages && body.messages.length > 0) {
      const recentMessages = body.messages.slice(-9) // 保留最近9条历史消息
      for (const msg of recentMessages) {
        messages.push({
          role: msg.role,
          content: msg.content
        })
      }
    }
    
    // 添加当前用户消息
    messages.push({
      role: 'user',
      content: body.message
    })

    const aiManager = getAIManager()
    const model = body.model || 'deepseek-chat'

    // 普通响应
    const response = await aiManager.chat(messages, model)
    
    return NextResponse.json({
      success: true,
      data: {
        message: {
          content: response.content
        },
        usage: response.usage
      }
    })
  } catch (error: any) {
    console.error('聊天API错误:', error)
    
    return NextResponse.json(
      { error: error.message || '服务器内部错误' },
      { status: 500 }
    )
  }
} 