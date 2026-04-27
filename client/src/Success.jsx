import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { API_URL } from "./services/api";

// ─── Invoice PDF Generator ────────────────────────────────────────────────────
function generateInvoiceHTML(order) {
  const invoiceNo = `KAH-${order._id.toString().slice(-8).toUpperCase()}`;
  const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric"
  });
  const subtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const gst = Math.round(subtotal * 0.05);
  const shipping = 0;
  const itemsRows = order.items.map(item => `
    <tr>
      <td style="padding:14px 16px;border-bottom:1px solid #2a2000;font-size:14px;color:#e5e7eb;">${item.name}</td>
      <td style="padding:14px 16px;border-bottom:1px solid #2a2000;font-size:13px;color:#9ca3af;text-align:center;">${item.size || "-"}</td>
      <td style="padding:14px 16px;border-bottom:1px solid #2a2000;font-size:13px;color:#9ca3af;text-align:center;">${item.quantity}</td>
      <td style="padding:14px 16px;border-bottom:1px solid #2a2000;font-size:13px;color:#9ca3af;text-align:right;">₹${item.price.toFixed(2)}</td>
      <td style="padding:14px 16px;border-bottom:1px solid #2a2000;font-size:14px;color:#fbbf24;font-weight:700;text-align:right;">₹${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join("");

  const addr = order.customer.address;
  const fullAddress = [addr?.door, addr?.street, addr?.landmark, addr?.district, addr?.state, addr?.pincode]
    .filter(Boolean).join(", ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invoice ${invoiceNo} | Kala Agalya Herbals</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #0a0802; color: #e5e7eb; }
    .page { max-width: 820px; margin: 0 auto; padding: 48px 40px; background: #0d0b03; min-height: 100vh; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; }
    .logo-section {}
    .logo-name { font-size: 26px; font-weight: 900; color: #fbbf24; letter-spacing: 1px; }
    .logo-tagline { font-size: 10px; color: #92400e; text-transform: uppercase; letter-spacing: 4px; margin-top: 4px; }
    .invoice-badge { text-align: right; }
    .invoice-title { font-size: 36px; font-weight: 900; color: #fbbf24; letter-spacing: -1px; }
    .invoice-no { font-size: 13px; color: #78350f; text-transform: uppercase; letter-spacing: 3px; margin-top: 6px;}
    .invoice-date { font-size: 12px; color: #6b7280; margin-top: 4px; }
    .top-bar { height: 3px; background: linear-gradient(90deg, #b45309, #fbbf24, #b45309); border-radius: 2px; margin-bottom: 40px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 40px; }
    .info-box { background: #15120a; border: 1px solid #2a1a00; border-radius: 14px; padding: 24px; }
    .info-label { font-size: 9px; font-weight: 800; color: #78350f; text-transform: uppercase; letter-spacing: 4px; margin-bottom: 14px; }
    .info-value { font-size: 15px; font-weight: 700; color: #f3f4f6; line-height: 1.4; }
    .info-sub { font-size: 12px; color: #6b7280; margin-top: 6px; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 32px; background: #15120a; border-radius: 14px; overflow: hidden; border: 1px solid #2a1a00; }
    thead { background: linear-gradient(135deg, #451a03, #2a1000); }
    th { padding: 14px 16px; text-align: left; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; color: #fbbf24; }
    th:last-child, th:nth-child(3), th:nth-child(4) { text-align: right; }
    th:nth-child(2), th:nth-child(3) { text-align: center; }
    .totals { display: flex; justify-content: flex-end; margin-bottom: 40px; }
    .totals-box { background: #15120a; border: 1px solid #2a1a00; border-radius: 14px; padding: 24px 32px; min-width: 280px; }
    .total-row { display: flex; justify-content: space-between; align-items: center; padding: 7px 0; font-size: 13px; color: #9ca3af; }
    .total-row.grand { padding-top: 14px; margin-top: 8px; border-top: 1px solid #2a1a00; font-size: 18px; font-weight: 900; color: #fbbf24; }
    .status-badge { display: inline-block; background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.3); color: #4ade80; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; padding: 4px 12px; border-radius: 99px; }
    .payment-id { font-size: 11px; color: #6b7280; margin-top: 8px; word-break: break-all; }
    .footer { text-align: center; padding-top: 32px; border-top: 1px solid #1a1000; }
    .footer-brand { font-size: 16px; font-weight: 900; color: #fbbf24; letter-spacing: 1px; }
    .footer-text { font-size: 10px; color: #4b3800; text-transform: uppercase; letter-spacing: 3px; margin-top: 6px; }
    .footer-note { font-size: 11px; color: #374151; margin-top: 16px; }
    @media print {
      body { background: #0a0802 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .page { padding: 24px 30px; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <!-- Download / Print button (hidden on print) -->
  <div class="no-print" style="position:fixed;top:20px;right:20px;z-index:999;display:flex;gap:12px;">
    <button onclick="window.print()" style="cursor:pointer;padding:12px 24px;background:linear-gradient(135deg,#b45309,#fbbf24);color:#0a0802;font-family:'Inter',sans-serif;font-weight:800;font-size:12px;text-transform:uppercase;letter-spacing:2px;border:none;border-radius:10px;box-shadow:0 0 20px rgba(251,191,36,0.3);">
      ⬇ Download PDF
    </button>
  </div>

  <div class="page">
    <div class="top-bar"></div>

    <div class="header">
      <div class="logo-section">
        <div class="logo-name">🌿 Kala Agalya Herbals</div>
        <div class="logo-tagline">Pure • Natural • Naturopathy</div>
      </div>
      <div class="invoice-badge">
        <div class="invoice-title">INVOICE</div>
        <div class="invoice-no">#${invoiceNo}</div>
        <div class="invoice-date">Date: ${date}</div>
        <div class="invoice-date" style="margin-top:3px;font-size:10px;color:#6b7280;">Order ID: ${order._id}</div>
        <div style="margin-top:10px;">
          <span class="status-badge">✓ PAID</span>
        </div>
        ${order.paymentId ? `<div class="payment-id">TXN: ${order.paymentId}</div>` : ""}
      </div>
    </div>

    <div class="grid-2">
      <div class="info-box">
        <div class="info-label">Billed To</div>
        <div class="info-value">${order.customer.name}</div>
        <div class="info-sub">
          ${order.customer.email || ""}<br/>
          ${order.customer.phone || ""}
          ${order.customer.altPhone ? ` / ${order.customer.altPhone}` : ""}
        </div>
      </div>
      <div class="info-box">
        <div class="info-label">Shipping Address</div>
        <div class="info-value" style="font-size:13px;">${fullAddress || "Not provided"}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th style="text-align:center;">Size</th>
          <th style="text-align:center;">Qty</th>
          <th style="text-align:right;">Unit Price</th>
          <th style="text-align:right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-box">
        <div class="total-row"><span>Subtotal</span><span>₹${subtotal.toFixed(2)}</span></div>
        <div class="total-row"><span>GST (5%)</span><span>₹${gst.toFixed(2)}</span></div>
        <div class="total-row"><span>Shipping</span><span style="color:#4ade80;">FREE</span></div>
        <div class="total-row grand"><span>Total</span><span>₹${order.totalAmount.toFixed(2)}</span></div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-brand">Kala Agalya Herbals</div>
      <div class="footer-text">Thank you for your order!</div>
      <div class="footer-note">
        For any queries, contact us at kalaagalyaherbals@gmail.com<br/>
        GSTIN: Applied For &nbsp;•&nbsp; kalaagalyaherbals.in
      </div>
    </div>
  </div>
</body>
</html>`;
}

