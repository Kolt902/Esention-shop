import React, { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Product } from '@shared/schema';
import { showNotification } from '@/lib/utils';
import { getTelegramWebApp } from '@/lib/telegram';
import { ChevronDown, Filter, ChevronLeft } from 'lucide-react';

export default function StylePage() {
  const [, setLocation] = useLocation();
  
  // Получаем стиль из URL-параметра
  const styleRoute = useRoute<{ style: string }>("/style/:style");
  const style = styleRoute && styleRoute[0] ? 
    (styleRoute[1] as { style: string }).style : null;
  
  // Состояние для бренда выбранного на этой странице
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  
  // Получаем все товары и категории для фильтрации
  const { data: filterData, refetch } = useQuery<{
    categories: string[];
    brands: string[];
    products: Product[];
  }>({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return response.json();
    },
    staleTime: 0,
    refetchOnMount: true,
  });

  // Инициализация компонента
  useEffect(() => {
    console.log("StylePage mounted for style:", style);
    
    // Если нет стиля, возвращаемся на главную
    if (!style) {
      setLocation('/');
      return;
    }
    
    // Проверяем, что Telegram WebApp доступен
    const telegramWebApp = getTelegramWebApp();
    console.log("Telegram WebApp available:", !!telegramWebApp);
    
    // Если Telegram WebApp доступен, настраиваем MainButton
    if (telegramWebApp && telegramWebApp.MainButton) {
      telegramWebApp.MainButton.hide();
    }
  }, [style, setLocation]);
  
  // Обработчик для изменения бренда
  const handleBrandChange = (brand: string | null) => {
    setSelectedBrand(brand);
    console.log("Selected brand on style page:", brand);
  };
  
  // Функция для перехода на страницу продукта
  const handleProductClick = (productId: number) => {
    window.location.href = `/product/${productId}`;
  };
  
  // Фильтрация продуктов по стилю
  const filteredProducts = filterData?.products?.filter(product => {
    // Фильтр по стилю
    if (style) {
      if (style === 'oldmoney' && !['Gucci', 'Ralph Lauren', 'Balenciaga'].includes(product.brand)) {
        return false;
      }
      if (style === 'streetwear' && !['Supreme', 'Stussy', 'Nike', 'Adidas'].includes(product.brand)) {
        return false;
      }
      if (style === 'luxury' && !['Gucci', 'Louis Vuitton', 'Balenciaga', 'Prada'].includes(product.brand)) {
        return false;
      }
      if (style === 'sport' && !['Nike', 'Adidas', 'Jordan'].includes(product.brand)) {
        return false;
      }
    }
    
    // Фильтр по бренду
    if (selectedBrand && product.brand !== selectedBrand) {
      return false;
    }
    
    return true;
  });
  
  // Получаем названия брендов для текущего стиля
  const getStyleBrands = () => {
    if (!style) return [];
    
    switch(style) {
      case 'oldmoney':
        return ['Gucci', 'Ralph Lauren', 'Balenciaga'];
      case 'streetwear':
        return ['Supreme', 'Stussy', 'Nike', 'Adidas'];
      case 'luxury':
        return ['Gucci', 'Louis Vuitton', 'Balenciaga', 'Prada'];
      case 'sport':
        return ['Nike', 'Adidas', 'Jordan'];
      default:
        return [];
    }
  };
  
  // Форматируем название стиля для отображения
  const getStyleDisplayName = () => {
    if (!style) return "";
    
    switch(style) {
      case 'oldmoney':
        return "Old Money";
      case 'streetwear':
        return "Streetwear";
      case 'luxury':
        return "Luxury";
      case 'sport':
        return "Sport & Athleisure";
      default:
        return style.charAt(0).toUpperCase() + style.slice(1);
    }
  };
  
  const styleBrands = getStyleBrands();
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Хлебные крошки и Навигация */}
        <div className="mb-6 flex items-center justify-between">
          <button 
            onClick={() => setLocation('/')}
            className="flex items-center text-gray-700 hover:text-black"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span>Назад</span>
          </button>
          
          <h1 className="text-xl font-bold">{getStyleDisplayName()}</h1>
          
          <div className="w-6"></div> {/* Пустой блок для выравнивания */}
        </div>
        
        {/* Фильтр по брендам - горизонтальный скролл */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex space-x-2 min-w-max">
            <button
              onClick={() => handleBrandChange(null)}
              className={`px-4 py-2 border rounded-full transition-colors whitespace-nowrap ${
                selectedBrand === null 
                  ? 'bg-black text-white border-black' 
                  : 'border-gray-300 text-gray-700 hover:border-gray-500'
              }`}
            >
              Все бренды
            </button>
            
            {styleBrands.map(brand => (
              <button
                key={brand}
                onClick={() => handleBrandChange(brand)}
                className={`px-4 py-2 border rounded-full transition-colors whitespace-nowrap ${
                  selectedBrand === brand 
                    ? 'bg-black text-white border-black' 
                    : 'border-gray-300 text-gray-700 hover:border-gray-500'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
        
        {/* Отображение товаров */}
        {!filteredProducts || filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Товары не найдены</p>
            <p className="text-gray-400 mt-2">Попробуйте изменить параметры фильтрации</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product.id)}
                onAddToCart={(product, size) => {
                  showNotification(`${product.name} добавлен в корзину`);
                  // В реальном приложении здесь будет логика добавления в корзину
                }}
              />
            ))}
          </div>
        )}
      </main>
      
      <Footer 
        cartCount={0}
        onCartClick={() => setLocation('/?cart=open')}
        onHomeClick={() => setLocation('/')}
      />
    </div>
  );
}