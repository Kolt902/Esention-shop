import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CartModal from "@/components/CartModal";
import CategoryCard from "@/components/CategoryCard";
import { showNotification, getCategoryDisplayName } from "@/lib/utils";
import { addTelegramInitDataToRequest, getTelegramWebApp } from "@/lib/telegram";
import { Product } from "@shared/schema";
import { Filter, ChevronDown, X } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

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
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Получение списка категорий и брендов
  const { data: filterData, refetch } = useQuery<{
    categories: string[],
    brands: string[],
    products: Product[]
  }>({
    queryKey: ['/api/categories'],
    staleTime: 0, // Всегда считаем данные устаревшими
    refetchOnMount: true, // Перезапрашиваем при монтировании
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
        // Проверяем sessionStorage (для временного хранения)
        const sessionCart = sessionStorage.getItem('cartItems');
        if (sessionCart) {
          const parsedCart = JSON.parse(sessionCart);
          if (Array.isArray(parsedCart) && parsedCart.length > 0) {
            setCartItems(parsedCart);
            console.log("Корзина восстановлена из sessionStorage", parsedCart);
          }
        }
      }
    } catch (error) {
      console.error("Ошибка при восстановлении корзины:", error);
    }
    
    // Проверяем, что Telegram WebApp доступен
    const telegramWebApp = getTelegramWebApp();
    console.log("Telegram WebApp available:", !!telegramWebApp);
    
    // Если Telegram WebApp доступен, настраиваем MainButton
    if (telegramWebApp && telegramWebApp.MainButton) {
      telegramWebApp.MainButton.hide();
    }
  }, []);
  
  // Сохранение корзины при изменении
  useEffect(() => {
    if (cartItems.length > 0) {
      try {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
        console.log("Корзина сохранена", cartItems);
      } catch (error) {
        console.error("Ошибка при сохранении корзины:", error);
      }
    }
  }, [cartItems]);
  
  // Обработчики для фильтров
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    console.log("Selected category:", category);
  };
  
  const handleBrandChange = (brand: string | null) => {
    setSelectedBrand(brand);
    console.log("Selected brand:", brand);
  };
  
  const handleStyleChange = (style: string | null) => {
    setSelectedStyle(style);
    console.log("Selected style:", style);
  };
  
  // Функция для добавления товара в корзину
  const handleAddToCart = async (product: Product, size?: string) => {
    console.log("Добавление в корзину:", product, size);
    
    // Проверяем, есть ли уже этот товар в корзине с этим размером
    const existingItemIndex = cartItems.findIndex(
      item => item.product.id === product.id && item.size === size
    );
    
    if (existingItemIndex !== -1) {
      // Если товар уже есть, увеличиваем количество
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += 1;
      setCartItems(updatedCartItems);
    } else {
      // Добавляем новый товар
      setCartItems([...cartItems, { product, quantity: 1, size }]);
    }
    
    showNotification(`${product.name} добавлен в корзину`);
  };
  
  // Обработчик для удаления товара из корзины
  const handleRemoveFromCart = (index: number) => {
    const newCartItems = [...cartItems];
    newCartItems.splice(index, 1);
    setCartItems(newCartItems);
    
    // Если корзина пуста, очищаем хранилище
    if (newCartItems.length === 0) {
      localStorage.removeItem('cartItems');
      sessionStorage.removeItem('cartItems');
    }
  };
  
  // Обработчик для изменения количества товара
  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const newCartItems = [...cartItems];
    newCartItems[index].quantity = newQuantity;
    setCartItems(newCartItems);
  };
  
  // Функция для перехода на страницу продукта
  const handleProductClick = (productId: number) => {
    window.location.href = `/product/${productId}`;
  };
  
  // Фильтрация продуктов
  const filteredProducts = filterData?.products?.filter(product => {
    // Фильтр по категории
    if (selectedCategory && product.category !== selectedCategory) {
      return false;
    }
    
    // Фильтр по бренду
    if (selectedBrand && product.brand !== selectedBrand) {
      return false;
    }
    
    // Фильтр по стилю (TODO: добавить поле style в модель Product)
    if (selectedStyle) {
      // Временная логика для демонстрации
      if (selectedStyle === 'oldmoney' && !['Gucci', 'Ralph Lauren', 'Balenciaga'].includes(product.brand)) {
        return false;
      }
      if (selectedStyle === 'streetwear' && !['Supreme', 'Stussy', 'Nike', 'Adidas'].includes(product.brand)) {
        return false;
      }
      if (selectedStyle === 'luxury' && !['Gucci', 'Louis Vuitton', 'Balenciaga', 'Prada'].includes(product.brand)) {
        return false;
      }
      if (selectedStyle === 'sport' && !['Nike', 'Adidas', 'Jordan'].includes(product.brand)) {
        return false;
      }
    }
    
    return true;
  });
  
  // Обработка оформления заказа
  const handleCheckout = async () => {
    try {
      // Создаем объект для сохранения информации о заказе
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          size: item.size
        })),
        totalAmount: cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      };
      
      console.log("Оформление заказа:", orderData);
      
      // Отправляем данные на сервер
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...addTelegramInitDataToRequest()
        },
        body: JSON.stringify(orderData)
      });
      
      if (response.ok) {
        showNotification("Заказ успешно оформлен! Мы свяжемся с вами для уточнения деталей доставки.");
        setIsCartOpen(false);
        setCartItems([]);
        
        // Сохраняем пустую корзину
        localStorage.removeItem('cartItems');
        sessionStorage.removeItem('cartItems');
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error) {
      console.error("Ошибка оформления заказа:", error);
      showNotification("Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow pb-20">
        {/* Stylish Discount Banner */}
        <div className="bg-gradient-to-r from-black via-gray-800 to-black text-white py-4 mb-0">
          <div className="container mx-auto px-4 text-center">
            <p className="text-lg md:text-xl font-light tracking-wider uppercase">
              СКИДКА 10% НА ВСЕ ТОВАРЫ
            </p>
            <p className="text-sm md:text-base text-gray-300 mt-1">
              До 1 июня 2025 • Используйте промокод <span className="font-bold">ESENTION10</span>
            </p>
          </div>
        </div>
        
        {/* Full-width background banner for styles */}
        <div className="w-full bg-gradient-to-b from-gray-800 to-gray-900 py-10 mb-8">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wide">Популярные категории</h2>
            
            {/* Style Categories - Horizontal Scrolling for Mobile */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {/* Old Money Style */}
              <CategoryCard 
                title="Old Money" 
                description="Элегантный и утонченный стиль" 
                imageUrl="/assets/5235752188695931952.jpg"
                onClick={() => handleStyleChange('oldmoney')}
                isSelected={selectedStyle === 'oldmoney'}
              />
              
              {/* Streetwear Style */}
              <CategoryCard 
                title="Streetwear" 
                description="Современный уличный стиль" 
                imageUrl="/assets/5235752188695932083.jpg"
                onClick={() => handleStyleChange('streetwear')}
                isSelected={selectedStyle === 'streetwear'}
              />
              
              {/* Luxury Style */}
              <CategoryCard 
                title="Luxury" 
                description="Роскошь и премиальные бренды" 
                imageUrl="/assets/5235759361291318071.jpg"
                onClick={() => handleStyleChange('luxury')}
                isSelected={selectedStyle === 'luxury'}
              />
              
              {/* Sport/Athleisure Style */}
              <CategoryCard 
                title="Athleisure" 
                description="Спортивный городской стиль" 
                imageUrl="/assets/5235759361291318073.jpg"
                onClick={() => handleStyleChange('sport')}
                isSelected={selectedStyle === 'sport'}
              />
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4">
          {/* Latest Products Section */}
          <section className="mb-12 mt-6">
            <h2 className="text-xl font-bold text-black mb-8 uppercase tracking-wide">Новые поступления</h2>
            
            {/* Product Grid - Optimized for mobile with 2 columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filterData?.products?.slice(0, 8).map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </section>
          
          {/* Category Menu - Horizontal Scrolling */}
          <section className="mb-8 bg-gray-100 rounded-xl overflow-hidden shadow-sm">
            <div className="py-5 px-5">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-base font-semibold text-black uppercase bg-white py-1.5 px-4 rounded-full shadow-sm">Все категории</h4>
                <button 
                  onClick={() => {
                    refetch();
                    queryClient.invalidateQueries({queryKey: ['/api/products']});
                    showNotification('Данные обновлены');
                  }}
                  className="text-black flex items-center text-sm font-medium hover:bg-white px-3 py-1.5 rounded-full transition-all hover:shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Обновить
                </button>
              </div>
              <div className="flex space-x-3 py-1 px-1 min-w-full overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={`whitespace-nowrap px-5 py-2 rounded-full font-medium text-sm transition-all flex items-center ${
                    selectedCategory === null 
                      ? 'bg-black text-white shadow-md' 
                      : 'bg-white text-gray-700 hover:text-black hover:bg-gray-50 shadow-sm'
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
                
                {filterData?.categories?.map(category => {
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
                    case 'streetwear':
                      icon = (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
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
                      onClick={() => handleCategoryChange(category)}
                      className={`whitespace-nowrap px-5 py-2 rounded-full font-medium text-sm transition-all flex items-center ${
                        selectedCategory === category 
                          ? 'bg-black text-white shadow-md' 
                          : 'bg-white text-gray-700 hover:text-black hover:bg-gray-50 shadow-sm'
                      }`}
                    >
                      {icon}
                      {getCategoryDisplayName(category)}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Products with filter controls */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl uppercase text-black bg-gray-100 px-6 py-2 rounded-full shadow-sm">
                Каталог товаров
              </h3>
              
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 text-sm font-medium bg-black text-white py-2 px-4 rounded-full hover:bg-gray-800 transition-all shadow-sm"
              >
                <Filter className="h-4 w-4" />
                Фильтры {isFilterOpen ? <ChevronDown className="h-4 w-4 transform rotate-180" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
            
            {/* Filter panels */}
            {isFilterOpen && (
              <div className="mb-6 bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Categories filter */}
                  <div className="flex-1">
                    <h4 className="font-medium mb-2 text-gray-700">Категории</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleCategoryChange(null)}
                        className={`w-full text-left px-3 py-2 text-sm ${
                          selectedCategory === null 
                            ? 'text-black font-medium underline' 
                            : 'text-gray-700 hover:text-black'
                        }`}
                      >
                        Все категории
                      </button>
                      
                      {filterData?.categories?.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategoryChange(category)}
                          className={`w-full text-left px-3 py-2 text-sm ${
                            selectedCategory === category 
                              ? 'text-black font-medium underline' 
                              : 'text-gray-700 hover:text-black'
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
                        className={`w-full text-left px-3 py-2 text-sm ${
                          selectedBrand === null 
                            ? 'text-black font-medium underline' 
                            : 'text-gray-700 hover:text-black'
                        }`}
                      >
                        Все бренды
                      </button>
                      
                      {filterData?.brands?.map((brand) => (
                        <button
                          key={brand}
                          onClick={() => handleBrandChange(brand)}
                          className={`w-full text-left px-3 py-2 text-sm ${
                            selectedBrand === brand 
                              ? 'text-black font-medium underline' 
                              : 'text-gray-700 hover:text-black'
                          }`}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Styles filter */}
                  <div className="flex-1">
                    <h4 className="font-medium mb-2 text-gray-700">Стили</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleStyleChange(null)}
                        className={`w-full text-left px-3 py-2 text-sm ${
                          selectedStyle === null 
                            ? 'text-black font-medium underline' 
                            : 'text-gray-700 hover:text-black'
                        }`}
                      >
                        Все стили
                      </button>
                      
                      <button
                        onClick={() => handleStyleChange('oldmoney')}
                        className={`w-full text-left px-3 py-2 text-sm ${
                          selectedStyle === 'oldmoney' 
                            ? 'text-black font-medium underline' 
                            : 'text-gray-700 hover:text-black'
                        }`}
                      >
                        Old Money
                      </button>
                      
                      <button
                        onClick={() => handleStyleChange('streetwear')}
                        className={`w-full text-left px-3 py-2 text-sm ${
                          selectedStyle === 'streetwear' 
                            ? 'text-black font-medium underline' 
                            : 'text-gray-700 hover:text-black'
                        }`}
                      >
                        Streetwear
                      </button>
                      
                      <button
                        onClick={() => handleStyleChange('luxury')}
                        className={`w-full text-left px-3 py-2 text-sm ${
                          selectedStyle === 'luxury' 
                            ? 'text-black font-medium underline' 
                            : 'text-gray-700 hover:text-black'
                        }`}
                      >
                        Luxury
                      </button>
                      
                      <button
                        onClick={() => handleStyleChange('sport')}
                        className={`w-full text-left px-3 py-2 text-sm ${
                          selectedStyle === 'sport' 
                            ? 'text-black font-medium underline' 
                            : 'text-gray-700 hover:text-black'
                        }`}
                      >
                        Athleisure
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Show active filters and clear buttons */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {selectedCategory && (
                    <div className="bg-gray-100 py-1 px-3 rounded-full text-sm flex items-center">
                      <span>Категория: {getCategoryDisplayName(selectedCategory)}</span>
                      <button 
                        onClick={() => handleCategoryChange(null)}
                        className="ml-2 text-black hover:text-gray-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  
                  {selectedBrand && (
                    <div className="bg-gray-100 py-1 px-3 rounded-full text-sm flex items-center">
                      <span>Бренд: {selectedBrand}</span>
                      <button 
                        onClick={() => handleBrandChange(null)}
                        className="ml-2 text-black hover:text-gray-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  
                  {selectedStyle && (
                    <div className="bg-gray-100 py-1 px-3 rounded-full text-sm flex items-center">
                      <span>Стиль: {selectedStyle === 'oldmoney' ? 'Old Money' : 
                                    selectedStyle === 'streetwear' ? 'Streetwear' : 
                                    selectedStyle === 'luxury' ? 'Luxury' : 'Athleisure'}</span>
                      <button 
                        onClick={() => handleStyleChange(null)}
                        className="ml-2 text-black hover:text-gray-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  
                  {(selectedCategory || selectedBrand || selectedStyle) && (
                    <button 
                      onClick={() => {
                        setSelectedCategory(null);
                        setSelectedBrand(null);
                        setSelectedStyle(null);
                      }}
                      className="py-1 px-3 rounded-full text-sm text-black border border-gray-300 hover:bg-gray-50"
                    >
                      Сбросить все фильтры
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {/* Products Grid - optimized for mobile with 2 columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredProducts && filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart}
                  />
                ))
              ) : (
                <div className="col-span-2 md:col-span-4 flex flex-col items-center justify-center py-16">
                  <p className="text-lg font-medium text-gray-800">Товары не найдены</p>
                  <p className="text-gray-500 mt-2">Попробуйте изменить параметры фильтрации</p>
                </div>
              )}
            </div>
          </section>
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