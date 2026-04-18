import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { itemCount, setIsCartOpen } = useCart();
  const { currentUser, setIsLoginModalOpen, logout } = useAuth();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (currentUser) {
      const savedProfile = JSON.parse(localStorage.getItem(`blufold_profile_${currentUser.email}`));
      setUserProfile(savedProfile);
    } else {
      setUserProfile(null);
    }
  }, [currentUser]);

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
          <Link to="/shop" className="text-white text-xs font-bold tracking-widest uppercase hover:text-brand-blue transition-colors">Shop</Link>
          <a href="#" className="text-white text-xs font-bold tracking-widest uppercase hover:text-brand-blue transition-colors">Collections</a>
          {currentUser ? (
            <div className="relative group">
              <button className="flex items-center gap-2 text-white hover:text-brand-blue transition-all">
                {userProfile?.avatar ? (
                  <div className="w-8 h-8 rounded-full border-2 border-brand-blue/30 overflow-hidden group-hover:border-brand-blue transition-all">
                    <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <span className="text-xs font-bold tracking-widest uppercase border-b border-transparent group-hover:border-brand-blue">
                    {currentUser.email ? currentUser.email.split('@')[0].slice(0, 8) : 'USER'}
                  </span>
                )}
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-6 w-40 bg-[#050810] border border-white/10 rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-2xl z-50">
                <Link to="/profile" className="w-full text-left block px-4 py-3 text-[10px] text-white font-black tracking-widest hover:bg-white/5 transition-colors uppercase">
                  MY PROFILE
                </Link>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="text-white text-xs font-bold tracking-widest uppercase hover:text-brand-blue transition-colors"
            >
              Account
            </button>
          )}
          <a href="#" className="text-white text-xs font-bold tracking-widest uppercase hover:text-brand-blue transition-colors">About</a>
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
            </div>
            <div className="text-3xl md:text-4xl font-bold space-y-6 text-center mt-6">
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="block text-white hover:text-brand-blue transition-colors">SHOP</Link>
              <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="block text-white hover:text-brand-blue transition-colors">COLLECTIONS</a>
              
              {currentUser ? (
                <>
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block text-white hover:text-brand-blue transition-colors">PROFILE</Link>
                </>
              ) : (
                <button onClick={() => { setIsLoginModalOpen(true); setIsMobileMenuOpen(false); }} className="block text-white hover:text-brand-blue transition-colors uppercase">LOGIN</button>
              )}
              
              <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="block text-white hover:text-brand-blue transition-colors">ABOUT</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
