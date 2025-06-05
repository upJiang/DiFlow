import jwt from 'jsonwebtoken'

export interface GoogleUserInfo {
  id: string
  email: string
  name?: string
  picture?: string
}

export interface JWTUser {
  id: string
  email: string
  name?: string
}

// JWT 配置
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// 生成 JWT Token
export function generateToken(user: { id: string; email: string; name?: string | null }): string {
  return jwt.sign(
    { 
      id: user.id,
      email: user.email,
      name: user.name 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// 验证 JWT Token
export function verifyToken(token: string): JWTUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTUser
  } catch (error) {
    return null
  }
}

// 从请求头获取用户信息
export async function getUserFromToken(event: any): Promise<any | null> {
  try {
    const authorization = getHeader(event, 'authorization')
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return null
    }

    const token = authorization.replace('Bearer ', '')
    const decoded = verifyToken(token)
    
    if (!decoded || !decoded.id) {
      return null
    }

    const { prisma } = await import('./db')
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    })

    return user
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return null
  }
}

// 验证 Google Access Token
export async function validateGoogleToken(accessToken: string): Promise<GoogleUserInfo | null> {
  try {
    const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`)
    
    if (!response.ok) {
      return null
    }

    const userInfo = await response.json()
    
    return {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture
    }
  } catch (error) {
    console.error('验证Google Token失败:', error)
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
export async function requireAuth(event: any): Promise<JWTUser> {
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