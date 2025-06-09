"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Clock, 
  ThumbsUp, 
  ThumbsDown,
  Share,
  HelpCircle,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const helpArticles = {
  "how-to-create-an-account": {
    title: "How to create an account",
    category: "Getting Started",
    readTime: "3 min read",
    lastUpdated: "Dec 10, 2024",
    content: [
      {
        type: "paragraph",
        text: "Creating an account on ShopSphere is quick and easy. Follow these simple steps to get started and unlock all the features our platform has to offer."
      },
      {
        type: "steps",
        title: "Step-by-step guide:",
        items: [
          "Click the 'Sign Up' button in the top right corner of any page",
          "Choose your account type (Customer, Vendor, or Admin)",
          "Enter your email address and create a secure password",
          "Fill in your personal information (name, phone number, etc.)",
          "Verify your email address by clicking the link we send you",
          "Complete your profile by adding any additional information",
          "Start shopping or selling on our platform!"
        ]
      },
      {
        type: "tip",
        text: "Pro tip: Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and special characters for better security."
      }
    ]
  },
  "how-to-place-an-order": {
    title: "How to place an order",
    category: "Shopping & Orders",
    readTime: "4 min read",
    lastUpdated: "Dec 8, 2024",
    content: [
      {
        type: "paragraph",
        text: "Placing an order on ShopSphere is designed to be intuitive and secure. Here's everything you need to know about the ordering process."
      },
      {
        type: "steps",
        title: "Ordering process:",
        items: [
          "Browse products using search or category filters",
          "Click on a product to view detailed information",
          "Select your desired quantity and any product options",
          "Click 'Add to Cart' to add the item to your shopping cart",
          "Continue shopping or proceed to checkout",
          "Review your order details and shipping information",
          "Choose your payment method and complete the purchase",
          "Receive order confirmation via email"
        ]
      },
      {
        type: "warning",
        text: "Important: Make sure to review your order carefully before completing the purchase, as some items may not be eligible for returns."
      }
    ]
  },
  "payment-methods": {
    title: "Payment methods",
    category: "Payment & Billing",
    readTime: "2 min read",
    lastUpdated: "Dec 5, 2024",
    content: [
      {
        type: "paragraph",
        text: "ShopSphere accepts various payment methods to make your shopping experience convenient and secure."
      },
      {
        type: "list",
        title: "Accepted payment methods:",
        items: [
          "Credit Cards (Visa, MasterCard, American Express, Discover)",
          "Debit Cards",
          "PayPal",
          "Apple Pay",
          "Google Pay",
          "Shop Pay",
          "Bank Transfer (for large orders)"
        ]
      },
      {
        type: "paragraph",
        text: "All payments are processed securely using industry-standard encryption. We never store your complete payment information on our servers."
      }
    ]
  },
  "return-policy": {
    title: "Return policy", 
    category: "Returns & Exchanges",
    readTime: "5 min read",
    lastUpdated: "Dec 1, 2024",
    content: [
      {
        type: "paragraph",
        text: "We want you to be completely satisfied with your purchase. Our return policy is designed to be fair and straightforward."
      },
      {
        type: "steps",
        title: "Return process:",
        items: [
          "Items must be returned within 30 days of delivery",
          "Items must be in original condition with tags attached",
          "Log into your account and go to 'Order History'",
          "Select the order and click 'Return Items'",
          "Choose the items you want to return and the reason",
          "Print the prepaid return label we provide",
          "Package the items securely and ship them back",
          "Receive your refund within 3-5 business days"
        ]
      },
      {
        type: "warning",
        text: "Note: Some items like personalized products, perishables, and certain electronics may not be eligible for returns."
      }
    ]
  }
};

export default function HelpArticlePage({ params }: { params: { slug: string } }) {
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const article = helpArticles[params.slug as keyof typeof helpArticles];

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Article Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The help article you're looking for doesn't exist or has been moved.
            </p>
            <Button asChild>
              <Link href="/help">Back to Help Center</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleFeedback = (helpful: boolean) => {
    setIsHelpful(helpful);
    // In a real app, this would send feedback to the server
  };

  const renderContent = (content: any) => {
    switch (content.type) {
      case 'paragraph':
        return <p className="text-muted-foreground leading-relaxed">{content.text}</p>;
      
      case 'steps':
        return (
          <div>
            <h3 className="font-semibold mb-3">{content.title}</h3>
            <ol className="space-y-2">
              {content.items.map((step: string, index: number) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        );
      
      case 'list':
        return (
          <div>
            <h3 className="font-semibold mb-3">{content.title}</h3>
            <ul className="space-y-2">
              {content.items.map((item: string, index: number) => (
                <li key={index} className="flex gap-3">
                  <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      
      case 'tip':
        return (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-blue-800 dark:text-blue-200 text-sm">{content.text}</p>
          </div>
        );
      
      case 'warning':
        return (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">{content.text}</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/help">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{article.category}</Badge>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {article.readTime}
                </span>
              </div>
              <h1 className="text-3xl font-bold">{article.title}</h1>
              <p className="text-muted-foreground">
                Last updated: {article.lastUpdated}
              </p>
            </div>
          </div>

          {/* Article Content */}
          <Card>
            <CardContent className="p-8">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div className="space-y-6">
                  {article.content.map((content, index) => (
                    <div key={index}>
                      {renderContent(content)}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feedback Section */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="font-semibold mb-2">Was this article helpful?</h3>
                
                {isHelpful === null ? (
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => handleFeedback(true)}
                      className="flex items-center gap-2"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      Yes, helpful
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleFeedback(false)}
                      className="flex items-center gap-2"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      Not helpful
                    </Button>
                  </div>
                ) : (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-green-800 dark:text-green-200">
                      {isHelpful 
                        ? "Thank you for your feedback! We're glad this helped."
                        : "Thank you for your feedback. We'll work on improving this article."
                      }
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Related Articles */}
          <Card>
            <CardHeader>
              <CardTitle>Related Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(helpArticles)
                  .filter(([slug]) => slug !== params.slug)
                  .slice(0, 4)
                  .map(([slug, relatedArticle]) => (
                    <Link
                      key={slug}
                      href={`/help/article/${slug}`}
                      className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {relatedArticle.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {relatedArticle.readTime}
                        </span>
                      </div>
                      <h4 className="font-medium">{relatedArticle.title}</h4>
                    </Link>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Still need help?</h3>
              <p className="text-muted-foreground mb-4">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <Button asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 