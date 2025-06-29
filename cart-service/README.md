# 🛒 **cart‑service API**

Manages the **shopping cart** for consumers prior to checkout.  
Authentication is handled by `auth-service`; all endpoints require a **consumer** bearer token.

**Base path:** `/api/cart`

---

# 1. Cart Retrieval

## 1.1 **GET `/cart`**

Return the authenticated consumer’s cart items (paginated optional).

### Query Params
```
?page=1&limit=50
```

| Success | Error(s) |
|---------|----------|
| **200 OK** | **401 Unauthorized** – missing / expired token |

### Success Response 200
```json
{
  "page": 1,
  "limit": 50,
  "totalItems": 3,
  "items": [
    {
      "itemId": "ci001",
      "productId": "p001",
      "productName": "Custom Cotton Shirt",
      "price": 39.99,
      "quantity": 2,
      "addedAt": "2025-06-11T18:40:00Z"
    },
    {
      "itemId": "ci002",
      "productId": "p002",
      "productName": "Summer Linen Dress",
      "price": 59.99,
      "quantity": 1,
      "addedAt": "2025-06-11T18:45:00Z"
    }
  ]
}
```

---

## 1.2 **GET `/cart/totals`**

Return subtotal, estimated tax, and total for current cart.

| Success | Error(s) |
|---------|----------|
| **200 OK** | **401 Unauthorized** |

### Success Response 200
```json
{
  "totalItems": 3,
  "subtotal": 139.97,
  "estimatedTax": 20.99,
  "total": 160.96,
  "currency": "CAD"
}
```

---

# 2. Manage Cart Items

## 2.1 **POST `/cart/items`**

Add a product (or increase quantity if already present).

| Success | Error(s) |
|---------|----------|
| **201 Created** | **400** – invalid body<br>**401** – unauthenticated<br>**404** – product not found |

### Request Body
```json
{
  "productId": "p001",
  "quantity": 2
}
```

### Success Response 201
```json
{
  "message": "Product added to cart.",
  "item": {
    "itemId": "ci003",
    "productId": "p001",
    "quantity": 2
  }
}
```

### Error Example
```json
{ "error": "Quantity must be at least 1." }
```

---

## 2.2 **PUT `/cart/items/:itemId`**

Update the quantity of an existing cart item.

| Success | Error(s) |
|---------|----------|
| **200 OK** | **400** – invalid quantity<br>**401** – unauthenticated<br>**404** – item not found |

### Request Body
```json
{
  "quantity": 3
}
```

### Success Response 200
```json
{
  "message": "Cart item updated.",
  "item": {
    "itemId": "ci003",
    "quantity": 3
  }
}
```

---

## 2.3 **DELETE `/cart/items/:itemId`**

Remove an item from the cart.

| Success | Error(s) |
|---------|----------|
| **200 OK** | **401** – unauthenticated<br>**404** – item not found |

### Success Response 200
```json
{ "message": "Product removed from cart." }
```

---

# 3. Clear Cart

## 3.1 **DELETE `/cart/clear`**

Delete **all** items from the consumer’s cart (used after successful checkout).

| Success | Error(s) |
|---------|----------|
| **200 OK** | **401** – unauthenticated |

### Success Response 200
```json
{ "message": "Cart cleared successfully." }
```

---

# ❌ Unified Error Format

```json
{ "error": "Human‑readable message here" }
```

---

# ✅ Scope Coverage Summary

* **Full item CRUD**: add, update, delete, clear  
* **Cart retrieval** with pagination  
* **Totals endpoint** for checkout preview (subtotal, tax, total)  
* **Role enforcement**: consumer token required  
* **Consistent error handling** across all routes  
* **Schema fields**: itemId, productId, quantity, price, addedAt, subtotal, totalItems
