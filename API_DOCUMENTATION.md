# 🚀 TFAC Dashboard Backend API Specification Document

## 1. Authentication & Common Conventions

### **Headers**
All API endpoints require the following headers for authorization and content negotiation:

```http
Content-Type: application/json
secret_key: tfac-1108-dashboard
```
*(Or standard `Authorization: Bearer <JWT_TOKEN>` if implementing JWT auth).*

---

### **Standard Response Format**

#### **Success Response (Single / Mutation)**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

#### **Success Response (Paginated List)**
```json
{
  "success": true,
  "data": [ ... ],
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "totalItems": 48
}
```

#### **Error Response**
```json
{
  "success": false,
  "error": "Error description message",
  "code": "INVALID_PARAMS"
}
```

---

## 2. API Endpoints by Module

---

### 📊 Module 1: Dashboard Analytics & Overview

#### `GET /api/v1/tfac/dashboard/stats`
* **Purpose**: Fetch top KPI cards (Total Revenue, T-Shirts Sold, 3% Designer Royalties) and the Fund Allocation Breakdown chart.
* **Query Parameters**:
  * `month` (optional, string): Filter by month code (`jan`, `feb`, `mar`, ..., `dec`, or `all`). Default: `all`.
  * `year` (optional, number): Default `2026`.
* **Sample Response**:
```json
{
  "success": true,
  "data": {
    "period": "All Time (2026)",
    "totalRevenue": 186800,
    "totalTeesSold": 1868,
    "designerRoyaltiesTotal": 5604,
    "fundAllocation": [
      { "name": "Production & Operations", "percentage": 64, "amount": 119552, "description": "Fabric, printing, shipping", "color": "#f59e0b" },
      { "name": "Causes & Empowerment", "percentage": 15, "amount": 28020, "description": "Direct impact programs", "color": "#10b981" },
      { "name": "Community Powered", "percentage": 10, "amount": 18680, "description": "Giving young artists a platform", "color": "#6366f1" },
      { "name": "Growth & Innovation", "percentage": 8, "amount": 14944, "description": "Expanding our impact", "color": "#3b82f6" },
      { "name": "Designer Royalties", "percentage": 3, "amount": 5604, "description": "Supporting young artists", "color": "#f43f5e" }
    ]
  }
}
```

---

#### `GET /api/v1/tfac/dashboard/monthly-impact`
* **Purpose**: Provides monthly trend data for cause funds raised & T-shirts sold (Jan to Dec chart).
* **Sample Response**:
```json
{
  "success": true,
  "data": [
    { "month": "Jan", "causeFunds": 4500, "teesSold": 90 },
    { "month": "Feb", "causeFunds": 5200, "teesSold": 104 },
    { "month": "Mar", "causeFunds": 6100, "teesSold": 122 },
    { "month": "Apr", "causeFunds": 7400, "teesSold": 148 },
    { "month": "May", "causeFunds": 6800, "teesSold": 136 },
    { "month": "Jun", "causeFunds": 8200, "teesSold": 164 },
    { "month": "Jul", "causeFunds": 7900, "teesSold": 158 },
    { "month": "Aug", "causeFunds": 9100, "teesSold": 182 },
    { "month": "Sep", "causeFunds": 8500, "teesSold": 170 },
    { "month": "Oct", "causeFunds": 9800, "teesSold": 196 },
    { "month": "Nov", "causeFunds": 9400, "teesSold": 188 },
    { "month": "Dec", "causeFunds": 10500, "teesSold": 210 }
  ]
}
```

---

### 📦 Module 2: Orders Management

#### `GET /api/v1/tfac/get-orders`
* **Purpose**: Fetch paginated order transactions with search & status filters.
* **Query Parameters**:
  * `page` (number, default: `1`)
  * `limit` (number, default: `10`)
  * `search` (string, optional): Searches order ID, customer name, phone, email.
  * `status` (string, optional): `Success` | `Pending` | `Failed` (omitted for `all`).
  * `startDate` / `endDate` (string ISO, optional).
