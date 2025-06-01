# 🛒 cart-service API Overview

This service handles shopping cart operations for consumers before checkout. Each cart stores products with quantities and timestamps.

## 📍 Base URL

```
/cart
```

---

## 📌 API Endpoints

### 1. POST `/add`

**Add a product to a consumer's cart.**

📦 **Request Body**

```json
{
  "consumerId": "u123",
  "productId": "p001",
  "quantity": 2
}
```

✅ **Response: 201 Created**

```json
{
  "message": "Product added to cart."
}
```

---

### 2. PUT `/update`

**Update the quantity of a cart item.**

📦 **Request Body**

```json
{
  "consumerId": "u123",
  "productId": "p001",
  "quantity": 3
}
```

✅ **Response: 200 OK**

```json
{
  "message": "Cart item updated."
}
```

---

### 3. DELETE `/remove`

**Remove a product from the cart.**

📦 **Request Body**

```json
{
  "consumerId": "u123",
  "productId": "p001"
}
```

✅ **Response: 200 OK**

```json
{
  "message": "Product removed from cart."
}
```

---

### 4. GET `/:consumerId`

**Retrieve all items in a consumer’s cart.**

✅ **Response: 200 OK**

```json
[
  {
    "productId": "p001",
    "quantity": 2,
    "addedAt": "2025-05-31T15:00:00Z"
  },
  {
    "productId": "p002",
    "quantity": 1,
    "addedAt": "2025-05-31T15:05:00Z"
  }
]
```

---

### 5. DELETE `/clear/:consumerId`

**Clear the entire cart for a consumer.**

✅ **Response: 200 OK**

```json
{
  "message": "Cart cleared successfully."
}
```

---

## ❌ Error Handling

🧱 **Standard Format**

```json
{
  "error": "Error message here"
}
```

❌ **Common Errors**

- 400 Bad Request: Missing or invalid input
- 404 Not Found: Cart item or consumer not found
- 409 Conflict: Product already in cart (on add)

---

## ✅ Scope Coverage Summary

`✔ Shopping Cart:

- Add/remove/update items
- View cart items
- Auto-clear on checkout via DELETE

✔ Checkout Preparation:

- Supplies cart data to payment-service

✔ Fields Supported:

- consumerId, productId, quantity, addedAt
