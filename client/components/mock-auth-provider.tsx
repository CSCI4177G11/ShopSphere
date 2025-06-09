"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface MockUser {
  id: string
  name: string
  email: string
  role: "consumer" | "vendor" | "admin"
  image?: string
}

interface MockAuthContextType {
  user: MockUser | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  switchRole: (role: "consumer" | "vendor" | "admin") => void
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined)

const mockUsers: Record<string, MockUser> = {
  consumer: {
    id: "user_1",
    name: "John Doe",
    email: "john@example.com",
    role: "consumer",
  },
  vendor: {
    id: "vendor_1", 
    name: "John Smith",
    email: "john@techstore.com",
    role: "vendor",
  },
  admin: {
    id: "admin_1",
    name: "Admin User", 
    email: "admin@shopsphere.com",
    role: "admin",
  }
}

interface MockAuthProviderProps {
  children: React.ReactNode
  enableMockMode?: boolean
}

export function MockAuthProvider({ children, enableMockMode = false }: MockAuthProviderProps) {
  const [user, setUser] = useState<MockUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (enableMockMode) {
      // Auto-login as consumer for development
      const savedUser = localStorage.getItem("mock-auth-user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      } else {
        setUser(mockUsers.consumer)
        localStorage.setItem("mock-auth-user", JSON.stringify(mockUsers.consumer))
      }
    }
    setIsLoading(false)
  }, [enableMockMode])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    // Mock sign in - find user by email or default to consumer
    const user = Object.values(mockUsers).find(u => u.email === email) || mockUsers.consumer
    setUser(user)
    localStorage.setItem("mock-auth-user", JSON.stringify(user))
    setIsLoading(false)
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem("mock-auth-user")
  }

  const switchRole = (role: "consumer" | "vendor" | "admin") => {
    const newUser = mockUsers[role]
    setUser(newUser)
    localStorage.setItem("mock-auth-user", JSON.stringify(newUser))
  }

  if (!enableMockMode) {
    return <>{children}</>
  }

  return (
    <MockAuthContext.Provider value={{ user, isLoading, signIn, signOut, switchRole }}>
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

export function useAuthSession() {
  const mockAuth = useMockAuth()
  return {
    data: mockAuth.user ? {
      user: mockAuth.user,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    } : null,
    status: mockAuth.isLoading ? "loading" : mockAuth.user ? "authenticated" : "unauthenticated"
  }
} 