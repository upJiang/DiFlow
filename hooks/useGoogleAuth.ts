import { useEffect, useState } from "react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleConfig) => void;
          renderButton: (element: HTMLElement, options: ButtonConfig) => void;
          prompt: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

interface GoogleConfig {
  client_id: string;
  callback: (response: CredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

interface ButtonConfig {
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  type?: "standard" | "icon";
  shape?: "rectangular" | "pill" | "circle" | "square";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  logo_alignment?: "left" | "center";
  width?: string;
  locale?: string;
}

interface CredentialResponse {
  credential: string;
  select_by?: string;
}

/**
 * Google身份验证Hook
 * @returns Google登录相关的状态和方法
 */
export const useGoogleAuth = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 处理Google登录回调
   * @param response Google返回的凭证响应
   */
  const handleCredentialResponse = async (response: CredentialResponse) => {
    setIsLoading(true);
    try {
      console.log("Google登录成功，正在验证token...");

      // 发送JWT token到后端验证
      const result = await fetch("/api/auth/google-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: response.credential,
        }),
      });

      if (result.ok) {
        console.log("Google登录验证成功");
        window.location.reload(); // 刷新页面以更新用户状态
      } else {
        const errorData = await result.json();
        console.error("Google登录验证失败:", errorData);
        throw new Error(errorData.error || "登录验证失败");
      }
    } catch (error) {
      console.error("Google登录处理失败:", error);
      // 可以在这里显示错误提示
      alert("登录失败: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 初始化Google Identity Services
   */
  const initializeGoogleAuth = () => {
    if (window.google?.accounts?.id) {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      setIsLoaded(true);
      console.log("Google Identity Services 初始化完成");
    }
  };

  /**
   * 渲染Google登录按钮
   * @param elementId 按钮容器的DOM元素ID
   * @param options 按钮配置选项
   */
  const renderGoogleButton = (
    elementId: string,
    options: ButtonConfig = {}
  ) => {
    if (!isLoaded || !window.google?.accounts?.id) return;

    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`找不到ID为 ${elementId} 的元素`);
      return;
    }

    const defaultOptions: ButtonConfig = {
      theme: "outline",
      size: "large",
      type: "standard",
      shape: "rectangular",
      text: "signin_with",
      logo_alignment: "left",
      width: "300",
      ...options,
    };

    window.google.accounts.id.renderButton(element, defaultOptions);
  };

  /**
   * 显示一键登录提示
   */
  const showOneTapPrompt = () => {
    if (isLoaded && window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    }
  };

  /**
   * 禁用自动选择
   */
  const disableAutoSelect = () => {
    if (isLoaded && window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  // 检查Google脚本是否加载完成
  useEffect(() => {
    const checkGoogleScript = () => {
      if (window.google?.accounts?.id) {
        initializeGoogleAuth();
      } else {
        // 如果Google脚本还没加载，继续等待
        setTimeout(checkGoogleScript, 100);
      }
    };

    checkGoogleScript();
  }, []);

  return {
    isLoaded,
    isLoading,
    renderGoogleButton,
    showOneTapPrompt,
    disableAutoSelect,
  };
};
