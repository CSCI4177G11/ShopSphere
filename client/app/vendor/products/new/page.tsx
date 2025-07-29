"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { productService } from "@/lib/api/product-service"
import { userService } from "@/lib/api/user-service"
import { useAuth } from "@/components/auth-provider"
import { CURRENCY_SYMBOLS } from "@/lib/currency"
import type { Currency } from "@/components/settings-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { ArrowLeft, Upload, X, ImageIcon, Loader2, AlertCircle, Clock, CheckCircle2, Globe } from "lucide-react"

const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  stock: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Stock must be a non-negative number",
  }),
  category: z.string().min(1, "Please select a category"),
})

type ProductForm = z.infer<typeof productSchema>

const categories = [
  "electronics",
  "fashion",
  "home",
  "books",
  "sports",
  "accessories",
  "gaming",
  "art",
  "other"
]

// Convert price from any currency to CAD (base currency)
const convertToCAD = (price: number, fromCurrency: Currency): number => {
  if (fromCurrency === 'CAD') return price
  
  // Use the inverse of the rates in currency.ts
  // currency.ts: 1 CAD = 0.74 USD, so 1 USD = 1/0.74 CAD
  const exchangeRates: Record<Currency, number> = {
    CAD: 1.00,
    USD: 1 / 0.74,  // 1 USD = 1.3514 CAD
    GBP: 1 / 0.58,  // 1 GBP = 1.7241 CAD
  }
  
  return price * exchangeRates[fromCurrency]
}

