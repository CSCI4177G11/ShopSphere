"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  HelpCircle, 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  RotateCcw, 
  Shield, 
  MessageCircle,
  Phone,
  Mail,
  ExternalLink
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const helpCategories = [
    {
      title: "Getting Started",
      icon: HelpCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      articles: [
        "How to create an account",
        "Setting up your profile",
        "Navigating the marketplace",
        "Finding products",
      ]
    },
    {
      title: "Shopping & Orders",
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      articles: [
        "How to place an order",
        "Tracking your order",
        "Canceling an order",
        "Order history",
      ]
    },
    {
      title: "Payment & Billing",
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      articles: [
        "Payment methods",
        "Billing information",
        "Refunds and credits",
        "Payment security",
      ]
    },
    {
      title: "Shipping & Delivery",
      icon: Truck,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      articles: [
        "Shipping options",
        "Delivery timeframes",
        "International shipping",
        "Delivery issues",
      ]
    },
    {
      title: "Returns & Exchanges",
      icon: RotateCcw,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20",
      articles: [
        "Return policy",
        "How to return an item",
        "Exchange process",
        "Return status",
      ]
    },
    {
      title: "Account & Security",
      icon: Shield,
      color: "text-teal-600",
      bgColor: "bg-teal-100 dark:bg-teal-900/20",
      articles: [
        "Account security",
        "Password management",
        "Privacy settings",
        "Two-factor authentication",
      ]
    },
  ]

  const quickActions = [
    {
      title: "Track Order",
      description: "Check the status of your order",
      icon: Truck,
      href: "/track-order",
      color: "bg-blue-600"
    },
    {
      title: "Return Item",
      description: "Start a return process",
      icon: RotateCcw,
      href: "/returns",
      color: "bg-green-600"
    },
    {
      title: "Contact Support",
      description: "Get help from our team",
      icon: MessageCircle,
      href: "/contact",
      color: "bg-purple-600"
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
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
                <HelpCircle className="h-10 w-10 text-primary-foreground" />
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              Help Center
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find answers to your questions and get the support you need.
            </p>
          </div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search for help articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 text-lg"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="secondary">Order tracking</Badge>
                  <Badge variant="secondary">Refunds</Badge>
                  <Badge variant="secondary">Account issues</Badge>
                  <Badge variant="secondary">Payment problems</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <Link href={action.href}>
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <action.icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{action.title}</h3>
                            <p className="text-sm text-muted-foreground">{action.description}</p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Help Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Browse by Topic</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {helpCategories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${category.bgColor} rounded-lg flex items-center justify-center`}>
                          <category.icon className={`h-5 w-5 ${category.color}`} />
                        </div>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {category.articles.map((article, articleIndex) => (
                          <li key={articleIndex}>
                            <Link 
                              href={`/help/article/${article.toLowerCase().replace(/\s+/g, '-')}`}
                              className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                              {article}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Still Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Can't find what you're looking for? Our support team is here to help you 24/7.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="justify-start h-auto p-4" asChild>
                    <Link href="/contact">
                      <div className="flex items-center gap-3">
                        <MessageCircle className="h-5 w-5 text-blue-600" />
                        <div className="text-left">
                          <div className="font-medium">Live Chat</div>
                          <div className="text-xs text-muted-foreground">Available 24/7</div>
                        </div>
                      </div>
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="justify-start h-auto p-4" asChild>
                    <a href="mailto:support@shopsphere.com">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-green-600" />
                        <div className="text-left">
                          <div className="font-medium">Email Support</div>
                          <div className="text-xs text-muted-foreground">Response in 2-4 hours</div>
                        </div>
                      </div>
                    </a>
                  </Button>
                  
                  <Button variant="outline" className="justify-start h-auto p-4" asChild>
                    <a href="tel:+15551234567">
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-purple-600" />
                        <div className="text-left">
                          <div className="font-medium">Phone Support</div>
                          <div className="text-xs text-muted-foreground">Mon-Fri 9AM-6PM</div>
                        </div>
                      </div>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 