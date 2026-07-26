import React, { useEffect } from 'react';
import { Helmet } from "react-helmet-async";

export default function Contact() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "mainEntity": {
      "@type": "LocalBusiness",
      "name": "Kala Agalya Herbals",
      "image": "https://kalaagalyaherbals.com/images/icons/logo.webp",
      "telephone": "+91-7338758727",
      "email": "kalaagalyaherbals@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Ayyapakkam",
        "addressLocality": "Chennai",
        "addressRegion": "Tamil Nadu",
        "postalCode": "600077",
        "addressCountry": "IN"
      }
    }
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen relative overflow-hidden text-[#2C2921] font-sans">
      <Helmet>
        <title>Contact Kala Agalya Herbals | Ayurvedic Hair Oil Customer Support</title>
        <meta name="description" content="Get in touch with Kala Agalya Herbals for queries about our natural hair growth oils. We provide support for organic hair care products in Chennai and across India." />
        <meta name="keywords" content="contact Kala Agalya Herbals, herbal hair oil support, hair oil customer service Chennai, ayurvedic oil online support" />
        <link rel="canonical" href="https://kalaagalyaherbals.com/contact" />
        <script type="application/ld+json">
          {JSON.stringify(contactSchema)}
        </script>
      </Helmet>
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-yellow-500/2 rounded-full filter blur-[100px] animate-blob pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-emerald-500/2 rounded-full filter blur-[100px] animate-blob animation-delay-2000 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">

        {/* Header */}
        <div className="text-center mb-16 animate-[fadeIn_0.5s_ease-out]">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-800 mb-6 drop-shadow-[0_0_15px_rgba(234,179,8,0.1)] font-soria">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl text-[#6C685F] max-w-2xl mx-auto font-playfair">
            Have questions about our herbal oils? We're here to help you on your journey to natural hair wellness.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Contact Card 1: Address */}
          <div className="scroll-animate scroll-delay-1 bg-white p-8 rounded-3xl border border-yellow-500/10 hover:border-yellow-500/30 transition-all duration-300 hover:-translate-y-2 group shadow-md flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-500/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#2C2921] mb-4 font-playfair">Visit Us</h3>
              <div className="space-y-2 text-[#6C685F] font-sans">
                <p className="font-semibold text-lime-700">Kala Agalya Herbals Hair Oils</p>
                <p>Ayyapakkam,</p>
                <p>Chennai, Tamil Nadu</p>
                <p>India – 600077</p>
              </div>
            </div>
          </div>

          {/* Contact Card 2: Phone */}
          <div className="scroll-animate scroll-delay-2 bg-white p-8 rounded-3xl border border-yellow-500/10 hover:border-yellow-500/30 transition-all duration-300 hover:-translate-y-2 group shadow-md flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-500/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#2C2921] mb-4 font-playfair">Call Us</h3>
              <p className="text-[#6C685F] mb-6 font-sans">Mon-Sat from 9am to 6pm.</p>
              <a href="tel:+917338758727" className="inline-block text-xl font-bold text-yellow-600 hover:text-yellow-700 group-hover:scale-105 transition-transform font-soria">
                +91 7338758727
              </a>
            </div>
          </div>

          {/* Contact Card 3: Email */}
          <div className="scroll-animate scroll-delay-3 bg-white p-8 rounded-3xl border border-yellow-500/10 hover:border-yellow-500/30 transition-all duration-300 hover:-translate-y-2 group shadow-md flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-500/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#2C2921] mb-4 font-playfair">Email Us</h3>
              <p className="text-[#6C685F] mb-6 font-sans">We'll get back to you within 24h.</p>
              <a href="mailto:kalaagalyaherbals@gmail.com" className="inline-block text-lg font-bold text-yellow-600 hover:text-yellow-700 break-all group-hover:scale-105 transition-transform font-soria">
                kalaagalyaherbals@gmail.com
              </a>
            </div>
          </div>

        </div>

        {/* Map Placeholder or Extra Info */}
        <div className="scroll-animate mt-16 p-1 rounded-3xl bg-gradient-to-r from-yellow-500/20 to-amber-500/20">
          <div className="bg-white rounded-[22px] p-8 md:p-12 text-center border border-yellow-500/10 shadow-lg">
            <h3 className="text-2xl font-bold text-[#2C2921] mb-4 font-soria">Need Support?</h3>
            <p className="text-[#6C685F] max-w-2xl mx-auto mb-8 font-playfair">
              Connect with us on WhatsApp for instant support regarding your order, shipping status, or product queries.
            </p>
            <a
              href="https://wa.me/917338758727?text=Hi%20Kala%20Agalya%20Herbals,%20I%20would%20like%20to%20connect%20with%20you."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-3 rounded-full font-bold hover:bg-[#20bd5a] transition-colors shadow-md transform hover:scale-105 duration-300 font-sans"
            >
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}



