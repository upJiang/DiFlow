"use client";

import { Note, NoteCategory } from "../types";
import { useEffect, useState, useRef } from "react";

interface NotesListProps {
  notes: Note[];
  selectedNote: Note | null;
  onNoteSelect: (note: Note) => void;
  onNoteDelete: (noteId: string) => void;
  loading: boolean;
  categories: NoteCategory[];
  deleteConfirmId?: string | null;
  onDeleteConfirm?: (noteId: string) => void;
  onDeleteCancel?: () => void;
  isAuthenticated: boolean;
}

/**
 * 笔记列表组件
 */
export default function NotesList({
  notes,
  selectedNote,
  onNoteSelect,
  onNoteDelete,
  loading,
  categories,
  deleteConfirmId,
  onDeleteConfirm,
  onDeleteCancel,
  isAuthenticated,
}: NotesListProps) {
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  // 点击外部关闭弹窗
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deleteConfirmId && onDeleteCancel) {
        const target = event.target as Element;
        // 检查点击的元素是否在弹窗内部
        if (
          !target.closest(".delete-confirm-popup") &&
          !target.closest(".delete-button")
        ) {
          onDeleteCancel();
        }
      }
    };

    if (deleteConfirmId) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [deleteConfirmId, onDeleteCancel]);

  // 计算弹窗位置
  useEffect(() => {
    if (deleteConfirmId && deleteButtonRef.current) {
      const rect = deleteButtonRef.current.getBoundingClientRect();
      setPopupPosition({
        x: rect.right + 8, // 按钮右侧 + 8px 间距
        y: rect.top, // 与按钮顶部对齐
      });
    }
  }, [deleteConfirmId]);

  // 格式化日期
  const formatDate = (date: Date | string) => {
    try {
      const d = new Date(date);

      // 检查日期是否有效
      if (isNaN(d.getTime())) {
        return "未知时间";
      }

      const now = new Date();
      const diffTime = now.getTime() - d.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "今天";
      if (diffDays === 1) return "昨天";
      if (diffDays > 0 && diffDays <= 7) return `${diffDays}天前`;
      if (diffDays < 0) return "未来";

      return d.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("日期格式化错误:", error);
      return "未知时间";
    }
  };

  // 获取分类信息
  const getCategoryInfo = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId);
  };

  /**
   * 截取内容预览
   * @param content 笔记内容
   * @returns 处理后的预览文本
   */
  const getContentPreview = (content: string | undefined | null) => {
    // 检查content是否为空或undefined
    if (!content || typeof content !== "string") {
      return "暂无内容";
    }

    // 移除 markdown 标记
    const plainText = content
      .replace(/#{1,6}\s+/g, "") // 移除标题标记
      .replace(/\*\*(.*?)\*\*/g, "$1") // 移除粗体标记
      .replace(/\*(.*?)\*/g, "$1") // 移除斜体标记
      .replace(/`(.*?)`/g, "$1") // 移除代码标记
      .replace(/\[(.*?)\]\(.*?\)/g, "$1") // 移除链接，保留文本
      .replace(/\n+/g, " ") // 替换换行为空格
      .trim();

    return plainText.length > 100
      ? plainText.substring(0, 100) + "..."
      : plainText;
  };

  if (loading && isAuthenticated) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 h-full">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">📋 笔记列表</h3>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="font-semibold text-gray-800">📋 笔记列表</h3>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8">
          <div className="text-4xl mb-4">🔐</div>
          <p className="text-center">请先登录以查看您的笔记</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h3 className="font-semibold text-gray-800 flex items-center justify-between">
          <span>📋 笔记列表</span>
          <span className="text-sm text-gray-500 font-normal">
            {notes.length} 篇
          </span>
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-center">
              暂无笔记
              <br />
              点击"新建笔记"开始创作吧
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notes.map((note, index) => {
              const category = getCategoryInfo(note.categoryId);
              const isSelected = selectedNote?.id === note.id;

              return (
                <div
                  key={note.id || `temp-note-${index}`}
                  onClick={() => onNoteSelect(note)}
                  className={`
                    p-4 cursor-pointer transition-colors group relative
                    ${
                      isSelected
                        ? "bg-blue-50 border-r-4 border-blue-500"
                        : "hover:bg-gray-50"
                    }
                  `}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4
                      className={`
                      font-medium truncate flex-1 mr-2
                      ${isSelected ? "text-blue-900" : "text-gray-900"}
                    `}
                    >
                      {note.title || "无标题"}
                    </h4>
                    <button
                      ref={deleteConfirmId === note.id ? deleteButtonRef : null}
                      onClick={(e) => {
                        e.stopPropagation();
                        onNoteDelete(note.id);
                      }}
                      className="text-red-400 hover:text-red-600 text-sm p-1 transition-colors relative delete-button"
                      title="删除笔记"
                    >
                      🗑️
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {getContentPreview(note.content)}
                  </p>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {category && (
                        <div className="flex items-center gap-1">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-gray-500">{category.name}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-gray-400">
                      {formatDate(note.updatedAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 删除确认弹窗 - 使用 fixed 定位 */}
      {deleteConfirmId && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-48 delete-confirm-popup"
          style={{
            left: `${popupPosition.x}px`,
            top: `${popupPosition.y}px`,
            zIndex: 9999,
          }}
        >
          <p className="text-sm text-gray-700 mb-3">确定要删除这篇笔记吗？</p>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteCancel?.();
              }}
              className="flex-1 bg-gray-200 text-gray-700 text-xs py-1 px-2 rounded hover:bg-gray-300 transition-colors"
            >
              取消
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const noteToDelete = notes.find(
                  (note) => note.id === deleteConfirmId
                );
                if (noteToDelete) {
                  onDeleteConfirm?.(noteToDelete.id);
                }
              }}
              className="flex-1 bg-red-500 text-white text-xs py-1 px-2 rounded hover:bg-red-600 transition-colors"
            >
              删除
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
