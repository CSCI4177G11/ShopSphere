"use client"

import { Suspense } from "react"
import { motion } from "framer-motion"
import { Hero } from "@/components/home/hero"
import { Newsletter } from "@/components/home/newsletter"

export default function HomePage() {
  return (
    <div className="w-full">
      <Hero />

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  )
}
