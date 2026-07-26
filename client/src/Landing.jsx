import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useToast } from "./Alert";
import { API_URL, BASE_URL } from "./services/api";

const heroSlides = [
  {
    title: "Revitalize Your",
    highlight: "Natural Shine",
    subtitle: "Experience the ancient power of 18+ rare herbs blended in pure coconut oil.",
    badge: "🌿 100% Naturopathy & Organic",
    image: "/images/Home 1.webp",
    alt: "Naturopathy herbal hair oil bottle showcase - Kala Agalya Herbals"
  },
  {
    title: "Strengthen Your",
    highlight: "Roots From Within",
    subtitle: "Clinically proven formula enriched with Amla and Hibiscus to stop hair fall.",
    badge: "💪 Zero Hair Fall Guarantee",
    image: "/images/home 2.webp",
    alt: "Natural hair growth treatment with 18 rare herbs"
  },
  {
    title: "Pure Nature",
    highlight: "In Every Drop",
    subtitle: "Free from parabens, sulfates, and mineral oils. Just pure nature.",
    badge: "✨ Premium Quality Promise",
    image: "/images/Home 3.webp",
    alt: "Organic hair oil chemical-free formula"
  },
  {
    title: "Nourish Your",
    highlight: "Scalp Deeply",
    subtitle: "Soothe your scalp and eliminate dandruff with the cooling essence of Vetiver and Neem.",
    badge: "🌱 Soothing Scalp Care",
    image: "/images/Home 4.webp",
    alt: "Deep nourishment and scalp care"
  },
  {
    title: "Restore Your",
    highlight: "Natural Volume",
    subtitle: "Stimulate new hair follicles with the richness of Fenugreek and Black Cumin.",
    badge: "🌟 Volume Booster",
    image: "/images/Home 5.webp",
    alt: "Hair volume and density restoration"
  },
  {
    title: "Embrace The",
    highlight: "Ayurvedic Secret",
    subtitle: "A time-tested blend crafted to lock in moisture and protect from daily damage.",
    badge: "🛡️ Complete Protection",
    image: "/images/Home 6.webp",
    alt: "Ayurvedic hair protection and moisture"
  }
];

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

