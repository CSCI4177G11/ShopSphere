# 👤 user-service API Overview

This service manages user profile data for both consumers and vendors (authentication is handled separately).

## 📍 Base URL
```
/user
```

---

## 📌 API Endpoints

### 1. GET `/consumer/:id`
**Retrieve consumer profile by ID.**

✅ **Response: 200 OK**
```json
{
  "consumerId": "u123",
  "phoneNumber": "+19021234567",
  "addresses": [
    {
      "label": "Home",
      "line1": "123 Main St",
      "city": "Halifax",
      "postalCode": "B3H 1Y4",
      "country": "CA"
    }
  ],
  "stripeCustomerId": "cus_abc123"
}
```

❌ **Errors**
- 404 Not Found: Consumer not found

---

### 2. PUT `/consumer/:id`
**Update or add phone number and addresses for a consumer.**

📦 **Request Body**
```json
{
  "phoneNumber": "+19025556666",
  "address": {
    "label": "Home",
    "line1": "456 New St",
    "city": "Halifax",
    "postalCode": "B3H 2Y6",
    "country": "CA"
  }
}
```

✅ **Response: 200 OK**
```json
{
  "message": "Consumer profile updated successfully",
  "consumer": {
    "consumerId": "u123",
    "phoneNumber": "+19025556666",
    "addresses": [
      {
        "label": "Home",
        "line1": "456 New St",
        "city": "Halifax",
        "postalCode": "B3H 2Y6",
        "country": "CA"
      }
    ]
  }
}
```

ℹ️ **Notes**
- New phone number will be added if missing.
- Address with the same label is updated, otherwise appended.

❌ **Errors**
- 400 Bad Request: Invalid input
- 404 Not Found: Consumer not found

---

### 3. GET `/vendor/:id`
**Retrieve vendor profile by ID.**

✅ **Response: 200 OK**
```json
{
  "vendorId": "v456",
  "storeName": "Tailor Threads",
  "location": "Halifax",
  "phoneNumber": "+19027778888",
  "logoUrl": "https://cdn.app.com/logo.png",
  "storeBannerUrl": "https://cdn.app.com/banner.png",
  "rating": 4.8,
  "socialLinks": {
    "instagram": "@tailorthreads"
  }
}
```

❌ **Errors**
- 404 Not Found: Vendor not found

---

### 4. PUT `/vendor/:id`
**Update vendor profile.**

📦 **Request Body**
```json
{
  "storeName": "New Tailor Threads",
  "location": "Dartmouth",
  "logoUrl": "https://cdn.app.com/newlogo.png",
  "storeBannerUrl": "https://cdn.app.com/newbanner.png",
  "phoneNumber": "+19028889999",
  "socialLinks": {
    "instagram": "@newtailor"
  }
}
```

✅ **Response: 200 OK**
```json
{
  "message": "Vendor profile updated successfully"
}
```

❌ **Errors**
- 400 Bad Request: Invalid input
- 404 Not Found: Vendor not found

---

### 5. PUT `/vendor/:id/approve`
**Admin approves vendor visibility and store management.**

📦 **Request Body**
```json
{
  "isApproved": true
}
```

✅ **Response: 200 OK**
```json
{
  "message": "Vendor approval status updated.",
  "vendor": {
    "vendorId": "v456",
    "isApproved": true
  }
}
```

❌ **Errors**
- 400 Bad Request: Missing or invalid data
- 404 Not Found: Vendor not found

---

## ❌ Standard Error Format

```json
{
  "error": "Error message here"
}
```

**Common Errors**
- 400 Bad Request: Invalid or missing input data
- 404 Not Found: Resource does not exist

---

## ✅ Scope Coverage Summary

✔ User Profile Management:
- Consumers manage phone numbers and multiple addresses
- Vendors manage store profile and business information
- Admins can be identified and elevated by userId

✔ Vendor Approval System:
- Vendors require admin approval via isApproved field

✔ Payment Integration Support:
- Stores stripeCustomerId for consumer payment linkage

✔ Fields Supported:
- consumerId, address, phoneNumber, stripeCustomerId
- vendorId, isApproved, storeName, location, storeDescription, logoUrl, storeBannerUrl, rating, socialLinks
- adminId
