import { useState, useEffect, MouseEvent } from "react";
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, ImageOff, TrendingUp } from "lucide-react";
import { cn, formatPrice, showNotification, isValidImageUrl, getCategoryDefaultImage } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Product } from "../lib/productDatabase";
import { getTelegramWebApp, isRunningInTelegram } from "@/lib/telegram";
import { getOfficialProductImages } from '@/lib/official-product-images';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size?: string) => void;
  onClick?: (productId: number) => void;
  asLink?: boolean;
}

export default function ProductCard({ product, onAddToCart, onClick, asLink = true }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Создаем массив всех изображений продукта с проверкой на валидность URL
  const validMainImage = isValidImageUrl(product.imageUrl) ? product.imageUrl : null;
  const validAdditionalImages = Array.isArray(product.additionalImages) 
    ? product.additionalImages.filter(url => isValidImageUrl(url)) 
    : [];
  
  // Массив для хранения всех изображений продукта
  let allImages: string[] = [];
  
  if (validMainImage) {
    allImages.push(validMainImage);
  }
  
  if (validAdditionalImages.length > 0) {
    allImages = [...allImages, ...validAdditionalImages];
  }
  
  // Если изображений не найдено в базе или их недостаточно, добавляем официальные из каталога
  if (allImages.length === 0) {
    const officialImages = getOfficialProductImages(product.name, product.category);
    allImages = [...officialImages];
  }

  const handleAddToCart = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      showNotification("Пожалуйста, выберите размер");
      return;
    }
    
    setIsAdding(true);
    onAddToCart(product, selectedSize);
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    showNotification(
      isFavorite ? "Удалено из избранного" : "Добавлено в избранное"
    );
  };

  const cardContent = (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:shadow-lg",
      asLink && "cursor-pointer"
    )}>
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {allImages.length > 0 ? (
          <img
            src={allImages[currentImageIndex]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getCategoryDefaultImage(product.category);
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageOff className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
          </div>
        )}

        {/* Кнопки навигации по изображениям */}
        {allImages.length > 1 && (
          <>
            <button
              className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 sm:p-1.5 opacity-0 transition-opacity duration-300 hover:bg-white group-hover:opacity-100 prevent-click"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentImageIndex((prev) =>
                  prev === 0 ? allImages.length - 1 : prev - 1
                );
              }}
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
            <button
              className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 sm:p-1.5 opacity-0 transition-opacity duration-300 hover:bg-white group-hover:opacity-100 prevent-click"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentImageIndex((prev) =>
                  prev === allImages.length - 1 ? 0 : prev + 1
                );
              }}
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </>
        )}

        {/* Кнопка избранного */}
        <div 
          className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-white rounded-full p-1 sm:p-1.5 shadow-md z-10 prevent-click"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleToggleFavorite();
          }}
        >
          <Heart 
            className={cn(
              "h-4 w-4 sm:h-5 sm:w-5 cursor-pointer transition-colors duration-300",
              isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"
            )} 
          />
        </div>
        
        {/* Brand badge */}
        {product.brand && (
          <div className="absolute top-2 left-2 z-20">
            <div className="bg-black text-white text-xs px-2 py-0.5 sm:px-3 sm:py-1 rounded-sm font-medium uppercase tracking-wider">
              {product.brand}
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-2 sm:p-4">
        <div className="flex flex-col">
          <h4 className="text-sm sm:text-base font-medium text-gray-900 tracking-tight line-clamp-1 mb-1">
            {product.name}
          </h4>
          
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs sm:text-sm text-gray-600">Последняя продажа</div>
            <div className="text-sm sm:text-base font-medium text-gray-900">{formatPrice(product.price)}</div>
          </div>
          
          {product.discount !== undefined && product.discount > 0 && (
            <div className="flex items-center gap-1 sm:gap-2 mb-2">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
              <span className="text-xs sm:text-sm font-medium text-green-500">+{product.discount}%</span>
            </div>
          )}

          <div className="mt-2 grid grid-cols-2 gap-1 sm:gap-2">
            <Button 
              variant="outline" 
              className="w-full text-xs sm:text-sm py-1 sm:py-2"
              onClick={(e) => handleAddToCart(e)}
              disabled={isAdding}
            >
              Купить
            </Button>
            <Button 
              variant="default"
              className="w-full bg-green-600 hover:bg-green-700 text-xs sm:text-sm py-1 sm:py-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Здесь можно добавить логику для продажи
              }}
            >
              Продать
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (asLink && onClick) {
    return (
      <div onClick={() => onClick(product.id)}>
        {cardContent}
      </div>
    );
  }

  return cardContent;
}
