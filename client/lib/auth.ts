import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { z } from "zod"

// Types for user roles
export type UserRole = "consumer" | "vendor" | "admin"

// Validation schema for credentials
const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

// Mock user data - replace with actual database calls
const mockUsers = [
  {
    id: "1",
    email: "consumer@example.com",
    password: "password123",
    name: "John Consumer",
    role: "consumer" as UserRole,
  },
  {
    id: "2", 
    email: "vendor@example.com",
    password: "password123",
    name: "Jane Vendor",
    role: "vendor" as UserRole,
  },
  {
    id: "3",
    email: "admin@example.com", 
    password: "password123",
    name: "Admin User",
    role: "admin" as UserRole,
  },
]

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validated = credentialsSchema.safeParse(credentials)
        
        if (!validated.success) {
          return null
        }

        const { email, password } = validated.data

        // Mock authentication - replace with actual database lookup
        const user = mockUsers.find(
          (u) => u.email === email && u.password === password
        )

        if (!user) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as UserRole
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
})

// Helper function to check user permissions
export async function hasPermission(
  requiredRole: UserRole | UserRole[]
): Promise<boolean> {
  const session = await auth()
  
  if (!session?.user?.role) {
    return false
  }

  const userRole = session.user.role as UserRole
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
  
  // Admin has access to everything
  if (userRole === "admin") {
    return true
  }
  
  return roles.includes(userRole)
}
