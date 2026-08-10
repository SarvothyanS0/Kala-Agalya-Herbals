const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: false
  },
  category: {
    type: String,
    enum: ["hair_oil", "dandruff"],
    default: "hair_oil"
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String, // URL/path to the uploaded image
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ product: 1 });
reviewSchema.index({ category: 1 });

module.exports = mongoose.model("Review", reviewSchema);
