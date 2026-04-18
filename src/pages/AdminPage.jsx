import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, List, Trash2, ArrowLeft, Package, Image as ImageIcon, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('list');
  const navigate = useNavigate();
  const { products, deleteProduct, addProduct, editProduct } = useProducts();
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'Tees',
    images: [],
    description: '',
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const existingCategories = [...new Set(products.map(p => p.category))];

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'blufold_preset');
    data.append('cloud_name', 'dcv239dzm');

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dcv239dzm/image/upload', {
        method: 'POST',
        body: data,
      });
      const uploadedImage = await response.json();
      
      if (uploadedImage.secure_url) {
        setFormData(prev => ({ ...prev, images: [...prev.images, uploadedImage.secure_url] }));
      } else {
        console.error('Upload failed:', uploadedImage);
        alert('Image upload failed. Ensure you have created an Unsigned Upload Preset in Cloudinary and inserted its name correctly in the code.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please check console for details.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.originalPrice) return;

    const defaultImage = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
    
    const productPayload = {
      name: formData.name,
      price: parseInt(formData.price),
      originalPrice: parseInt(formData.originalPrice),
      category: formData.category,
      image: formData.images.length > 0 ? formData.images[0] : defaultImage,
      description: formData.description || 'No description provided.'
    };

    if (editingId) {
      editProduct(editingId, { ...productPayload, images: formData.images.length > 0 ? formData.images : [defaultImage] });
      setToastMessage('Product Updated Successfully!');
    } else {
      addProduct({
        ...productPayload,
        images: formData.images.length > 0 ? formData.images : [defaultImage],
        rating: 5.0,
        reviews: 0,
        badge: 'NEW ARRIVAL',
        sizes: ['S', 'M', 'L', 'XL'],
        inStock: true,
        inventory: 50,
        features: ['Admin Created', 'Premium Material']
      });
      setToastMessage('Product Added Successfully!');
    }

    setFormData({
      name: '', price: '', originalPrice: '', category: 'Tees', images: [], description: ''
    });
    setEditingId(null);
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setActiveTab('list');
  };

  const openAddTab = () => {
    setEditingId(null);
    setIsNewCategory(false);
    setFormData({ name: '', price: '', originalPrice: '', category: existingCategories[0] || 'Tees', images: [], description: '' });
    setActiveTab('add');
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setIsNewCategory(false);
    setFormData({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      images: product.images || (product.image ? [product.image] : []),
      description: product.description || ''
    });
    setActiveTab('add');
  };

  return (
    <div className="min-h-screen bg-brand-black text-white flex">
      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="w-64 bg-[#050810] border-r border-white/5 hidden md:flex flex-col">
        <div className="p-8 border-b border-white/5">
          <h2 className="text-2xl font-black tracking-tighter">BLUFOLD</h2>
          <p className="text-brand-blue text-xs font-bold tracking-widest uppercase mt-1">Admin Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${
              activeTab === 'list' ? 'bg-brand-blue text-white' : 'text-brand-gray hover:bg-white/5 hover:text-white'
            }`}
          >
            <List size={18} /> Product List
          </button>
          <button
            onClick={openAddTab}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${
              activeTab === 'add' ? 'bg-brand-blue text-white' : 'text-brand-gray hover:bg-white/5 hover:text-white'
            }`}
          >
            <Plus size={18} /> {editingId ? 'Edit Product' : 'Add Product'}
          </button>
        </nav>
        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm text-brand-gray hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft size={18} /> Back to Store
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-[#050810] border-b border-white/5 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black">BLUFOLD</h2>
            <p className="text-brand-blue text-[10px] font-bold tracking-widest uppercase">Admin Portal</p>
          </div>
          <button onClick={() => navigate('/')} className="text-brand-gray hover:text-white">
            <ArrowLeft size={24} />
          </button>
        </header>
        
        {/* Mobile Nav */}
        <div className="md:hidden flex p-4 gap-2 border-b border-white/5 bg-[#0A0E1C]">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 ${
              activeTab === 'list' ? 'bg-brand-blue text-white' : 'bg-white/5 text-brand-gray'
            }`}
          >
            <List size={14} /> Products
          </button>
          <button
            onClick={openAddTab}
            className={`flex-1 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 ${
              activeTab === 'add' ? 'bg-brand-blue text-white' : 'bg-white/5 text-brand-gray'
            }`}
          >
            <Plus size={14} /> Add New
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-brand-black">
          <AnimatePresence mode="wait">
            {activeTab === 'list' ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-3xl font-black uppercase">All Products</h1>
                  <span className="bg-brand-blue/20 text-brand-blue px-3 py-1 rounded-full text-xs font-bold font-mono">
                    {products.length} Items
                  </span>
                </div>

                <div className="bg-[#050810] rounded-3xl border border-white/5 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-brand-gray text-xs uppercase tracking-widest">
                          <th className="p-6 font-bold">Image</th>
                          <th className="p-6 font-bold">Product Name</th>
                          <th className="p-6 font-bold">Category</th>
                          <th className="p-6 font-bold">Price</th>
                          <th className="p-6 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 pl-6">
                              <div className="w-12 h-16 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              </div>
                            </td>
                            <td className="p-6 font-bold">{product.name}</td>
                            <td className="p-6">
                              <span className="bg-white/5 text-brand-gray px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                {product.category}
                              </span>
                            </td>
                            <td className="p-6">
                              <div className="flex flex-col">
                                <span className="font-bold">₹{product.price.toLocaleString()}</span>
                                <span className="text-xs text-brand-gray line-through">₹{product.originalPrice.toLocaleString()}</span>
                              </div>
                            </td>
                            <td className="p-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleEditClick(product)}
                                  className="p-2 bg-white/5 text-brand-gray hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                  title="Edit Product"
                                >
                                  <Box size={16} />
                                </button>
                                <button
                                  onClick={() => deleteProduct(product.id)}
                                  className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                                  title="Delete Product"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {products.length === 0 && (
                          <tr>
                            <td colSpan="5" className="p-12 text-center text-brand-gray">
                              <Package size={48} className="mx-auto mb-4 opacity-50" />
                              <p className="font-bold">No products found.</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="add"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-2xl mx-auto"
              >
                <div className="mb-8">
                  <h1 className="text-3xl font-black uppercase mb-2">{editingId ? 'Edit Product' : 'Add New Product'}</h1>
                  <p className="text-brand-gray text-sm">{editingId ? 'Modify the product details below.' : 'Enter the product details below to add it to your catalog.'}</p>
                </div>

                <form onSubmit={handleAddProduct} className="bg-[#050810] rounded-3xl border border-white/5 p-6 md:p-8 space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-brand-gray uppercase tracking-widest mb-2">Product Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue transition-colors"
                      placeholder="e.g. Heavyweight Essential Hoodie"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-brand-gray uppercase tracking-widest mb-2">Sale Price (₹)</label>
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue transition-colors"
                        placeholder="1499"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-gray uppercase tracking-widest mb-2">Original Price (₹)</label>
                      <input
                        type="number"
                        required
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue transition-colors"
                        placeholder="2999"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="block text-xs font-bold text-brand-gray uppercase tracking-widest">Category</label>
                        <button 
                          type="button" 
                          onClick={() => {
                            setIsNewCategory(!isNewCategory);
                            if (isNewCategory && existingCategories.length > 0) {
                              setFormData({...formData, category: existingCategories[0]});
                            } else {
                              setFormData({...formData, category: ''});
                            }
                          }} 
                          className="text-[10px] font-black text-brand-blue uppercase tracking-widest hover:text-white transition-colors"
                        >
                          {isNewCategory ? 'Select Existing' : '+ Add New Category'}
                        </button>
                      </div>
                      {isNewCategory ? (
                        <input
                          type="text"
                          required
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue transition-colors"
                          placeholder="e.g. Headwear or Accessories"
                        />
                      ) : (
                        <div className="relative">
                          <select
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue transition-colors appearance-none"
                          >
                            {existingCategories.length > 0 ? (
                              existingCategories.map((cat) => (
                                <option key={cat} value={cat} className="bg-[#050810]">{cat}</option>
                              ))
                            ) : (
                              <option value="Tees" className="bg-[#050810]">Tees</option>
                            )}
                          </select>
                          <Box size={16} className="absolute right-4 top-3.5 text-brand-gray pointer-events-none" />
                        </div>
                      )}
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-xs font-bold text-brand-gray uppercase tracking-widest mb-2">Product Gallery ({formData.images.length})</label>
                      <div className="flex flex-col gap-4">
                        {formData.images.length > 0 && (
                          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                            {formData.images.map((imgUrl, idx) => (
                              <div key={idx} className="relative w-20 h-24 rounded-xl overflow-hidden border border-white/10 shrink-0">
                                <img src={imgUrl} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setFormData({...formData, images: formData.images.filter((_, i) => i !== idx)})}
                                  className="absolute inset-0 bg-brand-black/60 text-red-500 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"
                                >
                                  <Trash2 size={20} />
                                </button>
                                {idx === 0 && (
                                  <span className="absolute bottom-1 left-1 right-1 text-center bg-brand-blue text-white text-[9px] font-black tracking-widest rounded py-0.5">
                                    COVER
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                            className="block w-full text-sm text-brand-gray
                              file:mr-4 file:py-2.5 file:px-6
                              file:rounded-xl file:border border-white/10
                              file:text-xs file:font-bold file:uppercase file:tracking-widest
                              file:bg-white/5 file:text-white
                              hover:file:bg-brand-blue hover:file:border-brand-blue hover:file:text-white transition-all
                              disabled:opacity-50 cursor-pointer"
                          />
                          {isUploading && (
                            <p className="text-brand-blue text-xs font-bold mt-2 animate-pulse">Uploading to Cloudinary...</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-gray uppercase tracking-widest mb-2">Description</label>
                    <textarea
                      rows="4"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue transition-colors resize-none"
                      placeholder="Product details, material info, etc."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-brand-blue text-white font-black rounded-xl tracking-widest uppercase hover:brightness-110 shadow-[0_0_20px_rgba(41,98,255,0.4)] transition-all"
                  >
                    {editingId ? 'Save Changes' : 'Add Product'}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
