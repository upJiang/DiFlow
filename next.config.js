/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // 环境变量配置
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_API_ENDPOINT: process.env.OPENAI_API_ENDPOINT,
    MODEL_NAME: process.env.MODEL_NAME,
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
  },

  // 图片优化
  images: {
    domains: ["localhost"],
  },

  // Webpack 配置
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 添加自定义 webpack 配置
    return config;
  },

  // 重写规则
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
