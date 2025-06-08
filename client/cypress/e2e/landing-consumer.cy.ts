describe('Consumer Landing to Checkout Flow', () => {
  beforeEach(() => {
    // Start MSW in test mode
    cy.window().then((win) => {
      if (win.msw) {
        win.msw.start({ onUnhandledRequest: 'bypass' })
      }
    })
  })

  it('should complete full consumer journey', () => {
    // 1. Visit landing page
    cy.visit('/')
    cy.contains('ShopSphere').should('be.visible')
    cy.contains('Discover Your Next Favorite Thing').should('be.visible')

    // 2. Browse trending products
    cy.contains('Trending Products').should('be.visible')
    cy.get('[data-testid="product-card"]').should('have.length.at.least', 1)

    // 3. Sign up as consumer
    cy.contains('Sign up').click()
    cy.url().should('include', '/auth/register')
    
    cy.get('input[name="name"]').type('John Consumer')
    cy.get('input[name="email"]').type('john.consumer@test.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    // 4. Login redirect and success
    cy.url().should('include', '/auth/login')
    cy.get('input[name="email"]').type('consumer@test.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    // 5. Should redirect to account dashboard
    cy.url().should('include', '/account')
    cy.contains('John Consumer').should('be.visible')

    // 6. Browse shop and add to cart
    cy.visit('/shop')
    cy.get('[data-testid="product-card"]').first().click()
    
    // 7. Add product to cart
    cy.contains('Add to Cart').click()
    cy.get('[data-testid="cart-count"]').should('contain', '1')

    // 8. Go to checkout
    cy.get('[data-testid="cart-button"]').click()
    cy.contains('Checkout').click()
    cy.url().should('include', '/checkout')

    // 9. Fill checkout form
    cy.get('input[name="firstName"]').type('John')
    cy.get('input[name="lastName"]').type('Doe')
    cy.get('input[name="address"]').type('123 Test St')
    cy.get('input[name="city"]').type('Test City')
    cy.get('input[name="zipCode"]').type('12345')
    cy.contains('Continue to Payment').click()

    // 10. Complete payment (mock)
    cy.contains('Place Order').click()
    
    // 11. Order confirmation
    cy.url().should('include', '/account/orders')
    cy.contains('Order confirmed').should('be.visible')
  })

  it('should filter products correctly', () => {
    cy.visit('/shop')
    
    // Test category filter
    cy.get('[data-testid="category-filter"]').select('Electronics')
    cy.get('[data-testid="product-card"]').should('be.visible')
    
    // Test price filter
    cy.get('[data-testid="price-min"]').type('100')
    cy.get('[data-testid="price-max"]').type('300')
    cy.get('[data-testid="apply-filters"]').click()
    
    cy.get('[data-testid="product-card"]').should('be.visible')
  })

  it('should handle guest browsing', () => {
    cy.visit('/')
    
    // Can browse without login
    cy.contains('Start Shopping').click()
    cy.url().should('include', '/shop')
    cy.get('[data-testid="product-card"]').should('be.visible')
    
    // Clicking product shows details
    cy.get('[data-testid="product-card"]').first().click()
    cy.contains('Add to Cart').should('be.visible')
    
    // Adding to cart as guest works
    cy.contains('Add to Cart').click()
    cy.get('[data-testid="cart-count"]').should('contain', '1')
  })
}) 