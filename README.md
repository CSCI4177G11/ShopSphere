# 🛍 product-service API Overview

This service manages all product-related operations in the multi-vendor e-commerce platform.

## 📍 Base URL
```
/product
```

---

## 📌 API Endpoints

### 1. POST `/create`
**Create a new product (Vendor Only).**

📦 **Request Body**
```json
{
  "vendorId": "v123",
  "name": "Custom Cotton Shirt",
  "description": "100% cotton shirt in multiple sizes",
  "category": "Clothing",
  "price": 39.99,
  "quantityInStock": 100,
  "images": ["https://cdn.app.com/images/product1.jpg"],
  "tags": ["shirt", "cotton", "clothing"],
  "isPublished": false
}
```

✅ **Response: 201 Created**
```json
{
  "message": "Product created successfully.",
  "productId": "p001"
}
```

---

### 2. PUT `/update/:productId`
**Update an existing product (Vendor Only).**

📦 **Request Body**
```json
{
  "name": "Premium Cotton Shirt",
  "price": 44.99,
  "quantityInStock": 80,
  "isPublished": true
}
```

✅ **Response: 200 OK**
```json
{
  "message": "Product updated successfully."
}
```

---

### 3. DELETE `/delete/:productId`
**Delete a product (Vendor Only).**

✅ **Response: 200 OK**
```json
{
  "message": "Product deleted successfully."
}
```

---

### 4. GET `/vendor/:vendorId`
**Retrieve all products for a specific vendor.**

✅ **Response: 200 OK**
```json
[
  {
    "productId": "p001",
    "name": "Custom Cotton Shirt",
    "price": 39.99,
    "quantityInStock": 100,
    "isPublished": true
  }
]
```

---

### 5. GET `/catalog`
**Product catalog for consumers/guests with filtering.**

🔎 **Query Params**
```
?name=Uniqlo&category=Clothing&minPrice=10&maxPrice=50&tags=shirt&minRating=2&maxRating=4
```

✅ **Response: 200 OK**
```json
[
  {
    "productId": "p001",
    "name": "Custom Cotton Shirt",
    "price": 39.99,
    "images": ["https://cdn.app.com/images/product1.jpg"],
    "rating": 4.5
  }
]
```

---

### 6. GET `/detail/:productId`
**Retrieve full product details.**

✅ **Response: 200 OK**
```json
{
  "productId": "p001",
  "name": "Custom Cotton Shirt",
  "description": "100% cotton shirt in multiple sizes",
  "price": 39.99,
  "images": ["https://cdn.app.com/images/product1.jpg"],
  "category": "Clothing",
  "tags": ["shirt", "cotton"],
  "rating": 4.5,
  "vendorId": "v123"
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
- 401 Unauthorized: Unauthorized vendor-only access
- 403 Forbidden: Accessing another vendor’s product
- 404 Not Found: Product does not exist

---

## ✅ Scope Coverage Summary

✔ Vendor Product Management:
- Add/update/delete products
- Manage publication status
- Access personal product list

✔ Product Catalog with Search & Filtering:
- `/catalog` supports category, price, and tags

✔ Product Detail View:
- `/detail/:id` shows full product info with vendor reference

✔ Role-Based Access (enforced via middleware)

✔ Data in schema:
- ✅ All fields (productId, vendorId, name, description, category, price, stock, images, tags, rating, isPublished) are covered.
