const express = require("express");
const router = express.Router();
const { createOrder, initiatePhonePe, checkStatus } = require("../controllers/orderController");

router.post("/", createOrder);
router.post("/initiate-phonepe", initiatePhonePe);
router.get("/status/:merchantTransactionId", checkStatus);

module.exports = router;