* **Sample Response**:
```json
{
  "success": true,
  "totalItems": 154,
  "totalPages": 16,
  "page": 1,
  "limit": 10,
  "data": [
    {
      "order_id": "#1011",
      "instamojo_payment_id": "MOJO2607X129",
      "payment_status": "Success",
      "customer_name": "Rakesh Rane",
      "customer_email": "rakesh0712@gmail.com",
      "customer_phone": "8390025632",
      "shipping_address": "102 Sunshine Towers, Bandra West, Mumbai",
      "pincode": "400050",
      "paid_amount": 849,
      "created_at": "2026-07-31T10:30:00Z",
      "payment_date": "2026-07-31T10:32:15Z",
      "product": {
        "id": 1,
        "name": "Stay in the Musical Trance",
        "size": "M",
        "price": 849,
        "quantity": 1,
        "image_url": "https://teesforacause.co/assets/shop-musical-trance-front.jpg"
      }
    }
  ]
}
```

---

#### `PATCH /api/v1/tfac/orders/:order_id/status`
* **Purpose**: Admin update of payment/order status.
* **Request Body**:
```json
{
  "payment_status": "Success"
}
```
* **Sample Response**:
```json
{
  "success": true,
  "message": "Order status updated to Success"
}
```

---

### 👕 Module 3: Products Catalog Management

#### `GET /api/v1/tfac/products`
* **Purpose**: Fetch all products catalog with per-size stock counts.
* **Sample Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "slug": "stay-in-the-musical-trance",
      "name": "Stay in the Musical Trance",
      "designer": "Deeksha Deulkar",
      "cause": "Mental Health & Hope",
      "price": 799,
      "discount": 0,
      "final_price": 799,
      "sizes": ["S", "M", "L", "XL"],
      "sizeStock": { "XS": 0, "S": 2, "M": 3, "L": 6, "XL": 2, "XXL": 0 },
      "isSoldOut": false,
      "image": "https://teesforacause.co/assets/shop-musical-trance-front.jpg",
      "images": [
        "https://teesforacause.co/assets/shop-musical-trance-front.jpg",
        "https://teesforacause.co/assets/shop-musical-trance-back.jpg"
      ],
      "productUrl": "https://teesforacause.co/product/stay-in-the-musical-trance",
      "description": "Designed by student artist Deeksha Deulkar, capturing raw emotion and power of music."
    }
  ]
}
```

---

#### `POST /api/v1/tfac/products`
* **Purpose**: Create a new product.
* **Request Body**:
```json
{
  "name": "Cosmic Serenity",
  "designer": "Sanya Mehta",
  "cause": "Youth Mental Well-being",
  "price": 899,
  "discount": 10,
  "sizeStock": { "XS": 0, "S": 5, "M": 10, "L": 8, "XL": 4, "XXL": 0 },
  "images": [
    "https://teesforacause.co/assets/shop-musical-trance-front.jpg"
  ],
  "description": "Abstract cosmic artwork representation of youth peace."
}
```

---

#### `PUT /api/v1/tfac/products/:id`
* **Purpose**: Update an existing product & size stock.
* **Request Body**: (Same fields as POST)

---

#### `DELETE /api/v1/tfac/products/:id`
* **Purpose**: Soft or hard delete a product from the catalog.
* **Sample Response**:
```json
{
  "success": true,
  "message": "Product #1 deleted successfully"
}
```

---

### 👥 Module 4: Customers Directory

#### `GET /api/v1/tfac/get-customers`
* **Purpose**: Fetch list of customer profiles with aggregate order stats.
* **Query Parameters**: `page`, `limit`, `search`.
* **Sample Response**:
```json
{
  "success": true,
  "totalItems": 42,
  "totalPages": 5,
  "page": 1,
  "limit": 10,
  "data": [
    {
      "customer_id": 11,
      "customer_name": "Rakesh Rane",
      "customer_phone": "8390025632",
      "customer_email": "rakesh0712@gmail.com",
      "shipping_address": "Flat 402, Sunshine Heights, SV Road, Bandra West, Mumbai, Maharashtra",
      "pincode": "400050",
      "total_orders": 2
    }
  ]
}
```

---

#### `GET /api/v1/tfac/customers/:id`
* **Purpose**: Single customer profile details & order history.
* **Sample Response**:
```json
{
  "success": true,
  "data": {
    "id": "11",
    "name": "Rakesh Rane",
    "phone": "8390025632",
    "email": "rakesh0712@gmail.com",
    "address": "Flat 402, Sunshine Heights, SV Road, Bandra West, Mumbai, Maharashtra",
    "pincode": "400050",
    "total_orders": 2,
    "orders": [
      {
        "id": "ORD-9281",
        "date": "2026-07-28",
        "product": "Red Bean T-Shirt",
        "size": "L",
        "amount": 899,
        "status": "Delivered"
      },
      {
        "id": "ORD-8410",
        "date": "2026-07-14",
        "product": "Stay in the Musical Trance",
        "size": "M",
        "amount": 999,
        "status": "Delivered"
      }
    ]
  }
}
```

---

### 🎨 Module 5: Artwork Submissions & Moderation

#### `GET /api/v1/tfac/artworks`
* **Purpose**: Fetch design submissions uploaded by student artists.
* **Query Parameters**:
  * `status` (optional): `Selected` | `Pending` | `Rejected` (or omit for all).
  * `search` (optional): Search by artist name or artwork title.
* **Sample Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Maahi",
      "role": "Red Bean & Matcha",
      "imageUrl": "https://teesforacause.co/assets/shop-coffee-pocket-light.jpg",
      "submittedAt": "12 Oct 2025",
      "status": "Selected",
      "cause": "Women Empowerment",
      "rejectionReason": null
    },
    {
      "id": 9,
      "name": "Kabir Rao",
      "role": "Neon Rebellion",
      "imageUrl": "https://teesforacause.co/assets/shop-cn-tower-back.jpg",
      "submittedAt": "20 Jul 2026",
      "status": "Rejected",
      "cause": "Urban Expression",
      "rejectionReason": "Image resolution too low for screen printing"
    }
  ]
}
```

