// Cypress globals: describe, beforeEach, it, cy, Cypress are available without imports

describe("Checkout Flow", () => {
  beforeEach(() => {
    // Mock API responses
    cy.intercept("GET", "/api/products/trending", { fixture: "trending-products.json" })
    cy.intercept("POST", "/api/auth/signin", { fixture: "auth-success.json" })
    cy.intercept("POST", "/api/orders", { fixture: "order-success.json" })
    cy.intercept("POST", "/api/payments/intent", { fixture: "payment-intent.json" })

    cy.visit("/")
  })

  it("completes full checkout flow from login to order confirmation", () => {
    // Step 1: Login
    cy.get('[data-testid="login-button"]').click()
    cy.get('[data-testid="email-input"]').type("test@example.com")
    cy.get('[data-testid="password-input"]').type("password123")
    cy.get('[data-testid="signin-button"]').click()

    cy.url().should("eq", Cypress.config().baseUrl + "/")
    cy.get('[data-testid="user-menu"]').should("be.visible")

    // Step 2: Browse and add product to cart
    cy.get('[data-testid="product-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="add-to-cart-button"]').click()
      })

    cy.get('[data-testid="cart-notification"]').should("contain", "Added to cart")
    cy.get('[data-testid="cart-badge"]').should("contain", "1")

    // Step 3: Go to cart and verify items
    cy.get('[data-testid="cart-button"]').click()
    cy.get('[data-testid="cart-drawer"]').should("be.visible")
    cy.get('[data-testid="cart-item"]').should("have.length", 1)
    cy.get('[data-testid="checkout-button"]').click()

    // Step 4: Fill shipping address
    cy.url().should("include", "/checkout")
    cy.get('[data-testid="shipping-step"]').should("be.visible")

    cy.get('[data-testid="fullname-input"]').type("John Doe")
    cy.get('[data-testid="address-input"]').type("123 Main Street")
    cy.get('[data-testid="city-input"]').type("New York")
    cy.get('[data-testid="state-select"]').select("NY")
    cy.get('[data-testid="postal-code-input"]').type("10001")
    cy.get('[data-testid="phone-input"]').type("555-123-4567")

    cy.get('[data-testid="continue-to-payment"]').click()

    // Step 5: Select payment method
    cy.get('[data-testid="payment-step"]').should("be.visible")
    cy.get('[data-testid="credit-card-option"]').click()

    // Fill credit card details (using Stripe test card)
    cy.get('[data-testid="card-number-input"]').type("4242424242424242")
    cy.get('[data-testid="card-expiry-input"]').type("12/25")
    cy.get('[data-testid="card-cvc-input"]').type("123")
    cy.get('[data-testid="card-name-input"]').type("John Doe")

    cy.get('[data-testid="continue-to-review"]').click()

    // Step 6: Review order
    cy.get('[data-testid="review-step"]').should("be.visible")
    cy.get('[data-testid="order-summary"]').should("be.visible")
    cy.get('[data-testid="shipping-address-review"]').should("contain", "John Doe")
    cy.get('[data-testid="payment-method-review"]').should("contain", "**** 4242")

    // Verify order total
    cy.get('[data-testid="order-total"]').should("be.visible")

    // Step 7: Place order
    cy.get('[data-testid="place-order-button"]').click()

    // Step 8: Verify order confirmation
    cy.url().should("include", "/order-confirmation")
    cy.get('[data-testid="order-success"]').should("be.visible")
    cy.get('[data-testid="order-number"]').should("be.visible")
    cy.get('[data-testid="order-details"]').should("be.visible")

    // Verify cart is cleared
    cy.get('[data-testid="cart-badge"]').should("not.exist")
  })

  it("handles payment failures gracefully", () => {
    // Mock payment failure
    cy.intercept("POST", "/api/payments/intent", {
      statusCode: 400,
      body: { error: "Payment failed" },
    })

    // Go through checkout flow until payment
    cy.get('[data-testid="login-button"]').click()
    cy.get('[data-testid="email-input"]').type("test@example.com")
    cy.get('[data-testid="password-input"]').type("password123")
    cy.get('[data-testid="signin-button"]').click()

    cy.get('[data-testid="product-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="add-to-cart-button"]').click()
      })

    cy.get('[data-testid="cart-button"]').click()
    cy.get('[data-testid="checkout-button"]').click()

    // Fill shipping address
    cy.get('[data-testid="fullname-input"]').type("John Doe")
    cy.get('[data-testid="address-input"]').type("123 Main Street")
    cy.get('[data-testid="city-input"]').type("New York")
    cy.get('[data-testid="state-select"]').select("NY")
    cy.get('[data-testid="postal-code-input"]').type("10001")
    cy.get('[data-testid="continue-to-payment"]').click()

    // Fill payment details
    cy.get('[data-testid="credit-card-option"]').click()
    cy.get('[data-testid="card-number-input"]').type("4242424242424242")
    cy.get('[data-testid="card-expiry-input"]').type("12/25")
    cy.get('[data-testid="card-cvc-input"]').type("123")
    cy.get('[data-testid="continue-to-review"]').click()

    // Place order and expect error
    cy.get('[data-testid="place-order-button"]').click()
    cy.get('[data-testid="error-message"]').should("contain", "Payment failed")

    // Verify user can retry
    cy.get('[data-testid="retry-payment-button"]').should("be.visible")
  })

  it("validates form fields correctly", () => {
    // Login first
    cy.get('[data-testid="login-button"]').click()
    cy.get('[data-testid="email-input"]').type("test@example.com")
    cy.get('[data-testid="password-input"]').type("password123")
    cy.get('[data-testid="signin-button"]').click()

    // Add item to cart
    cy.get('[data-testid="product-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="add-to-cart-button"]').click()
      })

    cy.get('[data-testid="cart-button"]').click()
    cy.get('[data-testid="checkout-button"]').click()

    // Try to continue without filling required fields
    cy.get('[data-testid="continue-to-payment"]').click()

    // Verify validation errors
    cy.get('[data-testid="fullname-error"]').should("contain", "Full name is required")
    cy.get('[data-testid="address-error"]').should("contain", "Address is required")
    cy.get('[data-testid="city-error"]').should("contain", "City is required")
    cy.get('[data-testid="postal-code-error"]').should("contain", "Postal code is required")

    // Fill fields and verify errors disappear
    cy.get('[data-testid="fullname-input"]').type("John Doe")
    cy.get('[data-testid="fullname-error"]').should("not.exist")

    cy.get('[data-testid="address-input"]').type("123 Main Street")
    cy.get('[data-testid="address-error"]').should("not.exist")
  })

  it("applies promo codes correctly", () => {
    // Setup and add item to cart
    cy.get('[data-testid="login-button"]').click()
    cy.get('[data-testid="email-input"]').type("test@example.com")
    cy.get('[data-testid="password-input"]').type("password123")
    cy.get('[data-testid="signin-button"]').click()

    cy.get('[data-testid="product-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="add-to-cart-button"]').click()
      })

    cy.get('[data-testid="cart-button"]').click()
    cy.get('[data-testid="checkout-button"]').click()

    // Apply promo code
    cy.get('[data-testid="promo-code-input"]').type("SAVE10")
    cy.get('[data-testid="apply-promo-button"]').click()

    // Verify discount is applied
    cy.get('[data-testid="discount-amount"]').should("be.visible")
    cy.get('[data-testid="order-total"]').should("contain", "Total after discount")

    // Test invalid promo code
    cy.get('[data-testid="promo-code-input"]').clear().type("INVALID")
    cy.get('[data-testid="apply-promo-button"]').click()
    cy.get('[data-testid="promo-error"]').should("contain", "Invalid promo code")
  })
})
