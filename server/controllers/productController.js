const Product = require("../models/Product");
const sharp = require("sharp");
const cache = require("../utils/cache");

const CACHE_KEY = "all_products";
const CACHE_TTL = 300; // 5 minutes

// Get all products (cached)
exports.getAllProducts = async (req, res) => {
  try {
    const cached = cache.get(CACHE_KEY);
    if (cached) {
      return res.json({ success: true, products: cached });
    }
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    cache.set(CACHE_KEY, products, CACHE_TTL);
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, sizes: sizesStr, category, isActive, gstPercentage } = req.body;
    let images = [];

    if (req.files && req.files.length > 0) {
      images = await Promise.all(
        req.files.map(async (file) => {
          try {
            const webpBuffer = await sharp(file.buffer).webp({ quality: 80 }).toBuffer();
            const b64 = webpBuffer.toString("base64");
            return `data:image/webp;base64,${b64}`;
          } catch (err) {
            console.error("Error converting uploaded product image to WebP:", err);
            const b64 = Buffer.from(file.buffer).toString("base64");
            return `data:${file.mimetype};base64,${b64}`;
          }
        })
      );
    }

    let sizes = typeof sizesStr === "string" ? JSON.parse(sizesStr) : sizesStr;
    if (Array.isArray(sizes)) {
      sizes = sizes.map(s => {
        const mrp = (s.mrp === "" || s.mrp === null || s.mrp === undefined) ? null : Number(s.mrp);
        const offerPrice = (s.offerPrice === "" || s.offerPrice === null || s.offerPrice === undefined) ? null : Number(s.offerPrice);
        return {
          ...s,
          mrp: isNaN(mrp) ? null : mrp,
          offerPrice: isNaN(offerPrice) ? null : offerPrice
        };
      });
    }

    const product = new Product({
      name,
      description,
      sizes,
      images,
      category,
      gstPercentage: gstPercentage !== undefined ? Number(gstPercentage) : 0,
      isActive: isActive === "true" || isActive === true
    });

    await product.save();

    // Invalidate cache so next request fetches fresh data
    cache.invalidate(CACHE_KEY);

    res.status(201).json({ success: true, product });
  } catch (error) {
    if (error.name === "ValidationError") {
      console.error("Validation Error:", JSON.stringify(error.errors, null, 2));
      return res.status(400).json({ success: false, message: "Validation Error", errors: error.errors });
    }
    console.error("Create Product Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, sizes: sizesStr, category, isActive, gstPercentage } = req.body;
    const updateData = { name, description, category, isActive: isActive === "true" || isActive === true, updatedAt: Date.now() };

    if (gstPercentage !== undefined) {
      updateData.gstPercentage = Number(gstPercentage);
    }

    if (req.files && req.files.length > 0) {
      updateData.images = await Promise.all(
        req.files.map(async (file) => {
          try {
            const webpBuffer = await sharp(file.buffer).webp({ quality: 80 }).toBuffer();
            const b64 = webpBuffer.toString("base64");
            return `data:image/webp;base64,${b64}`;
          } catch (err) {
            console.error("Error converting uploaded product image to WebP:", err);
            const b64 = Buffer.from(file.buffer).toString("base64");
            return `data:${file.mimetype};base64,${b64}`;
          }
        })
      );
    }

    if (sizesStr) {
      let sizes = typeof sizesStr === "string" ? JSON.parse(sizesStr) : sizesStr;
      if (Array.isArray(sizes)) {
        updateData.sizes = sizes.map(s => {
          const mrp = (s.mrp === "" || s.mrp === null || s.mrp === undefined) ? null : Number(s.mrp);
          const offerPrice = (s.offerPrice === "" || s.offerPrice === null || s.offerPrice === undefined) ? null : Number(s.offerPrice);
          return {
            ...s,
            mrp: isNaN(mrp) ? null : mrp,
            offerPrice: isNaN(offerPrice) ? null : offerPrice
          };
        });
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Invalidate cache so next request fetches fresh data
    cache.invalidate(CACHE_KEY);

    res.json({ success: true, product });
  } catch (error) {
    if (error.name === "ValidationError") {
      console.error("Validation Error:", JSON.stringify(error.errors, null, 2));
      return res.status(400).json({ success: false, message: "Validation Error", errors: error.errors });
    }
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Invalidate cache
    cache.invalidate(CACHE_KEY);

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
