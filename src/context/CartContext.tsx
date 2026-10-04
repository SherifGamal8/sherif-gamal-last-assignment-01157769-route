import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { CartDetails } from '../types';

export interface CartContextType {
  cartDetails: CartDetails | any;
  cartCount: number;
  cartId: string | null;
  loading: boolean;
  getCart: () => Promise<void>;
  addToCart: (productId: string) => Promise<boolean>;
  updateQuantity: (productId: string, count: number) => Promise<boolean>;
  removeItem: (productId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
}

const CartContext = createContext<CartContextType | any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { userToken } = useAuth();
  const [cartDetails, setCartDetails] = useState<CartDetails | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [cartId, setCartId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getCart = async () => {
    if (!localStorage.getItem('userToken')) return;
    setLoading(true);
    try {
      const { data } = await api.get('/cart');
      setCartDetails(data.data);
      setCartCount(data.numOfCartItems || 0);
      setCartId(data.data?._id || null);
    } catch (err) {
      setCartDetails(null);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userToken) {
      getCart();
    } else {
      setCartDetails(null);
      setCartCount(0);
      setCartId(null);
    }
  }, [userToken]);

  const addToCart = async (productId: string) => {
    if (!userToken) {
      toast.error('Please login first to add items to your cart');
      return false;
    }
    try {
      const { data } = await api.post('/cart', { productId });
      setCartCount(data.numOfCartItems || 0);
      setCartId(data.data?._id || data.cartId || cartId);
      toast.success('Product added successfully to your cart');
      getCart();
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add product');
      return false;
    }
  };

  const updateQuantity = async (productId: string, count: number) => {
    if (count < 1) {
      return removeItem(productId);
    }
    try {
      const { data } = await api.put(`/cart/${productId}`, { count });
      setCartDetails(data.data);
      setCartCount(data.numOfCartItems || 0);
      toast.success('Cart updated');
      return true;
    } catch (err) {
      toast.error('Failed to update quantity');
      return false;
    }
  };

  const removeItem = async (productId: string) => {
    try {
      const { data } = await api.delete(`/cart/${productId}`);
      setCartDetails(data.data);
      setCartCount(data.numOfCartItems || 0);
      toast.success('Item removed from cart');
      return true;
    } catch (err) {
      toast.error('Failed to remove item');
      return false;
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setCartDetails(null);
      setCartCount(0);
      toast.success('Cart cleared');
      return true;
    } catch (err) {
      toast.error('Failed to clear cart');
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartDetails,
        cartCount,
        cartId,
        loading,
        getCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
