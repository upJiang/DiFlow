"use client";

import { useState, useEffect, useRef } from "react";
import { NoteCategory } from "../types";

interface CategoryManagerProps {
  categories: NoteCategory[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  onCategoriesChange: () => void;
  isAuthenticated?: boolean;
  onAuthRequired?: () => void;
}

/**
 * 分类管理组件
 */
export default function CategoryManager({
  categories,
  selectedCategory,
  onCategorySelect,
  onCategoriesChange,
  isAuthenticated = true,
  onAuthRequired,
}: CategoryManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#3B82F6");
  const [loading, setLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  const colors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#84CC16",
    "#F97316",
  ];

  // 点击外部关闭弹窗
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deleteConfirmId) {
        const target = event.target as Element;
        // 检查点击的元素是否在弹窗内部
        if (
          !target.closest(".delete-confirm-popup") &&
          !target.closest(".delete-button")
        ) {
          setDeleteConfirmId(null);
        }
      }
    };

    if (deleteConfirmId) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [deleteConfirmId]);

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

  /**
   * 检查登录权限的包装函数
   */
  const withAuthCheck = (callback: () => void) => {
    if (!isAuthenticated && onAuthRequired) {
      onAuthRequired();
      return;
    }
    callback();
  };

  // 创建分类
  const handleCreateCategory = async () => {
    if (!isAuthenticated && onAuthRequired) {
      onAuthRequired();
      return;
    }

    if (!newCategoryName.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/notes/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCategoryName.trim(),
          color: newCategoryColor,
        }),
      });

      if (response.ok) {
        setNewCategoryName("");
        setNewCategoryColor("#3B82F6");
        setIsCreating(false);
        onCategoriesChange();
      }
    } catch (error) {
      console.error("创建分类失败:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 删除分类
   */
  const handleDeleteCategory = async (categoryId: string) => {
    if (!isAuthenticated && onAuthRequired) {
      onAuthRequired();
      return;
    }

    try {
      const response = await fetch(`/api/notes/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        if (selectedCategory === categoryId) {
          onCategorySelect("");
        }
        onCategoriesChange();
        setDeleteConfirmId(null);
      }
    } catch (error) {
      console.error("删除分类失败:", error);
    }
  };

  /**
   * 处理创建分类按钮点击
   */
  const handleCreateClick = () => {
    withAuthCheck(() => {
      setIsCreating(!isCreating);
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 flex items-center">
          📁 分类管理
        </h3>
        <button
          onClick={handleCreateClick}
          className="text-blue-500 hover:text-blue-600 text-sm font-medium"
        >
          {isCreating ? "取消" : "+ 新建"}
        </button>
      </div>

      {/* 创建分类表单 */}
      {isCreating && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="分类名称"
            className="w-full p-2 border border-gray-300 rounded mb-3 text-sm"
            maxLength={20}
          />

          <div className="mb-3">
            <span className="text-sm text-gray-600 block mb-2">颜色:</span>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewCategoryColor(color)}
                  className={`w-6 h-6 rounded-full border-2 ${
                    newCategoryColor === color
                      ? "border-gray-400"
                      : "border-gray-200"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCreateCategory}
              disabled={!newCategoryName.trim() || loading}
              className="flex-1 bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "创建中..." : "创建"}
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className="px-3 py-2 text-gray-600 hover:text-gray-800 text-sm"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 全部笔记选项 */}
      <div
        onClick={() => onCategorySelect("")}
        className={`
          flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors mb-2
          ${
            selectedCategory === ""
              ? "bg-blue-50 text-blue-700"
              : "hover:bg-gray-50"
          }
        `}
      >
        <div className="flex items-center gap-2">
          <span className="text-gray-500">📝</span>
          <span className="text-sm font-medium">全部笔记</span>
        </div>
        <span className="text-xs text-gray-500">
          {Array.isArray(categories)
            ? categories.reduce((sum, cat) => sum + (cat._count?.notes || 0), 0)
            : 0}
        </span>
      </div>

      {/* 分类列表 */}
      <div className="space-y-1">
        {Array.isArray(categories) &&
          categories.map((category) => (
            <div
              key={category.id}
              className={`
              flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors group
              ${
                selectedCategory === category.id
                  ? "bg-blue-50 text-blue-700"
                  : "hover:bg-gray-50"
              }
            `}
              onClick={() => onCategorySelect(category.id)}
            >
              <div className="flex items-center gap-2 flex-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm font-medium truncate">
                  {category.name}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">
                  {category._count?.notes || 0}
                </span>
                <button
                  ref={deleteConfirmId === category.id ? deleteButtonRef : null}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirmId(category.id);
                  }}
                  className="text-red-400 hover:text-red-600 text-xs p-1 transition-colors relative delete-button"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* 删除确认弹窗 - 使用 fixed 定位 */}
      {deleteConfirmId && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-56 delete-confirm-popup"
          style={{
            left: `${popupPosition.x}px`,
            top: `${popupPosition.y}px`,
            zIndex: 9999,
          }}
        >
          <p className="text-sm text-gray-700 mb-3">
            确定要删除这个分类吗？
            <br />
            <span className="text-xs text-gray-500">
              分类下的笔记不会被删除
            </span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteConfirmId(null);
              }}
              className="flex-1 bg-gray-200 text-gray-700 text-xs py-1 px-2 rounded hover:bg-gray-300 transition-colors"
            >
              取消
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCategory(deleteConfirmId);
              }}
              className="flex-1 bg-red-500 text-white text-xs py-1 px-2 rounded hover:bg-red-600 transition-colors"
            >
              删除
            </button>
          </div>
        </div>
      )}

      {(!Array.isArray(categories) || categories.length === 0) &&
        !isCreating && (
          <div className="text-center py-4 text-gray-500 text-sm">
            暂无分类，点击"+ 新建"创建第一个分类
          </div>
        )}
    </div>
  );
}
