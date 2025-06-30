"use client";

import { useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * 搜索栏组件
 */
export default function SearchBar({
  value,
  onChange,
  placeholder = "搜索...",
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <div
        className={`
        relative flex items-center bg-white rounded-lg border-2 transition-all duration-200
        ${
          isFocused
            ? "border-blue-400 shadow-md"
            : "border-gray-200 hover:border-gray-300"
        }
      `}
      >
        <div className="absolute left-3 text-gray-400">🔍</div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
