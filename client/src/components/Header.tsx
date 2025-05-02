import { X, User, ShoppingCart, Search, Menu, Heart, ChevronDown, Zap } from "lucide-react";
import { closeTelegramWebApp } from "@/lib/telegram";
import { Link } from "wouter";
import { useStore } from "@/lib/StoreContext";
import { useTranslation } from "@/lib/translations";
import { useState, useEffect } from "react";

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
  const [isMobile, setIsMobile] = useState(true); // По умолчанию считаем, что это мобильное устройство
  
  useEffect(() => {
    // Проверяем наличие Telegram WebApp для определения мобильного окружения
    const isRunningInTelegram = window.Telegram && window.Telegram.WebApp;
    setIsMobile(true); // Всегда используем мобильный дизайн в Telegram WebApp
    
    // Принудительно устанавливаем мобильные стили
    document.documentElement.classList.add('mobile-view');
    
    return () => {
      document.documentElement.classList.remove('mobile-view');
    };
  }, []);
  
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      {/* Main header - mobile-first design */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-3 py-2 flex justify-between items-center">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center">
                <h1 className="text-black text-xl font-bold uppercase tracking-widest">
                  ESENTION
                </h1>
              </a>
            </Link>
          </div>
          
          {/* Right side - Search button with mobile styles in black */}
          <div className="flex items-center">
            <button 
              onClick={() => setShowSearch(!showSearch)} 
              className="flex items-center bg-gray-900 hover:bg-black px-3 py-1.5 rounded-lg shadow-sm transition-all"
              aria-label="Поиск"
            >
              <Search className="h-5 w-5 text-white" />
              <span className="font-medium text-sm text-white ml-1">Поиск</span>
            </button>
          </div>
        </div>
        
        {/* Search bar - conditionally shown with different styles for mobile */}
        {showSearch && (
          <div className={`border-t border-gray-200 ${isMobile ? 'py-3 px-2' : 'py-5 px-4'} bg-white shadow-md`}>
            <div className="container mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder={isMobile ? "Найти товары..." : "Поиск брендов, товаров, категорий..."}
                  className={`w-full ${isMobile ? 'py-3 pl-10 pr-10 text-sm border-gray-800 focus:ring-black focus:border-black rounded-lg' : 'py-4 pl-12 pr-12 text-base border-gray-300 focus:ring-black focus:border-black rounded-xl'} border bg-white focus:outline-none focus:ring-2`}
                />
                <Search className={`absolute ${isMobile ? 'left-3 top-3 h-5 w-5 text-gray-800' : 'left-4 top-4 h-6 w-6 text-gray-500'}`} />
                <button 
                  onClick={() => setShowSearch(false)}
                  className={`absolute ${isMobile ? 'right-3 top-3 bg-gray-100 hover:bg-gray-200' : 'right-4 top-4 bg-gray-100 hover:bg-gray-200'} rounded-full p-1 transition-colors`}
                >
                  <X className={`${isMobile ? 'h-4 w-4 text-gray-800' : 'h-4 w-4 text-gray-500'}`} />
                </button>
              </div>
              
              <div className={`${isMobile ? 'mt-2' : 'mt-4'} flex flex-wrap gap-2`}>
                {!isMobile && <span className="text-sm font-medium text-gray-600">Популярные запросы:</span>}
                {(isMobile ? ["Nike", "Jordan", "Stussy", "Gucci"] : ["Nike", "Stussy", "Jordan", "Gucci", "Balenciaga", "Street Style", "Old Money"]).map((item) => (
                  <button key={item} className={`text-sm ${isMobile ? 'text-white bg-black hover:bg-gray-800 px-2 py-1 text-xs' : 'text-gray-700 hover:text-black bg-gray-100 hover:bg-gray-200 px-3 py-1'} rounded-full transition-colors`}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
