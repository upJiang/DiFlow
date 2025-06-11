"use client";

import { useState } from "react";

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  categoryColor: string;
  usage: number;
  rating: number;
}

export default function ToolsPage() {
  const tools: Tool[] = [
    {
      id: "1",
      name: "文本格式化",
      description: "格式化各种文本，包括JSON、XML、HTML等格式的美化和压缩",
      icon: "📝",
      category: "文本处理",
      categoryColor: "bg-blue-100 text-blue-700",
      usage: 1246,
      rating: 4.3,
    },
    {
      id: "2",
      name: "JSON验证器",
      description: "验证JSON格式的正确性，并提供详细的错误信息提示",
      icon: "🔍",
      category: "文本处理",
      categoryColor: "bg-blue-100 text-blue-700",
      usage: 892,
      rating: 4.9,
    },
    {
      id: "3",
      name: "图片压缩",
      description: "无损压缩图片，减小文件大小，支持多种图片格式",
      icon: "🗜️",
      category: "图像处理",
      categoryColor: "bg-purple-100 text-purple-700",
      usage: 2341,
      rating: 4.7,
    },
    {
      id: "4",
      name: "代码高亮",
      description: "为代码添加语法高亮，支持多种编程语言和主题",
      icon: "🎨",
      category: "编程工具",
      categoryColor: "bg-orange-100 text-orange-700",
      usage: 567,
      rating: 4.6,
    },
    {
      id: "5",
      name: "文本翻译",
      description: "基于AI的高质量文本翻译，支持多种语言和翻译模式",
      icon: "🌐",
      category: "AI工具",
      categoryColor: "bg-blue-100 text-blue-700",
      usage: 3421,
      rating: 4.5,
    },
    {
      id: "6",
      name: "数据可视化",
      description: "将数据转换为各种图表和可视化图形，便于分析",
      icon: "📊",
      category: "数据分析",
      categoryColor: "bg-red-100 text-red-700",
      usage: 678,
      rating: 4.4,
    },
    {
      id: "7",
      name: "哈希生成器",
      description: "生成MD5、SHA1、SHA256等多种哈希值",
      icon: "🔐",
      category: "编程工具",
      categoryColor: "bg-orange-100 text-orange-700",
      usage: 412,
      rating: 4.8,
    },
    {
      id: "8",
      name: "文档生成器",
      description: "基于AI自动生成技术文档和API文档",
      icon: "📄",
      category: "AI工具",
      categoryColor: "bg-blue-100 text-blue-700",
      usage: 234,
      rating: 4.2,
    },
  ];

  const categories = [
    "全部工具",
    "📝 文本处理",
    "🎨 图像处理",
    "📊 数据分析",
    "🔧 编程工具",
    "🌐 AI工具",
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <span key={i} className="text-yellow-400">
            ⭐
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300">
            ⭐
          </span>
        );
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-16">
      {/* 工具箱页面内容 */}
      <div className="p-8">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🧰</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">实用工具集</h1>
          <p className="text-xl text-gray-600">
            精选高效工具，助力您的工作和生活
          </p>
        </div>

        {/* 搜索栏 */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索工具..."
              className="w-full px-6 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
              搜索
            </button>
          </div>
        </div>

        {/* 工具分类标签 */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, index) => (
            <button
              key={index}
              className="px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors font-medium"
            >
              {category}
            </button>
          ))}
        </div>

        {/* 工具网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-primary-300 group cursor-pointer"
            >
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {tool.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {tool.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">{tool.description}</p>
                <div className="flex justify-center space-x-2 text-xs text-gray-500 mb-4">
                  <span
                    className={`px-2 py-1 ${tool.categoryColor} rounded-lg`}
                  >
                    {tool.category}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg">
                    {tool.usage}次使用
                  </span>
                </div>
                <div className="flex justify-center space-x-1 mb-4">
                  {renderStars(tool.rating)}
                  <span className="text-xs text-gray-500 ml-2">
                    {tool.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
