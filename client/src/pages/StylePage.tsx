import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CartModal from "@/components/CartModal";
import FilterPanel from "@/components/FilterPanel";
import { Product } from "@shared/schema";
import { Filter } from "lucide-react";
import { showNotification } from "@/lib/utils";
import { getTelegramWebApp } from "@/lib/telegram";

interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

export default function StylePage() {
  const { styleName } = useParams();
  const [_, navigate] = useLocation();
  
  // Состояния для корзины и фильтрации
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({
    categories: [] as string[],
    brands: [] as string[],
    styles: [styleName || ""] as string[],
    priceRange: [0, 50000] as [number, number],
    genders: [] as string[],
  });

  // Получение данных о продуктах с сервера
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/categories'],
    staleTime: 60000, // 1 минута кэширования
  });

  // Если стиль не указан, перенаправляем на главную
  useEffect(() => {
    if (!styleName) {
      navigate("/");
    }
    console.log("Detected Telegram WebApp version:", getTelegramWebApp()?.version);
    console.log("StylePage mounted for style:", styleName);
    console.log("Telegram WebApp available:", !!getTelegramWebApp());
  }, [styleName, navigate]);

  // Восстановление корзины из localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          setCartItems(parsedCart);
        }
      }
    } catch (error) {
      console.error("Error restoring cart:", error);
    }
  }, []);

  // Сохранение корзины при изменении
  useEffect(() => {
    if (cartItems.length > 0) {
      try {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      } catch (error) {
        console.error("Error saving cart:", error);
      }
    }
  }, [cartItems]);

  // Получаем стиль из данных
  const styleData = data?.styleDetails?.find((style: any) => 
    style.name.toLowerCase() === styleName?.toLowerCase()
  );

  // Фильтрация продуктов по стилю и другим фильтрам
  let products = data?.products || [];
  
  // Фильтрация по стилю через атрибут style продукта
  products = products.filter((product: Product) => {
    if (styleName) {
      const style = styleName.toLowerCase();
      if (product.style) {
        return product.style.toLowerCase() === style;
      } else {
        // Если у продукта нет атрибута стиля, используем эвристику
        if (style === 'old money' && ['Gucci', 'Louis Vuitton', 'Balenciaga', 'Prada', 'Celine'].includes(product.brand)) {
          return true;
        }
        if (style === 'streetwear' && ['Supreme', 'Stussy', 'Nike', 'Adidas', 'Jordan', 'Off-White'].includes(product.brand)) {
          return true;
        }
        if (style === 'vintage' && ['Levi\'s', 'Reebok', 'New Balance', 'Wrangler'].includes(product.brand)) {
          return true;
        }
        if (style === 'sport' && ['Nike', 'Adidas', 'Jordan', 'Puma', 'Reebok'].includes(product.brand)) {
          return true;
        }
        if (style === 'casual' && ['Diesel', 'Uniqlo', 'Gap', 'H&M', 'GRAB'].includes(product.brand)) {
          return true;
        }
        return false;
      }
    }
    return true;
  });

  // Применение дополнительных фильтров
  products = products.filter((product: Product) => {
    // Фильтр по категориям
    if (currentFilters.categories.length > 0 && !currentFilters.categories.includes(product.category)) {
      return false;
    }
    
    // Фильтр по брендам
    if (currentFilters.brands.length > 0 && !currentFilters.brands.includes(product.brand)) {
      return false;
    }
    
    // Фильтр по цене
    if (product.price < currentFilters.priceRange[0] || product.price > currentFilters.priceRange[1]) {
      return false;
    }
    
    // Фильтр по полу
    if (currentFilters.genders.length > 0 && !currentFilters.genders.includes(product.gender)) {
      return false;
    }
    
    return true;
  });

  // Обработка добавления товара в корзину
  const handleAddToCart = (product: Product, size?: string) => {
    // Проверяем, есть ли уже этот товар в корзине с таким же размером
    const existingItemIndex = cartItems.findIndex(
      item => item.product.id === product.id && item.size === size
    );

    if (existingItemIndex >= 0) {
      // Если товар уже в корзине, увеличиваем количество
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += 1;
      setCartItems(updatedCart);
    } else {
      // Если товара нет в корзине, добавляем новый
      setCartItems([...cartItems, { product, quantity: 1, size }]);
    }

    showNotification("Товар добавлен в корзину");
  };

  // Обработка удаления товара из корзины
  const handleRemoveFromCart = (index: number) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);
  };

  // Обработка изменения количества товара в корзине
  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = newQuantity;
    setCartItems(updatedCart);
  };

  // Оформление заказа
  const handleCheckout = async () => {
    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          size: item.size
        })),
        totalAmount: cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      };
      
      console.log("Placing order:", orderData);
      showNotification("Заказ успешно оформлен!");
      setIsCartOpen(false);
      setCartItems([]);
      localStorage.removeItem('cartItems');
    } catch (error) {
      console.error("Error placing order:", error);
      showNotification("Произошла ошибка при оформлении заказа");
    }
  };

  // Обработка изменения фильтров
  const handleFilterChange = (filters: {
    categories: string[];
    brands: string[];
    styles: string[];
    priceRange: [number, number];
    genders: string[];
  }) => {
    // Сохраняем текущий стиль в фильтрах
    const updatedFilters = {
      ...filters,
      styles: filters.styles.length > 0 ? filters.styles : [styleName || ""]
    };
    setCurrentFilters(updatedFilters);
  };

  // Стилизация и отображение названия стиля
  const formatStyleName = (name: string) => {
    if (!name) return "";
    return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 px-4 py-6 max-w-7xl mx-auto w-full">
        {/* Заголовок стиля с описанием */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">{formatStyleName(styleName || "")}</h1>
          {styleData && styleData.description && (
            <p className="mt-2 text-gray-600">{styleData.description}</p>
          )}
        </div>
        
        {/* Кнопка фильтра */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-medium">
            {products.length} товаров
          </div>
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <Filter size={18} className="mr-2" />
            Фильтры
          </button>
        </div>
        
        {/* Список товаров */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Загрузка товаров...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <p>Произошла ошибка при загрузке товаров</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">Товары не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </main>
      
      <Footer 
        cartCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onHomeClick={() => navigate("/")}
      />
      
      {/* Модальное окно корзины */}
      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemove={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckout}
      />
      
      {/* Панель фильтров */}
      <FilterPanel 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onFilterChange={handleFilterChange}
        initialFilters={currentFilters}
      />
    </div>
  );
}