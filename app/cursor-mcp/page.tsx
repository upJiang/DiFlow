"use client";

import { useState } from "react";

interface Tip {
  id: string;
  category: "cursor" | "mcp";
  title: string;
  description: string;
  code?: string;
  shortcut?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
}

const tips: Tip[] = [
  {
    id: "1",
    category: "cursor",
    title: "多光标编辑",
    description: "同时在多个位置编辑相同内容，大幅提升编辑效率",
    shortcut: "Cmd/Ctrl + D",
    difficulty: "beginner",
    tags: ["编辑", "快捷键", "多光标"],
  },
  {
    id: "2",
    category: "cursor",
    title: "AI代码补全",
    description: "利用AI智能补全代码，减少重复编写",
    shortcut: "Tab",
    difficulty: "beginner",
    tags: ["AI", "补全", "智能"],
  },
  {
    id: "3",
    category: "cursor",
    title: "Composer聊天模式",
    description: "与AI进行自然语言对话，让AI帮你编写和修改代码",
    shortcut: "Cmd/Ctrl + I",
    difficulty: "intermediate",
    tags: ["AI", "聊天", "代码生成"],
  },
  {
    id: "4",
    category: "mcp",
    title: "MCP基础概念",
    description:
      "Model Context Protocol - 让AI模型与外部工具和数据源安全交互的协议",
    difficulty: "beginner",
    tags: ["MCP", "协议", "基础"],
  },
  {
    id: "5",
    category: "mcp",
    title: "MCP服务器配置",
    description: "配置自定义MCP服务器，扩展AI助手的功能边界",
    code: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/files"],
      "env": {}
    }
  }
}`,
    difficulty: "intermediate",
    tags: ["MCP", "配置", "服务器"],
  },
  {
    id: "6",
    category: "cursor",
    title: "代码折叠与展开",
    description: "智能折叠代码块，保持编辑器整洁",
    shortcut: "Cmd/Ctrl + Shift + [/]",
    difficulty: "beginner",
    tags: ["编辑", "折叠", "整理"],
  },
  {
    id: "7",
    category: "mcp",
    title: "自定义工具集成",
    description: "通过MCP协议集成自定义工具，让AI助手具备更多专业能力",
    code: `import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server(
  {
    name: 'my-custom-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);`,
    difficulty: "advanced",
    tags: ["MCP", "工具", "集成", "SDK"],
  },
];

export default function CursorMCPPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "cursor" | "mcp"
  >("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "all" | "beginner" | "intermediate" | "advanced"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTips = tips.filter((tip) => {
    const matchesCategory =
      selectedCategory === "all" || tip.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "all" || tip.difficulty === selectedDifficulty;
    const matchesSearch =
      tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "初级";
      case "intermediate":
        return "中级";
      case "advanced":
        return "高级";
      default:
        return "未知";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "cursor":
        return "⚡";
      case "mcp":
        return "🔗";
      default:
        return "📝";
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case "cursor":
        return "Cursor IDE";
      case "mcp":
        return "MCP协议";
      default:
        return "其他";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">🎯</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Cursor & MCP 实战指南
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            掌握Cursor
            IDE的高效使用技巧，深入了解MCP协议的实战应用，提升AI辅助开发的效率
          </p>
        </div>

        {/* 筛选和搜索 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              {/* 分类筛选 */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    selectedCategory === "all"
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-white/60 text-gray-700 hover:bg-white/80"
                  }`}
                >
                  全部
                </button>
                <button
                  onClick={() => setSelectedCategory("cursor")}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    selectedCategory === "cursor"
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-white/60 text-gray-700 hover:bg-white/80"
                  }`}
                >
                  ⚡ Cursor IDE
                </button>
                <button
                  onClick={() => setSelectedCategory("mcp")}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    selectedCategory === "mcp"
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-white/60 text-gray-700 hover:bg-white/80"
                  }`}
                >
                  🔗 MCP协议
                </button>
              </div>

              {/* 难度筛选 */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                className="px-4 py-2 rounded-xl border border-gray-300 bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">所有难度</option>
                <option value="beginner">初级</option>
                <option value="intermediate">中级</option>
                <option value="advanced">高级</option>
              </select>
            </div>

            {/* 搜索框 */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="搜索技巧和教程..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-2xl font-bold text-gray-800">
              {tips.filter((tip) => tip.category === "cursor").length}
            </div>
            <div className="text-gray-600">Cursor 技巧</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 text-center">
            <div className="text-3xl mb-2">🔗</div>
            <div className="text-2xl font-bold text-gray-800">
              {tips.filter((tip) => tip.category === "mcp").length}
            </div>
            <div className="text-gray-600">MCP 实战</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-gray-800">
              {tips.filter((tip) => tip.difficulty === "beginner").length}
            </div>
            <div className="text-gray-600">初级教程</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 text-center">
            <div className="text-3xl mb-2">🚀</div>
            <div className="text-2xl font-bold text-gray-800">
              {tips.filter((tip) => tip.difficulty === "advanced").length}
            </div>
            <div className="text-gray-600">高级技巧</div>
          </div>
        </div>

        {/* 技巧卡片列表 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTips.map((tip) => (
            <div
              key={tip.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 group"
            >
              {/* 头部信息 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {getCategoryIcon(tip.category)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {tip.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{getCategoryName(tip.category)}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                          tip.difficulty
                        )}`}
                      >
                        {getDifficultyText(tip.difficulty)}
                      </span>
                    </div>
                  </div>
                </div>
                {tip.shortcut && (
                  <div className="bg-gray-100 px-3 py-1 rounded-lg text-sm font-mono text-gray-700">
                    {tip.shortcut}
                  </div>
                )}
              </div>

              {/* 描述 */}
              <p className="text-gray-600 mb-4 leading-relaxed">
                {tip.description}
              </p>

              {/* 代码示例 */}
              {tip.code && (
                <div className="bg-gray-900 rounded-xl p-4 mb-4 overflow-x-auto">
                  <pre className="text-gray-300 text-sm">
                    <code>{tip.code}</code>
                  </pre>
                </div>
              )}

              {/* 标签 */}
              <div className="flex flex-wrap gap-2">
                {tip.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 空状态 */}
        {filteredTips.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              没有找到相关内容
            </h3>
            <p className="text-gray-500">尝试调整筛选条件或搜索关键词</p>
          </div>
        )}

        {/* 底部资源链接 */}
        <div className="mt-16 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            更多资源
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="https://cursor.sh/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-all duration-300 group"
            >
              <div className="text-3xl mb-3">📚</div>
              <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                Cursor 官方文档
              </h3>
              <p className="text-sm text-gray-600">
                查看完整的使用指南和API文档
              </p>
            </a>
            <a
              href="https://modelcontextprotocol.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl hover:from-green-100 hover:to-blue-100 transition-all duration-300 group"
            >
              <div className="text-3xl mb-3">🔗</div>
              <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                MCP 协议规范
              </h3>
              <p className="text-sm text-gray-600">
                了解MCP协议的详细规范和最佳实践
              </p>
            </a>
            <a
              href="https://github.com/modelcontextprotocol"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-300 group"
            >
              <div className="text-3xl mb-3">🐙</div>
              <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                GitHub 仓库
              </h3>
              <p className="text-sm text-gray-600">
                浏览示例代码和社区贡献的工具
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
