import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CalendarIcon, 
  PackageIcon, 
  TruckIcon, 
  CheckCircle, 
  Clock, 
  HelpCircle 
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useStore } from '@/lib/StoreContext';
import { ScrollArea } from "@/components/ui/scroll-area";

// Интерфейс для элемента заказа
interface OrderItem {
  id: number;
  productId: number;
  orderId: number;
  quantity: number;
  price: number;
  size?: string;
  product: {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
  };
}

// Интерфейс для заказа
interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

interface OrderHistoryListProps {
  orders: Order[];
  isLoading: boolean;
}

// Компонент для отображения списка заказов
export default function OrderHistoryList({ orders, isLoading }: OrderHistoryListProps) {
  const { t } = useStore();
  
  // Состояние для отслеживания развернутых заказов
  const [expandedOrders, setExpandedOrders] = useState<Record<number, boolean>>({});
  
  // Функция для переключения состояния развернутости заказа
  const toggleOrderExpanded = (orderId: number) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };
  
  // Получение статуса заказа на нужном языке
  const getOrderStatusText = (status: string) => {
    switch(status) {
      case 'pending': return t.orders.statusPending;
      case 'processing': return t.orders.statusProcessing;
      case 'shipped': return t.orders.statusShipped;
      case 'delivered': return t.orders.statusDelivered;
      case 'cancelled': return t.orders.statusCancelled;
      default: return status;
    }
  };
  
  // Получение цвета бейджа в зависимости от статуса
  const getOrderStatusVariant = (status: string): "default" | "outline" | "secondary" | "destructive" => {
    switch(status) {
      case 'pending': return "outline";
      case 'processing': return "secondary";
      case 'shipped': return "default";
      case 'delivered': return "default";
      case 'cancelled': return "destructive";
      default: return "outline";
    }
  };
  
  // Получение иконки в зависимости от статуса
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <Clock className="h-4 w-4 mr-1" />;
      case 'processing': return <PackageIcon className="h-4 w-4 mr-1" />;
      case 'shipped': return <TruckIcon className="h-4 w-4 mr-1" />;
      case 'delivered': return <CheckCircle className="h-4 w-4 mr-1" />;
      case 'cancelled': return <HelpCircle className="h-4 w-4 mr-1" />;
      default: return <Clock className="h-4 w-4 mr-1" />;
    }
  };

  // Форматирование цены
  const formatPrice = (price: number) => {
    return `€${(price / 100).toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4 flex items-center justify-center h-32">
          <p>{t.loading}</p>
        </CardContent>
      </Card>
    );
  }

  if (!orders?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t.profile.noOrders}</CardTitle>
          <CardDescription>{t.profile.noOrdersDescription}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => window.history.back()}
          >
            {t.profile.startShopping}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CardTitle className="text-base">
                  {t.orders.orderNumber}: {order.id}
                </CardTitle>
              </div>
              <Badge variant={getOrderStatusVariant(order.status)} className="flex items-center">
                {getStatusIcon(order.status)}
                {getOrderStatusText(order.status)}
              </Badge>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <div className="flex items-center">
                <CalendarIcon className="h-3 w-3 mr-1" />
                {formatDate(order.createdAt)}
              </div>
              <div className="font-medium">{formatPrice(order.totalPrice)}</div>
            </div>
          </CardHeader>
          
          <Separator />
          
          <CardContent className="pt-4 pb-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{t.orders.items}: {order.items.reduce((acc, item) => acc + item.quantity, 0)}</p>
                
                {/* Отображаем адрес доставки, если заказ развернут */}
                {expandedOrders[order.id] && order.shippingAddress && (
                  <div className="mt-4 text-sm">
                    <p className="font-medium mb-1">{t.checkout.deliveryDetails}:</p>
                    <p>{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.phone}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                )}
              </div>
              
              {/* Миниатюры товаров (показываем только до 3) */}
              <div className="flex -space-x-3">
                {order.items.slice(0, 3).map((item, index) => (
                  <div 
                    key={`${order.id}-${item.id}`} 
                    className="h-12 w-12 rounded-md border border-border overflow-hidden bg-background"
                  >
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-product.svg';
                      }}
                    />
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="h-12 w-12 rounded-md border border-border flex items-center justify-center bg-muted">
                    <span className="text-xs font-medium">+{order.items.length - 3}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Отображаем детали заказа, если заказ развернут */}
            {expandedOrders[order.id] && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">{t.orders.orderItems}:</p>
                <ScrollArea className="max-h-60">
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center">
                        <div className="h-14 w-14 rounded-md border border-border overflow-hidden flex-shrink-0 mr-3">
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-product.svg';
                            }}
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-sm font-medium truncate">{item.product.name}</p>
                          <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
                            <div className="flex items-center">
                              <span>{t.product.quantity}: {item.quantity}</span>
                              {item.size && (
                                <span className="ml-2">{t.product.size}: {item.size}</span>
                              )}
                            </div>
                            <span>{formatPrice(item.price)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => toggleOrderExpanded(order.id)}
            >
              {expandedOrders[order.id] ? t.orders.hideDetails : t.orders.showDetails}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}