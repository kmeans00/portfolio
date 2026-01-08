import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

// 1. 이 부분을 본인 정보로 수정했습니다.
export const metadata: Metadata = {
  title: "KMS | Backend Developer Portfolio", // 브라우저 탭에 뜰 이름
  description: "안정적인 인프라를 지향하는 개발자 KMS입니다.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon.svg", // 우리가 새로 만들 로고 파일 이름
        type: "image/svg+xml",
      },
    ],
    apple: "/icon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}