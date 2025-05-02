import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '@/types';
import { useStore } from './StoreContext';

interface CartStore {
  items: CartItem[];
  addToCart: (product: Product, size?: string) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (product: Product, size?: string) => {
        const existingItemIndex = get().items.findIndex(
          item => item.product.id === product.id && item.size === size
        );
        
        if (existingItemIndex !== -1) {
          const updatedItems = [...get().items];
          updatedItems[existingItemIndex].quantity += 1;
          set({ items: updatedItems });
        } else {
          set({ items: [...get().items, { product, quantity: 1, size }] });
        }
      },
      
      removeFromCart: (productId: number) => {
        set({
          items: get().items.filter(item => item.product.id !== productId)
        });
      },
      
      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        
        const updatedItems = get().items.map(item => 
          item.product.id === productId 
            ? { ...item, quantity } 
            : item
        );
        
        set({ items: updatedItems });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + (item.product.price * item.quantity), 
          0
        );
      }
    }),
    {
      name: 'cart-storage', // имя для localStorage
    }
  )
);