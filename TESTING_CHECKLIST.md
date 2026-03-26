# Admin Panel Testing Checklist

## 🧪 Complete Testing Guide

Use this checklist to verify all features are working correctly.

---

## ✅ Pre-Testing Setup

- [ ] MongoDB is running
- [ ] Server is running on port 5000
- [ ] Client is running on port 3000
- [ ] Admin user created (run `npm run create-admin`)

---

## 1️⃣ Admin Login (`/admin/login`)

### Test Cases:

- [ ] Page loads correctly with gradient background
- [ ] Email input field is visible
- [ ] Password input field is visible
- [ ] Login button is visible

### Functionality Tests:

- [ ] **Invalid Login:** Enter wrong credentials → Should show error message
- [ ] **Valid Login:** Enter `admin@hairoil.com` / `admin123` → Should redirect to dashboard
- [ ] **Loading State:** Click login → Should show loading spinner
- [ ] **Protected Route:** Try accessing `/admin/dashboard` without login → Should redirect to login

**Expected Result:** ✅ Login successful, redirected to dashboard

---

## 2️⃣ Admin Dashboard (`/admin/dashboard`)

### Visual Tests:

- [ ] Header shows "Admin Dashboard" and admin name
- [ ] Logout button is visible
- [ ] 4 metric cards are displayed:
  - [ ] Total Orders (blue)
  - [ ] Total Sales (green)
  - [ ] Today's Orders (purple)
  - [ ] Pending Orders (orange)
- [ ] Sales chart is visible
- [ ] Daily/Monthly toggle buttons work
- [ ] 3 quick action cards are displayed

### Functionality Tests:

- [ ] **Metrics Load:** Dashboard shows correct numbers from database
- [ ] **Sales Chart Toggle:** Click "Daily" → Chart updates
- [ ] **Sales Chart Toggle:** Click "Monthly" → Chart updates
- [ ] **Chart Hover:** Hover over bars → Shows tooltip with amount
- [ ] **Navigation:** Click "Orders Management" → Goes to `/admin/orders`
- [ ] **Navigation:** Click "Product Management" → Goes to `/admin/products`
- [ ] **Navigation:** Click "Reports & Sales" → Goes to `/admin/reports`
- [ ] **Logout:** Click logout → Redirects to login page

**Expected Result:** ✅ All metrics display correctly, navigation works

---

## 3️⃣ Orders Management (`/admin/orders`)

### Visual Tests:

- [ ] Header shows "Orders Management"
- [ ] Back to Dashboard link works
- [ ] Filter buttons are visible (All, Pending, Packed, Shipped, Delivered)
- [ ] Orders table is displayed with all columns
- [ ] Status badges are color-coded

### Functionality Tests:

- [ ] **Load Orders:** Page loads all orders from database
- [ ] **Filter - All:** Shows all orders
- [ ] **Filter - Pending:** Shows only pending orders
- [ ] **Filter - Packed:** Shows only packed orders
- [ ] **Filter - Shipped:** Shows only shipped orders
- [ ] **Filter - Delivered:** Shows only delivered orders
- [ ] **Filter Counts:** Each filter button shows correct count
- [ ] **View Order:** Click "View Order" → Goes to order detail page
- [ ] **Empty State:** If no orders, shows "No orders found"

**Expected Result:** ✅ All orders displayed, filters work correctly

---

## 4️⃣ Order Detail Page (`/admin/orders/:id`)

### Visual Tests:

- [ ] Header shows "Order Details" and Order ID
- [ ] Back to Orders link works
- [ ] Customer Details card is visible
- [ ] Ordered Products card is visible
- [ ] Payment Info card is visible
- [ ] Order Status card is visible
- [ ] Action buttons are visible based on status

### Customer Details Tests:

- [ ] Name is displayed
- [ ] Phone is displayed
- [ ] Alternate phone is displayed (if exists)
- [ ] Full address is displayed with all fields

### Products Tests:

- [ ] All ordered products are listed
- [ ] Each product shows: name, size, quantity, price
- [ ] Total amount is calculated correctly

