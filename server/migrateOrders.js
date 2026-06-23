require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const Order = require("./models/Order");

async function generateUniqueOrderId() {
  let unique = false;
  let orderId = "";
  while (!unique) {
    // Generate 8-digit number string
    orderId = Math.floor(10000000 + Math.random() * 90000000).toString();
    const existing = await Order.findOne({ orderId });
    if (!existing) {
      unique = true;
    }
  }
  return orderId;
}

const migrate = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not defined");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const orders = await Order.find({ orderId: { $exists: false } });
    console.log(`Found ${orders.length} orders to migrate.`);

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      order.orderId = await generateUniqueOrderId();
      await order.save();
      console.log(`Migrated order ${order._id} -> orderId: ${order.orderId}`);
    }

    console.log("Migration complete!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
};

migrate();
