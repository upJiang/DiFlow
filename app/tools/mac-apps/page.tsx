"use client";

import { useState } from "react";

interface MacApp {
  name: string;
  icon: string;
  category: string;
  description: string;
  price: string;
  rating: number;
  features: string[];
  downloadUrl: string;
  developer: string;
  size: string;
  requirements: string;
}

const macAppsData: MacApp[] = [
  // 开发工具
  {
    name: "Visual Studio Code",
    icon: "👨‍💻",
    category: "development",
    description:
      "微软开发的免费代码编辑器，支持多种编程语言，拥有丰富的插件生态",
    price: "免费",
    rating: 4.8,
    features: ["智能代码补全", "集成终端", "Git集成", "调试支持", "插件市场"],
    downloadUrl: "https://code.visualstudio.com/",
    developer: "Microsoft",
    size: "85 MB",
    requirements: "macOS 10.11+",
  },
  {
    name: "Xcode",
    icon: "🔨",
    category: "development",
    description: "苹果官方开发工具，用于开发 iOS、macOS、watchOS 和 tvOS 应用",
    price: "免费",
    rating: 4.2,
    features: [
      "Interface Builder",
      "模拟器",
      "性能分析",
      "SwiftUI",
      "版本控制",
    ],
    downloadUrl: "https://developer.apple.com/xcode/",
    developer: "Apple",
    size: "11.5 GB",
    requirements: "macOS 12.5+",
  },
  {
    name: "Docker Desktop",
    icon: "🐳",
    category: "development",
    description: "容器化应用开发平台，简化应用部署和管理",
    price: "免费/付费",
    rating: 4.1,
    features: ["容器管理", "Kubernetes", "镜像构建", "开发环境", "云集成"],
    downloadUrl: "https://www.docker.com/products/docker-desktop/",
    developer: "Docker Inc.",
    size: "540 MB",
    requirements: "macOS 10.15+",
  },

  // 设计工具
  {
    name: "Figma",
    icon: "🎨",
    category: "design",
    description: "协作式界面设计工具，支持实时协作和原型制作",
    price: "免费/付费",
    rating: 4.7,
    features: ["实时协作", "原型制作", "组件系统", "设计系统", "开发者交接"],
    downloadUrl: "https://www.figma.com/downloads/",
    developer: "Figma Inc.",
    size: "180 MB",
    requirements: "macOS 10.13+",
  },
  {
    name: "Sketch",
    icon: "💎",
    category: "design",
    description: "专业的矢量图形设计工具，UI/UX设计师首选",
    price: "$99/年",
    rating: 4.5,
    features: ["矢量编辑", "符号系统", "插件生态", "原型制作", "设计规范"],
    downloadUrl: "https://www.sketch.com/",
    developer: "Sketch B.V.",
    size: "65 MB",
    requirements: "macOS 10.15+",
  },
  {
    name: "Adobe Creative Cloud",
    icon: "🌈",
    category: "design",
    description:
      "Adobe 创意套件，包含 Photoshop、Illustrator、After Effects 等",
    price: "$52.99/月",
    rating: 4.3,
    features: [
      "Photoshop",
      "Illustrator",
      "After Effects",
      "Premiere Pro",
      "云同步",
    ],
    downloadUrl: "https://www.adobe.com/creativecloud.html",
    developer: "Adobe Inc.",
    size: "4.2 GB",
    requirements: "macOS 10.15+",
  },

  // 生产力工具
  {
    name: "Notion",
    icon: "📝",
    category: "productivity",
    description: "集笔记、数据库、项目管理于一体的全能工作空间",
    price: "免费/付费",
    rating: 4.6,
    features: ["笔记系统", "数据库", "模板库", "团队协作", "API集成"],
    downloadUrl: "https://www.notion.so/desktop",
    developer: "Notion Labs Inc.",
    size: "120 MB",
    requirements: "macOS 10.13+",
  },
  {
    name: "Obsidian",
    icon: "🧠",
    category: "productivity",
    description: "基于链接的知识管理工具，支持 Markdown 和双向链接",
    price: "免费/付费",
    rating: 4.8,
    features: ["双向链接", "图谱视图", "插件系统", "Markdown", "本地存储"],
    downloadUrl: "https://obsidian.md/",
    developer: "Dynalist Inc.",
    size: "140 MB",
    requirements: "macOS 10.13+",
  },
  {
    name: "Raycast",
    icon: "🚀",
    category: "productivity",
    description: "强大的启动器和生产力工具，可扩展的命令面板",
    price: "免费/付费",
    rating: 4.9,
    features: ["快速启动", "扩展商店", "剪贴板历史", "窗口管理", "API集成"],
    downloadUrl: "https://www.raycast.com/",
    developer: "Raycast Technologies Ltd.",
    size: "45 MB",
    requirements: "macOS 11.0+",
  },

  // 系统工具
  {
    name: "CleanMyMac X",
    icon: "🧹",
    category: "system",
    description: "Mac 系统清理和优化工具，保持系统运行流畅",
    price: "$89.95",
    rating: 4.4,
    features: ["系统清理", "恶意软件检测", "性能监控", "卸载工具", "隐私保护"],
    downloadUrl: "https://cleanmymac.com/",
    developer: "MacPaw Inc.",
    size: "75 MB",
    requirements: "macOS 10.13+",
  },
  {
    name: "Alfred",
    icon: "🎩",
    category: "system",
    description: "功能强大的启动器和自动化工具，提高工作效率",
    price: "免费/£34",
    rating: 4.7,
    features: ["快速启动", "文件搜索", "工作流", "剪贴板", "系统命令"],
    downloadUrl: "https://www.alfredapp.com/",
    developer: "Running with Crayons Ltd.",
    size: "8 MB",
    requirements: "macOS 10.12+",
  },
  {
    name: "Bartender 4",
    icon: "🍺",
    category: "system",
    description: "菜单栏管理工具，整理和隐藏菜单栏图标",
    price: "$16",
    rating: 4.6,
    features: ["菜单栏整理", "自定义显示", "热键控制", "搜索功能", "通知中心"],
    downloadUrl: "https://www.macbartender.com/",
    developer: "Surtees Studios",
    size: "12 MB",
    requirements: "macOS 10.15+",
  },

  // 媒体工具
  {
    name: "IINA",
    icon: "🎬",
    category: "media",
    description: "现代化的 macOS 媒体播放器，支持几乎所有视频格式",
    price: "免费",
    rating: 4.8,
    features: ["多格式支持", "Touch Bar", "画中画", "在线字幕", "暗色模式"],
    downloadUrl: "https://iina.io/",
    developer: "IINA Team",
    size: "65 MB",
    requirements: "macOS 10.11+",
  },
  {
    name: "Spotify",
    icon: "🎵",
    category: "media",
    description: "全球最大的音乐流媒体平台，拥有海量音乐资源",
    price: "免费/付费",
    rating: 4.5,
    features: ["海量音乐", "个性推荐", "播客", "社交分享", "离线下载"],
    downloadUrl: "https://www.spotify.com/download/",
    developer: "Spotify AB",
    size: "280 MB",
    requirements: "macOS 10.13+",
  },
];

