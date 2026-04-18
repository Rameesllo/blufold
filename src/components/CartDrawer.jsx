import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const { cart, removeFromCart, updateQuantity, total, isCartOpen, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-brand-black z-[70] shadow-2xl border-l border-white/10 flex flex-col"
          >
            {/* Header */}
            <div className="p-8 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="text-brand-blue" />
                <h2 className="text-2xl font-black text-white tracking-tighter">YOUR BAG</h2>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="text-brand-gray" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag size={64} className="text-white/5 mb-6" />
                  <p className="text-brand-gray tracking-widest uppercase text-sm mb-8">Your bag is empty</p>
                  <button 
                    onClick={() => { setIsCartOpen(false); navigate('/shop'); }}
                    className="btn-outline"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex space-x-6 group">
                      <div className="w-24 h-32 bg-white/5 rounded-2xl overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <div>
                            <h3 className="text-white font-bold">{item.name}</h3>
                            <p className="text-brand-gray text-[10px] font-black uppercase tracking-widest mt-1">Size: {item.size}</p>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="text-white/20 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-brand-blue font-bold text-sm mb-4">₹{item.price}</p>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10 text-white">
                            <button 
                              onClick={() => updateQuantity(item.id, item.size, -1)}
                              className="p-1 hover:bg-white/10 rounded"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.size, 1)}
                              className="p-1 hover:bg-white/10 rounded"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-8 border-t border-white/5 bg-white/[0.02]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-brand-gray uppercase tracking-widest text-xs">Total</span>
                  <span className="text-2xl font-black text-white">₹{total}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full py-5 bg-brand-blue text-white font-black rounded-3xl shadow-[0_10px_30px_rgba(41,98,255,0.4)] hover:scale-[1.02] transition-transform"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
