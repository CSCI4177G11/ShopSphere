"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, ShoppingBag, Globe, Award, Target, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                <span className="text-primary-foreground font-bold text-3xl">SS</span>
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              About ShopSphere
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your trusted marketplace connecting millions of shoppers with amazing products from verified sellers worldwide.
            </p>
          </div>

          {/* Mission */}
          <Card className="mb-12 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe that shopping should be simple, secure, and enjoyable. Our mission is to create a platform where buyers can discover incredible products with confidence, and sellers can grow their businesses with the tools and support they need to succeed.
              </p>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Users, label: "Active Users", value: "2M+" },
              { icon: ShoppingBag, label: "Products", value: "500K+" },
              { icon: Globe, label: "Countries", value: "50+" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <stat.icon className="h-8 w-8 mx-auto mb-4 text-primary" />
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Values */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Our Values</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Trust & Security",
                    description: "Every transaction is protected with industry-leading security measures."
                  },
                  {
                    title: "Quality First",
                    description: "We carefully vet all sellers to ensure the highest quality products."
                  },
                  {
                    title: "Customer Focus",
                    description: "Your satisfaction is our priority, with 24/7 customer support."
                  },
                  {
                    title: "Innovation",
                    description: "We continuously improve our platform to enhance your experience."
                  }
                ].map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="p-6 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 