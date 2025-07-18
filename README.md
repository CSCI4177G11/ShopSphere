# 📊 analytics-service API

Provides sales analytics, history, and forecasting for ShopSphere vendors and admins.  
The service fetches order data from order-service (`/api/orders` endpoint) — no schema duplication, no extra events.  
Results are cached in an embedded DuckDB database (fast OLAP in-process) and exposed through a small HTTP API.  
For forecasts, it pipes the aggregated time-series into Facebook Prophet (or statsmodels SARIMAX if Prophet is unavailable).

**Base path**: `/api/analytics`

---

## 0. Service Health

**GET** `/analytics/health`  
Check if the analytics service and its DuckDB store are running.

| Success | Error(s)           |
|---------|--------------------|
| 200 OK  | 500 – server error |

**Response 200**
```json
{
  "service": "analytics",
  "status": "up",
  "uptime_seconds": "123.45",
  "checked_at": "2025-07-18T14:25:31.789Z",
  "db_path": "/var/lib/analytics/analytics.duckdb"
}
```

---

## 1. Vendor-Facing Analytics

All routes below require `Authorization: Bearer <JWT>`; role `vendor` or `admin` is enforced.  
The service internally calls `GET /api/orders` with `vendorId` + date filters to obtain fresh order rows, then derives `revenue = Σ (price × qty)` from `orderItems`.

### 1.1 GET /analytics/vendor/summary

Returns KPI cards (total revenue, orders, units sold, unique customers) for the authenticated vendor.

**Query Parameters**  
`?from=2025-06-01&to=2025-06-30`

| Success | Error(s)             |
|---------|----------------------|
| 200 OK  | 401 – unauthenticated |

**Response 200**
```json
{
  "vendorId": "v456",
  "from": "2025-06-01",
  "to": "2025-06-30",
  "totalRevenue": 15894.30,
  "orders": 352,
  "unitsSold": 1174,
  "uniqueCustomers": 287,
  "_links": {
    "topProducts": "/api/analytics/vendor/top-products?limit=10&from=2025-06-01&to=2025-06-30",
    "forecast": "/api/analytics/vendor/forecast?metric=revenue&months=3"
  }
}
```

### 1.2 GET /analytics/vendor/top-products

Top-N products by revenue or quantity within a time window.

**Query Parameters**  
`?limit=10&metric=revenue&from=2025-06-01&to=2025-06-30`

| Success | Error(s)         |
|---------|------------------|
| 200 OK  | 400 – bad metric |

**Response 200**
```json
{
  "vendorId": "v456",
  "metric": "revenue",
  "from": "2025-06-01",
  "to": "2025-06-30",
  "products": [
    { "productId": "p789", "name": "Premium Cotton Shirt", "unitsSold": 420, "revenue": 8190.00 },
    { "productId": "p790", "name": "Linen Shorts", "unitsSold": 300, "revenue": 5100.00 }
  ]
}
```

### 1.3 GET /analytics/vendor/customer-trends

Breaks down first-time vs returning customers per chosen interval.

**Query Parameters**  
`?interval=month&from=2024-07-01&to=2025-06-30`

| Success | Error(s)          |
|---------|-------------------|
| 200 OK  | 400 – bad interval |

**Response 200**
```json
{
  "vendorId": "v456",
  "interval": "month",
  "series": [
    { "period": "2025‑04", "newCustomers": 41, "returningCustomers": 63 },
    { "period": "2025‑05", "newCustomers": 47, "returningCustomers": 70 }
  ]
}
```

### 1.4 GET /analytics/vendor/forecast

Predicts future revenue or order count using Prophet.

**Query Parameters**  
`?metric=revenue&months=3`

| Success | Error(s)                       |
|---------|--------------------------------|
| 200 OK  | 400 – unsupported metric       |
|         | 503 – model training failed    |

**Response 200**
```json
{
  "vendorId": "v456",
  "metric": "revenue",
  "forecastHorizonMonths": 3,
  "points": [
    { "period": "2025‑08", "predicted": 19000.12, "lower": 17250.55, "upper": 20890.33 },
    { "period": "2025‑09", "predicted": 20540.87, "lower": 18410.11, "upper": 22870.44 }
  ]
}
```

---

## 2. Admin-Level Analytics

Admins can add `vendorId=*` (default) or a specific vendorId to any vendor endpoint to get cross-vendor stats.

Example:  
`GET /api/analytics/vendor/summary?vendorId=*`  
returns aggregated revenue across all vendors. Non-admin calls with `vendorId=*` return 403.

---

## 3. How the Service Works (Internal)

| Stage   | Tool / Lib            | Purpose                                 |
|---------|------------------------|-----------------------------------------|
| Fetch   | Axios                 | Pull orders page-by-page via /api/orders |
| Store   | DuckDB (.parquet)     | Column-store OLAP; handles multi-GB data |
| Transform | SQL + Pandas       | Window functions, GROUP BY, joins        |
| Serve   | Fastify (Node.js)     | Lightweight HTTP layer, JWT middleware   |
| Forecast | Prophet / SARIMAX   | Time-series prediction                   |

A cron (`ANALYTICS_REFRESH_CRON`, default `*/15 * * * *`) re-syncs new orders; real-time endpoints optionally trigger an incremental pull if the cache is older than `CACHE_TTL_SECONDS` (default 300).

---

## 4. Config

| Env Var                | Default                                 | Description                       |
|------------------------|------------------------------------------|-----------------------------------|
| ORDER_SERVICE_URL      | http://order-service:4300                | Base URL for /api/orders          |
| ANALYTICS_DB_PATH      | /var/lib/analytics/analytics.duckdb      | DuckDB file                       |
| ANALYTICS_REFRESH_CRON | */15 * * * *                             | How often to pull fresh orders    |
| CACHE_TTL_SECONDS      | 300                                      | Max age before auto-refresh       |
| FORECAST_HORIZON_MONTHS| 6                                        | Cap for /forecast endpoint        |

---

## 5. Error Handling

All endpoints return errors in:

```json
{ "error": "Human-readable message." }
```

- 400: invalid query  
- 401: unauthenticated / expired token  
- 403: forbidden (role mismatch / vendorId=*)  
- 404: resource not found  
- 500: internal error (DB, order-service down)  
- 503: forecasting library unavailable  

---

## 6. Endpoint Summary Table

| Endpoint                          | Method | Who Can Use   | Auth? | Main Use Case               |
|----------------------------------|--------|----------------|-------|-----------------------------|
| /analytics/health                | GET    | All            | No    | Service health check        |
| /analytics/vendor/summary       | GET    | Vendor/Admin   | Yes   | KPI cards                   |
| /analytics/vendor/top-products  | GET    | Vendor/Admin   | Yes   | Top sellers                 |
| /analytics/vendor/customer-trends | GET  | Vendor/Admin   | Yes   | New vs returning customers  |
| /analytics/vendor/forecast      | GET    | Vendor/Admin   | Yes   | Revenue / orders forecast   |

---

## ✅ Scope Coverage

- Historical & real-time stats by querying order-service on-demand  
- Vendor isolation via JWT vendorId matching  
- Admin roll-ups across all vendors with optional filter  
- Forecasting via Prophet with seasonality components  
- Zero new endpoints on other services – relies on existing `/orders` API  

Implementing this README-compliant analytics-service gives your vendors actionable insights while keeping the overall architecture simple and maintainable.
