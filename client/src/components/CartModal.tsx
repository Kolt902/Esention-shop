import { X, ShoppingBag, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Product } from "@shared/schema";
import { useEffect, useState } from "react";
import { getTelegramWebApp, isRunningInTelegram } from "@/lib/telegram";
import CheckoutModal from "./CheckoutModal";

interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, size: string | undefined, quantity: number) => void;
}

export default function CartModal({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
}: CartModalProps) {
  // State для модального окна оформления заказа
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  
  // Открыть модальное окно оформления заказа
  const handleOpenCheckout = () => {
    setCheckoutOpen(true);
    
    // Если мы в телеграме, скрыть главную кнопку
    const telegramApp = getTelegramWebApp();
    if (telegramApp && telegramApp.MainButton) {
      telegramApp.MainButton.hide();
    }
  };
  
  // Закрыть модальное окно оформления заказа
  const handleCloseCheckout = () => {
    setCheckoutOpen(false);
    
    // Если мы в телеграме, показать главную кнопку снова
    const telegramApp = getTelegramWebApp();
    if (telegramApp && telegramApp.MainButton) {
      telegramApp.MainButton.show();
    }
  };
  
  // Использовать кнопку Telegram при открытии корзины
  useEffect(() => {
    if (isOpen && items.length > 0) {
      const telegramApp = getTelegramWebApp();
      
      if (telegramApp && telegramApp.MainButton) {
        telegramApp.MainButton.text = "Оформить заказ";
        telegramApp.MainButton.show();
        telegramApp.MainButton.onClick(handleOpenCheckout);
        
        // Убираем кнопку при закрытии корзины
        return () => {
          telegramApp.MainButton.hide();
          telegramApp.MainButton.offClick(handleOpenCheckout);
        };
      }
    }
  }, [isOpen, items.length]);
  
  // Calculate total
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  
  // Проверяем, запущено ли приложение в Telegram
  const inTelegram = isRunningInTelegram();

  if (!isOpen) return null;

  return (
    <>
      {/* Модальное окно оформления заказа */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={handleCloseCheckout}
        cartItems={items}
        totalPrice={total}
      />
      
      <div className="fixed inset-0 bg-black bg-opacity-50 z-20">
        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-xl transform transition-transform max-h-[90vh] flex flex-col">
          <div className="p-3 sm:p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">Корзина</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-300" />
                  <p className="mt-4 text-sm sm:text-base text-gray-500">Ваша корзина пуста</p>
                  <Button
                    onClick={onClose}
                    variant="link"
                    className="mt-3 sm:mt-4 text-[#0088CC] font-medium text-sm sm:text-base"
                  >
                    Продолжить покупки
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="flex items-center border-b border-gray-100 pb-3 sm:pb-4"
                  >
                    <div className="h-14 w-14 sm:h-16 sm:w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                      <div className="flex justify-between">
                        <div className="pr-2">
                          <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                            {item.product.name}
                          </h4>
                          {item.size && (
                            <p className="text-xs sm:text-sm text-gray-500">
                              Размер: {item.size}
                            </p>
                          )}
                        </div>
                        <div className="text-sm sm:text-base font-medium text-[#0088CC]">
                          {formatPrice(item.product.price * item.quantity)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          <div className="flex items-center border rounded-md overflow-hidden">
                            <button 
                              onClick={() => onUpdateQuantity(item.product.id, item.size, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="px-1.5 sm:px-2 py-1 text-gray-500 disabled:opacity-50"
                              aria-label="Уменьшить количество"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            
                            <span className="px-2 text-sm font-medium min-w-[24px] text-center">
                              {item.quantity}
                            </span>
                            
                            <button 
                              onClick={() => onUpdateQuantity(item.product.id, item.size, item.quantity + 1)}
                              className="px-1.5 sm:px-2 py-1 text-gray-500"
                              aria-label="Увеличить количество"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.size, 0)}
                          className="text-xs sm:text-sm text-red-500 hover:text-red-700"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {items.length > 0 && (
            <div className="p-3 sm:p-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <span className="text-sm sm:text-base font-medium text-gray-900">Итого:</span>
                <span className="text-base sm:text-lg font-bold text-[#0088CC]">
                  {formatPrice(total)}
                </span>
              </div>
              
              <Button
                onClick={handleOpenCheckout}
                className="w-full bg-[#0088CC] hover:bg-[#0077B5] text-white text-sm sm:text-base py-2 sm:py-2.5"
              >
                Оформить заказ
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}