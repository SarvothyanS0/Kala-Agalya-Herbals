const mongoose = require("mongoose");

const bannerSettingSchema = new mongoose.Schema({
  badge: {
    type: String,
    default: "🔥 Limited Time Website Exclusive Deal",
  },
  title: {
    type: String,
    default: "Website Launching",
  },
  highlightText: {
    type: String,
    default: "Special Offer",
  },
  subtitle: {
    type: String,
    default: "Claim our promotional launch discount package before stock runs out!",
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BannerSetting", bannerSettingSchema);
