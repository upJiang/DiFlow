import { requireAuth } from '../../utils/auth'
import { prisma } from '../../utils/db'

export default defineEventHandler(async (event) => {
  try {
    // 验证用户身份
    const { id: userId } = await requireAuth(event)
    
    const body = await readBody(event)
    const { message, model = 'deepseek-chat', chatId } = body

    if (!message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Message is required'
      })
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
        throw createError({
          statusCode: 404,
          statusMessage: 'Chat not found'
        })
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
    const config = useRuntimeConfig()
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.openaiApiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: 0.7,
          max_tokens: 2000
        })
      })

      if (!response.ok) {
        throw new Error(`AI API 请求失败: ${response.status} ${response.statusText}`)
      }

      const aiResponse = await response.json()
      
      if (!aiResponse.choices || !aiResponse.choices[0]) {
        throw new Error('AI API 返回数据格式错误')
      }

      // 添加 AI 回复
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: aiResponse.choices[0].message.content,
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

      return {
        success: true,
        data: {
          chatId: chat.id,
          message: assistantMessage
        }
      }

    } catch (aiError: any) {
      console.error('AI API 调用失败:', aiError)
      throw createError({
        statusCode: 500,
        statusMessage: 'AI service temporarily unavailable'
      })
    }

  } catch (error: any) {
    console.error('发送消息失败:', error)
    
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