"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import NotesList from "./NotesList";
import NoteEditor from "./NoteEditor";
import CategoryManager from "./CategoryManager";
import SearchBar from "./SearchBar";
import { Note, NoteCategory } from "../types";

interface NotesPageProps {
  isAuthenticated: boolean;
  onAuthRequired: () => boolean;
}

/**
 * 随手记页面主组件
 */
export default function NotesPage({
  isAuthenticated,
  onAuthRequired,
}: NotesPageProps) {
  const searchParams = useSearchParams();
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<NoteCategory[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // 从URL参数获取选中的笔记ID
  useEffect(() => {
    const noteId = searchParams.get("note");
    if (noteId && notes.length > 0) {
      const note = notes.find((n) => n.id === noteId);
      if (note) {
        setSelectedNote(note);
      }
    }
  }, [searchParams, notes]);

  /**
   * 检查登录权限的包装函数
   */
  const withAuthCheck = (callback: () => void) => {
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }
    callback();
  };

  /**
   * 加载分类
   */
  const loadCategories = async () => {
    try {
      console.log("开始加载分类...");
      const response = await fetch("/api/notes/categories");
      console.log("分类响应状态:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("分类数据:", data);
        setCategories(data.categories || []);
      } else {
        const errorText = await response.text();
        console.error("加载分类失败:", response.status, errorText);
        setError(`加载分类失败: ${response.status}`);
      }
    } catch (error) {
      console.error("分类网络错误:", error);
      setError("网络错误");
    }
  };

  /**
   * 加载笔记
   */
  const loadNotes = async () => {
    try {
      setLoading(true);
      console.log("开始加载笔记...");
      const response = await fetch("/api/notes");
      console.log("笔记响应状态:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("笔记数据:", data);

        // 确保数据格式正确并验证每个笔记的内容
        const notes = Array.isArray(data.notes) ? data.notes : [];
        const validatedNotes = notes.map((note: any) => ({
          ...note,
          title: note.title || "无标题",
          content: note.content || "",
          updatedAt: note.updatedAt ? new Date(note.updatedAt) : new Date(),
          createdAt: note.createdAt ? new Date(note.createdAt) : new Date(),
        }));

        setNotes(validatedNotes);
      } else {
        const errorText = await response.text();
        console.error("加载笔记失败:", response.status, errorText);
        setError(`加载笔记失败: ${response.status}`);
      }
    } catch (error) {
      console.error("笔记网络错误:", error);
      setError("网络错误");
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    // 只有在用户已登录时才加载数据
    if (isAuthenticated) {
      loadCategories();
      loadNotes();
    } else {
      // 未登录时清除加载状态
      setLoading(false);
    }
  }, [isAuthenticated]);

  // 筛选笔记
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      !searchQuery ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory || note.categoryId === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  /**
   * 创建新笔记
   */
  const handleCreateNote = () => {
    withAuthCheck(() => {
      const tempId = `temp-${Date.now()}`;
      const newNote = {
        id: tempId,
        title: "",
        content: "",
        categoryId: selectedCategory === "all" ? "" : selectedCategory,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setSelectedNote(newNote as Note);
      setIsEditing(true);
    });
  };

  /**
   * 保存笔记
   */
  const handleSaveNote = async (note: Partial<Note>) => {
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }

    try {
      // 检查是否是临时笔记（以temp-开头的ID）
      const isNewNote = !note.id || note.id.startsWith("temp-");
      const url = isNewNote ? "/api/notes" : `/api/notes/${note.id}`;
      const method = isNewNote ? "POST" : "PUT";

      // 如果是临时笔记，移除临时ID
      const noteToSave = isNewNote ? { ...note, id: undefined } : note;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteToSave),
      });

      if (response.ok) {
        const responseData = await response.json();

        // 处理API响应的数据结构，可能是直接的note对象或包装在note字段中
        const savedNote = responseData.note || responseData;

        // 验证保存的笔记数据
        const validatedNote = {
          ...savedNote,
          title: savedNote.title || "无标题",
          content: savedNote.content || "",
          updatedAt: savedNote.updatedAt
            ? new Date(savedNote.updatedAt)
            : new Date(),
          createdAt: savedNote.createdAt
            ? new Date(savedNote.createdAt)
            : new Date(),
        };

        if (isNewNote) {
          setNotes((prev) => [validatedNote, ...prev]);
        } else {
          setNotes((prev) =>
            prev.map((n) => (n.id === note.id ? validatedNote : n))
          );
        }

        // 如果保存的笔记分类与当前选中的分类不匹配，切换到笔记的分类
        if (selectedCategory && validatedNote.categoryId !== selectedCategory) {
          console.log(
            "分类不匹配，从",
            selectedCategory,
            "切换到",
            validatedNote.categoryId
          );
          setSelectedCategory(validatedNote.categoryId);
        }

        // 重新加载分类数据，确保分类管理界面实时更新
        await loadCategories();

        console.log("保存完成，设置选中笔记:", validatedNote);
        setSelectedNote(validatedNote);
        setIsEditing(false);
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "保存失败");
      }
    } catch (error) {
      setError("网络错误");
    }
  };

  /**
   * 删除笔记
   */
  const handleDeleteNote = async (noteId: string) => {
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }

    // 如果是临时笔记，直接取消编辑
    if (noteId.startsWith("temp-")) {
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
        setIsEditing(false);
      }
      return;
    }

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
        if (selectedNote?.id === noteId) {
          setSelectedNote(null);
          setIsEditing(false);
        }
        // 删除笔记后重新加载分类数据以更新笔记数量
        loadCategories();
        setError("");
        setDeleteConfirmId(null);
      } else {
        setError("删除失败");
      }
    } catch (error) {
      setError("网络错误");
    }
  };

  /**
   * 处理笔记选择
   */
  const handleNoteSelect = (note: Note) => {
    withAuthCheck(() => {
      setSelectedNote(note);
      setIsEditing(false);
    });
  };

  /**
   * 处理笔记编辑
   */
  const handleNoteEdit = () => {
    withAuthCheck(() => {
      setIsEditing(true);
    });
  };

  return (
    <div
      className="flex gap-4 pt-4 pb-4 pr-4 pl-4"
      style={{ height: "calc(100vh - 64px)" }}
    >
      {/* 左侧边栏 */}
      <div className="w-64 flex-shrink-0 flex flex-col h-full">
        {/* 页面标题 - 固定高度 */}
        <div className="relative group mb-4 flex-shrink-0">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2 cursor-help">
            📝 随手记
            <span className="text-sm text-gray-400">ℹ️</span>
          </h1>

          {/* Hover 提示 */}
          <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <p className="text-gray-600 text-sm mb-2">
              支持 Markdown 格式的智能笔记系统，让你的想法有序记录
            </p>
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
              💡 <strong>使用提示：</strong>
              仅支持 Markdown 格式，不支持图片上传。每篇笔记限制 30,000
              字符以内。
            </div>
          </div>
        </div>

        {/* 搜索栏 - 固定高度 */}
        <div className="mb-4 flex-shrink-0">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="搜索笔记..."
          />
        </div>

        {/* 分类管理 - 可滚动区域 */}
        <div className="flex-1 min-h-0 mb-4">
          <div className="h-full overflow-y-auto">
            <CategoryManager
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              onCategoriesChange={loadCategories}
              isAuthenticated={isAuthenticated}
              onAuthRequired={onAuthRequired}
            />
          </div>
        </div>

        {/* 创建按钮 - 固定高度 */}
        <div className="flex-shrink-0">
          <button
            onClick={handleCreateNote}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
          >
            ✏️ 新建笔记
          </button>
        </div>
      </div>

      {/* 笔记列表 - 可滚动区域 */}
      <div className="w-80 flex-shrink-0 h-full">
        <div className="h-full overflow-y-auto">
          <NotesList
            notes={filteredNotes}
            selectedNote={selectedNote}
            onNoteSelect={handleNoteSelect}
            onNoteDelete={(noteId) => setDeleteConfirmId(noteId)}
            loading={loading}
            categories={categories}
            deleteConfirmId={deleteConfirmId}
            onDeleteConfirm={handleDeleteNote}
            onDeleteCancel={() => setDeleteConfirmId(null)}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>

      {/* 笔记编辑器 - 占据剩余空间 */}
      <div className="flex-1 min-w-0 h-full">
        <NoteEditor
          note={selectedNote}
          categories={categories}
          isEditing={isEditing}
          onEdit={handleNoteEdit}
          onSave={handleSaveNote}
          onCancel={() => {
            setIsEditing(false);
            // 如果是临时笔记（没有真实ID或以temp-开头），清空选中状态
            if (!selectedNote?.id || selectedNote.id.startsWith("temp-")) {
              setSelectedNote(null);
            }
          }}
        />
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {error}
          <button
            onClick={() => setError("")}
            className="ml-2 text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
