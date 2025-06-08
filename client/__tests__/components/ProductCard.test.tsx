import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProductCard } from '@/components/product/product-card'
import { useCart } from '@/hooks/use-cart'
import type { Product } from '@/types/product'

// Mock the useCart hook
vi.mock('@/hooks/use-cart')

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'Test description',
  price: 99.99,
  originalPrice: 119.99,
  discount: 17,
  images: [
    {
      id: '1',
      url: '/test-image.jpg',
      alt: 'Test Product',
      order: 0,
    },
  ],
  category: {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
  },
  vendor: {
    id: '1',
    name: 'Test Vendor',
    slug: 'test-vendor',
    rating: 4.8,
    reviewCount: 100,
    verified: true,
    joinedAt: '2023-01-01',
  },
  rating: 4.5,
  reviewCount: 25,
  stock: 10,
  sku: 'TEST-001',
  tags: ['test', 'product'],
  specifications: {},
  createdAt: '2023-01-01',
  updatedAt: '2023-01-01',
}

const mockAddItem = vi.fn()

describe('ProductCard', () => {
  beforeEach(() => {
    vi.mocked(useCart).mockReturnValue({
      items: [],
      addItem: mockAddItem,
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      totalItems: 0,
      totalPrice: 0,
    })
  })

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
    expect(screen.getByText('$119.99')).toBeInTheDocument()
    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.getByText('(25 reviews)')).toBeInTheDocument()
    expect(screen.getByText('Test Vendor')).toBeInTheDocument()
  })

  it('displays discount percentage correctly', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('17% off')).toBeInTheDocument()
  })

  it('shows stock status correctly', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('In Stock')).toBeInTheDocument()
  })

  it('shows out of stock when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 }
    render(<ProductCard product={outOfStockProduct} />)
    
    expect(screen.getByText('Out of Stock')).toBeInTheDocument()
  })

  it('calls addItem when add to cart button is clicked', () => {
    render(<ProductCard product={mockProduct} />)
    
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i })
    fireEvent.click(addToCartButton)
    
    expect(mockAddItem).toHaveBeenCalledWith({
      id: '1',
      name: 'Test Product',
      price: 99.99,
      image: '/test-image.jpg',
      quantity: 1,
      vendorId: '1',
    })
  })

  it('disables add to cart button when out of stock', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 }
    render(<ProductCard product={outOfStockProduct} />)
    
    const addToCartButton = screen.getByRole('button', { name: /out of stock/i })
    expect(addToCartButton).toBeDisabled()
  })

  it('applies priority loading to image when priority prop is true', () => {
    render(<ProductCard product={mockProduct} priority={true} />)
    
    const image = screen.getByRole('img', { name: 'Test Product' })
    expect(image).toHaveAttribute('loading', 'eager')
  })

  it('uses lazy loading for image when priority prop is false', () => {
    render(<ProductCard product={mockProduct} priority={false} />)
    
    const image = screen.getByRole('img', { name: 'Test Product' })
    expect(image).toHaveAttribute('loading', 'lazy')
  })
}) 