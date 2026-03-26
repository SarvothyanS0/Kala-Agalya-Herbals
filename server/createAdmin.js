require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/Admin");
const bcrypt = require("bcryptjs");

const createInitialAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Create/Update initial admin
    let admin = await Admin.findOne({ email: "admin@hairoil.com" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    if (admin) {
      console.log("Admin exists! Updating password to ensure it is hashed...");
      admin.password = hashedPassword;
      await admin.save();
      console.log("✅ Admin updated successfully!");
    } else {
      admin = new Admin({
        email: "admin@hairoil.com",
        password: hashedPassword,
        name: "Admin User",
      });
      await admin.save();
      console.log("✅ Admin created successfully!");
    }
    console.log("Email: admin@hairoil.com");
    console.log("Password: admin123");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

createInitialAdmin();
