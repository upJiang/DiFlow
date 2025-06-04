export default defineNuxtConfig({
  devtools: { enabled: true },
  
  modules: [
    '@pinia/nuxt'
  ],

  css: [
    'ant-design-vue/dist/reset.css',
    '~/assets/css/main.css'
  ],

  plugins: [
    '~/plugins/antd.client.ts'
  ],

  nitro: {
    experimental: {
      wasm: true
    }
  },

  runtimeConfig: {
    // 私有环境变量（仅服务器端）
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    
    // 公共环境变量（客户端也可访问）
    public: {
      apiBase: process.env.API_BASE || '/api'
    }
  },

  typescript: {
    strict: true,
    typeCheck: false
  },

  build: {
    transpile: ['ant-design-vue']
  },

  vite: {
    ssr: {
      noExternal: ['ant-design-vue']
    }
  }
}) 