// Импортируем изображения для категорий в стиле SNIPES
import sneakersImg from '@assets/5235759361291318072.jpg'; // Кроссовки
import clothingImg from '@assets/5235752188695933225.jpg'; // Одежда
import tshirtsImg from '@assets/5235826719263420314.jpg'; // Футболки
import hoodiesImg from '@assets/5235759361291318073.jpg'; // Худи
import accessoriesImg from '@assets/5235759361291318071.jpg'; // Аксессуары
import pantsImg from '@assets/5235689757051321832.jpg'; // Брюки/штаны

// Определяем структуру категории в простом стиле SNIPES
export interface SimpleCategoryData {
  id: string;
  title: string;
  imageUrl: string;
}

// Создаем массив данных для категорий
export const simpleCategoryData: SimpleCategoryData[] = [
  {
    id: 'sneakers',
    title: 'Кроссовки',
    imageUrl: sneakersImg,
  },
  {
    id: 'pants',
    title: 'Брюки',
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
    title: 'Спортивные костюмы',
    imageUrl: clothingImg,
  },
  {
    id: 'accessories',
    title: 'Аксессуары',
    imageUrl: accessoriesImg,
  },
];