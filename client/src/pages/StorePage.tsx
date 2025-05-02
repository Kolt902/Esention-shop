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

  // Инициализация компонента и восстановление корзины
  useEffect(() => {
    console.log("StorePage mounted");
    
    // Восстановление корзины из sessionStorage
    try {
      const savedCart = sessionStorage.getItem('cartItems');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          setCartItems(parsedCart);
          console.log("Корзина восстановлена из sessionStorage", parsedCart);
        }
      }
    } catch (error) {
      console.error("Ошибка при восстановлении корзины:", error);
    }
  }, []);
  
  // Сохранение корзины при ее изменении
  useEffect(() => {
    if (cartItems.length > 0) {
      try {
        sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
      } catch (error) {
        console.error("Ошибка при сохранении корзины:", error);
      }
    }
  }, [cartItems]);

  // Fetch products
  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    staleTime: 60000, // 1 minute
    retry: 3, // Retry failed requests up to 3 times
    retryDelay: 1000, // Wait 1 second between retries
  });

  // Add to cart handler
  const handleAddToCart = async (product: Product, size?: string) => {
    try {
      // Оптимистическое обновление UI
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

      console.log("Добавляем товар в корзину:", product.id, size);
      
      // Сохраняем в sessionStorage
      const savedCart = sessionStorage.getItem('cartItems');
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
      const updatedCart = [...parsedCart, { product, quantity: 1, size }];
      sessionStorage.setItem('cartItems', JSON.stringify(updatedCart));
      
    } catch (error) {
      console.error("Ошибка при добавлении товара в корзину:", error);
      showNotification("Не удалось добавить товар в корзину. Попробуйте еще раз.");
    }
  };

  // Remove from cart handler
  const handleRemoveFromCart = (productId: number) => {
    try {
      // Оптимистическое обновление UI
      setCartItems((prevItems) => 
        prevItems.filter((item) => item.product.id !== productId)
      );
      
      // Обновление в sessionStorage
      const savedCart = sessionStorage.getItem('cartItems');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        const updatedCart = parsedCart.filter((item: CartItem) => item.product.id !== productId);
        sessionStorage.setItem('cartItems', JSON.stringify(updatedCart));
      }
      
      console.log("Товар удален из корзины:", productId);
    } catch (error) {
      console.error("Ошибка при удалении товара из корзины:", error);
      showNotification("Не удалось удалить товар из корзины");
    }
  };
  
  // Update quantity handler
  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    try {
      // Оптимистическое обновление UI
      setCartItems((prevItems) => 
        prevItems.map((item) => 
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      
      // Обновление в sessionStorage
      const savedCart = sessionStorage.getItem('cartItems');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        const updatedCart = parsedCart.map((item: CartItem) => 
          item.product.id === productId 
            ? { ...item, quantity: newQuantity } 
            : item
        );
        sessionStorage.setItem('cartItems', JSON.stringify(updatedCart));
      }
      
      console.log("Количество обновлено:", productId, newQuantity);
    } catch (error) {
      console.error("Ошибка при обновлении количества:", error);
      showNotification("Не удалось обновить количество товара в корзине");
    }
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
    <div className="min-h-screen flex flex-col store-background">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Welcome Banner */}
        <div className="welcome-banner p-6 mb-8">
          <h2 className="text-2xl font-bold text-center text-white drop-shadow-md">
            Добро пожаловать в магазин
          </h2>
          <p className="text-white text-center mt-2 font-medium drop-shadow-sm">
            Explore our latest collection
          </p>
        </div>

        {/* Products */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 bg-white px-4 py-2 rounded-lg shadow-sm">
              New Arrivals
            </h3>
            <div className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm">
              {products?.length || 0} Products
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-[#0088CC] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Загрузка...</span>
              </div>
              <p className="mt-4 font-medium text-gray-700">Загрузка продуктов...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm">
              <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-4 max-w-md mx-auto">
                <p className="font-medium">Ошибка загрузки продуктов. Пожалуйста, попробуйте снова.</p>
              </div>
              <button 
                onClick={() => window.location.reload()} 
                className="telegram-button py-2 px-6 rounded-md font-medium">
                Обновить страницу
              </button>
            </div>
          ) : products && products.length > 0 ? (
            <div className="space-y-5">
              {products.map((product: Product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm">
              <p className="text-gray-700 font-medium">Нет доступных продуктов</p>
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
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
