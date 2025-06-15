# 📦 **order‑service API**

Responsible for **order lifecycle** in ShopSphere.  
Orders are created **only after successful payment** (verified by `payment-service`).  
Role enforcement:  
* **Consumer** – view own orders, cancel pending orders  
* **Vendor** – view orders they need to fulfil, update status  
* **Admin** – full access to every order

**Base path:** `/api/orders`

---


# 1. Order Creation

## 1.1 **POST `/orders`**

Creates **one order per vendor** contained in the cart.

| Success | Error(s) |
|---------|----------|
| **201 Created** | **400** – malformed payload<br>**401** – unauthenticated<br>**402** – payment failed<br>**404** – consumer / vendor / product not found |

### Request Body
```json
{
  "consumerId": "u123",
  "paymentId": "pi_abc123",
  "orders": [
    {
      "vendorId": "v101",
      "orderItems": [
        { "productId": "p1", "quantity": 2, "price": 14.99 },
        { "productId": "p2", "quantity": 1, "price": 29.99 }
      ],
      "subtotalAmount": 59.97,
      "shippingAddress": {
        "line1": "123 Main St",
        "city": "Halifax",
        "postalCode": "B3H 1Y4",
        "country": "CA"
      }
    }
  ]
}
```

### Success Response 201
```json
{
  "message": "Orders created successfully.",
  "orderIds": ["ord_001"]
}
```

---

# 2. Browse / Retrieve Orders

## 2.1 **GET `/orders`** (Admin)

Return all orders with optional filters.

### Query Params
```
?status=shipped&vendorId=v101&userId=u123&page=1&limit=50
```

| Success | Error(s) |
|---------|----------|
| **200 OK** | **401** – unauthenticated<br>**403** – not admin |

### Success Response 200
```json
{
  "page": 1,
  "limit": 50,
  "total": 3,
  "orders": [
    {
      "orderId": "ord_001",
      "consumerId": "u123",
      "vendorId": "v101",
      "orderStatus": "shipped",
      "subtotalAmount": 59.97,
      "createdAt": "2025-06-11T19:00:00Z"
    }
  ]
}
```

---

## 2.2 **GET `/orders/user/:userId`**

Retrieve orders for a consumer (self or admin).

| Success | Error(s) |
|---------|----------|
| **200 OK** | **401** – unauthenticated<br>**403** – forbidden other user (if not admin) |

### Success Response 200
```json
[
  {
    "orderId": "ord_001",
    "vendorId": "v101",
    "orderStatus": "processing",
    "subtotalAmount": 59.97,
    "createdAt": "2025-06-11T19:00:00Z"
  }
]
```

---

## 2.3 **GET `/orders/vendor/:vendorId`**

Vendor’s received orders.

| Success | Error(s) |
|---------|----------|
| **200 OK** | **401** – unauthenticated<br>**403** – accessing another vendor |

### Success Response 200
```json
[
  {
    "orderId": "ord_001",
    "consumerId": "u123",
    "orderStatus": "processing",
    "subtotalAmount": 59.97,
    "createdAt": "2025-06-11T19:00:00Z"
  }
]
```

---

## 2.4 **GET `/orders/:id`**

Full detail (consumer, vendor, or admin access as permitted).

| Success | Error(s) |
|---------|----------|
| **200 OK** | **401** – unauthenticated<br>**403** – forbidden (not your order)<br>**404** – order not found |

### Success Response 200
```json
{
  "orderId": "ord_001",
  "consumerId": "u123",
  "vendorId": "v101",
  "orderItems": [
    { "productId": "p1", "quantity": 2, "price": 14.99 }
  ],
  "subtotalAmount": 29.98,
  "paymentId": "pi_abc123",
  "paymentStatus": "succeeded",
  "orderStatus": "shipped",
  "shippingAddress": {
    "line1": "123 Main St",
    "city": "Halifax",
    "postalCode": "B3H 1Y4",
    "country": "CA"
  },
  "createdAt": "2025-06-11T19:00:00Z",
  "updatedAt": "2025-06-12T09:10:00Z"
}
```

---

# 3. Order Lifecycle Actions

## 3.1 **PUT `/orders/:id/status`** (Vendor / Admin)

Update status (`processing`, `shipped`, `delivered`, etc.).

| Success | Error(s) |
|---------|----------|
| **200 OK** | **400** – invalid status<br>**401** – unauthenticated<br>**403** – not vendor of order / not admin<br>**404** – order not found |

### Request Body
```json
{ "orderStatus": "shipped" }
```

### Success Response 200
```json
{ "message": "Order status updated successfully." }
```

---

## 3.2 **POST `/orders/:id/cancel`** (Consumer / Admin)

Consumer can cancel while status is `pending` or `processing`.

| Success | Error(s) |
|---------|----------|
| **200 OK** | **400** – cannot cancel current status<br>**401** – unauthenticated<br>**403** – not owner / not admin<br>**404** – order not found |

### Request Body _(optional)_
```json
{ "reason": "Ordered by mistake." }
```

### Success Response 200
```json
{
  "message": "Order cancelled.",
  "orderStatus": "cancelled"
}
```

---

## 3.3 **GET `/orders/:id/tracking`**

Return chronological status updates for shipment tracking.

| Success | Error(s) |
|---------|----------|
| **200 OK** | **401** – unauthenticated<br>**403** – forbidden<br>**404** – order not found |

### Success Response 200
```json
{
  "orderId": "ord_001",
  "tracking": [
    { "status": "processing", "timestamp": "2025-06-11T19:00:00Z" },
    { "status": "shipped", "timestamp": "2025-06-12T08:00:00Z", "carrier": "Canada Post", "trackingNumber": "CP123456CA" },
    { "status": "out_for_delivery", "timestamp": "2025-06-13T07:30:00Z" }
  ]
}
```

---

# ❌ Unified Error Format

```json
{ "error": "Human‑readable message here" }
```

---

# ✅ Scope Coverage Summary

* **Order creation** post‑payment, split per vendor  
* **Role‑scoped retrieval** for consumers, vendors, admin  
* **Lifecycle actions**: status update, cancellation, tracking timeline  
* **Consistent error handling** across all routes  
* **Schema fields**: orderId, consumerId, vendorId, orderItems (productId, qty, price), subtotalAmount, paymentId, paymentStatus, orderStatus, shippingAddress, createdAt, updatedAt, tracking
