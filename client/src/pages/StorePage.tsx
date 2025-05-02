import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CartModal from "@/components/CartModal";
import { showNotification } from "@/lib/utils";
import { initTelegramWebApp, addTelegramInitDataToRequest } from "@/lib/telegram";
import { Product } from "@shared/schema";

interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

export default function StorePage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Initialize Telegram WebApp
  useEffect(() => {
    initTelegramWebApp();
  }, []);

  // Fetch products
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['/api/products'],
    staleTime: 60000, // 1 minute
  });

  // Add to cart handler
  const handleAddToCart = (product: Product, size?: string) => {
    setCartItems((prevItems) => {
      // Check if item already exists with same product and size
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1,
        };
        return newItems;
      } else {
        // Add new item
        return [...prevItems, { product, quantity: 1, size }];
      }
    });
  };

  // Remove from cart handler
  const handleRemoveFromCart = (productId: number) => {
    setCartItems((prevItems) => 
      prevItems.filter((item) => item.product.id !== productId)
    );
  };

  // Checkout handler
  const handleCheckout = () => {
    showNotification("Заказ оформлен! Это демо-версия.");
    setCartItems([]);
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Welcome Banner */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-xl font-medium text-center text-gray-800">
            Добро пожаловать в магазин
          </h2>
          <p className="text-gray-600 text-center mt-2">
            Explore our latest collection
          </p>
        </div>

        {/* Products */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            New Arrivals
          </h3>

          {isLoading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              Error loading products
            </div>
          ) : products && products.length > 0 ? (
            products.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))
          ) : (
            <div className="text-center py-8">No products available</div>
          )}
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
        onCheckout={handleCheckout}
      />
    </div>
  );
}
