import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CartModal from "@/components/CartModal";
import CategoryCard from "@/components/CategoryCard";
import BrandCard from "@/components/BrandCard";
import { showNotification } from "@/lib/utils";
import { addTelegramInitDataToRequest, getTelegramWebApp, isRunningInTelegram } from "@/lib/telegram";
import { Product } from "@shared/schema";
import { Filter, ChevronDown, X } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useLocation, useRoute } from "wouter";

// Импорт изображений
import oldMoneyImg from "@assets/5235752188695933225.jpg";
import streetwearImg from "@assets/5235826719263420314.jpg"; 
import luxuryImg from "@assets/5235759361291318071.jpg";
import sportImg from "@assets/5235759361291318073.jpg";
import nikeImg from "@assets/5235752188695933225.jpg";
import adidasImg from "@assets/5235759361291318073.jpg";
import jordanImg from "@assets/5235752188695933225.jpg";
import stussyImg from "@assets/5235826719263420314.jpg";
import balenciagaImg from "@assets/5235759361291318071.jpg";
import allBrandsImg from "@assets/5235689757051321832.jpg";
import allCategoriesImg from "@assets/5235689757051321832.jpg";
import clothingImg from "@assets/5235752188695933225.jpg";
import shoesImg from "@assets/5235752188695933225.jpg";
import accessoriesImg from "@assets/5235759361291318071.jpg";
import { categoryData } from "@/lib/categoryImages";
import { simpleCategoryData } from "@/lib/categoryDataSimple";
import SimpleCategoryCard from "@/components/SimpleCategoryCard";
import BrandCategoryList from "@/components/BrandCategoryList";

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
  
  // Функция для определения пути сброса фильтров в зависимости от выбранной категории
  const getResetPath = () => {
    return selectedCategory?.includes('women') ? "/category/womens" : "/category/mens";
  };
  
  // Получаем параметры из URL с использованием wouter
  const [location, setLocation] = useLocation();
  const categoryRoute = useRoute("/category/:category");
  const brandRoute = useRoute("/brand/:brand");
  const styleRoute = useRoute("/style/:style");
  
  // Получение списка категорий, брендов и продуктов
  const { data: filterData, refetch } = useQuery<{
    categories: string[],
    brands: string[],
    products: Product[]
  }>({
    queryKey: ['/api/categories', selectedCategory, selectedBrand, selectedStyle],
    staleTime: 0, // Всегда считаем данные устаревшими
    refetchOnMount: true, // Перезапрашиваем при монтировании
  });

  // Инициализация компонента и восстановление корзины
  useEffect(() => {
    console.log("StorePage mounted");
    
    // Применяем фильтры из URL при наличии
    // В useRoute первый элемент - это булево значение (совпадение найдено или нет)
    // второй элемент - это объект параметров
    if (categoryRoute && categoryRoute[0]) {
      const categoryParam = categoryRoute[1] as { category: string };
      console.log("Category from URL:", categoryParam.category);
      setSelectedCategory(categoryParam.category);
    }
    
    if (brandRoute && brandRoute[0]) {
      const brandParam = brandRoute[1] as { brand: string };
      console.log("Brand from URL:", brandParam.brand);
      setSelectedBrand(brandParam.brand);
    }
    
    if (styleRoute && styleRoute[0]) {
      const styleParam = styleRoute[1] as { style: string };
      console.log("Style from URL:", styleParam.style);
      setSelectedStyle(styleParam.style);
    }
    
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
  }, [categoryRoute, brandRoute, styleRoute]);
  
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
    // После изменения категории явно перезапрашиваем данные с сервера
    refetch();
  };
  
  const handleBrandChange = (brand: string | null) => {
    setSelectedBrand(brand);
    console.log("Selected brand:", brand);
    // После изменения бренда явно перезапрашиваем данные с сервера
    refetch();
  };
  
  const handleStyleChange = (style: string | null) => {
    setSelectedStyle(style);
    console.log("Selected style:", style);
    // После изменения стиля явно перезапрашиваем данные с сервера
    refetch();
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
    // Фильтр по категории (включая мужское/женское)
    if (selectedCategory) {
      if (selectedCategory === 'mens' && !product.category.includes('men')) {
        return false;
      } else if (selectedCategory === 'womens' && !product.category.includes('women')) {
        return false;
      } else if (selectedCategory !== 'mens' && selectedCategory !== 'womens' && product.category !== selectedCategory) {
        return false;
      }
    }
    
    // Фильтр по бренду - теперь сравниваем напрямую с брендом товара
    if (selectedBrand && product.brand !== selectedBrand) {
      return false;
    }
    
    // Фильтр по стилю
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
      } as RequestInit);
      
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
            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wide">Стили</h2>
            
            {/* Style Categories - Horizontal Scrolling for Mobile */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {/* Old Money Style */}
              <CategoryCard 
                title="Old Money" 
                description="Элегантный и утонченный стиль" 
                imageUrl={oldMoneyImg}
                onClick={() => { setLocation("/style/oldmoney"); handleStyleChange('oldmoney'); }}
                isSelected={selectedStyle === 'oldmoney'}
              />
              
              {/* Streetwear Style */}
              <CategoryCard 
                title="Streetwear" 
                description="Современный уличный стиль" 
                imageUrl={streetwearImg}
                onClick={() => { setLocation("/style/streetwear"); handleStyleChange('streetwear'); }}
                isSelected={selectedStyle === 'streetwear'}
              />
              
              {/* Luxury Style */}
              <CategoryCard 
                title="Luxury" 
                description="Роскошь и премиальные бренды" 
                imageUrl={luxuryImg}
                onClick={() => { setLocation("/style/luxury"); handleStyleChange('luxury'); }}
                isSelected={selectedStyle === 'luxury'}
              />
              
              {/* Sport/Athleisure Style */}
              <CategoryCard 
                title="Athleisure" 
                description="Спортивный городской стиль" 
                imageUrl={sportImg}
                onClick={() => { setLocation("/style/sport"); handleStyleChange('sport'); }}
                isSelected={selectedStyle === 'sport'}
              />
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4">
          {/* Большая секция с Мужским/Женским выбором */}
          <section className="mb-8 mt-6">
            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* Men's Shop */}
              <div className="relative overflow-hidden rounded-xl shadow-lg h-64">
                <img 
                  src={jordanImg} 
                  alt="Мужская одежда" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">MEN</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <button 
                      onClick={() => {
                        setLocation("/category/mens");
                        handleCategoryChange('mens');
                      }}
                      className="bg-white text-black text-sm font-medium px-3 py-1.5 rounded-full hover:bg-gray-200 transition inline-block"
                    >
                      Смотреть все
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Women's Shop */}
              <div className="relative overflow-hidden rounded-xl shadow-lg h-64">
                <img 
                  src={allCategoriesImg} 
                  alt="Женская одежда" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">WOMEN</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <button 
                      onClick={() => {
                        setLocation("/category/womens");
                        handleCategoryChange('womens');
                      }}
                      className="bg-white text-black text-sm font-medium px-3 py-1.5 rounded-full hover:bg-gray-200 transition inline-block"
                    >
                      Смотреть все
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Popular Brands Section with images */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black uppercase tracking-wide">Бренды</h2>
            </div>
            
            {/* Brand Cards Grid - Scrollable on mobile with modern design */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
              {/* Nike */}
              <button 
                onClick={() => setLocation("/brand/Nike")}
                className={`flex items-center justify-center p-3 border rounded-xl transition-all ${
                  selectedBrand === 'Nike' 
                    ? 'border-black shadow-md bg-black text-white' 
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <span className="font-medium text-sm">Nike</span>
              </button>
              
              {/* Adidas */}
              <a 
                href="/brand/Adidas"
                className={`flex items-center justify-center p-3 border rounded-xl transition-all ${
                  selectedBrand === 'Adidas' 
                    ? 'border-black shadow-md bg-black text-white' 
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <span className="font-medium text-sm">Adidas</span>
              </a>
              
              {/* Jordan */}
              <a 
                href="/brand/Jordan"
                className={`flex items-center justify-center p-3 border rounded-xl transition-all ${
                  selectedBrand === 'Jordan' 
                    ? 'border-black shadow-md bg-black text-white' 
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <span className="font-medium text-sm">Jordan</span>
              </a>
              
              {/* Stussy */}
              <a 
                href="/brand/Stussy"
                className={`flex items-center justify-center p-3 border rounded-xl transition-all ${
                  selectedBrand === 'Stussy' 
                    ? 'border-black shadow-md bg-black text-white' 
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <span className="font-medium text-sm">Stussy</span>
              </a>
              
              {/* Balenciaga */}
              <a 
                href="/brand/Balenciaga"
                className={`flex items-center justify-center p-3 border rounded-xl transition-all ${
                  selectedBrand === 'Balenciaga' 
                    ? 'border-black shadow-md bg-black text-white' 
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <span className="font-medium text-sm">Balenciaga</span>
              </a>
              
              {/* All Brands */}
              <button 
                onClick={() => setLocation(getResetPath())}
                className={`flex items-center justify-center p-3 border rounded-xl transition-all ${
                  selectedBrand === null 
                    ? 'border-black shadow-md bg-black text-white' 
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <span className="font-medium text-sm">Все</span>
              </button>
            </div>
          </section>
          
          {/* Категории в стиле SNIPES - простые карточки с изображениями */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-black mb-6 uppercase tracking-wide">Категории</h2>
            
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {/* Отобразим категории в стиле SNIPES */}
              {simpleCategoryData.map(category => (
                <SimpleCategoryCard 
                  key={category.id}
                  title={category.title}
                  imageUrl={category.imageUrl}
                  categoryId={category.id}
                  isSelected={selectedCategory === category.id}
                />
              ))}
            </div>
          </section>

          {/* Catalog by Brands and Categories */}
          <section className="mb-8">
            <div className="relative mb-12 pb-4 overflow-hidden">
              <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <h3 className="text-xl uppercase text-black relative inline-block py-4 font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-black">
                Каталог товаров по брендам
              </h3>
              
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="absolute right-0 top-4 flex items-center gap-2 text-sm font-medium bg-black text-white py-2 px-4 rounded-full hover:bg-gray-800 transition-all shadow-sm"
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
                        onClick={() => setLocation(getResetPath())}
                        className={`w-full text-left px-3 py-2 text-sm block ${
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
                          onClick={() => setLocation(`/category/${category}`)}
                          className={`w-full text-left px-3 py-2 text-sm block ${
                            selectedCategory === category 
                              ? 'text-black font-medium underline' 
                              : 'text-gray-700 hover:text-black'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Brands filter */}
                  <div className="flex-1">
                    <h4 className="font-medium mb-2 text-gray-700">Бренды</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => setLocation(getResetPath())}
                        className={`w-full text-left px-3 py-2 text-sm block ${
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
                          onClick={() => setLocation(`/brand/${brand}`)}
                          className={`w-full text-left px-3 py-2 text-sm block ${
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
                        onClick={() => setLocation(getResetPath())}
                        className={`w-full text-left px-3 py-2 text-sm block ${
                          selectedStyle === null 
                            ? 'text-black font-medium underline' 
                            : 'text-gray-700 hover:text-black'
                        }`}
                      >
                        Все стили
                      </button>
                      
                      <button
                        onClick={() => setLocation("/style/oldmoney")}
                        className={`w-full text-left px-3 py-2 text-sm block ${
                          selectedStyle === 'oldmoney' 
                            ? 'text-black font-medium underline' 
                            : 'text-gray-700 hover:text-black'
                        }`}
                      >
                        Old Money
                      </button>
                      
                      <button
                        onClick={() => setLocation("/style/streetwear")}
                        className={`w-full text-left px-3 py-2 text-sm block ${
                          selectedStyle === 'streetwear' 
                            ? 'text-black font-medium underline' 
                            : 'text-gray-700 hover:text-black'
                        }`}
                      >
                        Streetwear
                      </button>
                      
                      <button
                        onClick={() => setLocation("/style/luxury")}
                        className={`w-full text-left px-3 py-2 text-sm block ${
                          selectedStyle === 'luxury' 
                            ? 'text-black font-medium underline' 
                            : 'text-gray-700 hover:text-black'
                        }`}
                      >
                        Luxury
                      </button>
                      
                      <button
                        onClick={() => setLocation("/style/sport")}
                        className={`w-full text-left px-3 py-2 text-sm block ${
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
                      <span>Категория: {selectedCategory}</span>
                      <a 
                        href={getResetPath()}
                        className="ml-2 text-black hover:text-gray-800"
                      >
                        <X className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                  
                  {selectedBrand && (
                    <div className="bg-gray-100 py-1 px-3 rounded-full text-sm flex items-center">
                      <span>Бренд: {selectedBrand}</span>
                      <a 
                        href={getResetPath()}
                        className="ml-2 text-black hover:text-gray-800"
                      >
                        <X className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                  
                  {selectedStyle && (
                    <div className="bg-gray-100 py-1 px-3 rounded-full text-sm flex items-center">
                      <span>Стиль: {selectedStyle === 'oldmoney' ? 'Old Money' : 
                                    selectedStyle === 'streetwear' ? 'Streetwear' : 
                                    selectedStyle === 'luxury' ? 'Luxury' : 'Athleisure'}</span>
                      <a 
                        href={getResetPath()}
                        className="ml-2 text-black hover:text-gray-800"
                      >
                        <X className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                  
                  {(selectedCategory || selectedBrand || selectedStyle) && (
                    <button 
                      onClick={() => setLocation(getResetPath())}
                      className="py-1 px-3 rounded-full text-sm text-black border border-gray-300 hover:bg-gray-50"
                    >
                      Сбросить все фильтры
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {/* Brand-Category Organized Product List */}
            {(selectedCategory || selectedBrand || selectedStyle) ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredProducts && filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={handleAddToCart}
                      asLink={true}
                    />
                  ))
                ) : (
                  <div className="col-span-2 md:col-span-3 lg:col-span-4 py-16 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7V5a2 2 0 012-2h14a2 2 0 012 2v2M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7h18" />
                    </svg>
                    <h3 className="text-xl font-bold mb-2">Товары не найдены</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      По выбранным фильтрам товаров не найдено. Попробуйте изменить параметры фильтрации.
                    </p>
                    <button
                      onClick={() => setLocation(getResetPath())}
                      className="mt-6 bg-black text-white py-2 px-6 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors inline-block"
                    >
                      Сбросить фильтры
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Просим пользователя выбрать категорию или бренд для просмотра товаров
              <div className="py-16 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-2xl font-bold mb-3">Выберите категорию</h3>
                <p className="text-gray-600 max-w-lg mx-auto mb-8">
                  Для просмотра товаров выберите категорию, бренд или стиль в разделах выше. 
                  Вы можете использовать фильтры для более точного поиска.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button 
                    onClick={() => setLocation("/category/sneakers")}
                    className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Кроссовки
                  </button>
                  <button 
                    onClick={() => setLocation("/category/tshirts")}
                    className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Футболки
                  </button>
                  <button 
                    onClick={() => setLocation("/category/hoodies")}
                    className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Худи
                  </button>
                  <button 
                    onClick={() => setLocation("/brand/Nike")}
                    className="bg-gray-200 text-black px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                  >
                    Nike
                  </button>
                  <button 
                    onClick={() => setLocation("/brand/Adidas")}
                    className="bg-gray-200 text-black px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                  >
                    Adidas
                  </button>
                </div>
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