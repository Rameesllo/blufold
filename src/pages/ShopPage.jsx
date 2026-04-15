import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from '../components/ProductGrid';
import { products } from '../data/products';

const categories = ['All', ...new Set(products.map((p) => p.category))];

const ShopPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="pt-24 min-h-screen bg-brand-black">
      <div className="container mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
            THE COLLECTION
          </h1>
          <p className="text-brand-gray tracking-[0.3em] uppercase text-sm">
            Minimalist Streetwear Essentials
          </p>
        </motion.div>
      </div>

      {/* Category Filter */}
      <div className="container mx-auto px-6 mb-12">
        <div className="flex justify-center flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${
                activeCategory === cat
                  ? 'border-brand-blue bg-brand-blue text-white shadow-[0_0_20px_rgba(41,98,255,0.4)]'
                  : 'border-white/10 text-brand-gray hover:border-white/30 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-6 pb-20">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-brand-gray text-lg">No products in this category yet.</p>
          </div>
        )}
      </div>

      {/* Bottom Sections */}
      <div className="container mx-auto px-6 py-20 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
          <div className="bg-white/5 p-12 rounded-[40px] border border-white/10 hover:border-brand-blue/30 transition-all group">
            <h3 className="text-3xl font-bold mb-4">ACCESSORIES</h3>
            <p className="text-brand-gray mb-8">
              Complement your look with our premium drop accessories.
            </p>
            <button className="text-brand-blue font-bold tracking-widest uppercase text-sm group-hover:translate-x-2 transition-transform">
              Coming Soon →
            </button>
          </div>
          <div className="bg-white/5 p-12 rounded-[40px] border border-white/10 hover:border-brand-blue/30 transition-all group">
            <h3 className="text-3xl font-bold mb-4">EXCLUSIVES</h3>
            <p className="text-brand-gray mb-8">
              Limited edition pieces for the truly bold.
            </p>
            <button className="text-brand-blue font-bold tracking-widest uppercase text-sm group-hover:translate-x-2 transition-transform">
              Join Waitlist →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
