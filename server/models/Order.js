const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
    name: String,
    email: String,
    phone: String,
    altPhone: String,
    address: {
      door: String,
      street: String,
      landmark: String,
      district: String,
      state: String,
      pincode: String
    }
  },
  items: [
    {
      name: String,
      size: String,
      price: Number,
      quantity: Number
    }
  ],
  totalAmount: Number,
  shippingAmount: { type: Number, default: 0 },
  paymentId: { type: String, default: "" },
  paymentStatus: { type: String, enum: ["PENDING", "PAID"], default: "PENDING" },
  orderStatus: { 
    type: String, 
    enum: ["Pending", "Packed", "Shipped", "Delivered", "Cancelled"], 
    default: "Pending" 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  orderId: { type: String, unique: true }
});

async function generateUniqueOrderId() {
  const Order = mongoose.model("Order");
  let unique = false;
  let orderId = "";
  while (!unique) {
    orderId = Math.floor(10000000 + Math.random() * 90000000).toString();
    const existing = await Order.findOne({ orderId });
    if (!existing) {
      unique = true;
    }
  }
  return orderId;
}

orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderStatus: 1 });

orderSchema.pre("save", async function () {
  if (!this.orderId) {
    this.orderId = await generateUniqueOrderId();
  }
});

module.exports = mongoose.model("Order", orderSchema);
