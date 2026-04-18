import React, { useState } from 'react';
import { motion } from 'framer-motion';

const categories = ["T-Shirts", "Hoodies", "Shorts", "New Drop"];

const CategoryScroll = () => {
  const [activeTab, setActiveTab] = useState("T-Shirts");

  return (
    <div className="py-12 bg-brand-black relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-brand-blue/5 blur-[100px] rounded-full -translate-y-1/2" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex justify-start sm:justify-center w-full px-4 sm:px-0">
          <div className="flex items-center space-x-1 p-1 bg-brand-blue/5 backdrop-blur-md rounded-full border border-brand-blue/20 overflow-x-auto w-full sm:w-auto flex-nowrap scroll-smooth no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`relative px-5 sm:px-8 py-2 md:py-3 rounded-full text-xs md:text-sm font-bold uppercase transition-all duration-300 whitespace-nowrap ${
                  activeTab === cat ? 'text-white' : 'text-brand-gray hover:text-white'
                }`}
              >
                {activeTab === cat && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-brand-black rounded-full border border-brand-blue/50 shadow-[0_0_15px_rgba(41,98,255,0.4)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryScroll;
