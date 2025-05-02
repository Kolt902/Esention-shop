import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CartModal from "@/components/CartModal";
import { showNotification } from "@/lib/utils";
import { addTelegramInitDataToRequest, getTelegramWebApp } from "@/lib/telegram";
import { Product } from "@shared/schema";
import { Filter, ChevronDown, X } from "lucide-react";

interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

export default function StorePage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Состояние для фильтрации
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Получение списка категорий и брендов
  const { data: filterData } = useQuery<{categories: string[], brands: string[]}>({
    queryKey: ['/api/categories'],
    staleTime: 300000, // 5 minutes
  });

  // Инициализация компонента и восстановление корзины
  useEffect(() => {
    console.log("StorePage mounted");
    
    // Восстановление корзины из localStorage (для постоянного хранения)
    try {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          setCartItems(parsedCart);
          console.log("Корзина восстановлена из localStorage", parsedCart);
        }
      } else {
        // Поиск в sessionStorage как запасной вариант (обратная совместимость)
        const sessionCart = sessionStorage.getItem('cartItems');
        if (sessionCart) {
          const parsedSessionCart = JSON.parse(sessionCart);
          if (Array.isArray(parsedSessionCart) && parsedSessionCart.length > 0) {
            setCartItems(parsedSessionCart);
            // Перенос данных из sessionStorage в localStorage
            localStorage.setItem('cartItems', sessionCart);
            console.log("Корзина восстановлена из sessionStorage и перенесена в localStorage", parsedSessionCart);
          }
        }
      }
    } catch (error) {
      console.error("Ошибка при восстановлении корзины:", error);
    }
  }, []);
  
  // Сохранение корзины при ее изменении
  useEffect(() => {
    try {
      // Сохранение в localStorage для постоянного хранения
      if (cartItems.length > 0) {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      } else {
        // Если корзина пуста, удаляем данные
        localStorage.removeItem('cartItems');
      }
      
      // Дублируем в sessionStorage для обратной совместимости
      if (cartItems.length > 0) {
        sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
      } else {
        sessionStorage.removeItem('cartItems');
      }
    } catch (error) {
      console.error("Ошибка при сохранении корзины:", error);
    }
  }, [cartItems]);

  // Построение URL с параметрами фильтров
  const buildProductsUrl = () => {
    const baseUrl = '/api/products';
    const params = new URLSearchParams();
    
    if (selectedCategory) {
      params.append('category', selectedCategory);
    }
    
    if (selectedBrand) {
      params.append('brand', selectedBrand);
    }
    
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };
  
  // Fetch products with filters
  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products', selectedCategory, selectedBrand],
    queryFn: async () => {
      const response = await fetch(buildProductsUrl());
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    },
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
      
      // Обработку хранилища автоматически выполняют эффекты
      
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
      
      // Обработку хранилища автоматически выполняют эффекты
      
      console.log("Количество обновлено:", productId, newQuantity);
    } catch (error) {
      console.error("Ошибка при обновлении количества:", error);
      showNotification("Не удалось обновить количество товара в корзине");
    }
  };
  
  // Обработчики для фильтрации
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    // Если категория изменилась, включаем фильтр
    setIsFilterOpen(true);
  };
  
  const handleBrandChange = (brand: string | null) => {
    setSelectedBrand(brand);
    // Если бренд изменился, включаем фильтр
    setIsFilterOpen(true);
  };
  
  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
  };
  
  // Преобразование категорий и брендов для отображения
  const getCategoryDisplayName = (category: string): string => {
    const categoryMap: Record<string, string> = {
      'lifestyle': 'Повседневная',
      'running': 'Беговая обувь',
      'basketball': 'Баскетбольная обувь',
      'tshirts': 'Футболки',
      'hoodies': 'Кофты',
      'pants': 'Штаны',
      'jackets': 'Куртки',
      'accessories': 'Аксессуары',
      'sneakers': 'Кроссовки',
      'shoes': 'Обувь',
      'tops': 'Верхняя одежда',
      'bottoms': 'Нижняя одежда'
    };
    return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Checkout handler with Telegram integration
  const handleCheckout = () => {
    // In a real application, we would send the order to the backend
    // For now, we'll just show a notification
    
    try {
      const telegramApp = getTelegramWebApp();
      
      // Use Telegram MainButton if available
      if (telegramApp && telegramApp.MainButton) {
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
          
          // Clear all storage
          localStorage.removeItem('cartItems');
          sessionStorage.removeItem('cartItems');
        }, 1500);
      } else {
        // Fallback for non-Telegram environment
        showNotification("Заказ оформлен! Это демо-версия.");
        setCartItems([]);
        setIsCartOpen(false);
        
        // Clear all storage
        localStorage.removeItem('cartItems');
        sessionStorage.removeItem('cartItems');
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      showNotification("Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col store-background">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 pb-20">
        {/* Добавлен нижний отступ pb-20 для области футера */}
        {/* Welcome Banner */}
        <div className="welcome-banner p-6 mb-4">
          <h2 className="text-2xl font-bold text-center text-white drop-shadow-md">
            Добро пожаловать в магазин
          </h2>
          <p className="text-white text-center mt-2 font-medium drop-shadow-sm">
            Explore our latest collection
          </p>
        </div>
        
        {/* Category Menu */}
        <div className="overflow-x-auto mb-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-4">
          <h4 className="text-base font-semibold text-gray-800 mb-3 pl-2">Категории</h4>
          <div className="flex space-x-3 py-1 px-1 min-w-full">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`whitespace-nowrap px-5 py-2 rounded-full font-medium text-sm transition-all flex items-center ${
                selectedCategory === null 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Все категории
            </button>
            
            {filterData?.categories.map(category => {
              // Выбираем подходящую иконку в зависимости от категории
              let icon;
              switch(category) {
                case 'tshirts':
                  icon = (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 2L2 8l2 2m0 0l4 12h12l4-12-4-4M4 10h16M2 8l6-6h8l6 6" />
                    </svg>
                  );
                  break;
                case 'hoodies':
                  icon = (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7l-5-5H8L3 7z M8 2v5 M16 2v5" />
                    </svg>
                  );
                  break;
                case 'shoes':
                case 'sneakers':
                case 'running':
                case 'basketball':
                  icon = (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l-4-4m0 0l-8 8V4h8l4 4m-4-4v16" />
                    </svg>
                  );
                  break;
                default:
                  icon = (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  );
              }
              
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap px-5 py-2 rounded-full font-medium text-sm transition-all flex items-center ${
                    selectedCategory === category 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {icon}
                  {getCategoryDisplayName(category)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products with filter controls */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 bg-white px-4 py-2 rounded-lg shadow-sm">
              Каталог товаров
            </h3>
            
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              Фильтры {isFilterOpen ? <ChevronDown className="h-4 w-4 transform rotate-180" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
          
          {/* Filter panels */}
          {isFilterOpen && (
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Categories filter */}
                <div className="flex-1">
                  <h4 className="font-medium mb-2 text-gray-700">Категории</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleCategoryChange(null)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        selectedCategory === null 
                          ? 'bg-[#0088CC] text-white font-medium' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Все категории
                    </button>
                    
                    {filterData?.categories?.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          selectedCategory === category 
                            ? 'bg-[#0088CC] text-white font-medium' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {getCategoryDisplayName(category)}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Brands filter */}
                <div className="flex-1">
                  <h4 className="font-medium mb-2 text-gray-700">Бренды</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleBrandChange(null)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        selectedBrand === null 
                          ? 'bg-[#0088CC] text-white font-medium' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Все бренды
                    </button>
                    
                    {filterData?.brands?.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => handleBrandChange(brand)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          selectedBrand === brand 
                            ? 'bg-[#0088CC] text-white font-medium' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Filter controls */}
              <div className="mt-4 flex justify-between">
                <div className="text-sm font-medium text-gray-600">
                  {products?.length || 0} товаров
                </div>
                
                {(selectedCategory || selectedBrand) && (
                  <button 
                    onClick={handleResetFilters}
                    className="flex items-center gap-1 text-sm font-medium text-[#0088CC] hover:text-[#006699] transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Сбросить фильтры
                  </button>
                )}
              </div>
            </div>
          )}

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
