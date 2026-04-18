import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  
  // Use a ref to prevent looping since we switch the cart entirely, 
  // but we can just use dynamic identification for localStorage
  const getCartKey = () => `blufold_cart_${currentUser?.email || 'guest'}`;

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem(getCartKey());
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Hot-swap the cart memory when the currentUser logs in/out
  useEffect(() => {
    const savedCart = localStorage.getItem(getCartKey());
    setCart(savedCart ? JSON.parse(savedCart) : []);
  }, [currentUser]);

  // Persist the cart continuously based on the dynamically retrieved key
  useEffect(() => {
    localStorage.setItem(getCartKey(), JSON.stringify(cart));
  }, [cart, currentUser]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id && item.size === product.size);
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.size === product.size) 
            ? { ...item, quantity: item.quantity + (product.quantity || 1) } 
            : item
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
    // Only open the cart if it's not a "Buy Now" flow (you can differentiate if needed)
    // But for now, we'll keep the auto-open behavior
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, size) => {
    setCart((prev) => prev.filter(item => !(item.id === productId && item.size === size)));
  };

  const updateQuantity = (productId, size, delta) => {
    setCart((prev) => prev.map(item => {
      if (item.id === productId && item.size === size) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      total, 
      itemCount,
      isCartOpen,
      setIsCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
};
