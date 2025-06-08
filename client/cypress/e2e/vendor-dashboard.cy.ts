describe('Vendor Dashboard Workflow', () => {
  beforeEach(() => {
    // Start MSW in test mode
    cy.window().then((win) => {
      if (win.msw) {
        win.msw.start({ onUnhandledRequest: 'bypass' })
      }
    })
  })

  it('should complete vendor registration and product management', () => {
    // 1. Visit homepage and become a seller
    cy.visit('/')
    cy.contains('Become a Seller').click()
    cy.url().should('include', '/auth/seller-register')

    // 2. Fill vendor registration form
    cy.get('input[name="name"]').type('Jane\'s Tech Store')
    cy.get('input[name="email"]').type('jane@techstore.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('input[name="storeName"]').type('Jane\'s Tech Store')
    cy.get('textarea[name="storeDescription"]').type('Quality tech products at great prices')
    cy.get('input[name="businessAddress"]').type('456 Business Ave, Tech City, TC 67890')
    cy.get('input[type="checkbox"][name="termsAccepted"]').check()
    cy.get('button[type="submit"]').click()

    // 3. Should show pending approval message
    cy.contains('Application submitted').should('be.visible')
    cy.contains('pending approval').should('be.visible')

    // 4. Simulate approved vendor login
    cy.visit('/auth/login')
    cy.get('input[name="email"]').type('vendor@test.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    // 5. Should redirect to seller dashboard
    cy.url().should('include', '/seller/dashboard')
    cy.contains('Seller Dashboard').should('be.visible')

    // 6. Navigate to Products tab
    cy.contains('Products').click()
    cy.url().should('include', '/seller/dashboard/products')

    // 7. Create new product
    cy.contains('Add Product').click()
    cy.get('input[name="name"]').type('Premium Wireless Earbuds')
    cy.get('textarea[name="description"]').type('High-quality wireless earbuds with noise cancellation')
    cy.get('input[name="price"]').type('149.99')
    cy.get('input[name="stock"]').type('50')
    cy.get('select[name="category"]').select('Electronics')
    cy.get('button[type="submit"]').click()

    // 8. Product should appear in list
    cy.contains('Premium Wireless Earbuds').should('be.visible')
    cy.contains('$149.99').should('be.visible')

    // 9. Check product is live on shop
    cy.visit('/shop')
    cy.contains('Premium Wireless Earbuds').should('be.visible')

    // 10. Navigate to Orders tab
    cy.visit('/seller/dashboard/orders')
    cy.contains('Orders').should('be.visible')

    // 11. Check order management
    cy.get('[data-testid="order-row"]').should('be.visible')
    cy.get('[data-testid="update-order-status"]').first().click()
    cy.contains('shipped').click()
    cy.contains('Status updated').should('be.visible')

    // 12. Check Analytics tab
    cy.visit('/seller/dashboard/analytics')
    cy.contains('Analytics').should('be.visible')
    cy.contains('Total Revenue').should('be.visible')
    cy.get('[data-testid="revenue-chart"]').should('be.visible')
  })

  it('should handle product editing and deletion', () => {
    // Login as vendor
    cy.visit('/auth/login')
    cy.get('input[name="email"]').type('vendor@test.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    // Navigate to products
    cy.visit('/seller/dashboard/products')

    // Edit product
    cy.get('[data-testid="edit-product"]').first().click()
    cy.get('input[name="price"]').clear().type('139.99')
    cy.get('button[type="submit"]').click()
    cy.contains('Product updated').should('be.visible')

    // Delete product
    cy.get('[data-testid="delete-product"]').first().click()
    cy.contains('Confirm').click()
    cy.contains('Product deleted').should('be.visible')
  })

  it('should display correct vendor analytics', () => {
    // Login as vendor
    cy.visit('/auth/login')
    cy.get('input[name="email"]').type('vendor@test.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    // Check analytics dashboard
    cy.visit('/seller/dashboard/analytics')
    
    // Verify KPI cards
    cy.contains('Total Products: 12').should('be.visible')
    cy.contains('Total Orders: 89').should('be.visible')
    cy.contains('Total Revenue: $12,500').should('be.visible')

    // Verify charts render
    cy.get('[data-testid="revenue-chart"]').should('be.visible')
    cy.get('[data-testid="top-products-chart"]').should('be.visible')
  })

  it('should handle vendor settings', () => {
    // Login as vendor
    cy.visit('/auth/login')
    cy.get('input[name="email"]').type('vendor@test.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    // Navigate to settings
    cy.visit('/seller/dashboard/settings')
    
    // Update store information
    cy.get('input[name="storeName"]').clear().type('Updated Tech Store')
    cy.get('textarea[name="storeDescription"]').clear().type('Updated description')
    cy.get('button[type="submit"]').click()
    cy.contains('Settings updated').should('be.visible')
  })
}) 