import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { CustomerService } from "@/components/business/customer-service"
import { DynamicAnnouncement } from "@/components/business/dynamic-announcement"
import { LanguageProvider } from "@/contexts/language-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Suspense } from "react"
import "./globals.css"
import Script from "next/script";

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <LanguageProvider>
          <AuthProvider>
            <Suspense fallback={null}>
              <DynamicAnnouncement />
              {children}
              <CustomerService />
            </Suspense>
          </AuthProvider>
        </LanguageProvider>
        <Analytics />

  {/* WUUNU SNIPPET - DON'T CHANGE THIS (START) */}
  {process.env.NODE_ENV !== "production" && (
    <>
      <Script id="wuunu-ws" strategy="afterInteractive">
        { `window.__WUUNU_WS__ = "http://127.0.0.1:11523/";` }
      </Script>
      <Script
        id="wuunu-widget"
        src="https://cdn.jsdelivr.net/npm/@wuunu/widget@0.1?cacheParam=953"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
    </>
  )}
  {/* WUUNU SNIPPET - DON'T CHANGE THIS (END) */}
</body>
    </html>
  )
}
