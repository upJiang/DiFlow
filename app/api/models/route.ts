import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'
import { getAIManager } from '@/lib/ai/manager'

export async function GET(request: NextRequest) {
  try {
    // 只在运行时检查认证，构建时跳过
    if (process.env.NODE_ENV !== 'production' || request.headers.get('cookie')) {
      const session = getSessionFromRequest(request)
      if (!session && request.headers.get('cookie')) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }
    }
    
    const aiManager = getAIManager()
    const models = aiManager.getAvailableModels()

    return NextResponse.json({
      success: true,
      models
    })

  } catch (error: any) {
    console.error('获取模型列表错误:', error)
    
    if (error.statusCode) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      )
    }
    
    return NextResponse.json(
      { error: '获取模型列表失败' },
      { status: 500 }
    )
  }
} 