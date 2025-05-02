import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price from cents to currency display
export function formatPrice(cents: number, currency = '€') {
  const amount = cents / 100;
  return `${amount} ${currency}`;
}

// Create a notification/toast
export function showNotification(message: string, duration = 2000) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'fixed bottom-20 left-0 right-0 mx-auto w-4/5 max-w-sm bg-gray-800 text-white px-4 py-2 rounded-md text-center z-50';
  notification.textContent = message;
  
  // Add to DOM
  document.body.appendChild(notification);
  
  // Remove after duration
  setTimeout(() => {
    notification.classList.add('opacity-0');
    notification.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 500);
  }, duration);
}

// Функция для проверки валидности URL изображения
export function isValidImageUrl(url?: string | null): boolean {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
}

// Получить дефолтное изображение для категории
export function getCategoryDefaultImage(category: string): string {
  const defaultImages = {
    'lifestyle': 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/wh4kdbzp21qyi5v82kzr/air-force-1-07-mens-shoes-jBrhbr.png',
    'basketball': 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/47d48880-c1b5-469c-b29a-2f2483c0e76e/air-jordan-1-mid-shoes-86f1ZW.png',
    'running': 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/83cf81b9-9442-4c22-893d-ae6e2976b275/pegasus-40-mens-road-running-shoes-bRqpc7.png',
    'tshirts': 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/a8317dc4-6ec6-4bad-8136-030e5c46c952/sportswear-club-mens-t-shirt-ShrJfX.png',
    'pants': 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/b833d0da-e0f5-44db-9e56-7ab8844d6299/sportswear-mens-woven-pants-GpcRHw.png',
    'hoodies': 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/5af19f78-6625-46a0-adea-c4128e98f80b/sportswear-club-fleece-mens-pullover-hoodie-4J94q9.png',
    'default': 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/wh4kdbzp21qyi5v82kzr/air-force-1-07-mens-shoes-jBrhbr.png'
  };
  
  return defaultImages[category as keyof typeof defaultImages] || defaultImages.default;
}
