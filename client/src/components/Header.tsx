import { X } from "lucide-react";
import { closeTelegramWebApp } from "@/lib/telegram";

interface HeaderProps {
  title?: string;
}

export default function Header({ title = "Clothing Store" }: HeaderProps) {
  const handleBackClick = () => {
    closeTelegramWebApp();
  };

  return (
    <header className="sticky top-0 z-10 bg-[#0088CC] shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-white text-xl font-medium">{title}</h1>
        <button 
          onClick={handleBackClick}
          aria-label="Close" 
          className="text-white"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}
