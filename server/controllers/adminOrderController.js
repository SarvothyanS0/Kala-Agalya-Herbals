const Order = require("../models/Order");
const Product = require("../models/Product");

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Use IST (UTC+5:30) for "today" boundary
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // 5h 30m in ms
    const istNow = new Date(now.getTime() + istOffset);
    const todayIST = new Date(Date.UTC(
      istNow.getUTCFullYear(),
      istNow.getUTCMonth(),
      istNow.getUTCDate(),
      0, 0, 0, 0
    ));
    // Convert IST midnight back to UTC for DB query
    const todayStart = new Date(todayIST.getTime() - istOffset);

    const [
      totalOrders,
      paidSalesAgg,
      todayOrders,
      pendingOrders,
      paidOrders,
      todayPendingOrders,
      todayPaidOrders
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: "PAID" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]),
      Order.countDocuments({ createdAt: { $gte: todayStart } }),
      Order.countDocuments({ orderStatus: "Pending" }),
      Order.countDocuments({ paymentStatus: "PAID" }),
      Order.countDocuments({ orderStatus: "Pending", createdAt: { $gte: todayStart } }),
      Order.countDocuments({ paymentStatus: "PAID", createdAt: { $gte: todayStart } })
    ]);

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalSales: paidSalesAgg[0]?.total || 0,
        todayOrders,
        pendingOrders,
        paidOrders,
        todayPendingOrders,
        todayPaidOrders
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Get sales chart data
exports.getSalesChartData = async (req, res) => {
  try {
    const { period } = req.query; // 'daily' or 'monthly'
    
    let groupBy;
    if (period === 'monthly') {
      groupBy = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" }
      };
    } else {
      groupBy = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" }
      };
    }
    
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: groupBy,
          totalSales: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      { $limit: 30 }
    ]);
    
    res.json({ success: true, salesData });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get reports by date range
exports.getReports = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {};
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lte: end };
    }
    
    const orders = await Order.find(query).sort({ createdAt: -1 });
    
    const totalSales = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    
    // Get all active products to ensure even 0-sale products are listed
    const allProducts = await Product.find({ isActive: true });
    
    // Get best-selling products
    const productSales = {};
    
    // Initialize with 0
    allProducts.forEach(prod => {
      if (prod.sizes && prod.sizes.length > 0) {
        prod.sizes.forEach(size => {
          const key = `${prod.name || "Unknown Product"} - ${size.size || "N/A"}`;
          productSales[key] = { name: key, quantity: 0, revenue: 0 };
        });
      }
    });

    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const name = item.name || "Unknown Product";
          const size = item.size || "N/A";
          const key = `${name} - ${size}`;
          if (!productSales[key]) {
            productSales[key] = { name: key, quantity: 0, revenue: 0 };
          }
          const qty = Number(item.quantity) || 0;
          const price = Number(item.price) || 0;
          productSales[key].quantity += qty;
          productSales[key].revenue += price * qty;
        });
      }
    });
    
    const bestSelling = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity);
    
    res.json({
      success: true,
      report: {
        totalOrders: orders.length,
        totalSales,
        bestSelling,
        orders
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
