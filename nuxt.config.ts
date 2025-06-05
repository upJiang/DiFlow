// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],
  css: [
    '~/assets/css/main.css'
  ],
  
  // 运行时配置 - 安全的环境变量处理方式
  runtimeConfig: {
    // 私有配置 - 仅在服务器端可用
    databaseUrl: process.env.DATABASE_URL,
    authSecret: process.env.AUTH_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    
    // 公共配置 - 客户端和服务器端都可用
    public: {
      appName: 'DiFlow',
      appVersion: '1.0.0',
      googleClientId: process.env.GOOGLE_CLIENT_ID
    }
  },
  
  // 开发服务器配置
  devServer: {
    port: 3333,
    host: 'localhost'
  },
  
  // Vite 配置优化
  vite: {
    optimizeDeps: {
      include: ['vue', '@vue/runtime-core', '@vue/shared']
    },
    server: {
      hmr: {
        port: 24679,
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
  
  // 页面路由配置
  pages: true,
  
  // 插件配置
  plugins: [],
  
  // 页面元信息
  app: {
    head: {
      title: 'DiFlow - AI 工作流平台',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'AI 工作流平台' }
      ]
    }
  }
}) 