---

#### `PATCH /api/v1/tfac/artworks/:id/status`
* **Purpose**: Approve (`Selected`), Reject (`Rejected`), or Re-evaluate (`Pending`) artwork.
* **Request Body**:
```json
{
  "status": "Rejected",
  "rejectionReason": "Image resolution too low for screen printing"
}
```

---

### 👩‍🎨 Module 6: Designers & Artists Directory

#### `GET /api/v1/tfac/designers`
* **Purpose**: Fetch active student creators, their cause partners, t-shirts sold, and calculated 3% royalties.
* **Sample Response**:
```json
{
  "success": true,
  "summary": {
    "totalActiveCreators": 6,
    "totalTeesDistributed": 2980,
    "totalRoyaltiesPaid": 14900
  },
  "data": [
    {
      "id": 1,
      "name": "Maahi",
      "age": 15,
      "avatar": "https://teesforacause.co/assets/story-aisha.jpg",
      "cause": "Women Empowerment (Geet Foundation)",
      "designs": ["Red Bean", "Matcha"],
      "teesSold": 820,
      "totalRoyalty": 4100,
      "status": "Active Creator"
    },
    {
      "id": 2,
      "name": "Deeksha Deulkar",
      "age": 19,
      "avatar": "https://teesforacause.co/assets/shop-musical-trance-front.jpg",
      "cause": "Mental Health & Hope",
      "designs": ["Stay in the Musical Trance"],
      "teesSold": 640,
      "totalRoyalty": 3200,
      "status": "Active Creator"
    }
  ]
}
```

