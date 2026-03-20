require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

const resetAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing admins to reset to the specific requested one
    await Admin.deleteMany({});
    console.log("Cleared existing admins.");

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("12345", salt);

    // Create new admin
    const admin = new Admin({
      email: "admin@kalaagalya.com",
      password: hashedPassword,
      name: "Kala Agalya",
      role: "owner"
    });

    await admin.save();
    console.log("✅ Admin created successfully!");
    console.log("Name: Kala Agalya");
    console.log("Email: admin@kalaagalya.com");
    console.log("Password: 12345");
    console.log("\nPlease use these credentials to login.");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

resetAdmin();
