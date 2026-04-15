import React from 'react';
import { Instagram, Twitter, Facebook, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-black pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-3xl font-black text-white tracking-tighter mb-6">BLUFOLD</h2>
            <p className="text-brand-gray text-sm leading-relaxed mb-6">
              Defining the future of streetwear through minimalist luxury and bold design.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-brand-blue hover:text-white transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-brand-blue hover:text-white transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-brand-blue hover:text-white transition-all">
                <Facebook size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Shop</h3>
            <ul className="space-y-4 text-brand-gray text-sm">
              <li><a href="#" className="hover:text-brand-blue transition-colors">T-Shirts</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors">Hoodies</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors">Shorts</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors">New Drops</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Help</h3>
            <ul className="space-y-4 text-brand-gray text-sm">
              <li><a href="#" className="hover:text-brand-blue transition-colors">Shipping</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Newsletter</h3>
            <p className="text-brand-gray text-xs mb-4">JOIN THE BOLD MOVEMENT.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="bg-white/5 border border-white/10 rounded-l-xl px-4 py-2 w-full text-sm focus:outline-none focus:border-brand-blue transition-colors"
              />
              <button className="bg-brand-blue text-white px-4 rounded-r-xl font-bold text-xs uppercase">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5">
          <p className="text-brand-gray text-[10px] tracking-widest mb-4 md:mb-0">
            © 2025 BLUFOLD CLOTHING®. ALL RIGHTS RESERVED.
          </p>
          <button 
            onClick={scrollToTop}
            className="flex items-center space-x-2 text-brand-gray hover:text-white transition-colors"
          >
            <span className="text-[10px] font-bold tracking-widest uppercase">Back to Top</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
