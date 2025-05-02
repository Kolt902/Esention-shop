import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage, Translation, translations, DEFAULT_LANGUAGE } from './translations';

type Theme = 'light' | 'dark';

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