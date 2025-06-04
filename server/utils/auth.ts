import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import type { User } from '~/types'

const config = useRuntimeConfig()

// 生成 JWT token
export function generateToken(user: User): string {
  return jwt.sign(
    { 
      userId: user.id, 
      username: user.username 
    },
    config.jwtSecret,
    { expiresIn: '7d' }
  )
}

// 验证 JWT token
export function verifyToken(token: string): { userId: string; username: string } | null {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any
    return {
      userId: decoded.userId,
      username: decoded.username
    }
  } catch (error) {
    return null
  }
}

// 从请求头获取 token
export function getTokenFromHeader(event: any): string | null {
  const authorization = getHeader(event, 'authorization')
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null
  }
  return authorization.substring(7)
}

// 验证用户身份中间件
export async function requireAuth(event: any): Promise<{ userId: string; username: string }> {
  const token = getTokenFromHeader(event)
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token is required'
    })
  }

  const decoded = verifyToken(token)
  
  if (!decoded) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    })
  }

  return decoded
}

// 密码加密
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

// 密码验证
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
} 