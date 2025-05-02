import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage, Translation, translations, DEFAULT_LANGUAGE } from './translations';
import { Product } from '@shared/schema';

type Theme = 'light' | 'dark';

// Тип для элемента корзины
export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

interface StoreContextType {
  // Language
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: Translation;
  
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  
  // Referral
  referralCode: string | null;
  setReferralCode: (code: string | null) => void;
  
  // Favorites
  favorites: number[];
  addToFavorites: (productId: number) => void;
  removeFromFavorites: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  
  // Cart
  cartItems: CartItem[];
  addToCart: (product: Product, size?: string) => void;
  removeFromCart: (productId: number) => void;
  updateCartItemQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  // Language state
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    // Try to load from localStorage, fallback to DEFAULT_LANGUAGE
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
        return savedLanguage as SupportedLanguage;
      }
    }
    return DEFAULT_LANGUAGE;
  });
  
  // Theme state
  const [theme, setThemeState] = useState<Theme>(() => {
    // Try to load from localStorage, fallback to 'light'
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
    }
    return 'light';
  });

  // Referral code state
  const [referralCode, setReferralCodeState] = useState<string | null>(() => {
    // Try to load from localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('referralCode');
    }
    return null;
  });
  
  // Favorites state
  const [favorites, setFavorites] = useState<number[]>(() => {
    // Try to load from localStorage
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        try {
          return JSON.parse(savedFavorites);
        } catch (e) {
          return [];
        }
      }
    }
    return [];
  });
  
  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Try to load from localStorage
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        try {
          return JSON.parse(savedCart);
        } catch (e) {
          console.error('Error parsing cart items from localStorage:', e);
          return [];
        }
      }
    }
    return [];
  });
  
  // Language setter with localStorage persistence
  const setLanguage = (newLanguage: SupportedLanguage) => {
    setLanguageState(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage);
    }
  };
  
  // Theme setter with localStorage persistence
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
      // Also update document classes for theme
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };
  
  // Referral code setter with localStorage persistence
  const setReferralCode = (code: string | null) => {
    setReferralCodeState(code);
    if (typeof window !== 'undefined') {
      if (code) {
        localStorage.setItem('referralCode', code);
      } else {
        localStorage.removeItem('referralCode');
      }
    }
  };
  
  // Favorites methods
  const addToFavorites = (productId: number) => {
    setFavorites(prev => {
      if (prev.includes(productId)) return prev;
      const newFavorites = [...prev, productId];
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
      }
      return newFavorites;
    });
  };
  
  const removeFromFavorites = (productId: number) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(id => id !== productId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
      }
      return newFavorites;
    });
  };
  
  const isFavorite = (productId: number) => {
    return favorites.includes(productId);
  };
  
  // Cart methods
  const addToCart = (product: Product, size?: string) => {
    setCartItems(prev => {
      // Проверяем, существует ли уже такой товар с таким размером
      const existingItemIndex = prev.findIndex(
        item => item.product.id === product.id && item.size === size
      );
      
      let newItems;
      if (existingItemIndex >= 0) {
        // Увеличиваем количество существующего товара
        newItems = [...prev];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1
        };
      } else {
        // Добавляем новый товар
        newItems = [...prev, { product, quantity: 1, size }];
      }
      
      // Сохраняем в localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cartItems', JSON.stringify(newItems));
      }
      
      return newItems;
    });
  };
  
  const removeFromCart = (productId: number) => {
    setCartItems(prev => {
      const newItems = prev.filter(item => item.product.id !== productId);
      
      // Сохраняем в localStorage
      if (typeof window !== 'undefined') {
        if (newItems.length === 0) {
          localStorage.removeItem('cartItems');
        } else {
          localStorage.setItem('cartItems', JSON.stringify(newItems));
        }
      }
      
      return newItems;
    });
  };
  
  const updateCartItemQuantity = (productId: number, quantity: number) => {
    setCartItems(prev => {
      const newItems = prev.map(item => 
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      );
      
      // Сохраняем в localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cartItems', JSON.stringify(newItems));
      }
      
      return newItems;
    });
  };
  
  const clearCart = () => {
    setCartItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cartItems');
    }
  };
  
  // Apply theme on initial load
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
  // Current translation based on language
  const t = translations[language];
  
  const value = {
    language,
    setLanguage,
    t,
    theme,
    setTheme,
    referralCode,
    setReferralCode,
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
  };
  
  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}