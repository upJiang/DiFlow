"use client";

import { useState } from "react";

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(true);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError("");
      setIsValid(true);
    } catch (err) {
      setError("无效的 JSON 格式: " + (err as Error).message);
      setIsValid(false);
      setOutput("");
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError("");
      setIsValid(true);
    } catch (err) {
      setError("无效的 JSON 格式: " + (err as Error).message);
      setIsValid(false);
      setOutput("");
    }
  };

  const validateJson = () => {
    try {
      JSON.parse(input);
      setError("");
      setIsValid(true);
      setOutput("✅ JSON 格式有效");
    } catch (err) {
      setError("❌ JSON 格式无效: " + (err as Error).message);
      setIsValid(false);
      setOutput("");
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("已复制到剪贴板");
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
    setIsValid(true);
  };

  const loadExample = () => {
    const example = {
      name: "张三",
      age: 25,
      city: "北京",
      hobbies: ["读书", "游泳", "编程"],
      address: {
        street: "长安街",
        number: 123,
      },
      isActive: true,
    };
    setInput(JSON.stringify(example));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            JSON 格式化工具
          </h1>
          <p className="text-xl text-gray-600">格式化、压缩、验证 JSON 数据</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 输入区域 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">输入 JSON</h2>
              <div className="flex space-x-2">
                <button
                  onClick={loadExample}
                  className="px-3 py-1 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  示例
                </button>
                <button
                  onClick={clearAll}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  清空
                </button>
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="在此粘贴或输入 JSON 数据..."
              className="w-full h-96 p-4 border border-gray-300 rounded-xl resize-none font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {/* 操作按钮 */}
            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={formatJson}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                🎨 格式化
              </button>
              <button
                onClick={minifyJson}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                🗜️ 压缩
              </button>
              <button
                onClick={validateJson}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                ✅ 验证
              </button>
            </div>
          </div>

          {/* 输出区域 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">输出结果</h2>
              {output && (
                <button
                  onClick={() => copyToClipboard(output)}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  📋 复制
                </button>
              )}
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <textarea
              value={output}
              readOnly
              placeholder="格式化结果将显示在这里..."
              className={`w-full h-96 p-4 border rounded-xl resize-none font-mono text-sm ${
                isValid
                  ? "border-gray-300 bg-gray-50"
                  : "border-red-300 bg-red-50"
              }`}
            />

            {/* 统计信息 */}
            {output && isValid && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">字符数: </span>
                    <span className="font-medium text-green-700">
                      {output.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">行数: </span>
                    <span className="font-medium text-green-700">
                      {output.split("\n").length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 使用说明 */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">使用说明</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🎨</div>
              <h4 className="font-medium text-gray-800 mb-2">格式化</h4>
              <p className="text-sm text-gray-600">
                将压缩的 JSON 格式化为易读的缩进格式
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🗜️</div>
              <h4 className="font-medium text-gray-800 mb-2">压缩</h4>
              <p className="text-sm text-gray-600">
                移除多余的空格和换行，减小文件大小
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">✅</div>
              <h4 className="font-medium text-gray-800 mb-2">验证</h4>
              <p className="text-sm text-gray-600">
                检查 JSON 语法是否正确，定位错误位置
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
