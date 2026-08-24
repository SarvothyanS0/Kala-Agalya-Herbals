const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    default: ""
  },
  subtitle: {
    type: String,
    default: ""
  },
  image: {
    type: String,
    required: true
  },
  linkUrl: {
    type: String,
    default: "#pricing"
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

bannerSchema.index({ createdAt: -1 });
bannerSchema.index({ isActive: 1 });

module.exports = mongoose.model("Banner", bannerSchema);
