import React, { useState, useEffect } from "react";
import { useToast } from "./Alert";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { API_URL, BASE_URL } from "./services/api";

const staticReviews = [
  {
    _id: "static_1",
    name: "Ananya S.",
    rating: 5,
    comment: "This hair oil is a miracle! I've been suffering from severe hair fall for months, but within just two weeks of using Kala Agalya, my hair fall has completely stopped. My roots feel stronger, and my hair is noticeably thicker. Highly recommended!",
    image: "/images/Home 4.webp",
    createdAt: "2024-05-10T10:00:00.000Z"
  },
  {
    _id: "static_2",
    name: "Priya Menon",
    rating: 5,
    comment: "The cooling effect on the scalp is so relaxing. I use it twice a week, and not only has it cured my dandruff, but it has also given my hair a beautiful natural shine. It truly feels like an authentic ayurvedic remedy.",
    image: "/images/home 2.webp",
    createdAt: "2024-04-22T14:30:00.000Z"
  },
  {
    _id: "static_3",
    name: "Lakshmi R.",
    rating: 4,
    comment: "I love the smell and texture. It's not too sticky compared to other herbal oils. I can already see baby hairs growing at my hairline. Will definitely purchase the 500ml bottle next time!",
    image: "/images/Home 5.webp",
    createdAt: "2024-03-15T09:15:00.000Z"
  }
];

