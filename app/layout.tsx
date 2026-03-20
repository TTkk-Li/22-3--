import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '游戏论坛 · NEXUS',
  description: '发现游戏，分享热情 — 顶尖玩家社区',
  keywords: '游戏论坛, 游戏社区, 游戏攻略',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