### Payment Info Tests:

- [ ] Payment ID is displayed (if exists)
- [ ] Payment status badge is shown (PENDING/PAID)
- [ ] Status is color-coded correctly

### Status Update Tests:

- [ ] **Pending Order:** Shows "Mark as Packed" button
- [ ] **Click Packed:** Order status updates to "Packed"
- [ ] **Packed Order:** Shows "Mark as Shipped" button
- [ ] **Click Shipped:** Order status updates to "Shipped"
- [ ] **Shipped Order:** Shows "Mark as Delivered" button
- [ ] **Click Delivered:** Order status updates to "Delivered"
- [ ] **Cancel Order:** Shows "Cancel Order" button (except for Delivered/Cancelled)
- [ ] **Click Cancel:** Shows confirmation dialog
- [ ] **Confirm Cancel:** Order status updates to "Cancelled"
- [ ] **Delivered/Cancelled:** No action buttons shown

**Expected Result:** ✅ Order details display correctly, status updates work

---

## 5️⃣ Product Management (`/admin/products`)

### Visual Tests:

- [ ] Header shows "Product Management"
- [ ] Back to Dashboard link works
- [ ] "Add New Product" button is visible
- [ ] Products are displayed in grid layout
- [ ] Each product card shows all information

### Add Product Tests:

- [ ] **Click Add:** Modal opens
- [ ] **Form Fields:** All fields are visible (name, description, image, sizes, active)
- [ ] **Size Fields:** 3 size rows (100ml, 200ml, 500ml)
- [ ] **Fill Form:** Enter product details
- [ ] **Submit:** Click "Create Product"
- [ ] **Success:** Product is created and appears in grid
- [ ] **Close Modal:** Click X or Cancel → Modal closes

### Edit Product Tests:

- [ ] **Click Edit:** Modal opens with pre-filled data
- [ ] **Modify Data:** Change product details
- [ ] **Submit:** Click "Update Product"
- [ ] **Success:** Product is updated in grid
- [ ] **Verify:** Changes are reflected

### Delete Product Tests:

- [ ] **Click Delete:** Confirmation dialog appears
- [ ] **Confirm:** Product is deleted
- [ ] **Verify:** Product removed from grid
- [ ] **Cancel:** Product is not deleted

### Validation Tests:

- [ ] **Required Fields:** Try submitting without name → Shows error
- [ ] **Price Validation:** Enter negative price → Should handle gracefully
- [ ] **Stock Validation:** Enter negative stock → Should handle gracefully

**Expected Result:** ✅ CRUD operations work correctly

---

## 6️⃣ Reports & Sales (`/admin/reports`)

### Visual Tests:

- [ ] Header shows "Reports & Sales Analytics"
- [ ] Back to Dashboard link works
- [ ] Date range selectors are visible
- [ ] Default dates are set (last 30 days)

### Generate Report Tests:

- [ ] **Select Dates:** Choose start and end date
- [ ] **Click Generate:** Report loads
- [ ] **Summary Cards:** Total Orders and Total Sales display
- [ ] **Best Selling Products:** Top 5 products are listed
- [ ] **Orders Table:** All orders in range are displayed

### Best Selling Tests:

