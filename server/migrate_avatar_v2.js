const mongoose = require("mongoose");

const mongoUri = "mongodb://localhost:27017/hairoil_db";

async function migrate() {
  try {
    console.log(`Connecting to ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    const db = mongoose.connection.db;
    const collection = db.collection("users");

    console.log("Renaming profilePic to avatar for all users...");
    
    // We update manually via mongodb driver to bypass schema issues
    const result = await collection.updateMany(
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
