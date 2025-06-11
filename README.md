
# 💳 **payment‑service API**

Handles payment transactions and saved payment methods via **Stripe** for **ShopSphere**.

**Base path:** `/api/payment`

---

## 1. Consumer Payment Methods

### 1.1 POST `/consumer/payment-methods`
Save a new Stripe PaymentMethod to the authenticated consumer.

**Request**
```json
{
  "paymentMethodToken": "pm_123456789",
  "billingDetails": {
    "name": "Abdullah Al Salmi",
    "email": "abdullah@example.com"
  }
}
```

**Success 201**
```json
{
  "message": "Payment method saved successfully.",
  "paymentMethod": {
    "paymentMethodId": "pm_123456789",
    "brand": "Visa",
    "last4": "4242",
    "expMonth": 12,
    "expYear": 2028,
    "default": false
  }
}
```

**Errors**

| Code | When |
|------|------|
| 400  | Missing/invalid token |
| 401  | No bearer token |
| 402  | Card declined |

---

### 1.2 GET `/consumer/payment-methods`
Returns saved methods.

**Success 200**
```json
{
  "paymentMethods": [
    {
      "paymentMethodId": "pm_123456789",
      "brand": "Visa",
      "last4": "4242",
      "expMonth": 12,
      "expYear": 2028,
      "default": true
    }
  ]
}
```

---

### 1.3 PUT `/consumer/payment-methods/:id/default`
Set method `:id` as default.

**Success 200**
```json
{ "message": "Default payment method updated." }
```

---

### 1.4 DELETE `/consumer/payment-methods/:id`
Delete saved method.

**Success 204** – No body

---

## 2. Consumer Payments (Checkout)

### 2.1 POST `/consumer/payments`
Create a Stripe PaymentIntent for checkout.

**Request**
```json
{
  "amount": 259900,
  "currency": "usd",
  "paymentMethodId": "pm_123456789",
  "orderId": "o987"
}
```

**Success 201**
```json
{
  "paymentId": "pi_ABC123456789",
  "clientSecret": "pi_ABC123456789_secret_XYZ...",
  "amount": 259900,
  "currency": "usd",
  "status": "requires_confirmation",
  "createdAt": "2025-06-11T18:30:00Z"
}
```

---

### 2.2 GET `/consumer/payments`
Returns payment history.

**Success 200**
```json
{
  "payments": [
    {
      "paymentId": "pi_ABC123456789",
      "amount": 259900,
      "currency": "usd",
      "status": "succeeded",
      "createdAt": "2025-06-11T18:30:00Z",
      "paymentMethod": { "brand": "Visa", "last4": "4242" },
      "orderId": "o987"
    }
  ]
}
```

---

## 3. Stripe Webhooks

### 3.1 POST `/webhook/stripe`
Receives events like `payment_intent.succeeded`, `payment_intent.payment_failed`, `payment_method.attached`.

* Verifies `Stripe-Signature`
* Updates internal payment status
* Notifies order‑service on success

**Success 200** – Empty body  
**Error 400** – Invalid signature/payload

---

## ❌ Unified Error Format
```json
{ "error": "Human‑readable message here" }
```

---

## ✅ Scope Coverage

* Multi‑card support per consumer
* Cart → PaymentIntent workflow
* Webhook-driven status updates
* Consistent error handling
