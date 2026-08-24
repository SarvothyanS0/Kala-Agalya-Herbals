const mongoose = require("mongoose");

const bannerSettingSchema = new mongoose.Schema({
  badge: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  highlightText: {
    type: String,
    default: "",
  },
  subtitle: {
    type: String,
    default: "",
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BannerSetting", bannerSettingSchema);
