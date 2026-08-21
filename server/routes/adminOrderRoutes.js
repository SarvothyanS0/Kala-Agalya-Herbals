const express = require("express");
const router = express.Router();
const adminOrderController = require("../controllers/adminOrderController");
const adminAuth = require("../middleware/adminAuth");

// All routes are protected with admin authentication
router.use(adminAuth);

// Dashboard (must be before /:id to avoid wildcard conflict)
router.get("/dashboard/stats", adminOrderController.getDashboardStats);
router.get("/dashboard/sales-chart", adminOrderController.getSalesChartData);

// Reports (must be before /:id to avoid wildcard conflict)
router.get("/reports/data", adminOrderController.getReports);

// Orders management
router.get("/", adminOrderController.getAllOrders);
router.put("/:id/status", adminOrderController.updateOrderStatus);
router.put("/:id/mark-paid", adminOrderController.markOrderAsPaid);
router.get("/:id", adminOrderController.getOrder);

module.exports = router;

