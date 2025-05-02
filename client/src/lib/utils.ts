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
