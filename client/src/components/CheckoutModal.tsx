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
import { CartItem } from "@/pages/StorePage";

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
        body: JSON.stringify(orderData),
      });

      toast({
        title: t.cart.orderSuccess,
        description: `Заказ #${response.id} успешно оформлен`,
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.cart.checkout}</DialogTitle>
          <DialogDescription>
            Заполните информацию для доставки и оплаты
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="delivery" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="delivery">Доставка</TabsTrigger>
            <TabsTrigger value="payment" disabled={!deliveryData}>
              Оплата
            </TabsTrigger>
          </TabsList>

          {/* Delivery Tab */}
          <TabsContent value="delivery" className="space-y-4 py-2">
            <DeliveryForm onSubmit={handleDeliverySubmit} />
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment" className="space-y-4 py-2">
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Детали заказа</h3>
              <div className="border rounded-md p-4 mb-4">
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex justify-between">
                      <div>
                        <span className="font-medium">{item.product.name}</span>
                        {item.size && <span className="text-sm ml-2">({item.size})</span>}
                        <span className="text-sm ml-2">x{item.quantity}</span>
                      </div>
                      <div>€{(item.product.price / 100) * item.quantity}</div>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                    <div>{t.cart.total}:</div>
                    <div>€{totalPrice / 100}</div>
                  </div>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleOrderSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Способ оплаты</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="cash" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Наличными при получении
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="card" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Картой при получении
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="online" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Онлайн оплата (скоро)
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deliveryNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Комментарий к заказу</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Дополнительная информация для курьера"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="referralCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Реферальный код</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Введите реферальный код если есть"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("delivery")}
                    >
                      Назад
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? t.cart.processing : t.cart.checkout}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}