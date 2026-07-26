import React, { useEffect } from 'react';
import { Helmet } from "react-helmet-async";

export default function ShippingPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#FDFBF7] min-h-screen relative overflow-hidden text-[#2C2921] font-sans">
      <Helmet>
        <title>Shipping Policy | Kala Agalya Herbals</title>
        <meta name="description" content="Kala Agalya Herbals provides fast and secure shipping across India. Estimated delivery is 3-10 business days based on location." />
        <link rel="canonical" href="https://kalaagalyaherbals.com/shipping-policy" />
      </Helmet>
        
       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        
        {/* Header */}
         <div className="text-center mb-20 animate-[fadeIn_0.5s_ease-out]">
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#2C2921] mb-6 font-soria">
            Shipping Policy
          </h1>
          <p className="text-xl text-[#6C685F] max-w-2xl mx-auto font-playfair">
             Fast, reliable, and secure delivery across India.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[
                { 
                    icon: (
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    ),
                    title: "Pan India Delivery", 
                    desc: "We ensure delivery to almost every pin code in India." 
                },
                { 
                    icon: (
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    title: "Quick Processing", 
                    desc: "Orders processed within 1-3 business days." 
                },
                { 
                    icon: (
                         <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    title: "Order Tracking", 
                    desc: "Live SMS/Email updates once your order is shipped." 
                }
            ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl border border-yellow-500/10 hover:border-yellow-500/30 shadow-md hover:shadow-lg transition-all duration-300 group">
                    <div className="w-14 h-14 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-600 mb-6 group-hover:scale-110 transition-transform">
                        {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-[#2C2921] mb-2 font-playfair">{item.title}</h3>
                    <p className="text-[#6C685F]">{item.desc}</p>
                </div>
            ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12">
            
            {/* Delivery Estimates */}
            <div className="bg-white rounded-3xl p-8 border border-yellow-500/10 shadow-md flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#2C2921] mb-6 border-b border-yellow-500/10 pb-4 font-playfair">Estimated Delivery Time</h2>
                  <div className="space-y-6">
                      <div className="flex items-center justify-between">
                          <span className="text-lg text-[#2C2921]">Metro Cities</span>
                          <span className="bg-yellow-500/10 text-yellow-700 px-4 py-1 rounded-full text-sm font-bold border border-yellow-500/20">3 - 5 Days</span>
                      </div>
                      <div className="flex items-center justify-between">
                          <span className="text-lg text-[#2C2921]">Rest of India</span>
                          <span className="bg-yellow-500/10 text-yellow-700 px-4 py-1 rounded-full text-sm font-bold border border-yellow-500/20">5 - 10 Days</span>
                      </div>
                  </div>
                </div>
                <p className="mt-8 text-sm text-[#7C786E] italic">
                    *Note: Delivery times may vary due to weather conditions or government restrictions.
                </p>
            </div>

            {/* Other Details */}
            <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-yellow-500/10 shadow-sm">
                    <h3 className="text-lg font-bold text-[#2C2921] mb-2 font-playfair">Shipping Charges</h3>
                    <p className="text-[#6C685F]">Calculated at checkout based on your location and order value.</p>
                </div>
                 <div className="bg-white rounded-2xl p-6 border border-yellow-500/10 shadow-sm">
                    <h3 className="text-lg font-bold text-[#2C2921] mb-2 font-playfair">Delays</h3>
                    <p className="text-[#6C685F]">We are not liable for delays caused by natural disasters or incorrect addresses.</p>
                </div>
                 <div className="bg-white rounded-2xl p-6 border border-yellow-500/10 shadow-sm">
                    <h3 className="text-lg font-bold text-[#2C2921] mb-2 font-playfair">Wrong Address?</h3>
                    <p className="text-[#6C685F]">Re-delivery charges may apply if the customer provides incorrect information.</p>
                </div>
            </div>

        </div>

       </div>
    </div>
  );
}


