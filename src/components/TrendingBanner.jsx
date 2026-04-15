import React from 'react';
import { motion } from 'framer-motion';

const TrendingBanner = () => {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="container mx-auto">
        <div className="relative h-[400px] md:h-[500px] rounded-[40px] overflow-hidden bg-gradient-to-br from-[#050810] via-[#0A0A0A] to-brand-blue/30 flex items-center p-8 md:p-20 border border-brand-blue/20">
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-blue/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-blue/10 blur-[150px] rounded-full" />

          <div className="relative z-10 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-brand-blue text-xs font-bold tracking-[0.2em] mb-6 uppercase">
                🔥 Hot Drop 2025
              </span>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-tight">
                STREET MEETS <span className="text-brand-blue">MINIMAL.</span>
              </h2>
              <p className="text-brand-gray text-lg mb-10 max-w-md">
                Experience the next evolution of streetwear. Premium materials, flawless fit, bold statements.
              </p>
              <button className="px-10 py-4 bg-brand-blue text-white font-black rounded-full shadow-[0_0_30px_rgba(41,98,255,0.4)] hover:shadow-[0_0_50px_rgba(41,98,255,0.6)] hover:scale-105 transition-all duration-300">
                EXPLORE COLLECTION
              </button>
            </motion.div>
          </div>

          <div className="hidden lg:block absolute right-20 top-1/2 -translate-y-1/2 w-[400px] pointer-events-none">
            <motion.img 
              src="/assets/product-shorts.png" 
              alt="Promo"
              className="w-full h-auto drop-shadow-2xl"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingBanner;
