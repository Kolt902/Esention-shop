import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/lib/StoreContext';

// UI components
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

// Схема формы настроек пользователя
const profileFormSchema = z.object({
  email: z.string().email().optional().or(z.literal('')),
  fullName: z.string().optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().optional(),
  preferences: z.object({
    language: z.enum(['ru', 'en', 'pl', 'cs', 'de']),
    theme: z.enum(['light', 'dark', 'auto']),
    currency: z.enum(['EUR', 'USD', 'RUB', 'PLN'])
  }),
  notificationSettings: z.object({
    orderUpdates: z.boolean().default(true),
    promotions: z.boolean().default(false),
    newArrivals: z.boolean().default(false),
    priceDrops: z.boolean().default(false)
  })
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileSettingsPage() {
  const { t } = useStore();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('general');

  // Получаем профиль пользователя
  const { data: profile, isLoading } = useQuery({
    queryKey: ['/api/user/profile'],
    retry: false,
    staleTime: 0,
  });

  // Мутация для обновления профиля
  const updateProfileMutation = useMutation({
    mutationFn: async (values: Partial<ProfileFormValues>) => {
      return apiRequest('/api/user/profile', {
        method: 'PATCH',
        body: values
      });
    },
    onSuccess: () => {
      // Инвалидируем кеш профиля, чтобы получить обновленные данные
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
      toast({
        title: t.settings.profileUpdated,
        description: t.settings.profileUpdatedDescription
      });
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      toast({
        title: t.settings.updateError,
        description: t.settings.updateErrorDescription,
        variant: 'destructive'
      });
    }
  });

  // Настраиваем форму
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: '',
      fullName: '',
      phone: '',
      avatarUrl: '',
      preferences: {
        language: 'ru',
        theme: 'auto',
        currency: 'EUR'
      },
      notificationSettings: {
        orderUpdates: true,
        promotions: false,
        newArrivals: false,
        priceDrops: false
      }
    }
  });

  // Обновляем форму при получении данных профиля
  useEffect(() => {
    if (profile) {
      form.reset({
        email: profile.email || '',
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        avatarUrl: profile.avatarUrl || '',
        preferences: profile.preferences || {
          language: 'ru',
          theme: 'auto',
          currency: 'EUR'
        },
        notificationSettings: profile.notificationSettings || {
          orderUpdates: true,
          promotions: false,
          newArrivals: false,
          priceDrops: false
        }
      });
    }
  }, [profile, form]);

  // Обработчик для возврата назад
  const handleBackClick = () => {
    navigate('/profile');
  };

  // Обработчик отправки формы
  const onSubmit = (values: ProfileFormValues) => {
    updateProfileMutation.mutate(values);
  };

  // Получаем первые буквы имени для аватара
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Настраиваем кнопку назад для Telegram WebApp
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.BackButton.show();
      window.Telegram.WebApp.BackButton.onClick(handleBackClick);
      
      return () => {
        window.Telegram.WebApp.BackButton.offClick(handleBackClick);
        window.Telegram.WebApp.BackButton.hide();
      };
    }
  }, []);

  if (isLoading) {
    return (
      <div className="container max-w-md mx-auto p-4 flex items-center justify-center min-h-screen">
        <p>{t.common.loading}</p>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto pb-16 pt-4">
      {/* Заголовок и кнопка возврата */}
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={handleBackClick}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold ml-2">{t.settings.title}</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Профиль и аватар */}
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle>{t.settings.profile}</CardTitle>
              <CardDescription>{t.settings.profileDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarImage src={form.watch('avatarUrl')} />
                  <AvatarFallback>
                    {form.watch('fullName') ? getInitials(form.watch('fullName')) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <FormField
                    control={form.control}
                    name="avatarUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.settings.avatarUrl}</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/avatar.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.settings.fullName}</FormLabel>
                    <FormControl>
                      <Input placeholder={t.settings.fullNamePlaceholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.settings.email}</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.settings.phone}</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 234 567 8900" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Настройки и предпочтения */}
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle>{t.settings.preferences}</CardTitle>
              <CardDescription>{t.settings.preferencesDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="general">{t.settings.general}</TabsTrigger>
                  <TabsTrigger value="notifications">{t.settings.notifications}</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="preferences.language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.settings.language}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t.settings.selectLanguage} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ru">Русский</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="pl">Polski</SelectItem>
                            <SelectItem value="cs">Čeština</SelectItem>
                            <SelectItem value="de">Deutsch</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferences.theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.settings.theme}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t.settings.selectTheme} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="light">{t.settings.lightTheme}</SelectItem>
                            <SelectItem value="dark">{t.settings.darkTheme}</SelectItem>
                            <SelectItem value="auto">{t.settings.autoTheme}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferences.currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.settings.currency}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t.settings.selectCurrency} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="EUR">Euro (EUR)</SelectItem>
                            <SelectItem value="USD">US Dollar (USD)</SelectItem>
                            <SelectItem value="RUB">Russian Ruble (RUB)</SelectItem>
                            <SelectItem value="PLN">Polish Złoty (PLN)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="notificationSettings.orderUpdates"
                    render={({ field }) => (
                      <FormItem className="flex justify-between items-center">
                        <div>
                          <FormLabel>{t.settings.orderUpdates}</FormLabel>
                          <FormDescription>
                            {t.settings.orderUpdatesDescription}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={form.control}
                    name="notificationSettings.promotions"
                    render={({ field }) => (
                      <FormItem className="flex justify-between items-center">
                        <div>
                          <FormLabel>{t.settings.promotions}</FormLabel>
                          <FormDescription>
                            {t.settings.promotionsDescription}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={form.control}
                    name="notificationSettings.newArrivals"
                    render={({ field }) => (
                      <FormItem className="flex justify-between items-center">
                        <div>
                          <FormLabel>{t.settings.newArrivals}</FormLabel>
                          <FormDescription>
                            {t.settings.newArrivalsDescription}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={form.control}
                    name="notificationSettings.priceDrops"
                    render={({ field }) => (
                      <FormItem className="flex justify-between items-center">
                        <div>
                          <FormLabel>{t.settings.priceDrops}</FormLabel>
                          <FormDescription>
                            {t.settings.priceDropsDescription}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Кнопки действий */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBackClick}
            >
              {t.settings.cancel}
            </Button>
            <Button
              type="submit"
              className="flex items-center space-x-2"
              disabled={updateProfileMutation.isPending}
            >
              <Save className="h-4 w-4" />
              <span>{t.settings.saveChanges}</span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}