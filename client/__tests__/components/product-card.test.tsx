import type React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ProductCard } from "@/components/product/product-card"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { toast } from "sonner"
import type { Product } from "@/types/product"
import jest from "jest" // Import jest to declare it

// Mock the hooks
jest.mock("@/hooks/use-cart")
jest.mock("@/hooks/use-wishlist")
jest.mock("sonner")

const mockProduct: Product = {
  id: "1",
  name: "Test Product",
  description: "A test product description",
  price: 99.99,
  originalPrice: 129.99,
  discount: 23,
  images: [
    {
      id: "1",
      url: "/test-image.jpg",
      alt: "Test product image",
      order: 0,
    },
  ],
  category: {
    id: "1",
    name: "Electronics",
    slug: "electronics",
  },
  vendor: {
    id: "1",
    name: "Test Vendor",
    slug: "test-vendor",
    rating: 4.5,
    reviewCount: 100,
    verified: true,
    joinedAt: "2023-01-01",
  },
  rating: 4.2,
  reviewCount: 50,
  stock: 10,
  sku: "TEST-001",
  tags: ["electronics", "gadget"],
  specifications: {},
  createdAt: "2023-01-01",
  updatedAt: "2023-01-01",
}

const mockAddToCart = jest.fn()
const mockAddToWishlist = jest.fn()
const mockRemoveFromWishlist = jest.fn()

beforeEach(() => {
  ;(useCart as jest.Mock).mockReturnValue({
    addItem: mockAddToCart,
  })
  ;(useWishlist as jest.Mock).mockReturnValue({
    items: [],
    addItem: mockAddToWishlist,
    removeItem: mockRemoveFromWishlist,
  })
  ;(toast as any).mockReturnValue({
    success: jest.fn(),
  })
})

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(<QueryClientProvider client={queryClient}>{component}</QueryClientProvider>)
}

describe("ProductCard", () => {
  it("renders product information correctly", () => {
    renderWithProviders(<ProductCard product={mockProduct} />)

    expect(screen.getByText("Test Product")).toBeInTheDocument()
    expect(screen.getByText("$99.99")).toBeInTheDocument()
    expect(screen.getByText("$129.99")).toBeInTheDocument()
    expect(screen.getByText("-23%")).toBeInTheDocument()
    expect(screen.getByText("by Test Vendor")).toBeInTheDocument()
    expect(screen.getByText("(50)")).toBeInTheDocument()
  })

  it("displays product image with correct alt text", () => {
    renderWithProviders(<ProductCard product={mockProduct} />)

    const image = screen.getByAltText("Test Product")
    expect(image).toBeInTheDocument()
  })

  it("shows discount badge when product has discount", () => {
    renderWithProviders(<ProductCard product={mockProduct} />)

    expect(screen.getByText("-23%")).toBeInTheDocument()
  })

  it("adds product to cart when add to cart button is clicked", async () => {
    renderWithProviders(<ProductCard product={mockProduct} />)

    const addToCartButton = screen.getByTestId("add-to-cart-button")
    fireEvent.click(addToCartButton)

    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalledWith({
        id: "1",
        name: "Test Product",
        price: 99.99,
        image: "/test-image.jpg",
        quantity: 1,
        vendorId: "1",
      })
    })
  })

  it("toggles wishlist when wishlist button is clicked", async () => {
    renderWithProviders(<ProductCard product={mockProduct} />)

    const wishlistButton = screen.getByTestId("wishlist-button")
    fireEvent.click(wishlistButton)

    await waitFor(() => {
      expect(mockAddToWishlist).toHaveBeenCalledWith(mockProduct)
    })
  })

  it("removes from wishlist when product is already in wishlist", async () => {
    ;(useWishlist as jest.Mock).mockReturnValue({
      items: [mockProduct],
      addItem: mockAddToWishlist,
      removeItem: mockRemoveFromWishlist,
    })

    renderWithProviders(<ProductCard product={mockProduct} />)

    const wishlistButton = screen.getByTestId("wishlist-button")
    fireEvent.click(wishlistButton)

    await waitFor(() => {
      expect(mockRemoveFromWishlist).toHaveBeenCalledWith("1")
    })
  })

  it("renders star rating correctly", () => {
    renderWithProviders(<ProductCard product={mockProduct} />)

    // Should have 4 filled stars (rating is 4.2)
    const stars = screen.getAllByRole("img", { hidden: true })
    expect(stars).toHaveLength(5) // Total 5 stars
  })

  it("has correct link to product detail page", () => {
    renderWithProviders(<ProductCard product={mockProduct} />)

    const productLink = screen.getByRole("link", { name: /test product/i })
    expect(productLink).toHaveAttribute("href", "/shop/1")
  })

  it("has correct link to vendor page", () => {
    renderWithProviders(<ProductCard product={mockProduct} />)

    const vendorLink = screen.getByRole("link", { name: /by test vendor/i })
    expect(vendorLink).toHaveAttribute("href", "/vendors/test-vendor")
  })
})
