const Query = require("../models/Query");

// Submit a new query (public — no auth needed)
exports.submitQuery = async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ success: false, message: "Name, phone and message are required" });
    }
    const query = await Query.create({ name, phone, email, message });
    res.status(201).json({ success: true, message: "Query submitted successfully", query });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all queries (admin only)
exports.getAllQueries = async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.json({ success: true, queries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Mark query as resolved (admin only)
exports.resolveQuery = async (req, res) => {
  try {
    const query = await Query.findByIdAndUpdate(
      req.params.id,
      { status: "resolved" },
      { new: true }
    );
    if (!query) return res.status(404).json({ success: false, message: "Query not found" });
    res.json({ success: true, query });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete query (admin only)
exports.deleteQuery = async (req, res) => {
  try {
    await Query.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Query deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
