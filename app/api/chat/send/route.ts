import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getAIManager } from '@/lib/ai/manager'

export async function POST(request: NextRequest) {
  try {
    // 验证用户身份
    const session = requireAuth(request)
    const userId = session.userId
    
    const body = await request.json()
    const { message, model = 'deepseek-chat', chatId } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // 查找或创建聊天记录
    let chat
    if (chatId) {
      chat = await prisma.chat.findFirst({
        where: {
          id: chatId,
          userId
        }
      })
      
      if (!chat) {
        return NextResponse.json(
          { error: 'Chat not found' },
          { status: 404 }
        )
      }
    } else {
      // 创建新的聊天记录
      chat = await prisma.chat.create({
        data: {
          userId,
          title: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
          messages: JSON.stringify([]),
          model
        }
      })
    }

    // 获取历史消息
    const messages = JSON.parse(chat.messages || '[]')
    
    // 添加用户消息
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message,
      timestamp: new Date()
    }
    
    messages.push(userMessage)

    // 调用 AI API
    try {
      const aiManager = getAIManager()
      
      // 转换消息格式
      const aiMessages = messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }))

      const aiResponse = await aiManager.chat(aiMessages, model, {
        temperature: 0.7,
        maxTokens: 2000
      })

      // 添加 AI 回复
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: aiResponse.content,
        timestamp: new Date()
      }
      
      messages.push(assistantMessage)

      // 更新聊天记录
      await prisma.chat.update({
        where: { id: chat.id },
        data: {
          messages: JSON.stringify(messages),
          updatedAt: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        data: {
          chatId: chat.id,
          message: assistantMessage
        }
      })

    } catch (aiError: any) {
      console.error('AI API 调用失败:', aiError)
      return NextResponse.json(
        { error: 'AI service temporarily unavailable' },
        { status: 500 }
      )
    }

  } catch (error: any) {
    console.error('发送消息失败:', error)
    
    if (error.statusCode) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 