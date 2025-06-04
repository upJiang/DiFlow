import { prisma } from '~/server/utils/db'
import { hashPassword, generateToken } from '~/server/utils/auth'
import type { RegisterRequest, AuthResponse } from '~/types'

export default defineEventHandler(async (event): Promise<AuthResponse> => {
  try {
    const body = await readBody<RegisterRequest>(event)
    
    // 验证输入
    if (!body.username || !body.password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Username and password are required'
      })
    }

    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { username: body.username }
    })

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Username already exists'
      })
    }

    // 创建新用户
    const hashedPassword = await hashPassword(body.password)
    const user = await prisma.user.create({
      data: {
        username: body.username,
        password: hashedPassword
      },
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // 转换用户数据为正确的格式
    const userForToken = {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    }

    // 生成 token
    const token = generateToken(userForToken)

    return {
      success: true,
      data: {
        user: userForToken,
        token
      },
      message: 'User registered successfully'
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