import { X, ShoppingBag, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Product } from "@shared/schema";
import { useEffect } from "react";
import { getTelegramWebApp, isRunningInTelegram } from "@/lib/telegram";

interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (productId: number) => void;
  onCheckout: () => void;
}

export default function CartModal({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onCheckout,
}: CartModalProps) {
  // Использовать кнопку Telegram при открытии корзины
  useEffect(() => {
    if (isOpen && items.length > 0) {
      const telegramApp = getTelegramWebApp();
      
      if (telegramApp && telegramApp.MainButton) {
        telegramApp.MainButton.text = "Оформить заказ";
        telegramApp.MainButton.show();
        telegramApp.MainButton.onClick(onCheckout);
        
        // Убираем кнопку при закрытии корзины
        return () => {
          telegramApp.MainButton.hide();
          telegramApp.MainButton.offClick(onCheckout);
        };
      }
    }
  }, [isOpen, items.length, onCheckout]);
  
  // Calculate total
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  
  // Проверяем, запущено ли приложение в Telegram
  const inTelegram = isRunningInTelegram();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-20">
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-xl transform transition-transform">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Корзина</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="h-16 w-16 mx-auto text-gray-300" />
              <p className="mt-4 text-gray-500">Ваша корзина пуста</p>
              <Button
                onClick={onClose}
                variant="link"
                className="mt-4 text-[#0088CC] font-medium"
              >
                Продолжить покупки
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.product.id}-${item.size}`}
                className="flex items-center border-b border-gray-100 pb-4"
              >
                <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {item.product.name}
                      </h4>
                      {item.size && (
                        <p className="text-xs text-gray-500">
                          Размер: {item.size}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Количество: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-[#0088CC]">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="mt-1 text-xs text-red-500"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">Итого:</span>
            <span className="font-bold text-lg text-[#0088CC]">
              {formatPrice(total)}
            </span>
          </div>
          <Button
            onClick={onCheckout}
            disabled={items.length === 0}
            className="w-full bg-[#0088CC] hover:bg-[#006699] text-white py-3 px-4 rounded-md font-medium transition-colors"
          >
            Оформить заказ
          </Button>
        </div>
      </div>
    </div>
  );
}
