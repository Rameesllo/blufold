import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from '../components/ProductGrid';
import { useProducts } from '../context/ProductContext';

const ShopPage = () => {
  const { products } = useProducts();
  const categories = ['All', ...new Set(products.map((p) => p.category))];
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="pt-28 md:pt-32 min-h-screen bg-brand-black">
      {/* Simple Header */}
      <div className="container mx-auto px-6 mb-8 text-center md:text-left">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-2"
        >
          Collection
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-brand-gray text-sm md:text-base tracking-wide"
        >
          Explore our premium streetwear selection.
        </motion.p>
      </div>

      {/* Simplified Category Filter */}
      <div className="container mx-auto px-6 mb-12">
        <div className="flex justify-start overflow-x-auto no-scrollbar gap-8 border-b border-white/10 pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-sm md:text-base font-bold uppercase tracking-widest transition-all duration-300 relative whitespace-nowrap pb-1 ${
                activeCategory === cat
                  ? 'text-white'
                  : 'text-brand-gray hover:text-white'
              }`}
            >
              {cat}
              {activeCategory === cat && (
                <motion.div
                  layoutId="shopActiveTab"
                  className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-brand-blue"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-6 pb-20">
        <motion.div
          layout
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8"
        >
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-brand-gray text-lg">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
