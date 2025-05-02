import { useState, useEffect } from "react";
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { cn, formatPrice, showNotification } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@shared/schema";
import { getTelegramWebApp, isRunningInTelegram } from "@/lib/telegram";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size?: string) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes.length > 0 ? product.sizes[0] : undefined
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Создаем массив всех изображений продукта
  console.log("Product data:", JSON.stringify(product, null, 2));
  
  const allImages = [
    product.imageUrl,
    ...(Array.isArray(product.additionalImages) ? product.additionalImages : [])
  ].filter(Boolean); // Удаляем пустые значения из массива
  
  console.log("All images array:", allImages);
  
  // Функции для переключения изображений
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };
  
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };
  
  // Use Telegram MainButton when viewing product details
  useEffect(() => {
    const telegramApp = getTelegramWebApp();
    
    // Clean up any previous listeners
    return () => {
      if (telegramApp && telegramApp.MainButton) {
        telegramApp.MainButton.offClick(handleBuy);
      }
    };
  }, [product.id, selectedSize]); // Re-run when product or size changes
  
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    showNotification(
      isFavorite 
        ? `${product.name} удален из избранного` 
        : `${product.name} добавлен в избранное`
    );
  };

  const handleBuy = () => {
    // Show adding animation
    setIsAdding(true);
    
    // Add to cart
    onAddToCart(product, selectedSize);
    
    // Show notification
    showNotification(`${product.name} добавлен в корзину`);
    
    // Reset state after animation
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  return (
    <Card className="product-card overflow-hidden mb-4 transition-transform duration-200 active:scale-[0.98]">
      <div className="relative h-64 overflow-hidden">
        {/* Отображаем текущее изображение */}
        <img
          src={allImages[currentImageIndex]}
          alt={`${product.name} - изображение ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
          loading="lazy"
        />
        
        {/* Кнопки навигации по изображениям - показываем только если есть несколько изображений */}
        {allImages.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-90 transition-all"
              aria-label="Предыдущее изображение"
            >
              <ChevronLeft className="h-6 w-6 text-gray-800" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-90 transition-all"
              aria-label="Следующее изображение"
            >
              <ChevronRight className="h-6 w-6 text-gray-800" />
            </button>
            
            {/* Индикатор текущего изображения */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {allImages.map((_, index) => (
                <span 
                  key={index}
                  className={`block h-1.5 rounded-full transition-all ${
                    currentImageIndex === index 
                      ? 'w-4 bg-white' 
                      : 'w-1.5 bg-white bg-opacity-60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Кнопка избранного */}
        <div 
          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm z-10"
          onClick={handleToggleFavorite}  
        >
          <Heart 
            className={cn(
              "h-5 w-5 cursor-pointer transition-colors duration-300",
              isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"
            )} 
          />
        </div>
        
        {/* Category badge */}
        <div className="absolute bottom-8 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded z-10">
          {product.category}
        </div>
        
        {/* Brand badge если есть */}
        {product.brand && (
          <div className="absolute bottom-2 right-2 bg-white bg-opacity-70 text-black text-xs px-2 py-1 rounded z-10 font-medium">
            {product.brand}
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-lg font-medium text-gray-800">{product.name}</h4>
            {product.description && (
              <p className="text-sm text-gray-500 mt-1">
                {product.description.length > 60 
                  ? `${product.description.substring(0, 60)}...` 
                  : product.description}
              </p>
            )}
          </div>
          <div className="font-bold text-lg text-[#0088CC]">
            {formatPrice(product.price)}
          </div>
        </div>

        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <span>Размеры:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {product.sizes.map((size) => (
                <span
                  key={size}
                  className={cn(
                    "inline-block px-2 py-1 rounded border text-xs cursor-pointer transition-colors",
                    selectedSize === size
                      ? "border-[#0088CC] bg-[#0088CC] text-white"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  )}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={handleBuy}
          disabled={isAdding}
          className={cn(
            "mt-4 w-full telegram-button py-2 px-4 rounded-md font-medium transition-all duration-300",
            isAdding ? "opacity-75" : "hover:brightness-95 active:scale-[0.98]"
          )}
        >
          {isAdding ? (
            <span className="flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 mr-2 animate-bounce" />
              Добавляем...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 mr-2" />
              В корзину
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
