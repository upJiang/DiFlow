import { validateGoogleToken, generateToken } from '../../utils/auth'
import { prisma } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { accessToken } = body

  if (!accessToken) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Access token is required'
    })
  }

  try {
    // 验证 Google Access Token
    const googleUser = await validateGoogleToken(accessToken)
    
    if (!googleUser) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid Google token'
      })
    }

    // 查找或创建用户
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email }
    })

    if (!user) {
      // 创建新用户
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          image: googleUser.picture,
          googleId: googleUser.id
        }
      })
    } else {
      // 更新现有用户信息
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: googleUser.name,
          image: googleUser.picture,
          googleId: googleUser.id
        }
      })
    }

    // 生成 JWT Token
    const token = generateToken(user)

    return {
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image
        }
      }
    }
  } catch (error) {
    console.error('Google 登录失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Login failed'
    })
  }
}) 