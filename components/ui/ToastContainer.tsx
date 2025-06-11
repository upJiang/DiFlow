"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import Toast, { ToastMessage } from "./Toast";

interface ToastContextType {
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

/**
 * Toast上下文提供者
 * @param children 子组件
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  /**
   * 添加Toast消息
   * @param toast Toast消息对象（不包含id）
   */
  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = Date.now().toString();
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
  };

  /**
   * 移除Toast消息
   * @param id Toast消息ID
   */
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

/**
 * 使用Toast的Hook
 * @returns Toast上下文
 */
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast必须在ToastProvider内部使用");
  }
  return context;
};
