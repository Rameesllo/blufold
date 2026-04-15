import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, CreditCard, Truck, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { cart, total, clearCart, itemCount } = useCart();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const navigate = useNavigate();

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="pt-40 pb-20 text-center min-h-screen bg-brand-black px-6">
        <h2 className="text-4xl font-black text-white mb-6">YOUR BAG IS EMPTY</h2>
        <button onClick={() => navigate('/shop')} className="btn-primary">Return to Shop</button>
      </div>
    );
  }

  const handleNext = () => setStep(step + 1);
  const handleComplete = () => {
    setStep(3);
    clearCart();
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-brand-black">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Progress Stepper */}
        {step < 3 && (
          <div className="flex items-center justify-center space-x-4 mb-16">
            <div className={`flex items-center ${step >= 1 ? 'text-brand-blue' : 'text-brand-gray'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-brand-blue bg-brand-blue/10' : 'border-brand-gray'} font-bold`}>1</div>
              <span className="ml-3 font-bold uppercase tracking-widest text-xs hidden md:block">Shipping</span>
            </div>
            <div className="w-12 h-[2px] bg-white/10" />
            <div className={`flex items-center ${step >= 2 ? 'text-brand-blue' : 'text-brand-gray'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-brand-blue bg-brand-blue/10' : 'border-brand-gray'} font-bold`}>2</div>
              <span className="ml-3 font-bold uppercase tracking-widest text-xs hidden md:block">Payment</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h2 className="text-4xl font-black text-white tracking-tighter mb-8 flex items-center">
                    <Truck className="mr-4 text-brand-blue" /> SHIPPING INFO
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brand-gray uppercase tracking-widest">First Name</label>
                      <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-blue outline-none text-white" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brand-gray uppercase tracking-widest">Last Name</label>
                      <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-blue outline-none text-white" placeholder="Doe" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold text-brand-gray uppercase tracking-widest">Shipping Address</label>
                      <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-blue outline-none text-white" placeholder="123 Luxury Street, Minimal City" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brand-gray uppercase tracking-widest">City</label>
                      <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-blue outline-none text-white" placeholder="New Delhi" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brand-gray uppercase tracking-widest">PIN Code</label>
                      <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-blue outline-none text-white" placeholder="110001" />
                    </div>
                  </div>
                  <button onClick={handleNext} className="mt-12 group flex items-center space-x-3 bg-white text-brand-black px-10 py-4 rounded-full font-black tracking-widest uppercase hover:bg-brand-blue hover:text-white transition-all">
                    <span>Next: Payment</span>
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <button onClick={() => setStep(1)} className="flex items-center text-brand-gray hover:text-white mb-6 uppercase text-xs font-bold tracking-widest">
                    <ArrowLeft size={16} className="mr-2" /> Back
                  </button>
                  <h2 className="text-4xl font-black text-white tracking-tighter mb-8 flex items-center">
                    <CreditCard className="mr-4 text-brand-blue" /> PAYMENT
                  </h2>
                  <div className="space-y-6">
                    <div className="p-8 rounded-[30px] bg-brand-blue/10 border border-brand-blue/30 relative overflow-hidden group">
                      <div className="flex items-center space-x-4 mb-4">
                        <CreditCard className="text-brand-blue" />
                        <span className="text-lg font-bold text-white">Credit / Debit Card</span>
                      </div>
                      <div className="space-y-4">
                        <input type="text" className="w-full bg-brand-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none text-white text-sm" placeholder="Card Number" />
                        <div className="grid grid-cols-2 gap-4">
                          <input type="text" className="bg-brand-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none text-white text-sm" placeholder="MM/YY" />
                          <input type="text" className="bg-brand-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none text-white text-sm" placeholder="CVV" />
                        </div>
                      </div>
                    </div>
                    <div className="p-8 rounded-[30px] bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer">
                      <span className="text-brand-gray font-bold uppercase tracking-widest text-xs">Other options: UPI / Net Banking</span>
                    </div>
                  </div>
                  <button onClick={handleComplete} className="mt-12 w-full py-5 bg-brand-blue text-white font-black rounded-[30px] shadow-[0_10px_30px_rgba(41,98,255,0.4)] hover:scale-[1.02] transition-transform">
                    PLACE ORDER (₹{total})
                  </button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="flex justify-center mb-8">
                    <div className="w-24 h-24 bg-brand-blue/20 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={64} className="text-brand-blue animate-pulse" />
                    </div>
                  </div>
                  <h2 className="text-6xl font-black text-white tracking-tighter mb-4">THANK YOU!</h2>
                  <p className="text-brand-gray text-xl mb-12">Your order has been placed successfully.</p>
                  <button onClick={() => navigate('/')} className="px-12 py-4 bg-white text-brand-black rounded-full font-black uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all">
                    Back to Home
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          {step < 3 && (
            <div className="lg:col-span-1">
              <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 sticky top-32">
                <h3 className="text-xl font-black text-white tracking-tighter mb-8 uppercase flex items-center">
                  <ShoppingBag className="mr-3" size={20} /> Order Summary
                </h3>
                <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                  {cart.map(item => (
                    <div key={item.id} className="flex space-x-4">
                      <img src={item.image} className="w-16 h-20 object-cover rounded-xl" />
                      <div>
                        <p className="text-white text-sm font-bold">{item.name}</p>
                        <p className="text-brand-gray text-xs">{item.quantity} x ₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="flex justify-between text-brand-gray text-sm">
                    <span>Price ({itemCount} items)</span>
                    <span>₹{(total * 1.2).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-brand-gray text-sm">
                    <span>Discount</span>
                    <span className="text-green-500">- ₹{(total * 0.2).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-brand-gray text-sm">
                    <span>Delivery Charges</span>
                    <span className="text-green-500">FREE</span>
                  </div>
                  <div className="flex justify-between text-white font-black text-xl pt-4 border-t border-white/5">
                    <span>TOTAL AMOUNT</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  <div className="pt-2">
                    <p className="text-green-500 text-xs font-bold bg-green-500/10 p-2 rounded-lg border border-green-500/20 text-center">
                      You will save ₹{(total * 0.2).toLocaleString()} on this order
                    </p>
                  </div>
                </div>

                {/* Delivery Note */}
                <div className="mt-8 p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                  <div className="flex items-center gap-3 text-brand-gray text-xs">
                    <Truck size={16} className="text-brand-blue" />
                    <span>Estimated delivery by: <strong className="text-white">Wednesday, 22nd April</strong></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
