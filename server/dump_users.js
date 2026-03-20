const mongoose = require("mongoose");
const mongoUri = "mongodb://localhost:27017/hairoil_db";

async function dump() {
  await mongoose.connect(mongoUri);
  const users = await mongoose.connection.db.collection("users").find({}).toArray();
  console.log(JSON.stringify(users.map(u => ({ name: u.name, email: u.email, avatar: u.avatar })), null, 2));
  process.exit(0);
}

dump();
