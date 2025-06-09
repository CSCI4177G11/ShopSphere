"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock,
  ArrowLeft,
  Send,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Zap,
  HeartHandshake
} from "lucide-react"
import Link from "next/link"

const contactMethods = [
  {
    id: "chat",
    title: "Live Chat",
    description: "Get instant help from our support team",
    icon: MessageCircle,
    availability: "Available 24/7",
    responseTime: "Usually responds within 2 minutes",
    color: "bg-blue-600",
    href: "#chat"
  },
  {
    id: "email",
    title: "Email Support",
    description: "Send us a detailed message",
    icon: Mail,
    availability: "24/7",
    responseTime: "Response within 2-4 hours",
    color: "bg-green-600",
    href: "mailto:support@shopsphere.com"
  },
  {
    id: "phone",
    title: "Phone Support",
    description: "Speak directly with our team",
    icon: Phone,
    availability: "Mon-Fri 9AM-6PM EST",
    responseTime: "Average wait time: 3 minutes",
    color: "bg-purple-600",
    href: "tel:+15551234567"
  }
]

const supportCategories = [
  "Order Issue",
  "Payment Problem", 
  "Shipping Question",
  "Return/Refund",
  "Account Help",
  "Product Information",
  "Technical Issue",
  "Other"
]

const priorities = [
  { value: "low", label: "Low - General inquiry", icon: HelpCircle },
  { value: "medium", label: "Medium - Need assistance", icon: AlertCircle },
  { value: "high", label: "High - Urgent issue", icon: Zap }
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderNumber: "",
    category: "",
    priority: "medium",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 2000)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50 text-red-700'
      case 'medium': return 'border-yellow-200 bg-yellow-50 text-yellow-700'
      case 'low': return 'border-green-200 bg-green-50 text-green-700'
      default: return 'border-gray-200 bg-gray-50 text-gray-700'
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-4"
        >
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for contacting us. We've received your message and will respond within 2-4 hours.
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Ticket ID:</span>
                    <span className="font-mono">SUP-{Date.now()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Priority:</span>
                    <Badge className={getPriorityColor(formData.priority)}>
                      {formData.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/help">Help Center</Link>
                </Button>
                <Button asChild>
                  <Link href="/">Continue Shopping</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/help">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Contact Support</h1>
              <p className="text-muted-foreground">
                We're here to help! Choose how you'd like to get in touch.
              </p>
            </div>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {contactMethods.map((method) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    {method.href.startsWith('#') ? (
                      <div className="text-center">
                        <div className={`w-12 h-12 ${method.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                          <method.icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-semibold mb-2">{method.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center justify-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{method.availability}</span>
                          </div>
                          <p>{method.responseTime}</p>
                        </div>
                        <Button className="w-full mt-4" disabled>
                          Start Chat (Demo)
                        </Button>
                      </div>
                    ) : (
                      <a href={method.href} className="block text-center">
                        <div className={`w-12 h-12 ${method.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                          <method.icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-semibold mb-2">{method.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center justify-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{method.availability}</span>
                          </div>
                          <p>{method.responseTime}</p>
                        </div>
                        <Button className="w-full mt-4">
                          {method.id === 'email' ? 'Send Email' : 'Call Now'}
                        </Button>
                      </a>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Send us a Message
              </CardTitle>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Full Name *</label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email Address *</label>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Order Number (optional)</label>
                    <Input
                      type="text"
                      placeholder="e.g. ORD-2024-001"
                      value={formData.orderNumber}
                      onChange={(e) => handleInputChange('orderNumber', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category *</label>
                    <select
                      className="w-full p-2 border border-border rounded-md bg-background"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      required
                    >
                      <option value="">Select a category</option>
                      {supportCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Priority Level</label>
                  <RadioGroup 
                    value={formData.priority} 
                    onValueChange={(value) => handleInputChange('priority', value)}
                  >
                    {priorities.map((priority) => (
                      <div key={priority.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={priority.value} id={priority.value} />
                        <Label htmlFor={priority.value} className="flex items-center gap-2">
                          <priority.icon className="h-4 w-4" />
                          {priority.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Subject *</label>
                  <Input
                    type="text"
                    placeholder="Brief description of your issue"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Message *</label>
                  <Textarea
                    placeholder="Please provide details about your issue or question..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    required
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <HeartHandshake className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                        Our Commitment to You
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-200">
                        We typically respond to all inquiries within 2-4 hours during business hours. 
                        For urgent issues, please call our support line.
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting || !formData.name || !formData.email || !formData.category || !formData.subject || !formData.message}
                  className="w-full"
                >
                  {isSubmitting ? "Sending Message..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* FAQ Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Before You Contact Us</CardTitle>
              <p className="text-muted-foreground">
                You might find your answer in our FAQ section.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/help" className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <h4 className="font-medium mb-1">Order Tracking</h4>
                  <p className="text-sm text-muted-foreground">How to track your order and delivery status</p>
                </Link>
                <Link href="/help" className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <h4 className="font-medium mb-1">Returns & Refunds</h4>
                  <p className="text-sm text-muted-foreground">Return policy and refund process</p>
                </Link>
                <Link href="/help" className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <h4 className="font-medium mb-1">Payment Issues</h4>
                  <p className="text-sm text-muted-foreground">Common payment problems and solutions</p>
                </Link>
                <Link href="/help" className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <h4 className="font-medium mb-1">Account Help</h4>
                  <p className="text-sm text-muted-foreground">Managing your account and settings</p>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 