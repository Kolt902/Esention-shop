import { Home, ShoppingBag, MessageCircle, User, Heart, ShieldCheck } from "lucide-react";
import { openTelegramChat, isRunningInTelegram, getCurrentUser } from "@/lib/telegram";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/queryClient";

interface FooterProps {
  cartCount: number;
  onCartClick: () => void;
  onHomeClick: () => void;
}

export default function Footer({ cartCount, onCartClick, onHomeClick }: FooterProps) {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isTelegram, setIsTelegram] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Стили для кнопок меню
  const activeStyle = "text-[#0088CC] scale-110 font-bold transition-transform";
  const inactiveStyle = "text-gray-500 hover:text-gray-700 hover:scale-105";
  
  // Вспомогательный компонент для индикатора активной вкладки
  const ActiveIndicator = () => (
    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-1.5 bg-[#0088CC] rounded-b-lg shadow-sm animate-pulse"></div>
  );
  
  // Detect if running in Telegram on mount
  useEffect(() => {
    setIsTelegram(isRunningInTelegram());
    
    // Проверка прав администратора
    const checkAdminStatus = async () => {
      try {
        const response = await apiRequest("/api/admin/check", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });
        
        if (response && response.isAdmin) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Failed to check admin status:", error);
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, []);
  
  const handleContactClick = () => {
    openTelegramChat();
  };
  
  const handleAdminClick = () => {
    window.location.href = "/admin";
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
    <footer className="bg-white bg-opacity-95 backdrop-blur-md border-t border-gray-200 py-3 fixed bottom-0 left-0 right-0 shadow-lg z-50 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => handleTabClick("home")}
            className={`flex flex-col items-center justify-center transition-all duration-200 relative ${
              activeTab === "home" ? activeStyle : inactiveStyle
            }`}
            aria-label="Home"
          >
            {activeTab === "home" && <ActiveIndicator />}
            <Home className="h-6 w-6" />
            <span className="text-xs font-medium mt-1">Главная</span>
          </button>

          <button 
            onClick={() => handleTabClick("cart")}
            className={`flex flex-col items-center justify-center relative transition-all duration-200 ${
              activeTab === "cart" ? activeStyle : inactiveStyle
            }`}
            aria-label="Cart"
          >
            {activeTab === "cart" && <ActiveIndicator />}
            <ShoppingBag className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm animate-pulse">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
            <span className="text-xs font-medium mt-1">Корзина</span>
          </button>
          
          <button 
            onClick={() => handleTabClick("favorites")}
            className={`flex flex-col items-center justify-center transition-all duration-200 relative ${
              activeTab === "favorites" ? activeStyle : inactiveStyle
            }`}
            aria-label="Favorites"
          >
            {activeTab === "favorites" && <ActiveIndicator />}
            <Heart className="h-6 w-6" />
            <span className="text-xs font-medium mt-1">Избранное</span>
          </button>
          
          {/* Only show contact button if running in Telegram */}
          {isTelegram && (
            <button 
              onClick={() => handleTabClick("contact")}
              className={`flex flex-col items-center justify-center transition-all duration-200 relative ${
                activeTab === "contact" ? activeStyle : inactiveStyle
              }`}
              aria-label="Contact us"
            >
              {activeTab === "contact" && <ActiveIndicator />}
              <MessageCircle className="h-6 w-6" />
              <span className="text-xs font-medium mt-1">Связаться</span>
            </button>
          )}

          {/* Only show profile in standalone mode, not in Telegram */}
          {!isTelegram && (
            <button 
              onClick={() => handleTabClick("profile")}
              className={`flex flex-col items-center justify-center transition-all duration-200 relative ${
                activeTab === "profile" ? activeStyle : inactiveStyle
              }`}
              aria-label="Profile"
            >
              {activeTab === "profile" && <ActiveIndicator />}
              <User className="h-6 w-6" />
              <span className="text-xs font-medium mt-1">Профиль</span>
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
