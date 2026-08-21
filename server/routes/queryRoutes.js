const express = require("express");
const router = express.Router();
const { submitQuery, getAllQueries, resolveQuery, deleteQuery } = require("../controllers/queryController");
const adminAuth = require("../middleware/adminAuth");

// Public — anyone can submit a query
router.post("/", submitQuery);

// Admin only
router.get("/", adminAuth, getAllQueries);
router.put("/:id/resolve", adminAuth, resolveQuery);
router.delete("/:id", adminAuth, deleteQuery);

module.exports = router;
