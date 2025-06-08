import type React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"
import CheckoutPage from "@/app/checkout/page"
import { useCart } from "@/hooks/use-cart"
import { orderService } from "@/lib/api/order-service"
import { paymentService } from "@/lib/api/payment-service"
import jest from "jest" // Import jest to declare the variable

// Mock the services and hooks
jest.mock("@/hooks/use-cart")
jest.mock("@/lib/api/order-service")
jest.mock("@/lib/api/payment-service")
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}))

const mockCartItems = [
  {
    id: "1",
    name: "Test Product 1",
    price: 99.99,
    image: "/test1.jpg",
    quantity: 2,
    vendorId: "vendor1",
  },
  {
    id: "2",
    name: "Test Product 2",
    price: 49.99,
    image: "/test2.jpg",
    quantity: 1,
    vendorId: "vendor2",
  },
]

const mockSession = {
  user: {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "consumer",
  },
  accessToken: "mock-token",
}

beforeEach(() => {
  ;(useCart as jest.Mock).mockReturnValue({
    items: mockCartItems,
    total: 249.97,
    itemCount: 3,
    clearCart: jest.fn(),
  })
  ;(orderService.createOrder as jest.Mock).mockResolvedValue({
    id: "order-123",
    status: "pending",
  })
  ;(paymentService.createPaymentIntent as jest.Mock).mockResolvedValue({
    clientSecret: "pi_test_client_secret",
  })
})

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <SessionProvider session={mockSession}>
      <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
    </SessionProvider>,
  )
}

describe("CheckoutPage", () => {
  it("renders checkout steps correctly", () => {
    renderWithProviders(<CheckoutPage />)

    expect(screen.getByText("Checkout")).toBeInTheDocument()
    expect(screen.getByText("Shipping Address")).toBeInTheDocument()
    expect(screen.getByText("Payment Method")).toBeInTheDocument()
    expect(screen.getByText("Review Order")).toBeInTheDocument()
  })

  it("displays cart items in order summary", () => {
    renderWithProviders(<CheckoutPage />)

    expect(screen.getByText("Test Product 1")).toBeInTheDocument()
    expect(screen.getByText("Test Product 2")).toBeInTheDocument()
    expect(screen.getByText("$249.97")).toBeInTheDocument()
  })

  it("validates shipping address form", async () => {
    renderWithProviders(<CheckoutPage />)

    const continueButton = screen.getByRole("button", { name: /continue to payment/i })
    fireEvent.click(continueButton)

    await waitFor(() => {
      expect(screen.getByText("Full name is required")).toBeInTheDocument()
      expect(screen.getByText("Address is required")).toBeInTheDocument()
      expect(screen.getByText("City is required")).toBeInTheDocument()
    })
  })

  it("proceeds to payment step when shipping address is valid", async () => {
    renderWithProviders(<CheckoutPage />)

    // Fill in shipping address
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "John Doe" },
    })
    fireEvent.change(screen.getByLabelText(/address/i), {
      target: { value: "123 Main St" },
    })
    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: "New York" },
    })
    fireEvent.change(screen.getByLabelText(/postal code/i), {
      target: { value: "10001" },
    })

    const continueButton = screen.getByRole("button", { name: /continue to payment/i })
    fireEvent.click(continueButton)

    await waitFor(() => {
      expect(screen.getByText("Payment Information")).toBeInTheDocument()
    })
  })

  it("shows payment methods in payment step", async () => {
    renderWithProviders(<CheckoutPage />)

    // Navigate to payment step
    const addressForm = screen.getByTestId("address-form")
    fireEvent.submit(addressForm)

    await waitFor(() => {
      expect(screen.getByText("Credit Card")).toBeInTheDocument()
      expect(screen.getByText("PayPal")).toBeInTheDocument()
    })
  })

  it("creates payment intent when proceeding to review", async () => {
    renderWithProviders(<CheckoutPage />)

    // Fill forms and proceed to review
    // ... form filling logic ...

    const reviewButton = screen.getByRole("button", { name: /review order/i })
    fireEvent.click(reviewButton)

    await waitFor(() => {
      expect(paymentService.createPaymentIntent).toHaveBeenCalledWith({
        amount: 24997, // $249.97 in cents
        currency: "usd",
      })
    })
  })

  it("places order when place order button is clicked", async () => {
    renderWithProviders(<CheckoutPage />)

    // Navigate to final step
    // ... navigation logic ...

    const placeOrderButton = screen.getByRole("button", { name: /place order/i })
    fireEvent.click(placeOrderButton)

    await waitFor(() => {
      expect(orderService.createOrder).toHaveBeenCalledWith({
        items: mockCartItems,
        shippingAddress: expect.any(Object),
        paymentMethod: expect.any(Object),
        total: 249.97,
      })
    })
  })

  it("shows loading state during order placement", async () => {
    ;(orderService.createOrder as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000)),
    )

    renderWithProviders(<CheckoutPage />)

    const placeOrderButton = screen.getByRole("button", { name: /place order/i })
    fireEvent.click(placeOrderButton)

    expect(screen.getByText("Processing...")).toBeInTheDocument()
    expect(placeOrderButton).toBeDisabled()
  })

  it("handles order creation errors", async () => {
    ;(orderService.createOrder as jest.Mock).mockRejectedValue(new Error("Payment failed"))

    renderWithProviders(<CheckoutPage />)

    const placeOrderButton = screen.getByRole("button", { name: /place order/i })
    fireEvent.click(placeOrderButton)

    await waitFor(() => {
      expect(screen.getByText("Payment failed")).toBeInTheDocument()
    })
  })

  it("calculates tax and shipping correctly", () => {
    renderWithProviders(<CheckoutPage />)

    expect(screen.getByText("Subtotal")).toBeInTheDocument()
    expect(screen.getByText("Shipping")).toBeInTheDocument()
    expect(screen.getByText("Tax")).toBeInTheDocument()
    expect(screen.getByText("Total")).toBeInTheDocument()
  })

  it("applies promo code when valid", async () => {
    renderWithProviders(<CheckoutPage />)

    const promoInput = screen.getByPlaceholderText(/enter promo code/i)
    const applyButton = screen.getByRole("button", { name: /apply/i })

    fireEvent.change(promoInput, { target: { value: "SAVE10" } })
    fireEvent.click(applyButton)

    await waitFor(() => {
      expect(screen.getByText("Discount")).toBeInTheDocument()
    })
  })
})
