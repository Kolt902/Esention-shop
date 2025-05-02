import { X, User, ShoppingCart, Search, Menu, Heart, ChevronDown } from "lucide-react";
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
  const [showKidsMenu, setShowKidsMenu] = useState(false);
  
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      {/* Top notification bar - Farfetch style */}
      <div className="bg-gray-100 py-1.5 px-4 text-center text-xs font-medium text-gray-700">
        <span>Доставка по всей Европе • Бесплатный возврат в течение 28 дней • Официальная гарантия</span>
      </div>

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
          
          {/* Center - Navigation links on larger screens */}
          <nav className="hidden md:flex space-x-8">
            {/* Women's dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowWomenMenu(!showWomenMenu);
                  setShowMenMenu(false);
                  setShowKidsMenu(false);
                }}
                className="flex items-center space-x-1 font-medium text-black hover:text-gray-600 transition-colors uppercase text-sm"
              >
                <span>Женщинам</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {showWomenMenu && (
                <div className="absolute top-full left-0 w-64 bg-white shadow-lg p-4 grid grid-cols-1 gap-2">
                  <Link href="/?category=tshirts&gender=women">
                    <a className="py-2 text-sm text-gray-800 hover:text-black hover:underline">Футболки и топы</a>
                  </Link>
                  <Link href="/?category=hoodies&gender=women">
                    <a className="py-2 text-sm text-gray-800 hover:text-black hover:underline">Кофты и свитера</a>
                  </Link>
                  <Link href="/?category=pants&gender=women">
                    <a className="py-2 text-sm text-gray-800 hover:text-black hover:underline">Брюки и юбки</a>
                  </Link>
                  <Link href="/?category=sneakers&gender=women">
                    <a className="py-2 text-sm text-gray-800 hover:text-black hover:underline">Обувь</a>
                  </Link>
                  <Link href="/?category=accessories&gender=women">
                    <a className="py-2 text-sm text-gray-800 hover:text-black hover:underline">Аксессуары</a>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Men's dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowMenMenu(!showMenMenu);
                  setShowWomenMenu(false);
                  setShowKidsMenu(false);
                }}
                className="flex items-center space-x-1 font-medium text-black hover:text-gray-600 transition-colors uppercase text-sm"
              >
                <span>Мужчинам</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {showMenMenu && (
                <div className="absolute top-full left-0 w-64 bg-white shadow-lg p-4 grid grid-cols-1 gap-2">
                  <Link href="/?category=tshirts&gender=men">
                    <a className="py-2 text-sm text-gray-800 hover:text-black hover:underline">Футболки</a>
                  </Link>
                  <Link href="/?category=hoodies&gender=men">
                    <a className="py-2 text-sm text-gray-800 hover:text-black hover:underline">Толстовки и худи</a>
                  </Link>
                  <Link href="/?category=pants&gender=men">
                    <a className="py-2 text-sm text-gray-800 hover:text-black hover:underline">Брюки и шорты</a>
                  </Link>
                  <Link href="/?category=sneakers&gender=men">
                    <a className="py-2 text-sm text-gray-800 hover:text-black hover:underline">Обувь</a>
                  </Link>
                  <Link href="/?category=accessories&gender=men">
                    <a className="py-2 text-sm text-gray-800 hover:text-black hover:underline">Аксессуары</a>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Kids dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowKidsMenu(!showKidsMenu);
                  setShowWomenMenu(false);
                  setShowMenMenu(false);
                }}
                className="flex items-center space-x-1 font-medium text-black hover:text-gray-600 transition-colors uppercase text-sm"
              >
                <span>Детям</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {showKidsMenu && (
                <div className="absolute top-full left-0 w-64 bg-white shadow-lg p-4 grid grid-cols-1 gap-2">
                  <Link href="/?category=tshirts&gender=kids">
                    <a className="py-2 text-sm text-gray-800 hover:text-black hover:underline">Футболки и топы</a>
                  </Link>
                  <Link href="/?category=hoodies&gender=kids">
                    <a className="py-2 text-sm text-gray-800 hover:text-black hover:underline">Кофты и толстовки</a>
                  </Link>
                  <Link href="/?category=pants&gender=kids">
                    <a className="py-2 text-sm text-gray-800 hover:text-black hover:underline">Брюки и шорты</a>
                  </Link>
                  <Link href="/?category=sneakers&gender=kids">
                    <a className="py-2 text-sm text-gray-800 hover:text-black hover:underline">Обувь</a>
                  </Link>
                  <Link href="/?category=accessories&gender=kids">
                    <a className="py-2 text-sm text-gray-800 hover:text-black hover:underline">Аксессуары</a>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Designer link */}
            <Link href="/?designer=true">
              <a className="font-medium text-black hover:text-gray-600 transition-colors uppercase text-sm">Дизайнеры</a>
            </Link>
            
            {/* Sale link */}
            <Link href="/?sale=true">
              <a className="font-medium text-red-600 hover:text-red-800 transition-colors uppercase text-sm">Распродажа</a>
            </Link>
          </nav>
          
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
                <span className="text-xs font-medium text-gray-500">Популярные запросы:</span>
                <button className="text-xs text-gray-700 hover:text-black hover:underline">Nike</button>
                <button className="text-xs text-gray-700 hover:text-black hover:underline">Adidas</button>
                <button className="text-xs text-gray-700 hover:text-black hover:underline">Кроссовки</button>
                <button className="text-xs text-gray-700 hover:text-black hover:underline">Куртки</button>
                <button className="text-xs text-gray-700 hover:text-black hover:underline">Новинки</button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
