import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Star, Zap, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { products } from '../data/products';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const navigate = useNavigate();
  const wishlisted = isWishlisted(product.id);
  const [isQuickBuying, setIsQuickBuying] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleQuickBuy = (e) => {
    e.stopPropagation();
    if (!selectedSize) {
      setIsQuickBuying(true);
      return;
    }
    addToCart({ ...product, size: selectedSize, quantity: 1 });
    navigate('/checkout');
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!selectedSize) {
      setIsQuickBuying(true);
      return;
    }
    addToCart({ ...product, size: selectedSize, quantity: 1 });
    setIsQuickBuying(false);
    setSelectedSize(null);
  };

  return (
    <motion.div
      className="group cursor-pointer relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onClick={() => !isQuickBuying && navigate(`/product/${product.id}`)}
    >
      <div className="relative overflow-hidden bg-white/5 rounded-3xl aspect-[3/4] mb-4 border border-white/5 group-hover:border-brand-blue/30 transition-all duration-300">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick Buy Overlay */}
        <AnimatePresence>
          {isQuickBuying && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-0 bg-brand-black/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setIsQuickBuying(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white"
              >
                <X size={20} />
              </button>
              
              <p className="text-brand-blue text-[10px] font-black tracking-widest uppercase mb-2">Select Size</p>
              <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-tight line-clamp-1">{product.name}</h4>
              
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-xs font-black transition-all ${
                      selectedSize === size
                        ? 'border-brand-blue bg-brand-blue text-white shadow-[0_0_15px_rgba(41,98,255,0.4)]'
                        : 'border-white/10 text-white hover:border-white/30'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <div className="w-full space-y-2">
                <button
                  onClick={handleQuickBuy}
                  disabled={!selectedSize}
                  className="w-full py-3 bg-brand-blue text-white text-[10px] font-black rounded-xl tracking-widest uppercase hover:brightness-110 transition-all disabled:opacity-40"
                >
                  Confirm & Buy Now
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize}
                  className="w-full py-3 bg-white/5 border border-white/10 text-white text-[10px] font-black rounded-xl tracking-widest uppercase hover:bg-white/10 transition-all disabled:opacity-40"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.badge && (
            <span className="px-2 py-0.5 bg-brand-blue text-white text-[10px] font-black rounded-full tracking-widest">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] font-black rounded-full">
              -{discount}%
            </span>
          )}
          {product.inStock && product.inventory < 5 && (
            <span className="px-2 py-0.5 bg-orange-500 text-white text-[10px] font-black rounded-full animate-pulse">
              ONLY {product.inventory} LEFT
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
          className="absolute top-3 right-3 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 p-2 bg-brand-black/70 rounded-full border border-white/10 hover:border-red-500 z-10"
        >
          <Heart
            size={18}
            className={wishlisted ? 'text-red-500 fill-red-500' : 'text-white'}
          />
        </button>

        {/* Bottom action buttons */}
        {!isQuickBuying && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 w-[90%] flex gap-2 z-10">
            <button
              onClick={(e) => { e.stopPropagation(); setIsQuickBuying(true); }}
              className="flex-1 py-3 bg-white text-brand-black text-xs font-black rounded-2xl flex items-center justify-center gap-1.5 hover:bg-brand-blue hover:text-white transition-colors"
            >
              <ShoppingBag size={14} />
              QUICK ADD
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setIsQuickBuying(true); }}
              className="py-3 px-3 bg-brand-blue text-white text-xs font-black rounded-2xl flex items-center justify-center hover:brightness-110 transition-all"
              title="Buy Now"
            >
              <Zap size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-1">
        <h3 className="text-white font-bold text-base leading-tight truncate">{product.name}</h3>
        <div className="flex items-center gap-1.5 my-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={11}
              className={s <= Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}
            />
          ))}
          <span className="text-brand-gray text-xs ml-1">({product.reviews})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-white font-black text-lg">₹{product.price.toLocaleString()}</span>
          <span className="text-brand-gray text-sm line-through">₹{product.originalPrice.toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  );
};

const ProductGrid = () => {
  const navigate = useNavigate();
  const featured = products.slice(0, 4);

  return (
    <section className="py-20 bg-brand-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/[0.03] blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-blue/[0.03] blur-[120px] rounded-full" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
              <span className="text-brand-blue">FEATURED</span> SELECTION
            </h2>
            <p className="text-brand-gray tracking-widest uppercase text-xs">Curated for the street</p>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="text-brand-blue font-bold text-sm tracking-widest uppercase border-b border-brand-blue pb-1 hover:text-white hover:border-white transition-colors"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
