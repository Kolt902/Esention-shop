import React, { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useStore } from '@/lib/StoreContext';
import { Product } from '@shared/schema';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCartStore } from '@/lib/CartStore';
import { showNotification } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Heart, ShoppingCart } from 'lucide-react';

export default function ProductDetailPage() {
  const [, setLocation] = useLocation();
  const { language, t } = useStore();
  
  // Получаем ID продукта из URL-параметра
  const productRoute = useRoute<{ id: string }>("/product/:id");
  const productId = productRoute && productRoute[0] ? 
    (productRoute[1] as { id: string }).id : null;
  
  const { addToCart, removeFromCart, items: cartItems } = useCartStore();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  
  // Fetch product details
  const { data: product, isLoading, isError } = useQuery<Product>({
    queryKey: ['/api/products', productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }
      return response.json();
    },
    enabled: !!productId,
  });
  
  // Fetch related products
  const { data: relatedProducts = [] } = useQuery<Product[]>({
    queryKey: ['/api/products/related', productId],
    queryFn: async () => {
      if (!product) return [];
      const response = await fetch(`/api/products/related?category=${product.category}&exclude=${productId}`);
      if (!response.ok) {
        return [];
      }
      return response.json();
    },
    enabled: !!product,
  });
  
  // Check if product is already in cart
  const isInCart = cartItems.some(item => item.product.id === Number(productId));
  
  const handlePrevImage = () => {
    if (!product?.additionalImages) return;
    setSelectedImage(prev => 
      prev === 0 ? product.additionalImages!.length : prev - 1
    );
  };
  
  const handleNextImage = () => {
    if (!product?.additionalImages) return;
    setSelectedImage(prev => 
      prev === product.additionalImages!.length ? 0 : prev + 1
    );
  };
  
  const handleAddToCart = () => {
    if (!product) return;
    
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      showNotification(t.product.selectSize);
      return;
    }
    
    setIsAddingToCart(true);
    
    // Simulate network request
    setTimeout(() => {
      addToCart(product, selectedSize);
      showNotification(t.product.addedToCart);
      setIsAddingToCart(false);
    }, 500);
  };
  
  const toggleWishlist = () => {
    if (isInWishlist) {
      // Remove from wishlist logic
      setIsInWishlist(false);
      showNotification(t.product.removedFromFavorites);
    } else {
      // Add to wishlist logic
      setIsInWishlist(true);
      showNotification(t.product.addedToFavorites);
    }
  };
  
  const handleBack = () => {
    setLocation('/');
  };
  
  // Get current display image
  const currentImage = selectedImage === 0 
    ? product?.imageUrl 
    : product?.additionalImages?.[selectedImage - 1];
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-black border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
        <Footer 
          cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          onCartClick={() => setLocation('/?cart=open')}
          onHomeClick={() => setLocation('/')}
        />
      </div>
    );
  }
  
  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-grow flex items-center justify-center flex-col p-4">
          <p className="text-lg text-gray-700 mb-4">Товар не найден или произошла ошибка при загрузке.</p>
          <button 
            onClick={handleBack}
            className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-900 transition-colors"
          >
            Вернуться в каталог
          </button>
        </div>
        <Footer 
          cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          onCartClick={() => setLocation('/?cart=open')}
          onHomeClick={() => setLocation('/')}
        />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      {/* Discount Banner */}
      <div className="bg-black text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm md:text-base font-medium">
            🎉 В честь открытия магазина — скидка 10% на все товары до 1 июня 2025 года! 🎉
          </p>
        </div>
      </div>
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Back button */}
        <button 
          onClick={handleBack}
          className="flex items-center text-gray-700 hover:text-black mb-6"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          <span>Назад к каталогу</span>
        </button>
        
        {/* Product details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product images */}
          <div>
            <div className="relative bg-gray-100 aspect-square flex items-center justify-center overflow-hidden mb-4">
              {currentImage && (
                <img 
                  src={currentImage} 
                  alt={product.name} 
                  className="max-h-full max-w-full object-contain"
                />
              )}
              
              {/* Image navigation */}
              {product.additionalImages && product.additionalImages.length > 0 && (
                <>
                  <button 
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnail images */}
            {product.additionalImages && product.additionalImages.length > 0 && (
              <div className="flex space-x-2 overflow-x-auto">
                <div 
                  className={`w-20 h-20 border-2 flex-shrink-0 cursor-pointer ${selectedImage === 0 ? 'border-black' : 'border-gray-200'}`}
                  onClick={() => setSelectedImage(0)}
                >
                  <img 
                    src={product.imageUrl} 
                    alt={`${product.name} main`} 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                
                {product.additionalImages.map((imgUrl, idx) => (
                  <div 
                    key={idx}
                    className={`w-20 h-20 border-2 flex-shrink-0 cursor-pointer ${selectedImage === idx + 1 ? 'border-black' : 'border-gray-200'}`}
                    onClick={() => setSelectedImage(idx + 1)}
                  >
                    <img 
                      src={imgUrl} 
                      alt={`${product.name} view ${idx + 1}`} 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product info */}
          <div>
            <div className="mb-8">
              <div className="text-sm text-gray-500 mb-1">{product.brand}</div>
              <h1 className="text-2xl font-bold text-black mb-4">{product.name}</h1>
              
              <div className="mb-6">
                <div className="text-xl font-medium text-black">€{(product.price / 100).toFixed(2)}</div>
                <div className="text-sm text-green-600">-10% в честь открытия магазина</div>
                <div className="text-lg font-bold text-red-600">€{((product.price * 0.9) / 100).toFixed(2)}</div>
              </div>
              
              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-2">{t.product.sizes}</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-2 border ${
                          selectedSize === size 
                            ? 'border-black bg-black text-white' 
                            : 'border-gray-300 hover:border-gray-500'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Description */}
              <div className="mb-8">
                <h3 className="font-medium text-gray-800 mb-2">{t.product.description}</h3>
                <p className="text-gray-600">
                  {product.description || 'Нет описания для данного товара.'}
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="w-full bg-black text-white py-3 font-medium hover:bg-gray-900 transition-colors flex items-center justify-center"
                >
                  {isAddingToCart ? (
                    <span>{t.product.adding}...</span>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      <span>{isInCart ? 'Добавить еще' : t.product.addToCart}</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={toggleWishlist}
                  className="w-full border border-gray-300 py-3 font-medium hover:border-black transition-colors flex items-center justify-center"
                >
                  <Heart className={`h-5 w-5 mr-2 ${isInWishlist ? 'fill-red-500 stroke-red-500' : ''}`} />
                  <span>{isInWishlist ? 'Удалить из избранного' : 'Добавить в избранное'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-normal text-black mb-6 uppercase">{t.product.related}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.slice(0, 4).map(relProduct => (
                <div 
                  key={relProduct.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setLocation(`/product?id=${relProduct.id}`);
                    window.scrollTo(0, 0);
                  }}
                >
                  <div className="bg-gray-100 aspect-square flex items-center justify-center overflow-hidden mb-3">
                    <img 
                      src={relProduct.imageUrl} 
                      alt={relProduct.name} 
                      className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-sm text-gray-500">{relProduct.brand}</div>
                  <div className="font-medium">{relProduct.name}</div>
                  <div className="text-sm">€{(relProduct.price / 100).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <Footer 
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setLocation('/?cart=open')}
        onHomeClick={() => setLocation('/')}
      />
    </div>
  );
}