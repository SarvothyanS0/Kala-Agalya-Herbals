import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { FaWhatsapp, FaInstagram, FaYoutube } from "react-icons/fa6";

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  mainEntity: {
    "@type": "LocalBusiness",
    name:  "Kala Agalya Herbals",
    image: "https://kalaagalyaherbals.com/images/icons/logo.webp",
    telephone: "+91-7338758727",
    email: "kalaagalyaherbals@gmail.com",
    address: {
      "@type":           "PostalAddress",
      streetAddress:     "Ayyapakkam",
      addressLocality:   "Chennai",
      addressRegion:     "Tamil Nadu",
      postalCode:        "600077",
      addressCountry:    "IN",
    },
    openingHoursSpecification: {
      "@type":     "OpeningHoursSpecification",
      dayOfWeek:   ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
      opens:       "09:00",
      closes:      "18:00",
    },
  },
};

const cards = [
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    ),
    title: "Visit Us",
    lines: ["Kala Agalya Herbals Hair Oils", "Ayyapakkam, Chennai", "Tamil Nadu, India – 600077"],
    action: null,
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    ),
    title: "Call Us",
    lines: ["Mon – Sat, 9 am to 6 pm", ""],
    action: { href: "tel:+917338758727", label: "+91 7338758727" },
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    ),
    title: "Email Us",
    lines: ["We reply within 24 hours", ""],
    action: { href: "mailto:kalaagalyaherbals@gmail.com", label: "kalaagalyaherbals@gmail.com" },
  },
];

export default function Contact() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-[#FDFBF7] min-h-screen relative overflow-hidden text-[#1C1A16]">
      <Helmet>
        <title>Contact Us | Kala Agalya Herbals — Chennai Herbal Hair Oil</title>
        <meta name="description" content="Contact Kala Agalya Herbals for questions about our natural herbal hair oil. Reach us by phone, email, or WhatsApp. Based in Chennai, delivering across India." />
        <meta name="keywords" content="contact Kala Agalya Herbals, herbal hair oil support, Chennai ayurvedic oil" />
        <link rel="canonical" href="https://kalaagalyaherbals.com/contact" />
        <script type="application/ld+json">{JSON.stringify(contactSchema)}</script>
      </Helmet>

      {/* Ambient glows */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-yellow-500/4 rounded-full blur-[120px] animate-blob pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-emerald-500/4 rounded-full blur-[120px] animate-blob animation-delay-2000 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 relative z-10">

        {/* Header */}
        <div className="text-center mb-16 scroll-animate">
          <span className="inline-block px-4 py-1.5 rounded-full border border-yellow-500/25 text-yellow-700 text-xs font-grotesk uppercase tracking-widest mb-5 bg-yellow-500/6">
            We're Here to Help
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#1C1A16] mb-5 font-soria">
            Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-700">Touch</span>
          </h1>
          <p className="text-lg text-[#6C685F] max-w-xl mx-auto font-inter leading-relaxed">
            Have questions about our herbal oils? We're here to help you on your journey to natural hair wellness.
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`scroll-animate scroll-delay-${i + 1} group bg-white p-8 rounded-3xl border border-yellow-500/10 hover:border-yellow-500/35 shadow-card hover:shadow-card-hover hover:-translate-y-2 transition-all duration-400 flex flex-col`}
            >
              {/* Icon */}
              <div className="w-14 h-14 bg-yellow-500/8 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-500/18 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  {card.icon}
                </svg>
              </div>

              <h2 className="text-xl font-bold text-[#1C1A16] mb-3 font-grotesk">{card.title}</h2>

              <div className="space-y-1 text-[#6C685F] text-sm font-inter mb-4 flex-1">
                {card.lines.filter(Boolean).map((l, j) => (
                  <p key={j} className={j === 0 ? "font-semibold text-[#2C2921]" : ""}>{l}</p>
                ))}
              </div>

              {card.action && (
                <a
                  href={card.action.href}
                  className="inline-flex items-center gap-1.5 text-yellow-700 font-bold font-grotesk hover:text-yellow-600 transition-colors text-sm group-hover:underline underline-offset-2"
                >
                  {card.action.label}
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </a>
              )}
            </div>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <div className="scroll-animate p-[1.5px] rounded-3xl bg-gradient-to-r from-yellow-400/30 via-amber-400/20 to-yellow-400/30 shadow-gold">
          <div className="bg-white rounded-[22px] p-10 md:p-14 text-center">
            <div className="w-16 h-16 bg-[#25D366]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FaWhatsapp className="text-[#25D366] text-3xl" aria-hidden="true" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1C1A16] mb-3 font-grotesk">Prefer Instant Support?</h2>
            <p className="text-[#6C685F] max-w-lg mx-auto mb-8 font-inter leading-relaxed">
              Connect with us on WhatsApp for instant support regarding your order, shipping status, or product queries.
            </p>
            <a
              href="https://wa.me/917338758727?text=Hi%20Kala%20Agalya%20Herbals,%20I%20would%20like%20to%20connect%20with%20you."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 bg-[#25D366] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#20bd5a] hover:scale-105 transition-all duration-300 shadow-md font-grotesk"
            >
              <FaWhatsapp className="text-lg" aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Social links */}
        <div className="scroll-animate text-center mt-14">
          <p className="text-sm text-[#9A9690] mb-5 uppercase tracking-widest font-grotesk">Follow Our Journey</p>
          <div className="flex justify-center gap-4">
            {[
              { href: "https://www.instagram.com/kala.agalya_herbalhairoil?igsh=ZzRyN3d0ZmZnOTlk", Icon: FaInstagram, label: "Instagram", color: "hover:bg-pink-500 hover:text-white" },
              { href: "https://youtube.com/@kala.agalya_vlogs5086?si=7WiaXavmEmhtjWz3",             Icon: FaYoutube,  label: "YouTube",   color: "hover:bg-red-500 hover:text-white" },
            ].map(({ href, Icon, label, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Follow us on ${label}`}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#e8e4dc] text-[#6C685F] font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${color} font-inter`}
              >
                <Icon className="text-base" aria-hidden="true" />
                {label}
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
