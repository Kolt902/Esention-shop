import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import VirtualFittingScene from '../components/VirtualFitting/VirtualFittingScene';
import { Loader2, Info, Save } from "lucide-react";
import { useTranslation } from '../lib/translations';
import { apiRequest } from '@/lib/queryClient';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Схема валидации для параметров аватара
const avatarParamsSchema = z.object({
  height: z.number().min(120).max(220),
  weight: z.number().min(30).max(200),
  bodyType: z.enum(['slim', 'regular', 'athletic']),
  gender: z.enum(['male', 'female']),
});

type AvatarParams = z.infer<typeof avatarParamsSchema>;

// Тип для одежды
type VirtualClothingItem = {
  id: number;
  name: string;
  type: string;
  category: string;
  productId: number;
  modelPath: string;
  thumbnailUrl: string;
  colors: string[];
  sizes: string[];
};

const VirtualFittingPage = () => {
  const { t, lang } = useTranslation();
  const { toast } = useToast();
  
  // Состояние выбранных предметов гардероба
  const [selectedItems, setSelectedItems] = useState<{
    top?: VirtualClothingItem;
    bottom?: VirtualClothingItem; 
    shoes?: VirtualClothingItem;
    accessory?: VirtualClothingItem;
  }>({});
  
  // Состояние выбранных цветов и размеров
  const [selectedColors, setSelectedColors] = useState<Record<number, string>>({});
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});
  
  const [activeCategory, setActiveCategory] = useState<string>('tops');
  
  // Получаем параметры аватара пользователя
  const { 
    data: avatarParams,
    isLoading: paramsLoading,
    error: paramsError 
  } = useQuery({ 
    queryKey: ['/api/avatar/params'], 
    retry: false,
    enabled: true,
    // При ошибке возвращаем значения по умолчанию
    onError: () => {
      return {
        height: 175,
        weight: 70,
        bodyType: 'regular' as const,
        gender: 'male' as const,
        measurements: {}
      };
    }
  });
  
  // Форма для редактирования параметров
  const form = useForm<AvatarParams>({
    resolver: zodResolver(avatarParamsSchema),
    defaultValues: {
      height: avatarParams?.height || 175,
      weight: avatarParams?.weight || 70,
      bodyType: (avatarParams?.bodyType as any) || 'regular',
      gender: (avatarParams?.gender as any) || 'male',
    },
  });
  
  // Обновить значения формы когда получаем данные
  useEffect(() => {
    if (avatarParams) {
      form.reset({
        height: avatarParams.height,
        weight: avatarParams.weight,
        bodyType: avatarParams.bodyType as any,
        gender: avatarParams.gender as any,
      });
    }
  }, [avatarParams, form]);
  
  // Получаем виртуальную одежду по категории
  const { 
    data: clothingItems,
    isLoading: clothingLoading,
    error: clothingError 
  } = useQuery({ 
    queryKey: ['/api/avatar/clothing', activeCategory], 
    queryFn: async () => {
      const response = await fetch(`/api/avatar/clothing?category=${activeCategory}`);
      if (!response.ok) {
        throw new Error('Failed to fetch clothing items');
      }
      return response.json();
    }
  });
  
  // Получаем гардероб пользователя
  const { 
    data: wardrobe,
    isLoading: wardrobeLoading
  } = useQuery({ 
    queryKey: ['/api/avatar/wardrobe'], 
    retry: false,
    enabled: true
  });
  
  // Обработчик выбора предмета одежды
  const handleItemSelect = (item: VirtualClothingItem) => {
    const updatedItems = { ...selectedItems };
    
    // Устанавливаем предмет в соответствующую категорию
    switch (item.type) {
      case 'top':
        updatedItems.top = item;
        break;
      case 'bottom':
        updatedItems.bottom = item;
        break;
      case 'shoes':
        updatedItems.shoes = item;
        break;
      case 'accessory':
        updatedItems.accessory = item;
        break;
    }
    
    // Устанавливаем первый цвет и размер по умолчанию, если они не выбраны
    if (!selectedColors[item.id] && item.colors.length > 0) {
      setSelectedColors({
        ...selectedColors,
        [item.id]: item.colors[0]
      });
    }
    
    if (!selectedSizes[item.id] && item.sizes.length > 0) {
      setSelectedSizes({
        ...selectedSizes,
        [item.id]: item.sizes[0]
      });
    }
    
    setSelectedItems(updatedItems);
  };
  
  // Обработчик отправки формы с параметрами аватара
  const onSubmit = async (data: AvatarParams) => {
    try {
      // Отправляем данные на сервер
      const response = await apiRequest('/api/avatar/params', {
        method: 'POST',
        data
      });
      
      // Уведомляем пользователя об успехе
      toast({
        title: t.profile.avatarSaved,
        description: t.profile.avatarSavedDesc,
      });
      
      return response;
    } catch (error) {
      console.error("Error saving avatar params:", error);
      toast({
        title: t.error,
        description: t.profile.avatarSaveError,
        variant: "destructive"
      });
    }
  };
  
  // Добавляем предмет в гардероб
  const addToWardrobe = async (item: VirtualClothingItem) => {
    try {
      if (!selectedColors[item.id] || !selectedSizes[item.id]) {
        toast({
          title: t.error,
          description: t.profile.selectColorAndSize,
          variant: "destructive"
        });
        return;
      }
      
      const response = await apiRequest('/api/avatar/wardrobe', {
        method: 'POST',
        data: {
          clothingItemId: item.id,
          selectedColor: selectedColors[item.id],
          selectedSize: selectedSizes[item.id],
        }
      });
      
      toast({
        title: t.success,
        description: t.profile.addedToWardrobe,
      });
      
      return response;
    } catch (error) {
      console.error("Error adding to wardrobe:", error);
      toast({
        title: t.error,
        description: t.profile.errorAddingToWardrobe,
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
        {t.profile.virtualFitting}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Левая колонка - настройки аватара */}
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{t.profile.bodyParams}</CardTitle>
              <CardDescription>
                {t.profile.bodyParamsDesc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.profile.height} (см)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.profile.weight} (кг)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bodyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.profile.bodyType}</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="slim" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {t.profile.slim}
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="regular" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {t.profile.regular}
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="athletic" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {t.profile.athletic}
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
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.profile.gender}</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="male" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {t.profile.male}
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="female" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {t.profile.female}
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {t.common.saving}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        {/* Центральная колонка - 3D модель */}
        <div className="col-span-1 lg:col-span-2">
          <Card className="h-[600px] overflow-hidden">
            <CardContent className="p-0 h-full">
              {avatarParams ? (
                <VirtualFittingScene 
                  initialBodyParams={{
                    height: avatarParams.height,
                    weight: avatarParams.weight,
                    bodyType: avatarParams.bodyType as 'athletic' | 'slim' | 'regular',
                    gender: avatarParams.gender as 'male' | 'female',
                  }}
                  selectedItems={{
                    top: selectedItems.top,
                    bottom: selectedItems.bottom,
                    shoes: selectedItems.shoes,
                    accessory: selectedItems.accessory
                  }}
                  selectedColors={selectedColors}
                  selectedSizes={selectedSizes}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Вкладки с одеждой */}
      <Tabs defaultValue="tops" className="mt-8" onValueChange={(value) => setActiveCategory(value)}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="tops">{t.profile.tops}</TabsTrigger>
          <TabsTrigger value="bottoms">{t.profile.bottoms}</TabsTrigger>
          <TabsTrigger value="footwear">{t.profile.footwear}</TabsTrigger>
          <TabsTrigger value="accessories">{t.profile.accessories}</TabsTrigger>
        </TabsList>
        
        {/* Содержимое вкладок */}
        {['tops', 'bottoms', 'footwear', 'accessories'].map((category) => (
          <TabsContent key={category} value={category} className="mt-6">
            {clothingLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : clothingError ? (
              <div className="flex h-40 items-center justify-center">
                <p className="text-destructive">
                  {t.error}: {(clothingError as Error).message}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {clothingItems && clothingItems.map((item: VirtualClothingItem) => (
                  <Card key={item.id} className={`overflow-hidden ${
                    (selectedItems.top?.id === item.id ||
                     selectedItems.bottom?.id === item.id ||
                     selectedItems.shoes?.id === item.id ||
                     selectedItems.accessory?.id === item.id) 
                      ? 'ring-2 ring-primary' : ''
                  }`}>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm line-clamp-1">{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="aspect-square rounded-md overflow-hidden mb-3">
                        <img 
                          src={item.thumbnailUrl} 
                          alt={item.name}
                          className="h-full w-full object-cover transition-all hover:scale-105"
                        />
                      </div>
                      
                      {/* Выбор цвета */}
                      <div className="mb-3">
                        <Label className="text-xs mb-1 block">{t.product.color}</Label>
                        <div className="flex gap-1 flex-wrap">
                          {item.colors.map((color) => (
                            <button
                              key={`${item.id}-${color}`}
                              className={`w-6 h-6 rounded-full border ${
                                selectedColors[item.id] === color 
                                  ? 'ring-2 ring-primary' 
                                  : 'ring-1 ring-muted'
                              }`}
                              style={{ 
                                backgroundColor: color,
                                // Для белого цвета нужна дополнительная рамка
                                border: color === 'white' ? '1px solid #e5e7eb' : 'none'
                              }}
                              onClick={() => setSelectedColors({
                                ...selectedColors,
                                [item.id]: color
                              })}
                              aria-label={`Select ${color} color`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {/* Выбор размера */}
                      <div className="mb-3">
                        <Label className="text-xs mb-1 block">{t.product.size}</Label>
                        <div className="flex gap-1 flex-wrap">
                          {item.sizes.map((size) => (
                            <button
                              key={`${item.id}-${size}`}
                              className={`min-w-[2.5rem] h-7 text-xs rounded border px-2 ${
                                selectedSizes[item.id] === size 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-background hover:bg-muted'
                              }`}
                              onClick={() => setSelectedSizes({
                                ...selectedSizes,
                                [item.id]: size
                              })}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between p-4 pt-0">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleItemSelect(item)}
                      >
                        {t.profile.tryOn}
                      </Button>
                      
                      <Button 
                        size="sm"
                        onClick={() => addToWardrobe(item)}
                      >
                        {t.profile.addToWardrobe}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Раздел виртуального гардероба */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">
          {t.profile.myWardrobe}
        </h2>
        
        {wardrobeLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : wardrobe && wardrobe.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Тут будет отображение гардероба пользователя */}
            {/* Пока заглушка */}
            <Card className="bg-muted/40">
              <CardHeader>
                <CardTitle>{t.profile.comingSoon}</CardTitle>
                <CardDescription>
                  {t.profile.wardrobeDesc}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        ) : (
          <Card className="bg-muted/40">
            <CardHeader>
              <CardTitle>{t.profile.emptyWardrobe}</CardTitle>
              <CardDescription>
                {t.profile.tryItemsAndAdd}
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VirtualFittingPage;