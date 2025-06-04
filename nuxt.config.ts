// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: [
    '@pinia/nuxt'
  ],
  
  // 运行时配置 - 安全的环境变量处理方式
  runtimeConfig: {
    // 私有配置 - 只在服务端可用
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-please-change-in-production',
    public: {
      // 公共配置 - 客户端和服务端都可用
      apiBase: '/api'
    }
  },
  
  // 开发服务器配置
  devServer: {
    port: 3000,
    host: 'localhost'
  },
  
  // Vite 配置优化
  vite: {
    optimizeDeps: {
      include: ['vue', '@vue/runtime-core', '@vue/shared']
    },
    server: {
      hmr: {
        port: 24678,
        overlay: false
      },
      watch: {
        usePolling: false,
        ignored: ['**/node_modules/**', '**/dist/**']
      }
    },
    build: {
      sourcemap: false
    }
  },
  
  // 构建优化
  build: {
    transpile: []
  },
  
  // 实验性功能
  experimental: {
    payloadExtraction: false
  },
  
  // 开发模式优化
  dev: process.env.NODE_ENV === 'development'
}) 