---

### 🤝 Module 7: NGO Partners & Impact Analytics

#### `GET /api/v1/tfac/ngos`
* **Purpose**: Fetch NGO partner profiles, total donations, and sales attribution percentages.
* **Sample Response**:
```json
{
  "success": true,
  "summary": {
    "totalDonated": 68000,
    "activePartners": 2,
    "totalPartners": 2
  },
  "data": [
    {
      "id": 1,
      "name": "Geet Foundation",
      "category": "Women Empowerment",
      "description": "Supports women and girls through skill development, education, and livelihood programs.",
      "tshirtsAttributed": 820,
      "amountDonated": 41000,
      "status": "Active",
      "location": "Mumbai, Maharashtra",
      "since": "2023"
    },
    {
      "id": 2,
      "name": "Youth Empowerment Foundation",
      "category": "Youth Empowerment",
      "description": "Empowers underprivileged youth through education, sports, and skill-building.",
      "tshirtsAttributed": 540,
      "amountDonated": 27000,
      "status": "Active",
      "location": "Pan India",
      "since": "2023"
    }
  ]
}
```

---

### ⚙️ Module 8: Content & Website Settings Management

#### `GET /api/v1/tfac/content`
* **Purpose**: Key-Value store for banner text, announcements, website strings, and configuration.
* **Sample Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "key": "banner_announcement",
      "value": "Support Youth Artists with Every T-Shirt Purchase!",
      "updatedAt": "2026-07-20T08:00:00Z"
    }
  ]
}
```

---

#### `POST /api/v1/tfac/content`
* **Purpose**: Add or update key-value setting.
* **Request Body**:
```json
{
  "key": "banner_announcement",
  "value": "New Summer Cause Collection Live Now!"
}
```

---

## 3. Quick API Endpoint Summary Matrix

| Module | Method | Endpoint Path | Description |
| :--- | :--- | :--- | :--- |
| **Analytics** | `GET` | `/api/v1/tfac/dashboard/stats` | KPI metrics & 5-tier financial model distribution |
| **Analytics** | `GET` | `/api/v1/tfac/dashboard/monthly-impact` | Monthly cause funds & sales chart data |
| **Orders** | `GET` | `/api/v1/tfac/get-orders` | Fetch orders list (search, pagination, status filter) |
| **Orders** | `PATCH` | `/api/v1/tfac/orders/:id/status` | Update payment/order status |
| **Products** | `GET` | `/api/v1/tfac/products` | Fetch catalog & per-size stock counts |
| **Products** | `POST` | `/api/v1/tfac/products` | Create new product |
| **Products** | `PUT` | `/api/v1/tfac/products/:id` | Update product details & stock |
| **Products** | `DELETE` | `/api/v1/tfac/products/:id` | Delete product |
| **Customers**| `GET` | `/api/v1/tfac/get-customers` | Fetch customer directory |
| **Customers**| `GET` | `/api/v1/tfac/customers/:id` | Customer profile & order history |
| **Artworks** | `GET` | `/api/v1/tfac/artworks` | List design submissions |
| **Artworks** | `PATCH` | `/api/v1/tfac/artworks/:id/status` | Approve / Reject design submission |
| **Designers** | `GET` | `/api/v1/tfac/designers` | Student artists sales & 3% royalty share |
| **NGOs** | `GET` | `/api/v1/tfac/ngos` | NGO partners & donation attribution |
| **Content** | `GET` | `/api/v1/tfac/content` | Fetch site key-value content settings |
| **Content** | `POST` | `/api/v1/tfac/content` | Create / Update key-value setting |

---

### 💡 Recommendation for Backend Team:
1. Database tables needed: `orders`, `products`, `product_stock`, `customers`, `artworks`, `designers`, `ngos`, `content_settings`.
2. Ensure image uploads support CDN image URLs or multipart file upload endpoints returning public URLs.
