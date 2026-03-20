const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const adminAuth = require("../middleware/adminAuth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads/products");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Public routes
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProduct);

// Protected admin routes
router.post("/", adminAuth, upload.array("images", 5), productController.createProduct);
router.put("/:id", adminAuth, upload.array("images", 5), productController.updateProduct);
router.delete("/:id", adminAuth, productController.deleteProduct);

module.exports = router;
