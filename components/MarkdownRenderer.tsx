"use client";

import React, { useEffect, useRef, useState } from "react";
import MarkdownIt from "markdown-it";
import markdownItHighlightjs from "markdown-it-highlightjs";
import "highlight.js/styles/github.css";

interface MarkdownRendererProps {
  content: string;
  showCopyButton?: boolean;
  className?: string;
}

/**
 * Markdown渲染组件
 * @param content - 要渲染的markdown内容
 * @param showCopyButton - 是否显示复制按钮
 * @param className - 额外的CSS类名
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  showCopyButton = false,
  className = "",
}) => {
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // 初始化markdown-it实例
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
  }).use(markdownItHighlightjs, {
    auto: true,
    code: true,
  });

  /**
   * 复制内容到剪贴板
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("复制失败:", error);
      // 降级方案：使用传统的复制方法
      const textArea = document.createElement("textarea");
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackError) {
        console.error("降级复制也失败:", fallbackError);
      }
      document.body.removeChild(textArea);
    }
  };

  /**
   * 渲染markdown内容
   */
  const renderMarkdown = () => {
    return md.render(content);
  };

  useEffect(() => {
    // 为代码块添加复制按钮
    if (contentRef.current) {
      const codeBlocks = contentRef.current.querySelectorAll("pre code");
      codeBlocks.forEach((block, index) => {
        const pre = block.parentElement;
        if (pre && !pre.querySelector(".code-copy-btn")) {
          const copyBtn = document.createElement("button");
          copyBtn.className =
            "code-copy-btn absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200";
          copyBtn.textContent = "复制";
          copyBtn.onclick = async () => {
            try {
              await navigator.clipboard.writeText(block.textContent || "");
              copyBtn.textContent = "已复制";
              setTimeout(() => {
                copyBtn.textContent = "复制";
              }, 2000);
            } catch (error) {
              console.error("复制代码失败:", error);
            }
          };

          pre.style.position = "relative";
          pre.classList.add("group");
          pre.appendChild(copyBtn);
        }
      });
    }
  }, [content]);

  return (
    <div className={`relative ${className}`}>
      {showCopyButton && (
        <button
          onClick={handleCopy}
          className="absolute top-0 right-0 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 z-20 opacity-0 group-hover:opacity-100"
          title={copied ? "已复制" : "复制内容"}
        >
          {copied ? (
            <svg
              className="w-4 h-4 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          )}
        </button>
      )}

      <div
        ref={contentRef}
        className="markdown-content prose prose-sm max-w-none pr-8"
        dangerouslySetInnerHTML={{ __html: renderMarkdown() }}
      />
    </div>
  );
};

export default MarkdownRenderer;
