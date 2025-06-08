/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>
      addToCart(productId: string): Chainable<void>
      clearCart(): Chainable<void>
    }
  }
}

Cypress.Commands.add("login", (email = "test@example.com", password = "password123") => {
  cy.get('[data-testid="login-button"]').click()
  cy.get('[data-testid="email-input"]').type(email)
  cy.get('[data-testid="password-input"]').type(password)
  cy.get('[data-testid="signin-button"]').click()
  cy.get('[data-testid="user-menu"]').should("be.visible")
})

Cypress.Commands.add("addToCart", (productId: string) => {
  cy.get(`[data-testid="product-card-${productId}"]`).within(() => {
    cy.get('[data-testid="add-to-cart-button"]').click()
  })
  cy.get('[data-testid="cart-notification"]').should("contain", "Added to cart")
})

Cypress.Commands.add("clearCart", () => {
  cy.window().then((win) => {
    win.localStorage.removeItem("cart-storage")
  })
})
