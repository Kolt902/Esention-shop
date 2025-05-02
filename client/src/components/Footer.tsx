import { Home, ShoppingBag, MessageCircle, User, Heart } from "lucide-react";
import { openTelegramChat, isRunningInTelegram } from "@/lib/telegram";
import { useEffect, useState } from "react";

interface FooterProps {
  cartCount: number;
  onCartClick: () => void;
  onHomeClick: () => void;
}

export default function Footer({ cartCount, onCartClick, onHomeClick }: FooterProps) {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isTelegram, setIsTelegram] = useState(false);
  
  // Стили для кнопок меню
  const activeStyle = "text-[#0088CC] scale-110 font-bold";
  const inactiveStyle = "text-gray-500";
  
  // Detect if running in Telegram on mount
  useEffect(() => {
    setIsTelegram(isRunningInTelegram());
  }, []);
  
  const handleContactClick = () => {
    openTelegramChat();
  };
  
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    
    switch(tab) {
      case "home":
        onHomeClick();
        break;
      case "cart":
        onCartClick();
        break;
      case "contact":
        handleContactClick();
        break;
      case "profile":
        // In a real app, would implement profile page
        break;
      case "favorites":
        // In a real app, would implement favorites page
        break;
    }
  };
  
  // In Telegram, we might not need all the navigation items
  // as Telegram has its own navigation controls
  return (
    <footer className="bg-white bg-opacity-95 backdrop-blur-sm border-t border-gray-200 py-4 fixed bottom-0 left-0 right-0 shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => handleTabClick("home")}
            className={`flex flex-col items-center justify-center transition-all duration-200 ${
              activeTab === "home" ? activeStyle : inactiveStyle
            }`}
            aria-label="Home"
          >
            <Home className="h-6 w-6" />
            <span className="text-xs font-medium mt-1">Главная</span>
          </button>

          <button 
            onClick={() => handleTabClick("cart")}
            className={`flex flex-col items-center justify-center relative transition-colors duration-200 ${
              activeTab === "cart" 
                ? "text-[#0088CC] scale-110 font-bold" 
                : "text-gray-500"
            }`}
            aria-label="Cart"
          >
            <ShoppingBag className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
            <span className="text-xs font-medium mt-1">Корзина</span>
          </button>
          
          <button 
            onClick={() => handleTabClick("favorites")}
            className={`flex flex-col items-center justify-center transition-colors duration-200 ${
              activeTab === "favorites" 
                ? "text-[#0088CC] scale-110 font-bold" 
                : "text-gray-500"
            }`}
            aria-label="Favorites"
          >
            <Heart className="h-6 w-6" />
            <span className="text-xs font-medium mt-1">Избранное</span>
          </button>
          
          {/* Only show contact button if running in Telegram */}
          {isTelegram && (
            <button 
              onClick={() => handleTabClick("contact")}
              className={`flex flex-col items-center justify-center transition-colors duration-200 ${
                activeTab === "contact" 
                  ? "text-[#0088CC] scale-110 font-bold" 
                  : "text-gray-500"
              }`}
              aria-label="Contact us"
            >
              <MessageCircle className="h-6 w-6" />
              <span className="text-xs font-medium mt-1">Связаться</span>
            </button>
          )}

          {/* Only show profile in standalone mode, not in Telegram */}
          {!isTelegram && (
            <button 
              onClick={() => handleTabClick("profile")}
              className={`flex flex-col items-center justify-center transition-colors duration-200 ${
                activeTab === "profile" 
                  ? "text-[#0088CC] scale-110 font-bold" 
                  : "text-gray-500"
              }`}
              aria-label="Profile"
            >
              <User className="h-6 w-6" />
              <span className="text-xs font-medium mt-1">Профиль</span>
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
