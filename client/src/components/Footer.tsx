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
    <footer className="bg-white border-t border-gray-200 py-3 sticky bottom-0 shadow-sm z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => handleTabClick("home")}
            className={`flex flex-col items-center justify-center transition-colors duration-200 ${activeTab === "home" ? "text-[#0088CC]" : "text-gray-500"}`}
            aria-label="Home"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Главная</span>
          </button>

          <button 
            onClick={() => handleTabClick("cart")}
            className={`flex flex-col items-center justify-center relative transition-colors duration-200 ${activeTab === "cart" ? "text-[#0088CC]" : "text-gray-500"}`}
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
            <span className="text-xs mt-1">Корзина</span>
          </button>
          
          <button 
            onClick={() => handleTabClick("favorites")}
            className={`flex flex-col items-center justify-center transition-colors duration-200 ${activeTab === "favorites" ? "text-[#0088CC]" : "text-gray-500"}`}
            aria-label="Favorites"
          >
            <Heart className="h-5 w-5" />
            <span className="text-xs mt-1">Избранное</span>
          </button>
          
          {/* Only show contact button if running in Telegram */}
          {isTelegram && (
            <button 
              onClick={() => handleTabClick("contact")}
              className={`flex flex-col items-center justify-center transition-colors duration-200 ${activeTab === "contact" ? "text-[#0088CC]" : "text-gray-500"}`}
              aria-label="Contact us"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-xs mt-1">Связаться</span>
            </button>
          )}

          {/* Only show profile in standalone mode, not in Telegram */}
          {!isTelegram && (
            <button 
              onClick={() => handleTabClick("profile")}
              className={`flex flex-col items-center justify-center transition-colors duration-200 ${activeTab === "profile" ? "text-[#0088CC]" : "text-gray-500"}`}
              aria-label="Profile"
            >
              <User className="h-5 w-5" />
              <span className="text-xs mt-1">Профиль</span>
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
