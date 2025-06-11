"use client";

import { useState, useEffect, useRef } from "react";
import { User } from "@/types/user";
import ChatBox from "@/components/ChatBox";

// 声明Flowgram类型
declare global {
  interface Window {
    Flowgram: any;
  }
}

// 节点类型定义
interface Node {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  icon: string;
  color: string;
  inputs: string[];
  outputs: string[];
  config?: any;
}

// 连接线定义
interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  sourceOutput: string;
  targetInput: string;
}

// 节点类型模板
const nodeTemplates = [
  {
    type: "start",
    label: "开始",
    icon: "🚀",
    color: "#10B981",
    description: "工作流启动节点",
    inputs: [],
    outputs: ["output"],
  },
  {
    type: "ai-chat",
    label: "AI对话",
    icon: "🤖",
    color: "#3B82F6",
    description: "AI智能对话处理",
    inputs: ["input"],
    outputs: ["response", "error"],
  },
  {
    type: "document",
    label: "文档处理",
    icon: "📄",
    color: "#8B5CF6",
    description: "文档读取和分析",
    inputs: ["file"],
    outputs: ["content", "metadata"],
  },
  {
    type: "condition",
    label: "条件判断",
    icon: "🔀",
    color: "#F59E0B",
    description: "基于条件的分支处理",
    inputs: ["input"],
    outputs: ["true", "false"],
  },
  {
    type: "transform",
    label: "数据转换",
    icon: "🔧",
    color: "#EF4444",
    description: "数据格式转换处理",
    inputs: ["data"],
    outputs: ["transformed"],
  },
  {
    type: "output",
    label: "输出",
    icon: "📤",
    color: "#6366F1",
    description: "结果输出节点",
    inputs: ["input"],
    outputs: [],
  },
];

