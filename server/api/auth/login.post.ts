import { prisma } from '~/server/utils/db'
import { verifyPassword, generateToken } from '~/server/utils/auth'
import type { LoginRequest, AuthResponse } from '~/types'

export default defineEventHandler(async (event): Promise<AuthResponse> => {
  try {
    const body = await readBody<LoginRequest>(event)
    
    // 验证输入
    if (!body.username || !body.password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Username and password are required'
      })
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { username: body.username }
    })

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }

    // 验证密码
    const isValidPassword = await verifyPassword(body.password, user.password)
    
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }

    // 生成 token
    const userWithoutPassword = {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    }
    
    const token = generateToken(userWithoutPassword)

    return {
      success: true,
      data: {
        user: userWithoutPassword,
        token
      },
      message: 'Login successful'
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