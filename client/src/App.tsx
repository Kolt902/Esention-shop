import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        MainButton: {
          show: () => void;
          hide: () => void;
          setText: (text: string) => void;
        };
      };
    };
  }
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    // Initialize Telegram Web App
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  }, []);

  const products: Product[] = [
    { id: 1, name: 'Товар 1', price: 1000, description: 'Описание товара' },
    { id: 2, name: 'Товар 2', price: 2000, description: 'Описание товара' },
    { id: 3, name: 'Товар 3', price: 3000, description: 'Описание товара' },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-10 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-medium tracking-tight text-center">
            Esention Store
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:border-gray-200 transition-all duration-300"
              >
                {/* Product Image Placeholder */}
                <div className="aspect-square bg-gray-50 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No Image</span>
                </div>
                
                {/* Product Info */}
                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="font-medium text-base mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {product.price.toLocaleString()} ₽
                    </span>
                    <button className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-900 transition-colors">
                      Купить
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between px-6 py-3">
            {[
              { id: 'home', label: 'Главная', icon: '🏠' },
              { id: 'catalog', label: 'Каталог', icon: '📱' },
              { id: 'cart', label: 'Корзина', icon: '🛒' },
              { id: 'contacts', label: 'Контакты', icon: '📞' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center ${
                  activeTab === item.id
                    ? 'text-black'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className="text-xl mb-1">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default App; 