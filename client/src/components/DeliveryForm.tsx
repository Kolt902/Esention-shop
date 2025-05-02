import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/lib/StoreContext";
import { apiRequest } from "@/lib/queryClient";

// Схема валидации для формы адреса доставки
const deliveryAddressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phoneNumber: z.string().min(5, "Phone number is required"),
  country: z.string().min(2, "Country is required"),
  city: z.string().min(2, "City is required"),
  address: z.string().min(5, "Address is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  isDefault: z.boolean().default(false),
});

export type DeliveryFormData = z.infer<typeof deliveryAddressSchema>;

interface DeliveryFormProps {
  onSubmit: (data: DeliveryFormData) => void;
  onCancel?: () => void;
  initialData?: DeliveryFormData;
  isLoading?: boolean;
}

export default function DeliveryForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}: DeliveryFormProps) {
  const { t } = useStore();
  const { toast } = useToast();
  
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [loadingSavedAddresses, setLoadingSavedAddresses] = useState(false);
  const [selectedSavedAddress, setSelectedSavedAddress] = useState<number | null>(null);

  // Initialize form with react-hook-form
  const form = useForm<DeliveryFormData>({
    resolver: zodResolver(deliveryAddressSchema),
    defaultValues: initialData || {
      fullName: "",
      phoneNumber: "",
      country: "",
      city: "",
      address: "",
      postalCode: "",
      isDefault: false,
    },
  });

  // Fetch saved addresses on component mount
  useState(() => {
    const fetchAddresses = async () => {
      setLoadingSavedAddresses(true);
      try {
        const addresses = await apiRequest('/api/delivery-addresses');
        setSavedAddresses(addresses);
      } catch (error) {
        console.error('Error fetching saved addresses:', error);
        toast({
          title: t.cart.orderError,
          description: 'Failed to load saved addresses',
          variant: 'destructive',
        });
      } finally {
        setLoadingSavedAddresses(false);
      }
    };
    
    fetchAddresses();
  }, []);
  
  // Handler for selecting a saved address
  const handleSelectSavedAddress = (addressId: number) => {
    const selectedAddress = savedAddresses.find(addr => addr.id === addressId);
    if (selectedAddress) {
      form.reset({
        fullName: selectedAddress.fullName,
        phoneNumber: selectedAddress.phoneNumber,
        country: selectedAddress.country,
        city: selectedAddress.city,
        address: selectedAddress.address,
        postalCode: selectedAddress.postalCode,
        isDefault: selectedAddress.isDefault,
      });
      setSelectedSavedAddress(addressId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Saved addresses selection */}
      {savedAddresses.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Сохраненные адреса</h3>
          <div className="flex flex-col gap-2">
            {savedAddresses.map((address) => (
              <Button
                key={address.id}
                type="button"
                variant={selectedSavedAddress === address.id ? "default" : "outline"}
                className="justify-start"
                onClick={() => handleSelectSavedAddress(address.id)}
              >
                <div className="text-left">
                  <div className="font-medium">{address.fullName}</div>
                  <div className="text-sm text-muted-foreground">
                    {address.address}, {address.city}, {address.country}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Delivery address form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Полное имя</FormLabel>
                  <FormControl>
                    <Input placeholder="Иван Иванов" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Номер телефона</FormLabel>
                  <FormControl>
                    <Input placeholder="+7 999 123 45 67" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Страна</FormLabel>
                  <FormControl>
                    <Input placeholder="Россия" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Город</FormLabel>
                  <FormControl>
                    <Input placeholder="Москва" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel>Адрес</FormLabel>
                  <FormControl>
                    <Input placeholder="ул. Пушкина, д. 10, кв. 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Почтовый индекс</FormLabel>
                  <FormControl>
                    <Input placeholder="123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-5">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Сохранить этот адрес как адрес по умолчанию
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                {t.common.cancel}
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t.cart.processing : t.cart.checkout}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}