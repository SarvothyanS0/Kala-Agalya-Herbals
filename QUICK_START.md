# Quick Start Guide - Admin Panel

## 🚀 Getting Started

### Step 1: Create Admin User

Open a terminal in the `server` directory and run:

```bash
cd server
npm run create-admin
```

This creates an admin account:

- Email: `admin@hairoil.com`
- Password: `admin123`

### Step 2: Start the Backend Server

In the `server` directory:

```bash
npm start
```

Server will run on `http://localhost:5000`

### Step 3: Start the Frontend Client

Open a new terminal in the `client` directory:

```bash
cd client
npm start
```

Client will run on `http://localhost:3000`

### Step 4: Access Admin Panel

Open your browser and navigate to:

```
http://localhost:3000/admin/login
```

Login with:

- **Email:** admin@hairoil.com
- **Password:** admin123

## 📋 Admin Panel Features

### Dashboard (`/admin/dashboard`)

- View total orders, sales, today's orders, and pending orders
- Interactive sales chart (daily/monthly)
- Quick navigation to Orders, Products, and Reports

### Orders Management (`/admin/orders`)

- View all orders
- Filter by status
- Click any order to view details and update status

### Order Details (`/admin/orders/:id`)

- View customer information
- See ordered products
- Update order status (Pending → Packed → Shipped → Delivered)
- Cancel orders

### Product Management (`/admin/products`)

- Add new products
- Edit existing products
- Delete products
- Manage sizes (100ml, 200ml, 500ml)
- Set prices and stock levels

### Reports & Sales (`/admin/reports`)

- Select date range
- View sales analytics
- See best-selling products
- Download orders as Excel/CSV file

## 🎯 Test Workflow

1. **Login** → Use admin credentials
2. **Dashboard** → View overview statistics
3. **Add Product** → Go to Products, click "Add New Product"
4. **View Orders** → Go to Orders Management
5. **Update Order** → Click any order, update its status
6. **Generate Report** → Go to Reports, select date range, download Excel

## 🔐 Security Reminder

⚠️ **For Production:**

- Change the default admin password
- Implement JWT authentication
- Use bcrypt for password hashing
- Enable HTTPS
- Add rate limiting
- Implement proper session management

## 📱 Access URLs

- **Customer Site:** `http://localhost:3000/`
- **Admin Login:** `http://localhost:3000/admin/login`
- **Admin Dashboard:** `http://localhost:3000/admin/dashboard`
- **API Base:** `http://localhost:5000/api`

## 🛠️ Troubleshooting

**Issue:** Cannot connect to MongoDB

- **Solution:** Check your `.env` file in the server directory
- Ensure `MONGO_URI` is set correctly

**Issue:** Admin login not working

- **Solution:** Make sure you ran `npm run create-admin` first
- Check server console for errors

**Issue:** Port already in use

- **Solution:** Kill the process using the port or change the port in `.env`

**Issue:** CORS errors

- **Solution:** Server already has CORS enabled, ensure server is running

## 📞 Support

For issues or questions, check:

- Server logs in the terminal
- Browser console for frontend errors
- MongoDB connection status

Happy Managing! 🎉
