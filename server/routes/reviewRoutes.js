const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads/reviews");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Config (Memory Storage for Base64)
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images are allowed!"));
  }
});

const adminAuth = require("../middleware/adminAuth");

// Upload error handler wrapper
const uploadSingleImage = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("Multer image upload error:", err.message);
      return res.status(400).json({ success: false, message: err.message || "File upload failed" });
    }
    next();
  });
};

// Routes
// Public
router.get("/category/:category", reviewController.getReviewsByCategory);
router.get("/:productId", reviewController.getProductReviews);
router.post("/", uploadSingleImage, reviewController.addReview);

// Admin
router.get("/", adminAuth, reviewController.getAllReviews);
router.delete("/:id", adminAuth, reviewController.deleteReview);

module.exports = router;
