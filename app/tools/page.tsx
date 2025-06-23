"use client";

import { useState } from "react";
import Link from "next/link";

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  usage: number;
  rating: number;
  link: string;
  isExternal?: boolean;
}

const toolsData: Tool[] = [
  // JSON 工具
  {
    id: "json-formatter",
    name: "JSON 格式化",
    description: "格式化、压缩、验证 JSON 数据，支持语法高亮和错误定位",
    icon: "📄",
    category: "format",
    usage: 2543,
    rating: 4.8,
    link: "/tools/json-formatter",
  },

  // 正则表达式工具
  {
    id: "regex-tester",
    name: "正则表达式测试",
    description: "测试和验证正则表达式，实时查看匹配结果和分组信息",
    icon: "🔍",
    category: "format",
    usage: 1876,
    rating: 4.7,
    link: "/tools/regex-tester",
  },

  // Mac 软件推荐
  {
    id: "mac-apps",
    name: "Mac 软件推荐",
    description: "精选优质 Mac 应用，按分类浏览开发、设计、生产力工具",
    icon: "🍎",
    category: "tools",
    usage: 3201,
    rating: 4.9,
    link: "/tools/mac-apps",
  },

  // Base64 编解码
  {
    id: "base64-encoder",
    name: "Base64 编解码",
    description: "文本和文件的 Base64 编码解码，支持批量处理",
    icon: "🔐",
    category: "format",
    usage: 1432,
    rating: 4.6,
    link: "https://www.base64encode.org/",
    isExternal: true,
  },

  // URL 编解码
  {
    id: "url-encoder",
    name: "URL 编解码",
    description: "URL 编码解码工具，处理特殊字符和中文字符",
    icon: "🌐",
    category: "format",
    usage: 1678,
    rating: 4.5,
    link: "https://www.urlencoder.org/",
    isExternal: true,
  },

  // 时间戳转换
  {
    id: "timestamp-converter",
    name: "时间戳转换",
    description: "Unix 时间戳与日期时间相互转换，支持多种格式",
    icon: "⏰",
    category: "format",
    usage: 2156,
    rating: 4.7,
    link: "https://www.unixtimestamp.com/",
    isExternal: true,
  },

  // 颜色选择器
  {
    id: "color-picker",
    name: "颜色选择器",
    description: "RGB、HSL、HEX 颜色格式转换，调色板和渐变生成",
    icon: "🎨",
    category: "design",
    usage: 2890,
    rating: 4.8,
    link: "https://htmlcolorcodes.com/color-picker/",
    isExternal: true,
  },

  // 图片压缩
  {
    id: "image-compressor",
    name: "图片压缩",
    description: "在线图片压缩工具，支持 JPG、PNG、WebP 格式",
    icon: "🖼️",
    category: "media",
    usage: 3456,
    rating: 4.6,
    link: "https://tinyjpg.com/",
    isExternal: true,
  },

  // 二维码生成
  {
    id: "qr-generator",
    name: "二维码生成",
    description: "生成各种类型的二维码，支持文本、URL、WiFi 等",
    icon: "📱",
    category: "tools",
    usage: 2134,
    rating: 4.7,
    link: "https://www.qr-code-generator.com/",
    isExternal: true,
  },

  // 密码生成器
  {
    id: "password-generator",
    name: "密码生成器",
    description: "生成安全的随机密码，可自定义长度和字符类型",
    icon: "🔑",
    category: "security",
    usage: 1987,
    rating: 4.8,
    link: "https://passwordsgenerator.net/",
    isExternal: true,
  },

  // Hash 生成器
  {
    id: "hash-generator",
    name: "Hash 生成器",
    description: "生成 MD5、SHA1、SHA256 等各种 Hash 值",
    icon: "🔒",
    category: "security",
    usage: 1543,
    rating: 4.5,
    link: "https://www.md5hashgenerator.com/",
    isExternal: true,
  },

  // 文本差异对比
  {
    id: "text-diff",
    name: "文本差异对比",
    description: "对比两段文本的差异，高亮显示变更内容",
    icon: "📝",
    category: "format",
    usage: 1765,
    rating: 4.6,
    link: "https://www.diffchecker.com/",
    isExternal: true,
  },

  // Markdown 编辑器
  {
    id: "markdown-editor",
    name: "Markdown 编辑器",
    description: "在线 Markdown 编辑器，实时预览和导出功能",
    icon: "📖",
    category: "format",
    usage: 2345,
    rating: 4.7,
    link: "https://stackedit.io/",
    isExternal: true,
  },

  // ASCII 艺术生成器
  {
    id: "ascii-art",
    name: "ASCII 艺术",
    description: "将文本转换为 ASCII 艺术字，多种字体样式",
    icon: "🎭",
    category: "design",
    usage: 987,
    rating: 4.3,
    link: "https://patorjk.com/software/taag/",
    isExternal: true,
  },

  // 网络工具
  {
    id: "ip-lookup",
    name: "IP 地址查询",
    description: "查询 IP 地址的地理位置和网络信息",
    icon: "🌍",
    category: "network",
    usage: 1654,
    rating: 4.4,
    link: "https://whatismyipaddress.com/",
    isExternal: true,
  },

  // 单位转换
  {
    id: "unit-converter",
    name: "单位转换器",
    description: "长度、重量、温度、面积等各种单位转换",
    icon: "📏",
    category: "tools",
    usage: 2456,
    rating: 4.6,
    link: "https://www.unitconverters.net/",
    isExternal: true,
  },

  // 计算器
  {
    id: "calculator",
    name: "科学计算器",
    description: "功能完整的科学计算器，支持复杂数学运算",
    icon: "🧮",
    category: "tools",
    usage: 3123,
    rating: 4.5,
    link: "https://www.calculator.net/scientific-calculator.html",
    isExternal: true,
  },

  // 随机数生成器
  {
    id: "random-generator",
    name: "随机数生成",
    description: "生成随机数字、字符串、UUID 等",
    icon: "🎲",
    category: "tools",
    usage: 1234,
    rating: 4.4,
    link: "https://www.random.org/",
    isExternal: true,
  },
];