export default function Landing() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addToast } = useToast();

  // Product state
  const [dbProduct, setDbProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState(staticReviews);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" });
  const [reviewImage, setReviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const getImg = (images, sizeIdx) => {
    if (!images || images.length === 0) return "/images/icons/logo.webp";
    const img = images[sizeIdx] || images[0];
    if (img.startsWith("http")) return img;
    if (img.startsWith("data:image")) return img;
    if (img.startsWith("/images/")) return img;
    return `${BASE_URL.replace(/\/api$/, "")}${img.startsWith("/") ? img : `/${img}`}`;
  };

  const fetchReviews = (productId) => {
    fetch(`${API_URL}/reviews/${productId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setReviews([...staticReviews, ...data]);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products.length > 0) {
          const master = data.products[0];
          setDbProduct(master);
          fetchReviews(master._id);
          const parsed = data.products.filter(p => p.isActive).flatMap(prod =>
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
                ml: s.size,
                price: sellingPrice,
                mrp: mrpPrice,
                discountPct,
                savings: discountPct ? `${discountPct}% OFF` : null
              };
            })
          );
          setProducts(parsed);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProducts(false));
  }, []);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => item.id === product.id || (item.size === product.ml && item.name === product.name));
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id: product.id, productId: product.productId, name: product.name, size: product.ml, price: product.price, quantity: 1 });
    }
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
      document.dispatchEvent(new Event("cartUpdated"));
      addToast("Product added to cart successfully!", "success");
    } catch {
      addToast("Cart storage error. Please refresh and try again.", "error");
    }
  };

  const buyNow = (product) => {
    addToCart(product);
    window.location.href = "/cart";
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!dbProduct) { addToast("Unable to submit review. Product not found.", "error"); return; }
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
        const fi = document.getElementById("review-image");
        if (fi) fi.value = "";
      } else {
        addToast(data.message || "Failed to submit review", "error");
      }
    } catch { addToast("Error submitting review", "error"); }
    finally { setIsSubmitting(false); }
  };

  const avgRating = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "5.0";
  const ratingStats = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => r.rating === stars).length;
    const pct = reviews.length ? ((count / reviews.length) * 100).toFixed(0) + "%" : "0%";
    return { stars, pct };
  });

  const ingredients = [
    { name: "Amla", img: "/images/amla.webp", benefit: "Strengthens Roots" },
    { name: "Hibiscus", img: "/images/Hibiscus.webp", benefit: "Prevents Hair Fall" },
    { name: "Aloe Vera", img: "/images/aloe-vera.webp", benefit: "Natural Conditioner" },
    { name: "Neem", img: "/images/neem.webp", benefit: "Dandruff Control" },
    { name: "Coconut Oil", img: "/images/coconut-oil.webp", benefit: "Deep Nourishment" },
    { name: "Vetiver", img: "/images/vetiver.webp", benefit: "Cooling Effect" },
    { name: "Fenugreek", img: "/images/Fenugreek.webp", benefit: "Prevents Shedding" },
    { name: "Henna", img: "/images/Henna.webp", benefit: "Natural Color" },
    { name: "Curry Leaves", img: "/images/curry-leaves.webp", benefit: "Rich in Iron" },
    { name: "Black Cumin", img: "/images/black-cumin.webp", benefit: "Anti-Inflammatory" },
    { name: "Rose Petals", img: "/images/rose-petals.webp", benefit: "Scalp Soothing" },
    { name: "Pearl Onion", img: "/images/pearl-onion.webp", benefit: "Growth Booster" },
    { name: "False Daisy", img: "/images/false-daisy.webp", benefit: "Rejuvenation" },
    { name: "Rosemary", img: "/images/rosemary.webp", benefit: "Circulation" },
    { name: "Tanner's Cassia", img: "/images/tanners-cassia.webp", benefit: "Antibacterial" },
  ];

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Kala Agalya Herbals",
    "url": "https://kalaagalyaherbals.com",
    "logo": "https://kalaagalyaherbals.com/images/icons/logo.webp",
    "description": "Premium Naturopathy Herbal Hair Oil made with 18+ rare herbs for hair growth and hair fall control.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-7338758727",
      "contactType": "customer service"
    }
  };

  return (
    <div className="overflow-x-hidden relative">
      <Helmet>
        <title>Kala Agalya Herbals | Best Naturopathy Herbal Hair Oil for Growth & Hair Fall</title>
        <meta name="description" content="Experience the ancient power of 18+ rare herbs with Kala Agalya Herbals. Our 100% organic Naturopathy hair oil strengthens roots, prevents hair fall, and promotes natural shine." />
        <meta name="keywords" content="herbal hair oil, Naturopathy hair growth oil, natural hair care, stop hair fall, organic hair oil India, Kala Agalya Herbals" />
        <link rel="canonical" href="https://kalaagalyaherbals.com" />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#FDFBF7]"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/5 rounded-full filter blur-[100px] animate-blob"></div>
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-amber-500/5 rounded-full filter blur-[100px] animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-lime-500/5 rounded-full filter blur-[100px] animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 w-full grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10 py-20">
          
          {/* Left Text Content - Carousel */}
          <div className="relative min-h-[450px] md:min-h-[500px] flex items-center">
            {heroSlides.map((slide, index) => (
              <div 
                key={index}
                className={`absolute inset-0 flex flex-col justify-center transition-all duration-1000 ease-in-out transform ${
                  index === currentSlide 
                    ? 'opacity-100 translate-x-0 scale-100' 
                    : index < currentSlide 
                      ? 'opacity-0 -translate-x-10 scale-95'
                      : 'opacity-0 translate-x-10 scale-95'
                }`}
              >
                  <h2 className="text-lg md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-800 tracking-[0.2em] mb-4 uppercase font-soria">
                    Kala Agalya Herbals
                  </h2>
                  <span className="inline-block w-fit py-1.5 px-4 bg-lime-900/10 text-lime-700 rounded-full text-xs md:text-sm font-semibold mb-6 border border-lime-500/20 font-sans">
                    {slide.badge}
                  </span>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 text-[#2C2921] font-soria">
                    {slide.title} <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-amber-700 to-yellow-600 animate-gradient-x">
                      {slide.highlight}
                    </span>
                  </h1>
                  <p className="text-base md:text-lg lg:text-xl text-[#4A473E] mb-8 max-w-lg leading-relaxed font-playfair">
                    {slide.subtitle}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                    <a href="#product" className="w-full sm:w-auto">
                      <button className="relative w-full px-8 py-4 bg-yellow-600 text-black font-bold rounded-xl overflow-hidden group hover:scale-105 transition-transform duration-300 shadow-[0_0_25px_rgba(234,179,8,0.5)] border border-yellow-400/50">
                         <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                         <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-30 group-hover:animate-shine" />
                         <span className="relative flex items-center justify-center gap-2">
                           Shop Now 
                           <span className="text-xl">✨</span>
                         </span>
                      </button>
                    </a>
                    <button 
                      onClick={() => document.getElementById('ingredients').scrollIntoView({ behavior: 'smooth' })}
                      className="w-full sm:w-auto px-8 py-4 bg-transparent border border-yellow-500 text-yellow-500 font-bold rounded-xl hover:bg-yellow-500/10 hover:shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-all duration-300 cursor-pointer backdrop-blur-sm"
                    >
                      View Ingredients
                    </button>
                  </div>

                  <div className="mt-8 md:mt-12 flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm font-medium text-[#4A473E] font-sans">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_10px_#d97706]"></span>
                      Fast Delivery
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></span>
                      No Chemicals
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></span>
                      Cruelty Free
                    </div>
                  </div>
              </div>
            ))}
          </div>

          {/* Right Image Content */}
          <div className="relative min-h-[400px] md:h-[600px] flex items-center justify-center md:-translate-x-10 mt-12 md:mt-0">
            {heroSlides.map((slide, index) => (
              <div 
                key={index}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-in-out transform ${
                  index === currentSlide 
                    ? 'opacity-100 translate-x-0 scale-100 md:scale-110' 
                    : index < currentSlide 
                      ? 'opacity-0 -translate-x-20 scale-90 blur-sm'
                      : 'opacity-0 translate-x-20 scale-90 blur-sm'
                }`}
              >
                <div className="relative z-10 animate-[float_4s_ease-in-out_infinite]">
                  <img 
                    src={slide.image}
                    alt={slide.alt} 
                    className="w-full max-h-[350px] md:max-h-[600px] object-contain mx-auto drop-shadow-[0_0_50px_rgba(234,179,8,0.6)] filter brightness-110"
                  />
                </div>
                {/* Glowing effect behind bottle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-yellow-500/5 blur-[80px] md:blur-[130px] rounded-full pointer-events-none"></div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Stats Section */}
      <section className="scroll-animate scroll-scale bg-white py-10 relative -mt-10 mx-4 md:mx-auto max-w-6xl rounded-2xl shadow-xl z-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border border-yellow-500/10">
        <div>
          <h3 className="text-4xl font-bold text-yellow-600 font-soria">100%</h3>
          <p className="text-[#6C685F] mt-1 font-sans">Natural Ingredients</p>
        </div>
        <div>
          <h3 className="text-4xl font-bold text-yellow-600 font-soria">5000+</h3>
          <p className="text-[#6C685F] mt-1 font-sans">Happy Customers</p>
        </div>
        <div>
          <h3 className="text-4xl font-bold text-yellow-600 font-soria">18+</h3>
          <p className="text-[#6C685F] mt-1 font-sans">Rare Herbs</p>
        </div>
        <div>
          <h3 className="text-4xl font-bold text-yellow-600 font-soria">4.9</h3>
          <p className="text-[#6C685F] mt-1 font-sans">Star Rating</p>
        </div>
      </section>

      {/* ── Product Catalog Section ────────────────────── */}
      <section id="product" className="py-24 bg-[#FDFBF7] relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-5 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#2C2921] font-soria mb-4">
              Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-800">Bottle Size</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto rounded-full mb-4"></div>
            <p className="text-[#6C685F] text-lg max-w-xl mx-auto font-sans">
              100% Naturopathy herbal hair oil — choose the size that suits your routine.
            </p>
          </div>

          {loadingProducts ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-16 h-16 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-[#6C685F] bg-white rounded-3xl border border-yellow-500/10 shadow-sm font-playfair">
              Products are currently being restocked. Please check back later.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className={`scroll-animate scroll-delay-${(index % 3) + 1} group relative bg-white rounded-3xl overflow-hidden border border-yellow-500/10 shadow-md hover:shadow-[0_15px_45px_rgba(234,179,8,0.12)] hover:-translate-y-2 hover:border-yellow-500/40 transition-all duration-500`}
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

                  {/* Product Image */}
                  <div className="h-72 bg-gradient-to-b from-[#FDFBF7] to-[#F5F2EB] relative flex items-center justify-center p-8">
                    <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="w-44 h-44 bg-yellow-500/10 rounded-full absolute blur-[40px] group-hover:bg-yellow-500/20 transition-all duration-500"></div>
                    <img
                      src={product.img}
                      alt={`${product.ml} bottle`}
                      className="relative z-10 h-full w-auto object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-[0_8px_25px_rgba(234,179,8,0.2)]"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-7 relative">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent"></div>
                    
                    <div className="text-center mb-5">
                      <h3 className="text-3xl font-black text-[#2C2921] mb-1 font-soria">{product.ml}</h3>
                      <p className="text-[#6C685F] text-sm line-clamp-2 font-sans">{product.description}</p>
                    </div>

                    <div className="flex flex-col items-center gap-1 mb-6">
                      {product.mrp && (
                        <div className="flex items-center gap-3">
                          <span className="text-base text-[#7C786E] line-through decoration-red-500/70 font-medium">MRP ₹{product.mrp}</span>
                          {product.discountPct && (
                            <span className="text-xs font-extrabold bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full font-sans">
                              {product.discountPct}% OFF
                            </span>
                          )}
                        </div>
                      )}
                      <span className="text-5xl font-extrabold text-yellow-600 font-soria">₹{product.price}</span>
                      {product.mrp && (
                        <span className="text-xs text-green-600 font-semibold font-sans">You save ₹{product.mrp - product.price}</span>
                      )}
                    </div>

                    <span className="flex justify-center mb-6">
                      <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border bg-lime-900/10 text-lime-700 border-lime-500/30 font-sans">
                        ✓ Available
                      </span>
                    </span>

                    <div className="space-y-3 font-sans">
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full py-3.5 rounded-xl font-bold uppercase tracking-wide transition-all bg-[#F5F2EB] text-yellow-700 border border-yellow-500/30 hover:bg-yellow-500/10 hover:border-yellow-400 hover:shadow-md"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => buyNow(product)}
                        className="w-full py-3.5 rounded-xl font-bold uppercase tracking-wide transition-all bg-gradient-to-r from-yellow-500 to-amber-600 text-black hover:from-yellow-400 hover:to-amber-500 shadow-[0_4px_15px_rgba(234,179,8,0.2)] hover:shadow-[0_6px_20px_rgba(234,179,8,0.4)]"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Reviews Section ─────────────────────────────── */}
      <section className="py-24 bg-white border-t border-yellow-500/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-yellow-500/5 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2C2921] mb-4 font-soria">Customer Experience</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            {/* Rating Summary */}
            <div className="scroll-animate bg-white p-10 rounded-3xl h-fit text-center border border-yellow-500/10 shadow-lg">
              <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-500 to-amber-700 drop-shadow-sm font-soria">{avgRating}</div>
              <div className="text-yellow-600 text-3xl tracking-widest my-4">★★★★★</div>
              <p className="text-[#6C685F] font-medium mb-8 font-sans">Based on {reviews.length} reviews</p>
              <div className="space-y-3">
                {ratingStats.map((row) => (
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

            {/* Review Form */}
            <div className="lg:col-span-2 scroll-animate">
              <div className="bg-white p-8 md:p-10 rounded-3xl border border-yellow-500/10 shadow-lg">
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
                          <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
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

          {/* Running Horizontal Review Slider */}
          <div className="relative w-full overflow-hidden py-10 border-t border-yellow-500/10 -mx-4 px-4">
            {reviews.length > 0 && (
              <div className="flex gap-8 w-max">
                <div className="animate-marquee gap-8">
                  {reviews.map((review, i) => (
                    <div key={`m1-${review._id || i}`} className="w-[340px] sm:w-[420px] shrink-0 bg-white border border-yellow-500/10 rounded-3xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-gradient-to-br from-yellow-600 to-amber-800 rounded-full flex items-center justify-center text-white font-bold text-base shadow-inner flex-shrink-0">
                              {review.name ? review.name[0].toUpperCase() : "U"}
                            </div>
                            <div>
                              <h4 className="font-bold text-[#2C2921] text-sm">{review.name}</h4>
                              <div className="flex text-yellow-500 text-xs mt-0.5">
                                {[...Array(5)].map((_, si) => <span key={si}>{si < review.rating ? "★" : "☆"}</span>)}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-[#7C786E] font-playfair">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-[#4A473E] leading-relaxed text-sm italic font-playfair">"{review.comment}"</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="animate-marquee gap-8" aria-hidden="true">
                  {reviews.map((review, i) => (
                    <div key={`m2-${review._id || i}`} className="w-[340px] sm:w-[420px] shrink-0 bg-white border border-yellow-500/10 rounded-3xl p-6 shadow-md flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-gradient-to-br from-yellow-600 to-amber-800 rounded-full flex items-center justify-center text-white font-bold text-base shadow-inner flex-shrink-0">
                              {review.name ? review.name[0].toUpperCase() : "U"}
                            </div>
                            <div>
                              <h4 className="font-bold text-[#2C2921] text-sm">{review.name}</h4>
                              <div className="flex text-yellow-500 text-xs mt-0.5">
                                {[...Array(5)].map((_, si) => <span key={si}>{si < review.rating ? "★" : "☆"}</span>)}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-[#7C786E] font-playfair">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-[#4A473E] leading-relaxed text-sm italic font-playfair">"{review.comment}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 relative bg-[#FDFBF7]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-5 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-20 scroll-animate">
            <h2 className="text-4xl md:text-6xl font-extrabold text-[#2C2921] mb-6 tracking-tight font-soria">
              Why this <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-800">Hair Oil?</span>
            </h2>
            <p className="text-xl md:text-2xl text-yellow-700 font-medium italic font-playfair">
              "We bring you the secrets of ancient Ayurveda, bottled with care and precision for the modern lifestyle."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { img: "Home 1.webp", title: "100% Ayurvedic Recipe", desc: "Ancient secrets formulated perfectly for modern, everyday hair care needs." },
              { img: "home 2.webp", title: "Zero Harmful Chemicals", desc: "Completely free from parabens, sulphates, mineral oils, and artificial colors." },
              { img: "Home 3.webp", title: "Proven Visible Results", desc: "Experience noticeable hair growth and significantly reduced hair fall in weeks." },
              { img: "Home 4.webp", title: "Deep Root Nourishment", desc: "Our oil penetrates deeply to strengthen your hair strands from the inside out." },
              { img: "Home 5.webp", title: "Scalp Cooling Effect", desc: "Alleviates stress and eliminates dandruff with natural cooling herbs like Vetiver." },
              { img: "Home 6.webp", title: "Restores Natural Shine", desc: "Locks in vital moisture and brings back your hair's beautiful, natural glow." }
            ].map((item, i) => (
              <div key={i} className={`scroll-animate scroll-delay-${(i % 3) + 1} group relative h-[400px] rounded-3xl overflow-hidden shadow-lg border border-yellow-500/10 bg-white`}>
                <div className="absolute inset-0 bg-white"></div>
                <div className="absolute inset-0 top-0 h-3/4 overflow-hidden flex items-center justify-center p-6 bg-gradient-to-b from-[#FDFBF7] to-[#F5F2EB]">
                  <div className="absolute inset-0 bg-yellow-500/5 mix-blend-overlay"></div>
                  <img 
                    src={`/images/${item.img}`} 
                    alt={item.title} 
                    className="w-full h-full object-contain transform group-hover:scale-110 group-hover:-translate-y-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] drop-shadow-[0_10px_20px_rgba(234,179,8,0.15)] filter brightness-95 group-hover:brightness-105" 
                  />
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-white via-white/95 to-transparent pt-20 pb-8 px-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-bold text-[#2C2921] mb-2 group-hover:text-yellow-700 transition-colors font-playfair">{item.title}</h3>
                  <p className="text-[#6C685F] text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 font-sans">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ingredients: Running Horizontal Marquee Slider ─── */}
      <section id="ingredients" className="py-24 bg-[#FDFBF7] relative border-t border-yellow-500/10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
        
        <div className="text-center mb-14 scroll-animate px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#2C2921] font-soria mb-4">
            Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-800">18+ Rare Herbs</span>
          </h2>
          <p className="text-[#6C685F] max-w-2xl mx-auto text-lg font-sans">
            Each bottle is infused with a potent blend of pure herbs, carefully selected for their unique hair-nourishing properties.
          </p>
        </div>

        {/* Marquee Row 1 — scrolling left */}
        <div className="relative w-full overflow-hidden mb-6">
          <div className="flex gap-6 w-max animate-marquee">
            {[...ingredients, ...ingredients].map((item, i) => (
              <div key={i} className="flex-shrink-0 flex flex-col items-center bg-white rounded-2xl border border-yellow-500/10 hover:border-yellow-400/40 shadow-sm hover:shadow-md transition-all duration-300 p-5 w-36 group">
                <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-yellow-500/20 group-hover:border-yellow-400 transition-colors shadow-sm">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h4 className="font-bold text-[#2C2921] text-xs text-center mb-1 font-playfair leading-tight">{item.name}</h4>
                <span className="text-[9px] text-lime-700 font-bold bg-lime-900/10 border border-lime-500/20 px-2 py-0.5 rounded-full uppercase tracking-wide text-center">{item.benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee Row 2 — scrolling right (reverse) */}
        <div className="relative w-full overflow-hidden">
          <div className="flex gap-6 w-max" style={{ animation: "marquee 35s linear infinite reverse" }}>
            {[...ingredients.slice().reverse(), ...ingredients.slice().reverse()].map((item, i) => (
              <div key={i} className="flex-shrink-0 flex flex-col items-center bg-white rounded-2xl border border-yellow-500/10 hover:border-yellow-400/40 shadow-sm hover:shadow-md transition-all duration-300 p-5 w-36 group">
                <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-yellow-500/20 group-hover:border-yellow-400 transition-colors shadow-sm">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h4 className="font-bold text-[#2C2921] text-xs text-center mb-1 font-playfair leading-tight">{item.name}</h4>
                <span className="text-[9px] text-lime-700 font-bold bg-lime-900/10 border border-lime-500/20 px-2 py-0.5 rounded-full uppercase tracking-wide text-center">{item.benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-[#14120B] border-t border-yellow-500/10 text-white py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-yellow-600/5 bg-[radial-gradient(circle_at_bottom,_transparent_0%,_#14120B_70%)] pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="scroll-animate text-3xl md:text-5xl font-bold mb-6 drop-shadow-[0_0_15px_rgba(234,179,8,0.2)] font-soria">Ready to Transform Your Hair Naturally?</h2>
          <p className="text-gray-400 mb-10 text-lg max-w-2xl mx-auto font-playfair">
            Join thousands of satisfied customers who have switched to Kala Agalya Herbals Herbal Organic Hair Oil.
          </p>
          <a href="#product">
            <button className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black px-10 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(234,179,8,0.7)] transition-all shadow-lg border border-yellow-400/50 uppercase tracking-widest font-sans font-extrabold">
              Get Your Natural Hair Growth Bottle Today
            </button>
          </a>
        </div>
      </section>

      {/* Global Animation Styles */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        @keyframes shine { 100% { left: 125%; } }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}