export default function NewProductPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isCheckingApproval, setIsCheckingApproval] = useState(true)
  const [isApproved, setIsApproved] = useState<boolean | null>(null)
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('CAD')
  const [publishOnCreate, setPublishOnCreate] = useState(true)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
    }
  })

  const selectedCategory = watch("category")

  // Check vendor approval status on component mount
  useEffect(() => {
    const checkVendorApproval = async () => {
      if (!user?.userId) {
        setIsCheckingApproval(false)
        return
      }

      try {
        const response = await userService.getIsApproved(user.userId)
        setIsApproved(response.isApproved)
      } catch (error) {
        console.error('Failed to check vendor approval status:', error)
        toast.error("Failed to verify vendor status")
        setIsApproved(false)
      } finally {
        setIsCheckingApproval(false)
      }
    }

    checkVendorApproval()
  }, [user?.userId])

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newFiles = Array.from(files)
    const totalFiles = selectedImages.length + newFiles.length

    if (totalFiles > 5) {
      toast.error("You can upload maximum 5 images")
      return
    }

    // Validate file types
    const validFiles = newFiles.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`)
        return false
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    // Create preview URLs
    const newPreviews = validFiles.map(file => URL.createObjectURL(file))
    
    setSelectedImages([...selectedImages, ...validFiles])
    setImagePreviews([...imagePreviews, ...newPreviews])
  }

  const removeImage = (index: number) => {
    // Revoke the object URL to free memory
    URL.revokeObjectURL(imagePreviews[index])
    
    setSelectedImages(selectedImages.filter((_, i) => i !== index))
    setImagePreviews(imagePreviews.filter((_, i) => i !== index))
  }

  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = document.createElement('img')
        img.onload = () => {
          // Create canvas for compression
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')!
          
          // Calculate new dimensions (max 800px width/height)
          const maxSize = 800
          let width = img.width
          let height = img.height
          
          if (width > height && width > maxSize) {
            height = (height * maxSize) / width
            width = maxSize
          } else if (height > maxSize) {
            width = (width * maxSize) / height
            height = maxSize
          }
          
          canvas.width = width
          canvas.height = height
          
          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height)
          
          // Convert to base64 with compression
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7)
          resolve(compressedBase64)
        }
        img.src = e.target?.result as string
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const onSubmit = async (data: ProductForm) => {
    if (!user) {
      toast.error("You must be logged in to create products")
      return
    }

    if (!isApproved) {
      toast.error("Your vendor account must be approved before creating products")
      return
    }

    if (selectedImages.length === 0) {
      toast.error("Please upload at least one product image")
      return
    }

    setIsSubmitting(true)
    try {
      // Compress images before sending
      toast.info("Compressing images...")
      const compressedImages = await Promise.all(
        selectedImages.map(file => compressImage(file))
      )

      // Convert price to CAD before saving
      const priceInSelectedCurrency = parseFloat(data.price)
      const priceInCAD = convertToCAD(priceInSelectedCurrency, selectedCurrency)
      
      const createProductPayload = {
        name: data.name,
        description: data.description,
        price: priceInCAD,
        quantityInStock: parseInt(data.stock),
        category: data.category,
        vendorId: user.userId,
        vendorName: user.username,
        images: compressedImages,
        tags: [data.category], // Add category as a tag
        isPublished: publishOnCreate
      }
      
      console.log('Creating product with payload:', createProductPayload)
      console.log('isPublished value:', createProductPayload.isPublished)
      console.log('Stock quantity:', createProductPayload.quantityInStock)
      
      const response = await productService.createProduct(createProductPayload)
      console.log('Product created successfully:', response)

      toast.success(`Product created successfully! Published: ${publishOnCreate ? 'Yes' : 'No'}`)
      router.push("/vendor/products")
    } catch (error: any) {
      console.error('Failed to create product:', error)
      console.error('Error details:', error.response || error)
      
      // More detailed error message with specific validation errors
      let errorMessage = ""
      
      if (error.response?.data?.error) {
        const serverError = error.response.data.error
        
        // Check for specific validation errors
        if (serverError === 'Invalid request data') {
          // Common validation issues
          if (parseInt(data.stock) < 0) {
            errorMessage = "Stock quantity cannot be negative"
          } else if (parseFloat(data.price) <= 0) {
            errorMessage = "Price must be greater than 0"
          } else if (!data.name || data.name.length < 3) {
            errorMessage = "Product name must be at least 3 characters"
          } else if (!data.description || data.description.length < 10) {
            errorMessage = "Description must be at least 10 characters"
          } else {
            errorMessage = "Please check all fields are filled correctly. Stock can be 0 for out-of-stock items."
          }
        } else {
          errorMessage = serverError
        }
      } else if (error.message) {
        errorMessage = error.message
      } else {
        errorMessage = "Failed to create product. Please check all fields and try again."
      }
      
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state while checking approval
  if (isCheckingApproval) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Verifying vendor status...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show approval required message if not approved
  if (isApproved === false) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="mb-8">
              <Link href="/vendor/products">
                <Button variant="ghost" size="sm" className="mb-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Products
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Add New Product</h1>
              <p className="text-muted-foreground">Fill in the details to list a new product</p>
            </div>

            {/* Approval Required Alert */}
            <Card className="max-w-2xl mx-auto">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                    <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Vendor Approval Required</h3>
                    <p className="text-muted-foreground mb-6">
                      Your vendor account is currently pending approval. You'll be able to create and list products once your account has been approved by our team.
                    </p>
                  </div>
                  <Alert className="text-left">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>What happens next?</strong>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li>• Our team will review your vendor application</li>
                        <li>• You'll receive an email notification once approved</li>
                        <li>• Approval typically takes 1-3 business days</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                  <div className="flex gap-3 justify-center">
                    <Button 
                      onClick={() => router.push("/vendor/")}
                      variant="default"
                    >
                      Go to Dashboard
                    </Button>
                    <Button 
                      onClick={() => router.push("/vendor/profile")}
                      variant="outline"
                    >
                      Update Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  // Show the form if approved
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <Link href="/vendor/products">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Button>
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">Add New Product</h1>
              <div className="flex items-center gap-1 text-green-600 dark:text-green-500">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">Approved Vendor</span>
              </div>
            </div>
            <p className="text-muted-foreground">Fill in the details to list a new product</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Product Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        {...register("name")}
                        placeholder="Enter product name"
                        disabled={isSubmitting}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        {...register("description")}
                        placeholder="Describe your product..."
                        rows={5}
                        disabled={isSubmitting}
                      />
                      {errors.description && (
                        <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={selectedCategory}
                        onValueChange={(value) => setValue("category", value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              <span className="capitalize">{category}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-sm text-destructive mt-1">{errors.category.message}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing & Inventory */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing & Inventory</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price</Label>
                        <div className="flex gap-2">
                          <Select
                            value={selectedCurrency}
                            onValueChange={(value) => setSelectedCurrency(value as Currency)}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger className="w-[100px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CAD">
                                <span className="flex items-center gap-1">
                                  <span className="font-mono">{CURRENCY_SYMBOLS.CAD}</span>
                                  <span>CAD</span>
                                </span>
                              </SelectItem>
                              <SelectItem value="USD">
                                <span className="flex items-center gap-1">
                                  <span className="font-mono">{CURRENCY_SYMBOLS.USD}</span>
                                  <span>USD</span>
                                </span>
                              </SelectItem>
                              <SelectItem value="GBP">
                                <span className="flex items-center gap-1">
                                  <span className="font-mono">{CURRENCY_SYMBOLS.GBP}</span>
                                  <span>GBP</span>
                                </span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            {...register("price")}
                            placeholder="0.00"
                            disabled={isSubmitting}
                            className="flex-1"
                          />
                        </div>
                        {errors.price && (
                          <p className="text-sm text-destructive mt-1">{errors.price.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="stock">Stock Quantity</Label>
                        <Input
                          id="stock"
                          type="number"
                          {...register("stock")}
                          placeholder="0"
                          disabled={isSubmitting}
                        />
                        {errors.stock && (
                          <p className="text-sm text-destructive mt-1">{errors.stock.message}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Enter 0 for out-of-stock items
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Product Images */}
                <Card>
                  <CardHeader>
                    <CardTitle>Product Images</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Image Upload Area */}
                      <div className="relative">
                        <input
                          type="file"
                          id="image-upload"
                          accept="image/*"
                          multiple
                          onChange={handleImageSelect}
                          disabled={isSubmitting || selectedImages.length >= 5}
                          className="hidden"
                        />
                        <label
                          htmlFor="image-upload"
                          className={`block border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                            isSubmitting || selectedImages.length >= 5
                              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                              : 'border-gray-300 hover:border-primary hover:bg-primary/5'
                          }`}
                        >
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm font-medium">
                            {selectedImages.length >= 5
                              ? 'Maximum 5 images allowed'
                              : 'Click to upload images'
                            }
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG up to 5MB each
                          </p>
                        </label>
                      </div>

                      {/* Image Previews */}
                      {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                                <Image
                                  src={preview}
                                  alt={`Product image ${index + 1}`}
                                  fill
                                  sizes="100px"
                                  className="object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                disabled={isSubmitting}
                              >
                                <X className="h-4 w-4" />
                              </button>
                              {index === 0 && (
                                <span className="absolute bottom-1 left-1 text-xs bg-black/70 text-white px-2 py-1 rounded">
                                  Main
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground">
                        First image will be used as the main product image
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Publication Options */}
                <Card>
                  <CardHeader>
                    <CardTitle>Publication Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="publish-toggle" className="text-sm font-normal cursor-pointer">
                          Publish immediately
                        </Label>
                      </div>
                      <Switch
                        id="publish-toggle"
                        checked={publishOnCreate}
                        onCheckedChange={setPublishOnCreate}
                        disabled={isSubmitting}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {publishOnCreate 
                        ? "Product will be visible to customers immediately" 
                        : "Product will be saved as draft and hidden from customers"}
                    </p>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardContent className="pt-6 space-y-3">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Product"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push("/vendor/products")}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}