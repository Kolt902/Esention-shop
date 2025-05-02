import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "@/hooks/use-toast";

/**
 * Combines multiple class names into a single string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Show a notification using the toast system
 */
export function showNotification(title: string, description?: string, variant: "default" | "destructive" = "default") {
  toast({
    title,
    description,
    variant
  });
}

/**
 * Checks if the image URL is valid
 */
export function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  
  // Simple URL validation
  return url.startsWith('http') && (
    url.endsWith('.jpg') || 
    url.endsWith('.jpeg') || 
    url.endsWith('.png') || 
    url.endsWith('.webp') || 
    url.endsWith('.svg') ||
    url.includes('images')
  );
}

/**
 * Gets default image for a product category
 */
export function getCategoryDefaultImage(category: string): string {
  const categoryMap: Record<string, string> = {
    'lifestyle': '/categories/lifestyle-default.jpg',
    'running': '/categories/running-default.jpg',
    'basketball': '/categories/basketball-default.jpg',
    'football': '/categories/football-default.jpg',
    'tshirts': '/categories/tshirts-default.jpg',
    'hoodies': '/categories/hoodies-default.jpg',
    'pants': '/categories/pants-default.jpg',
    'accessories': '/categories/accessories-default.jpg'
  };
  
  return categoryMap[category.toLowerCase()] || '/placeholder-product.svg';
}

/**
 * Formats a date string into a localized format
 */
export function formatDate(dateString: string, locale: string = 'ru-RU'): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Truncates text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text || '';
  return text.slice(0, maxLength) + '...';
}

/**
 * Generate a random string
 */
export function generateId(length: number = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Validates an image URL by attempting to load it
 */
export function validateImageUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/**
 * Formats price in cents to a currency string
 */
export function formatPrice(priceInCents: number, currency: string = '€'): string {
  return `${currency}${(priceInCents / 100).toFixed(2)}`;
}

/**
 * Delays execution for specified milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Safely parse JSON, returning defaultValue on error
 */
export function safeJSONParse<T>(json: string, defaultValue: T): T {
  try {
    return JSON.parse(json) as T;
  } catch (e) {
    return defaultValue;
  }
}

/**
 * Gets browser preferred language or fallback
 */
export function getBrowserLanguage(fallback: string = 'en'): string {
  if (typeof navigator === 'undefined') return fallback;
  
  const browserLang = navigator.language || (navigator as any).userLanguage;
  if (!browserLang) return fallback;
  
  // Extract primary language code (e.g., 'en-US' -> 'en')
  const primaryLang = browserLang.split('-')[0].toLowerCase();
  
  return primaryLang || fallback;
}

/**
 * Checks if the app is running in Telegram
 */
export function isTelegramWebApp(): boolean {
  return !!(window.Telegram && window.Telegram.WebApp);
}

/**
 * Gets Telegram user data if available
 */
export function getTelegramUser() {
  if (isTelegramWebApp() && window.Telegram.WebApp.initDataUnsafe?.user) {
    return window.Telegram.WebApp.initDataUnsafe.user;
  }
  return null;
}

/**
 * Gets the ThemeParams from Telegram WebApp
 */
export function getTelegramTheme() {
  if (isTelegramWebApp() && window.Telegram.WebApp.themeParams) {
    return window.Telegram.WebApp.themeParams;
  }
  return null;
}

/**
 * Converts technical category names to user-friendly names
 */
export function getCategoryDisplayName(category: string): string {
  const categoryNames: Record<string, string> = {
    'tshirts': 'Футболки',
    'hoodies': 'Толстовки',
    'sneakers': 'Кроссовки',
    'pants': 'Брюки',
    'accessories': 'Аксессуары',
    'basketball': 'Баскетбол',
    'running': 'Бег',
    'lifestyle': 'Повседневная одежда',
    'training': 'Спортивная одежда',
    'shoes': 'Обувь',
    'bags': 'Сумки',
    'jewelry': 'Украшения',
    'dresses': 'Платья',
    'coats': 'Верхняя одежда',
    'shirts': 'Рубашки',
  };
  
  return categoryNames[category] || category;
}