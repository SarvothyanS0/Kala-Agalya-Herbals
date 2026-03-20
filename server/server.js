require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/admin/orders", require("./routes/adminOrderRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
