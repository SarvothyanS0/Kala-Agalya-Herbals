import { Link } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useToast } from "./Alert";
import { API_URL, BASE_URL } from "./services/api";

/* ── Static data ──────────────────────────────────────────────── */
const heroSlides = [
  { title: "Revitalize Your", highlight: "Natural Shine",    subtitle: "Experience the ancient power of 18+ rare herbs blended in pure coconut oil.", badge: "🌿 100% Naturopathy & Organic",  image: "/images/Home 1.webp", alt: "Kala Agalya Herbals Naturopathy Hair Oil bottle" },
  { title: "Strengthen Your", highlight: "Roots From Within",subtitle: "Clinically proven formula enriched with Amla and Hibiscus to stop hair fall.",  badge: "💪 Zero Hair Fall Formula",      image: "/images/home 2.webp", alt: "Natural hair growth treatment with rare herbs" },
  { title: "Pure Nature",     highlight: "In Every Drop",    subtitle: "Free from parabens, sulfates, and mineral oils. Just pure nature.",              badge: "✨ Premium Quality Promise",    image: "/images/Home 3.webp", alt: "Organic herbal hair oil chemical-free" },
  { title: "Nourish Your",    highlight: "Scalp Deeply",     subtitle: "Soothe your scalp and eliminate dandruff with Vetiver and Neem.",                badge: "🌱 Soothing Scalp Care",       image: "/images/Home 4.webp", alt: "Deep nourishment and scalp care hair oil" },
  { title: "Restore Your",    highlight: "Natural Volume",   subtitle: "Stimulate new follicles with the richness of Fenugreek and Black Cumin.",        badge: "🌟 Volume Booster",            image: "/images/Home 5.webp", alt: "Hair volume restoration herbal oil" },
  { title: "Embrace The",     highlight: "Ayurvedic Secret", subtitle: "A time-tested blend to lock in moisture and protect from daily damage.",         badge: "🛡️ Complete Protection",      image: "/images/Home 6.webp", alt: "Ayurvedic hair protection moisture oil" },
];

const staticReviews = [
  { _id: "s1", name: "Ananya S.",    rating: 5, comment: "This hair oil is a miracle! Within just two weeks, my hair fall has completely stopped. My roots feel stronger and my hair is noticeably thicker. Highly recommended!", image: "/images/Home 4.webp", createdAt: "2024-05-10T10:00:00.000Z" },
  { _id: "s2", name: "Priya Menon", rating: 5, comment: "The cooling effect on the scalp is so relaxing. Not only has it cured my dandruff, but it's given my hair a beautiful natural shine. Authentic ayurvedic quality.", image: "/images/home 2.webp", createdAt: "2024-04-22T14:30:00.000Z" },
  { _id: "s3", name: "Lakshmi R.",  rating: 4, comment: "I love the smell and texture — not too sticky at all. I can already see baby hairs at my hairline. Will definitely purchase the 500ml bottle next time!", image: "/images/Home 5.webp", createdAt: "2024-03-15T09:15:00.000Z" },
];

const ingredients = [
  { name: "Amla",           img: "/images/amla.webp",         benefit: "Strengthens Roots"   },
  { name: "Hibiscus",       img: "/images/Hibiscus.webp",     benefit: "Prevents Hair Fall"  },
  { name: "Aloe Vera",      img: "/images/aloe-vera.webp",    benefit: "Natural Conditioner" },
  { name: "Neem",           img: "/images/neem.webp",         benefit: "Dandruff Control"    },
  { name: "Coconut Oil",    img: "/images/coconut-oil.webp",  benefit: "Deep Nourishment"    },
  { name: "Vetiver",        img: "/images/vetiver.webp",      benefit: "Cooling Effect"      },
  { name: "Fenugreek",      img: "/images/Fenugreek.webp",    benefit: "Prevents Shedding"   },
  { name: "Henna",          img: "/images/Henna.webp",        benefit: "Natural Color"       },
  { name: "Curry Leaves",   img: "/images/curry-leaves.webp", benefit: "Rich in Iron"        },
  { name: "Black Cumin",    img: "/images/black-cumin.webp",  benefit: "Anti-Inflammatory"   },
  { name: "Rose Petals",    img: "/images/rose-petals.webp",  benefit: "Scalp Soothing"      },
  { name: "Pearl Onion",    img: "/images/pearl-onion.webp",  benefit: "Growth Booster"      },
  { name: "False Daisy",    img: "/images/false-daisy.webp",  benefit: "Rejuvenation"        },
  { name: "Rosemary",       img: "/images/rosemary.webp",     benefit: "Circulation"         },
  { name: "Tanner's Cassia",img: "/images/tanners-cassia.webp",benefit:"Antibacterial"       },
];

