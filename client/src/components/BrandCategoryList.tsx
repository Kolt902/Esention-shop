import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ProductCard from './ProductCard';
import { useQuery } from '@tanstack/react-query';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  brand: string;
  description: string;
  imageUrl: string;
  gender?: string;
}

interface BrandCategoryListProps {
  onAddToCart: (product: Product, size?: string) => void;
  onProductClick: (productId: number) => void;
}

const BrandCategoryList: React.FC<BrandCategoryListProps> = ({ 
  onAddToCart,
  onProductClick
}) => {
  // Получаем все категории, бренды и продукты
  const { data: filterData, isLoading } = useQuery<{
    categories: string[],
    brands: string[],
    products: Product[]
  }>({
    queryKey: ['/api/categories'],
    staleTime: 0,
    refetchOnMount: true,
  });

  // Состояние видимости разделов по брендам
  const [expandedBrands, setExpandedBrands] = useState<{ [key: string]: boolean }>({});

  // Функция для переключения видимости раздела бренда
  const toggleBrand = (brand: string) => {
    setExpandedBrands(prev => ({
      ...prev,
      [brand]: !prev[brand]
    }));
  };

  // Если данные еще загружаются
  if (isLoading) {
    return <div className="py-10 text-center">Загрузка каталога...</div>;
  }

  // Если данных нет
  if (!filterData?.products || filterData.products.length === 0) {
    return <div className="py-10 text-center">Товары не найдены</div>;
  }

  // Группируем товары по брендам и категориям
  const groupedProducts: {
    [brand: string]: {
      [category: string]: Product[]
    }
  } = {};

  // Заполняем структуру данных
  filterData.products.forEach(product => {
    if (!groupedProducts[product.brand]) {
      groupedProducts[product.brand] = {};
    }
    
    if (!groupedProducts[product.brand][product.category]) {
      groupedProducts[product.brand][product.category] = [];
    }
    
    groupedProducts[product.brand][product.category].push(product);
  });

  // Преобразуем названия категорий для отображения
  const getCategoryDisplayName = (category: string): string => {
    const categoryMap: { [key: string]: string } = {
      'lifestyle': 'Повседневные',
      'running': 'Беговые',
      'basketball': 'Баскетбольные',
      'football': 'Футбольные',
      'skateboarding': 'Скейтбординг',
      'tennis': 'Теннисные',
      'sneakers': 'Кроссовки',
      'tshirts': 'Футболки',
      'hoodies': 'Худи',
      'pants': 'Штаны',
      'shorts': 'Шорты',
      'jackets': 'Куртки',
      'accessories': 'Аксессуары',
      'mens': 'Мужское',
      'womens': 'Женское'
    };
    
    return categoryMap[category.toLowerCase()] || category;
  };

  // Рендерим товары, сгруппированные по брендам и категориям
  return (
    <div className="space-y-10">
      {Object.keys(groupedProducts).map(brand => (
        <div key={brand} className="border border-gray-200 rounded-xl overflow-hidden">
          {/* Заголовок бренда с возможностью сворачивания */}
          <div 
            className="bg-gray-50 px-6 py-4 flex justify-between items-center cursor-pointer"
            onClick={() => toggleBrand(brand)}
          >
            <h3 className="text-xl font-bold">{brand}</h3>
            <button className="p-1 rounded-full hover:bg-gray-200">
              {expandedBrands[brand] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          
          {/* Категории внутри бренда */}
          {expandedBrands[brand] && (
            <div className="p-6 space-y-8">
              {Object.keys(groupedProducts[brand]).map(category => (
                <div key={`${brand}-${category}`} className="space-y-4">
                  <h4 className="text-lg font-semibold border-b pb-2">
                    {getCategoryDisplayName(category)}
                  </h4>
                  
                  {/* Товары в категории */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {groupedProducts[brand][category].map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={onAddToCart}
                        onClick={() => onProductClick(product.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BrandCategoryList;