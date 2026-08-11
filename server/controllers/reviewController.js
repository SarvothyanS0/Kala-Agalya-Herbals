const mongoose = require("mongoose");
const sharp = require("sharp");
const Review = require("../models/Review");
const Product = require("../models/Product");

// Get all reviews for a product or category
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    let query = {};
    if (productId === "dandruff" || productId === "hair_oil") {
      query = { category: productId };
    } else if (mongoose.Types.ObjectId.isValid(productId)) {
      query = { product: productId, category: { $ne: "dandruff" } };
    } else if (productId === "all") {
      query = {};
    } else {
      query = { category: productId };
    }

    const reviews = await Review.find(query).sort({ createdAt: -1 }).lean();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get reviews by category
exports.getReviewsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const reviews = await Review.find({ category }).sort({ createdAt: -1 }).lean();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Add a new review
exports.addReview = async (req, res) => {
  try {
    const { productId, category, name, rating, comment } = req.body;

    if (!name || !name.trim() || !comment || !comment.trim()) {
      return res.status(400).json({ success: false, message: "Customer name and comment are required" });
    }

    const isDandruff = category === "dandruff";

    let image = "";
    if (req.file && req.file.buffer) {
      try {
        // Compress image down to max 600x600 WebP for ultra-fast loading & small DB size (~25KB)
        const webpBuffer = await sharp(req.file.buffer)
          .resize(600, 600, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 75 })
          .toBuffer();
        const b64 = webpBuffer.toString("base64");
        image = `data:image/webp;base64,${b64}`;
      } catch (imgErr) {
        console.error("Sharp compression error, falling back to raw buffer:", imgErr);
        try {
          const b64 = Buffer.from(req.file.buffer).toString("base64");
          image = `data:${req.file.mimetype || 'image/jpeg'};base64,${b64}`;
        } catch (rawErr) {
          console.error("Raw buffer conversion error:", rawErr);
        }
      }
    }

    let prodId = null;
    if (!isDandruff) {
      if (productId && mongoose.Types.ObjectId.isValid(productId)) {
        prodId = productId;
      } else {
        const firstProd = await Product.findOne().lean();
        if (firstProd) prodId = firstProd._id;
      }
    }

    const reviewData = {
      name: name.trim(),
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      comment: comment.trim(),
      image,
      category: isDandruff ? "dandruff" : "hair_oil"
    };

    if (prodId) {
      reviewData.product = prodId;
    }

    const review = new Review(reviewData);
    await review.save();

    res.status(201).json({ success: true, message: "Review added successfully", review });
  } catch (error) {
    console.error("addReview controller error:", error);
    res.status(500).json({ success: false, message: "Failed to add review", error: error.message });
  }
};

// Get all reviews (for Admin)
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("product", "name")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Delete review (for Admin)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    await review.deleteOne();
    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
