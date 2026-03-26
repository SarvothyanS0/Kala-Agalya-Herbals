# E-commerce Admin Panel - Herbal Hair Oil Website

## Admin Panel Implementation

This admin panel provides complete management capabilities for your herbal hair oil e-commerce website.

## Features Implemented

### 1. **Admin Login** (`/admin/login`)

- Secure email/password authentication
- Modern gradient UI with animations
- Error handling and loading states

### 2. **Admin Dashboard** (`/admin/dashboard`)

- **Statistics Cards:**
  - Total Orders
  - Total Sales Amount
  - Today's Orders
  - Pending Orders
- **Interactive Sales Chart:**
  - Toggle between Daily and Monthly views
  - Visual bar chart with hover tooltips
- **Quick Action Cards:**
  - Navigate to Orders, Products, and Reports

### 3. **Orders Management** (`/admin/orders`)

- View all orders in a table format
- Filter by status (All, Pending, Packed, Shipped, Delivered)
- Color-coded status badges
- Display: Order ID, Customer Name, Phone, Location, Amount, Payment Status, Order Status, Date
- Click "View Order" to see details

### 4. **Order Detail Page** (`/admin/orders/:id`)

- **Customer Details:**
  - Name, Phone, Alternate Phone
  - Full delivery address
- **Ordered Products:**
  - Product name, size, quantity, price
- **Payment Information:**
  - Payment ID
  - Payment Status (Pending/Paid)
- **Admin Actions:**
  - Mark as Packed
  - Mark as Shipped
  - Mark as Delivered
  - Cancel Order

### 5. **Product Management** (`/admin/products`)

- View all products in a grid layout
- **Add New Product:**
  - Product Name
  - Description
  - Image URL
  - Sizes: 100ml, 200ml, 500ml
  - Price and Stock for each size
  - Active/Inactive status
- **Edit Product:** Update existing products
- **Delete Product:** Remove products

### 6. **Reports & Sales** (`/admin/reports`)

- **Date Range Selection**
- **Summary Cards:**
  - Total Orders in range
  - Total Sales in range
- **Best Selling Products:**
  - Top 5 products by quantity
  - Revenue per product
- **Excel Download:**
  - Download all orders as CSV/Excel file
  - Includes all order details
- **Orders Table:** View all orders in selected date range

## Setup Instructions

### 1. Create Initial Admin User

Run this command in the server directory:

```bash
node createAdmin.js
```

This will create an admin user with:

- **Email:** admin@hairoil.com
- **Password:** admin123

⚠️ **IMPORTANT:** Change this password in production!

### 2. Start the Server

```bash
cd server
npm start
```

### 3. Start the Client

```bash
cd client
npm start
```

### 4. Access Admin Panel

Navigate to: `http://localhost:3000/admin/login`

Login with the credentials created above.

## API Endpoints

### Admin Authentication

- `POST /api/admin/login` - Admin login
- `POST /api/admin/create` - Create new admin

### Dashboard

- `GET /api/admin/orders/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/orders/dashboard/sales-chart?period=daily|monthly` - Get sales chart data

### Orders Management

- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/orders/:id` - Get single order
- `PUT /api/admin/orders/:id/status` - Update order status

### Product Management

- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get single product (public)
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Reports

- `GET /api/admin/orders/reports/data?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Get reports

## Database Models

### Admin Model

- email (unique)
- password
- name
- role
- createdAt

### Product Model

- name
- description
- sizes (array of size, price, stock)
- image
- category
- isActive
- createdAt/updatedAt

### Order Model (Enhanced)

- customer (name, phone, altPhone, address)
- items (array of products)
- totalAmount
- paymentId
- paymentStatus (PENDING/PAID)
- orderStatus (Pending/Packed/Shipped/Delivered/Cancelled)
- createdAt/updatedAt

## Security Notes

1. **Authentication:** Currently using simple email-based auth. For production, implement JWT tokens.
2. **Password Hashing:** Passwords are stored in plain text. Use bcrypt in production.
3. **HTTPS:** Always use HTTPS in production.
4. **Environment Variables:** Keep sensitive data in .env file.

## Flowchart Implementation

All features from the flowchart have been implemented:
✅ Admin Login Page
✅ Admin Dashboard with metrics
✅ Orders Management Page
✅ Order Detail Page with status updates
✅ Product Management (CRUD)
✅ Reports & Sales with Excel download
✅ Sales Chart (Daily/Monthly)

## Design Features

- Modern gradient UI
- Responsive design
- Color-coded status badges
- Smooth animations and transitions
- Interactive charts
- Professional card layouts
- Loading states
- Error handling

Enjoy your new admin panel! 🎉
