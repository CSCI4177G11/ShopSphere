// Temporarily disabled NextAuth handlers due to build issues
// import { handlers } from "@/lib/auth"
// export const { GET, POST } = handlers

import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "NextAuth temporarily disabled" }, { status: 200 })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: "NextAuth temporarily disabled" }, { status: 200 })
} 