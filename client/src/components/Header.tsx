import { X, User, ShoppingCart, Search, Menu, Heart, ChevronDown, Zap } from "lucide-react";
import { closeTelegramWebApp } from "@/lib/telegram";
import { Link } from "wouter";
import { useStore } from "@/lib/StoreContext";
import { useTranslation } from "@/lib/translations";
import { useState } from "react";

interface HeaderProps {
  title?: string;
}

export default function Header({ title = "FASHION HUB" }: HeaderProps) {
  const handleBackClick = () => {
    closeTelegramWebApp();
  };
  
  const { cartItems } = useStore();
  const { t } = useTranslation();
  const [showSearch, setShowSearch] = useState(false);
  const [showWomenMenu, setShowWomenMenu] = useState(false);
  const [showMenMenu, setShowMenMenu] = useState(false);
  
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      {/* Main header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center">
                <h1 className="text-black text-xl font-bold uppercase tracking-widest">Esention</h1>
              </a>
            </Link>
          </div>
          
          {/* Right side - Icons */}
          <div className="flex items-center space-x-4">
            {/* Search toggle */}
            <button 
              onClick={() => setShowSearch(!showSearch)} 
              className="text-black hover:text-gray-600"
            >
              <Search className="h-5 w-5" />
            </button>
            
            {/* Wishlist */}
            <Link href="/favorites">
              <a className="text-black hover:text-gray-600">
                <Heart className="h-5 w-5" />
              </a>
            </Link>
            
            {/* Profile */}
            <Link href="/profile">
              <a className="text-black hover:text-gray-600">
                <User className="h-5 w-5" />
              </a>
            </Link>
            
            {/* Cart */}
            <button 
              onClick={() => window.location.href = "/?cart=open"} 
              className="relative text-black hover:text-gray-600"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
            
            {/* Close Telegram app button */}
            <button 
              onClick={handleBackClick}
              aria-label="Close" 
              className="text-black hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Search bar - conditionally shown */}
        {showSearch && (
          <div className="border-t border-gray-200 py-4 px-4 bg-white shadow-md">
            <div className="container mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск брендов, товаров, категорий..."
                  className="w-full py-3 pl-10 pr-4 border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                <button 
                  onClick={() => setShowSearch(false)}
                  className="absolute right-3 top-3.5"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs font-medium text-gray-500">Трендовые поиски:</span>
                <button className="text-xs text-gray-700 hover:text-black hover:underline">Nike</button>
                <button className="text-xs text-gray-700 hover:text-black hover:underline">Adidas</button>
                <button className="text-xs text-gray-700 hover:text-black hover:underline">Кроссовки</button>
                <button className="text-xs text-gray-700 hover:text-black hover:underline">Streetwear</button>
                <button className="text-xs text-gray-700 hover:text-black hover:underline">Новинки</button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
