import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Avatar from "./Avatar";

export default function Navbar() {
  const [count, setCount]           = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [scrollPct, setScrollPct]   = useState(0);

  const [avatar,   setAvatar]   = useState(localStorage.getItem("userAvatar"));
  const [userName, setUserName] = useState(localStorage.getItem("userName"));
  const [token,    setToken]    = useState(localStorage.getItem("userToken"));

  /* ── Cart + profile sync ─────────────────────────────── */
  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCount(cart.reduce((s, i) => s + i.quantity, 0));
    };
    const updateProfile = () => {
      setAvatar(localStorage.getItem("userAvatar"));
      setUserName(localStorage.getItem("userName"));
      setToken(localStorage.getItem("userToken"));
    };
    updateCart();
    updateProfile();
    window.addEventListener("storage", updateCart);
    window.addEventListener("storage", updateProfile);
    document.addEventListener("cartUpdated",   updateCart);
    document.addEventListener("profileUpdated", updateProfile);
    return () => {
      window.removeEventListener("storage", updateCart);
      window.removeEventListener("storage", updateProfile);
      document.removeEventListener("cartUpdated",   updateCart);
      document.removeEventListener("profileUpdated", updateProfile);
    };
  }, []);

  /* ── Scroll progress + navbar state ─────────────────── */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      const doc  = document.documentElement;
      const pct  = window.scrollY / (doc.scrollHeight - doc.clientHeight);
      setScrollPct(Math.min(100, pct * 100));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Lock body scroll when mobile menu open ─────────── */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { label: "Home",       to: "/",          type: "link" },
    { label: "Product",    to: "/#product",  type: "anchor" },
    { label: "Contact",    to: "/contact",   type: "link" },
  ];

  return (
    <>
      {/* ── Scroll Progress Bar ──────────────────────── */}
      <div
        aria-hidden="true"
        style={{ width: `${scrollPct}%` }}
        className="fixed top-0 left-0 h-[2.5px] z-[9999] bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 transition-all duration-100 ease-linear pointer-events-none"
      />

      {/* ── Navbar ───────────────────────────────────── */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? "bg-[#FDFBF7]/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.07)] border-b border-yellow-500/15"
            : "bg-[#FDFBF7]/80 backdrop-blur-md border-b border-yellow-500/8"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-5 sm:px-8 py-3.5">

          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-yellow-500 rounded-xl"
            aria-label="Kala Agalya Herbals — Home"
          >
            <div className="relative">
              <img
                src="/images/icons/logo.webp"
                alt="Kala Agalya Herbals logo"
                className="h-10 w-auto group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_10px_rgba(217,119,6,0.25)]"
                width="40" height="40"
                loading="eager"
              />
              <div className="absolute inset-0 rounded-full bg-yellow-500/10 scale-0 group-hover:scale-150 transition-transform duration-500 opacity-0 group-hover:opacity-100" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-700 tracking-wide group-hover:from-yellow-600 group-hover:to-amber-800 transition-all duration-300 font-soria">
              Kala Agalya Herbals
            </span>
          </Link>

          {/* ── Desktop Links ─────────────────────────── */}
          <div className="hidden md:flex items-center gap-8 font-medium" role="menubar">
            {navLinks.map(({ label, to, type }) =>
              type === "anchor" ? (
                <a
                  key={label}
                  href={to}
                  role="menuitem"
                  className="relative group py-1.5 text-[#3a3830] hover:text-yellow-700 transition-colors duration-300 text-[15px] font-[500] tracking-wide"
                >
                  {label}
                  <span className="absolute -bottom-0.5 left-0 w-0 group-hover:w-full h-[1.5px] bg-gradient-to-r from-yellow-500 to-amber-600 transition-all duration-300 rounded-full" />
                </a>
              ) : (
                <Link
                  key={label}
                  to={to}
                  role="menuitem"
                  className="relative group py-1.5 text-[#3a3830] hover:text-yellow-700 transition-colors duration-300 text-[15px] font-[500] tracking-wide"
                >
                  {label}
                  <span className="absolute -bottom-0.5 left-0 w-0 group-hover:w-full h-[1.5px] bg-gradient-to-r from-yellow-500 to-amber-600 transition-all duration-300 rounded-full" />
                </Link>
              )
            )}

            {token ? (
              <>
                <Link
                  to="/my-orders"
                  className="relative group py-1.5 text-[#3a3830] hover:text-yellow-700 transition-colors duration-300 text-[15px] font-[500]"
                >
                  My Orders
                  <span className="absolute -bottom-0.5 left-0 w-0 group-hover:w-full h-[1.5px] bg-gradient-to-r from-yellow-500 to-amber-600 transition-all duration-300 rounded-full" />
                </Link>
                <Link
                  to="/profile"
                  aria-label="View profile"
                  className="hover:scale-110 transition-transform duration-300 focus-visible:ring-2 focus-visible:ring-yellow-500 rounded-full"
                >
                  <Avatar src={avatar} name={userName} size="sm" />
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="relative px-5 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-semibold text-sm hover:shadow-[0_4px_20px_rgba(217,119,6,0.4)] hover:scale-105 transition-all duration-300 font-grotesk tracking-wide"
              >
                Login
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              aria-label={`Cart — ${count} item${count !== 1 ? "s" : ""}`}
              className="relative group focus-visible:ring-2 focus-visible:ring-yellow-500 rounded-full"
            >
              <div className={`relative p-2.5 rounded-full border transition-all duration-300 ${
                count > 0
                  ? "bg-yellow-500/15 border-yellow-500/40 shadow-[0_0_16px_rgba(217,119,6,0.2)]"
                  : "bg-yellow-900/8 border-yellow-500/15 hover:border-yellow-500/40 hover:bg-yellow-500/10"
              }`}>
                <img
                  src="/images/icons/cart.svg"
                  className="w-5 h-5 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                  alt=""
                  aria-hidden="true"
                />
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-gradient-to-r from-lime-400 to-green-400 text-black font-bold px-1 rounded-full text-[10px] flex items-center justify-center shadow-lg animate-[pulse-border_2s_ease-in-out_infinite]">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* ── Mobile controls ───────────────────────── */}
          <div className="flex items-center gap-3 md:hidden">
            {token ? (
              <Link to="/profile" onClick={closeMenu} aria-label="Profile" className="focus-visible:ring-2 focus-visible:ring-yellow-500 rounded-full">
                <Avatar src={avatar} name={userName} size="sm" />
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="text-sm font-semibold text-yellow-700 hover:text-yellow-600 px-3 py-1.5 rounded-full border border-yellow-500/30 hover:border-yellow-500/60 transition-all"
              >
                Login
              </Link>
            )}

            <Link to="/cart" onClick={closeMenu} aria-label={`Cart, ${count} items`} className="relative focus-visible:ring-2 focus-visible:ring-yellow-500 rounded-full">
              <div className="relative p-2 rounded-full bg-yellow-900/8 border border-yellow-500/15">
                <img src="/images/icons/cart.svg" className="w-5 h-5" alt="" aria-hidden="true" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-lime-400 text-black font-bold px-1 rounded-full text-[9px] flex items-center justify-center">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </div>
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl text-yellow-600 hover:bg-yellow-500/10 transition-colors focus-visible:ring-2 focus-visible:ring-yellow-500"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`w-full h-[2px] bg-current rounded-full transition-all duration-400 ${isMenuOpen ? "rotate-45 translate-y-[9px]" : ""}`} />
                <span className={`h-[2px] bg-current rounded-full transition-all duration-300 ${isMenuOpen ? "opacity-0 w-0" : "w-3/4"}`} />
                <span className={`w-full h-[2px] bg-current rounded-full transition-all duration-400 ${isMenuOpen ? "-rotate-45 -translate-y-[9px]" : ""}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu ──────────────────────────────── */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          isMenuOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[#FDFBF7]/97 backdrop-blur-2xl"
          onClick={closeMenu}
          aria-hidden="true"
        />

        {/* Content */}
        <div className={`relative h-full flex flex-col items-center justify-center gap-8 transition-all duration-500 ${isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"}`}>

          {/* Decorative orbs */}
          <div className="absolute top-10 left-10 w-40 h-40 bg-yellow-500/6 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-amber-500/6 rounded-full blur-3xl pointer-events-none" />

          {navLinks.map(({ label, to, type }, i) =>
            type === "anchor" ? (
              <a
                key={label}
                href={to}
                onClick={closeMenu}
                className="text-3xl sm:text-4xl font-bold text-[#2C2921] hover:text-yellow-600 transition-colors duration-300 font-soria"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                {label}
              </a>
            ) : (
              <Link
                key={label}
                to={to}
                onClick={closeMenu}
                className="text-3xl sm:text-4xl font-bold text-[#2C2921] hover:text-yellow-600 transition-colors duration-300 font-soria"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                {label}
              </Link>
            )
          )}

          {token ? (
            <>
              <Link to="/my-orders" onClick={closeMenu} className="text-3xl font-bold text-[#2C2921] hover:text-yellow-600 transition-colors font-soria">My Orders</Link>
              <Link to="/profile"   onClick={closeMenu} className="text-3xl font-bold text-[#2C2921] hover:text-yellow-600 transition-colors font-soria">Profile</Link>
            </>
          ) : (
            <Link
              to="/login"
              onClick={closeMenu}
              className="mt-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold text-lg hover:shadow-gold transition-all duration-300 font-grotesk"
            >
              Login
            </Link>
          )}

          <Link to="/cart" onClick={closeMenu} className="text-xl font-semibold text-[#6C685F] hover:text-yellow-600 transition-colors font-sans">
            🛒 Cart ({count})
          </Link>

          {/* Social links */}
          <div className="absolute bottom-10 flex gap-6 text-sm text-[#9A9690]">
            <a href="https://www.instagram.com/kala.agalya_herbalhairoil" target="_blank" rel="noreferrer" className="hover:text-yellow-600 transition-colors">Instagram</a>
            <span>·</span>
            <a href="https://youtube.com/@kala.agalya_vlogs5086" target="_blank" rel="noreferrer" className="hover:text-yellow-600 transition-colors">YouTube</a>
          </div>
        </div>
      </div>
    </>
  );
}
