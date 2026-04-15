import React from 'react';
import Hero from '../components/Hero';
import CategoryScroll from '../components/CategoryScroll';
import ProductGrid from '../components/ProductGrid';
import TrendingBanner from '../components/TrendingBanner';

const HomePage = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Dynamic Background Shades */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-blue/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-brand-blue/15 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-brand-blue/5 blur-[100px] rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
      </div>

      <div className="relative z-10">
        <Hero />
        <CategoryScroll />
        <ProductGrid />
        <TrendingBanner />
      </div>
    </div>
  );
};

export default HomePage;
