import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

// 简化的网络连接检查，专为VPN环境优化
async function checkNetworkConnection(): Promise<boolean> {
  try {
    // 使用内置的http模块而不是fetch
    const https = await import('https')
    
    return new Promise((resolve) => {
      const req = https.request('https://www.google.com', { method: 'HEAD', timeout: 5000 }, (res) => {
        resolve(res.statusCode === 200)
      })
      req.on('error', () => resolve(false))
      req.on('timeout', () => resolve(false))
      req.end()
    })
  } catch {
    return false
  }
}

// 使用Node.js原生https模块的token交换函数
async function exchangeCodeForToken(params: {
  client_id: string
  client_secret: string
  code: string
  grant_type: string
  redirect_uri: string
}): Promise<any> {
  const https = await import('https')
  const querystring = await import('querystring')
  
  const postData = querystring.stringify(params)
  
  const options = {
    hostname: 'oauth2.googleapis.com',
    port: 443,
    path: '/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
      'User-Agent': 'DiFlow-OAuth-Client/1.0'
    },
    timeout: 30000
  }
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data)
          if (res.statusCode === 200) {
            resolve(response)
          } else {
            reject(new Error(`Token exchange failed: ${res.statusCode} - ${data}`))
          }
        } catch (error) {
          reject(new Error(`Invalid JSON response: ${data}`))
        }
      })
    })
    
    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`))
    })
    
    req.on('timeout', () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })
    
    req.write(postData)
    req.end()
  })
}

// 使用Node.js原生https模块获取用户信息
async function getUserInfo(accessToken: string): Promise<any> {
  const https = await import('https')
  
  const options = {
    hostname: 'www.googleapis.com',
    port: 443,
    path: '/oauth2/v2/userinfo',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'User-Agent': 'DiFlow-OAuth-Client/1.0'
    },
    timeout: 30000
  }
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data)
          if (res.statusCode === 200) {
            resolve(response)
          } else {
            reject(new Error(`User info request failed: ${res.statusCode} - ${data}`))
          }
        } catch (error) {
          reject(new Error(`Invalid JSON response: ${data}`))
        }
      })
    })
    
    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`))
    })
    
    req.on('timeout', () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })
    
    req.end()
  })
}

export default defineEventHandler(async (event) => {
  console.log('🚀 Google OAuth 回调处理开始')
  
  const body = await readBody(event)
  const code = body.code as string
  
  // 记录接收到的参数
  console.log('📨 接收到的OAuth回调数据:', {
    hasCode: !!code,
    code: code ? code.substring(0, 20) + '...' : 'null'
  })
  
  if (!code) {
    console.log('❌ 缺少授权码')
    throw createError({
      statusCode: 400,
      statusMessage: '缺少授权码'
    })
  }
  
  // 获取配置
  const googleClientId = process.env.GOOGLE_CLIENT_ID
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
  const baseUrl = process.env.AUTH_ORIGIN || 'http://localhost:3333'
  
  console.log('🔧 配置信息:', {
    hasClientId: !!googleClientId,
    hasClientSecret: !!googleClientSecret,
    baseUrl
  })
  
  if (!googleClientId || !googleClientSecret) {
    console.log('❌ Google OAuth 配置缺失')
    throw createError({
      statusCode: 500,
      statusMessage: 'Google OAuth 配置缺失'
    })
  }
  
  try {
    // 网络连接检查
    const isConnected = await checkNetworkConnection()
    if (!isConnected) {
      console.log('⚠️ 网络连接检查失败，但在VPN环境下继续尝试')
    }
    
    // 交换授权码获取访问令牌
    console.log('🔄 正在交换授权码获取访问令牌...')
    
    const tokenParams = {
      client_id: googleClientId,
      client_secret: googleClientSecret,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:3333/api/auth/google/callback'
    }
    
    console.log('📤 Token交换参数:', {
      ...tokenParams,
      client_secret: '***隐藏***',
      hasCode: !!code
    })
    
    try {
      const tokenData = await exchangeCodeForToken(tokenParams)
      console.log('✅ 成功获取访问令牌')
      
      // 获取用户信息
      console.log('👤 正在获取用户信息...')
      const googleUser = await getUserInfo(tokenData.access_token)
      console.log('✅ 成功获取用户信息:', {
        id: googleUser.id,
        email: googleUser.email,
        name: googleUser.name
      })
      
      // 在数据库中保存或更新用户
      console.log('�� 正在保存用户信息到数据库...')
      const user = await prisma.user.upsert({
        where: { 
          email: googleUser.email 
        },
        update: {
          name: googleUser.name || null,
          image: googleUser.picture || null,
          googleId: googleUser.id
        },
        create: {
          email: googleUser.email,
          name: googleUser.name || null,
          image: googleUser.picture || null,
          googleId: googleUser.id
        }
      })
      
      console.log('✅ 用户信息已保存:', { userId: user.id, email: user.email })
      
      // 生成会话令牌
      const sessionToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      
      // 创建会话
      await prisma.session.create({
        data: {
          sessionToken,
          userId: user.id,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30天后过期
        }
      })
      
      console.log('✅ 会话已创建')
      
      // 设置会话cookie
      setCookie(event, 'session-token', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 // 30天
      })
      
      console.log('🎉 Google OAuth 登录成功完成')
      
      // 生成JWT token
      const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
      const token = jwt.sign(
        { 
          id: user.id,
          email: user.email,
          name: user.name 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      )
      
      // 返回用户信息和token
      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image
        },
        token
      }
    } catch (error: any) {
      console.error('💥 Google OAuth 处理过程中发生错误:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
      
      // 根据错误类型提供不同的错误信息
      if (error.name === 'AbortError' || error.message.includes('timeout')) {
        throw createError({
          statusCode: 503,
          statusMessage: 'GoogleVPN - 网络超时。请检查VPN连接或稍后重试。'
        })
      }
      
      // 网络连接失败 - 通常是因为无法访问Google API
      if (error.message.includes('fetch failed') || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        throw createError({
          statusCode: 503,
          statusMessage: '无法连接到Google服务器。如果您在中国大陆，请确保VPN已连接并可以访问Google服务。'
        })
      }
      
      if (error.statusCode) {
        throw error
      }
      
      throw createError({
        statusCode: 500,
        statusMessage: 'GoogleVPN - 内部服务器错误'
      })
    }
  } catch (error: any) {
    console.error('💥 Google OAuth 处理过程中发生错误:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    })
    
    // 根据错误类型提供不同的错误信息
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      throw createError({
        statusCode: 503,
        statusMessage: 'GoogleVPN - 网络超时。请检查VPN连接或稍后重试。'
      })
    }
    
    // 网络连接失败 - 通常是因为无法访问Google API
    if (error.message.includes('fetch failed') || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw createError({
        statusCode: 503,
        statusMessage: '无法连接到Google服务器。如果您在中国大陆，请确保VPN已连接并可以访问Google服务。'
      })
    }
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'GoogleVPN - 内部服务器错误'
    })
  } finally {
    await prisma.$disconnect()
  }
}) 