import { Home, ShoppingBag, MessageCircle, User } from "lucide-react";
import { openTelegramChat } from "@/lib/telegram";

interface FooterProps {
  cartCount: number;
  onCartClick: () => void;
  onHomeClick: () => void;
}

export default function Footer({ cartCount, onCartClick, onHomeClick }: FooterProps) {
  const handleContactClick = () => {
    openTelegramChat();
  };

  return (
    <footer className="bg-white border-t border-gray-200 py-4 sticky bottom-0">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <button 
            onClick={onHomeClick}
            className="flex flex-col items-center justify-center text-[#0088CC]"
          >
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Главная</span>
          </button>

          <button 
            onClick={onCartClick}
            className="flex flex-col items-center justify-center text-gray-500 relative"
          >
            <ShoppingBag className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
            <span className="text-xs mt-1">Корзина</span>
          </button>

          <button 
            onClick={handleContactClick}
            className="flex flex-col items-center justify-center text-gray-500"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="text-xs mt-1">Связаться</span>
          </button>

          <button className="flex flex-col items-center justify-center text-gray-500">
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Профиль</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
