"use client";

import { useState } from "react";

// 真实的 MCP 服务数据 - 基于用户的实际配置
const mcpServersData = [
  {
    name: "Figma Developer MCP",
    icon: "🎯",
    description: "连接 Figma 设计文件，让 AI 理解设计布局并生成相应代码",
    category: "design",
    trust: 8.9,
    config: `{
  "mcpServers": {
    "Framelink Figma MCP": {
      "command": "npx",
      "args": [
        "-y",
        "figma-developer-mcp",
        "--figma-api-key=YOUR_FIGMA_API_KEY",
        "--stdio"
      ]
    }
  }
}`,
    link: "https://github.com/figma/figma-developer-mcp",
  },
  {
    name: "Playwright MCP",
    icon: "🎭",
    description: "自动化浏览器测试和网页操作，支持多浏览器",
    category: "api",
    trust: 8.4,
    config: `{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@executeautomation/playwright-mcp-server"]
    }
  }
}`,
    link: "https://github.com/executeautomation/playwright-mcp-server",
  },
  {
    name: "Sequential Thinking MCP",
    icon: "🧠",
    description: "提供结构化思维和推理能力，增强 AI 的逻辑处理",
    category: "tools",
    trust: 8.7,
    config: `{
  "mcpServers": {
    "sequentialthinking": {
      "command": "npx",
      "args": ["-y", "mcprouter"],
      "env": {
        "SERVER_KEY": "YOUR_SERVER_KEY"
      }
    }
  }
}`,
    link: "https://github.com/sequentialthinking/mcp-router",
  },
  {
    name: "Browser Tools MCP",
    icon: "🌐",
    description: "浏览器自动化工具集，支持网页抓取和操作",
    category: "tools",
    trust: 8.2,
    config: `{
  "mcpServers": {
    "browser-tools": {
      "command": "npx",
      "args": ["-y", "@agentdeskai/browser-tools-mcp@1.2.0"]
    }
  }
}`,
    link: "https://github.com/agentdeskai/browser-tools-mcp",
  },
  {
    name: "Exa Search MCP",
    icon: "🔍",
    description: "强大的搜索引擎 API，提供精准的网络搜索能力",
    category: "api",
    trust: 8.5,
    config: `{
  "mcpServers": {
    "exa": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://mcp.exa.ai/mcp?exaApiKey=YOUR_EXA_API_KEY"
      ]
    }
  }
}`,
    link: "https://exa.ai/",
  },
  {
    name: "DeepWiki SSE",
    icon: "📖",
    description: "深度解析 GitHub 项目文档，提供项目结构和使用指南",
    category: "docs",
    trust: 8.6,
    config: `{
  "mcpServers": {
    "deepwiki-sse": {
      "url": "https://mcp.deepwiki.com/sse"
    }
  }
}`,
    link: "https://deepwiki.ai/",
  },
  {
    name: "Context7 MCP",
    icon: "📚",
    description: "提供最新的技术文档和库信息，帮助 AI 获取准确的编程知识",
    category: "docs",
    trust: 9.2,
    config: `{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}`,
    link: "https://context7.ai/",
  },
  {
    name: "File System MCP",
    icon: "📁",
    description: "让 AI 访问文件系统，读取和操作项目文件",
    category: "tools",
    trust: 9.0,
    config: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/project", "--stdio"]
    }
  }
}`,
    link: "https://github.com/modelcontextprotocol/servers",
  },
  {
    name: "Git MCP",
    icon: "🔀",
    description: "Git 版本控制集成，查看提交历史和分支信息",
    category: "tools",
    trust: 8.8,
    config: `{
  "mcpServers": {
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git", "/repo/path", "--stdio"]
    }
  }
}`,
    link: "https://github.com/modelcontextprotocol/servers",
  },
];

interface MCPSectionProps {
  onCopy: (text: string, type: string) => void;
  onOpenLink: (url: string) => void;
}

/**
 * MCP 服务收录组件
 * 展示各种 Model Context Protocol 服务
 */
export default function MCPSection({ onCopy, onOpenLink }: MCPSectionProps) {
  const [selectedMCP, setSelectedMCP] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          <span className="mr-3">🔗</span>MCP 服务收录
        </h2>
        <p className="text-lg text-gray-600 text-center mb-8">
          精选优质的 Model Context Protocol 服务，扩展 AI 能力边界
        </p>

        {/* MCP 服务网格 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mcpServersData.map((server, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedMCP(server)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{server.icon}</div>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-sm font-medium text-gray-600">
                    {server.trust}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {server.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {server.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {server.category}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenLink(server.link);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  查看详情 →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MCP 详情弹窗 */}
      {selectedMCP && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{selectedMCP.icon}</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {selectedMCP.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm text-gray-600">
                      信任度: {selectedMCP.trust}/10
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onCopy(selectedMCP.config, "MCP 配置")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  📋 复制配置
                </button>
                <button
                  onClick={() => onOpenLink(selectedMCP.link)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  🔗 访问链接
                </button>
                <button
                  onClick={() => setSelectedMCP(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  ✕ 关闭
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  服务描述
                </h4>
                <p className="text-gray-600">{selectedMCP.description}</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  配置信息
                </h4>
                <pre className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 overflow-x-auto">
                  {selectedMCP.config}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
