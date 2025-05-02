// Файл для хранения надежных URL изображений, которые точно работают

// Кроссовки
export const SNEAKERS_IMAGES = [
  "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=640",
  "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=640",
  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=640",
  "https://images.unsplash.com/photo-1588361861040-ac9b1018f6d5?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=640"
];

// Футболки
export const TSHIRTS_IMAGES = [
  "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=640",
  "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=640",
  "https://images.unsplash.com/photo-1503341504253-dff4815485f1?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=640",
  "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=640"
];

// Толстовки и кофты
export const HOODIE_IMAGES = [
  "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=640",
  "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=640",
  "https://images.unsplash.com/photo-1565693413579-8a78d38c3b26?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=640",
  "https://images.unsplash.com/photo-1593757147298-e064ed5e7afc?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=640"
];

// Штаны
export const PANTS_IMAGES = [
  "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=640",
  "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=640",
  "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=640",
  "https://images.unsplash.com/photo-1548883354-7622d03aca27?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=640"
];

// Аксессуары
export const ACCESSORIES_IMAGES = [
  "https://images.unsplash.com/photo-1563903530908-afdd155d057a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=640",
  "https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=640",
  "https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=640",
  "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=640"
];

export const getImagesByCategory = (category: string, index: number = 0): string => {
  const categoryLower = category.toLowerCase();
  let images: string[] = [];
  
  // Выбираем массив изображений в зависимости от категории
  if (categoryLower.includes('shoes') || categoryLower.includes('кроссовки') || categoryLower.includes('обувь') || categoryLower.includes('sneakers') || categoryLower.includes('running') || categoryLower.includes('basketball')) {
    images = SNEAKERS_IMAGES;
  } else if (categoryLower.includes('tshirt') || categoryLower.includes('футболк') || categoryLower.includes('t-shirt') || categoryLower.includes('футб')) {
    images = TSHIRTS_IMAGES;
  } else if (categoryLower.includes('hoodie') || categoryLower.includes('кофт') || categoryLower.includes('толстовк') || categoryLower.includes('jacket') || categoryLower.includes('outerwear')) {
    images = HOODIE_IMAGES;
  } else if (categoryLower.includes('pants') || categoryLower.includes('штан') || categoryLower.includes('брюки') || categoryLower.includes('джинс') || categoryLower.includes('jeans')) {
    images = PANTS_IMAGES;
  } else if (categoryLower.includes('access') || categoryLower.includes('аксессуар') || categoryLower.includes('bag') || categoryLower.includes('сумк') || categoryLower.includes('hat') || categoryLower.includes('шап')) {
    images = ACCESSORIES_IMAGES;
  } else {
    // Если категория не определена, используем изображения кроссовок по умолчанию
    images = SNEAKERS_IMAGES;
  }
  
  // Берем изображение по индексу или первое, если индекс вне диапазона
  const imageIndex = index % images.length;
  return images[imageIndex];
};

// Дефолтное изображение, если ничего не подходит
export const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=640";