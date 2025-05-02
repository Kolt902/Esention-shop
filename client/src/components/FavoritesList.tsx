import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Heart,
  ShoppingCart
} from "lucide-react";
import { useStore } from '@/lib/StoreContext';
import { useNavigate } from 'wouter';
import { useCartStore } from '@/lib/CartStore';
import { Product } from '@/types';
import { SelectSizeDialog } from './SelectSizeDialog';
import { useState } from 'react';

interface FavoritesListProps {
  products: Product[];
  isLoading: boolean;
}

export function FavoritesList({ products, isLoading }: FavoritesListProps) {
  const { t, removeFromFavorites } = useStore();
  const [, navigate] = useNavigate();
  const { addToCart } = useCartStore();
  
  // Состояние для диалога выбора размера
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sizeDialogOpen, setSizeDialogOpen] = useState(false);
  
  // Форматирование цены
  const formatPrice = (price: number) => {
    return `€${(price / 100).toFixed(2)}`;
  };
  
  // Обработчик нажатия на карточку товара
  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };
  
  // Обработчик удаления из избранного
  const handleRemoveFromFavorites = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    removeFromFavorites(productId);
  };
  
  // Обработчик добавления в корзину
  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (product.sizes && product.sizes.length > 0) {
      setSelectedProduct(product);
      setSizeDialogOpen(true);
    } else {
      addToCart(product);
    }
  };
  
  // Обработчик выбора размера
  const handleSizeSelected = (size: string) => {
    if (selectedProduct) {
      addToCart(selectedProduct, size);
      setSizeDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4 flex items-center justify-center h-32">
          <p>{t.loading}</p>
        </CardContent>
      </Card>
    );
  }

  if (!products?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t.profile.noFavorites}</CardTitle>
          <CardDescription>{t.profile.noFavoritesDescription}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => navigate('/')}
          >
            {t.profile.exploreCatalog}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <Card 
            key={product.id} 
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" 
            onClick={() => handleProductClick(product.id)}
          >
            <div className="relative h-36 bg-muted">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-product.svg';
                }}
              />
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute top-1 right-1 h-8 w-8 bg-background/80 text-destructive hover:bg-background/90 hover:text-destructive"
                onClick={(e) => handleRemoveFromFavorites(e, product.id)}
              >
                <Heart className="h-4 w-4 fill-current" />
              </Button>
            </div>
            
            <CardContent className="p-3">
              <p className="font-medium text-sm truncate">{product.name}</p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm font-semibold">{formatPrice(product.price)}</p>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 hover:bg-primary/20"
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selectedProduct && (
        <SelectSizeDialog
          open={sizeDialogOpen}
          onOpenChange={setSizeDialogOpen}
          product={selectedProduct}
          onSizeSelected={handleSizeSelected}
        />
      )}
    </>
  );
}