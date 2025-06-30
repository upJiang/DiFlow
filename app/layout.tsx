import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { ToastProvider } from "@/components/ui/ToastContainer";
import GlobalChatButton from "@/components/GlobalChatButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "DiFlow - AI智能工作流平台 | 程序员效率工具",
    template: "%s | DiFlow - AI智能工作流平台",
  },
  description:
    "DiFlow是专为程序员和知识工作者打造的AI智能工作流平台，集成AI对话、随手记笔记、文档智能分析、网络搜索等功能。提供知识库问答、Markdown笔记管理、代码辅助、工作流自动化等服务，让AI助力提升工作效率。",
  keywords: [
    "DiFlow",
    "AI工作流",
    "AI助手",
    "程序员工具",
    "智能对话",
    "随手记",
    "Markdown笔记",
    "笔记管理",
    "分类笔记",
    "文档分析",
    "知识库",
    "AI聊天",
    "代码助手",
    "工作效率",
    "人工智能",
    "机器学习",
    "自然语言处理",
    "ChatGPT",
    "LangChain",
    "向量数据库",
    "RAG",
    "智能搜索",
    "自动化工具",
  ],
  authors: [{ name: "DiFlow Team" }],
  creator: "DiFlow",
  publisher: "DiFlow",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://diflow.ai"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://diflow.ai",
    title: "DiFlow - AI智能工作流平台 | 程序员效率工具",
    description:
      "DiFlow是专为程序员和知识工作者打造的AI智能工作流平台，集成AI对话、随手记笔记、文档智能分析、网络搜索等功能。提供知识库问答、Markdown笔记管理、代码辅助、工作流自动化等服务。",
    siteName: "DiFlow",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DiFlow - AI智能工作流平台",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DiFlow - AI智能工作流平台 | 程序员效率工具",
    description:
      "DiFlow是专为程序员和知识工作者打造的AI智能工作流平台，集成AI对话、随手记笔记、文档智能分析、网络搜索等功能。",
    images: ["/og-image.png"],
    creator: "@DiFlow",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google:
      "google-site-verification=LMJ785zr8nEQGKe0hMQoBfWYIOAhvbP6sqS1dlZgDHI",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "technology",
  classification: "AI工具",
  other: {
    "msapplication-TileColor": "#2563eb",
    "theme-color": "#2563eb",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        {/* Google Search Console HTML验证标签 */}
        <meta
          name="google-site-verification"
          content="LMJ785zr8nEQGKe0hMQoBfWYIOAhvbP6sqS1dlZgDHI"
        />
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
        {/* 结构化数据 - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "DiFlow",
              url: "https://diflow.ai",
              logo: "https://diflow.ai/logo.png",
              description:
                "DiFlow是专为程序员和知识工作者打造的AI智能工作流平台",
              sameAs: [
                "https://github.com/diflow",
                "https://twitter.com/diflow",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                availableLanguage: ["Chinese", "English"],
              },
            }),
          }}
        />
        {/* 结构化数据 - WebApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "DiFlow AI工作流平台",
              url: "https://diflow.ai",
              description:
                "集成AI对话、文档智能分析、网络搜索等功能的智能工作流平台",
              applicationCategory: "ProductivityApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "CNY",
              },
              featureList: [
                "AI智能对话",
                "随手记笔记",
                "文档智能分析",
                "知识库问答",
                "网络搜索增强",
                "工作流自动化",
              ],
            }),
          }}
        />
        {/* Favicon和图标 */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.svg"
        />
        <link
          rel="icon"
          type="image/svg+xml"
          sizes="32x32"
          href="/favicon-32x32.svg"
        />
        <link
          rel="icon"
          type="image/svg+xml"
          sizes="16x16"
          href="/favicon-16x16.svg"
        />
        <link rel="manifest" href="/site.webmanifest" />
        {/* 预连接到外部资源 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* DNS预取 */}
        <link rel="dns-prefetch" href="//accounts.google.com" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ToastProvider>
          <Navigation />
          {children}
          <GlobalChatButton />
        </ToastProvider>
      </body>
    </html>
  );
}