export default function Product() {
  const [dbProduct, setDbProduct] = useState(null);
  const [dbProducts, setDbProducts] = useState([]);
  const [reviews, setReviews] = useState(staticReviews);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    comment: ""
  });
  const [reviewImage, setReviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const getImg = (images, sizeIdx) => {
    if (!images || images.length === 0) return "/images/icons/logo.webp";
    const img = images[sizeIdx] || images[0]; 
    if (img.startsWith("http")) return img;
    if (img.startsWith("data:image")) return img;
    if (img.startsWith("/images/")) return img;
    return `${BASE_URL.replace(/\/api$/, "")}${img.startsWith("/") ? img : `/${img}`}`;
  };

  // Returns a lightweight image reference safe for localStorage (never base64).
  const getSafeCartImg = (images, sizeIdx) => {
    if (!images || images.length === 0) return "/images/icons/logo.webp";
    const img = images[sizeIdx] || images[0];
    if (img.startsWith("data:image")) return "/images/icons/logo.webp"; // skip base64
    if (img.startsWith("http")) return img;
    if (img.startsWith("/images/")) return img;
    return `${BASE_URL.replace(/\/api$/, "")}${img.startsWith("/") ? img : `/${img}`}`;
  };

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products.length > 0) {
          setDbProducts(data.products);
          const master = data.products[0]; 
          setDbProduct(master);
          fetchReviews(master._id);
        }
      })
      .catch(err => console.error("Error fetching product:", err))
      .finally(() => setLoading(false));
  }, []);

  const fetchReviews = (productId) => {
    fetch(`${API_URL}/reviews/${productId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setReviews([...staticReviews, ...data]);
        }
      })
      .catch(err => console.error("Error fetching reviews:", err));
  };

  const products = dbProducts.filter(p => p.isActive).flatMap(prod =>
    prod.sizes.map((s, idx) => {
      const sellingPrice = s.price;
      const mrpPrice = (s.mrp && s.mrp > s.price) ? s.mrp : null;
      const discountPct = mrpPrice ? Math.round(((mrpPrice - sellingPrice) / mrpPrice) * 100) : null;
      return {
        ...s,
        id: `${prod._id}-${s.size}`,
        productId: prod._id,
        name: prod.name,
        description: prod.description,
        img: getImg(prod.images, idx),
        cartImg: getSafeCartImg(prod.images, idx),
        ml: s.size,
        price: sellingPrice,
        mrp: mrpPrice,
        discountPct,
        stock: true,
        savings: discountPct ? `${discountPct}% OFF` : null
      };
    })
  );

  const addToCart = (product) => {
    // Load cart without images (localStorage is image-free by design)
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => {
      if (item.id && product.id) return item.id === product.id;
      return item.size === product.ml && item.name === product.name;
    });

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        productId: product.productId,
        name: product.name,
        size: product.ml,
        price: product.price,
        quantity: 1
        // Note: img is intentionally NOT stored here to avoid localStorage quota errors.
        // Cart.jsx fetches and injects images from the backend on load.
      });
    }
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
      document.dispatchEvent(new Event("cartUpdated"));
      addToast("Product added to cart successfully!", "success");
    } catch (e) {
      addToast("Cart storage error. Please refresh and try again.", "error");
    }
  };

  const buyNow = (product) => {
    addToCart(product);
    window.location.href = "/cart";
  };



  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!dbProduct) {
      addToast("Unable to submit review. Product not found.", "error");
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("productId", dbProduct._id);
    formData.append("name", reviewForm.name);
    formData.append("rating", reviewForm.rating);
    formData.append("comment", reviewForm.comment);
    if (reviewImage) formData.append("image", reviewImage);

    try {
      const res = await fetch(`${API_URL}/reviews`, { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        addToast("Review submitted successfully!", "success");
        setReviewForm({ name: "", rating: 5, comment: "" });
        setReviewImage(null);
        fetchReviews(dbProduct._id);
        const fileInput = document.getElementById("review-image");
        if (fileInput) fileInput.value = "";
      } else {
        addToast(data.message || "Failed to submit review", "error");
      }
    } catch (err) {
      addToast("Error submitting review", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const avgRating = reviews.length 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : "5.0";
    
  const stats = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => r.rating === stars).length;
    const pct = reviews.length ? ((count / reviews.length) * 100).toFixed(0) + "%" : "0%";
    return { stars, pct };
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2921] relative overflow-hidden font-sans">
      <Helmet>
        <title>Shop Kala Agalya Naturopathy Herbal Products | Natural Wellness</title>
      </Helmet>

      {/* Global CSS for Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatImage {
          0% { transform: translateY(0px) rotate(0deg) scale(1); filter: drop-shadow(0 10px 15px rgba(234,179,8,0.1)); }
          50% { transform: translateY(-15px) rotate(2deg) scale(1.05); filter: drop-shadow(0 25px 35px rgba(234,179,8,0.25)); }
          100% { transform: translateY(0px) rotate(0deg) scale(1); filter: drop-shadow(0 10px 15px rgba(234,179,8,0.1)); }
        }
        @keyframes shimmerGlow {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes revealUp {
          0% { opacity: 0; transform: translateY(50px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: floatImage 6s ease-in-out infinite;
        }
        .glass-card {
          background: #FFFFFF;
          border: 1px solid rgba(234,179,8,0.1);
          box-shadow: 0 8px 32px rgba(0,0,0,0.04);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .glass-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(234,179,8,0.4);
          box-shadow: 0 15px 45px rgba(234,179,8,0.12);
        }
        .text-shimmer {
          background: linear-gradient(to right, #b45309 20%, #78350f 40%, #b45309 60%, #b45309 80%);
          background-size: 200% auto;
          color: #000;
          background-clip: text;
          text-fill-color: transparent;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmerGlow 4s linear infinite;
        }
        .reveal-delay-1 { animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards; opacity: 0; }
        .reveal-delay-2 { animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
        .reveal-delay-3 { animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards; opacity: 0; }
        
        .pulse-border {
          position: relative;
        }
        .pulse-border::before {
          content: "";
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          background: linear-gradient(45deg, transparent, rgba(234,179,8,0.2), transparent);
          z-index: -1;
          animation: shimmerGlow 3s linear infinite;
        }
      `}} />

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 px-4 overflow-hidden min-h-[60vh] flex items-center border-b border-yellow-500/10 bg-[#FDFBF7]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-multiply"></div>
        
        {/* Dynamic Glow Backgrounds */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 w-full text-center reveal-delay-1">
          <div className="inline-block p-4 mb-6 rounded-full bg-white border border-yellow-500/20 shadow-md pulse-border">
            <img src="/images/icons/logo.webp" alt="Logo" className="h-16 w-auto" />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight font-soria text-[#2C2921]">
            Naturopathy <span className="text-yellow-600 block md:inline">Herbal Products</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#4A473E] max-w-2xl mx-auto font-light mb-10 font-playfair">
            Revitalize your wellness with our 100% organic, chemical-free herbal formulations. 
            Experience the pure power of nature.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
            <span className="px-5 py-2 rounded-full bg-lime-900/10 border border-lime-500/30 text-lime-700 shadow-[0_0_15px_rgba(132,204,22,0.05)] font-sans">🌿 100% Organic</span>
            <span className="px-5 py-2 rounded-full bg-yellow-900/10 border border-yellow-500/30 text-yellow-700 shadow-[0_0_15px_rgba(234,179,8,0.05)] font-sans">✨ Pure & Natural</span>
            <span className="px-5 py-2 rounded-full bg-orange-900/10 border border-orange-500/30 text-orange-700 shadow-[0_0_15px_rgba(249,115,22,0.05)] font-sans">💪 Holistic Wellness</span>
          </div>
        </div>
      </header>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 py-24 relative z-10" id="shop">
        <div className="text-center mb-16 reveal-delay-2">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C2921] mb-4 font-soria">Select Your Bottle Size</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 reveal-delay-3">
             <div className="w-16 h-16 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-[#6C685F] reveal-delay-3 bg-white rounded-3xl border border-yellow-500/10 shadow-sm font-playfair">
            Products are currently being restocked. Please check back later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product, index) => (
              <div 
                key={product.id}
                className={`glass-card rounded-3xl overflow-hidden relative reveal-delay-${(index % 3) + 1}`}
              >
                {product.savings && (
                  <div className="absolute top-5 right-5 bg-gradient-to-r from-red-600 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold z-20 shadow-lg tracking-wider font-sans">
                    {product.savings}
                  </div>
                )}
                
                {product.ml === "200 ml" && (
                  <div className="absolute top-5 left-5 bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-bold z-20 shadow-md">
                    ★ Popular
                  </div>
                )}

                <div className="h-80 bg-gradient-to-b from-[#FDFBF7] to-[#F5F2EB] relative flex items-center justify-center p-8 group">
                  <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="w-48 h-48 bg-yellow-500/10 rounded-full absolute blur-[40px] group-hover:bg-yellow-500/20 transition-all duration-500"></div>
                  
                  <img
                    src={product.img}
                    alt={`${product.ml} bottle`}
                    className="relative z-10 h-full w-auto object-contain animate-float"
                  />
                </div>

                <div className="p-8 relative">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent"></div>
                  
                  <div className="text-center mb-6">
                    <h3 className="text-3xl font-black text-[#2C2921] mb-2 font-soria">{product.ml}</h3>
                    <p className="text-[#6C685F] text-sm font-sans">{product.description}</p>
                  </div>

                  <div className="flex flex-col items-center gap-1 mb-8">
                    {product.mrp && (
                      <div className="flex items-center gap-3">
                        <span className="text-lg text-[#7C786E] line-through decoration-red-500/70 font-medium">MRP ₹{product.mrp}</span>
                        {product.discountPct && (
                          <span className="text-xs font-extrabold bg-red-500/20 text-red-500 border border-red-500/30 px-2 py-0.5 rounded-full font-sans">
                            {product.discountPct}% OFF
                          </span>
                        )}
                      </div>
                    )}
                    <span className="text-5xl font-extrabold text-yellow-600 font-soria">₹{product.price}</span>
                    {product.mrp && (
                      <span className="text-xs text-green-600 font-semibold font-sans">
                        You save ₹{product.mrp - product.price}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-center mb-8">
                     <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border bg-lime-900/10 text-lime-700 border-lime-500/30 font-sans">
                       Available
                     </span>
                  </div>

                  <div className="space-y-4 font-sans">
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full py-4 rounded-xl font-bold uppercase tracking-wide transition-all bg-[#F5F2EB] text-yellow-700 border border-yellow-500/30 hover:bg-yellow-500/10 hover:border-yellow-400"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => buyNow(product)}
                      className="w-full py-4 rounded-xl font-bold uppercase tracking-wide transition-all bg-gradient-to-r from-yellow-500 to-amber-600 text-black hover:from-yellow-400 hover:to-amber-500 shadow-[0_4px_15px_rgba(234,179,8,0.2)] hover:shadow-[0_6px_20px_rgba(234,179,8,0.4)]"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reviews Section */}
      <section className="py-24 bg-[#FDFBF7] border-t border-yellow-500/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 reveal-delay-1">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2C2921] mb-4 font-soria">Customer Experience</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            {/* Rating Summary */}
            <div className="glass-card p-10 rounded-3xl h-fit reveal-delay-2 text-center bg-white border border-yellow-500/10 shadow-lg">
              <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-500 to-amber-700 drop-shadow-sm font-soria">{avgRating}</div>
              <div className="text-yellow-600 text-3xl tracking-widest my-4">★★★★★</div>
              <p className="text-[#6C685F] font-medium mb-8 font-sans">Based on {reviews.length} reviews</p>
              
              <div className="space-y-3">
                {stats.map((row) => (
                  <div key={row.stars} className="flex items-center gap-4 text-sm font-medium font-sans">
                    <span className="w-12 text-[#4A473E] text-right">{row.stars} ★</span>
                    <div className="flex-1 h-2.5 bg-[#F5F2EB] rounded-full overflow-hidden border border-yellow-500/10">
                      <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full" style={{ width: row.pct }}></div>
                    </div>
                    <span className="w-12 text-left text-[#6C685F]">{row.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Share Your Experience Form */}
            <div className="lg:col-span-2 reveal-delay-3">
              <div className="glass-card p-8 md:p-10 rounded-3xl bg-white border border-yellow-500/10 shadow-lg">
                <h3 className="text-2xl font-bold text-[#2C2921] mb-8 border-b border-yellow-500/10 pb-4 font-playfair">Share Your Experience</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-6 font-sans">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[#6C685F] text-sm mb-2 font-medium">Your Name</label>
                      <input type="text" required className="w-full bg-[#F5F2EB] border border-yellow-500/20 rounded-xl px-5 py-3.5 text-[#2C2921] focus:border-yellow-500 outline-none transition-colors" value={reviewForm.name} onChange={e => setReviewForm({...reviewForm, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[#6C685F] text-sm mb-2 font-medium">Rating</label>
                      <div className="relative">
                        <select className="w-full bg-[#F5F2EB] border border-yellow-500/20 rounded-xl px-5 py-3.5 text-[#2C2921] focus:border-yellow-500 outline-none transition-colors appearance-none pr-10 cursor-pointer" value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm, rating: Number(e.target.value)})}>
                          <option value="5">5 - Excellent (Highly Recommended)</option>
                          <option value="4">4 - Good</option>
                          <option value="3">3 - Average</option>
                          <option value="2">2 - Fair</option>
                          <option value="1">1 - Poor</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                          <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#6C685F] text-sm mb-2 font-medium">Your Review</label>
                    <textarea required className="w-full bg-[#F5F2EB] border border-yellow-500/20 rounded-xl px-5 py-4 text-[#2C2921] focus:border-yellow-500 outline-none transition-colors h-32 resize-none" value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}></textarea>
                  </div>
                  <div>
                     <label className="block text-[#6C685F] text-sm mb-2 font-medium">Add a Photo (Optional)</label>
                     <input id="review-image" type="file" accept="image/*" className="block w-full text-sm text-[#6C685F] file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-yellow-500/10 file:text-yellow-600 hover:file:bg-yellow-500/20 file:transition-colors cursor-pointer" onChange={e => setReviewImage(e.target.files[0])} />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black px-10 py-4 rounded-xl font-bold hover:from-yellow-400 hover:to-amber-500 transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)] disabled:opacity-50 text-lg w-full md:w-auto uppercase tracking-widest font-extrabold">
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width Horizontal Running Review Slider (Marquee Banner) */}
        <div className="relative w-full overflow-hidden py-12 border-y border-yellow-500/10 bg-[#F5F2EB]/30">
          {reviews.length === 0 ? (
            <div className="text-center py-10 text-[#6C685F] italic font-playfair">No reviews yet. Be the first to share your results!</div>
          ) : (
            <div className="flex gap-8 w-max">
              <div className="animate-marquee gap-8">
                {reviews.map((review, i) => (
                  <div key={`marquee-1-${review._id || i}`} className="w-[350px] sm:w-[450px] shrink-0 bg-white border border-yellow-500/10 rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-amber-800 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner">
                            {review.name ? review.name[0].toUpperCase() : "U"}
                          </div>
                          <div>
                            <h4 className="font-bold text-[#2C2921] text-base">{review.name}</h4>
                            <div className="flex text-yellow-600 text-xs mt-0.5 tracking-wider">
                              {[...Array(5)].map((_, starI) => (
                                <span key={starI}>{starI < review.rating ? "★" : "☆"}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-[#7C786E] font-medium font-playfair">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className="text-[#4A473E] leading-relaxed text-sm mb-4 italic font-playfair">"{review.comment}"</p>
                    </div>
                    
                    {review.image && (
                      <div className="mt-4 rounded-xl overflow-hidden border border-yellow-500/10 inline-block self-start relative group">
                        <img 
                          src={review.image.startsWith("data:image") || review.image.startsWith("http") || review.image.startsWith("/images/") ? review.image : `${BASE_URL.replace(/\/api$/, "")}${review.image.startsWith("/") ? review.image : `/${review.image}`}`} 
                          alt={`Review photo by ${review.name}`} 
                          className="w-28 h-28 object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="animate-marquee gap-8" aria-hidden="true">
                {reviews.map((review, i) => (
                  <div key={`marquee-2-${review._id || i}`} className="w-[350px] sm:w-[450px] shrink-0 bg-white border border-yellow-500/10 rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-amber-800 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner">
                            {review.name ? review.name[0].toUpperCase() : "U"}
                          </div>
                          <div>
                            <h4 className="font-bold text-[#2C2921] text-base">{review.name}</h4>
                            <div className="flex text-yellow-600 text-xs mt-0.5 tracking-wider">
                              {[...Array(5)].map((_, starI) => (
                                <span key={starI}>{starI < review.rating ? "★" : "☆"}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-[#7C786E] font-medium font-playfair">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className="text-[#4A473E] leading-relaxed text-sm mb-4 italic font-playfair">"{review.comment}"</p>
                    </div>
                    
                    {review.image && (
                      <div className="mt-4 rounded-xl overflow-hidden border border-yellow-500/10 inline-block self-start relative group">
                        <img 
                          src={review.image.startsWith("data:image") || review.image.startsWith("http") || review.image.startsWith("/images/") ? review.image : `${BASE_URL.replace(/\/api$/, "")}${review.image.startsWith("/") ? review.image : `/${review.image}`}`} 
                          alt={`Review photo by ${review.name}`} 
                          className="w-28 h-28 object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
