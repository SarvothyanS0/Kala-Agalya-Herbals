const Order = require("../models/Order");
const crypto = require("crypto");

/**
 * Standard Order Creation (from Checkout)
 */
exports.createOrder = async (req, res) => {
  try {
    const order = await Order.create({
        ...req.body,
        paymentStatus: "PENDING",
        orderStatus: "Pending"
    });
    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Initiate PhonePe Payment (from Payment Page)
 */
exports.initiatePhonePe = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    const merchantTransactionId = order._id.toString();
    const rawId = (order.customer.email || order.customer.name || "user");
    const merchantUserId = rawId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 30);

    const payload = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: merchantUserId,
      amount: order.totalAmount * 100, // in paise
      redirectUrl: `${process.env.CLIENT_URL}/success`, // Redirect here after payment
      redirectMode: "REDIRECT",
      callbackUrl: process.env.PHONEPE_CALLBACK_URL,
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
    const stringToHash = base64Payload + "/pg/v1/pay" + process.env.PHONEPE_SALT_KEY;
    const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
    const xVerifyHeader = sha256 + "###" + process.env.PHONEPE_SALT_INDEX;

    const response = await fetch(process.env.PHONEPE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": xVerifyHeader,
        "accept": "application/json"
      },
      body: JSON.stringify({ request: base64Payload })
    });

    const rawText = await response.text();
    console.log("PhonePe raw response (status", response.status, "):", rawText);
    
    let data;
    try {
      data = JSON.parse(rawText);
    } catch(e) {
      return res.status(500).json({ success: false, message: "PhonePe returned non-JSON: " + rawText.slice(0, 200) });
    }
    
    console.log("PhonePe parsed response:", JSON.stringify(data, null, 2));

    if (data.success && data.data && data.data.instrumentResponse) {
      res.json({
        success: true,
        redirectUrl: data.data.instrumentResponse.redirectInfo.url,
      });
    } else {
      // Return full PhonePe error details for easier debugging
      res.status(400).json({ 
        success: false, 
        message: data.message || "Init failed",
        code: data.code,
        phonePeData: data.data || null
      });
    }

  } catch (err) {
    console.error("PhonePe Initiation Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Check Status
 */
exports.checkStatus = async (req, res) => {
    try {
        const { merchantTransactionId } = req.params;
        const merchantId = process.env.PHONEPE_MERCHANT_ID;
        const saltKey = process.env.PHONEPE_SALT_KEY;
        const saltIndex = process.env.PHONEPE_SALT_INDEX;
    
        const stringToHash = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + saltKey;
        const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
        const xVerifyHeader = sha256 + "###" + saltIndex;
    
        const checkUrl = `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`;
    
        const response = await fetch(checkUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-VERIFY": xVerifyHeader,
            "X-MERCHANT-ID": merchantId,
            "accept": "application/json"
          }
        });
    
        const data = await response.json();
    
        if (data.success && data.code === "PAYMENT_SUCCESS") {
          await Order.findByIdAndUpdate(merchantTransactionId, {
            paymentStatus: "PAID",
            paymentId: data.data.transactionId
          });
          res.json({ success: true, message: "Payment Verified" });
        } else {
          res.json({ success: false, message: data.message });
        }
    
    } catch (error) {
        console.error("Status Check Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