export default function WorkflowPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showChatBox, setShowChatBox] = useState(false);
  const [draggedNodeType, setDraggedNodeType] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingFrom, setDrawingFrom] = useState<{
    nodeId: string;
    output: string;
  } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const flowgramRef = useRef<HTMLDivElement>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  // 获取用户信息
  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error("获取用户信息失败:", error);
      setError("获取用户信息失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // 加载保存的工作流
    const savedWorkflow = localStorage.getItem("diflow-workflow");
    if (savedWorkflow) {
      try {
        const { nodes: savedNodes, connections: savedConnections } =
          JSON.parse(savedWorkflow);
        setNodes(savedNodes || []);
        setConnections(savedConnections || []);
      } catch (e) {
        console.error("加载工作流失败:", e);
      }
    }
  }, []);

  // 保存工作流
  const saveWorkflow = () => {
    localStorage.setItem(
      "diflow-workflow",
      JSON.stringify({ nodes, connections })
    );
    alert("工作流已保存 ✅");
  };

  // 清空工作流
  const clearWorkflow = () => {
    if (confirm("确定要清空当前工作流吗？")) {
      setNodes([]);
      setConnections([]);
      setSelectedNode(null);
    }
  };

  // 处理拖拽开始
  const handleDragStart = (nodeType: string) => {
    setDraggedNodeType(nodeType);
  };

  // 处理放置节点
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedNodeType || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const template = nodeTemplates.find((t) => t.type === draggedNodeType);
    if (!template) return;

    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: template.type,
      label: template.label,
      x: x - 75, // 居中
      y: y - 40, // 居中
      width: 150,
      height: 80,
      icon: template.icon,
      color: template.color,
      inputs: template.inputs,
      outputs: template.outputs,
    };

    setNodes((prev) => [...prev, newNode]);
    setDraggedNodeType(null);
  };

  // 开始连接
  const startConnection = (
    nodeId: string,
    output: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setIsDrawing(true);
    setDrawingFrom({ nodeId, output });
  };

  // 完成连接
  const completeConnection = (nodeId: string, input: string) => {
    if (!drawingFrom || drawingFrom.nodeId === nodeId) {
      setIsDrawing(false);
      setDrawingFrom(null);
      return;
    }

    const newConnection: Connection = {
      id: `conn-${Date.now()}`,
      sourceId: drawingFrom.nodeId,
      targetId: nodeId,
      sourceOutput: drawingFrom.output,
      targetInput: input,
    };

    setConnections((prev) => [...prev, newConnection]);
    setIsDrawing(false);
    setDrawingFrom(null);
  };

  // 删除节点
  const deleteNode = (nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setConnections((prev) =>
      prev.filter((c) => c.sourceId !== nodeId && c.targetId !== nodeId)
    );
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };

  // 鼠标移动处理
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDrawing && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // 运行工作流
  const runWorkflow = () => {
    if (nodes.length === 0) {
      alert("请先添加节点到工作流中");
      return;
    }
    alert("工作流开始执行... 🚀");
  };

  // 初始化Flowgram
  useEffect(() => {
    if (typeof window !== "undefined" && flowgramRef.current) {
      // 动态加载Flowgram.ai脚本
      const script = document.createElement("script");
      script.src = "https://cdn.flowgram.ai/flowgram.min.js";
      script.async = true;
      script.onload = () => {
        // 初始化Flowgram工作流
        if (window.Flowgram) {
          const flowgram = new window.Flowgram({
            container: flowgramRef.current,
            theme: "dark",
            width: "100%",
            height: "600px",
            nodes: [
              {
                id: "start",
                type: "input",
                label: "开始",
                position: { x: 100, y: 100 },
                data: { text: "工作流开始" },
              },
              {
                id: "ai-chat",
                type: "ai",
                label: "AI对话",
                position: { x: 300, y: 100 },
                data: {
                  model: "deepseek-chat",
                  temperature: 0.7,
                  maxTokens: 2000,
                },
              },
              {
                id: "output",
                type: "output",
                label: "输出",
                position: { x: 500, y: 100 },
                data: { format: "json" },
              },
            ],
            edges: [
              {
                id: "e1",
                source: "start",
                target: "ai-chat",
                type: "default",
              },
              {
                id: "e2",
                source: "ai-chat",
                target: "output",
                type: "default",
              },
            ],
            onNodeSelect: (node: any) => {
              console.log("选中节点:", node);
            },
            onExecute: async (workflow: any) => {
              console.log("执行工作流:", workflow);
              // 这里可以调用API执行工作流
              try {
                const response = await fetch("/api/workflow/execute", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(workflow),
                });
                const result = await response.json();
                console.log("工作流执行结果:", result);
              } catch (error) {
                console.error("工作流执行失败:", error);
              }
            },
          });

          // 保存flowgram实例
          (window as any).flowgramInstance = flowgram;
        }
      };
      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">载入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* 顶部工具栏 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="text-3xl mr-2">🔄</span>
            工作流设计器
          </h1>
          <div className="text-sm text-gray-500">
            节点: {nodes.length} | 连接: {connections.length}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={runWorkflow}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
          >
            <span>▶️</span>
            <span>运行</span>
          </button>

          <button
            onClick={saveWorkflow}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <span>💾</span>
            <span>保存</span>
          </button>

          <button
            onClick={clearWorkflow}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
          >
            <span>🗑️</span>
            <span>清空</span>
          </button>

          {user && (
            <button
              onClick={() => setShowChatBox(true)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
            >
              <span>💬</span>
              <span>AI助手</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex">
        {/* 左侧节点工具栏 */}
        <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              节点工具箱
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              拖拽节点到画布中构建您的工作流
            </p>
          </div>

          <div className="space-y-3">
            {nodeTemplates.map((template) => (
              <div
                key={template.type}
                draggable
                onDragStart={() => handleDragStart(template.type)}
                className="p-4 border border-gray-200 rounded-xl cursor-move hover:border-blue-300 hover:shadow-md transition-all bg-white group"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: template.color + "20" }}
                  >
                    {template.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">
                      {template.label}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {template.description}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                  <span>输入: {template.inputs.length}</span>
                  <span>输出: {template.outputs.length}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 节点说明 */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl">
            <h3 className="font-medium text-blue-800 mb-2">💡 使用提示</h3>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• 拖拽节点到右侧画布</li>
              <li>• 点击节点输出端口连接</li>
              <li>• 双击节点可配置参数</li>
              <li>• 右键节点可删除</li>
            </ul>
          </div>
        </div>

        {/* 右侧画布区域 */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={canvasRef}
            className="w-full h-full relative bg-gray-50"
            style={{
              backgroundImage: `
                radial-gradient(circle, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onMouseMove={handleMouseMove}
            onClick={() => {
              if (isDrawing) {
                setIsDrawing(false);
                setDrawingFrom(null);
              }
            }}
          >
            {/* SVG for connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* 现有连接线 */}
              {connections.map((conn) => {
                const sourceNode = nodes.find((n) => n.id === conn.sourceId);
                const targetNode = nodes.find((n) => n.id === conn.targetId);

                if (!sourceNode || !targetNode) return null;

                const sourceX = sourceNode.x + sourceNode.width;
                const sourceY = sourceNode.y + sourceNode.height / 2;
                const targetX = targetNode.x;
                const targetY = targetNode.y + targetNode.height / 2;

                const midX = (sourceX + targetX) / 2;

                return (
                  <path
                    key={conn.id}
                    d={`M ${sourceX} ${sourceY} C ${midX} ${sourceY} ${midX} ${targetY} ${targetX} ${targetY}`}
                    stroke="#6366f1"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                  />
                );
              })}

              {/* 正在绘制的连接线 */}
              {isDrawing &&
                drawingFrom &&
                (() => {
                  const sourceNode = nodes.find(
                    (n) => n.id === drawingFrom.nodeId
                  );
                  if (!sourceNode) return null;

                  const sourceX = sourceNode.x + sourceNode.width;
                  const sourceY = sourceNode.y + sourceNode.height / 2;

                  return (
                    <path
                      d={`M ${sourceX} ${sourceY} L ${mousePos.x} ${mousePos.y}`}
                      stroke="#3b82f6"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                    />
                  );
                })()}

              {/* 箭头标记 */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
                </marker>
              </defs>
            </svg>

            {/* 节点渲染 */}
            {nodes.map((node) => (
              <div
                key={node.id}
                className={`absolute border-2 rounded-xl bg-white shadow-lg cursor-pointer select-none ${
                  selectedNode?.id === node.id
                    ? "border-blue-500 shadow-blue-200"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                style={{
                  left: node.x,
                  top: node.y,
                  width: node.width,
                  height: node.height,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNode(node);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  if (confirm(`删除节点 "${node.label}"？`)) {
                    deleteNode(node.id);
                  }
                }}
              >
                {/* 节点头部 */}
                <div
                  className="h-full flex flex-col justify-center items-center p-3 rounded-xl"
                  style={{ backgroundColor: node.color + "10" }}
                >
                  <div className="text-2xl mb-1">{node.icon}</div>
                  <div className="text-sm font-medium text-gray-800 text-center">
                    {node.label}
                  </div>
                </div>

                {/* 输入端口 */}
                {node.inputs.map((input, index) => (
                  <div
                    key={input}
                    className="absolute w-3 h-3 bg-gray-400 rounded-full cursor-pointer hover:bg-blue-500 -left-1.5"
                    style={{ top: `${20 + index * 20}px` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      completeConnection(node.id, input);
                    }}
                    title={`输入: ${input}`}
                  />
                ))}

                {/* 输出端口 */}
                {node.outputs.map((output, index) => (
                  <div
                    key={output}
                    className="absolute w-3 h-3 bg-gray-400 rounded-full cursor-pointer hover:bg-green-500 -right-1.5"
                    style={{ top: `${20 + index * 20}px` }}
                    onClick={(e) => startConnection(node.id, output, e)}
                    title={`输出: ${output}`}
                  />
                ))}
              </div>
            ))}

            {/* 空状态提示 */}
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-6xl mb-4">🎨</div>
                  <h3 className="text-xl font-medium mb-2">工作流画布</h3>
                  <p>从左侧工具栏拖拽节点到这里开始构建您的工作流</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50">
          {error}
        </div>
      )}

      {/* ChatBox 模态框 */}
      {showChatBox && (
        <ChatBox
          user={user}
          onError={setError}
          onClose={() => setShowChatBox(false)}
          sessionId="workflow-chat"
          height="h-[80vh]"
          isModal={true}
        />
      )}
    </div>
  );
}