function openInvoice(order) {
  const html = generateInvoiceHTML(order);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  // Prompt print dialog automatically after load
  if (win) {
    win.onload = () => {
      setTimeout(() => win.print(), 600);
    };
  }
}

// ─── Success Page ─────────────────────────────────────────────────────────────
export default function Success() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "failed"
  const [message, setMessage] = useState("");
  const [order, setOrder] = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  useEffect(() => {
    const transactionId = searchParams.get("transactionId");

    if (!transactionId) {
      setStatus("failed");
      setMessage("No transaction ID found. Please contact support.");
      return;
    }

    const verifyPayment = async () => {
      try {
        // 1. Verify payment status
        const res = await fetch(`${API_URL}/orders/status/${transactionId}`);
        const data = await res.json();

        if (data.success) {
          // 2. Fetch order details for invoice
          try {
            const orderRes = await fetch(`${API_URL}/orders/${transactionId}`);
            const orderData = await orderRes.json();
            if (orderData.success) setOrder(orderData.order);
          } catch (_) {
            // Invoice won't be available but page still works
          }
          setStatus("success");
          setMessage("Your payment was successful! We are preparing your order.");
          localStorage.removeItem("lastOrderId");
        } else {
          setStatus("failed");
          setMessage(data.message || "Payment was not completed. Please try again.");
        }
      } catch (err) {
        setStatus("failed");
        setMessage("Could not verify payment. Please contact support with your transaction ID.");
      }
    };

    verifyPayment();
  }, [searchParams]);

  const handleInvoice = () => {
    if (!order) return;
    setInvoiceLoading(true);
    setTimeout(() => {
      openInvoice(order);
      setInvoiceLoading(false);
    }, 200);
  };

  // ── Loading ──
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0802] flex items-center justify-center">
        <Helmet>
          <title>Verifying Payment | Kala Agalya Herbals</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-yellow-400 font-bold uppercase tracking-widest text-sm animate-pulse">
            Verifying your payment...
          </p>
          <p className="text-gray-600 text-xs mt-3 uppercase tracking-widest">Please do not close this window</p>
        </div>
      </div>
    );
  }

  // ── Success ──
  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#0a0802] flex items-center justify-center px-4 py-12">
        <Helmet>
          <title>Payment Successful | Kala Agalya Herbals</title>
          <meta name="description" content="Thank you for your order! Your payment was successful." />
          <meta name="robots" content="noindex" />
        </Helmet>

        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 max-w-lg w-full text-center">
          {/* Success icon */}
          <div className="w-28 h-28 mx-auto mb-8 relative">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-500/20 to-amber-500/10 border-2 border-yellow-500/40 flex items-center justify-center shadow-[0_0_60px_rgba(234,179,8,0.3)]">
              <svg className="w-14 h-14 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-yellow-500/20 animate-ping"></div>
          </div>

          <div className="bg-[#15120a] border border-yellow-500/20 rounded-3xl p-10 shadow-2xl">
            <div className="inline-block bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-1 mb-6">
              <span className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.4em]">Payment Successful</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              🎉 Order Placed!
            </h1>
            <p className="text-gray-400 mb-3 leading-relaxed">{message}</p>
            <p className="text-gray-500 text-sm mb-8">
              Your <span className="text-yellow-400 font-medium">Kala Agalya Herbals</span> Naturopathy Oil is on its way!
            </p>

            {/* Invoice Button */}
            {order && (
              <button
                onClick={handleInvoice}
                disabled={invoiceLoading}
                className="w-full mb-6 py-4 flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-600 to-amber-700 text-black rounded-xl font-black uppercase tracking-widest text-xs shadow-[0_0_25px_rgba(234,179,8,0.25)] hover:shadow-[0_0_40px_rgba(234,179,8,0.45)] transform hover:-translate-y-0.5 active:scale-95 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {invoiceLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    <span>Generating Invoice...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download Invoice (PDF)</span>
                  </>
                )}
              </button>
            )}

            <div className="border-t border-yellow-900/20 mb-6"></div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/product"
                className="flex-1 py-4 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-yellow-500/20 transition-all"
              >
                Continue Shopping
              </Link>
              <Link
                to="/profile"
                className="flex-1 py-4 bg-[#0d0b03] border border-yellow-900/30 text-gray-400 rounded-xl font-bold uppercase tracking-widest text-xs hover:border-yellow-500/30 hover:text-yellow-400 transition-all"
              >
                My Profile
              </Link>
            </div>
          </div>

          <p className="mt-6 text-[10px] text-gray-700 uppercase tracking-[0.3em] font-bold">
            Secured by PhonePe • 256-bit SSL Encrypted
          </p>
        </div>
      </div>
    );
  }

  // ── Failed ──
  return (
    <div className="min-h-screen bg-[#0a0802] flex items-center justify-center px-4">
      <Helmet>
        <title>Payment Failed | Kala Agalya Herbals</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-lg w-full text-center">
        <div className="w-28 h-28 mx-auto mb-8 relative">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-red-500/20 to-red-900/10 border-2 border-red-500/40 flex items-center justify-center shadow-[0_0_60px_rgba(239,68,68,0.2)]">
            <svg className="w-14 h-14 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        <div className="bg-[#15120a] border border-red-500/20 rounded-3xl p-10 shadow-2xl">
          <div className="inline-block bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1 mb-6">
            <span className="text-red-400 text-[10px] font-black uppercase tracking-[0.4em]">Payment Failed</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            ❌ Payment Failed
          </h1>
          <p className="text-gray-400 mb-3 leading-relaxed">{message}</p>
          <p className="text-gray-500 text-sm mb-10">
            Don't worry — your cart is safe. You can try again from the payment page.
          </p>

          <div className="border-t border-red-900/20 mb-8"></div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/cart"
              className="flex-1 py-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-red-500/20 transition-all"
            >
              Back to Cart
            </Link>
            <Link
              to="/payment"
              className="flex-1 py-4 bg-gradient-to-r from-indigo-700 to-purple-800 text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(107,33,168,0.2)] hover:shadow-[0_0_30px_rgba(107,33,168,0.4)] transition-all"
            >
              Try Again
            </Link>
          </div>
        </div>

        <p className="mt-6 text-[10px] text-gray-700 uppercase tracking-[0.3em] font-bold">
          Need help? Contact us at kalaagalyaherbals@gmail.com
        </p>
      </div>
    </div>
  );
}
