const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/bannerController");
const adminAuth = require("../middleware/adminAuth");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  }
});

const uploadSingleImage = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("Multer banner upload error:", err.message);
      return res.status(400).json({ success: false, message: err.message || "File upload failed" });
    }
    next();
  });
};

// Routes
router.get("/", bannerController.getBanners);
router.get("/admin", adminAuth, bannerController.getAllBannersAdmin);
router.post("/", adminAuth, uploadSingleImage, bannerController.addBanner);
router.patch("/:id/toggle", adminAuth, bannerController.toggleBanner);
router.delete("/:id", adminAuth, bannerController.deleteBanner);

module.exports = router;
