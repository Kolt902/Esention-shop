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
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Determine if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Check initially
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      {/* Main header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center">
                <h1 className="text-black text-xl font-bold uppercase tracking-widest">
                  {isMobile ? "ESENTION" : "Esention"}
                </h1>
              </a>
            </Link>
          </div>
          
          {/* Right side - Search button only */}
          <div className="flex items-center">
            {/* Search toggle - different styles for mobile */}
            <button 
              onClick={() => setShowSearch(!showSearch)} 
              className={`flex items-center ${isMobile ? 'bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg shadow-sm' : 'gap-1 text-black bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full'} transition-all`}
            >
              <Search className={`${isMobile ? 'h-5 w-5 text-blue-500' : 'h-6 w-6'}`} />
              {!isMobile && <span className="font-medium text-sm">Поиск</span>}
              {isMobile && <span className="font-medium text-sm text-blue-700 ml-1">Поиск</span>}
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
                  className={`w-full ${isMobile ? 'py-3 pl-10 pr-10 text-sm border-blue-100 focus:ring-blue-500 focus:border-blue-500 rounded-lg' : 'py-4 pl-12 pr-12 text-base border-gray-300 focus:ring-black focus:border-black rounded-xl'} border bg-white focus:outline-none focus:ring-2`}
                />
                <Search className={`absolute ${isMobile ? 'left-3 top-3 h-5 w-5 text-blue-500' : 'left-4 top-4 h-6 w-6 text-gray-500'}`} />
                <button 
                  onClick={() => setShowSearch(false)}
                  className={`absolute ${isMobile ? 'right-3 top-3 bg-blue-50 hover:bg-blue-100' : 'right-4 top-4 bg-gray-100 hover:bg-gray-200'} rounded-full p-1 transition-colors`}
                >
                  <X className={`${isMobile ? 'h-4 w-4 text-blue-500' : 'h-4 w-4 text-gray-500'}`} />
                </button>
              </div>
              
              <div className={`${isMobile ? 'mt-2' : 'mt-4'} flex flex-wrap gap-2`}>
                {!isMobile && <span className="text-sm font-medium text-gray-600">Популярные запросы:</span>}
                {(isMobile ? ["Nike", "Jordan", "Stussy", "Gucci"] : ["Nike", "Stussy", "Jordan", "Gucci", "Balenciaga", "Street Style", "Old Money"]).map((item) => (
                  <button key={item} className={`text-sm ${isMobile ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 text-xs' : 'text-gray-700 hover:text-black bg-gray-100 hover:bg-gray-200 px-3 py-1'} rounded-full transition-colors`}>
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
