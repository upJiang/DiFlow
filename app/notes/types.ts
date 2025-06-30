/**
 * 笔记分类类型
 */
export interface NoteCategory {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    notes: number;
  };
}

/**
 * 笔记类型
 */
export interface Note {
  id: string;
  title: string;
  content: string;
  fileName: string;
  categoryId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  category?: NoteCategory;
}

/**
 * 搜索参数类型
 */
export interface SearchParams {
  query?: string;
  category?: string;
  page?: number;
  limit?: number;
}

/**
 * API 响应类型
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 分页响应类型
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