const categories = [
  { id: "all", name: "全部", icon: "📱" },
  { id: "development", name: "开发工具", icon: "👨‍💻" },
  { id: "design", name: "设计工具", icon: "🎨" },
  { id: "productivity", name: "生产力", icon: "📝" },
  { id: "system", name: "系统工具", icon: "⚙️" },
  { id: "media", name: "媒体工具", icon: "🎬" },
];

export default function MacAppsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<MacApp | null>(null);

  const filteredApps = macAppsData.filter((app) => {
    const matchesCategory =
      selectedCategory === "all" || app.category === selectedCategory;
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.features.some((feature) =>
        feature.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const openDownloadLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <span key={i} className="text-yellow-400">
            ⭐
          </span>
        ))}
        {hasHalfStar && <span className="text-yellow-400">⭐</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={i} className="text-gray-300">
            ⭐
          </span>
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🍎</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Mac 软件推荐
          </h1>
          <p className="text-xl text-gray-600">
            精选优质 Mac 应用，提升工作效率和生活品质
          </p>
        </div>

        {/* 搜索和分类 */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索应用名称、功能或描述..."
                className="w-full p-4 pl-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                        ? "bg-purple-600 text-white shadow-lg"
                        : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
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

        {/* 应用列表 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedApp(app)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{app.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {app.name}
                    </h3>
                    <p className="text-sm text-gray-600">{app.developer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">
                    {app.price}
                  </div>
                  <div className="text-xs text-gray-500">{app.size}</div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {app.description}
              </p>

              <div className="mb-4">{renderStars(app.rating)}</div>

              <div className="flex flex-wrap gap-2 mb-4">
                {app.features.slice(0, 3).map((feature, featureIndex) => (
                  <span
                    key={featureIndex}
                    className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
                {app.features.length > 3 && (
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    +{app.features.length - 3} 更多
                  </span>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openDownloadLink(app.downloadUrl);
                }}
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
              >
                立即下载
              </button>
            </div>
          ))}
        </div>

        {filteredApps.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              未找到相关应用
            </h3>
            <p className="text-gray-600">尝试调整搜索关键词或选择其他分类</p>
          </div>
        )}

        {/* 应用详情弹窗 */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{selectedApp.icon}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {selectedApp.name}
                      </h3>
                      <p className="text-gray-600">{selectedApp.developer}</p>
                      <div className="mt-2">
                        {renderStars(selectedApp.rating)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">价格</h4>
                    <p className="text-green-600 font-medium">
                      {selectedApp.price}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">大小</h4>
                    <p className="text-gray-600">{selectedApp.size}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      系统要求
                    </h4>
                    <p className="text-gray-600">{selectedApp.requirements}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">分类</h4>
                    <p className="text-gray-600 capitalize">
                      {
                        categories.find((c) => c.id === selectedApp.category)
                          ?.name
                      }
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">应用描述</h4>
                  <p className="text-gray-600">{selectedApp.description}</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">主要功能</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => openDownloadLink(selectedApp.downloadUrl)}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                >
                  🔗 前往官网下载
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
