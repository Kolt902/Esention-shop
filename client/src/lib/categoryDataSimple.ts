// Используем официальные изображения товаров в бело-серых тонах (все с белым фоном)
// Категория Кроссовки (Sneakers)
const sneakersUrl = "https://secure-images.nike.com/is/image/DotCom/CW2288_111?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0";

// Категория Штаны (Pants)
const pantsUrl = "https://secure-images.nike.com/is/image/DotCom/BV2671_010?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0";

// Категория Футболки (T-Shirts)
const tshirtsUrl = "https://secure-images.nike.com/is/image/DotCom/AR6029_010?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0";

// Категория Худи (Hoodies)
const hoodiesUrl = "https://secure-images.nike.com/is/image/DotCom/BV2654_010?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0";

// Категория Спортивные костюмы (Tracksuits)
const tracksuitsUrl = "https://secure-images.nike.com/is/image/DotCom/CU4962_010?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0";

// Категория Аксессуары (Accessories)
const accessoriesUrl = "https://secure-images.nike.com/is/image/DotCom/9A0070_023?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0";

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
    imageUrl: sneakersUrl,
  },
  {
    id: 'pants',
    title: 'Штаны',
    imageUrl: pantsUrl,
  },
  {
    id: 'tshirts',
    title: 'Футболки',
    imageUrl: tshirtsUrl,
  },
  {
    id: 'hoodies',
    title: 'Худи',
    imageUrl: hoodiesUrl,
  },
  {
    id: 'clothing',
    title: 'Костюмы',
    imageUrl: tracksuitsUrl,
  },
  {
    id: 'accessories',
    title: 'Аксессуары',
    imageUrl: accessoriesUrl,
  },
];