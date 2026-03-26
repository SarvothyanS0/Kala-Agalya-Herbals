const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Admin authentication routes
router.post("/login", adminController.login);
router.post("/create", adminController.createAdmin);

module.exports = router;
