import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, ShoppingBag, Zap, Star, ChevronLeft, Shield,
  Truck, RotateCcw, Package, CheckCircle2, Share2
} from 'lucide-react';
import { getProductById, products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductGrid';

const StarRating = ({ rating, count }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}
          />
        ))}
      </div>
      <span className="text-yellow-400 font-bold text-sm">{rating}</span>
      <span className="text-brand-gray text-sm">({count.toLocaleString()} reviews)</span>
    </div>
  );
};

const SizeButton = ({ size, selected, onClick, unavailable }) => (
  <button
    onClick={() => !unavailable && onClick(size)}
    disabled={unavailable}
    className={`relative w-14 h-14 rounded-xl font-bold text-sm transition-all duration-200 border-2 ${
      unavailable
        ? 'border-white/10 text-white/20 cursor-not-allowed'
        : selected
        ? 'border-brand-blue bg-brand-blue text-white scale-105 shadow-[0_0_20px_rgba(41,98,255,0.5)]'
        : 'border-white/20 text-white hover:border-brand-blue hover:text-brand-blue'
    }`}
  >
    {size}
    {unavailable && (
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="w-full h-[1px] bg-white/20 absolute rotate-45" />
      </span>
    )}
  </button>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(id);
  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [sizeError, setSizeError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="pt-40 min-h-screen bg-brand-black flex flex-col items-center justify-center">
        <h2 className="text-4xl font-black text-white mb-4">Product Not Found</h2>
        <button onClick={() => navigate('/shop')} className="btn-primary">Back to Shop</button>
      </div>
    );
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const wishlisted = isWishlisted(product.id);
  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    addToCart({ ...product, size: selectedSize, quantity });
    setAddedToCart(true);
    setTimeout(() => { setAddedToCart(false); setIsCartOpen(true); }, 800);
  };

  const handleBuyNow = () => {
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    addToCart({ ...product, size: selectedSize, quantity });
    navigate('/checkout');
  };

  return (
    <div className="pt-24 min-h-screen bg-brand-black">
      {/* Breadcrumb */}
      <div className="container mx-auto px-6 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-brand-gray hover:text-white transition-colors text-sm font-medium"
        >
          <ChevronLeft size={18} />
          Back
        </button>
      </div>

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* ── Image Gallery ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Image */}
            <div className="relative rounded-[32px] overflow-hidden bg-white/5 aspect-[4/5] mb-4 border border-white/10">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>

              {/* Badge */}
              {product.badge && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-brand-blue text-white text-xs font-black rounded-full tracking-widest">
                  {product.badge}
                </div>
              )}

              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-xs font-black rounded-full">
                  -{discount}% OFF
                </div>
              )}

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product)}
                className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-brand-black/60 backdrop-blur flex items-center justify-center border border-white/10 hover:border-red-500 transition-all"
              >
                <Heart
                  size={20}
                  className={wishlisted ? 'text-red-500 fill-red-500' : 'text-white'}
                />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === i ? 'border-brand-blue' : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* ── Product Info ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <p className="text-brand-blue text-xs font-bold uppercase tracking-[0.3em] mb-3">
              {product.category}
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight mb-4">
              {product.name}
            </h1>

            <StarRating rating={product.rating} count={product.reviews} />

            {/* Price */}
            <div className="flex items-baseline gap-4 mt-6 mb-6">
              <span className="text-4xl font-black text-white">₹{product.price.toLocaleString()}</span>
              <span className="text-xl text-brand-gray line-through">₹{product.originalPrice.toLocaleString()}</span>
              <span className="text-green-400 font-bold text-lg">Save ₹{(product.originalPrice - product.price).toLocaleString()}</span>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-8">
              {product.inStock ? (
                <>
                  <div className={`w-2 h-2 rounded-full ${product.inventory < 5 ? 'bg-orange-500 animate-pulse' : 'bg-green-400 animate-pulse'}`} />
                  <span className={`${product.inventory < 5 ? 'text-orange-500' : 'text-green-400'} text-sm font-semibold`}>
                    {product.inventory < 10 ? `Only ${product.inventory} left in stock` : 'In Stock'}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-red-400 text-sm font-semibold">Out of Stock</span>
                </>
              )}
            </div>

            {/* Size Selector */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-bold uppercase tracking-widest text-sm">Select Size</span>
                <button className="text-brand-blue text-xs underline underline-offset-4">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <SizeButton
                    key={size}
                    size={size}
                    selected={selectedSize === size}
                    onClick={setSelectedSize}
                    unavailable={!product.inStock && size === 'XL'}
                  />
                ))}
              </div>
              <AnimatePresence>
                {sizeError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400 text-sm mt-3 font-medium"
                  >
                    ⚠ Please select a size to continue
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-white font-bold uppercase tracking-widest text-sm">Qty</span>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 transition-colors text-lg font-bold"
                >
                  −
                </button>
                <span className="w-10 text-center text-white font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 transition-colors text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 mb-8">
              <motion.button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                whileTap={{ scale: 0.97 }}
                className={`flex-1 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all border-2 ${
                  addedToCart
                    ? 'border-green-500 bg-green-500/10 text-green-400'
                    : 'border-white text-white hover:border-brand-blue hover:bg-brand-blue hover:text-white'
                }`}
              >
                {addedToCart ? (
                  <><CheckCircle2 size={18} /> Added!</>
                ) : (
                  <><ShoppingBag size={18} /> Add to Cart</>
                )}
              </motion.button>

              <motion.button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                whileTap={{ scale: 0.97 }}
                className="flex-1 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 bg-brand-blue text-white hover:brightness-110 shadow-[0_8px_30px_rgba(41,98,255,0.4)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Zap size={18} />
                Buy Now
              </motion.button>
            </div>

            {/* Wishlist + Share row */}
            <div className="flex gap-3 mb-10">
              <button
                onClick={() => toggleWishlist(product)}
                className={`flex-1 py-3 rounded-xl border text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                  wishlisted
                    ? 'border-red-500/50 text-red-400 bg-red-500/10'
                    : 'border-white/10 text-brand-gray hover:border-red-500/50 hover:text-red-400'
                }`}
              >
                <Heart size={16} className={wishlisted ? 'fill-red-400' : ''} />
                {wishlisted ? 'Wishlisted' : 'Wishlist'}
              </button>
              <button className="flex-1 py-3 rounded-xl border border-white/10 text-brand-gray hover:border-white/30 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                <Share2 size={16} />
                Share
              </button>
            </div>

            {/* Delivery & Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { icon: Truck, label: 'Free Delivery', sub: 'On orders above ₹999' },
                { icon: RotateCcw, label: '7-Day Returns', sub: 'Easy hassle-free returns' },
                { icon: Shield, label: '100% Genuine', sub: 'Quality guaranteed' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <Icon size={20} className="text-brand-blue mb-2" />
                  <p className="text-white text-xs font-bold">{label}</p>
                  <p className="text-brand-gray text-[10px] mt-0.5">{sub}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-white font-black uppercase tracking-widest text-sm mb-3">About this product</h3>
              <p className="text-brand-gray leading-relaxed text-sm">{product.description}</p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3">
              {product.features.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <Package size={14} className="text-brand-blue flex-shrink-0" />
                  <span className="text-brand-gray text-sm">{f}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="border-t border-white/5 pt-16 pb-20">
            <h2 className="text-3xl font-black text-white tracking-tighter mb-10">
              YOU MAY ALSO <span className="text-brand-blue">LIKE</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
