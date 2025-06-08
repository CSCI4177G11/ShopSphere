"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface MockUser {
  id: string
  name: string
  email: string
  avatar?: string
  image?: string
  role?: string
}

interface MockAuthContextType {
  isAuthenticated: boolean
  user: MockUser | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
  toggleAuthMode: () => void // For easy testing
  updateUser: (updatedUser: MockUser) => void
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined)

// Mock user data for testing
const mockUser: MockUser = {
  id: "mock-user-1",
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  role: "user"
}

interface MockAuthProviderProps {
  children: ReactNode
  enableMockMode?: boolean // Set to true for testing
}

export function MockAuthProvider({ children, enableMockMode = true }: MockAuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<MockUser | null>(null)

  // Load auth state from localStorage on mount
  useEffect(() => {
    if (enableMockMode) {
      const savedAuthState = localStorage.getItem("mock-auth-state")
      if (savedAuthState === "authenticated") {
        setIsAuthenticated(true)
        
        // Load updated user data if available
        const savedUserData = localStorage.getItem("mock-user-data")
        const userData = savedUserData ? JSON.parse(savedUserData) : mockUser
        setUser(userData)
      }
    }
  }, [enableMockMode])

  const signIn = async (email: string, password: string) => {
    // Mock sign in - always succeeds for testing
    setIsAuthenticated(true)
    setUser(mockUser)
    if (enableMockMode) {
      localStorage.setItem("mock-auth-state", "authenticated")
    }
  }

  const signOut = () => {
    setIsAuthenticated(false)
    setUser(null)
    if (enableMockMode) {
      localStorage.removeItem("mock-auth-state")
    }
  }

  const toggleAuthMode = () => {
    if (isAuthenticated) {
      signOut()
    } else {
      signIn("", "") // Auto sign in for testing
    }
  }

  const updateUser = (updatedUser: MockUser) => {
    setUser(updatedUser)
    if (enableMockMode) {
      localStorage.setItem("mock-user-data", JSON.stringify(updatedUser))
    }
  }

  const value = {
    isAuthenticated,
    user,
    signIn,
    signOut,
    toggleAuthMode,
    updateUser
  }

  if (!enableMockMode) {
    return <>{children}</>
  }

  return (
    <MockAuthContext.Provider value={value}>
      {children}
    </MockAuthContext.Provider>
  )
}

export function useMockAuth() {
  const context = useContext(MockAuthContext)
  if (context === undefined) {
    throw new Error("useMockAuth must be used within a MockAuthProvider")
  }
  return context
}

// Hook that combines NextAuth session with mock auth for testing
export function useAuthSession() {
  const mockAuth = useContext(MockAuthContext)
  
  // If mock mode is enabled, return mock session
  if (mockAuth) {
    return {
      data: mockAuth.isAuthenticated ? {
        user: mockAuth.user,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
      } : null,
      status: "authenticated" as const
    }
  }

  // Fallback to NextAuth - you would import and use useSession here
  // For now, return null to indicate no session
  return {
    data: null,
    status: "unauthenticated" as const
  }
} 