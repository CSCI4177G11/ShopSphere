import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "@/components/query-provider"
import { AuthProvider } from "@/components/auth-provider"
import { MockAuthProvider } from "@/components/mock-auth-provider"
import { MSWProvider } from "@/components/msw-provider"
import { Toaster } from "@/components/ui/sonner"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CartDrawer } from "@/components/cart/cart-drawer"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ShopSphere - Multi-Vendor E-commerce Platform",
  description: "Discover amazing products from verified sellers worldwide",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <MSWProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <MockAuthProvider enableMockMode={true}>
              <AuthProvider>
                <QueryProvider>
                <div className="min-h-screen bg-background flex flex-col">
                  <Header />
                  <main className="flex-1 w-full">
                    <div className="w-full max-w-none mx-auto">
                      {children}
                    </div>
                  </main>
                  <Footer />
                </div>
                <CartDrawer />
                <Toaster />
              </QueryProvider>
            </AuthProvider>
            </MockAuthProvider>
          </ThemeProvider>
        </MSWProvider>
      </body>
    </html>
  )
}
