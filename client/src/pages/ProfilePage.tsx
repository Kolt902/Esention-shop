import { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  ShoppingBag, 
  User, 
  MapPin, 
  Settings, 
  LogOut, 
  Heart,
  ArrowLeft
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useStore } from '@/lib/StoreContext';
import OrderHistoryList from '@/components/OrderHistoryList';
import AddressCard from '@/components/AddressCard';
import { FavoritesList } from '@/components/FavoritesList';
import { useNavigate } from 'wouter';
import { apiRequest } from '@/lib/queryClient';

export default function ProfilePage() {
  const { t, favorites } = useStore();
  const { toast } = useToast();
  const [, navigate] = useNavigate();
  const [activeTab, setActiveTab] = useState("orders");

  // Получаем информацию о пользователе
  const { data: user } = useQuery({
    queryKey: ['/api/user/profile'],
    retry: false,
    staleTime: 0,
  });

  // Получаем историю заказов пользователя
  const { data: orders, isLoading: isOrdersLoading } = useQuery({
    queryKey: ['/api/user/orders'],
    retry: false,
    staleTime: 0,
  });

  // Получаем сохраненные адреса пользователя
  const { data: addresses, isLoading: isAddressesLoading } = useQuery({
    queryKey: ['/api/user/addresses'],
    retry: false,
    staleTime: 0,
  });

  // Получаем избранные товары
  const { data: favoriteProducts, isLoading: isFavoritesLoading } = useQuery({
    queryKey: ['/api/products/favorites', favorites],
    queryFn: async () => {
      if (!favorites?.length) return [];
      return apiRequest('/api/products/favorites', {
        method: 'POST',
        body: { productIds: favorites }
      });
    },
    enabled: !!favorites?.length,
    staleTime: 0,
  });

  const handleLogout = async () => {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
      toast({
        title: t.profile.logoutSuccess,
        description: t.profile.logoutSuccessMessage,
      });
      
      // Перенаправляем на главную страницу
      navigate('/');
    } catch (error) {
      toast({
        title: t.profile.logoutError,
        description: t.profile.logoutErrorMessage,
        variant: "destructive",
      });
    }
  };

  // Обработчик для возврата назад
  const handleBackClick = () => {
    navigate('/');
  };

  // Получаем первые буквы имени для аватара
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  useEffect(() => {
    // Если Telegram WebApp доступен, скрываем кнопку "Назад" (будет использоваться нативная)
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.BackButton.show();
      window.Telegram.WebApp.BackButton.onClick(handleBackClick);
      
      return () => {
        window.Telegram.WebApp.BackButton.offClick(handleBackClick);
        window.Telegram.WebApp.BackButton.hide();
      };
    }
  }, []);

  return (
    <div className="container max-w-md mx-auto pb-16 pt-4">
      {/* Заголовок и кнопка возврата */}
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={handleBackClick}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold ml-2">{t.profile.title}</h1>
      </div>
      
      {/* Карточка профиля */}
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <Avatar className="h-16 w-16 mr-4">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback>{user?.username ? getInitials(user.username) : 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{user?.username || t.profile.guest}</h2>
              {user?.isAdmin && (
                <Badge variant="outline" className="mt-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  {t.admin.title}
                </Badge>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                {user?.telegramId ? `Telegram ID: ${user.telegramId}` : t.profile.notConnected}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-0">
          <Button 
            variant="outline"
            size="sm" 
            className="flex items-center" 
            onClick={() => navigate('/settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            {t.profile.settings}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center text-destructive border-destructive"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t.profile.logout}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Вкладки */}
      <Tabs defaultValue="orders" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="orders" className="flex items-center">
            <ShoppingBag className="h-4 w-4 mr-2" />
            {t.profile.orders}
          </TabsTrigger>
          <TabsTrigger value="addresses" className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            {t.profile.addresses}
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center">
            <Heart className="h-4 w-4 mr-2" />
            {t.profile.favorites}
          </TabsTrigger>
        </TabsList>
        
        {/* Содержимое вкладки с заказами */}
        <TabsContent value="orders">
          <OrderHistoryList orders={orders || []} isLoading={isOrdersLoading} />
        </TabsContent>
        
        {/* Содержимое вкладки с адресами */}
        <TabsContent value="addresses">
          {isAddressesLoading ? (
            <Card>
              <CardContent className="p-4 flex items-center justify-center h-32">
                <p>{t.loading}</p>
              </CardContent>
            </Card>
          ) : addresses?.length > 0 ? (
            <div className="space-y-4">
              {addresses.map((address) => (
                <AddressCard key={address.id} address={address} />
              ))}
              <Button 
                className="w-full mt-4" 
                variant="outline"
                onClick={() => navigate('/address/new')}
              >
                {t.profile.addNewAddress}
              </Button>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{t.profile.noAddresses}</CardTitle>
                <CardDescription>{t.profile.noAddressesDescription}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/address/new')}
                >
                  {t.profile.addFirstAddress}
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        {/* Содержимое вкладки с избранным */}
        <TabsContent value="favorites">
          <FavoritesList 
            products={favoriteProducts || []} 
            isLoading={isFavoritesLoading} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}