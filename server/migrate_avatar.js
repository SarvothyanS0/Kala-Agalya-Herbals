const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

// Minimal Schema to avoid path issues
const UserSchema = new mongoose.Schema({
  profilePic: String,
  avatar: String
}, { strict: false });

const User = mongoose.model("User", UserSchema);

async function migrate() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/hairoil_db";
    console.log(`Connecting to ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log("Renaming profilePic to avatar for all users...");
    const result = await User.updateMany(
      { profilePic: { $exists: true } },
      [
        { $set: { avatar: { $ifNull: ["$avatar", "$profilePic"] } } },
        { $unset: "profilePic" }
      ]
    );

    console.log(`Migration complete. Results:`, result);
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
