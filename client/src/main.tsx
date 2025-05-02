import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initTelegramWebApp, isRunningInTelegram } from "./lib/telegram";

// Настраиваем глобальный обработчик ошибок для лучшей отладки в Telegram
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  
  // Создаем видимое сообщение об ошибке для отладки в Telegram
  if (isRunningInTelegram()) {
    const errorElement = document.createElement('div');
    errorElement.style.position = 'fixed';
    errorElement.style.bottom = '20px';
    errorElement.style.left = '20px';
    errorElement.style.right = '20px';
    errorElement.style.backgroundColor = 'rgba(255,0,0,0.8)';
    errorElement.style.color = 'white';
    errorElement.style.padding = '10px';
    errorElement.style.borderRadius = '5px';
    errorElement.style.zIndex = '9999';
    errorElement.style.fontSize = '12px';
    errorElement.style.fontFamily = 'monospace';
    errorElement.innerText = `Error: ${event.error?.message || 'Unknown error'}`;
    document.body.appendChild(errorElement);
    
    // Автоматически удаляем через 5 секунд
    setTimeout(() => {
      try {
        document.body.removeChild(errorElement);
      } catch (e) {
        // Игнорируем ошибки при удалении
      }
    }, 5000);
  }
});

// Инициализируем Telegram WebApp до монтирования React приложения
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM loaded, initializing Telegram WebApp...");
  
  // Пытаемся инициализировать Telegram WebApp
  const success = initTelegramWebApp();
  
  if (success) {
    console.log("Telegram WebApp successfully initialized");
  } else {
    console.log("Telegram WebApp not available or initialization failed, running in standalone mode");
  }
});

// Монтируем React-приложение
createRoot(document.getElementById("root")!).render(<App />);
