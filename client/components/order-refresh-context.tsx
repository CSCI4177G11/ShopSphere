"use client"

import { createContext, useContext, useState, useCallback } from 'react'

interface OrderRefreshContextType {
  refreshTrigger: number
  triggerRefresh: () => void
}

const OrderRefreshContext = createContext<OrderRefreshContextType | undefined>(undefined)

export function OrderRefreshProvider({ children }: { children: React.ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1)
  }, [])

  return (
    <OrderRefreshContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </OrderRefreshContext.Provider>
  )
}

export function useOrderRefresh() {
  const context = useContext(OrderRefreshContext)
  if (!context) {
    throw new Error('useOrderRefresh must be used within OrderRefreshProvider')
  }
  return context
}