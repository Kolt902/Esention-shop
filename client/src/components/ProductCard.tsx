import { useState, useEffect } from "react";
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { cn, formatPrice, showNotification, isValidImageUrl, getCategoryDefaultImage } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@shared/schema";
import { getTelegramWebApp, isRunningInTelegram } from "@/lib/telegram";
import { getOfficialProductImages } from '@/lib/official-product-images';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size?: string) => void;
  onClick?: (productId: number) => void;
}

export default function ProductCard({ product, onAddToCart, onClick }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes.length > 0 ? product.sizes[0] : undefined
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Сохраняем отладочную информацию
  console.log("Product data:", JSON.stringify(product, null, 2));
  
  // Создаем массив всех изображений продукта с проверкой на валидность URL
  const validMainImage = isValidImageUrl(product.imageUrl) ? product.imageUrl : null;
  const validAdditionalImages = Array.isArray(product.additionalImages) 
    ? product.additionalImages.filter(url => isValidImageUrl(url)) 
    : [];
  
  // Массив для хранения всех изображений продукта
  let allImages: string[] = [];
  
  // Сначала пробуем использовать изображения из базы, если они есть и валидны
  if (validMainImage) {
    allImages.push(validMainImage);
  }
  
  if (validAdditionalImages.length > 0) {
    allImages = [...allImages, ...validAdditionalImages];
  }
  
  // Если изображений не найдено в базе или их недостаточно, добавляем официальные из каталога
  if (allImages.length === 0) {
    // Получаем официальные изображения с сайтов Nike и Adidas по имени продукта и категории
    const officialImages = getOfficialProductImages(product.name, product.category);
    allImages = [...officialImages];
  }
  
  // Получаем дефолтное изображение на случай ошибки
  const backupImages = getOfficialProductImages(product.name, product.category);
  const defaultImage = backupImages[0] || getCategoryDefaultImage(product.category);
  
  console.log("Validated images array:", allImages);
  
  // Состояние для отслеживания ошибок загрузки изображений
  const [imageError, setImageError] = useState(false);
  
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

  const handleCardClick = () => {
    if (onClick) {
      onClick(product.id);
    }
  };

  return (
    <Card 
      className="product-card relative overflow-hidden mb-4 transition-all duration-300 active:scale-[0.98] shadow-md rounded-xl border-0 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Top badges for sales, new arrivals, etc */}
      {product.isNew && (
        <div className="absolute top-0 left-0 z-20 bg-black text-white text-xs font-medium px-2.5 py-1 m-2 rounded">
          NEW
        </div>
      )}
      
      {product.discount > 0 && (
        <div className="absolute top-0 right-0 z-20 bg-red-600 text-white text-xs font-medium px-2.5 py-1 m-2 rounded">
          -{product.discount}%
        </div>
      )}
    
      <div className="relative h-72 sm:h-80 overflow-hidden rounded-t-xl">
        {/* Отображаем текущее изображение с обработкой ошибок */}
        {imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
            <ImageOff className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Изображение недоступно</p>
          </div>
        ) : (
          <img
            src={allImages[currentImageIndex] || defaultImage}
            alt={`${product.name} - изображение ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
            loading="lazy"
            onError={(e) => {
              console.error(`Ошибка загрузки изображения: ${allImages[currentImageIndex]}`);
              
              // Пробуем показать дефолтное изображение вместо ошибки
              if (e.currentTarget.src !== defaultImage) {
                console.log('Пробуем использовать резервное изображение');
                e.currentTarget.src = defaultImage;
              } else {
                setImageError(true);
              }
            }}
          />
        )}
        
        {/* Elegant black gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70"></div>
        
        {/* Кнопки навигации по изображениям - показываем только если есть несколько изображений */}
        {allImages.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1.5 hover:bg-opacity-90 transition-all shadow-sm"
              aria-label="Предыдущее изображение"
            >
              <ChevronLeft className="h-5 w-5 text-gray-800" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1.5 hover:bg-opacity-90 transition-all shadow-sm"
              aria-label="Следующее изображение"
            >
              <ChevronRight className="h-5 w-5 text-gray-800" />
            </button>
            
            {/* Индикатор текущего изображения */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
              {allImages.map((_, index) => (
                <span 
                  key={index}
                  className={`block h-1.5 rounded-full transition-all ${
                    currentImageIndex === index 
                      ? 'w-5 bg-white' 
                      : 'w-1.5 bg-white bg-opacity-60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Кнопка избранного */}
        <div 
          className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md z-10"
          onClick={handleToggleFavorite}  
        >
          <Heart 
            className={cn(
              "h-5 w-5 cursor-pointer transition-colors duration-300",
              isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"
            )} 
          />
        </div>
        
        {/* Brand badge */}
        {product.brand && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-white bg-opacity-90 text-black text-xs px-3 py-1 rounded-full font-medium">
              {product.brand}
            </div>
          </div>
        )}
        
        {/* Рейтинг продукта если есть */}
        {product.rating > 0 && (
          <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded-md flex items-center z-10">
            <svg className="w-3 h-3 text-yellow-300 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
            </svg>
            <span>{(product.rating/10).toFixed(1)}</span>
          </div>
        )}
      </div>

      <CardContent className="p-5">
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-lg font-semibold text-gray-800 tracking-tight line-clamp-1">{product.name}</h4>
            <div className="font-bold text-lg text-black pl-2">
              {formatPrice(product.price)}
            </div>
          </div>
          
          {product.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {product.description}
            </p>
          )}
          
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="inline-flex items-center bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
              {product.category}
            </span>
            
            {product.inStock ? (
              <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                В наличии
              </span>
            ) : (
              <span className="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                Нет в наличии
              </span>
            )}
          </div>
        </div>

        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <span>Размеры:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((size) => (
                <span
                  key={size}
                  className={cn(
                    "inline-block px-3 py-1.5 rounded-full border text-xs cursor-pointer transition-colors",
                    selectedSize === size
                      ? "border-black bg-black text-white"
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
            "mt-4 w-full telegram-button py-3 px-4 rounded-full font-medium transition-all duration-300 bg-black hover:bg-gray-900 text-white",
            isAdding ? "opacity-75" : "hover:shadow-md active:scale-[0.98]"
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
