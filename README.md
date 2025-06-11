# 🛍 **product‑service API**

Central service for **all product operations** in ShopSphere.  
Authentication is handled by `auth-service`; vendor/admin authorization is enforced by middleware in this service.  
Reviews & ratings require the user to be authenticated as a **consumer**.

**Base path:** `/api/product`

---


# 1. Vendor / Admin Operations

## 1.1 **POST `/product`**

Create a new product.

| Success | Error(s) |
|---------|----------|
| **201 Created** | **400 Bad Request** – invalid fields<br>**401 Unauthorized** – not logged in<br>**403 Forbidden** – not vendor/admin |

### Request Body
```json
{
  "vendorId": "v123",
  "name": "Custom Cotton Shirt",
  "description": "100% cotton shirt in multiple sizes",
  "price": 39.99,
  "quantityInStock": 100,
  "images": ["https://cdn.app.com/images/product1.jpg"],
  "tags": ["shirt", "cotton", "clothing"],
  "isPublished": false
}
```

### Success Response 201
```json
{
  "message": "Product created successfully.",
  "productId": "p001"
}
```

---

## 1.2 **PUT `/product/:id`**

Update **any** product field.

| Success | Error(s) |
|---------|----------|
| **200 OK** | **400** – malformed body<br>**401** – unauthenticated<br>**403** – not owner / not admin<br>**404** – product not found |

### Example Request Body
```json
{
  "name": "Premium Cotton Shirt",
  "description": "Softer, thicker 100 % cotton shirt in all sizes",
  "price": 44.99,
  "quantityInStock": 80,
  "images": [
    "https://cdn.app.com/images/product1.jpg",
    "https://cdn.app.com/images/product1-alt.jpg"
  ],
  "tags": ["shirt", "cotton", "premium"],
  "isPublished": true
}
```

### Success Response 200
```json
{ "message": "Product updated successfully." }
```

---

## 1.3 **DELETE `/product/:id`**

Remove a product.

| Success | Error(s) |
|---------|----------|
| **200 OK** | **401** – unauthenticated<br>**403** – not owner / not admin<br>**404** – product not found |

### Success Response 200
```json
{ "message": "Product deleted successfully." }
```

---

# 2. Consumer‑Facing Catalogue

## 2.1 **GET `/product`**

Paginated catalogue with optional filters.

### Query Parameters
```
?page=1&limit=20&minPrice=10&maxPrice=50&tags=shirt,cotton&sort=price:asc
```

| Success | Error(s) |
|---------|----------|
| **200 OK** | **400** – bad query value |

### Success Response 200
```json
{
  "page": 1,
  "limit": 20,
  "total": 137,
  "products": [
    {
      "productId": "p001",
      "name": "Custom Cotton Shirt",
      "price": 39.99,
      "thumbnail": "https://cdn.app.com/images/product1-thumb.jpg",
      "averageRating": 4.3,
      "reviewCount": 12
    }
  ]
}
```

---

## 2.2 **GET `/product/:id`**

Full product details (now includes aggregated rating & review count).

| Success | Error(s) |
|---------|----------|
| **200 OK** | **404** – product not found |

### Success Response 200
```json
{
  "productId": "p001",
  "vendorId": "v123",
  "name": "Custom Cotton Shirt",
  "description": "100% cotton shirt in multiple sizes",
  "price": 39.99,
  "quantityInStock": 100,
  "images": ["https://cdn.app.com/images/product1.jpg"],
  "tags": ["shirt", "cotton"],
  "averageRating": 4.3,
  "reviewCount": 12,
  "isPublished": true,
  "createdAt": "2025-06-11T18:00:00Z"
}
```

(Other browse endpoints remain unchanged; they now optionally surface `averageRating` and `reviewCount` fields.)

---

# 3. Reviews & Ratings

Each review contains a **rating (1‑5)** and an optional **text comment**.  
Users may create **one review per product** but can update or delete their own review.  
Admins may update/delete any review.

## 3.1 **POST `/product/:id/reviews`**

Create a review.

| Success | Error(s) |
|---------|----------|
| **201 Created** | **400** – rating outside 1‑5<br>**401** – unauthenticated<br>**409** – review already exists |

### Request Body
```json
{
  "rating": 5,
  "comment": "Loved the fabric quality!"
}
```

### Success Response 201
```json
{
  "message": "Review submitted.",
  "review": {
    "reviewId": "r789",
    "userId": "u123",
    "rating": 5,
    "comment": "Loved the fabric quality!",
    "createdAt": "2025-06-11T18:30:00Z"
  },
  "newAverageRating": 4.4,
  "newReviewCount": 13
}
```

---

## 3.2 **GET `/product/:id/reviews`**

List reviews (paginated).

### Query Parameters
```
?page=1&limit=10&sort=createdAt:desc
```

| Success | Error(s) |
|---------|----------|
| **200 OK** | **404** – product not found |

### Success Response 200
```json
{
  "page": 1,
  "limit": 10,
  "total": 13,
  "reviews": [
    {
      "reviewId": "r789",
      "userId": "u123",
      "username": "abdullah123",
      "rating": 5,
      "comment": "Loved the fabric quality!",
      "createdAt": "2025-06-11T18:30:00Z"
    }
  ]
}
```

---

## 3.3 **PUT `/product/:id/reviews/:reviewId`**

Update own review.

| Success | Error(s) |
|---------|----------|
| **200 OK** | **400** – invalid rating<br>**401** – unauthenticated<br>**403** – not review owner / not admin<br>**404** – review not found |

### Request Body
```json
{
  "rating": 4,
  "comment": "After washing, still great quality."
}
```

### Success Response 200
```json
{
  "message": "Review updated.",
  "review": {
    "reviewId": "r789",
    "rating": 4,
    "comment": "After washing, still great quality.",
    "updatedAt": "2025-06-12T10:05:00Z"
  },
  "newAverageRating": 4.2
}
```

---

## 3.4 **DELETE `/product/:id/reviews/:reviewId`**

Delete own review.

| Success | Error(s) |
|---------|----------|
| **204 No Content** | **401** – unauthenticated<br>**403** – not owner / not admin<br>**404** – review not found |

_No body on success._

---

# ❌ Unified Error Format

```json
{ "error": "Human‑readable message here" }
```

---

# ✅ Scope Coverage Summary

* **Vendor / admin CRUD** with full‑field updates  
* **Public browsing**: catalogue, free‑text search, trending, featured, related, vendor listings  
* **Consumer review & rating** workflow with aggregation  
* **Role enforcement**:  
  * **Vendor / Admin** for product CRUD  
  * **Consumer** for review CRUD  
* **Consistent error handling** across all routes  
* **Schema fields**: productId, vendorId, name, description, price, quantityInStock, images, tags, averageRating, reviewCount, rating (per review), isPublished, createdAt
