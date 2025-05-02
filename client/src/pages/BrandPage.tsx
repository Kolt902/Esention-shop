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

export default function BrandPage() {
  const [, setLocation] = useLocation();
  
  // Получаем бренд из URL-параметра
  const brandRoute = useRoute<{ brand: string }>("/brand/:brand");
  const brand = brandRoute && brandRoute[0] ? 
    (brandRoute[1] as { brand: string }).brand : null;
  
  // Состояние для категории выбранной на этой странице
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
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
    staleTime: 0, // Всегда считаем данные устаревшими
    refetchOnMount: true, // Перезапрашиваем при монтировании
  });

  // Инициализация компонента
  useEffect(() => {
    console.log("BrandPage mounted for brand:", brand);
    
    // Если нет бренда, возвращаемся на главную
    if (!brand) {
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
  }, [brand, setLocation]);
  
  // Обработчик для изменения категории
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    console.log("Selected category on brand page:", category);
  };
  
  // Функция для перехода на страницу продукта
  const handleProductClick = (productId: number) => {
    window.location.href = `/product/${productId}`;
  };
  
  // Фильтрация продуктов
  const filteredProducts = filterData?.products?.filter(product => {
    // Фильтр по бренду
    if (brand && product.brand !== brand) {
      return false;
    }
    
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
    
    return true;
  });
  
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
          
          <h1 className="text-xl font-bold">{brand}</h1>
          
          <div className="w-6"></div> {/* Пустой блок для выравнивания */}
        </div>
        
        {/* Фильтр по категориям - горизонтальный скролл */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex space-x-2 min-w-max">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`px-4 py-2 border rounded-full transition-colors whitespace-nowrap ${
                selectedCategory === null 
                  ? 'bg-black text-white border-black' 
                  : 'border-gray-300 text-gray-700 hover:border-gray-500'
              }`}
            >
              Все категории
            </button>
            
            <button
              onClick={() => handleCategoryChange('mens')}
              className={`px-4 py-2 border rounded-full transition-colors whitespace-nowrap ${
                selectedCategory === 'mens' 
                  ? 'bg-black text-white border-black' 
                  : 'border-gray-300 text-gray-700 hover:border-gray-500'
              }`}
            >
              Мужское
            </button>
            
            <button
              onClick={() => handleCategoryChange('womens')}
              className={`px-4 py-2 border rounded-full transition-colors whitespace-nowrap ${
                selectedCategory === 'womens' 
                  ? 'bg-black text-white border-black' 
                  : 'border-gray-300 text-gray-700 hover:border-gray-500'
              }`}
            >
              Женское
            </button>
            
            {filterData?.categories?.map(category => (
              category !== 'mens' && category !== 'womens' && (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 border rounded-full transition-colors whitespace-nowrap ${
                    selectedCategory === category 
                      ? 'bg-black text-white border-black' 
                      : 'border-gray-300 text-gray-700 hover:border-gray-500'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              )
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