const express = require("express");
const router = express.Router();
const adminOrderController = require("../controllers/adminOrderController");
const adminAuth = require("../middleware/adminAuth");

// All routes are protected with admin authentication
router.use(adminAuth);

// Dashboard
router.get("/dashboard/stats", adminOrderController.getDashboardStats);
router.get("/dashboard/sales-chart", adminOrderController.getSalesChartData);

// Orders management
router.get("/", adminOrderController.getAllOrders);
router.get("/:id", adminOrderController.getOrder);
router.put("/:id/status", adminOrderController.updateOrderStatus);
router.put("/:id/mark-paid", adminOrderController.markOrderAsPaid);

// Reports
router.get("/reports/data", adminOrderController.getReports);

module.exports = router;
