// Импортируем изображения для категорий в стиле SNIPES
// Используем существующие изображения в бело-серых тонах
import sneakersImg from '@assets/5235689757051321832.jpg'; // Кроссовки
import clothingImg from '@assets/5235752188695933225.jpg'; // Спортивные костюмы
import tshirtsImg from '@assets/5235826719263420314.jpg'; // Футболки
import hoodiesImg from '@assets/5235759361291318073.jpg'; // Худи
import accessoriesImg from '@assets/5235759361291318071.jpg'; // Аксессуары
import pantsImg from '@assets/5235752188695932056.jpg'; // Штаны

// Определяем структуру категории в простом стиле SNIPES
export interface SimpleCategoryData {
  id: string;
  title: string;
  imageUrl: string;
}

// Создаем массив данных для категорий с простыми названиями
export const simpleCategoryData: SimpleCategoryData[] = [
  {
    id: 'sneakers',
    title: 'Кроссовки',
    imageUrl: sneakersImg,
  },
  {
    id: 'pants',
    title: 'Штаны',
    imageUrl: pantsImg,
  },
  {
    id: 'tshirts',
    title: 'Футболки',
    imageUrl: tshirtsImg,
  },
  {
    id: 'hoodies',
    title: 'Худи',
    imageUrl: hoodiesImg,
  },
  {
    id: 'clothing',
    title: 'Костюмы',
    imageUrl: clothingImg,
  },
  {
    id: 'accessories',
    title: 'Аксессуары',
    imageUrl: accessoriesImg,
  },
];