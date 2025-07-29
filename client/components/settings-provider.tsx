"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { userService } from '@/lib/api/user-service'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'

export type Currency = "USD" | "CAD" | "GBP"

interface SettingsContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  updateTheme: (theme: string) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

interface SettingsProviderProps {
  children: React.ReactNode
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  // Initialize with localStorage value if available
  const [currency, setCurrencyState] = useState<Currency>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('currency') as Currency
      return saved && ['USD', 'CAD', 'GBP'].includes(saved) ? saved : 'CAD'
    }
    return 'CAD'
  })
  const { theme, setTheme } = useTheme()
  const { user, loading: authLoading } = useAuth()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load user settings on mount
  useEffect(() => {
    const initSettings = async () => {
      if (!authLoading) {
        if (user) {
          await loadUserSettings()
        } else {
          // Load from localStorage for non-authenticated users
          const savedCurrency = localStorage.getItem('currency') as Currency
          if (savedCurrency && ['USD', 'CAD', 'GBP'].includes(savedCurrency)) {
            setCurrencyState(savedCurrency)
          }
        }
        setIsLoading(false)
      }
    }
    initSettings()
  }, [user, authLoading])

  const loadUserSettings = async () => {
    try {
      if (!user) return

      if (user.role === 'consumer') {
        try {
          const settings = await userService.getConsumerSettings()
          if (settings && settings.currency && ['USD', 'CAD', 'GBP'].includes(settings.currency)) {
            setCurrencyState(settings.currency as Currency)
            // Also update localStorage to keep in sync
            localStorage.setItem('currency', settings.currency)
          }
          if (settings && settings.theme) {
            setTheme(settings.theme)
          }
        } catch (error: any) {
          // Only log non-404 errors (404 means profile doesn't exist yet, which is normal)
          if (!error.message?.includes('404') && !error.message?.includes('not found')) {
            console.error('Failed to load consumer settings, using localStorage:', error)
          }
          // Fallback to localStorage if API fails
          const savedCurrency = localStorage.getItem('currency') as Currency
          if (savedCurrency && ['USD', 'CAD', 'GBP'].includes(savedCurrency)) {
            setCurrencyState(savedCurrency)
          }
        }
      } else if (user.role === 'vendor') {
        try {
          const settings = await userService.getVendorSettings()
          if (settings && settings.currency && ['USD', 'CAD', 'GBP'].includes(settings.currency)) {
            setCurrencyState(settings.currency as Currency)
            // Also update localStorage to keep in sync
            localStorage.setItem('currency', settings.currency)
          }
          if (settings && settings.theme) {
            setTheme(settings.theme)
          }
        } catch (error: any) {
          // Only log non-404 errors (404 means profile doesn't exist yet, which is normal)
          if (!error.message?.includes('404') && !error.message?.includes('not found')) {
            console.error('Failed to load vendor settings, using localStorage:', error)
          }
          // Fallback to localStorage if API fails
          const savedTheme = localStorage.getItem('theme')
          if (savedTheme) {
            setTheme(savedTheme)
          }
          const savedCurrency = localStorage.getItem('currency') as Currency
          if (savedCurrency && ['USD', 'CAD', 'GBP'].includes(savedCurrency)) {
            setCurrencyState(savedCurrency)
          }
        }
      }
    } catch (error) {
      console.error('Failed to load user settings:', error)
      // Always fallback to localStorage
      const savedCurrency = localStorage.getItem('currency') as Currency
      if (savedCurrency && ['USD', 'CAD', 'GBP'].includes(savedCurrency)) {
        setCurrencyState(savedCurrency)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const setCurrency = async (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    localStorage.setItem('currency', newCurrency)

    // Update in backend if user is logged in
    if (user && !isUpdating) {
      setIsUpdating(true)
      try {
        if (user.role === 'consumer') {
          await userService.updateConsumerSettings({ currency: newCurrency })
          toast.success('Currency preference saved')
        } else if (user.role === 'vendor') {
          await userService.updateVendorSettings({ currency: newCurrency })
          toast.success('Currency preference saved')
        }
      } catch (error) {
        console.error('Failed to update currency:', error)
        toast.error('Failed to save currency preference')
      } finally {
        setIsUpdating(false)
      }
    }
  }

  const updateTheme = async (newTheme: string) => {
    setTheme(newTheme)
    
    // Update in backend if user is logged in
    if (user && !isUpdating) {
      setIsUpdating(true)
      try {
        const themeValue = newTheme as 'light' | 'dark'
        if (user.role === 'consumer') {
          await userService.updateConsumerSettings({ theme: themeValue })
          toast.success('Theme preference saved')
        } else if (user.role === 'vendor') {
          await userService.updateVendorSettings({ theme: themeValue })
          toast.success('Theme preference saved')
        }
      } catch (error) {
        console.error('Failed to update theme:', error)
        toast.error('Failed to save theme preference')
      } finally {
        setIsUpdating(false)
      }
    }
  }

  const value: SettingsContextType = {
    currency,
    setCurrency,
    updateTheme,
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}