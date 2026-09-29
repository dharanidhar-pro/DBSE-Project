import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem } from '../types/database';
import { marketplaceService } from '../services/api/marketplaceService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface CartWishlistContextType {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  wishlist: number[];
  addToCart: (productId: number, quantity?: number) => Promise<boolean>;
  updateCartQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleWishlist: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
}

const CartWishlistContext = createContext<CartWishlistContextType | undefined>(undefined);

export const CartWishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showInfo } = useToast();

  const customerId = user?.role === 'CUSTOMER' ? user.id : 1; // Default to demo customer 1 for guest browsing

  const loadCartAndWishlist = useCallback(async () => {
    try {
      const items = await marketplaceService.getCart(customerId);
      setCart(items);
      const wish = marketplaceService.getWishlist();
      setWishlist(wish);
    } catch (e) {
      console.error('Failed to load cart/wishlist:', e);
    }
  }, [customerId]);

  useEffect(() => {
    loadCartAndWishlist();
  }, [loadCartAndWishlist, user]);

  const addToCart = useCallback(
    async (productId: number, quantity: number = 1): Promise<boolean> => {
      try {
        const updated = await marketplaceService.addToCart(customerId, productId, quantity);
        setCart(updated);
        showSuccess('Product added to your cart.', 'Cart Updated');
        return true;
      } catch (err) {
        console.error('Add to cart error:', err);
        return false;
      }
    },
    [customerId, showSuccess]
  );

  const updateCartQuantity = useCallback(
    async (cartItemId: number, quantity: number): Promise<void> => {
      try {
        const updated = await marketplaceService.updateCartQuantity(cartItemId, quantity, customerId);
        setCart(updated);
      } catch (err) {
        console.error('Update cart error:', err);
      }
    },
    [customerId]
  );

  const removeFromCart = useCallback(
    async (cartItemId: number): Promise<void> => {
      try {
        const updated = await marketplaceService.removeFromCart(cartItemId, customerId);
        setCart(updated);
        showInfo('Item removed from cart.');
      } catch (err) {
        console.error('Remove cart error:', err);
      }
    },
    [customerId, showInfo]
  );

  const clearCart = useCallback(async (): Promise<void> => {
    try {
      await marketplaceService.clearCart(customerId);
      setCart([]);
    } catch (err) {
      console.error('Clear cart error:', err);
    }
  }, [customerId]);

  const toggleWishlist = useCallback(
    (productId: number): void => {
      const updated = marketplaceService.toggleWishlist(productId);
      setWishlist(updated);
      if (updated.includes(productId)) {
        showSuccess('Item saved to your wishlist.', 'Wishlist');
      } else {
        showInfo('Item removed from your wishlist.');
      }
    },
    [showSuccess, showInfo]
  );

  const isWishlisted = useCallback(
    (productId: number): boolean => {
      return wishlist.includes(productId);
    },
    [wishlist]
  );

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartWishlistContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        wishlist,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
};

export const useCartWishlist = (): CartWishlistContextType => {
  const context = useContext(CartWishlistContext);
  if (!context) {
    throw new Error('useCartWishlist must be used within CartWishlistProvider');
  }
  return context;
};
