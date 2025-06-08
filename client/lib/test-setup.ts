import type React from "react"
import "@testing-library/jest-dom"
import { server } from "./msw/server"
import { jest, beforeAll, afterAll, afterEach } from "@jest/globals"

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }))

// Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test
afterEach(() => server.resetHandlers())

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}))

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: null,
    status: "unauthenticated",
  }),
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: "div",
    span: "span",
    button: "button",
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}))
