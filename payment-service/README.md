
# 💳 **payment‑service API**

Handles payment transactions and saved payment methods via **Stripe** for **ShopSphere**.

**Base path:** `/api/payment`

> **Internal Stripe Customer Mapping**  
> Each authenticated consumer is mapped to a Stripe **Customer** behind the scenes.  
> The `stripeCustomerId` never leaves the payment‑service; you just use your JWT.

---

## 0. SetupIntent helper

### POST `/setup-intent`
Returns a Stripe **SetupIntent** `client_secret` so the front‑end can securely collect card details.

**Headers**
```
Authorization: Bearer <token>
```

**Success 201**
```json
{
  "setupIntentId": "seti_1OC...",
  "clientSecret": "seti_1OC..._secret_xyz"
}
```

---

## 1. Consumer Payment Methods

| Method | Path | Purpose |
|--------|------|---------|
| **POST** | `/consumer/payment-methods` | Save a Stripe `pm_…` to the consumer |
| **GET** | `/consumer/payment-methods` | List saved cards |
| **PUT** | `/consumer/payment-methods/:id/default` | Make a saved card default |
| **DELETE** | `/consumer/payment-methods/:id` | Remove a saved card |

### 1.1 POST `/consumer/payment-methods`
```json
{
  "paymentMethodToken": "pm_123456789",
  "billingDetails": { "name": "Abdullah Al Salmi", "email": "abdullah@example.com" }
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

### 1.2 GET `/consumer/payment-methods`
```json
{
  "paymentMethods": [
    {
      "paymentMethodId": "pm_123456789",
      "brand": "Visa",
      "last4": "4242",
      "expMonth": 12,
      "expYear": 2028,
      "isDefault": true
    }
  ]
}

```

### 1.3 PUT `/consumer/payment-methods/:id/default`
```json
{ "message": "Default payment method updated." }
```

### 1.4 DELETE `/consumer/payment-methods/:id`
`204 No Content`

---

## 2. Consumer Payments (Checkout)

### 2.1 POST `/consumer/payments`
```json
{ "amount": 259900, "currency": "cad", "paymentMethodId": "pm_123456789", "orderId": "o987" }
```
**Success 201**
```json
{
  "paymentId": "pi_ABC123456789",
  "clientSecret": "pi_ABC123456789_secret_XYZ...",
  "amount": 259900,
  "currency": "cad",
  "status": "requires_confirmation",
  "createdAt": "2025-06-11T18:30:00Z"
}
```

### 2.2 GET `/consumer/payments`
```json
{
  "payments": [
    {
      "paymentId": "pi_ABC123456789",
      "amount": 259900,
      "currency": "cad",
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

### POST `/api/payment/webhook/stripe`
Processes `payment_intent.succeeded`, `payment_intent.payment_failed`, `payment_method.attached`, etc.

`200 OK` on success, `400 Bad Request` if signature/payload invalid.

---

## ❌ Unified Error Format
```json
{ "error": "Human‑readable message here" }
```

---

## ✅ Scope Coverage
* SetupIntent helper for card saving  
* Multi‑card support  
* PaymentIntent checkout flow  
* Webhook updates  
* Consistent error handling
