import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, CreditCard, Truck, ShoppingBag, ArrowLeft, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = () => {
  const { cart, total, clearCart, itemCount } = useCart();
  const { currentUser, setIsLoginModalOpen } = useAuth();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Confirmation
  const [lastOrder, setLastOrder] = useState(null);
  const navigate = useNavigate();

  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    pincode: '',
    phone: ''
  });

  // Load saved profile data if exists
  useEffect(() => {
    if (currentUser) {
      const savedProfile = JSON.parse(localStorage.getItem(`blufold_profile_${currentUser.email}`));
      if (savedProfile) {
        setShippingData({
          firstName: savedProfile.fullName?.split(' ')[0] || '',
          lastName: savedProfile.fullName?.split(' ').slice(1).join(' ') || '',
          address: savedProfile.address1 || '',
          city: savedProfile.city || '',
          pincode: savedProfile.pincode || '',
          phone: savedProfile.phone || ''
        });
      }
    }
  }, [currentUser]);

  const sendWhatsAppMessage = (order) => {
    const phoneNumber = "917034510537";
    const itemList = order.items.map(item => `- ${item.name} (${item.size}) x ${item.quantity}`).join('\n');
    
    const message = `*NEW ORDER - BLUFOLD* 🚀\n\n` +
      `*Order ID:* ${order.id}\n` +
      `*--------------------------*\n` +
      `*Items:*\n${itemList}\n` +
      `*--------------------------*\n` +
      `*Total:* ₹${order.total.toLocaleString()}\n\n` +
      `*Customer:* ${shippingData.firstName} ${shippingData.lastName}\n` +
      `*Phone:* ${shippingData.phone}\n` +
      `*Email:* ${currentUser.email}\n` +
      `*Shipping:* ${shippingData.address}, ${shippingData.city} - ${shippingData.pincode}\n\n` +
      `_Please confirm my order. Thank you!_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const handleComplete = () => {
    if (!currentUser) {
      setIsLoginModalOpen(true);
      return;
    }
    
    // Validation
    if (!shippingData.firstName || !shippingData.address || !shippingData.pincode || !shippingData.phone) {
      alert("Please fill in all the required fields including your Phone Number.");
      return;
    }

    const order = {
      id: `ORD-${Math.floor(Math.random() * 900000 + 100000)}`,
      date: new Date().toISOString(),
      items: [...cart],
      total: total,
      status: 'Processing',
      shipping: shippingData
    };

    const orderKey = `blufold_orders_${currentUser.email}`;
    const existingOrders = JSON.parse(localStorage.getItem(orderKey) || '[]');
    localStorage.setItem(orderKey, JSON.stringify([order, ...existingOrders]));

    setLastOrder(order);
    setStep(3);
    clearCart();
    
    // Trigger WhatsApp
    sendWhatsAppMessage(order);
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="pt-40 pb-20 text-center min-h-screen bg-brand-black px-6">
        <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">YOUR BAG IS EMPTY</h2>
        <p className="text-brand-gray mb-10 max-w-sm mx-auto">Looks like you haven't added anything to your cart yet. Browse our collections to find your style.</p>
        <button onClick={() => navigate('/shop')} className="px-12 py-4 bg-brand-blue text-white rounded-full font-black uppercase tracking-widest hover:brightness-110 shadow-[0_0_20px_rgba(41,98,255,0.4)] transition-all">
          EXPLORE SHOP
        </button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen bg-brand-black">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Progress Stepper */}
        {step < 3 && (
          <div className="flex items-center justify-center space-x-4 mb-16">
            <div className={`flex items-center ${step >= 1 ? 'text-brand-blue' : 'text-brand-gray'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-brand-blue bg-brand-blue/10' : 'border-brand-gray'} font-bold`}>1</div>
              <span className="ml-3 font-bold uppercase tracking-widest text-xs hidden md:block">Shipping Info</span>
            </div>
            <div className="w-12 h-[2px] bg-white/10" />
            <div className={`flex items-center ${step >= 3 ? 'text-brand-blue' : 'text-brand-gray'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-brand-blue bg-brand-blue/10' : 'border-brand-gray'} font-bold`}>2</div>
              <span className="ml-3 font-bold uppercase tracking-widest text-xs hidden md:block">Confirmation</span>
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
                  <h2 className="text-4xl font-black text-white tracking-tighter mb-8 flex items-center italic">
                    <Truck className="mr-4 text-brand-blue" /> SHIPPING INFO
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brand-gray uppercase tracking-widest">First Name</label>
                      <input 
                        type="text" 
                        value={shippingData.firstName}
                        onChange={(e) => setShippingData({...shippingData, firstName: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-blue outline-none text-white transition-all" 
                        placeholder="John" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brand-gray uppercase tracking-widest">Last Name</label>
                      <input 
                        type="text" 
                        value={shippingData.lastName}
                        onChange={(e) => setShippingData({...shippingData, lastName: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-blue outline-none text-white transition-all" 
                        placeholder="Doe" 
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold text-brand-gray uppercase tracking-widest">Shipping Address</label>
                      <input 
                        type="text" 
                        value={shippingData.address}
                        onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-blue outline-none text-white transition-all" 
                        placeholder="123 Luxury Street, Minimal City" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brand-gray uppercase tracking-widest">City</label>
                      <input 
                        type="text" 
                        value={shippingData.city}
                        onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-blue outline-none text-white transition-all" 
                        placeholder="New Delhi" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brand-gray uppercase tracking-widest">PIN Code</label>
                      <input 
                        type="text" 
                        value={shippingData.pincode}
                        onChange={(e) => setShippingData({...shippingData, pincode: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-blue outline-none text-white transition-all" 
                        placeholder="110001" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brand-gray uppercase tracking-widest">Phone Number</label>
                      <input 
                        type="tel" 
                        value={shippingData.phone}
                        onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-brand-blue outline-none text-white transition-all italic" 
                        placeholder="+91 XXXX XXXX" 
                      />
                    </div>
                  </div>
                  <button onClick={handleComplete} className="mt-12 group flex items-center space-x-3 bg-white text-brand-black px-10 py-4 rounded-full font-black tracking-widest uppercase hover:bg-brand-blue hover:text-white transition-all shadow-xl">
                    <span>Order via WhatsApp</span>
                    <MessageSquare size={20} className="group-hover:scale-110 transition-transform" />
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
                  <h2 className="text-6xl font-black text-white tracking-tighter mb-4 italic">SUCCESS!</h2>
                  <p className="text-brand-gray text-xl mb-6">Your order has been placed successfully.</p>
                  
                  <div className="max-w-md mx-auto mb-12 p-6 bg-white/5 border border-white/10 rounded-3xl">
                    <p className="text-white text-sm font-bold mb-4">Redirected to WhatsApp?</p>
                    <button 
                      onClick={() => sendWhatsAppMessage(lastOrder)}
                      className="w-full flex items-center justify-center gap-3 py-4 bg-[#25D366] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-lg"
                    >
                      <MessageSquare size={18} /> Send Order via WhatsApp
                    </button>
                  </div>

                  <button onClick={() => navigate('/')} className="px-12 py-4 border border-white/10 text-white rounded-full font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                    Return to Collections
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          {step < 3 && (
            <div className="lg:col-span-1">
              <div className="p-8 rounded-[40px] bg-[#050810] border border-white/10 sticky top-32 shadow-2xl">
                <h3 className="text-xl font-black text-white tracking-tighter mb-8 uppercase flex items-center italic">
                  <ShoppingBag className="mr-3 text-brand-blue" size={20} /> Order Summary
                </h3>
                <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                  {cart.map(item => (
                    <div key={`${item.id}-${item.size}`} className="flex space-x-4">
                      <img src={item.image} className="w-16 h-20 object-cover rounded-xl border border-white/5" />
                      <div>
                        <p className="text-white text-sm font-bold uppercase tracking-tight">{item.name}</p>
                        <p className="text-brand-gray text-[10px] font-bold uppercase tracking-widest">S: {item.size} | Q: {item.quantity} x ₹{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="flex justify-between text-brand-gray text-xs font-bold uppercase tracking-widest">
                    <span>Base Total</span>
                    <span>₹{(total * 1.2).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-brand-gray text-xs font-bold uppercase tracking-widest">
                    <span>Membership Discount</span>
                    <span className="text-green-500">- ₹{(total * 0.2).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-brand-gray text-xs font-bold uppercase tracking-widest">
                    <span>Express Delivery</span>
                    <span className="text-brand-blue">FREE</span>
                  </div>
                  <div className="flex justify-between text-white font-black text-2xl pt-4 border-t border-white/5 italic">
                    <span>TOTAL</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Delivery Note */}
                <div className="mt-8 p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                  <div className="flex items-center gap-3 text-brand-gray text-[10px] font-bold uppercase tracking-widest">
                    <Truck size={16} className="text-brand-blue" />
                    <span>Est. Drop by: <strong className="text-white">Wednesday, 22nd</strong></span>
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
