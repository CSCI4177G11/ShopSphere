import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// Import or define the checkout schemas
const checkoutAddressSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 characters'),
  country: z.string().min(2, 'Country is required'),
})

const paymentMethodSchema = z.object({
  cardNumber: z.string().min(16, 'Card number must be 16 digits'),
  expiryMonth: z.string().min(1, 'Expiry month is required'),
  expiryYear: z.string().min(4, 'Expiry year is required'),
  cvv: z.string().min(3, 'CVV must be at least 3 digits'),
  cardholderName: z.string().min(2, 'Cardholder name is required'),
  billingAddress: checkoutAddressSchema.optional(),
  saveCard: z.boolean().default(false),
})

const orderSummarySchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    price: z.number().positive(),
  })),
  shippingAddress: checkoutAddressSchema,
  paymentMethod: paymentMethodSchema,
  subtotal: z.number().positive(),
  shipping: z.number().min(0),
  tax: z.number().min(0),
  total: z.number().positive(),
})

describe('Checkout Validation Schemas', () => {
  describe('checkoutAddressSchema', () => {
    it('validates correct address data', () => {
      const validAddress = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'US',
      }

      const result = checkoutAddressSchema.safeParse(validAddress)
      expect(result.success).toBe(true)
    })

    it('rejects invalid email', () => {
      const invalidAddress = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        phone: '1234567890',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'US',
      }

      const result = checkoutAddressSchema.safeParse(invalidAddress)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid email address')
      }
    })

    it('rejects short phone number', () => {
      const invalidAddress = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '123',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'US',
      }

      const result = checkoutAddressSchema.safeParse(invalidAddress)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Phone number must be at least 10 digits')
      }
    })

    it('rejects empty required fields', () => {
      const invalidAddress = {
        firstName: '',
        lastName: '',
        email: 'john@example.com',
        phone: '1234567890',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      }

      const result = checkoutAddressSchema.safeParse(invalidAddress)
      expect(result.success).toBe(false)
    })
  })

  describe('paymentMethodSchema', () => {
    it('validates correct payment data', () => {
      const validPayment = {
        cardNumber: '1234567890123456',
        expiryMonth: '12',
        expiryYear: '2025',
        cvv: '123',
        cardholderName: 'John Doe',
        saveCard: false,
      }

      const result = paymentMethodSchema.safeParse(validPayment)
      expect(result.success).toBe(true)
    })

    it('rejects short card number', () => {
      const invalidPayment = {
        cardNumber: '123456789',
        expiryMonth: '12',
        expiryYear: '2025',
        cvv: '123',
        cardholderName: 'John Doe',
      }

      const result = paymentMethodSchema.safeParse(invalidPayment)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Card number must be 16 digits')
      }
    })

    it('rejects short CVV', () => {
      const invalidPayment = {
        cardNumber: '1234567890123456',
        expiryMonth: '12',
        expiryYear: '2025',
        cvv: '12',
        cardholderName: 'John Doe',
      }

      const result = paymentMethodSchema.safeParse(invalidPayment)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('CVV must be at least 3 digits')
      }
    })

    it('sets default value for saveCard', () => {
      const payment = {
        cardNumber: '1234567890123456',
        expiryMonth: '12',
        expiryYear: '2025',
        cvv: '123',
        cardholderName: 'John Doe',
      }

      const result = paymentMethodSchema.safeParse(payment)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.saveCard).toBe(false)
      }
    })
  })

  describe('orderSummarySchema', () => {
    it('validates complete order data', () => {
      const validOrder = {
        items: [
          { productId: '1', quantity: 2, price: 99.99 },
          { productId: '2', quantity: 1, price: 149.99 },
        ],
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'US',
        },
        paymentMethod: {
          cardNumber: '1234567890123456',
          expiryMonth: '12',
          expiryYear: '2025',
          cvv: '123',
          cardholderName: 'John Doe',
          saveCard: false,
        },
        subtotal: 349.97,
        shipping: 9.99,
        tax: 28.00,
        total: 387.96,
      }

      const result = orderSummarySchema.safeParse(validOrder)
      expect(result.success).toBe(true)
    })

    it('rejects negative quantities', () => {
      const invalidOrder = {
        items: [
          { productId: '1', quantity: -1, price: 99.99 },
        ],
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'US',
        },
        paymentMethod: {
          cardNumber: '1234567890123456',
          expiryMonth: '12',
          expiryYear: '2025',
          cvv: '123',
          cardholderName: 'John Doe',
        },
        subtotal: 99.99,
        shipping: 9.99,
        tax: 8.00,
        total: 117.98,
      }

      const result = orderSummarySchema.safeParse(invalidOrder)
      expect(result.success).toBe(false)
    })

    it('rejects negative prices', () => {
      const invalidOrder = {
        items: [
          { productId: '1', quantity: 1, price: -99.99 },
        ],
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'US',
        },
        paymentMethod: {
          cardNumber: '1234567890123456',
          expiryMonth: '12',
          expiryYear: '2025',
          cvv: '123',
          cardholderName: 'John Doe',
        },
        subtotal: 99.99,
        shipping: 9.99,
        tax: 8.00,
        total: 117.98,
      }

      const result = orderSummarySchema.safeParse(invalidOrder)
      expect(result.success).toBe(false)
    })
  })
}) 