// Импортируем изображения для категорий
import menFashionPath from '@assets/5235759361291318072.jpg';
import womenFashionPath from '@assets/5235759361291318071.jpg';
import oldMoneyPath from '@assets/5235752188695933225.jpg';
import streetwearPath from '@assets/5235759361291318073.jpg';
import accessoriesPath from '@assets/5235826719263420314.jpg';

// Определяем структуру категории
export interface CategoryData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

// Создаем массив данных для категорий
export const categoryData: CategoryData[] = [
  {
    id: 'men',
    title: 'Мужская мода',
    description: 'Стильная одежда для мужчин',
    imageUrl: menFashionPath,
  },
  {
    id: 'women',
    title: 'Женская мода',
    description: 'Элегантная одежда для женщин',
    imageUrl: womenFashionPath,
  },
  {
    id: 'oldmoney',
    title: 'Old Money',
    description: 'Элегантный и утонченный стиль',
    imageUrl: oldMoneyPath,
  },
  {
    id: 'streetwear',
    title: 'Стритвир',
    description: 'Уличная мода',
    imageUrl: streetwearPath,
  },
  {
    id: 'accessories',
    title: 'Аксессуары',
    description: 'Сумки, очки, украшения',
    imageUrl: accessoriesPath,
  },
];

// Функция для получения категории по ID
export const getCategoryById = (id: string): CategoryData | undefined => {
  return categoryData.find(category => category.id === id);
};