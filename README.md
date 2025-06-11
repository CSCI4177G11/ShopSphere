# 👤 **user‑service API**

Manages **consumer** and **vendor** profile data for ShopSphere  
**Authentication / token validation is handled by `auth-service`.**

**Base path:** 
```
/api/user
```


---

# 1. Consumer Profile

## 1.1 **GET `/consumer/profile`**

Returns the authenticated consumer’s complete profile.

| Success | Error(s) |
|---------|----------|
| **200 OK** | **401 Unauthorized** – token missing / invalid |

### Headers
```
Authorization: Bearer <token>
```

### Success Response
```json
{
  "consumerId": "u123",
  "fullName": "Abdullah Al Salmi",
  "phoneNumber": "+19021234567",
  "addresses": [
    {
      "addressId": "a1",
      "label": "Home",
      "line1": "123 Main St",
      "city": "Halifax",
      "postalCode": "B3H 1Y4",
      "country": "CA"
    }
  ],
  "createdAt": "2025-06-11T17:45:00Z"
}
```

### Error Example
```json
{ "error": "Authentication required." }
```

---

## 1.2 **PUT `/consumer/profile`**

Update personal fields (phone, username, email).

| Success | Error(s) |
|---------|----------|
| **200 OK** | **400 Bad Request** – invalid data<br>**404 Not Found** – consumer not found |

### Request Body
```json
{
  "fullName": "Asaad Al Salmi",
  "phoneNumber": "+19025556666"
}
```

### Success Response
```json
{
  "message": "Consumer profile updated successfully",
  "consumer": {
    "consumerId": "u123",
    "fullName": "Asaad Al Salmi",
    "phoneNumber": "+19025556666"
  }
}
```

### Error Example
```json
{ "error": "Invalid email format." }
```

---

# 2. Consumer Settings

## 2.1 **GET `/consumer/settings`**

Fetch user preference flags 

| Success | Error(s) |
|---------|----------|
| **200 OK** | **401 Unauthorized** |

### Success Response
```json
{
  "theme": "dark"
}
```

---

## 2.2 **PUT `/consumer/settings`**

Update preference flags.

| Success | Error(s) |
|---------|----------|
| **200 OK** | **400 Bad Request** – invalid keys<br>**401 Unauthorized** |

### Request Body
```json
{
  "theme": "light"
}
```

### Success Response
```json
{
  "message": "Settings updated."
}
```

---

# 3. Consumer Addresses

| Method & Path | Purpose |
|---------------|---------|
| **POST `/consumer/addresses`** | Add a new address |
| **GET `/consumer/addresses`** | List all addresses |
| **PUT `/consumer/addresses/:id`** | Update existing address |
| **DELETE `/consumer/addresses/:id`** | Remove address |

---

### 3.1 **POST `/consumer/addresses`**

| Success | Error(s) |
|---------|----------|
| **201 Created** | **400 Bad Request** |

#### Request Body
```json
{
  "label": "Office",
  "line1": "789 Work Ave",
  "city": "Halifax",
  "postalCode": "B3H 3Z1",
  "country": "CA"
}
```

#### Success Response
```json
{
  "message": "Address added.",
  "address": {
    "addressId": "a2",
    "label": "Office",
    "line1": "789 Work Ave",
    "city": "Halifax",
    "postalCode": "B3H 3Z1",
    "country": "CA"
  }
}
```

---

### 3.2 **GET `/consumer/addresses`**

| Success | Error(s) |
|---------|----------|
| **200 OK** | **401 Unauthorized** |

#### Success Response
```json
{
  "addresses": [
    {
      "addressId": "a1",
      "label": "Home",
      "line1": "123 Main St",
      "city": "Halifax",
      "postalCode": "B3H 1Y4",
      "country": "CA"
    },
    {
      "addressId": "a2",
      "label": "Office",
      "line1": "789 Work Ave",
      "city": "Halifax",
      "postalCode": "B3H 3Z1",
      "country": "CA"
    }
  ]
}
```

---

### 3.3 **PUT `/consumer/addresses/:id`**

| Success | Error(s) |
|---------|----------|
| **200 OK** | **400 Bad Request**<br>**404 Not Found** – address missing |

#### Request Body
```json
{
  "label": "Office",
  "line1": "789 Work Ave",
  "city": "Halifax",
  "postalCode": "B3H 3Z1",
  "country": "CA"
}
```

#### Success Response
```json
{
  "message": "Address updated.",
  "address": {
    "addressId": "a2",
    "label": "Office",
    "line1": "789 Work Ave",
    "city": "Halifax",
    "postalCode": "B3H 3Z1",
    "country": "CA"
  }
}
```

---

### 3.4 **DELETE `/consumer/addresses/:id`**

| Success | Error(s) |
|---------|----------|
| **204 No Content** | **404 Not Found** |

_No body on success._

---

# 4. Vendor Profile

## 4.1 **GET `/vendor/profile`**

Returns vendor profile (for the authenticated vendor).

| Success | Error(s) |
|---------|----------|
| **200 OK** | **401 Unauthorized** |

### Success Response
```json
{
  "vendorId": "v456",
  "storeName": "Tailor Threads",
  "location": "Halifax",
  "phoneNumber": "+19027778888",
  "logoUrl": "https://cdn.app.com/logo.png",
  "storeBannerUrl": "https://cdn.app.com/banner.png",
  "rating": 4.8,
  "isApproved": true,
  "socialLinks": {
    "instagram": "@tailorthreads"
  }
}
```

---

## 4.2 **PUT `/vendor/profile`**

Update vendor public details.

| Success | Error(s) |
|---------|----------|
| **200 OK** | **400 Bad Request**<br>**401 Unauthorized** |

### Request Body
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

### Success Response
```json
{
  "message": "Vendor profile updated successfully."
}
```

---

## 4.3 **PUT `/vendor/settings`**

Update preference flags.

| Success | Error(s) |
|---------|----------|
| **200 OK** | **400 Bad Request** – invalid keys<br>**401 Unauthorized** |

### Request Body
```json
{
  "theme": "light"
}
```

### Success Response
```json
{
  "message": "Settings updated."
}
```

---

## 4.4 **PUT `/vendor/settings`**

Update preference flags.

| Success | Error(s) |
|---------|----------|
| **200 OK** | **400 Bad Request** – invalid keys<br>**401 Unauthorized** |

### Request Body
```json
{
  "theme": "light"
}
```

### Success Response
```json
{
  "message": "Settings updated."
}
```

---

## 4.5 **PUT `/vendor/:id/approve`**
Admin approves vendor visibility and store management.

| Success | Error(s) |
|---------|----------|
| **200 OK** | **400 Bad Request** – invalid keys <br> **401 Unauthorized** |

### Request Body
```json
{
  "isApproved": true
}
```

### Success Response
```json
{
  "message": "Vendor approval status updated.",
  "vendor": {
    "vendorId": "v456",
    "isApproved": true
  }
}
```
---

# ❌ Unified Error Format

```json
{ "error": "Human‑readable message here" }
```
---
# ✅ Scope Coverage Summary

- **Consumer profile & settings**
- **Address CRUD**
- **Vendor profile & settings** (including admin approval)
- Consistent error handling and token‑protected routes


