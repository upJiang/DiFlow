import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
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
    // 验证用户身份
    const session = requireAuth(request)
    
    const body = await request.json() as ChatRequest
    
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

    // 创建流式响应
    const encoder = new TextEncoder()
    let responseText = ''

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of aiManager.streamChat(messages, model)) {
            if (chunk.delta) {
              responseText += chunk.delta
              const data = `data: ${JSON.stringify({ 
                content: chunk.delta, 
                fullContent: responseText,
                done: false 
              })}\n\n`
              controller.enqueue(encoder.encode(data))
            }
            if (chunk.done) {
              const data = `data: ${JSON.stringify({ 
                content: '', 
                fullContent: responseText,
                done: true 
              })}\n\n`
              controller.enqueue(encoder.encode(data))
              controller.close()
              break
            }
          }
        } catch (error) {
          console.error('流式聊天错误:', error)
          const errorData = `data: ${JSON.stringify({ 
            error: '生成回复时出错，请稍后重试',
            done: true 
          })}\n\n`
          controller.enqueue(encoder.encode(errorData))
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      }
    })
  } catch (error: any) {
    console.error('流式聊天API错误:', error)
    
    return NextResponse.json(
      { error: error.message || '服务器内部错误' },
      { status: 500 }
    )
  }
} 