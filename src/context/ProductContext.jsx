import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '../data/products';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('blufold_products');
    if (saved) {
      return JSON.parse(saved);
    }
    return initialProducts;
  });

  useEffect(() => {
    localStorage.setItem('blufold_products', JSON.stringify(products));
  }, [products]);

  const addProduct = (product) => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct = { ...product, id: newId };
    setProducts(prev => [newProduct, ...prev]);
  };

  const editProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const getProductById = (id) => {
    return products.find(p => p.id === parseInt(id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, editProduct, deleteProduct, getProductById }}>
      {children}
    </ProductContext.Provider>
  );
};
