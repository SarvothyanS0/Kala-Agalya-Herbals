const mongoose = require("mongoose");
const sharp = require("sharp");
const Review = require("../models/Review");
const Product = require("../models/Product");
const cache = require("../utils/cache");

const CACHE_TTL = 300; // 5 minutes

function reviewCacheKey(productId) {
  return `reviews_${productId}`;
}

// Get all reviews for a product or category
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    let query = {};
    if (productId === "dandruff") {
      query = {
        $or: [
          { category: /^dandruff$/i },
          { comment: /dandruff|anti-dandruff|dry scalp|flak(y|es?)|scalp itch/i }
        ]
      };
    } else if (productId === "all") {
      query = {};
    } else {
      // General Hair Oil / Hair Growth reviews: Strictly exclude any dandruff category or dandruff comment
      query = {
        category: { $not: /^dandruff$/i },
        comment: { $not: /dandruff|anti-dandruff|flak(y|es?)/i }
      };
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

    let query = {};
    if (category === "dandruff") {
      query = {
        $or: [
          { category: /^dandruff$/i },
          { comment: /dandruff|anti-dandruff|dry scalp|flak(y|es?)|scalp itch/i }
        ]
      };
    } else if (category === "all") {
      query = {};
    } else {
      // Hair Oil category: Exclude dandruff reviews completely
      query = {
        category: { $not: /^dandruff$/i },
        comment: { $not: /dandruff|anti-dandruff|flak(y|es?)/i }
      };
    }

    const reviews = await Review.find(query).sort({ createdAt: -1 }).lean();
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

    // Invalidate all review caches after adding a new review
    cache.invalidatePrefix("reviews_");

    res.status(201).json({ success: true, message: "Review added successfully", review });
  } catch (error) {
    console.error("addReview controller error:", error);
    res.status(500).json({ success: false, message: "Failed to add review", error: error.message });
  }
};

// Get all reviews for Admin (not cached — admin always needs fresh data)
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

// Delete review (Admin)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    await review.deleteOne();

    // Invalidate all review caches
    cache.invalidatePrefix("reviews_");

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
