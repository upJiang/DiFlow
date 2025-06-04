import { PrismaClient } from '@prisma/client'

declare global {
  var __prisma: PrismaClient | undefined
}

console.log('初始化数据库连接...')

export const prisma = globalThis.__prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma
}

console.log('数据库连接已初始化') 