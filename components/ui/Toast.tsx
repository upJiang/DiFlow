"use client";

import React, { useEffect, useState } from "react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  duration?: number;
}

interface ToastProps {
  message: ToastMessage;
  onRemove: (id: string) => void;
}

/**
 * Toast消息组件
 * @param message Toast消息对象
 * @param onRemove 移除回调函数
 */
const Toast: React.FC<ToastProps> = ({ message, onRemove }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(message.id), 300); // 等待动画完成后移除
    }, message.duration || 2000); // 默认2秒后消失

    return () => clearTimeout(timer);
  }, [message.id, message.duration, onRemove]);

  const getToastStyles = () => {
    const baseStyles =
      "fixed top-4 right-4 max-w-sm p-4 rounded-lg shadow-lg transition-all duration-300 transform z-50";
    const typeStyles = {
      success: "bg-green-500 text-white",
      error: "bg-red-500 text-white",
      warning: "bg-yellow-500 text-black",
      info: "bg-blue-500 text-white",
    };

    return `${baseStyles} ${typeStyles[message.type]} ${
      isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
    }`;
  };

  const getIcon = () => {
    switch (message.type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
        return "ℹ";
      default:
        return "";
    }
  };

  return (
    <div className={getToastStyles()}>
      <div className="flex items-start">
        <span className="text-lg mr-2">{getIcon()}</span>
        <div className="flex-1">
          {message.title && (
            <h4 className="font-semibold text-sm mb-1">{message.title}</h4>
          )}
          <p className="text-sm">{message.message}</p>
        </div>
        <button
          onClick={() => onRemove(message.id)}
          className="ml-2 text-lg opacity-70 hover:opacity-100"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
