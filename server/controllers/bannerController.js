const Banner = require("../models/Banner");
const sharp = require("sharp");
const cache = require("../utils/cache");

const CACHE_KEY = "active_banners";
const CACHE_TTL = 300; // 5 minutes

// Get active banners for website (cached)
exports.getBanners = async (req, res) => {
  try {
    const cached = cache.get(CACHE_KEY);
    if (cached) {
      return res.json({ success: true, banners: cached });
    }
    const banners = await Banner.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    cache.set(CACHE_KEY, banners, CACHE_TTL);
    res.json({ success: true, banners });
  } catch (error) {
    console.error("Error fetching active banners:", error);
    res.status(500).json({ success: false, message: "Failed to fetch banners" });
  }
};

// Get all banners for Admin (not cached — admin needs fresh data)
exports.getAllBannersAdmin = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, banners });
  } catch (error) {
    console.error("Error fetching admin banners:", error);
    res.status(500).json({ success: false, message: "Failed to fetch banners" });
  }
};

// Add / Upload new Offer Banner
exports.addBanner = async (req, res) => {
  try {
    const { title, subtitle, linkUrl } = req.body;

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, message: "Please select an offer banner image to upload" });
    }

    let image = "";
    try {
      const webpBuffer = await sharp(req.file.buffer)
        .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
      const b64 = webpBuffer.toString("base64");
      image = `data:image/webp;base64,${b64}`;
    } catch (imgErr) {
      console.error("Banner sharp compression error, falling back to raw buffer:", imgErr);
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      image = `data:${req.file.mimetype || 'image/jpeg'};base64,${b64}`;
    }

    const banner = new Banner({
      title: title?.trim() || "Website Launching Offer",
      subtitle: subtitle?.trim() || "Special Exclusive Deal",
      linkUrl: linkUrl?.trim() || "#pricing",
      image,
      isActive: true
    });

    await banner.save();

    // Invalidate cache so website shows new banner immediately
    cache.invalidate(CACHE_KEY);

    res.status(201).json({
      success: true,
      message: "Offer banner uploaded and published successfully!",
      banner
    });
  } catch (error) {
    console.error("Error adding offer banner:", error);
    res.status(500).json({ success: false, message: "Failed to upload offer banner", error: error.message });
  }
};

// Toggle banner active status
exports.toggleBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    banner.isActive = !banner.isActive;
    await banner.save();

    // Invalidate cache so the website reflects the toggle immediately
    cache.invalidate(CACHE_KEY);

    res.json({ success: true, message: `Banner ${banner.isActive ? "activated" : "deactivated"} successfully`, banner });
  } catch (error) {
    console.error("Error toggling banner:", error);
    res.status(500).json({ success: false, message: "Failed to update banner status" });
  }
};

// Delete banner
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    await banner.deleteOne();

    // Invalidate cache
    cache.invalidate(CACHE_KEY);

    res.json({ success: true, message: "Offer banner deleted successfully" });
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.status(500).json({ success: false, message: "Failed to delete banner" });
  }
};
