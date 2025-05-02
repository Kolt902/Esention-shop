// Здесь хранятся встроенные в проект изображения, которые гарантированно работают

// Используем надежные сервисы для хостинга изображений
// Это базовые URL для встроенных изображений с популярных и стабильных CDN

// Кроссовки Nike Air Force 1
export const NIKE_AIR_FORCE_1 = [
  "https://i.ibb.co/gTjzhky/Sneakers1-1.jpg",
  "https://i.ibb.co/LZz7QkR/Sneakers1-2.jpg",
  "https://i.ibb.co/3sfMv6j/Sneakers1-3.jpg"
];

// Кроссовки Nike Air Jordan 1
export const NIKE_AIR_JORDAN_1 = [
  "https://i.ibb.co/FJn3Zn2/Sneakers2-1.jpg",
  "https://i.ibb.co/3yZ2cFm/Sneakers2-2.jpg",
  "https://i.ibb.co/wJsY0zT/Sneakers2-3.jpg"
];

// Кроссовки Nike Dunk Low
export const NIKE_DUNK_LOW = [
  "https://i.ibb.co/GTc4Qrp/Sneakers3-1.jpg",
  "https://i.ibb.co/SNK0C5z/Sneakers3-2.jpg",
  "https://i.ibb.co/9nWyZwH/Sneakers3-3.jpg"
];

// Кроссовки Adidas Stan Smith
export const ADIDAS_STAN_SMITH = [
  "https://i.ibb.co/YWBf6tC/Sneakers4-1.jpg",
  "https://i.ibb.co/vZpbxYS/Sneakers4-2.jpg",
  "https://i.ibb.co/Nyg8yVG/Sneakers4-3.jpg"
];

// Разные категории кроссовок
export const SNEAKERS = [
  "https://i.ibb.co/cCfCv9f/Sneakers-Various1.jpg",
  "https://i.ibb.co/YfWKDSD/Sneakers-Various2.jpg",
  "https://i.ibb.co/0FcPBZX/Sneakers-Various3.jpg",
  "https://i.ibb.co/KWRk4P3/Sneakers-Various4.jpg"
];

// Футболки
export const TSHIRTS = [
  "https://i.ibb.co/z8h87dx/Tshirt1.jpg",
  "https://i.ibb.co/ydjR0Bh/Tshirt2.jpg",
  "https://i.ibb.co/QDc3rWn/Tshirt3.jpg",
  "https://i.ibb.co/tqDQHBH/Tshirt4.jpg"
];

// Толстовки и кофты
export const HOODIES = [
  "https://i.ibb.co/yPcdMSP/Hoodie1.jpg",
  "https://i.ibb.co/jVpNWZ9/Hoodie2.jpg",
  "https://i.ibb.co/QbqxmPT/Hoodie3.jpg",
  "https://i.ibb.co/XCxVGTL/Hoodie4.jpg"
];

// Штаны и брюки
export const PANTS = [
  "https://i.ibb.co/HKZW3xF/Pants1.jpg",
  "https://i.ibb.co/wWvWtQZ/Pants2.jpg",
  "https://i.ibb.co/6wtHxXP/Pants3.jpg",
  "https://i.ibb.co/KFBzQfj/Pants4.jpg"
];

// Аксессуары
export const ACCESSORIES = [
  "https://i.ibb.co/Dkcxb9g/Accessory1.jpg",
  "https://i.ibb.co/D9LxhLY/Accessory2.jpg",
  "https://i.ibb.co/sqKRNVN/Accessory3.jpg",
  "https://i.ibb.co/Sv2QYp6/Accessory4.jpg"
];

// Общее изображение-заглушка
export const DEFAULT_IMAGE = "https://i.ibb.co/1JDBxFq/Default.jpg";

// Карта соответствия названий продуктов и специфичных изображений
export const PRODUCT_IMAGE_MAP: Record<string, string[]> = {
  "Nike Air Force 1": NIKE_AIR_FORCE_1,
  "Nike Air Jordan 1": NIKE_AIR_JORDAN_1,
  "Nike Dunk Low": NIKE_DUNK_LOW,
  "Adidas Stan Smith": ADIDAS_STAN_SMITH,
};

// Карта соответствия категорий и изображений
export const CATEGORY_IMAGE_MAP: Record<string, string[]> = {
  "sneakers": SNEAKERS,
  "shoes": SNEAKERS,
  "кроссовки": SNEAKERS,
  "обувь": SNEAKERS,
  "lifestyle": SNEAKERS,
  "basketball": SNEAKERS,
  "running": SNEAKERS,
  
  "tshirts": TSHIRTS,
  "t-shirt": TSHIRTS,
  "футболки": TSHIRTS,
  "футболка": TSHIRTS,
  
  "hoodies": HOODIES,
  "hoodie": HOODIES,
  "кофты": HOODIES,
  "толстовки": HOODIES,
  "jacket": HOODIES,
  "куртки": HOODIES,
  "outerwear": HOODIES,
  
  "pants": PANTS,
  "штаны": PANTS,
  "брюки": PANTS,
  "джинсы": PANTS,
  "jeans": PANTS,
  
  "accessories": ACCESSORIES,
  "аксессуары": ACCESSORIES,
  "bags": ACCESSORIES,
  "сумки": ACCESSORIES,
  "hats": ACCESSORIES,
  "шапки": ACCESSORIES
};

// Получить изображение по названию продукта
export function getProductImage(productName: string, index: number = 0): string {
  // Поиск продукта по названию
  const matchKey = Object.keys(PRODUCT_IMAGE_MAP).find(
    (key) => productName.toLowerCase().includes(key.toLowerCase())
  );
  
  if (matchKey) {
    const images = PRODUCT_IMAGE_MAP[matchKey];
    const safeIndex = Math.abs(index) % images.length;
    return images[safeIndex];
  }
  
  return DEFAULT_IMAGE;
}

// Получить изображение по категории
export function getCategoryImage(category: string, index: number = 0): string {
  // Нормализуем категорию для поиска
  const categoryLower = category.toLowerCase();
  
  // Поиск подходящей категории
  const matchKey = Object.keys(CATEGORY_IMAGE_MAP).find(
    (key) => categoryLower.includes(key.toLowerCase())
  );
  
  if (matchKey) {
    const images = CATEGORY_IMAGE_MAP[matchKey];
    const safeIndex = Math.abs(index) % images.length;
    return images[safeIndex];
  }
  
  // Если категория не найдена, возвращаем изображение кроссовок по умолчанию
  const defaultImages = SNEAKERS;
  const safeIndex = Math.abs(index) % defaultImages.length;
  return defaultImages[safeIndex];
}

// Функция для получения гарантированно работающего изображения
export function getReliableImage(productName: string, category: string, index: number = 0): string {
  // Сначала пытаемся найти по имени продукта
  const productImage = getProductImage(productName, index);
  if (productImage !== DEFAULT_IMAGE) {
    return productImage;
  }
  
  // Если не нашли по имени, ищем по категории
  return getCategoryImage(category, index);
}