const whyCards = [
  { img: "Home 1.webp", title: "100% Ayurvedic Recipe",    desc: "Ancient secrets perfectly formulated for modern, everyday hair care needs." },
  { img: "home 2.webp", title: "Zero Harmful Chemicals",   desc: "Completely free from parabens, sulphates, mineral oils, and artificial colors." },
  { img: "Home 3.webp", title: "Proven Visible Results",   desc: "Experience noticeable hair growth and reduced hair fall in just weeks." },
  { img: "Home 4.webp", title: "Deep Root Nourishment",    desc: "Our oil penetrates deeply to strengthen strands from the inside out." },
  { img: "Home 5.webp", title: "Scalp Cooling Effect",     desc: "Alleviates stress and eliminates dandruff with natural cooling herbs like Vetiver." },
  { img: "Home 6.webp", title: "Restores Natural Shine",   desc: "Locks in vital moisture and brings back your hair's beautiful, natural glow." },
];

const skeletonSizes = ["100 ml", "200 ml", "500 ml"];

/* ── Helper: safe image URL ──────────────────────────────────── */
function resolveImg(img) {
  if (!img) return "/images/icons/logo.webp";
  if (img.startsWith("http") || img.startsWith("/images/") || img.startsWith("data:image")) return img;
  return `${BASE_URL.replace(/\/api$/, "")}${img.startsWith("/") ? img : `/${img}`}`;
}