- [ ] Products are ranked (#1, #2, #3, etc.)
- [ ] Each product shows quantity sold
- [ ] Each product shows revenue
- [ ] Products are sorted by quantity (highest first)

### Excel Download Tests:

- [ ] **Click Download:** CSV file downloads
- [ ] **Filename:** Format is `orders_YYYY-MM-DD_to_YYYY-MM-DD.csv`
- [ ] **Open File:** CSV contains all order data
- [ ] **Verify Columns:** All columns are present
- [ ] **Verify Data:** Data matches orders in table

### Date Range Tests:

- [ ] **Last 7 Days:** Select range → Correct orders shown
- [ ] **Last 30 Days:** Select range → Correct orders shown
- [ ] **Custom Range:** Select any range → Correct orders shown
- [ ] **No Data Range:** Select range with no orders → Shows "No sales data"

**Expected Result:** ✅ Reports generate correctly, Excel downloads work

---

## 🔄 Integration Tests

### Complete Workflow Test:

1. [ ] Login as admin
2. [ ] View dashboard statistics
3. [ ] Add a new product (e.g., "Premium Hair Oil")
4. [ ] Go to orders page
5. [ ] View an order detail
6. [ ] Update order status from Pending → Packed → Shipped → Delivered
7. [ ] Go to reports page
8. [ ] Generate report for last 30 days
9. [ ] Download Excel file
10. [ ] Verify Excel contains the updated order
11. [ ] Edit the product created earlier
12. [ ] Delete the product
13. [ ] Logout

**Expected Result:** ✅ Complete workflow executes without errors

---

## 🌐 Browser Compatibility Tests

Test in multiple browsers:

- [ ] Chrome
- [ ] Firefox
- [ ] Edge
- [ ] Safari (if available)

**Expected Result:** ✅ Works in all browsers

---

## 📱 Responsive Design Tests

Test at different screen sizes:

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768px width)
- [ ] Mobile (375px width)

**Expected Result:** ✅ Responsive on all screen sizes

---

## 🔒 Security Tests

- [ ] **Unauthorized Access:** Try accessing admin routes without login → Redirects to login
- [ ] **Session Persistence:** Refresh page while logged in → Stays logged in
- [ ] **Logout Clears Session:** Logout → Cannot access admin routes
- [ ] **API Protection:** Try calling admin APIs without adminEmail header → Returns 401

**Expected Result:** ✅ All routes are protected

---

## ⚡ Performance Tests

- [ ] **Dashboard Load Time:** < 2 seconds
- [ ] **Orders Page Load:** < 3 seconds
- [ ] **Product Grid Load:** < 2 seconds
- [ ] **Report Generation:** < 5 seconds
- [ ] **Excel Download:** < 3 seconds

**Expected Result:** ✅ All pages load quickly

---

## 🐛 Error Handling Tests

- [ ] **Server Down:** Stop server → Shows appropriate error
- [ ] **Network Error:** Disconnect internet → Shows error message
- [ ] **Invalid Order ID:** Access `/admin/orders/invalid-id` → Shows "Order Not Found"
- [ ] **Empty States:** Test with no orders/products → Shows appropriate message

**Expected Result:** ✅ Errors are handled gracefully

---

## 📊 Data Validation Tests

### Order Status Flow:

- [ ] Cannot skip status (e.g., Pending → Delivered directly)
- [ ] Status updates are saved to database
- [ ] Updated timestamp changes on status update

### Product Validation:

- [ ] Cannot create product without name
- [ ] Cannot create product without description
- [ ] Sizes must have price and stock
- [ ] Active/Inactive toggle works

### Reports Validation:

- [ ] Start date cannot be after end date
- [ ] Date range is inclusive
- [ ] Best sellers calculation is accurate

**Expected Result:** ✅ All validations work correctly

---

## ✅ Final Checklist

- [ ] All 6 main pages work correctly
- [ ] All CRUD operations function properly
- [ ] All navigation links work
- [ ] All filters and toggles work
- [ ] All forms validate correctly
- [ ] All status updates persist
- [ ] Excel download works
- [ ] Authentication works
- [ ] Protected routes work
- [ ] Responsive design works
- [ ] No console errors
- [ ] No network errors
- [ ] UI is visually appealing
- [ ] Colors are consistent
- [ ] Icons display correctly
- [ ] Loading states work
- [ ] Error messages display

---

## 🎯 Test Results Summary

**Total Test Cases:** 150+

**Passed:** **\_** / **\_**
**Failed:** **\_** / **\_**
**Skipped:** **\_** / **\_**

**Overall Status:** ⬜ PASS / ⬜ FAIL

---

## 📝 Notes & Issues

Document any issues found during testing:

1. ***
2. ***
3. ***

---

## 🎉 Testing Complete!

Once all tests pass, the admin panel is ready for production deployment!

**Tested By:** ******\_\_\_******
**Date:** ******\_\_\_******
**Signature:** ******\_\_\_******
