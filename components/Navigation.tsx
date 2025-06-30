"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { User } from "@prisma/client";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

export function Navigation() {
  const pathname = usePathname();
  const { isLoaded, isLoading, renderGoogleButton } = useGoogleAuth();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const isActivePath = (path: string) => {
    return pathname === path || (path !== "/" && pathname.startsWith(path));
  };

  /**
   * 获取用户信息
   */
  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("获取用户信息失败:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 处理用户退出
   */
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setShowUserMenu(false);
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  /**
   * 获取用户姓名的后两位作为头像
   * @param name 用户姓名
   * @returns 头像文字
   */
  const getAvatarText = (name: string) => {
    if (!name) return "U";

    const trimmedName = name.trim();
    if (!trimmedName) return "U";

    // 对于中文名字，直接取后两个字符
    // 对于英文名字，也取后两个字符
    if (trimmedName.length >= 2) {
      const lastTwoChars = trimmedName.slice(-2);
      // 对于英文字符转大写，中文字符保持原样
      return lastTwoChars
        .split("")
        .map((char) => {
          return /[a-zA-Z]/.test(char) ? char.toUpperCase() : char;
        })
        .join("");
    }

    // 单个字符的情况
    const singleChar = trimmedName.charAt(0);
    return /[a-zA-Z]/.test(singleChar) ? singleChar.toUpperCase() : singleChar;
  };

  /**
   * 处理点击外部区域关闭用户菜单
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 组件挂载时获取用户信息
  useEffect(() => {
    fetchUser();
  }, []);

  // 当Google服务加载完成后，渲染登录按钮
  useEffect(() => {
    if (isLoaded && !user && !loading && buttonRef.current) {
      renderGoogleButton("google-signin-button", {
        theme: "outline",
        size: "large",
        type: "standard",
        shape: "rectangular",
        text: "signin_with",
        width: "280",
      });
    }
  }, [isLoaded, user, loading, renderGoogleButton]);

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              {/* DiFlow Logo Icon */}
              <div className="relative">
                <span className="text-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                  ⚡
                </span>
                {/* 微妙的发光效果 */}
                <div className="absolute inset-0 text-2xl blur-sm opacity-30 group-hover:opacity-50 transition-opacity duration-300">
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    ⚡
                  </span>
                </div>
              </div>
              {/* DiFlow 文字 */}
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300">
                DiFlow
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <Link
              href="/"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                pathname === "/"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <span className="text-xl">🏠</span>
              <span className="font-medium">首页</span>
            </Link>

            <Link
              href="/cursor-mcp"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                pathname === "/cursor-mcp"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <span className="text-xl">🎯</span>
              <span className="font-medium">Cursor & MCP</span>
            </Link>

            <Link
              href="/notes"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActivePath("/notes")
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <span className="text-xl">📝</span>
              <span className="font-medium">随手记</span>
            </Link>

            <Link
              href="/tools"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                pathname === "/tools"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <span className="text-xl">🛠️</span>
              <span className="font-medium">效率工具</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* 博客主页链接 */}
            <a
              href="https://junfeng530.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center space-x-2 px-2 py-1 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <span className="text-lg">📝</span>
              <span className="font-medium">我的博客</span>
            </a>

            {loading ? (
              <div className="w-10 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
            ) : user ? (
              <div className="relative" ref={userMenuRef}>
                {/* 用户头像 */}
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  onMouseEnter={() => setShowUserMenu(true)}
                  className="p-1 rounded-full hover:bg-blue-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-xl transition-shadow">
                    {getAvatarText(user.name || "")}
                  </div>
                </button>

                {/* 用户菜单弹出层 */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 py-4 z-50">
                    {/* 用户信息头部 */}
                    <div className="px-6 pb-4 border-b border-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                          {getAvatarText(user.name || "")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-semibold text-gray-900 truncate">
                            {user.name || "用户"}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 退出登录 */}
                    <div className="py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-3"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span>退出登录</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {isLoading && (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-500">登录中...</span>
                  </div>
                )}
                {/* 优化后的登录按钮容器 */}
                <div className="relative group google-signin-wrapper">
                  <div
                    ref={buttonRef}
                    id="google-signin-button"
                    className="relative overflow-hidden"
                  />
                  {/* 登录按钮背景光效 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {showMobileMenu && (
        <div
          ref={mobileMenuRef}
          className="md:hidden bg-white border-t border-gray-200 shadow-lg"
        >
          <div className="px-4 py-2 space-y-1">
            <Link
              href="/"
              onClick={() => setShowMobileMenu(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                pathname === "/"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <span className="text-xl">🏠</span>
              <span className="font-medium">首页</span>
            </Link>

            <Link
              href="/cursor-mcp"
              onClick={() => setShowMobileMenu(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                pathname === "/cursor-mcp"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <span className="text-xl">🎯</span>
              <span className="font-medium">Cursor & MCP</span>
            </Link>

            <Link
              href="/notes"
              onClick={() => setShowMobileMenu(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActivePath("/notes")
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <span className="text-xl">📝</span>
              <span className="font-medium">随手记</span>
            </Link>

            <Link
              href="/tools"
              onClick={() => setShowMobileMenu(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                pathname === "/tools"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <span className="text-xl">🛠️</span>
              <span className="font-medium">效率工具</span>
            </Link>

            {/* 博客主页链接 - 移动端 */}
            <a
              href="https://junfeng530.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-gray-600 hover:text-blue-600"
            >
              <span className="text-xl">📝</span>
              <span className="font-medium">我的博客</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
