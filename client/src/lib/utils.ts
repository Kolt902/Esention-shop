import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function for conditional class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function for formatting prices
export function formatPrice(price: number) {
  return `${price.toLocaleString()} ₽`;
}

// Utility for showing notifications
export function showNotification(message: string) {
  // Check if we're in browser
  if (typeof window !== 'undefined') {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Fade in
    setTimeout(() => {
      notification.style.opacity = '1';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

// Utility to check if a URL is valid
export function isValidImageUrl(url: string | undefined): boolean {
  if (!url) return false;
  return url.startsWith('http') && (
    url.endsWith('.jpg') || 
    url.endsWith('.jpeg') || 
    url.endsWith('.png') || 
    url.endsWith('.webp') || 
    url.endsWith('.gif') ||
    // URL with query parameters that point to images
    url.includes('/f_auto,q_auto') ||
    url.includes('_standard.jpg') ||
    url.includes('_laydown.jpg')
  );
}

// Function to get default image for a category
export function getCategoryDefaultImage(category: string): string {
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes('sneakers') || categoryLower.includes('shoes')) {
    return "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-mens-shoes-5QFp5Z.png";
  }
  
  if (categoryLower.includes('tshirts') || categoryLower.includes('t-shirt')) {
    return "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/5c3df1c5-7959-4414-a0f3-41da8bb3a137/sportswear-club-mens-t-shirt-N8Fnn0.png";
  }
  
  if (categoryLower.includes('hoodies') || categoryLower.includes('hoodie')) {
    return "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/gw1tzq9wrqoqhfvgjnvx/sportswear-club-fleece-mens-pullover-hoodie-p3MkK9.png";
  }
  
  if (categoryLower.includes('pants')) {
    return "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/5c289c21-3f30-4ff8-9bbd-9f3045d71b55/sportswear-tech-fleece-mens-joggers-2bw5fs.png";
  }
  
  // Generic default
  return "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-mens-shoes-5QFp5Z.png";
}

// Функция для преобразования названий категорий для отображения
export function getCategoryDisplayName(category: string): string {
  const categoryMap: { [key: string]: string } = {
    'lifestyle': 'Повседневные',
    'running': 'Беговые',
    'basketball': 'Баскетбольные',
    'football': 'Футбольные',
    'skateboarding': 'Скейтбординг',
    'tennis': 'Теннисные',
    'sneakers': 'Кроссовки',
    'tshirts': 'Футболки',
    'hoodies': 'Худи',
    'pants': 'Штаны',
    'shorts': 'Шорты',
    'jackets': 'Куртки',
    'accessories': 'Аксессуары',
    'mens': 'Мужское',
    'womens': 'Женское'
  };
  
  return categoryMap[category.toLowerCase()] || category;
}