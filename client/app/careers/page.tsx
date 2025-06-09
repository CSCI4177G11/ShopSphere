"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Briefcase, 
  Heart, 
  Zap, 
  Award,
  ExternalLink,
  Calendar
} from "lucide-react"
import Link from "next/link"

export default function CareersPage() {
  const jobOpenings = [
    {
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $160k",
      posted: "2 days ago",
      description: "Build beautiful, responsive user interfaces for our marketplace platform.",
      requirements: ["React", "TypeScript", "Next.js", "Tailwind CSS"]
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "Remote",
      type: "Full-time", 
      salary: "$130k - $170k",
      posted: "1 week ago",
      description: "Lead product strategy and roadmap for our seller tools and analytics.",
      requirements: ["Product Management", "Analytics", "A/B Testing", "SQL"]
    },
    {
      title: "DevOps Engineer",
      department: "Engineering",
      location: "New York, NY",
      type: "Full-time",
      salary: "$110k - $150k",
      posted: "3 days ago",
      description: "Scale our infrastructure to support millions of users worldwide.",
      requirements: ["AWS", "Kubernetes", "Docker", "Terraform"]
    },
    {
      title: "UX Designer",
      department: "Design",
      location: "Los Angeles, CA",
      type: "Full-time",
      salary: "$90k - $120k",
      posted: "1 week ago",
      description: "Design intuitive experiences that delight our users and sellers.",
      requirements: ["Figma", "User Research", "Prototyping", "Design Systems"]
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time",
      salary: "$70k - $90k",
      posted: "5 days ago",
      description: "Help our sellers succeed and grow their businesses on our platform.",
      requirements: ["Customer Success", "Communication", "Analytics", "CRM"]
    },
  ]

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health, dental, and vision insurance"
    },
    {
      icon: DollarSign,
      title: "Competitive Salary",
      description: "Market-leading compensation with equity options"
    },
    {
      icon: Clock,
      title: "Flexible Hours",
      description: "Work-life balance with flexible scheduling"
    },
    {
      icon: Users,
      title: "Great Team",
      description: "Work with talented, passionate people"
    },
    {
      icon: Zap,
      title: "Growth Opportunities",
      description: "Learn new skills and advance your career"
    },
    {
      icon: Award,
      title: "Recognition",
      description: "Regular recognition and performance bonuses"
    },
  ]

  const departments = [
    { name: "Engineering", count: 12, color: "bg-blue-600" },
    { name: "Product", count: 8, color: "bg-green-600" },
    { name: "Design", count: 5, color: "bg-purple-600" },
    { name: "Marketing", count: 6, color: "bg-orange-600" },
    { name: "Sales", count: 4, color: "bg-red-600" },
    { name: "Customer Success", count: 7, color: "bg-teal-600" },
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
                <Briefcase className="h-10 w-10 text-primary-foreground" />
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              Join Our Team
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Help us build the future of e-commerce. Join a team that's passionate about connecting buyers and sellers worldwide.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Badge variant="secondary" className="px-4 py-2">
                Remote-first culture
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                Competitive benefits
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                Growth opportunities
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: "Team Members", value: "250+" },
              { label: "Open Positions", value: "15" },
              { label: "Countries", value: "25" },
              { label: "Retention Rate", value: "95%" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Departments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Open Positions by Department</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {departments.map((dept, index) => (
                <motion.div
                  key={dept.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm text-center hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className={`w-8 h-8 ${dept.color} rounded-lg mx-auto mb-3`}></div>
                      <div className="font-medium text-sm">{dept.name}</div>
                      <div className="text-xs text-muted-foreground">{dept.count} openings</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Why Work With Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <benefit.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">{benefit.title}</h3>
                          <p className="text-sm text-muted-foreground">{benefit.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Job Openings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Current Openings</h2>
            <div className="space-y-6">
              {jobOpenings.map((job, index) => (
                <motion.div
                  key={job.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {job.department}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {job.type}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {job.salary}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Posted {job.posted}
                            </span>
                          </div>
                        </div>
                        <Button className="lg:w-auto w-full">
                          Apply Now
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{job.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.map((req, reqIndex) => (
                          <Badge key={reqIndex} variant="secondary" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm text-center">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Don't see the right role?</h2>
                <p className="text-muted-foreground mb-6">
                  We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.
                </p>
                <Button size="lg" asChild>
                  <Link href="/contact">
                    Send us your resume
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 