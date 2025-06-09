"use client";

export const dynamic = 'force-static';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { vendorProducts } from "@/lib/mock-data/vendorDashboard";
import { 
  Package, 
  Plus, 
  Edit, 
  DollarSign, 
  AlertTriangle, 
  Search, 
  Filter,
  Eye,
  Star,
  TrendingUp,
  BarChart3,
  Image,
  Upload,
  X,
  Camera,
  Tag,
  FileText,
  Settings,
  Truck,
  Shield,
  Info
} from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Extended product interface
interface ExtendedProduct {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  published: boolean;
  sales: number;
  description?: string;
  images?: string[];
  specifications?: Record<string, string>;
  tags?: string[];
  sku?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  shipping?: {
    free: boolean;
    weight: number;
    cost: number;
  };
  warranty?: string;
  brand?: string;
}

export default function VendorProducts() {
  const [products, setProducts] = useState<ExtendedProduct[]>(vendorProducts.map(p => ({
    ...p,
    description: "High-quality product with excellent features and performance.",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"],
    specifications: { "Brand": "TechStore", "Model": "TSK-001", "Warranty": "1 Year" },
    tags: ["electronics", "premium"],
    sku: `SKU-${p.id}`,
    weight: 0.5,
    dimensions: { length: 10, width: 8, height: 3 },
    shipping: { free: true, weight: 0.5, cost: 0 },
    warranty: "1 Year Limited Warranty",
    brand: "TechStore"
  })));
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isViewProductOpen, setIsViewProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ExtendedProduct | null>(null);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [restockQuantity, setRestockQuantity] = useState<number>(0);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    published: true,
    images: [] as string[],
    specifications: {} as Record<string, string>,
    tags: [] as string[],
    sku: "",
    weight: "",
    dimensions: { length: "", width: "", height: "" },
    shipping: { free: true, weight: "", cost: "" },
    warranty: "",
    brand: ""
  });

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
      const matchesStock = 
        stockFilter === "all" || 
        (stockFilter === "in-stock" && product.stock > 10) ||
        (stockFilter === "low-stock" && product.stock > 0 && product.stock <= 10) ||
        (stockFilter === "out-of-stock" && product.stock === 0);
      
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchTerm, categoryFilter, stockFilter]);

  const togglePublished = (productId: number) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, published: !product.published }
          : product
      )
    );
  };

  const handleAddProduct = () => {
    const product: ExtendedProduct = {
      id: Date.now(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      category: newProduct.category,
      published: newProduct.published,
      sales: 0,
      description: newProduct.description,
      images: newProduct.images,
      specifications: newProduct.specifications,
      tags: newProduct.tags,
      sku: newProduct.sku || `SKU-${Date.now()}`,
      weight: parseFloat(newProduct.weight) || 0,
      dimensions: {
        length: parseFloat(newProduct.dimensions.length) || 0,
        width: parseFloat(newProduct.dimensions.width) || 0,
        height: parseFloat(newProduct.dimensions.height) || 0
      },
      shipping: {
        free: newProduct.shipping.free,
        weight: parseFloat(newProduct.shipping.weight) || 0,
        cost: parseFloat(newProduct.shipping.cost) || 0
      },
      warranty: newProduct.warranty,
      brand: newProduct.brand
    };

    setProducts(prev => [product, ...prev]);
    setNewProduct({
      name: "",
      price: "",
      stock: "",
      category: "",
      description: "",
      published: true,
      images: [],
      specifications: {},
      tags: [],
      sku: "",
      weight: "",
      dimensions: { length: "", width: "", height: "" },
      shipping: { free: true, weight: "", cost: "" },
      warranty: "",
      brand: ""
    });
    setIsAddProductOpen(false);
  };

  const handleEditProduct = () => {
    if (!selectedProduct) return;
    
    setProducts(prev => 
      prev.map(product => 
        product.id === selectedProduct.id 
          ? { ...selectedProduct }
          : product
      )
    );
    setIsEditProductOpen(false);
    setSelectedProduct(null);
  };

  const handleViewProduct = (product: ExtendedProduct) => {
    setSelectedProduct(product);
    setIsViewProductOpen(true);
  };

  const handleEditProductClick = (product: ExtendedProduct) => {
    setSelectedProduct(product);
    setIsEditProductOpen(true);
  };

  const handleInventoryManagement = () => {
    setIsInventoryModalOpen(true);
  };

  const handleRestockProduct = (product: ExtendedProduct) => {
    setSelectedProduct(product);
    setRestockQuantity(0);
    setIsRestockModalOpen(true);
  };

  const handleConfirmRestock = () => {
    if (selectedProduct && restockQuantity > 0) {
      setProducts(prev => 
        prev.map(product => 
          product.id === selectedProduct.id 
            ? { ...product, stock: product.stock + restockQuantity }
            : product
        )
      );
      setIsRestockModalOpen(false);
      setSelectedProduct(null);
      setRestockQuantity(0);
    }
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts(prev => prev.filter(product => product.id !== productId));
  };

  const addImage = (url: string, isEdit = false) => {
    if (isEdit && selectedProduct) {
      setSelectedProduct(prev => prev ? {
        ...prev,
        images: [...(prev.images || []), url]
      } : null);
    } else {
      setNewProduct(prev => ({
        ...prev,
        images: [...prev.images, url]
      }));
    }
  };

  const removeImage = (index: number, isEdit = false) => {
    if (isEdit && selectedProduct) {
      setSelectedProduct(prev => prev ? {
        ...prev,
        images: prev.images?.filter((_, i) => i !== index) || []
      } : null);
    } else {
      setNewProduct(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  const addSpecification = (key: string, value: string, isEdit = false) => {
    if (isEdit && selectedProduct) {
      setSelectedProduct(prev => prev ? {
        ...prev,
        specifications: { ...(prev.specifications || {}), [key]: value }
      } : null);
    } else {
      setNewProduct(prev => ({
        ...prev,
        specifications: { ...prev.specifications, [key]: value }
      }));
    }
  };

  const addTag = (tag: string, isEdit = false) => {
    if (isEdit && selectedProduct) {
      setSelectedProduct(prev => prev ? {
        ...prev,
        tags: [...(prev.tags || []), tag]
      } : null);
    } else {
      setNewProduct(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>;
    if (stock < 10) return <Badge className="bg-yellow-600 text-white">Low Stock</Badge>;
    return <Badge className="bg-green-600 text-white">In Stock</Badge>;
  };

  const getPerformanceBadge = (sales: number) => {
    if (sales > 100) return <Badge className="bg-purple-600 text-white">Top Seller</Badge>;
    if (sales > 50) return <Badge className="bg-blue-600 text-white">Popular</Badge>;
    if (sales > 10) return <Badge variant="secondary">Good</Badge>;
    return <Badge variant="outline">New</Badge>;
  };

  const getProductStats = () => {
    return {
      total: products.length,
      published: products.filter(p => p.published).length,
      inStock: products.filter(p => p.stock > 10).length,
      lowStock: products.filter(p => p.stock > 0 && p.stock <= 10).length,
      outOfStock: products.filter(p => p.stock === 0).length,
    };
  };

  const stats = getProductStats();
  const categories = [...new Set(products.map(p => p.category))];

  const ProductForm = ({ isEdit = false }: { isEdit?: boolean }) => {
    const data = isEdit ? selectedProduct : newProduct;
    const setData = isEdit ? setSelectedProduct : setNewProduct;

    return (
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                placeholder="Enter product name"
                value={data?.name || ""}
                onChange={(e) => setData(prev => ({ ...(prev || {}), name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                placeholder="Product SKU"
                value={data?.sku || ""}
                onChange={(e) => setData(prev => ({ ...(prev || {}), sku: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={data?.category || ""} 
                onValueChange={(value) => setData(prev => ({ ...(prev || {}), category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                  <SelectItem value="Cables">Cables</SelectItem>
                  <SelectItem value="Audio">Audio</SelectItem>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                placeholder="Product brand"
                value={data?.brand || ""}
                onChange={(e) => setData(prev => ({ ...(prev || {}), brand: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="0.0"
                value={data?.weight || ""}
                onChange={(e) => setData(prev => ({ ...(prev || {}), weight: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={data?.price || ""}
                onChange={(e) => setData(prev => ({ ...(prev || {}), price: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                placeholder="0"
                value={data?.stock || ""}
                onChange={(e) => setData(prev => ({ ...(prev || {}), stock: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter detailed product description"
              value={data?.description || ""}
              onChange={(e) => setData(prev => ({ ...(prev || {}), description: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="warranty">Warranty</Label>
            <Input
              id="warranty"
              placeholder="e.g., 1 Year Limited Warranty"
              value={data?.warranty || ""}
              onChange={(e) => setData(prev => ({ ...(prev || {}), warranty: e.target.value }))}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={data?.published || false}
              onCheckedChange={(checked) => setData(prev => ({ ...(prev || {}), published: checked }))}
            />
            <Label htmlFor="published">Publish immediately</Label>
          </div>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              <Label>Product Images</Label>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="imageUrl"
                    placeholder="https://example.com/image.jpg"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const url = e.currentTarget.value;
                        if (url) {
                          addImage(url, isEdit);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                  <Button type="button" variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {(data?.images || []).map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index, isEdit)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          {/* Specifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <Label>Specifications</Label>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Specification name" id="spec-key" />
              <div className="flex gap-2">
                <Input placeholder="Specification value" id="spec-value" />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    const key = (document.getElementById('spec-key') as HTMLInputElement)?.value;
                    const value = (document.getElementById('spec-value') as HTMLInputElement)?.value;
                    if (key && value) {
                      addSpecification(key, value, isEdit);
                      (document.getElementById('spec-key') as HTMLInputElement).value = '';
                      (document.getElementById('spec-value') as HTMLInputElement).value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {Object.entries(data?.specifications || {}).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="font-medium">{key}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              <Label>Tags</Label>
            </div>
            
            <div className="flex gap-2">
              <Input placeholder="Add tag" id="tag-input" />
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  const tag = (document.getElementById('tag-input') as HTMLInputElement)?.value;
                  if (tag) {
                    addTag(tag, isEdit);
                    (document.getElementById('tag-input') as HTMLInputElement).value = '';
                  }
                }}
              >
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {(data?.tags || []).map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Dimensions */}
          <div className="space-y-4">
            <Label>Dimensions (cm)</Label>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="length">Length</Label>
                <Input
                  id="length"
                  type="number"
                  placeholder="0"
                  value={data?.dimensions?.length || ""}
                  onChange={(e) => setData(prev => ({ 
                    ...(prev || {}), 
                    dimensions: { ...(prev?.dimensions || {}), length: e.target.value }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  type="number"
                  placeholder="0"
                  value={data?.dimensions?.width || ""}
                  onChange={(e) => setData(prev => ({ 
                    ...(prev || {}), 
                    dimensions: { ...(prev?.dimensions || {}), width: e.target.value }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="0"
                  value={data?.dimensions?.height || ""}
                  onChange={(e) => setData(prev => ({ 
                    ...(prev || {}), 
                    dimensions: { ...(prev?.dimensions || {}), height: e.target.value }
                  }))}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="h-5 w-5" />
            <Label>Shipping Information</Label>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="freeShipping"
                checked={data?.shipping?.free || false}
                onCheckedChange={(checked) => setData(prev => ({ 
                  ...(prev || {}), 
                  shipping: { ...(prev?.shipping || {}), free: checked }
                }))}
              />
              <Label htmlFor="freeShipping">Free shipping</Label>
            </div>

            {!data?.shipping?.free && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="shippingWeight">Shipping Weight (kg)</Label>
                  <Input
                    id="shippingWeight"
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    value={data?.shipping?.weight || ""}
                    onChange={(e) => setData(prev => ({ 
                      ...(prev || {}), 
                      shipping: { ...(prev?.shipping || {}), weight: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingCost">Shipping Cost ($)</Label>
                  <Input
                    id="shippingCost"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={data?.shipping?.cost || ""}
                    onChange={(e) => setData(prev => ({ 
                      ...(prev || {}), 
                      shipping: { ...(prev?.shipping || {}), cost: e.target.value }
                    }))}
                  />
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <motion.div 
      className="space-y-6" 
      data-testid="vendor-products"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Product Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your product catalog and inventory.
          </p>
        </div>
        
        <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Add New Product
              </DialogTitle>
            </DialogHeader>
            
            <ProductForm />

            <div className="flex gap-3 pt-4">
              <Button onClick={handleAddProduct} className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
              <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Product Statistics */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Total Products</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{stats.published}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Published</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-emerald-600">{stats.inStock}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">In Stock</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.lowStock}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Low Stock</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Out of Stock</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock Levels</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setStockFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Products
            <Badge variant="secondary">{filteredProducts.length} products</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No products found matching your criteria
                </div>
              ) : (
                filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="h-8 w-8 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {product.name}
                          </h3>
                          {getPerformanceBadge(product.sales)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            ${product.price.toFixed(2)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            {product.stock} in stock
                          </div>
                          <div className="flex items-center gap-1">
                            <BarChart3 className="h-4 w-4" />
                            {product.sales} sold
                          </div>
                          <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {product.category}
                          </span>
                          {product.sku && (
                            <span className="text-xs text-gray-500">
                              SKU: {product.sku}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {getStockBadge(product.stock)}
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Published
                        </span>
                        <Switch 
                          checked={product.published}
                          onCheckedChange={() => togglePublished(product.id)}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewProduct(product)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditProductClick(product)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRestockProduct(product)}
                        >
                          <Package className="h-4 w-4 mr-1" />
                          Restock
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* View Product Modal */}
      <Dialog open={isViewProductOpen} onOpenChange={setIsViewProductOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              View Product: {selectedProduct?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-6">
              {/* Product Images */}
              {selectedProduct.images && selectedProduct.images.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Product Images
                  </h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    {selectedProduct.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${selectedProduct.name} ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Basic Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Price</Label>
                  <p className="text-lg font-semibold text-green-600">${selectedProduct.price}</p>
                </div>
                <div>
                  <Label>Stock</Label>
                  <p>{selectedProduct.stock} units</p>
                </div>
                <div>
                  <Label>Category</Label>
                  <p>{selectedProduct.category}</p>
                </div>
                <div>
                  <Label>SKU</Label>
                  <p>{selectedProduct.sku || 'N/A'}</p>
                </div>
                <div>
                  <Label>Brand</Label>
                  <p>{selectedProduct.brand || 'N/A'}</p>
                </div>
                <div>
                  <Label>Weight</Label>
                  <p>{selectedProduct.weight || 0} kg</p>
                </div>
              </div>

              {/* Description */}
              {selectedProduct.description && (
                <div>
                  <Label>Description</Label>
                  <p className="text-gray-600 dark:text-gray-400">{selectedProduct.description}</p>
                </div>
              )}

              {/* Specifications */}
              {selectedProduct.specifications && Object.keys(selectedProduct.specifications).length > 0 && (
                <div>
                  <h3 className="font-semibold flex items-center gap-2 mb-3">
                    <Settings className="h-4 w-4" />
                    Specifications
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span className="font-medium">{key}</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Shipping */}
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <Truck className="h-4 w-4" />
                  Shipping
                </h3>
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span>Free Shipping</span>
                    <span>{selectedProduct.shipping?.free ? 'Yes' : 'No'}</span>
                  </div>
                  {!selectedProduct.shipping?.free && (
                    <div className="flex justify-between">
                      <span>Shipping Cost</span>
                      <span>${selectedProduct.shipping?.cost || 0}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Warranty */}
              {selectedProduct.warranty && (
                <div>
                  <h3 className="font-semibold flex items-center gap-2 mb-3">
                    <Shield className="h-4 w-4" />
                    Warranty
                  </h3>
                  <p>{selectedProduct.warranty}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Product: {selectedProduct?.name}
            </DialogTitle>
          </DialogHeader>
          
          <ProductForm isEdit={true} />

          <div className="flex gap-3 pt-4">
            <Button onClick={handleEditProduct} className="flex-1">
              <Edit className="h-4 w-4 mr-2" />
              Update Product
            </Button>
            <Button variant="outline" onClick={() => setIsEditProductOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Low Stock Alert */}
      {stats.lowStock > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-yellow-800 dark:text-yellow-200">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Low Stock Alert
                  <Badge variant="destructive">{stats.lowStock}</Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                  onClick={handleInventoryManagement}
                >
                  <Package className="h-4 w-4 mr-1" />
                  Manage Inventory
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {products.filter(p => p.stock < 10 && p.stock > 0).map((product, index) => (
                  <motion.div 
                    key={product.id}
                    className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <span className="text-yellow-800 dark:text-yellow-200 font-medium">
                      {product.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
                        {product.stock} remaining
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRestockProduct(product)}
                      >
                        Restock
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Inventory Management Modal */}
      <Dialog open={isInventoryModalOpen} onOpenChange={setIsInventoryModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Inventory Management
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-green-600">{stats.inStock}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Well Stocked</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-yellow-500">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-yellow-600">{stats.lowStock}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Low Stock</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Out of Stock</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Products Requiring Attention</h3>
              {products.filter(p => p.stock <= 10).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.stock} units remaining</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStockBadge(product.stock)}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setIsInventoryModalOpen(false);
                        handleRestockProduct(product);
                      }}
                    >
                      Restock
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Restock Modal */}
      <Dialog open={isRestockModalOpen} onOpenChange={setIsRestockModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Restock Product
            </DialogTitle>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">{selectedProduct.name}</h3>
                <p className="text-sm text-gray-600">Current stock: {selectedProduct.stock} units</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="restockQuantity">Quantity to add</Label>
                <Input
                  id="restockQuantity"
                  type="number"
                  min="1"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(parseInt(e.target.value) || 0)}
                  placeholder="Enter quantity"
                />
              </div>
              
              {restockQuantity > 0 && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    New stock level: {selectedProduct.stock + restockQuantity} units
                  </p>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleConfirmRestock} 
                  className="flex-1"
                  disabled={restockQuantity <= 0}
                >
                  Confirm Restock
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsRestockModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
} 