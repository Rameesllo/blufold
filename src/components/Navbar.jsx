import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { itemCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-brand-black/90 backdrop-blur-md py-3 md:py-4' : 'bg-transparent py-4 md:py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl md:text-2xl font-black tracking-tighter text-white">
          BLUFOLD
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-12">
          <Link to="/" className="text-white text-xs font-bold tracking-widest uppercase hover:text-brand-blue transition-colors">Home</Link>
          <Link to="/shop" className="text-white text-xs font-bold tracking-widest uppercase hover:text-brand-blue transition-colors">Shop</Link>
          <a href="#" className="text-white text-xs font-bold tracking-widest uppercase hover:text-brand-blue transition-colors">Collections</a>
        </div>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center space-x-8">
          <button className="text-white hover:text-brand-blue transition-colors">
            <Search size={22} />
          </button>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="text-white hover:text-brand-blue transition-colors relative"
          >
            <ShoppingBag size={22} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-blue text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </button>
          <button className="text-white hover:text-brand-blue transition-colors">
            <User size={22} />
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-brand-black absolute top-full left-0 w-full h-screen p-6 flex flex-col space-y-8 items-center pt-20"
          >
            <div className="flex space-x-12 text-white">
              <Search size={32} />
              <button 
                onClick={() => { setIsCartOpen(true); setIsMobileMenuOpen(false); }}
                className="relative"
              >
                <ShoppingBag size={32} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-blue text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </button>
              <User size={32} />
            </div>
            <div className="text-3xl md:text-4xl font-bold space-y-6 text-center mt-6">
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="block text-white hover:text-brand-blue transition-colors">SHOP</Link>
              <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="block text-white hover:text-brand-blue transition-colors">COLLECTIONS</a>
              <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="block text-white hover:text-brand-blue transition-colors">ABOUT</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
