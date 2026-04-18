import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, MapPin, LogOut, ChevronRight, Clock, Box, Save, UserCircle, Phone, Home, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'profile'
  const [profileData, setProfileData] = useState({
    fullName: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    pincode: '',
    avatar: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    // Load Orders
    const orderKey = `blufold_orders_${currentUser.email}`;
    const savedOrders = JSON.parse(localStorage.getItem(orderKey) || '[]');
    setOrders(savedOrders);

    // Load Profile Data
    const profileKey = `blufold_profile_${currentUser.email}`;
    const savedProfile = JSON.parse(localStorage.getItem(profileKey));
    if (savedProfile) {
      setProfileData(prev => ({ ...prev, ...savedProfile }));
    }
  }, [currentUser, navigate]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsSaving(true);
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'blufold_preset');
    data.append('cloud_name', 'dcv239dzm');

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dcv239dzm/image/upload', {
        method: 'POST',
        body: data,
      });
      const res = await response.json();
      
      if (res.secure_url) {
        const updatedProfile = { ...profileData, avatar: res.secure_url };
        setProfileData(updatedProfile);
        localStorage.setItem(`blufold_profile_${currentUser.email}`, JSON.stringify(updatedProfile));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Photo upload failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProfile = (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      const profileKey = `blufold_profile_${currentUser.email}`;
      localStorage.setItem(profileKey, JSON.stringify(profileData));
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  if (!currentUser) return null;

  return (
    <div className="pt-32 pb-20 min-h-screen bg-brand-black">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <AnimatePresence mode="wait">
              {activeTab === 'orders' ? (
                <motion.div
                  key="orders-tab"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h1 className="text-4xl font-black text-white tracking-tighter mb-8 uppercase">Order History</h1>
                  
                  {orders.length === 0 ? (
                    <div className="bg-[#050810] border border-white/10 rounded-[40px] p-16 text-center">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Box size={32} className="text-brand-gray" />
                      </div>
                      <h3 className="text-2xl font-black text-white mb-2">NO ORDERS YET</h3>
                      <p className="text-brand-gray mb-8 text-lg">You haven't placed any orders yet.</p>
                      <button 
                        onClick={() => navigate('/shop')}
                        className="px-8 py-3 bg-brand-blue text-white rounded-full font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={order.id} 
                          className="bg-[#050810] border border-white/10 rounded-[32px] overflow-hidden hover:border-brand-blue/30 transition-all shadow-xl"
                        >
                          <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 bg-white/[0.02]">
                            <div>
                              <p className="text-[10px] font-black text-brand-gray uppercase tracking-widest mb-1">Order ID</p>
                              <h4 className="text-white font-black text-lg">{order.id}</h4>
                            </div>
                            <div className="mt-4 md:mt-0 flex items-center gap-6">
                              <div className="text-right">
                                <p className="text-[10px] font-black text-brand-gray uppercase tracking-widest mb-1">Status</p>
                                <span className="bg-green-500/10 text-green-400 text-[10px] font-black px-3 py-1 rounded-full border border-green-500/20 uppercase">
                                  {order.status}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] font-black text-brand-gray uppercase tracking-widest mb-1">Total</p>
                                <p className="text-white font-black">₹{order.total.toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-6 md:p-8">
                            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex-shrink-0 flex items-center gap-4 bg-white/5 rounded-2xl p-3 border border-white/5">
                                  <img src={item.image} alt="" className="w-12 h-16 object-cover rounded-lg" />
                                  <div>
                                    <p className="text-white text-xs font-bold line-clamp-1 w-24">{item.name}</p>
                                    <p className="text-brand-gray text-[10px]">Size: {item.size} | Qty: {item.quantity}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-center gap-2 text-brand-gray text-xs font-medium">
                                <Clock size={14} />
                                Placed on {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </div>
                              <button className="flex items-center gap-2 text-brand-blue text-xs font-black uppercase tracking-widest hover:text-white transition-colors">
                                Track Order <ChevronRight size={16} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="profile-tab"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h1 className="text-4xl font-black text-white tracking-tighter mb-8 uppercase">Personal Information</h1>
                  
                  <div className="bg-[#050810] border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 blur-[80px] pointer-events-none" />
                    
                    <form onSubmit={handleSaveProfile} className="space-y-8 relative z-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-[10px] font-black text-brand-gray uppercase tracking-widest mb-3 flex items-center gap-2">
                            <UserCircle size={14} className="text-brand-blue" /> Full Name
                          </label>
                          <input 
                            type="text"
                            value={profileData.fullName}
                            onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                            placeholder="John Doe"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-brand-blue transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-brand-gray uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Phone size={14} className="text-brand-blue" /> Contact Number
                          </label>
                          <input 
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            placeholder="Secondary phone"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-brand-blue transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div>
                          <label className="block text-[10px] font-black text-brand-gray uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Home size={14} className="text-brand-blue" /> Address Line 1
                          </label>
                          <input 
                            type="text"
                            value={profileData.address1}
                            onChange={(e) => setProfileData({...profileData, address1: e.target.value})}
                            placeholder="Street address, P.O. box"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-brand-blue transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <label className="block text-[10px] font-black text-brand-gray uppercase tracking-widest mb-3 flex items-center gap-2">
                              City
                            </label>
                            <input 
                              type="text"
                              value={profileData.city}
                              onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                              placeholder="City"
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-brand-blue transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-brand-gray uppercase tracking-widest mb-3 flex items-center gap-2">
                              Pincode
                            </label>
                            <input 
                              type="text"
                              value={profileData.pincode}
                              onChange={(e) => setProfileData({...profileData, pincode: e.target.value})}
                              placeholder="6-digit code"
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-brand-blue transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button 
                          type="submit"
                          disabled={isSaving}
                          className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${
                            saveSuccess 
                            ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]' 
                            : 'bg-brand-blue text-white hover:brightness-110 shadow-[0_0_20px_rgba(41,98,255,0.4)]'
                          }`}
                        >
                          {isSaving ? (
                            <span className="animate-pulse">Saving...</span>
                          ) : saveSuccess ? (
                            <>Saved Successfully!</>
                          ) : (
                            <><Save size={18} /> Save Profile Data</>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6 order-1 lg:order-2">
            <div className="bg-[#050810] border border-white/10 rounded-3xl p-8 text-center shadow-xl group relative overflow-hidden">
              <label className="cursor-pointer block relative group/avatar mx-auto mb-4 w-24 h-24">
                <input type="file" className="hidden" onChange={handlePhotoUpload} accept="image/*" />
                <div className="w-24 h-24 bg-brand-blue/20 rounded-full flex items-center justify-center border-2 border-brand-blue/30 overflow-hidden transition-all group-hover/avatar:border-brand-blue group-hover/avatar:scale-105">
                  {profileData.avatar ? (
                    <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-brand-blue" />
                  )}
                </div>
                <div className="absolute inset-0 bg-brand-black/60 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                  <ImageIcon size={20} className="text-white" />
                </div>
              </label>
              
              <h2 className="text-white font-black text-xs tracking-tighter lowercase truncate px-2">
                {currentUser.email}
              </h2>
              <p className="text-brand-gray text-[10px] font-bold uppercase tracking-widest mt-1">Verified Member</p>
            </div>

            <nav className="bg-[#050810] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-4 px-6 py-4 transition-all text-xs font-bold uppercase tracking-widest text-left ${
                  activeTab === 'orders' 
                  ? 'text-brand-blue bg-brand-blue/5 border-r-4 border-brand-blue' 
                  : 'text-brand-gray hover:text-white hover:bg-white/5'
                }`}
              >
                <Package size={18} /> My Orders
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-4 px-6 py-4 transition-all text-xs font-bold uppercase tracking-widest text-left ${
                  activeTab === 'profile' 
                  ? 'text-brand-blue bg-brand-blue/5 border-r-4 border-brand-blue' 
                  : 'text-brand-gray hover:text-white hover:bg-white/5'
                }`}
              >
                <MapPin size={18} /> Personal Info
              </button>
              <button 
                onClick={() => { logout(); navigate('/'); }}
                className="w-full flex items-center gap-4 px-6 py-4 text-red-500 hover:bg-red-500/5 transition-all text-xs font-bold uppercase tracking-widest text-left"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </nav>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
