import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CartModal from "@/components/CartModal";
import { showNotification } from "@/lib/utils";
import { addTelegramInitDataToRequest, getTelegramWebApp } from "@/lib/telegram";
import { Product } from "@shared/schema";

interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

export default function StorePage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Записываем в консоль для отладки, что компонент загружен
  useEffect(() => {
    console.log("StorePage mounted");
  }, []);

  // Fetch products
  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    staleTime: 60000, // 1 minute
    retry: 3, // Retry failed requests up to 3 times
    retryDelay: 1000, // Wait 1 second between retries
  });

  // Add to cart handler
  const handleAddToCart = (product: Product, size?: string) => {
    setCartItems((prevItems) => {
      // Check if item already exists with same product and size
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1,
        };
        return newItems;
      } else {
        // Add new item
        return [...prevItems, { product, quantity: 1, size }];
      }
    });
  };

  // Remove from cart handler
  const handleRemoveFromCart = (productId: number) => {
    setCartItems((prevItems) => 
      prevItems.filter((item) => item.product.id !== productId)
    );
  };

  // Checkout handler with Telegram integration
  const handleCheckout = () => {
    // In a real application, we would send the order to the backend
    // For now, we'll just show a notification
    
    try {
      const telegramApp = getTelegramWebApp();
      
      // Use Telegram MainButton if available
      if (telegramApp && telegramApp.MainButton) {
        // Save cart items to sessionStorage for persistence
        sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Show processing UI in Telegram
        telegramApp.MainButton.text = "Оформление заказа...";
        telegramApp.MainButton.show();
        telegramApp.MainButton.showProgress(true);
        
        // Simulate processing
        setTimeout(() => {
          telegramApp.MainButton.hideProgress();
          telegramApp.MainButton.hide();
          
          // Show success notification
          showNotification("Заказ успешно оформлен! Спасибо за покупку!");
          
          // Clear cart
          setCartItems([]);
          setIsCartOpen(false);
          
          // Clear sessionStorage
          sessionStorage.removeItem('cartItems');
        }, 1500);
      } else {
        // Fallback for non-Telegram environment
        showNotification("Заказ оформлен! Это демо-версия.");
        setCartItems([]);
        setIsCartOpen(false);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      showNotification("Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Welcome Banner */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-xl font-medium text-center text-gray-800">
            Добро пожаловать в магазин
          </h2>
          <p className="text-gray-600 text-center mt-2">
            Explore our latest collection
          </p>
        </div>

        {/* Products */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            New Arrivals
          </h3>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Загрузка...</span>
              </div>
              <p className="mt-4">Загрузка продуктов...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>Ошибка загрузки продуктов. Пожалуйста, попробуйте снова.</p>
              </div>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Обновить страницу
              </button>
            </div>
          ) : products && products.length > 0 ? (
            <div className="space-y-4">
              {products.map((product: Product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-yellow-50 border border-yellow-200 rounded p-4">
              <p className="text-yellow-700">Нет доступных продуктов</p>
            </div>
          )}
        </div>
      </main>

      <Footer
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onHomeClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
