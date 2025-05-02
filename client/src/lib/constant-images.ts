// Это статичные изображения, которые гарантированно загрузятся

// Базовые изображения для кроссовок
export const SNEAKER_BASE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Cpath d='M50,120 C60,110 90,105 120,110 C150,115 170,130 170,140 C170,150 160,155 150,155 C140,155 80,150 60,150 C40,150 35,160 30,160 C25,160 20,155 20,150 C20,145 40,130 50,120 Z' fill='%23444444'/%3E%3Cpath d='M65,125 C75,120 100,115 125,118 C150,121 165,130 165,138 C165,146 155,150 145,150 C135,150 85,145 65,145 C45,145 40,155 35,155 C30,155 25,150 25,145 C25,140 55,130 65,125 Z' fill='%23666666'/%3E%3Cpath d='M30,155 L30,160 L60,160 L60,155 Z' fill='%23888888'/%3E%3C/svg%3E`;

// Кофты/толстовки
export const HOODIE_BASE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Cpath d='M70,40 L130,40 L140,50 L140,140 L115,140 L115,160 L85,160 L85,140 L60,140 L60,50 Z' fill='%23444444'/%3E%3Cpath d='M70,40 L100,45 L130,40 L130,60 L100,70 L70,60 Z' fill='%23666666'/%3E%3Cpath d='M60,50 L70,40 L70,60 L60,70 Z' fill='%23555555'/%3E%3Cpath d='M140,50 L130,40 L130,60 L140,70 Z' fill='%23555555'/%3E%3C/svg%3E`;

// Футболки
export const TSHIRT_BASE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Cpath d='M50,40 L80,40 C80,40 90,30 100,30 C110,30 120,40 120,40 L150,40 L160,60 L140,80 L130,55 L130,150 L70,150 L70,55 L60,80 L40,60 Z' fill='%23444444'/%3E%3C/svg%3E`;

// Штаны
export const PANTS_BASE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Cpath d='M70,40 L130,40 L135,160 L115,160 L100,100 L85,160 L65,160 Z' fill='%23444444'/%3E%3Cpath d='M70,40 L130,40 L130,60 L70,60 Z' fill='%23666666'/%3E%3C/svg%3E`;

// Аксессуары
export const BAG_BASE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Cpath d='M60,70 L140,70 L150,160 L50,160 Z' fill='%23444444'/%3E%3Cpath d='M70,40 L130,40 L140,70 L60,70 Z' fill='%23666666'/%3E%3Cpath d='M80,40 L80,20 L120,20 L120,40 Z' fill='%23888888'/%3E%3C/svg%3E`;

// Брендовые кроссовки
export const NIKE_SHOE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Cpath d='M40,120 C50,110 90,105 120,110 C150,115 170,130 170,140 C170,150 160,155 150,155 C140,155 80,150 60,150 C40,150 35,160 30,160 C25,160 20,155 20,150 C20,145 40,130 40,120 Z' fill='%23ffffff' stroke='%23000000' stroke-width='2'/%3E%3Cpath d='M65,125 C75,120 100,115 125,118 C150,121 165,130 165,138' fill='none' stroke='%23000000' stroke-width='2'/%3E%3Cpath d='M30,155 L30,160 L60,160 L60,155 Z' fill='%23cccccc'/%3E%3Cpath d='M135,105 L170,75 L173,78 L140,110 Z' fill='%23000000'/%3E%3C/svg%3E`;

export const ADIDAS_SHOE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Cpath d='M40,120 C50,110 90,105 120,110 C150,115 170,130 170,140 C170,150 160,155 150,155 C140,155 80,150 60,150 C40,150 35,160 30,160 C25,160 20,155 20,150 C20,145 40,130 40,120 Z' fill='%23ffffff' stroke='%23000000' stroke-width='2'/%3E%3Cpath d='M80,125 L115,125 M75,115 L120,115 M85,135 L110,135' fill='none' stroke='%23000000' stroke-width='4'/%3E%3Cpath d='M30,155 L30,160 L60,160 L60,155 Z' fill='%23cccccc'/%3E%3C/svg%3E`;

// Функция для получения изображения по категории
export function getImageByCategory(category: string, brand?: string): string {
  // Проверка на бренд для специальных изображений
  if (brand) {
    if (brand.toLowerCase().includes('nike')) {
      return NIKE_SHOE;
    }
    if (brand.toLowerCase().includes('adidas')) {
      return ADIDAS_SHOE;
    }
  }
  
  // Маппинг категорий
  const categoryLower = category.toLowerCase();
  if (categoryLower.includes('shoes') || categoryLower.includes('кроссовки') || 
      categoryLower.includes('sneakers') || categoryLower.includes('running') || 
      categoryLower.includes('basketball')) {
    return SNEAKER_BASE;
  }
  
  if (categoryLower.includes('hoodie') || categoryLower.includes('кофт') || 
      categoryLower.includes('толстовк') || categoryLower.includes('jacket')) {
    return HOODIE_BASE;
  }
  
  if (categoryLower.includes('tshirt') || categoryLower.includes('футбол')) {
    return TSHIRT_BASE;
  }
  
  if (categoryLower.includes('pants') || categoryLower.includes('штан') || 
      categoryLower.includes('джинс') || categoryLower.includes('брюк')) {
    return PANTS_BASE;
  }
  
  if (categoryLower.includes('access') || categoryLower.includes('аксессуар') || 
      categoryLower.includes('bag') || categoryLower.includes('сумк')) {
    return BAG_BASE;
  }
  
  // Дефолтное изображение, если категория не определена
  return SNEAKER_BASE;
}