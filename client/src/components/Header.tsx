import { X, User, ShoppingCart } from "lucide-react";
import { closeTelegramWebApp } from "@/lib/telegram";
import { Link } from "wouter";
import { useStore } from "@/lib/StoreContext";
import { useTranslation } from "@/lib/translations";

interface HeaderProps {
  title?: string;
}

export default function Header({ title = "Clothing Store" }: HeaderProps) {
  const handleBackClick = () => {
    closeTelegramWebApp();
  };
  
  const { cartItems } = useStore();
  const { t } = useTranslation();
  
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-10 bg-[#0088CC] shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-white text-xl font-medium">{title}</h1>
        <div className="flex items-center space-x-4">
          {/* Профиль */}
          <Link href="/profile">
            <a className="flex items-center text-white font-medium hover:text-blue-100 transition-colors">
              <User className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">{t.profile.title}</span>
            </a>
          </Link>
          
          {/* Корзина с счетчиком */}
          <button 
            onClick={() => window.location.href = "/?cart=open"} 
            className="relative text-white"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>
          
          {/* Кнопка закрыть */}
          <button 
            onClick={handleBackClick}
            aria-label="Close" 
            className="text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
