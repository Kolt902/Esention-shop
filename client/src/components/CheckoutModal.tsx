import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/lib/StoreContext";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DeliveryForm, { DeliveryFormData } from "./DeliveryForm";
import { X } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { CartItem } from '@/lib/types';

// Схема валидации для формы заказа
const orderFormSchema = z.object({
  deliveryNotes: z.string().optional(),
  paymentMethod: z.enum(["cash", "card", "online"]),
  referralCode: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderFormSchema>;

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totalPrice: number;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  totalPrice,
}: CheckoutModalProps) {
  const { t, referralCode: savedReferralCode } = useStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("delivery");
  const [deliveryData, setDeliveryData] = useState<DeliveryFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  // Initialize form with react-hook-form
  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      deliveryNotes: "",
      paymentMethod: "cash",
      referralCode: savedReferralCode || "",
    },
  });

  // Handle delivery form submission
  const handleDeliverySubmit = (data: DeliveryFormData) => {
    setDeliveryData(data);
    setActiveTab("payment");
  };

  // Handle order form submission
  const handleOrderSubmit = async (data: OrderFormData) => {
    if (!deliveryData) {
      toast({
        title: "Ошибка",
        description: "Введите данные для доставки",
        variant: "destructive",
      });
      setActiveTab("delivery");
      return;
    }

    setIsSubmitting(true);

    try {
      // Combine delivery data and order data
      const orderData = {
        ...deliveryData,
        ...data,
      };

      // Submit order to API
      const response = await apiRequest("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const orderId = response && typeof response === 'object' ? response.id : 'new';
      
      toast({
        title: t.cart.orderSuccess,
        description: `Заказ #${orderId} успешно оформлен`,
      });

      onClose();
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: t.cart.orderError,
        description: "Не удалось оформить заказ. Попробуйте еще раз.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика отправки заказа
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-30">
      <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Оформление заказа</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Имя
              </label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1"
                placeholder="Введите ваше имя"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Телефон
              </label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1"
                placeholder="+7 (___) ___-__-__"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Адрес доставки
              </label>
              <Input
                id="address"
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1"
                placeholder="Введите адрес доставки"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Ваш заказ</h4>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}`}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-600">
                    {item.product.name} {item.size && `(${item.size})`} x {item.quantity}
                  </span>
                  <span className="font-medium">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-base font-medium text-gray-900">Итого к оплате:</span>
              <span className="text-lg font-bold text-[#0088CC]">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#0088CC] hover:bg-[#0077B5] text-white"
            >
              Подтвердить заказ
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}