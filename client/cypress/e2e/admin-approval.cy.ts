describe('Admin Approval Workflow', () => {
  beforeEach(() => {
    // Start MSW in test mode
    cy.window().then((win) => {
      if (win.msw) {
        win.msw.start({ onUnhandledRequest: 'bypass' })
      }
    })
  })

  it('should complete admin login and vendor approval workflow', () => {
    // 1. Login as admin
    cy.visit('/auth/login')
    cy.get('input[name="email"]').type('admin@test.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    // 2. Should redirect to admin panel
    cy.url().should('include', '/admin')
    cy.contains('Admin Dashboard').should('be.visible')

    // 3. Navigate to vendor applications
    cy.contains('Vendors').click()
    cy.url().should('include', '/admin/vendors')

    // 4. Should see pending vendor applications
    cy.contains('Pending Applications').should('be.visible')
    cy.get('[data-testid="pending-vendor"]').should('have.length.at.least', 1)

    // 5. Review vendor application details
    cy.get('[data-testid="view-application"]').first().click()
    cy.contains('Store Name').should('be.visible')
    cy.contains('Business Address').should('be.visible')
    cy.contains('Store Description').should('be.visible')

    // 6. Approve vendor application
    cy.get('[data-testid="approve-vendor"]').click()
    cy.contains('Confirm Approval').should('be.visible')
    cy.get('[data-testid="confirm-approve"]').click()

    // 7. Should show success message
    cy.contains('Vendor approved successfully').should('be.visible')

    // 8. Vendor should move to approved list
    cy.contains('Approved Vendors').click()
    cy.get('[data-testid="approved-vendor"]').should('contain', 'FashionHub')

    // 9. Check admin analytics
    cy.visit('/admin/analytics')
    cy.contains('Platform Analytics').should('be.visible')
    
    // Verify KPI cards
    cy.contains('Total Users: 1,250').should('be.visible')
    cy.contains('Total Vendors: 89').should('be.visible')
    cy.contains('Total Orders: 3,421').should('be.visible')
    cy.contains('Total Revenue: $125,000').should('be.visible')

    // Verify recent activity
    cy.contains('Recent Activity').should('be.visible')
    cy.get('[data-testid="activity-item"]').should('have.length.at.least', 1)
  })

  it('should handle vendor rejection workflow', () => {
    // Login as admin
    cy.visit('/auth/login')
    cy.get('input[name="email"]').type('admin@test.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    // Navigate to vendors
    cy.visit('/admin/vendors')
    
    // Reject vendor application
    cy.get('[data-testid="reject-vendor"]').first().click()
    cy.get('textarea[name="rejectionReason"]').type('Incomplete business documentation')
    cy.get('[data-testid="confirm-reject"]').click()

    // Should show success message
    cy.contains('Vendor application rejected').should('be.visible')
  })

  it('should display and manage user accounts', () => {
    // Login as admin
    cy.visit('/auth/login')
    cy.get('input[name="email"]').type('admin@test.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    // Navigate to users management
    cy.visit('/admin/users')
    cy.contains('User Management').should('be.visible')

    // Should display user list
    cy.get('[data-testid="user-row"]').should('have.length.at.least', 1)

    // Filter by user type
    cy.get('[data-testid="user-type-filter"]').select('consumer')
    cy.get('[data-testid="user-row"]').should('be.visible')

    // Search for specific user
    cy.get('[data-testid="user-search"]').type('john@example.com')
    cy.get('[data-testid="search-button"]').click()
    cy.get('[data-testid="user-row"]').should('contain', 'john@example.com')
  })

  it('should handle refund management', () => {
    // Login as admin
    cy.visit('/auth/login')
    cy.get('input[name="email"]').type('admin@test.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    // Navigate to refunds
    cy.visit('/admin/refunds')
    cy.contains('Refund Management').should('be.visible')

    // Should display pending refunds
    cy.get('[data-testid="refund-request"]').should('have.length.at.least', 1)

    // Process refund
    cy.get('[data-testid="process-refund"]').first().click()
    cy.contains('Confirm Refund').should('be.visible')
    cy.get('[data-testid="refund-amount"]').should('be.visible')
    cy.get('[data-testid="confirm-refund"]').click()

    // Should show success message
    cy.contains('Refund processed successfully').should('be.visible')
  })

  it('should show comprehensive analytics dashboard', () => {
    // Login as admin
    cy.visit('/auth/login')
    cy.get('input[name="email"]').type('admin@test.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    // Check analytics dashboard
    cy.visit('/admin/analytics')
    
    // Verify all charts render
    cy.get('[data-testid="revenue-trend-chart"]').should('be.visible')
    cy.get('[data-testid="user-growth-chart"]').should('be.visible')
    cy.get('[data-testid="order-status-chart"]').should('be.visible')
    cy.get('[data-testid="top-categories-chart"]').should('be.visible')

    // Verify time period filters work
    cy.get('[data-testid="time-period-filter"]').select('last-30-days')
    cy.get('[data-testid="revenue-trend-chart"]').should('be.visible')

    // Export functionality
    cy.get('[data-testid="export-data"]').click()
    cy.contains('Export Options').should('be.visible')
  })

  it('should handle system settings', () => {
    // Login as admin
    cy.visit('/auth/login')
    cy.get('input[name="email"]').type('admin@test.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[type="submit"]').click()

    // Navigate to settings
    cy.visit('/admin/settings')
    cy.contains('System Settings').should('be.visible')

    // Update platform settings
    cy.get('input[name="platformFee"]').clear().type('2.5')
    cy.get('input[name="minOrderAmount"]').clear().type('25.00')
    cy.get('button[type="submit"]').click()
    cy.contains('Settings updated successfully').should('be.visible')
  })
}) 