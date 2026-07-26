import React, { useEffect } from 'react';
import { Helmet } from "react-helmet-async";

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#FDFBF7] min-h-screen relative overflow-hidden text-[#2C2921] font-sans">
      <Helmet>
        <title>Privacy Policy | Kala Agalya Herbals</title>
        <meta name="description" content="Learn how Kala Agalya Herbals protects your personal data. We are committed to your privacy and secure herbal hair oil shopping." />
        <link rel="canonical" href="https://kalaagalyaherbals.com/privacy-policy" />
      </Helmet>
      {/* Background Elements */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/2 via-[#FDFBF7] to-[#FDFBF7] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 transition-all duration-500">
        
        {/* Header */}
        <div className="text-center mb-16 animate-[fadeIn_0.5s_ease-out]">
          <span className="text-yellow-600 font-bold tracking-wider uppercase text-sm mb-2 block">Transparency First</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#2C2921] mb-4 font-soria">
            Privacy Policy
          </h1>
          <p className="text-[#6C685F]">Effective Date: January 2026</p>
        </div>

        <div className="bg-white rounded-3xl border border-yellow-500/10 p-8 md:p-12 shadow-lg">
          
          {/* Intro */}
          <div className="mb-12 border-b border-yellow-500/10 pb-8">
            <p className="text-lg leading-relaxed text-[#4A473E] font-playfair">
              <strong className="text-yellow-600 font-playfair">Kala Agalya Herbals Hair Oils</strong> (“we”, “our”, “us”) respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and protect your information when you use our website and services.
            </p>
          </div>

          <div className="space-y-12">
            {[
              {
                title: "1. Information We Collect",
                content: (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {["Personal details (Name, Phone, Email)", "Shipping details (Address, City, Pincode)", "Payment Information (Securely processed)", "Device Info (IP, Browser Type)"].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 bg-[#F5F2EB] p-4 rounded-xl border border-yellow-500/10 hover:border-yellow-500/30 transition-colors">
                                <div className="w-2 h-2 bg-yellow-600 rounded-full shadow-[0_0_8px_#d97706]"></div>
                                <span className="text-[#2C2921] text-sm font-sans">{item}</span>
                            </li>
                        ))}
                    </ul>
                )
              },
              {
                title: "2. How We Use Your Information",
                content: (
                    <div className="pl-4 border-l-2 border-yellow-500/20 space-y-2 mt-4 text-[#6C685F] font-sans">
                        <p>We use your data to process orders, deliver updates, provide support, and improve our services. We may send offers only if you've opted in.</p>
                    </div>
                )
              },
              {
                title: "3. Data Protection & Security",
                content: "We implement appropriate security measures to protect your data from unauthorized access, alteration, disclosure, or destruction. Payment transactions are processed through secure, encrypted gateways."
              },
              {
                 title: "4. Sharing of Information",
                 content: "We do not sell or trade your personal information. Data may only be shared with Delivery partners, Payment gateways, or Legal authorities if required by law."
              },
              {
                  title: "5. Cookies",
                  content: "We use cookies to improve user experience and website performance. You may choose to disable cookies in your browser settings."
              },
              {
                  title: "6. Your Rights",
                  content: (
                      <div className="flex flex-wrap gap-3 mt-4">
                          {["Access Data", "Request Correction", "Request Deletion", "Withdraw Consent"].map((right, i) => (
                              <span key={i} className="px-4 py-2 rounded-full bg-lime-900/10 text-lime-700 text-sm font-medium border border-lime-500/20 hover:bg-lime-900/20 transition-colors font-sans">
                                  {right}
                              </span>
                          ))}
                      </div>
                  )
              },
              {
                  title: "7. Policy Updates",
                  content: "We may update this Privacy Policy from time to time. Updates will be posted on this page."
              },
              {
                  title: "8. Contact for Privacy",
                  content: (
                      <div className="mt-4 bg-[#F5F2EB] p-6 rounded-2xl border border-yellow-500/20 flex flex-col md:flex-row gap-8 items-start md:items-center">
                          <div>
                              <p className="text-sm text-[#6C685F] uppercase tracking-widest mb-1 font-sans">Email Us</p>
                              <a href="mailto:kalaagalyaherbals@gmail.com" className="text-lg text-[#2C2921] font-medium hover:text-yellow-600 transition-colors font-soria font-bold">kalaagalyaherbals@gmail.com</a>
                          </div>
                          <div className="hidden md:block w-px h-12 bg-yellow-500/20"></div>
                           <div>
                              <p className="text-sm text-[#6C685F] uppercase tracking-widest mb-1 font-sans">Call Us</p>
                              <a href="tel:7010558722" className="text-lg text-[#2C2921] font-medium hover:text-yellow-600 transition-colors font-soria font-bold">70105 58722</a>
                          </div>
                      </div>
                  )
              }
            ].map((section, idx) => (
              <section key={idx} className="group animate-[fadeIn_0.5s_ease-out]" style={{ animationDelay: `${idx * 0.1}s` }}>
                <h2 className="text-xl md:text-2xl font-bold text-[#2C2921] mb-4 group-hover:text-yellow-600 transition-colors duration-300 font-playfair">
                  {section.title}
                </h2>
                <div className="text-[#6C685F] leading-relaxed text-base md:text-lg">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}



