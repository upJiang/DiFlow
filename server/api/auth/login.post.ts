import { prisma } from '~/server/utils/db'
import { verifyPassword, generateToken } from '~/server/utils/auth'
import type { LoginRequest, AuthResponse } from '~/types'

export default defineEventHandler(async (event): Promise<AuthResponse> => {
  console.log('=== 登录API开始 ===')
  
  try {
    console.log('1. 读取请求体...')
    const body = await readBody<LoginRequest>(event)
    console.log('请求体:', { username: body.username, password: body.password ? `${body.password.length}位密码` : '无密码' })
    
    // 验证输入
    if (!body.username || !body.password) {
      console.log('输入验证失败')
      throw createError({
        statusCode: 400,
        statusMessage: '请输入用户名和密码'
      })
    }

    console.log('2. 查找用户...')
    console.log('查找用户名:', body.username)
    
    // 查找用户
    const user = await prisma.user.findUnique({
      where: { username: body.username }
    })
    
    console.log('用户查找结果:', user ? {
      id: user.id,
      username: user.username,
      hasPassword: !!user.password,
      passwordLength: user.password?.length || 0
    } : '用户不存在')

    if (!user) {
      console.log('❌ 用户不存在，返回成功状态但提示用户不存在')
      return {
        success: false,
        message: '用户不存在，请检查用户名或先注册账户'
      }
    }

    console.log('3. 验证密码...')
    console.log('输入密码长度:', body.password.length)
    console.log('数据库密码长度:', user.password.length)
    
    // 验证密码
    const isValidPassword = await verifyPassword(body.password, user.password)
    console.log('密码验证结果:', isValidPassword)
    
    if (!isValidPassword) {
      console.log('❌ 密码验证失败，返回成功状态但提示密码错误')
      return {
        success: false,
        message: '密码错误，请检查后重试'
      }
    }

    console.log('4. 生成token...')
    // 生成 token
    const userWithoutPassword = {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    }
    
    const token = generateToken(userWithoutPassword)
    console.log('Token生成成功')

    console.log('✅ 登录成功')
    return {
      success: true,
      data: {
        user: userWithoutPassword,
        token
      },
      message: '登录成功'
    }
  } catch (error: any) {
    console.error('=== 登录API错误 ===')
    console.error('错误详情:', error)
    console.error('错误消息:', error.message)
    console.error('错误状态码:', error.statusCode)
    
    if (error.statusCode) {
      console.log('重新抛出已知错误，状态码:', error.statusCode)
      throw error
    }
    
    console.log('抛出500错误')
    throw createError({
      statusCode: 500,
      statusMessage: `Internal server error: ${error.message || 'Unknown error'}`
    })
  }
}) 