const categories = [
  { id: "all", name: "全部工具", icon: "🛠️" },
  { id: "format", name: "格式化", icon: "📄" },
  { id: "design", name: "设计工具", icon: "🎨" },
  { id: "media", name: "媒体处理", icon: "🖼️" },
  { id: "security", name: "安全工具", icon: "🔒" },
  { id: "network", name: "网络工具", icon: "🌐" },
  { id: "tools", name: "实用工具", icon: "⚙️" },
];

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = toolsData.filter((tool) => {
    const matchesCategory =
      selectedCategory === "all" || tool.category === selectedCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <span key={i} className="text-yellow-400 text-sm">
            ⭐
          </span>
        ))}
        {hasHalfStar && <span className="text-yellow-400 text-sm">⭐</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={i} className="text-gray-300 text-sm">
            ⭐
          </span>
        ))}
        <span className="ml-1 text-xs text-gray-600">{rating}</span>
      </div>
    );
  };

  const formatUsage = (usage: number) => {
    if (usage >= 1000) {
      return `${(usage / 1000).toFixed(1)}k`;
    }
    return usage.toString();
  };

  const handleToolClick = (tool: Tool) => {
    if (tool.isExternal) {
      window.open(tool.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-50 to-purple-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">🛠️</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent mb-4">
            效率工具集
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            精选实用的在线工具，提升工作效率，简化日常任务
          </p>
        </div>

        {/* 搜索和分类 */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索工具名称或功能..."
                className="w-full p-4 pl-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
              />
              <div className="absolute left-4 top-4 text-gray-400">🔍</div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/50">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      selectedCategory === category.id
                        ? "bg-orange-600 text-white shadow-lg"
                        : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 工具网格 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool) => {
            const ToolCard = (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
                    {tool.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {tool.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    {renderStars(tool.rating)}
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="mr-1">👥</span>
                      {formatUsage(tool.usage)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        tool.category === "format"
                          ? "bg-blue-100 text-blue-800"
                          : tool.category === "design"
                          ? "bg-purple-100 text-purple-800"
                          : tool.category === "media"
                          ? "bg-green-100 text-green-800"
                          : tool.category === "security"
                          ? "bg-red-100 text-red-800"
                          : tool.category === "network"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {categories.find((c) => c.id === tool.category)?.name}
                    </span>

                    {tool.isExternal && (
                      <span className="text-xs text-gray-500 flex items-center">
                        <span className="mr-1">🔗</span>外部链接
                      </span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <div className="text-center">
                      <span className="text-sm text-orange-600 font-medium group-hover:text-orange-700">
                        {tool.isExternal ? "访问工具 →" : "立即使用 →"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );

            if (tool.isExternal) {
              return (
                <div key={tool.id} onClick={() => handleToolClick(tool)}>
                  {ToolCard}
                </div>
              );
            } else {
              return (
                <Link key={tool.id} href={tool.link}>
                  {ToolCard}
                </Link>
              );
            }
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              未找到相关工具
            </h3>
            <p className="text-gray-600">尝试调整搜索关键词或选择其他分类</p>
          </div>
        )}

        {/* 统计信息 */}
        <div className="mt-16 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-600">
                {toolsData.length}
              </div>
              <div className="text-gray-600">实用工具</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">
                {categories.length - 1}
              </div>
              <div className="text-gray-600">工具分类</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {formatUsage(
                  toolsData.reduce((sum, tool) => sum + tool.usage, 0)
                )}
              </div>
              <div className="text-gray-600">总使用次数</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">
                {(
                  toolsData.reduce((sum, tool) => sum + tool.rating, 0) /
                  toolsData.length
                ).toFixed(1)}
              </div>
              <div className="text-gray-600">平均评分</div>
            </div>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="mt-8 bg-gradient-to-r from-orange-50 to-purple-50 rounded-3xl p-8 border border-orange-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            使用说明
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="font-semibold text-gray-800 mb-2">选择工具</h4>
              <p className="text-sm text-gray-600">
                根据需求选择合适的工具分类，或使用搜索功能快速找到目标工具
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🚀</div>
              <h4 className="font-semibold text-gray-800 mb-2">快速使用</h4>
              <p className="text-sm text-gray-600">
                点击工具卡片即可使用，内置工具在站内使用，外部工具会跳转到相应网站
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">⭐</div>
              <h4 className="font-semibold text-gray-800 mb-2">评分参考</h4>
              <p className="text-sm text-gray-600">
                查看工具评分和使用次数，选择最受欢迎和最可靠的工具
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
