import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { useCart } from '@/hooks/use-cart'
import type { CartItem } from '@/types/cart'

// Mock the useCart hook
vi.mock('@/hooks/use-cart')

const mockCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 199.99,
    image: '/headphones.jpg',
    quantity: 2,
    vendorId: '1',
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 299.99,
    image: '/watch.jpg',
    quantity: 1,
    vendorId: '2',
  },
]

const mockUpdateQuantity = vi.fn()
const mockRemoveItem = vi.fn()
const mockClearCart = vi.fn()

describe('CartDrawer', () => {
  beforeEach(() => {
    vi.mocked(useCart).mockReturnValue({
      items: mockCartItems,
      addItem: vi.fn(),
      removeItem: mockRemoveItem,
      updateQuantity: mockUpdateQuantity,
      clearCart: mockClearCart,
      totalItems: 3,
      totalPrice: 699.97,
    })
  })

  it('renders cart items correctly', () => {
    render(<CartDrawer />)
    
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument()
    expect(screen.getByText('Smart Watch')).toBeInTheDocument()
    expect(screen.getByText('$199.99')).toBeInTheDocument()
    expect(screen.getByText('$299.99')).toBeInTheDocument()
  })

  it('calculates and displays correct subtotal', () => {
    render(<CartDrawer />)
    
    // Should show subtotal: (199.99 * 2) + (299.99 * 1) = 699.97
    expect(screen.getByText('$699.97')).toBeInTheDocument()
  })

  it('updates quantity when quantity controls are used', () => {
    render(<CartDrawer />)
    
    const increaseButtons = screen.getAllByLabelText(/increase quantity/i)
    fireEvent.click(increaseButtons[0])
    
    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 3)
  })

  it('decreases quantity when decrease button is clicked', () => {
    render(<CartDrawer />)
    
    const decreaseButtons = screen.getAllByLabelText(/decrease quantity/i)
    fireEvent.click(decreaseButtons[0])
    
    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 1)
  })

  it('removes item when remove button is clicked', () => {
    render(<CartDrawer />)
    
    const removeButtons = screen.getAllByLabelText(/remove item/i)
    fireEvent.click(removeButtons[0])
    
    expect(mockRemoveItem).toHaveBeenCalledWith('1')
  })

  it('shows empty cart message when no items', () => {
    vi.mocked(useCart).mockReturnValue({
      items: [],
      addItem: vi.fn(),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      totalItems: 0,
      totalPrice: 0,
    })
    
    render(<CartDrawer />)
    
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument()
  })

  it('displays correct item count in cart header', () => {
    render(<CartDrawer />)
    
    expect(screen.getByText('Shopping Cart (3)')).toBeInTheDocument()
  })

  it('shows checkout button when items exist', () => {
    render(<CartDrawer />)
    
    expect(screen.getByText('Checkout')).toBeInTheDocument()
  })

  it('clears cart when clear cart button is clicked', () => {
    render(<CartDrawer />)
    
    const clearButton = screen.getByText('Clear Cart')
    fireEvent.click(clearButton)
    
    expect(mockClearCart).toHaveBeenCalled()
  })

  it('handles quantity input changes', () => {
    render(<CartDrawer />)
    
    const quantityInputs = screen.getAllByDisplayValue('2')
    fireEvent.change(quantityInputs[0], { target: { value: '5' } })
    
    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 5)
  })

  it('prevents quantity from going below 1', () => {
    vi.mocked(useCart).mockReturnValue({
      items: [{ ...mockCartItems[0], quantity: 1 }],
      addItem: vi.fn(),
      removeItem: mockRemoveItem,
      updateQuantity: mockUpdateQuantity,
      clearCart: vi.fn(),
      totalItems: 1,
      totalPrice: 199.99,
    })
    
    render(<CartDrawer />)
    
    const decreaseButton = screen.getByLabelText(/decrease quantity/i)
    fireEvent.click(decreaseButton)
    
    // Should remove item instead of going to 0
    expect(mockRemoveItem).toHaveBeenCalledWith('1')
  })
}) 