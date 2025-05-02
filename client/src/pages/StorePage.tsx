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
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
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
    queryKey: ['/api/products', selectedCategory, selectedBrand, selectedStyle], 
    queryFn: async () => {
      const baseUrl = '/api/products';
      
      // Формируем параметры запроса в зависимости от выбранных фильтров
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedBrand) params.append('brand', selectedBrand);
      if (selectedStyle) params.append('style', selectedStyle);
      
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
  
  const handleStyleChange = (style: string | null) => {
    if (style === selectedStyle) return;
    setSelectedStyle(style);
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
          {/* Hero Banner - Four Styles Grid */}
          <div className="container mx-auto px-4">
            {/* Section header with label */}
            <div className="flex items-center justify-between mb-8">
              <div className="inline-flex items-center">
                <div className="bg-gray-900 text-white text-sm px-4 py-2 rounded-l-md uppercase font-bold border-l-2 border-t-2 border-b-2 border-gray-700">
                  СТИЛИ
                </div>
                <h2 className="text-xl font-bold uppercase ml-3 text-white">
                  ВЫБЕРИТЕ СВОЙ СТИЛЬ
                </h2>
              </div>
            </div>
            
            {/* Four style cards in a grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {/* Old Money Style */}
              <div 
                className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-lg group cursor-pointer transition-all duration-300 hover:shadow-xl"
                onClick={() => {
                  handleStyleChange('oldmoney');
                  handleBrandChange(null);
                }}
              >
                <img 
                  src="/assets/oldmoney-style.jpg" 
                  alt="Old Money Style" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/80"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                  </div>
                  <div>
                    <h3 className="text-white text-2xl font-bold mb-1">Old Money</h3>
                    <p className="text-white/80 text-sm mb-4">Элегантный и утонченный стиль</p>
                    <div className="transform opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <button className="bg-white text-black text-sm px-4 py-2 rounded-full font-medium hover:bg-black hover:text-white transition-colors">
                        Смотреть коллекцию
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Streetwear Style */}
              <div 
                className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-lg group cursor-pointer transition-all duration-300 hover:shadow-xl"
                onClick={() => {
                  handleStyleChange('streetwear');
                  handleBrandChange(null);
                }}
              >
                <img 
                  src="/assets/streetwear-brands.jpg" 
                  alt="Streetwear Style" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/80"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                  </div>
                  <div>
                    <h3 className="text-white text-2xl font-bold mb-1">Streetwear</h3>
                    <p className="text-white/80 text-sm mb-4">Современный уличный стиль</p>
                    <div className="transform opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <button className="bg-white text-black text-sm px-4 py-2 rounded-full font-medium hover:bg-black hover:text-white transition-colors">
                        Смотреть коллекцию
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Luxury Style */}
              <div 
                className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-lg group cursor-pointer transition-all duration-300 hover:shadow-xl"
                onClick={() => {
                  handleStyleChange('luxury');
                  handleBrandChange(null);
                }}
              >
                <img 
                  src="/assets/luxury-style.jpg" 
                  alt="Luxury Style" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/80"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                  </div>
                  <div>
                    <h3 className="text-white text-2xl font-bold mb-1">Luxury</h3>
                    <p className="text-white/80 text-sm mb-4">Премиальные бренды</p>
                    <div className="transform opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <button className="bg-white text-black text-sm px-4 py-2 rounded-full font-medium hover:bg-black hover:text-white transition-colors">
                        Смотреть коллекцию
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Athleisure Style */}
              <div 
                className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-lg group cursor-pointer transition-all duration-300 hover:shadow-xl"
                onClick={() => {
                  handleStyleChange('athleisure');
                  handleBrandChange(null);
                }}
              >
                <img 
                  src="/assets/adidas-tags.jpg" 
                  alt="Athleisure Style" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/80"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                  </div>
                  <div>
                    <h3 className="text-white text-2xl font-bold mb-1">Athleisure</h3>
                    <p className="text-white/80 text-sm mb-4">Спортивный стиль</p>
                    <div className="transform opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <button className="bg-white text-black text-sm px-4 py-2 rounded-full font-medium hover:bg-black hover:text-white transition-colors">
                        Смотреть коллекцию
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Container for the rest of content */}
        <div className="container mx-auto px-4">
          {/* Popular Categories Section */}
          <section className="mb-12 pt-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black uppercase tracking-wide inline-flex items-center">
                <span className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-4 py-1.5 rounded-l-md mr-2 text-sm border-r border-gray-600">КАТЕГОРИИ</span>
                <span>ПОПУЛЯРНЫЕ КАТЕГОРИИ</span>
              </h2>
              <div className="hidden md:block">
                <button className="text-sm font-medium text-black hover:underline">Все категории</button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filterData?.categories.slice(0, 4).map((category, index) => (
                <div 
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-xl shadow-md cursor-pointer transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
                  onClick={() => handleCategoryChange(category)}
                >
                  {/* Category background color based on category */}
                  <div className={`absolute inset-0 ${
                    category === 'lifestyle' ? 'bg-gradient-to-br from-gray-700 to-gray-900' :
                    category === 'basketball' ? 'bg-gradient-to-br from-gray-800 to-gray-950' :
                    category === 'running' ? 'bg-gradient-to-br from-gray-700 to-gray-900' :
                    category === 'soccer' ? 'bg-gradient-to-br from-gray-800 to-gray-950' :
                    'bg-gradient-to-br from-gray-700 to-gray-900'
                  }`}></div>
                  
                  {/* Category Icon */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <div className="w-16 h-16 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center mb-3 border border-gray-600">
                      {category === 'lifestyle' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      )}
                      {category === 'basketball' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                          <path d="M2 12h20"></path>
                        </svg>
                      )}
                      {category === 'running' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M13 4v16"></path>
                          <path d="M17 4v16"></path>
                          <path d="M21 4v16"></path>
                          <path d="M9 4v16"></path>
                          <path d="M5 4v16"></path>
                          <path d="M1 4v16"></path>
                        </svg>
                      )}
                      {category === 'soccer' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 2v4"></path>
                          <path d="M12 18v4"></path>
                          <path d="M4.93 4.93l2.83 2.83"></path>
                          <path d="M16.24 16.24l2.83 2.83"></path>
                          <path d="M2 12h4"></path>
                          <path d="M18 12h4"></path>
                          <path d="M4.93 19.07l2.83-2.83"></path>
                          <path d="M16.24 7.76l2.83-2.83"></path>
                        </svg>
                      )}
                      {(category !== 'lifestyle' && category !== 'basketball' && category !== 'running' && category !== 'soccer') && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                      )}
                    </div>
                    <h3 className="text-white font-semibold text-center">
                      {getCategoryDisplayName(category)}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Popular Brands Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black uppercase tracking-wide inline-flex items-center">
                <span className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-4 py-1.5 rounded-l-md mr-2 text-sm border-r border-gray-600">БРЕНДЫ</span>
                <span>ПОПУЛЯРНЫЕ БРЕНДЫ</span>
              </h2>
              <div className="hidden md:block">
                <button className="text-sm font-medium text-black hover:underline">Все бренды</button>
              </div>
            </div>
            
            {/* Brand grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => handleBrandChange('Nike')}
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 p-6 text-center group shadow-md hover:shadow-lg transition-all border border-gray-700"
              >
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png" alt="Nike" className="h-10 mx-auto invert" />
                </div>
                <div className="mt-4 text-white text-sm">
                  <span className="font-medium">Nike</span>
                </div>
              </button>
              
              <button 
                onClick={() => handleBrandChange('Adidas')}
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-950 p-6 text-center group shadow-md hover:shadow-lg transition-all border border-gray-700"
              >
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1280px-Adidas_Logo.svg.png" alt="Adidas" className="h-10 mx-auto invert" />
                </div>
                <div className="mt-4 text-white text-sm">
                  <span className="font-medium">Adidas</span>
                </div>
              </button>
              
              <button 
                onClick={() => handleBrandChange('Gucci')}
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 p-6 text-center group shadow-md hover:shadow-lg transition-all border border-gray-700"
              >
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">GUCCI</span>
                </div>
                <div className="mt-4 text-white text-sm">
                  <span className="font-medium">Luxury</span>
                </div>
              </button>
              
              <button 
                onClick={() => handleBrandChange('Jordan')}
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-950 p-6 text-center group shadow-md hover:shadow-lg transition-all border border-gray-700"
              >
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  <img src="https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Jumpman_logo.svg/1200px-Jumpman_logo.svg.png" alt="Jordan" className="h-12 mx-auto invert" />
                </div>
                <div className="mt-4 text-white text-sm">
                  <span className="font-medium">Jordan</span>
                </div>
              </button>
            </div>
          </section>
          
          {/* Latest Products Section */}
          <section className="mb-12 mt-6">
            <h2 className="text-xl font-bold text-black mb-8 uppercase tracking-wide">Новые поступления</h2>
            
            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filterData?.products.slice(0, 8).map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={handleAddToCart}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>
          </section>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {/* Nike */}
              <button 
                onClick={() => handleBrandChange('Nike')}
                className="group relative h-24 md:h-28 flex items-center justify-center border border-gray-200 hover:border-gray-400 bg-white transition-all duration-300 rounded-xl shadow-sm hover:shadow-md"
              >
                <div className="opacity-90 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" alt="Nike" className="h-6 md:h-7" />
                </div>
              </button>
              
              {/* Adidas */}
              <button 
                onClick={() => handleBrandChange('Adidas')}
                className="group relative h-24 md:h-28 flex items-center justify-center border border-gray-200 hover:border-gray-400 bg-white transition-all duration-300 rounded-xl shadow-sm hover:shadow-md"
              >
                <div className="opacity-90 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" alt="Adidas" className="h-8 md:h-10" />
                </div>
              </button>
              
              {/* Jordan */}
              <button 
                onClick={() => handleBrandChange('Jordan')}
                className="group relative h-24 md:h-28 flex items-center justify-center border border-gray-200 hover:border-gray-400 bg-white transition-all duration-300 rounded-xl shadow-sm hover:shadow-md"
              >
                <div className="opacity-90 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300">
                  <img src="https://upload.wikimedia.org/wikipedia/en/3/37/Jumpman_logo.svg" alt="Jordan" className="h-12 md:h-14" />
                </div>
              </button>
              
              {/* Gucci */}
              <button 
                onClick={() => handleBrandChange('Gucci')}
                className="group relative h-24 md:h-28 flex items-center justify-center border border-gray-200 hover:border-gray-400 bg-white transition-all duration-300 rounded-xl shadow-sm hover:shadow-md"
              >
                <div className="opacity-90 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300">
                  <span className="font-serif text-2xl md:text-3xl font-bold tracking-wider">GUCCI</span>
                </div>
              </button>
              
              {/* Balenciaga */}
              <button 
                onClick={() => handleBrandChange('Balenciaga')}
                className="group relative h-24 md:h-28 flex items-center justify-center border border-gray-200 hover:border-gray-400 bg-white transition-all duration-300 rounded-xl shadow-sm hover:shadow-md"
              >
                <div className="opacity-90 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300">
                  <span className="font-sans text-sm md:text-base uppercase tracking-[0.3em] font-medium">BALENCIAGA</span>
                </div>
              </button>
              
              {/* Stussy */}
              <button 
                onClick={() => handleBrandChange('Stussy')}
                className="group relative h-24 md:h-28 flex items-center justify-center border border-gray-200 hover:border-gray-400 bg-white transition-all duration-300 rounded-xl shadow-sm hover:shadow-md"
              >
                <div className="opacity-90 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300">
                  <span className="font-serif italic text-2xl md:text-3xl font-bold">Stüssy</span>
                </div>
              </button>
              
              {/* Supreme */}
              <button 
                onClick={() => handleBrandChange('Supreme')}
                className="group relative h-24 md:h-28 flex items-center justify-center border border-gray-200 hover:border-red-400 bg-red-600 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md"
              >
                <div className="opacity-90 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300">
                  <span className="font-['Futura'] text-xl md:text-2xl font-bold text-white">SUPREME</span>
                </div>
              </button>
              
              {/* All brands */}
              <button 
                onClick={() => handleBrandChange(null)}
                className="group relative h-24 md:h-28 flex items-center justify-center border border-gray-200 hover:border-gray-400 bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md"
              >
                <div className="text-center">
                  <div className="opacity-75 group-hover:opacity-100 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600 group-hover:text-black">Все бренды</span>
                </div>
              </button>
            </div>
          </section>
          
          {/* Category Menu - MOVED AFTER STYLES - horizontal navigation */}
          
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
              <div className="flex space-x-3 py-1 px-1 min-w-full overflow-x-auto">
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
                      
                      {/* Добавляем популярные бренды, если их нет в основном списке */}
                      {!filterData?.brands?.includes('Stussy') && (
                        <button
                          onClick={() => handleBrandChange('Stussy')}
                          className={`w-full text-left px-3 py-2 text-sm ${
                            selectedBrand === 'Stussy' 
                              ? 'text-black font-medium underline' 
                              : 'text-gray-700 hover:text-black'
                          }`}
                        >
                          Stussy
                        </button>
                      )}
                      
                      {!filterData?.brands?.includes('Supreme') && (
                        <button
                          onClick={() => handleBrandChange('Supreme')}
                          className={`w-full text-left px-3 py-2 text-sm ${
                            selectedBrand === 'Supreme' 
                              ? 'text-black font-medium underline' 
                              : 'text-gray-700 hover:text-black'
                          }`}
                        >
                          Supreme
                        </button>
                      )}
                      
                      {!filterData?.brands?.includes('Gucci') && (
                        <button
                          onClick={() => handleBrandChange('Gucci')}
                          className={`w-full text-left px-3 py-2 text-sm ${
                            selectedBrand === 'Gucci' 
                              ? 'text-black font-medium underline' 
                              : 'text-gray-700 hover:text-black'
                          }`}
                        >
                          Gucci
                        </button>
                      )}
                      
                      {!filterData?.brands?.includes('Balenciaga') && (
                        <button
                          onClick={() => handleBrandChange('Balenciaga')}
                          className={`w-full text-left px-3 py-2 text-sm ${
                            selectedBrand === 'Balenciaga' 
                              ? 'text-black font-medium underline' 
                              : 'text-gray-700 hover:text-black'
                          }`}
                        >
                          Balenciaga
                        </button>
                      )}
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
                        onClick={() => handleStyleChange('athleisure')}
                        className={`w-full text-left px-3 py-2 text-sm ${
                          selectedStyle === 'athleisure' 
                            ? 'text-black font-medium underline' 
                            : 'text-gray-700 hover:text-black'
                        }`}
                      >
                        Athleisure
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
                    </div>
                  </div>
                </div>
                
                {/* Filter controls */}
                <div className="mt-6 flex justify-between items-center">
                  <div className="text-sm font-medium text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
                    Отображено: {products.length} товаров
                  </div>
                  
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedBrand(null);
                      setSelectedStyle(null);
                    }}
                    className="text-sm bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-all flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
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
              <div className="text-center py-10 bg-white border border-gray-200 rounded-xl shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-gray-700 font-medium text-lg">Нет доступных продуктов</p>
                <p className="text-gray-500 mt-2">Попробуйте изменить параметры фильтрации</p>
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