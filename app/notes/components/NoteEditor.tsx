"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Note, NoteCategory } from "../types";

interface NoteEditorProps {
  note: Note | null;
  categories: NoteCategory[];
  isEditing: boolean;
  onEdit: () => void;
  onSave: (note: Partial<Note>) => void;
  onCancel: () => void;
}

/**
 * 笔记编辑器组件
 */
export default function NoteEditor({
  note,
  categories,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [validationError, setValidationError] = useState("");

  // 同步笔记数据到编辑状态
  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setCategoryId(note.categoryId || "");
    } else {
      setTitle("");
      setContent("");
      setCategoryId(categories.length > 0 ? categories[0].id : "");
    }
  }, [note, categories]);

  // 计算字数
  useEffect(() => {
    setWordCount(content.length);
  }, [content]);

  // 保存笔记
  const handleSave = () => {
    // 清除之前的错误
    setValidationError("");

    if (!title.trim()) {
      setValidationError("请输入笔记标题");
      return;
    }

    if (!content.trim()) {
      setValidationError("请输入笔记内容");
      return;
    }

    if (content.length > 30000) {
      setValidationError("笔记内容不能超过30,000字符");
      return;
    }

    if (!categoryId) {
      setValidationError("请选择分类");
      return;
    }

    onSave({
      id: note?.id,
      title: title.trim(),
      content: content.trim(),
      categoryId,
    });
  };

  // 格式化时间
  const formatDateTime = (date: Date | string) => {
    return new Date(date).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 获取分类信息
  const getCategoryInfo = (id: string) => {
    return categories.find((cat) => cat.id === id);
  };

  // 如果没有选中笔记
  if (!note && !isEditing) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-medium mb-2">选择或创建笔记</h3>
          <p className="text-sm">
            从左侧选择一篇笔记进行查看，
            <br />
            或点击"新建笔记"开始创作
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
      {/* 头部工具栏 */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        {/* 验证错误提示 */}
        {validationError && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {validationError}
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-800">
              {isEditing ? "✏️ 编辑笔记" : "📖 查看笔记"}
            </h3>
            {note && !isEditing && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>更新于 {formatDateTime(note.updatedAt)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-4 py-1 text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  💾 保存
                </button>
                <button
                  onClick={onCancel}
                  className="text-gray-600 hover:text-gray-800 px-3 py-1 text-sm transition-colors"
                >
                  取消
                </button>
              </>
            ) : (
              <button
                onClick={onEdit}
                className="bg-blue-500 text-white px-4 py-1 text-sm rounded hover:bg-blue-600 transition-colors"
              >
                ✏️ 编辑
              </button>
            )}
          </div>
        </div>

        {/* 编辑时显示分类选择和字数统计 */}
        {isEditing && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-gray-600">分类:</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-gray-500">
              字数: {wordCount.toLocaleString()} / 30,000
              {wordCount > 30000 && (
                <span className="text-red-500 ml-2">超出限制</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-hidden">
        {isEditing ? (
          <div className="h-full flex flex-col">
            {/* 标题输入 */}
            <div className="p-4 border-b border-gray-100">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="输入笔记标题..."
                className="w-full text-xl font-semibold border-none outline-none bg-transparent"
                maxLength={100}
              />
            </div>

            {/* 内容编辑/预览 */}
            <div className="flex-1 overflow-hidden flex">
              {/* 编辑区域 */}
              <div className="flex-1 flex flex-col border-r border-gray-200">
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-sm text-gray-600 font-medium">
                  📝 编辑
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="支持 Markdown 格式，开始编写你的笔记内容..."
                  className="w-full h-full p-4 border-none outline-none resize-none font-mono text-sm leading-relaxed"
                  style={{ minHeight: "400px" }}
                />
              </div>

              {/* 预览区域 */}
              <div className="flex-1 flex flex-col">
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-sm text-gray-600 font-medium">
                  👁️ 实时预览
                </div>
                <div className="h-full overflow-y-auto p-4 prose prose-sm max-w-none bg-gray-50/30">
                  <ReactMarkdown>
                    {content || "*开始编写内容，这里将显示实时预览...*"}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            {/* 标题显示 */}
            <div className="p-4 border-b border-gray-100">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {note?.title}
              </h1>
              {note && (
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    {getCategoryInfo(note.categoryId) && (
                      <>
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: getCategoryInfo(note.categoryId)
                              ?.color,
                          }}
                        />
                        <span>{getCategoryInfo(note.categoryId)?.name}</span>
                      </>
                    )}
                  </div>
                  <span>创建于 {formatDateTime(note.createdAt)}</span>
                  <span>
                    字数 {(note.content || "").length.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* 内容显示 */}
            <div className="p-4 prose prose-sm max-w-none">
              <ReactMarkdown>{note?.content || "*暂无内容*"}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
