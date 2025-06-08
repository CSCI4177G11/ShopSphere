"use client"

import { useEffect, useState } from "react"

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    async function initMSW() {
      if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
        try {
          const { worker } = await import("@/lib/msw/browser")
          await worker.start({
            onUnhandledRequest: "bypass",
          })
          console.log("🔧 MSW ready for ShopSphere API mocking")
        } catch (error) {
          console.error("Failed to start MSW:", error)
        }
      }
      setIsReady(true)
    }

    initMSW()
  }, [])

  if (!isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Starting ShopSphere...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 