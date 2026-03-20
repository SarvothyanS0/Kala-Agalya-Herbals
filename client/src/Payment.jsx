import { Link } from "react-router-dom";
import { useToast } from "./Alert";
import { useState } from "react";

export default function Payment() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handlePhonePePay = async () => {
    // 1. Get the order that was just created in Checkout
    const lastOrderId = localStorage.getItem("lastOrderId");

    if (!lastOrderId) {
      return addToast("Please complete the checkout step again", "warning");
    }

    setLoading(true);
    try {
      const response = await fetch("https://kala-agalya-herbals.onrender.com/api/orders/initiate-phonepe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ orderId: lastOrderId })
      });

      const data = await response.json();

      if (data.success && data.redirectUrl) {
        localStorage.removeItem("cart");
        document.dispatchEvent(new Event("cartUpdated"));
        window.location.href = data.redirectUrl;
      } else {
        console.error("PhonePe error details:", data);
        addToast(`PhonePe Error: ${data.message || "Unknown"} (code: ${data.code || "?"})`, "error");
      }
    } catch (err) {
      console.error("Payment Initiation Error:", err);
      addToast("Server connection error during payment", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0802] pt-10 pb-20 relative overflow-hidden text-gray-200">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            to="/checkout" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition-colors group px-4 py-2 rounded-lg hover:bg-white/5 font-bold uppercase tracking-widest text-[10px]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Logistics
          </Link>
        </div>

        <div className="bg-[#15120a] p-10 md:p-16 rounded-3xl border border-yellow-500/10 shadow-2xl text-center relative overflow-hidden group">
          {/* Top accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500"></div>
          
          <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse shadow-[0_0_30px_rgba(234,179,8,0.2)]">
            <span className="text-4xl">🔐</span>
          </div>
          
          <h2 className="text-4xl font-bold mb-4 text-white uppercase tracking-wider">Secure Payment</h2>
          <p className="text-gray-400 mb-10 max-w-sm mx-auto leading-relaxed">
            Final Step: Complete your transaction via <span className="text-yellow-500 font-bold border-b border-yellow-500/30">PhonePe</span> secure layer.
          </p>

          <div className="bg-[#0d0b03] p-8 rounded-2xl border border-yellow-500/5 mb-10 flex flex-col md:flex-row justify-between items-center gap-6 shadow-inner">
            <div className="text-left">
              <p className="text-[10px] text-gray-600 uppercase font-black tracking-[0.2em] mb-1">Estimated Invoice</p>
              <h3 className="text-5xl font-black text-yellow-500 tracking-tighter">₹{total}</h3>
            </div>
            <div className="flex flex-col items-center gap-2">
               <div className="flex items-center gap-3 bg-white/5 px-6 py-4 rounded-2xl border border-yellow-500/10 transform transition-transform hover:scale-105 duration-300">
                  <span className="text-xs text-indigo-400 font-black uppercase tracking-widest">PhonePe</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></div>
               </div>
               <p className="text-[8px] text-gray-700 uppercase font-bold tracking-widest">NPCI UPI Verified</p>
            </div>
          </div>

          <button
            onClick={handlePhonePePay}
            disabled={loading}
            className="w-full py-5 bg-gradient-to-r from-indigo-800 to-purple-900 text-white font-black text-xl rounded-xl shadow-[0_0_25px_rgba(107,33,168,0.3)] hover:shadow-[0_0_40px_rgba(107,33,168,0.5)] transform hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 uppercase tracking-widest flex items-center justify-center gap-4 group-hover:from-indigo-700 group-hover:to-purple-800"
          >
            {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Enroute...</span>
                </>
            ) : (
                <>
                  Proceed with PhonePe
                  <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </>
            )}
          </button>
          
          <div className="mt-10 flex items-center justify-center gap-8 border-t border-white/5 pt-8 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
             <span className="text-xs font-bold text-gray-500">UPI</span>
             <span className="text-xs font-bold text-gray-500">CARDS</span>
             <span className="text-xs font-bold text-gray-500">NETBANK</span>
          </div>
          
          <p className="mt-8 text-[9px] text-gray-700 uppercase tracking-[0.3em] font-black">
            256-Bit SSL Encryption Active
          </p>
        </div>
      </div>
    </div>
  );
}
