import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

export interface User {
  id: string
  email: string
  name: string
  image?: string
  googleId?: string
}

export interface SessionData {
  userId: string
  email: string
  name: string
}

export class AuthError extends Error {
  constructor(message: string, public statusCode = 401) {
    super(message)
    this.name = 'AuthError'
  }
}

// 生成JWT token
export function generateSessionToken(user: User): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set')
  }

  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// 验证JWT token
export function verifySessionToken(token: string): SessionData {
  if (!process.env.JWT_SECRET) {
    throw new AuthError('JWT_SECRET not configured', 500)
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any
    return {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name
    }
  } catch (error) {
    throw new AuthError('Invalid session token')
  }
}

// 从cookies获取会话
export function getSessionFromCookies(): SessionData | null {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('session-token')?.value
    
    if (!token) {
      return null
    }

    return verifySessionToken(token)
  } catch (error) {
    return null
  }
}

// 从请求获取会话
export function getSessionFromRequest(request: NextRequest): SessionData | null {
  try {
    // 尝试从cookie获取
    const token = request.cookies.get('session-token')?.value
    
    if (!token) {
      // 尝试从Authorization header获取
      const authHeader = request.headers.get('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        const bearerToken = authHeader.substring(7)
        return verifySessionToken(bearerToken)
      }
      return null
    }

    return verifySessionToken(token)
  } catch (error) {
    return null
  }
}

// 验证用户是否已认证（中间件用）
export function requireAuth(request: NextRequest): SessionData {
  const session = getSessionFromRequest(request)
  if (!session) {
    throw new AuthError('Authentication required')
  }
  return session
} 