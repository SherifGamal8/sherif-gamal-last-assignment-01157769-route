import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { Product } from '../types';

export interface WishlistContextType {
  wishlist: Product[];
  wishlistIds: Set<string>;
  loading: boolean;
  addToWishlist: (productId: string) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
  getWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | any>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { userToken } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(false);

  const getWishlist = async () => {
    if (!localStorage.getItem('userToken')) return;
    setLoading(true);
    try {
      const { data } = await api.get('/wishlist');
      setWishlist(data.data || []);
      setWishlistIds(new Set((data.data || []).map((item: any) => item._id || item.id)));
    } catch (err) {
      setWishlist([]);
      setWishlistIds(new Set());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userToken) {
      getWishlist();
    } else {
      setWishlist([]);
      setWishlistIds(new Set());
    }
  }, [userToken]);

  const addToWishlist = async (productId: string) => {
    if (!userToken) {
      toast.error('Please login to add items to wishlist');
      return false;
    }
    try {
      const { data } = await api.post('/wishlist', { productId });
      if (data.data) {
        setWishlistIds(new Set(data.data));
      } else {
        setWishlistIds((prev) => new Set([...prev, productId]));
      }
      toast.success(data.message || 'Product added to wishlist');
      getWishlist();
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add to wishlist');
      return false;
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const { data } = await api.delete(`/wishlist/${productId}`);
      if (data.data) {
        setWishlistIds(new Set(data.data));
      } else {
        setWishlistIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      }
      setWishlist((prev) => prev.filter((item: any) => (item._id || item.id) !== productId));
      toast.success(data.message || 'Product removed from wishlist');
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to remove from wishlist');
      return false;
    }
  };

  const isInWishlist = (productId: string) => wishlistIds.has(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistIds,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
