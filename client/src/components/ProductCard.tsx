import { useState, useEffect } from "react";
import { Heart, ShoppingCart } from "lucide-react";
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

  const handleBuy = () => {
    onAddToCart(product, selectedSize);
    showNotification(`${product.name} добавлен в корзину`);
  };

  return (
    <Card className="product-card overflow-hidden mb-4 transition-transform duration-200 active:scale-[0.98]">
      <div className="relative h-64 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white rounded-full p-1">
          <Heart className="h-5 w-5 text-gray-400 hover:text-[#0088CC] cursor-pointer" />
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-lg font-medium text-gray-800">{product.name}</h4>
            <p className="text-sm text-gray-500">{product.category}</p>
          </div>
          <div className="font-bold text-lg text-[#0088CC]">
            {formatPrice(product.price)}
          </div>
        </div>

        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-3 flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-500">
              <span>Размеры:</span>
              <div className="ml-2 flex space-x-1">
                {product.sizes.map((size) => (
                  <span
                    key={size}
                    className={cn(
                      "inline-block px-2 py-1 rounded border text-xs cursor-pointer",
                      selectedSize === size
                        ? "border-[#0088CC] bg-[#0088CC] text-white"
                        : "border-gray-300 text-gray-700"
                    )}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={handleBuy}
          className="mt-4 w-full bg-[#0088CC] hover:bg-[#006699] text-white py-2 px-4 rounded-md font-medium transition-colors"
        >
          Купить
        </Button>
      </CardContent>
    </Card>
  );
}