/* ── ReviewCard (shared between both marquee copies) ─────────── */
function ReviewCard({ review }) {
  const imgSrc = resolveImg(review.image);
  return (
    <article className="w-[340px] sm:w-[420px] shrink-0 bg-white border border-yellow-500/10 rounded-3xl p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-400 flex flex-col justify-between gap-4">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base shadow-inner flex-shrink-0 bg-gradient-to-br from-yellow-600 to-amber-800"
              aria-hidden="true"
            >
              {review.name ? review.name[0].toUpperCase() : "U"}
            </div>
            <div>
              <h4 className="font-semibold text-[#2C2921] text-sm font-grotesk">{review.name}</h4>
              <div className="flex text-yellow-500 text-xs mt-0.5" role="img" aria-label={`${review.rating} out of 5 stars`}>
                {[...Array(5)].map((_, si) => (
                  <span key={si}>{si < review.rating ? "★" : "☆"}</span>
                ))}
              </div>
            </div>
          </div>
          <time className="text-xs text-[#9A9690] font-inter" dateTime={review.createdAt}>
            {new Date(review.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
          </time>
        </div>
        <blockquote className="text-[#4A473E] leading-relaxed text-sm italic font-playfair">
          &ldquo;{review.comment}&rdquo;
        </blockquote>
      </div>

      {/* ── Review photo ─────────────────────── */}
      {review.image && (
        <div className="mt-1 rounded-2xl overflow-hidden border border-yellow-500/10 w-24 h-24 group self-start">
          <img
            src={imgSrc}
            alt={`Review photo shared by ${review.name}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        </div>
      )}
    </article>
  );
}

/* ── 3D Tilt hook ────────────────────────────────────────────── */
function useTilt(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(hover: none)").matches) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 14;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 14;
      el.style.transform = `perspective(700px) rotateY(${x}deg) rotateX(${-y}deg) translateZ(10px)`;
    };
    const onLeave = () => { el.style.transform = "perspective(700px) rotateY(0deg) rotateX(0deg) translateZ(0px)"; };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, [ref]);
}

/* ── Animated stat counter ───────────────────────────────────── */
function StatCounter({ value, label }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animatedRef.current) {
        animatedRef.current = true;
        const numMatch = value.match(/[\d.]+/);
        if (!numMatch) { setDisplay(value); return; }
        const target = parseFloat(numMatch[0]);
        const suffix = value.replace(numMatch[0], "");
        let start = 0;
        const duration = 1600;
        const step = (ts) => {
          if (!start) start = ts;
          const progress = Math.min((ts - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = (eased * target).toFixed(target % 1 !== 0 ? 1 : 0);
          setDisplay(current + suffix);
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center group py-4 px-2">
      <div className="text-3xl md:text-4xl font-black text-yellow-600 font-soria tabular-nums group-hover:scale-110 transition-transform duration-300">
        {display || value}
      </div>
      <div className="text-[#6C685F] text-sm mt-1 font-inter">{label}</div>
    </div>
  );
}

/* ── ProductCard ─────────────────────────────────────────────── */
function ProductCard({ product, index, onAddToCart, onBuyNow }) {
  const ref = useRef(null);
  useTilt(ref);

  const handleRipple = (e, fn) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.cssText = `width:${Math.max(rect.width, rect.height)*2}px;height:${Math.max(rect.width, rect.height)*2}px;left:${e.clientX-rect.left-rect.width}px;top:${e.clientY-rect.top-rect.height}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
    fn(product);
  };

  return (
    <div
      ref={ref}
      className="group relative bg-white rounded-3xl overflow-hidden border border-yellow-500/10 shadow-card hover:shadow-card-hover hover:border-yellow-500/35 transition-all duration-500"
      style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.12}s both`, transformStyle: "preserve-3d" }}
    >
      {/* Badges */}
      {product.savings && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold z-20 shadow-lg font-grotesk tracking-wide">
          {product.savings}
        </div>
      )}
      {product.ml === "200 ml" && (
        <div className="absolute top-4 left-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold z-20 shadow-md font-grotesk">
          ★ Popular
        </div>
      )}

      {/* Image area */}
      <div className="h-72 bg-gradient-to-b from-[#FDFBF7] to-[#F5F2EB] relative flex items-center justify-center p-8 overflow-hidden">
        <div className="absolute inset-0 bg-yellow-500/4 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="w-40 h-40 bg-yellow-500/8 rounded-full absolute blur-[50px] group-hover:bg-yellow-500/18 group-hover:scale-125 transition-all duration-700" />
        <img
          src={product.img}
          alt={`Kala Agalya Herbals ${product.ml} herbal hair oil bottle`}
          className="relative z-10 h-full w-auto object-contain group-hover:scale-110 transition-transform duration-700 ease-spring drop-shadow-[0_12px_30px_rgba(217,119,6,0.22)]"
          loading="lazy"
        />
        {/* Reveal CTA ribbon on hover */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-yellow-500/90 to-transparent py-3 px-6 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-spring flex items-center justify-center gap-2">
          <span className="text-black font-bold text-sm font-grotesk tracking-wide">Add to Cart →</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-6 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

        <div className="text-center mb-4">
          <h3 className="text-2xl font-black text-[#2C2921] mb-1 font-soria">{product.ml}</h3>
          <p className="text-[#6C685F] text-xs line-clamp-2 font-inter">{product.description}</p>
        </div>

        <div className="flex flex-col items-center gap-0.5 mb-5">
          {product.mrp && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#9A9690] line-through font-inter">MRP ₹{product.mrp}</span>
              {product.discountPct && (
                <span className="text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full font-grotesk">
                  {product.discountPct}% OFF
                </span>
              )}
            </div>
          )}
          <span className="text-4xl font-extrabold text-yellow-600 font-soria leading-none">₹{product.price}</span>
          {product.mrp && <span className="text-[11px] text-emerald-600 font-semibold font-inter">You save ₹{product.mrp - product.price}</span>}
        </div>

        <div className="flex justify-center mb-5">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-900/8 text-emerald-700 border border-emerald-500/25 font-grotesk">
            ✓ In Stock
          </span>
        </div>

        {/* Trust micro-badges */}
        <div className="flex justify-center gap-2 flex-wrap mb-5">
          {["🔒 Secure", "🌿 Organic", "🚚 Fast"].map(t => (
            <span key={t} className="text-[10px] text-[#9A9690] px-2 py-0.5 rounded-full border border-[#e8e4dc] font-inter">{t}</span>
          ))}
        </div>

        <div className="space-y-2.5 font-grotesk">
          <button
            onClick={(e) => handleRipple(e, onAddToCart)}
            className="ripple-container w-full py-3 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all duration-300 bg-[#F5F2EB] text-yellow-800 border border-yellow-500/25 hover:bg-yellow-500/12 hover:border-yellow-500/50 hover:shadow-md active:scale-98 relative overflow-hidden"
          >
            Add to Cart
          </button>
          <button
            onClick={(e) => handleRipple(e, onBuyNow)}
            className="ripple-container w-full py-3 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all duration-300 bg-gradient-to-r from-yellow-500 to-amber-600 text-black hover:from-yellow-400 hover:to-amber-500 shadow-[0_4px_15px_rgba(217,119,6,0.25)] hover:shadow-gold hover:-translate-y-0.5 active:scale-98 relative overflow-hidden"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
export default function Landing() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addToast } = useToast();

  const [dbProduct,      setDbProduct]      = useState(null);
  const [products,       setProducts]       = useState([]);
  const [reviews,        setReviews]        = useState(staticReviews);
  const [loadingProducts,setLoadingProducts] = useState(true);
  const [reviewForm,     setReviewForm]     = useState({ name: "", rating: 5, comment: "" });
  const [reviewImage,    setReviewImage]    = useState(null);
  const [isSubmitting,   setIsSubmitting]   = useState(false);
  const [mousePos,       setMousePos]       = useState({ x: 0, y: 0 });

  const heroRef = useRef(null);

  /* ── Hero slider & Image Preloading ─────────────────────────── */
  useEffect(() => {
    // Preload hero slide images for zero-latency slide transitions
    heroSlides.forEach(slide => {
      const img = new Image();
      img.src = slide.image;
    });
    const t = setInterval(() => setCurrentSlide(p => (p + 1) % heroSlides.length), 4000);
    return () => clearInterval(t);
  }, []);

  /* ── Hero parallax mouse ─────────────────────────────────── */
  useEffect(() => {
    const onMove = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width  - 0.5) * 30,
        y: ((e.clientY - rect.top)  / rect.height - 0.5) * 20,
      });
    };
    const hero = heroRef.current;
    if (hero) hero.addEventListener("mousemove", onMove);
    return () => { if (hero) hero.removeEventListener("mousemove", onMove); };
  }, []);

  /* ── Custom cursor + scroll progress ───────────────────────*/
  useEffect(() => {
    const cursor = document.getElementById("custom-cursor");
    const ring   = document.getElementById("custom-cursor-ring");
    const bar    = document.getElementById("scroll-progress");

    const onMouse = (e) => {
      if (cursor) { cursor.style.left = e.clientX + "px"; cursor.style.top = e.clientY + "px"; }
      if (ring)   { ring.style.left   = e.clientX + "px"; ring.style.top   = e.clientY + "px"; }
    };
    const onScroll = () => {
      if (!bar) return;
      const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      bar.style.transform = `scaleX(${Math.min(pct, 1)})`;
    };

    window.addEventListener("mousemove", onMouse);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* ── Product API fetch ───────────────────────────────────── */
  const getImg = useCallback((images, idx) => {
    if (!images?.length) return "/images/icons/logo.webp";
    return resolveImg(images[idx] || images[0]);
  }, []);

  const fetchReviews = useCallback((productId) => {
    fetch(`${API_URL}/reviews/${productId}`)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setReviews([...staticReviews, ...d]); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.products?.length > 0) {
          const master = data.products[0];
          setDbProduct(master);
          fetchReviews(master._id);
          const parsed = data.products
            .filter(p => p.isActive !== false)
            .flatMap(prod =>
              prod.sizes.map((s, idx) => {
                const price = s.price;
                const mrp   = s.mrp && s.mrp > price ? s.mrp : null;
                const disc  = mrp ? Math.round(((mrp - price) / mrp) * 100) : null;
                return { ...s, id: `${prod._id}-${s.size}`, productId: prod._id, name: prod.name, description: prod.description, img: getImg(prod.images, idx), ml: s.size, price, mrp, discountPct: disc, savings: disc ? `${disc}% OFF` : null };
              })
            );
          setProducts(parsed);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProducts(false));
  }, [getImg, fetchReviews]);

  /* ── Cart helpers ────────────────────────────────────────── */
  const addToCart = useCallback((product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const ex   = cart.find(i => i.id === product.id || (i.size === product.ml && i.name === product.name));
    if (ex) ex.quantity += 1;
    else cart.push({ id: product.id, productId: product.productId, name: product.name, size: product.ml, price: product.price, quantity: 1 });
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
      document.dispatchEvent(new Event("cartUpdated"));
      addToast("Added to cart! 🛒", "success");
    } catch { addToast("Cart error. Please refresh.", "error"); }
  }, [addToast]);

  const buyNow = useCallback((product) => {
    addToCart(product);
    window.location.href = "/cart";
  }, [addToCart]);

  /* ── Review submit ───────────────────────────────────────── */
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!dbProduct) { addToast("Product not found. Please refresh.", "error"); return; }
    setIsSubmitting(true);
    const fd = new FormData();
    fd.append("productId", dbProduct._id);
    fd.append("name",      reviewForm.name);
    fd.append("rating",    reviewForm.rating);
    fd.append("comment",   reviewForm.comment);
    if (reviewImage) fd.append("image", reviewImage);
    try {
      const res  = await fetch(`${API_URL}/reviews`, { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) {
        addToast("Review submitted! Thank you 🌿", "success");
        setReviewForm({ name: "", rating: 5, comment: "" });
        setReviewImage(null);
        fetchReviews(dbProduct._id);
        const fi = document.getElementById("review-img-input");
        if (fi) fi.value = "";
      } else addToast(data.message || "Failed to submit", "error");
    } catch { addToast("Error submitting review", "error"); }
    finally { setIsSubmitting(false); }
  };

  const avgRating  = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : "5.0";
  const ratingStats = [5,4,3,2,1].map(stars => ({ stars, pct: reviews.length ? ((reviews.filter(r => r.rating === stars).length / reviews.length) * 100).toFixed(0) + "%" : "0%" }));

  /* ── Schema ──────────────────────────────────────────────── */
  const schemaOrg = {
    "@context": "https://schema.org", "@type": "Organization",
    name: "Kala Agalya Herbals", url: "https://kalaagalyaherbals.com",
    logo: "https://kalaagalyaherbals.com/images/icons/logo.webp",
    contactPoint: { "@type": "ContactPoint", telephone: "+91-7338758727", contactType: "customer service" }
  };
  const schemaProduct = {
    "@context": "https://schema.org", "@type": "Product",
    name: "Kala Agalya Naturopathy Herbal Hair Oil",
    image: "https://kalaagalyaherbals.com/images/Home%201.webp",
    description: "100% Naturopathy herbal hair oil with 18+ rare herbs for hair growth and hair fall control.",
    brand: { "@type": "Brand", name: "Kala Agalya Herbals" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "5000" },
    offers: { "@type": "AggregateOffer", offerCount: "3", priceCurrency: "INR", lowPrice: "199", highPrice: "899" }
  };

  /* ════════════════════════════════════════════════════════════ */
  return (
    <div className="overflow-x-hidden">
      <Helmet>
        <title>Kala Agalya Herbals | Best Naturopathy Herbal Hair Oil — 18+ Rare Herbs</title>
        <meta name="description" content="Kala Agalya Herbals — 100% Naturopathy herbal hair oil with 18+ rare herbs. Stop hair fall, boost growth, restore shine. Free delivery across India." />
        <meta name="keywords" content="herbal hair oil, naturopathy hair oil, hair fall control, organic hair oil India, Kala Agalya" />
        <link rel="canonical" href="https://kalaagalyaherbals.com" />
        <meta property="og:title"       content="Kala Agalya Herbals | Naturopathy Hair Oil" />
        <meta property="og:description" content="100% organic herbal hair oil with 18+ rare herbs." />
        <meta property="og:url"         content="https://kalaagalyaherbals.com" />
        <meta property="og:type"        content="website" />
        <meta property="og:image"       content="https://kalaagalyaherbals.com/images/Home%201.webp" />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaProduct)}</script>
      </Helmet>

      {/* ══ HERO ════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#FDFBF7]"
        aria-label="Hero"
      >
        {/* Ambient orbs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-yellow-500/6 rounded-full blur-[120px] animate-blob pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] animate-blob animation-delay-2000 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-lime-500/4 rounded-full blur-[80px] animate-blob animation-delay-4000 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center py-20 relative z-10">

          {/* Text column */}
          <div className="relative min-h-[440px] flex items-center">
            {heroSlides.map((slide, i) => (
              <div
                key={i}
                className={`absolute inset-0 flex flex-col justify-center transition-all duration-1000 ease-spring ${
                  i === currentSlide ? "opacity-100 translate-x-0 scale-100" : i < currentSlide ? "opacity-0 -translate-x-8 scale-95" : "opacity-0 translate-x-8 scale-95"
                }`}
                aria-hidden={i !== currentSlide}
              >
                <span className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-800 mb-6 w-fit font-grotesk">
                  {slide.badge}
                </span>
                <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold leading-[1.08] mb-5 text-[#1C1A16] font-soria">
                  {slide.title}<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-700 bg-[length:200%_auto] animate-gradient-x">
                    {slide.highlight}
                  </span>
                </h1>
                <p className="text-base md:text-lg text-[#4A473E] mb-8 max-w-md leading-relaxed font-inter">
                  {slide.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="#product">
                    <button className="relative overflow-hidden px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold rounded-xl shadow-gold hover:shadow-gold-lg hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-300 font-grotesk tracking-wide group">
                      <span className="relative z-10 flex items-center gap-2">Shop Now <span aria-hidden="true">✨</span></span>
                      <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white/30 opacity-0 group-hover:opacity-100 group-hover:left-full transition-all duration-500" />
                    </button>
                  </a>
                  <button
                    onClick={() => document.getElementById("ingredients")?.scrollIntoView({ behavior: "smooth" })}
                    className="px-8 py-4 border border-yellow-500/40 text-yellow-700 font-semibold rounded-xl hover:bg-yellow-500/8 hover:border-yellow-500/70 transition-all duration-300 font-grotesk"
                  >
                    View Ingredients
                  </button>
                </div>
                <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-[#6C685F] font-inter">
                  {["⚡ Fast Delivery", "🌿 No Chemicals", "✓ Cruelty Free"].map(t => (
                    <span key={t} className="flex items-center gap-1.5">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Image column — parallax */}
          <div className="relative min-h-[380px] lg:h-[600px] flex items-center justify-center">
            {heroSlides.map((slide, i) => (
              <div
                key={i}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-spring ${
                  i === currentSlide ? "opacity-100 scale-100" : i < currentSlide ? "opacity-0 scale-90 blur-sm" : "opacity-0 scale-90 blur-sm"
                }`}
                aria-hidden={i !== currentSlide}
              >
                <div
                  className="relative z-10 animate-float"
                  style={{ transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.3}px) rotate(${mousePos.x * 0.03}deg)`, transition: "transform 0.1s ease-out" }}
                >
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="max-h-[340px] md:max-h-[520px] w-auto object-contain drop-shadow-[0_0_60px_rgba(217,119,6,0.55)] filter brightness-105"
                    loading={i === 0 ? "eager" : "lazy"}
                    width="400" height="520"
                  />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-yellow-500/6 blur-[80px] rounded-full pointer-events-none" />
              </div>
            ))}
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2" role="tablist" aria-label="Hero slides">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === currentSlide}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-400 ${i === currentSlide ? "w-6 bg-yellow-500" : "w-1.5 bg-yellow-500/30 hover:bg-yellow-500/60"}`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2 text-[#9A9690] text-xs font-inter" aria-hidden="true">
          <span className="tracking-widest uppercase" style={{ writingMode: "vertical-rl" }}>Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-yellow-500/50 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ══ STATS ════════════════════════════════════════════════ */}
      <section
        className="scroll-animate scroll-scale bg-white py-6 relative -mt-8 mx-4 md:mx-auto max-w-5xl rounded-3xl shadow-card z-20 border border-yellow-500/10"
        aria-label="Brand statistics"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-yellow-500/10">
          <StatCounter value="100%"  label="Natural Ingredients" />
          <StatCounter value="5000+" label="Happy Customers" />
          <StatCounter value="18+"   label="Rare Herbs" />
          <StatCounter value="4.9"   label="Star Rating" />
        </div>
      </section>

      {/* ══ PRODUCT CATALOG ══════════════════════════════════════ */}
      <section id="product" className="py-24 bg-[#FDFBF7] relative" aria-labelledby="catalog-heading">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
        <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="text-center mb-14 scroll-animate">
            <h2 id="catalog-heading" className="text-4xl md:text-5xl font-extrabold text-[#1C1A16] font-soria mb-3">
              Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-700">Bottle Size</span>
            </h2>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto rounded-full mb-4" />
            <p className="text-[#6C685F] text-base max-w-lg mx-auto font-inter">
              100% Naturopathy herbal hair oil — choose the size that suits your routine.
            </p>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {skeletonSizes.map((size, i) => (
                <div key={size} className="bg-white rounded-3xl overflow-hidden border border-yellow-500/10 shadow-card" style={{ animation: `fadeInUp 0.4s ease-out ${i * 0.1}s both` }}>
                  <div className="h-72 bg-gradient-to-b from-[#FDFBF7] to-[#F5F2EB] flex items-center justify-center">
                    <div className="w-32 h-44 skeleton-shimmer flex items-center justify-center rounded-2xl">
                      <img src="/images/icons/logo.webp" alt="" aria-hidden="true" className="h-28 w-auto opacity-10" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-center mb-4">
                      <h3 className="text-2xl font-black text-[#2C2921] font-soria mb-2">{size}</h3>
                      <div className="h-3 skeleton-shimmer w-3/4 mx-auto" />
                    </div>
                    <div className="flex justify-center mb-5"><div className="h-10 w-24 skeleton-shimmer rounded-xl" /></div>
                    <div className="space-y-2.5">
                      <div className="h-11 skeleton-shimmer rounded-xl" />
                      <div className="h-11 skeleton-shimmer rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-[#6C685F] bg-white rounded-3xl border border-yellow-500/10 shadow-card font-inter">
              Products are currently being restocked. Please check back soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onAddToCart={addToCart}
                  onBuyNow={buyNow}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══ REVIEWS ══════════════════════════════════════════════ */}
      <section className="py-24 bg-white border-t border-yellow-500/10 relative overflow-hidden" aria-labelledby="reviews-heading">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-yellow-500/4 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="text-center mb-14 scroll-animate">
            <h2 id="reviews-heading" className="text-4xl md:text-5xl font-bold text-[#1C1A16] mb-3 font-soria">
              Customer <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-700">Experience</span>
            </h2>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-14">
            {/* Rating summary */}
            <div className="scroll-animate bg-gradient-to-br from-[#FDFBF7] to-white p-8 rounded-3xl border border-yellow-500/12 shadow-card text-center h-fit">
              <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-500 to-amber-700 font-soria mb-1" aria-label={`Average rating: ${avgRating} out of 5`}>
                {avgRating}
              </div>
              <div className="text-yellow-500 text-2xl tracking-widest my-2" aria-hidden="true">★★★★★</div>
              <p className="text-[#6C685F] text-sm mb-6 font-inter">Based on {reviews.length} reviews</p>
              <div className="space-y-2.5">
                {ratingStats.map(row => (
                  <div key={row.stars} className="flex items-center gap-3 text-xs font-inter">
                    <span className="w-10 text-[#4A473E] text-right shrink-0">{row.stars} ★</span>
                    <div className="flex-1 h-2 bg-[#F5F2EB] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-yellow-600 to-amber-500 rounded-full transition-all duration-700" style={{ width: row.pct }} />
                    </div>
                    <span className="w-8 text-[#9A9690]">{row.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review form */}
            <div className="lg:col-span-2 scroll-animate">
              <div className="bg-white p-7 md:p-9 rounded-3xl border border-yellow-500/12 shadow-card">
                <h3 className="text-xl font-bold text-[#1C1A16] mb-6 border-b border-yellow-500/10 pb-4 font-grotesk">
                  Share Your Experience
                </h3>
                <form onSubmit={handleReviewSubmit} className="space-y-5 font-inter">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="review-name" className="block text-sm text-[#6C685F] mb-1.5 font-medium">Your Name</label>
                      <input
                        id="review-name"
                        type="text"
                        required
                        placeholder="e.g. Priya S."
                        className="input-premium"
                        value={reviewForm.name}
                        onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="review-rating" className="block text-sm text-[#6C685F] mb-1.5 font-medium">Rating</label>
                      <div className="relative">
                        <select
                          id="review-rating"
                          className="input-premium appearance-none pr-10 cursor-pointer"
                          value={reviewForm.rating}
                          onChange={e => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                        >
                          <option value="5">★★★★★ — Excellent</option>
                          <option value="4">★★★★☆ — Good</option>
                          <option value="3">★★★☆☆ — Average</option>
                          <option value="2">★★☆☆☆ — Fair</option>
                          <option value="1">★☆☆☆☆ — Poor</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center" aria-hidden="true">
                          <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="review-comment" className="block text-sm text-[#6C685F] mb-1.5 font-medium">Your Review</label>
                    <textarea
                      id="review-comment"
                      required
                      placeholder="How has the oil helped your hair?"
                      className="input-premium h-28 resize-none"
                      value={reviewForm.comment}
                      onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="review-img-input" className="block text-sm text-[#6C685F] mb-1.5 font-medium">Add a Photo <span className="text-[#9A9690]">(Optional)</span></label>
                    <input
                      id="review-img-input"
                      type="file"
                      accept="image/*"
                      className="block w-full text-sm text-[#6C685F] file:mr-4 file:py-2 file:px-5 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500/10 file:text-yellow-700 hover:file:bg-yellow-500/20 file:transition-colors cursor-pointer font-inter"
                      onChange={e => setReviewImage(e.target.files[0])}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative overflow-hidden px-8 py-3.5 rounded-xl font-semibold text-black bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 transition-all shadow-gold hover:shadow-gold-lg hover:-translate-y-0.5 disabled:opacity-50 font-grotesk tracking-wide"
                  >
                    {isSubmitting ? "Submitting…" : "Submit Review"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* ── Review Marquee (with images) ────────────────── */}
          <div className="relative w-screen -mx-[calc((100vw-100%)/2)] overflow-hidden py-6 border-t border-yellow-500/8" aria-label="Customer reviews carousel">
            {/* Edge fade masks */}
            <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <div className="flex gap-5 w-max">
              <div className="animate-marquee gap-5">
                {reviews.map((review, i) => <ReviewCard key={`m1-${review._id || i}`} review={review} />)}
              </div>
              <div className="animate-marquee gap-5" aria-hidden="true">
                {reviews.map((review, i) => <ReviewCard key={`m2-${review._id || i}`} review={review} />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ WHY THIS HAIR OIL ════════════════════════════════════ */}
      <section className="py-24 relative bg-[#FDFBF7]" aria-labelledby="why-heading">
        <div className="absolute inset-0 bg-noise opacity-[0.025] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/4 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 scroll-animate">
            <h2 id="why-heading" className="text-4xl md:text-5xl font-extrabold text-[#1C1A16] mb-5 font-soria">
              Why This <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-700">Hair Oil?</span>
            </h2>
            <p className="text-lg text-yellow-800 font-medium italic font-playfair">
              &ldquo;We bring you the secrets of ancient Ayurveda, bottled with care and precision for the modern lifestyle.&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {whyCards.map((item, i) => (
              <div
                key={i}
                className={`scroll-animate scroll-delay-${(i % 3) + 1} group relative h-[380px] rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover border border-yellow-500/10 bg-white`}
              >
                <div className="absolute inset-0 h-3/4 overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#FDFBF7] to-[#F5F2EB]">
                  <img
                    src={`/images/${item.img}`}
                    alt={item.title}
                    className="w-full h-full object-contain transform group-hover:scale-110 group-hover:-translate-y-3 transition-all duration-700 ease-spring filter brightness-95 group-hover:brightness-105 drop-shadow-[0_8px_20px_rgba(217,119,6,0.12)]"
                    loading="lazy"
                  />
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-white via-white/96 to-transparent pt-16 pb-7 px-7 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-xl font-bold text-[#1C1A16] mb-2 group-hover:text-yellow-700 transition-colors font-grotesk">{item.title}</h3>
                  <p className="text-[#6C685F] text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 font-inter">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ INGREDIENTS MARQUEE ══════════════════════════════════ */}
      <section id="ingredients" className="py-24 bg-[#FDFBF7] border-t border-yellow-500/10 relative overflow-hidden" aria-labelledby="herbs-heading">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />

        <div className="text-center mb-12 scroll-animate px-5">
          <h2 id="herbs-heading" className="text-4xl md:text-5xl font-extrabold text-[#1C1A16] font-soria mb-4">
            Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-700">18+ Rare Herbs</span>
          </h2>
          <p className="text-[#6C685F] max-w-xl mx-auto text-base font-inter">
            Each bottle is infused with a potent blend of pure herbs, selected for their unique hair-nourishing properties.
          </p>
        </div>

        {/* Row 1 — left */}
        <div className="relative w-screen -mx-[calc((100vw-100%)/2)] overflow-hidden mb-5">
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-[#FDFBF7] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-[#FDFBF7] to-transparent z-10 pointer-events-none" />
          <div className="flex gap-5 w-max animate-marquee">
            {[...ingredients, ...ingredients].map((item, i) => (
              <IngredientCard key={i} item={item} />
            ))}
          </div>
        </div>

        {/* Row 2 — right (reverse) */}
        <div className="relative w-screen -mx-[calc((100vw-100%)/2)] overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-[#FDFBF7] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-[#FDFBF7] to-transparent z-10 pointer-events-none" />
          <div className="flex gap-5 w-max" style={{ animation: "marquee 35s linear infinite reverse" }}>
            {[...ingredients.slice().reverse(), ...ingredients.slice().reverse()].map((item, i) => (
              <IngredientCard key={i} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER CTA ═══════════════════════════════════════════ */}
      <section className="bg-[#14120B] border-t border-yellow-500/10 text-white py-20 px-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(217,119,6,0.06)_0%,_transparent_70%)] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-yellow-500/50 to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full border border-yellow-500/25 text-yellow-400 text-xs font-grotesk uppercase tracking-widest mb-6">
            Limited Stock Available
          </span>
          <h2 className="scroll-animate text-3xl md:text-5xl font-bold mb-5 font-soria leading-tight">
            Ready to Transform<br />Your Hair Naturally?
          </h2>
          <p className="text-gray-400 mb-10 text-base max-w-xl mx-auto font-inter leading-relaxed">
            Join thousands of satisfied customers who have switched to Kala Agalya Herbals Herbal Organic Hair Oil.
          </p>
          <a href="#product">
            <button className="relative overflow-hidden px-10 py-4 rounded-full font-bold text-base bg-gradient-to-r from-yellow-500 to-amber-600 text-black hover:shadow-gold-lg hover:scale-105 transition-all duration-300 shadow-gold border border-yellow-400/40 font-grotesk tracking-wider group">
              <span className="relative z-10">Get Your Bottle Today →</span>
              <div className="absolute -inset-full h-full w-1/2 -skew-x-12 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:left-full transition-all duration-600" />
            </button>
          </a>
          <div className="mt-10 flex justify-center flex-wrap gap-4">
            {["🔒 Secure Payment", "🌿 100% Organic", "🚚 Pan India Delivery", "↩ Easy Returns"].map(t => (
              <span key={t} className="text-xs text-gray-500 font-inter">{t}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── IngredientCard (extracted for cleanliness) ─────────────── */
function IngredientCard({ item }) {
  return (
    <div className="flex-shrink-0 flex flex-col items-center bg-white rounded-2xl border border-yellow-500/10 hover:border-yellow-400/40 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 p-5 w-36 group cursor-default">
      <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-yellow-500/15 group-hover:border-yellow-400/50 transition-colors shadow-sm flex-shrink-0">
        <img
          src={item.img}
          alt={`${item.name} — ${item.benefit}`}
          className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500"
          loading="lazy"
          width="64" height="64"
        />
      </div>
      <h4 className="font-semibold text-[#2C2921] text-xs text-center mb-1.5 font-grotesk leading-tight group-hover:text-yellow-700 transition-colors">{item.name}</h4>
      <span className="text-[9px] text-emerald-700 font-bold bg-emerald-900/8 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wide text-center font-grotesk">{item.benefit}</span>
    </div>
  );
}
