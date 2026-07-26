import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL, BASE_URL } from "./services/api";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Strip any base64 images from old localStorage cart data immediately
    let saved = JSON.parse(localStorage.getItem("cart")) || [];
    const stripped = saved.map(({ img, ...rest }) => rest);
    try { localStorage.setItem("cart", JSON.stringify(stripped)); } catch(e) {
      localStorage.removeItem("cart");
      saved = [];
    }
    setCart(stripped);

    // Sync with backend to get up-to-date prices and images (images stay in state only)
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products) {
          const updatedCart = stripped.map(item => {
            const dbProduct = data.products.find(p => {
              if (item.productId) return p._id === item.productId;
              if (item.id) return item.id.startsWith(p._id);
              return p.name === item.name;
            });
            if (dbProduct) {
              const sizeIdx = dbProduct.sizes.findIndex(s => s.size === item.size);
              if (sizeIdx !== -1) {
                const dbSize = dbProduct.sizes[sizeIdx];
                const newPrice = dbSize.offerPrice || dbSize.price;

                // Build image URL for display in React state only (base64 OK here — stripped before localStorage write)
                let rawImg = dbProduct.images && (dbProduct.images[sizeIdx] || dbProduct.images[0]);
                let displayImg = "/images/icons/logo.webp";
                if (rawImg) {
                  if (rawImg.startsWith("data:image")) {
                    displayImg = rawImg; // base64 is fine in React state; stripped from localStorage below
                  } else if (rawImg.startsWith("http") || rawImg.startsWith("/images/")) {
                    displayImg = rawImg;
                  } else {
                    displayImg = `${BASE_URL.replace(/\/api$/, "")}${rawImg.startsWith("/") ? rawImg : `/${rawImg}`}`;
                  }
                }

                return { ...item, price: newPrice, img: displayImg };
              }
            }
            return item;
          });

          // Save to localStorage WITHOUT images to avoid QuotaExceededError
          const lightCart = updatedCart.map(({ img, ...rest }) => rest);
          try { localStorage.setItem("cart", JSON.stringify(lightCart)); } catch(e) { /* ignore */ }
          document.dispatchEvent(new Event("cartUpdated"));

          // Keep full data (with img) in React state for display
          setCart(updatedCart);
        }
      })
      .catch(err => console.error("Error syncing cart data:", err));
  }, []);


  const updateCart = (updated) => {
    setCart(updated);
    // Strip images from localStorage to prevent QuotaExceededError
    const lightCart = updated.map(({ img, ...rest }) => rest);
    try { localStorage.setItem("cart", JSON.stringify(lightCart)); } catch(e) { /* ignore */ }
    document.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (index) => {
    const updated = cart.filter((_, i) => i !== index);
    updateCart(updated);
  };

  const increaseQty = (index) => {
    const updated = [...cart];
    updated[index].quantity += 1;
    updateCart(updated);
  };

  const decreaseQty = (index) => {
    const updated = [...cart];
    if (updated[index].quantity > 1) {
      updated[index].quantity -= 1;
      updateCart(updated);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const checkout = () => {
    window.location.href = "/checkout";
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-10 pb-20 relative overflow-hidden text-[#2C2921]">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-yellow-500/2 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/2 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            to="/product" 
            className="inline-flex items-center gap-2 text-[#7C786E] hover:text-yellow-600 transition-colors group px-4 py-2 rounded-lg hover:bg-black/5 font-playfair"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </Link>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-yellow-600 text-center drop-shadow-[0_0_15px_rgba(234,179,8,0.1)] font-soria">
          Your Shopping Cart
        </h2>

        {cart.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-yellow-500/10 shadow-xl">
            <div className="text-8xl mb-6 opacity-30">🛒</div>
            <p className="text-2xl text-[#6C685F] mb-8 font-light italic font-playfair">Your cart is feeling a bit light...</p>
            <Link to="/product" className="inline-block px-10 py-4 bg-yellow-600 text-black font-bold rounded-xl shadow-[0_4px_15px_rgba(234,179,8,0.3)] hover:bg-yellow-500 transition-all duration-300 font-sans">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-3xl border border-yellow-500/10 hover:border-yellow-500/30 shadow-xl transition-all duration-300 group">
                  {/* Image */}
                  <div className="w-24 h-24 bg-[#F5F2EB] rounded-2xl p-2 border border-yellow-500/5 group-hover:border-yellow-500/20 transition-colors flex items-center justify-center">
                    <img src={item.img} alt={item.name} className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)]" />
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 text-center sm:text-left">
                    <p className="font-bold text-xl text-[#2C2921] mb-1 group-hover:text-yellow-700 transition-colors uppercase tracking-tight font-playfair">{item.name}</p>
                    <p className="text-[#6C685F] text-sm mb-2">Size: {item.size}</p>
                    <p className="font-bold text-yellow-600 text-lg font-soria">₹ {item.price * item.quantity}</p>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex flex-col items-center sm:items-end gap-3">
                    <div className="flex items-center bg-[#F5F2EB] rounded-xl border border-yellow-500/10 p-1">
                      <button onClick={() => decreaseQty(index)} className="w-8 h-8 flex items-center justify-center text-[#7C786E] hover:text-yellow-600 transition-colors text-xl">−</button>
                      <span className="w-10 text-center font-bold text-[#2C2921]">{item.quantity}</span>
                      <button onClick={() => increaseQty(index)} className="w-8 h-8 flex items-center justify-center text-[#7C786E] hover:text-yellow-600 transition-colors text-xl">+</button>
                    </div>
                    <button onClick={() => removeItem(index)} className="text-red-600/70 hover:text-red-600 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-1 group/remove font-sans">
                       <span className="group-hover/remove:underline">Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-3xl border border-yellow-500/10 shadow-xl sticky top-24">
                <h3 className="text-2xl font-bold text-[#2C2921] mb-8 border-b border-yellow-500/10 pb-4 font-playfair">Order Summary</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-[#6C685F] font-sans">
                    <span>Subtotal</span>
                    <span className="text-[#2C2921] font-bold">₹ {total}</span>
                  </div>
                  <div className="flex justify-between text-[#6C685F] font-sans">
                    <span>Shipping</span>
                    <span className="text-lime-700 text-sm">Calculated at checkout</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-10 pt-4 border-t border-yellow-500/10 font-soria">
                  <span className="text-xl font-bold text-[#2C2921]">Total</span>
                  <span className="text-3xl font-bold text-yellow-600 drop-shadow-[0_0_10px_rgba(234,179,8,0.1)]">₹ {total}</span>
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={checkout}
                    className="w-full group relative py-5 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 bg-size-200 hover:bg-pos-100 text-black font-extrabold text-xl rounded-2xl shadow-[0_4px_15px_rgba(234,179,8,0.2)] hover:shadow-[0_6px_20px_rgba(234,179,8,0.4)] transform hover:-translate-y-1 transition-all duration-500 uppercase tracking-widest overflow-hidden font-sans"
                  >
                     <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none skew-x-12 -translate-x-full group-hover:translate-x-full duration-1000"></div>
                     <span className="relative z-10 flex items-center justify-center gap-2">
                        Proceed to Checkout
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                     </span>
                  </button>
                  
                  <Link
                    to="/product"
                    className="w-full py-4 bg-transparent border border-gray-300 text-[#7C786E] hover:text-[#2C2921] hover:bg-black/5 transition-all text-center block rounded-xl font-bold uppercase tracking-tight font-sans"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        .bg-size-200 { background-size: 200% auto; }
        .hover\\:bg-pos-100:hover { background-position: right center; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}



