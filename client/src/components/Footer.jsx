import { Link } from 'react-router-dom';
import { FaYoutube, FaInstagram, FaWhatsapp } from "react-icons/fa6";
import { useState, useEffect } from 'react';

const footerContent = {
  about: {
    title: "Kala Agalya Herbals",
    description: "Experience the ancient power of 18+ rare herbs blended in pure coconut oil. 100% Naturopathy & Organic care for your hair.",
  },
  quickLinks: [
    { name: "About Us",        path: "/about" },
    { name: "Contact Us",      path: "/contact" },
    { name: "Privacy Policy",  path: "/privacy-policy" },
    { name: "Refund Policy",   path: "/refund-policy" },
    { name: "Shipping Policy", path: "/shipping-policy" },
    { name: "Terms of Service",path: "/terms-of-service" },
  ],
  contact: {
    phone: "+91 7338758727",
    email: "kalaagalyaherbals@gmail.com",
    address: "Ayyapakkam, Chennai, Tamil Nadu, India – 600077"
  },
  socials: [
    { name: "YouTube",   url: "https://youtube.com/@kala.agalya_vlogs5086?si=7WiaXavmEmhtjWz3",    Icon: FaYoutube   },
    { name: "Instagram", url: "https://www.instagram.com/kala.agalya_herbalhairoil?igsh=ZzRyN3d0ZmZnOTlk", Icon: FaInstagram },
  ],
  trust: ["100% Organic", "No Chemicals", "18+ Rare Herbs", "Made in India"],
  copyright: "© 2026 Kala Agalya Herbals. All rights reserved."
};

export default function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      {/* ── Floating WhatsApp ─────────────────────────────── */}
      <a
        href="https://wa.me/917338758727?text=Hi%20Kala%20Agalya%20Herbals,%20I%20would%20like%20to%20know%20more%20about%20your%20products."
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-8 right-6 z-50 group"
      >
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white text-green-700 text-xs font-bold rounded-xl shadow-lg border border-green-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
          Chat with us!
          <span className="absolute top-1/2 -right-[6px] -translate-y-1/2 border-[6px] border-transparent border-l-white" />
        </span>
        <div className="bg-[#25D366] p-3.5 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.5)] hover:scale-110 hover:shadow-[0_8px_30px_rgba(37,211,102,0.6)] transition-all duration-300">
          <FaWhatsapp size={26} color="white" />
        </div>
      </a>

      {/* ── Back to Top ───────────────────────────────────── */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed bottom-8 left-6 z-50 w-10 h-10 rounded-full bg-[#52b788] text-white flex items-center justify-center shadow-md hover:bg-[#40916c] hover:scale-110 transition-all duration-300 scroll-top-btn ${showTop ? "visible" : ""}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* ── Trust Badges Banner Section ──────────────────── */}
      <section className="bg-[#edf6ee] py-10 border-t border-[#d0e5d4] relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {footerContent.trust.map((badge, i) => (
              <span key={i} className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold border border-[#b5dbbb] bg-[#dcf0e0] text-[#1e4620] tracking-wider uppercase shadow-sm hover:border-[#86c892] hover:bg-[#cee9d3] hover:scale-105 transition-all duration-300">
                ✓ {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Footer ───────────────────────────────────── */}
      <footer className="relative bg-gradient-to-b from-[#eaf3ec] via-[#f1f7f2] to-[#e4efe6] text-[#2c4035] pt-16 pb-8 overflow-hidden border-t border-[#d2e4d6] shadow-inner">

        {/* Background ambiance */}
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-emerald-200/35 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-200/40 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">

            {/* Brand */}
            <div className="space-y-5">
              <Link to="/" onClick={scrollToTop} className="flex items-center gap-3 group w-fit" aria-label="Kala Agalya Herbals home">
                <img src="/images/icons/logo.png" alt="Kala Agalya Herbals" className="h-10 w-auto drop-shadow-[0_2px_8px_rgba(45,106,79,0.25)] group-hover:scale-110 transition-transform duration-300" width="40" height="40" loading="lazy" />
                <h2 className="text-lg font-bold bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] bg-clip-text text-transparent font-soria">
                  Kala Agalya Herbals
                </h2>
              </Link>
              <p className="text-[#4a6356] leading-relaxed text-sm">{footerContent.about.description}</p>
              <div className="flex gap-3">
                {footerContent.socials.map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.name}
                    className="w-9 h-9 rounded-full bg-[#d2e6d6] flex items-center justify-center text-[#1b4332] hover:bg-[#b7dbc0] hover:text-[#0d2818] hover:-translate-y-1 hover:scale-110 transition-all duration-300 shadow-sm border border-[#bddeaf]"
                  >
                    <s.Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-[#1b4332] font-semibold text-base mb-5 relative inline-block font-grotesk">
                Quick Links
                <span className="absolute -bottom-1.5 left-0 w-1/2 h-[2px] bg-[#52b788] rounded-full" />
              </h3>
              <ul className="space-y-2.5">
                {footerContent.quickLinks.map((link, i) => (
                  <li key={i}>
                    <Link
                      to={link.path}
                      onClick={scrollToTop}
                      className="flex items-center gap-2 group text-sm text-[#4a6356] hover:text-[#1b4332] font-medium transition-colors duration-200"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#74c69d] group-hover:bg-[#1b4332] transition-colors flex-shrink-0" />
                      <span className="relative overflow-hidden">
                        {link.name}
                        <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#2d6a4f] -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="lg:col-span-2">
              <h3 className="text-[#1b4332] font-semibold text-base mb-5 relative inline-block font-grotesk">
                Get In Touch
                <span className="absolute -bottom-1.5 left-0 w-1/2 h-[2px] bg-[#52b788] rounded-full" />
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />,
                    title: "Visit Us",
                    text: footerContent.contact.address
                  },
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
                    title: "Call Us",
                    text: footerContent.contact.phone
                  }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-[#cbe3d1] hover:border-[#74c69d] hover:bg-white/90 transition-all duration-300 group shadow-sm">
                    <div className="p-2 rounded-xl bg-[#d8ebd9] text-[#1b4332] group-hover:bg-[#b7dbc0] transition-colors flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        {item.icon}
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-[#1b4332] font-semibold text-sm mb-1 font-grotesk">{item.title}</h4>
                      <p className="text-xs text-[#4a6356] leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-[#cbe3d1] pt-7 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#5c786a] font-medium">
            <p>{footerContent.copyright}</p>
            <p className="flex items-center gap-1.5">
              Made with <span className="text-red-500 animate-pulse">♥</span> in Chennai, India 🇮🇳
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
