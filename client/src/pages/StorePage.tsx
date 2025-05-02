import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CartModal from "@/components/CartModal";
import CategoryCard from "@/components/CategoryCard";
import { showNotification } from "@/lib/utils";
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Получение списка категорий и брендов
  const { data: filterData } = useQuery<{categories: string[], brands: string[]}>({
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
        // Поиск в sessionStorage как запасной вариант (обратная совместимость)
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
      console.error("Ошибка восстановления корзины:", error);
    }
    
    // Извлекаем параметры из URL для установки фильтров
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      console.log("Установлена категория из URL:", categoryParam);
    }
    
    const brandParam = params.get('brand');
    if (brandParam) {
      setSelectedBrand(brandParam);
    }
    
    // Проверка параметра cart=open для автоматического открытия корзины
    const cartParam = params.get('cart');
    if (cartParam === 'open') {
      setIsCartOpen(true);
      console.log("Автоматически открыта корзина из URL параметра");
      
      // Очистка URL от параметра cart для избежания повторных открытий
      const url = new URL(window.location.href);
      url.searchParams.delete('cart');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  // Сохранение корзины при каждом изменении
  useEffect(() => {
    if (cartItems.length > 0) {
      try {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        console.log("Корзина сохранена в localStorage", cartItems);
      } catch (error) {
        console.error("Ошибка сохранения корзины:", error);
      }
    } else {
      localStorage.removeItem('cartItems');
      console.log("Корзина очищена в localStorage");
    }
  }, [cartItems]);

  // Запрос списка продуктов с применением фильтров
  const { data: products = [], isLoading, error, refetch } = useQuery<Product[]>({
    queryKey: ['/api/products', selectedCategory, selectedBrand], 
    queryFn: async () => {
      const baseUrl = '/api/products';
      
      // Формируем параметры запроса в зависимости от выбранных фильтров
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedBrand) params.append('brand', selectedBrand);
      
      const url = `${baseUrl}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url, { method: 'GET' });
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      return response.json();
    },
  });

  // Обработчики фильтрации
  const handleCategoryChange = (category: string | null) => {
    if (category === selectedCategory) return; // Избегаем лишние рендеры
    setSelectedCategory(category);
  };

  const handleBrandChange = (brand: string | null) => {
    if (brand === selectedBrand) return;
    setSelectedBrand(brand);
  };

  // Дополнительные функции для отображения
  const getCategoryDisplayName = (category: string): string => {
    // Перевод технических названий категорий в понятные для пользователя
    const categoryNames: Record<string, string> = {
      'tshirts': 'Одежда',
      'hoodies': 'Верхняя одежда',
      'sneakers': 'Обувь',
      'pants': 'Брюки',
      'accessories': 'Аксессуары',
      'basketball': 'Спортивная одежда',
      'running': 'Спортивная обувь',
      'lifestyle': 'Повседневная одежда',
      'training': 'Тренировочная одежда',
      'shoes': 'Обувь',
      'bags': 'Сумки',
      'jewelry': 'Украшения',
      'dresses': 'Платья',
      'coats': 'Пальто и куртки',
      'shirts': 'Рубашки',
    };
    
    return categoryNames[category] || category;
  };

  const getPriceBracket = (price: number): string => {
    if (price < 100) return "До €100";
    if (price < 200) return "€100 - €200";
    if (price < 300) return "€200 - €300";
    return "От €300";
  };

  // Обработчики корзины
  const handleAddToCart = async (product: Product, size?: string) => {
    console.log(`Добавление в корзину: ${product.name} (размер: ${size || 'не указан'})`);
    
    // Проверка, есть ли уже такой товар в корзине с таким же размером
    const existingItemIndex = cartItems.findIndex(
      item => item.product.id === product.id && item.size === size
    );
    
    if (existingItemIndex > -1) {
      // Если товар уже есть, увеличиваем количество
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += 1;
      setCartItems(updatedItems);
      showNotification(`Количество товара ${product.name} увеличено`);
    } else {
      // Если товара нет, добавляем новый
      setCartItems([...cartItems, { product, quantity: 1, size }]);
      showNotification(`Товар ${product.name} добавлен в корзину`);
    }
  };

  const handleRemoveFromCart = (index: number) => {
    const newItems = [...cartItems];
    newItems.splice(index, 1);
    setCartItems(newItems);
    showNotification("Товар удален из корзины");
  };

  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const newItems = [...cartItems];
    newItems[index].quantity = newQuantity;
    setCartItems(newItems);
  };

  const handleCheckout = async () => {
    try {
      // Подготовка данных заказа
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          size: item.size
        })),
        total: cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      };
      
      // Отправка заказа на сервер
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      
      if (response.ok) {
        // Если успешно, очищаем корзину
        setCartItems([]);
        setIsCartOpen(false);
        showNotification("Заказ успешно оформлен!");
        
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
        {/* Hero Banner - Farfetch Style */}
        <section className="relative mb-8">
          <div className="bg-gray-50 py-12 md:py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl">
                <h1 className="text-4xl md:text-5xl font-light text-black mb-6 uppercase">
                  Новая коллекция дизайнерской одежды
                </h1>
                <p className="text-lg md:text-xl text-gray-700 mb-8 font-light">
                  Эксклюзивные модели от ведущих мировых брендов специально для вас
                </p>
                <button 
                  onClick={() => handleCategoryChange('sneakers')}
                  className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-900 transition-colors"
                >
                  СМОТРЕТЬ КОЛЛЕКЦИЮ
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Container for the rest of content */}
        <div className="container mx-auto px-4">
          {/* Designer Brands */}
          <section className="mb-12">
            <h2 className="text-xl font-normal text-black mb-6 uppercase">Популярные категории</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Карточка категории: Одежда */}
              <CategoryCard
                name="Одежда"
                icon="👔"
                onClick={() => handleCategoryChange('tshirts')}
              />
              
              {/* Карточка категории: Обувь */}
              <CategoryCard
                name="Обувь"
                icon="👞"
                onClick={() => handleCategoryChange('sneakers')}
              />
              
              {/* Карточка категории: Сумки */}
              <CategoryCard
                name="Сумки"
                icon="👜"
                onClick={() => handleCategoryChange('accessories')}
              />
              
              {/* Карточка категории: Верхняя одежда */}
              <CategoryCard
                name="Верхняя одежда"
                icon="🧥"
                onClick={() => handleCategoryChange('hoodies')}
              />
              
              {/* Карточка категории: Аксессуары */}
              <CategoryCard
                name="Украшения"
                icon="💍"
                onClick={() => handleCategoryChange('accessories')}
              />
              
              {/* Карточка категории: Новинки */}
              <CategoryCard
                name="Новинки"
                icon="⭐"
                onClick={() => handleCategoryChange(null)}
                isNew={true}
              />
            </div>
          </section>
          
          {/* Category Menu - Horizontal Scrolling */}
          <section className="mb-8 bg-gray-100 rounded-md overflow-hidden">
            <div className="py-4 px-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-base font-semibold text-black uppercase">Все категории</h4>
                <button 
                  onClick={() => {
                    refetch();
                    queryClient.invalidateQueries({queryKey: ['/api/products']});
                    showNotification('Данные обновлены');
                  }}
                  className="text-black flex items-center text-sm font-medium hover:text-gray-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Обновить
                </button>
              </div>
              <div className="flex space-x-3 py-1 px-1 min-w-full overflow-x-auto">
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={`whitespace-nowrap px-5 py-2 rounded-none font-medium text-sm transition-all flex items-center ${
                    selectedCategory === null 
                      ? 'bg-black text-white' 
                      : 'bg-transparent text-gray-700 hover:text-black hover:underline'
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
                      onClick={() => handleCategoryChange(category)}
                      className={`whitespace-nowrap px-5 py-2 rounded-none font-medium text-sm transition-all flex items-center ${
                        selectedCategory === category 
                          ? 'bg-black text-white' 
                          : 'bg-transparent text-gray-700 hover:text-black hover:underline'
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
              <h3 className="text-xl uppercase text-black">
                Каталог товаров
              </h3>
              
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 text-sm font-medium text-black hover:underline"
              >
                <Filter className="h-4 w-4" />
                Фильтры {isFilterOpen ? <ChevronDown className="h-4 w-4 transform rotate-180" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
            
            {/* Filter panels */}
            {isFilterOpen && (
              <div className="mb-6 bg-white p-4 border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
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
                </div>
                
                {/* Filter controls */}
                <div className="mt-4 flex justify-between">
                  <div className="text-sm font-medium text-gray-600">
                    Отображено: {products.length} товаров
                  </div>
                  
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedBrand(null);
                    }}
                    className="text-sm text-gray-600 hover:text-black hover:underline"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              </div>
            )}
            
            {/* Product grid */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-black border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white border border-gray-200">
                <p className="text-gray-700 font-medium">Нет доступных продуктов</p>
              </div>
            )}
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