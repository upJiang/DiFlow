import { prisma } from '~/server/utils/db'
import { requireAuth } from '~/server/utils/auth'
import type { ChatRequest, ChatResponse, ChatMessage } from '~/types'

export default defineEventHandler(async (event): Promise<ChatResponse> => {
  try {
    // 验证用户身份
    const { userId } = await requireAuth(event)
    
    const body = await readBody<ChatRequest>(event)
    
    // 验证输入
    if (!body.message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Message is required'
      })
    }

    const model = body.model || 'deepseek-chat'
    
    // 创建用户消息
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: body.message,
      timestamp: new Date().toISOString()
    }

    // 调用 AI 模型
    const aiResponse = await callAIModel(body.message, model)
    
    // 创建 AI 回复消息
    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString()
    }

    let chatId = body.chatId
    let chat

    if (chatId) {
      // 更新现有对话
      chat = await prisma.chat.findFirst({
        where: { id: chatId, userId }
      })
      
      if (!chat) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Chat not found'
        })
      }

      // 解析现有消息并添加新消息
      const existingMessages: ChatMessage[] = chat.messages ? JSON.parse(chat.messages) : []
      const messages = [...existingMessages, userMessage, assistantMessage]
      
      await prisma.chat.update({
        where: { id: chatId },
        data: { messages: JSON.stringify(messages) }
      })
    } else {
      // 创建新对话
      const title = body.message.length > 50 
        ? body.message.substring(0, 50) + '...' 
        : body.message

      chat = await prisma.chat.create({
        data: {
          userId,
          title,
          model,
          messages: JSON.stringify([userMessage, assistantMessage])
        }
      })
      
      chatId = chat.id
    }

    return {
      success: true,
      data: {
        message: assistantMessage,
        chatId
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})

// 调用 AI 模型的函数
async function callAIModel(message: string, model: string): Promise<string> {
  const config = useRuntimeConfig()
  
  try {
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-ai/deepseek-chat',
        messages: [
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || 'Sorry, I could not generate a response.'
  } catch (error) {
    console.error('AI API Error:', error)
    return 'Sorry, there was an error processing your request.'
  }
} 