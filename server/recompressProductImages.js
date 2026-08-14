/**
 * recompressProductImages.js
 * One-time migration: re-compresses all existing product base64 images in MongoDB
 * to max 600px / WebP quality 60 so mobile devices can actually load them.
 *
 * Run: node recompressProductImages.js
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env"), override: true });

const mongoose = require("mongoose");
const sharp    = require("sharp");
const Product  = require("./models/Product");

async function recompress() {
  await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const products = await Product.find({});
  console.log(`Found ${products.length} product(s) to process.\n`);

  let totalSavedKB = 0;

  for (const product of products) {
    if (!product.images || product.images.length === 0) {
      console.log(`[${product.name}] - no images, skipping.`);
      continue;
    }

    console.log(`Processing: ${product.name} (${product.images.length} image(s))`);

    const newImages = [];

    for (let i = 0; i < product.images.length; i++) {
      const imgStr = product.images[i];

      // Only process data URIs (base64)
      if (!imgStr.startsWith("data:")) {
        console.log(`  [img ${i + 1}] Not a data URI, skipping.`);
        newImages.push(imgStr);
        continue;
      }

      try {
        const base64Data = imgStr.split(",")[1];
        if (!base64Data) {
          console.log(`  [img ${i + 1}] Empty base64, skipping.`);
          newImages.push(imgStr);
          continue;
        }

        const originalBuffer = Buffer.from(base64Data, "base64");
        const originalKB = (originalBuffer.length / 1024).toFixed(1);

        // Re-compress: resize to max 600px, WebP quality 60
        const compressedBuffer = await sharp(originalBuffer)
          .resize({ width: 600, height: 600, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 60 })
          .toBuffer();

        const compressedKB = (compressedBuffer.length / 1024).toFixed(1);
        const savedKB = parseFloat(originalKB) - parseFloat(compressedKB);
        totalSavedKB += savedKB;

        const newB64 = compressedBuffer.toString("base64");
        newImages.push(`data:image/webp;base64,${newB64}`);

        console.log(`  [img ${i + 1}] ${originalKB} KB -> ${compressedKB} KB  (saved ${savedKB.toFixed(1)} KB)`);
      } catch (err) {
        console.error(`  [img ${i + 1}] Error re-compressing:`, err.message);
        newImages.push(imgStr); // Keep original on error
      }
    }

    product.images = newImages;
    await product.save();
    console.log(`  Saved.\n`);
  }

  console.log(`Done! Total space saved: ~${(totalSavedKB / 1024).toFixed(2)} MB`);
  await mongoose.disconnect();
  process.exit(0);
}

recompress().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
