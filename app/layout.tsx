import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { ToastProvider } from "@/components/ui/ToastContainer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DiFlow - AI 工作流平台",
  description: "集成对话、工作流和工具的智能平台",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
      </head>
      <body className={`${inter.className} antialiased`}>
        <ToastProvider>
          <Navigation />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
