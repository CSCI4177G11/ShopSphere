# 📦 order-service API Overview

This service handles consumer orders, each associated with one vendor. Orders are created after successful payment and contain snapshots of product and address data for historical integrity.

## 📍 Base URL
```
/order
```

---

## 📌 API Endpoints

### 1. POST `/create`
**Create orders per vendor after payment.**

📦 **Request Body**
```json
{
  "consumerId": "u123",
  "paymentId": "pi_abc123",
  "paymentStatus": "succeeded",
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

✅ **Response: 201 Created**
```json
{
  "message": "Orders created successfully.",
  "orderIds": ["ord_001", "ord_002"]
}
```

---

### 2. GET `/consumer/:consumerId`
**Retrieve all orders placed by a specific consumer.**

✅ **Response: 200 OK**
```json
[
  {
    "orderId": "ord_001",
    "vendorId": "v101",
    "orderItems": [
      { "productId": "p1", "quantity": 2, "price": 14.99 }
    ],
    "subtotalAmount": 29.98,
    "orderStatus": "shipped",
    "createdAt": "2025-05-31T12:30:00Z"
  }
]
```

---

### 3. GET `/vendor/:vendorId`
**Retrieve all orders received by a specific vendor.**

✅ **Response: 200 OK**
```json
[
  {
    "orderId": "ord_002",
    "consumerId": "u123",
    "orderItems": [
      { "productId": "p2", "quantity": 1, "price": 29.99 }
    ],
    "subtotalAmount": 29.99,
    "orderStatus": "pending",
    "createdAt": "2025-05-31T12:30:00Z"
  }
]
```

---

### 4. PUT `/update-status/:orderId`
**Update the status of a specific order (Vendor only).**

📦 **Request Body**
```json
{
  "orderStatus": "shipped"
}
```

✅ **Response: 200 OK**
```json
{
  "message": "Order status updated successfully."
}
```

---

### 5. GET `/detail/:orderId`
**Get full details of a specific order.**

✅ **Response: 200 OK**
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
  "createdAt": "2025-05-31T12:30:00Z",
  "updatedAt": "2025-05-31T13:00:00Z"
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
- 400 Bad Request: Invalid or missing fields
- 404 Not Found: Order or user does not exist
- 403 Forbidden: Unauthorized update attempt

---

## ✅ Scope Coverage Summary
✔ Order Management:
- Orders created per vendor after payment
- Full support for history tracking with snapshots

✔ Order Tracking:
- Vendors and consumers can view & manage their orders
- `/update-status` allows tracking fulfillment

✔ Secure Order Creation:
- Only occurs after successful payment
- Includes payment reference and shipping info

✔ Role-Based View:
- `/consumer/:id` and `/vendor/:id` scoped by role

✔ All Fields Covered:
- orderId, consumerId, vendorId, orderItems, subtotalAmount, paymentId, paymentStatus,
  orderStatus, shippingAddress, createdAt, updatedAt

