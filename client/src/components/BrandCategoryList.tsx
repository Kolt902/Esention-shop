import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ProductCard from './ProductCard';
import { productDatabase } from '../lib/productDatabase';

// Используем тип Product из productDatabase
import type { Product } from '../lib/productDatabase';

interface BrandCategoryListProps {
  onAddToCart: (product: Product, size?: string) => void;
  onProductClick: (productId: number) => void;
}

const BrandCategoryList: React.FC<BrandCategoryListProps> = ({ 
  onAddToCart,
  onProductClick
}) => {
  // Состояние для хранения товаров
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Состояние видимости разделов по брендам - по умолчанию Nike раскрыт
  const [expandedBrands, setExpandedBrands] = useState<{ [key: string]: boolean }>({
    'Nike': true
  });

  // Загружаем товары при монтировании компонента
  useEffect(() => {
    // Устанавливаем данные из базы
    setProducts(productDatabase);
    setLoading(false);
  }, []);

  // Функция для переключения видимости раздела бренда
  const toggleBrand = (brand: string) => {
    setExpandedBrands(prev => ({
      ...prev,
      [brand]: !prev[brand]
    }));
  };

  // Если данные еще загружаются
  if (loading) {
    return <div className="py-10 text-center">Загрузка каталога...</div>;
  }

  // Если данных нет
  if (!products || products.length === 0) {
    return <div className="py-10 text-center">Товары не найдены</div>;
  }

  // Группируем товары по брендам и категориям
  const groupedProducts: {
    [brand: string]: {
      [category: string]: Product[]
    }
  } = {};

  // Заполняем структуру данных
  products.forEach(product => {
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

  // Получаем список брендов в определенном порядке (сначала основные бренды)
  const mainBrands = ['Nike', 'Adidas', 'Jordan', 'Stussy', 'Gucci', 'Balenciaga'];
  const otherBrands = Object.keys(groupedProducts).filter(brand => !mainBrands.includes(brand));
  const sortedBrands = [...mainBrands.filter(brand => groupedProducts[brand]), ...otherBrands];

  // Рендерим товары, сгруппированные по брендам и категориям
  return (
    <div className="space-y-10">
      {sortedBrands.map(brand => (
        <div key={brand} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
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