import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#050810] via-[#0A0E1C] to-[#050810]">
      {/* Background and Model Image */}
      <motion.div
        className="absolute inset-0 z-0 flex items-center justify-center"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <img
          src="/assets/hero-model.png"
          alt="Fashion Model"
          className="h-full w-full object-cover object-center drop-shadow-2xl relative z-10"
        />
        {/* Blue Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-blue/30 blur-[150px] rounded-full z-0" />

        {/* Subtle Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40 z-20" />
      </motion.div>

      {/* Content Overlay */}
      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-black text-white px-2 tracking-tighter mb-0 flex flex-col items-center drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
            <span className="drop-shadow-[0_10px_10px_rgba(0,0,0,0.4)]">BLUFOLD</span>
            <span className="text-2xl md:text-3xl tracking-[0.6em] md:tracking-[0.8em] font-bold mt-[-5px] md:mt-[-10px] text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.6)]">
              CLOTHING®
            </span>
          </h1>

          <p className="text-brand-gray text-sm sm:text-lg md:text-xl font-medium mt-8 mb-10 tracking-widest uppercase">
            Built for Bold Moves
          </p>

          <Link to="/shop">
            <motion.button
              className="btn-primary mx-auto inline-flex items-center justify-center space-x-2 relative group overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Shop Now</span>
              <div className="absolute inset-0 bg-brand-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_20px_rgba(41,98,255,0.8)]" />
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full h-1/2 bg-brand-blue"
            animate={{ top: ['-50%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
