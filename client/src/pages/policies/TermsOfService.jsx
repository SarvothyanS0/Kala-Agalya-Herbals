import React, { useEffect } from 'react';
import { Helmet } from "react-helmet-async";

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#FDFBF7] min-h-screen relative overflow-hidden text-[#2C2921] font-sans">
      <Helmet>
        <title>Terms of Service | Kala Agalya Herbals</title>
        <meta name="description" content="Read the terms and conditions for using Kala Agalya Herbals website and purchasing our Naturopathy hair growth products." />
        <link rel="canonical" href="https://kalaagalyaherbals.com/terms-of-service" />
      </Helmet>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 animate-[fadeIn_0.5s_ease-out]">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#2C2921] mb-4 font-soria">
            Terms of Service
          </h1>
          <p className="text-[#6C685F]">Last Updated: January 2026</p>
        </div>

        <div className="bg-white rounded-3xl border border-yellow-500/10 p-8 md:p-12 shadow-lg space-y-12">
            
            <p className="text-lg leading-relaxed text-[#4A473E] border-b border-yellow-500/10 pb-8 font-playfair">
              By accessing and using the website of <strong className="text-yellow-600 font-playfair">KALA AGALYA HERBALSKALAVATHI H</strong>, you agree to be bound by the following Terms and Conditions. Please read them carefully.
            </p>

            <div className="grid gap-10">
                {[
                    { title: "1. Use of Website", content: "You agree to use this website only for lawful purposes. Any activity that harms the website, business, or its users is strictly prohibited." },
                    { title: "2. Product Information", content: "We strive for accuracy but do not guarantee that all descriptions, images, or details are 100% error-free. Natural products may vary slightly in color or texture." },
                    { title: "3. Orders & Payments", content: "All orders are subject to availability. Prices may change without notice. We reserve the right to cancel orders due to fraud, pricing errors, or stock issues." },
                    { title: "4. Intellectual Property", content: "All content (logos, images, text) belongs to Kala Agalya Herbals Hair Oils. Unauthorized copying or reuse is prohibited." },
                    { title: "5. Limitation of Liability", content: "We are not responsible for allergic reactions or individual sensitivities. Always patch test before use. We are not liable for delays caused by logistics partners." },
                    { title: "6. Account Responsibility", content: "You are responsible for maintaining the confidentiality of your account credentials and activities." },
                    { title: "7. Termination", content: "We reserve the right to suspend access to our services if any violation of these terms is detected." },
                    { title: "8. Governing Law", content: "These terms are governed by the laws of India." }
                ].map((term, idx) => (
                    <div key={idx} className="group">
                        <h2 className="text-xl font-bold text-[#2C2921] mb-3 flex items-center gap-3 font-playfair">
                            <span className="text-yellow-600 font-mono opacity-50">0{idx + 1}</span>
                            {term.title.split('. ')[1]}
                        </h2>
                        <p className="text-[#6C685F] leading-relaxed pl-9 border-l-2 border-yellow-500/10 group-hover:border-yellow-500/30 transition-colors duration-300">
                             {term.content}
                        </p>
                    </div>
                ))}
            </div>

        </div>

      </div>
    </div>
  );
}



