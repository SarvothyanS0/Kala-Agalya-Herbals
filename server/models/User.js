const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    // Removed required true to allow OAuth users without initial password
  },
  phone: {
    type: String,
    trim: true,
  },
  avatar: String,
  isGoogleUser: {
    type: Boolean,
    default: false,
  },
  provider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: "India" },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  resetPasswordOTP: String,
  resetPasswordOTPExpires: Date,
}, {
  timestamps: true
});

// Middleware to hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  console.log("Hashing password for user:", this.email);
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
