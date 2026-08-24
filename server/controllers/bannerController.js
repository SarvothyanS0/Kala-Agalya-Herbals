const Banner = require("../models/Banner");
const BannerSetting = require("../models/BannerSetting");
const sharp = require("sharp");
const cache = require("../utils/cache");

const CACHE_KEY = "active_banners_data";
const CACHE_TTL = 300; // 5 minutes

// Helper to get or create default banner settings
async function getOrCreateBannerSettings() {
  let settings = await BannerSetting.findOne().lean();
  if (!settings) {
    settings = await BannerSetting.create({
      badge: "",
      title: "",
      highlightText: "",
      subtitle: "",
    });
  }
  return settings;
}

// Get active banners + section settings for website (cached)
exports.getBanners = async (req, res) => {
  try {
    const cached = cache.get(CACHE_KEY);
    if (cached) {
      return res.json({ success: true, ...cached });
    }

    const [banners, settings] = await Promise.all([
      Banner.find({ isActive: true }).sort({ createdAt: -1 }).lean(),
      getOrCreateBannerSettings(),
    ]);

    const result = { banners, settings };
    cache.set(CACHE_KEY, result, CACHE_TTL);

    res.json({ success: true, ...result });
  } catch (error) {
    console.error("Error fetching active banners:", error);
    res.status(500).json({ success: false, message: "Failed to fetch banners" });
  }
};

// Get all banners & settings for Admin (not cached)
exports.getAllBannersAdmin = async (req, res) => {
  try {
    const [banners, settings] = await Promise.all([
      Banner.find().sort({ createdAt: -1 }).lean(),
      getOrCreateBannerSettings(),
    ]);

    res.json({ success: true, banners, settings });
  } catch (error) {
    console.error("Error fetching admin banners:", error);
    res.status(500).json({ success: false, message: "Failed to fetch banners" });
  }
};

// Update Section Title & Header Settings (Admin)
exports.updateBannerSettings = async (req, res) => {
  try {
    const { badge, title, highlightText, subtitle } = req.body;

    let settings = await BannerSetting.findOne();
    if (!settings) {
      settings = new BannerSetting({});
    }

    if (badge !== undefined) settings.badge = badge.trim();
    if (title !== undefined) settings.title = title.trim();
    if (highlightText !== undefined) settings.highlightText = highlightText.trim();
    if (subtitle !== undefined) settings.subtitle = subtitle.trim();
    settings.updatedAt = new Date();

    await settings.save();

    // Invalidate active banner cache
    cache.invalidate(CACHE_KEY);

    res.json({
      success: true,
      message: "Banner section title and headers updated successfully! ✨",
      settings,
    });
  } catch (error) {
    console.error("Error updating banner settings:", error);
    res.status(500).json({ success: false, message: "Failed to update banner section settings" });
  }
};

// Add / Upload new Offer Banner(s) - Supports multiple images
exports.addBanner = async (req, res) => {
  try {
    const { title, subtitle, linkUrl } = req.body;

    // Collect all uploaded files (handles both req.files array and req.file single)
    let files = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      files = req.files;
    } else if (req.file) {
      files = [req.file];
    }

    if (files.length === 0) {
      return res.status(400).json({ success: false, message: "Please select at least one offer banner image to upload" });
    }

    const defaultTitle = title?.trim() || "";
    const defaultSubtitle = subtitle?.trim() || "";
    const defaultLinkUrl = linkUrl?.trim() || "#product";

    const createdBanners = [];

    for (const file of files) {
      let image = "";
      try {
        const webpBuffer = await sharp(file.buffer)
          .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();
        const b64 = webpBuffer.toString("base64");
        image = `data:image/webp;base64,${b64}`;
      } catch (imgErr) {
        console.error("Banner sharp compression error, falling back to raw buffer:", imgErr);
        const b64 = Buffer.from(file.buffer).toString("base64");
        image = `data:${file.mimetype || "image/jpeg"};base64,${b64}`;
      }

      const banner = new Banner({
        title: defaultTitle,
        subtitle: defaultSubtitle,
        linkUrl: defaultLinkUrl,
        image,
        isActive: true,
      });

      await banner.save();
      createdBanners.push(banner);
    }

    // Invalidate cache
    cache.invalidate(CACHE_KEY);

    const message =
      createdBanners.length === 1
        ? "Offer banner uploaded & published successfully! 🚀"
        : `${createdBanners.length} offer banners uploaded & published successfully! 🚀`;

    res.status(201).json({
      success: true,
      message,
      banners: createdBanners,
      banner: createdBanners[0],
    });
  } catch (error) {
    console.error("Error adding offer banners:", error);
    res.status(500).json({ success: false, message: "Failed to upload offer banner(s)", error: error.message });
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

    // Invalidate cache
    cache.invalidate(CACHE_KEY);

    res.json({
      success: true,
      message: `Banner ${banner.isActive ? "activated" : "deactivated"} successfully`,
      banner,
    });
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
