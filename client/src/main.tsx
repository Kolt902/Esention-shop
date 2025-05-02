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

// Улучшенная инициализация Telegram WebApp с повторными попытками
const initTelegramApp = () => {
  console.log("DOM loaded, initializing Telegram WebApp...");
  
  // Добавляем принудительное переопределение стилей Telegram для черных кнопок
  applyTelegramStyleOverrides();
  
  // Пытаемся инициализировать Telegram WebApp
  if (initTelegramWebApp()) {
    console.log("Telegram WebApp successfully initialized");
    return true;
  } else {
    console.log("First Telegram WebApp initialization attempt failed, will retry...");
    return false;
  }
};

// Функция для принудительного применения черных стилей для Telegram элементов
function applyTelegramStyleOverrides() {
  try {
    console.log("Applying aggressive style overrides for Telegram elements");
    
    // Создаем стиль, который будет принудительно менять все синие элементы Telegram на черные
    const styleElement = document.createElement('style');
    styleElement.setAttribute('id', 'telegram-style-overrides');
    styleElement.innerHTML = `
      /* Глобальное переопределение для Telegram элементов */
      button[style*="background"],
      div[style*="background-color: rgb(0, 136, 204)"],
      div[style*="background-color:#0088cc"],
      div[style*="background-color: #0088cc"],
      div[style*="background:rgb(0,136,204)"],
      div[style*="background:#0088cc"],
      button[style*="background-color: rgb(0, 136, 204)"],
      button[style*="background-color:#0088cc"],
      button[style*="background-color: #0088cc"],
      button[style*="background:rgb(0,136,204)"],
      button[style*="background:#0088cc"],
      .telegram-button,
      .bottom-nav-button,
      .navigation-button {
        background-color: #111111 !important;
        color: white !important;
        border-color: #111111 !important;
      }
      
      /* Для элементов навигации в мобильных приложениях Telegram */
      .navigation-button, 
      .bottom-nav-button,
      .mobile-nav-button,
      .telegram-nav-button,
      nav button,
      [class*="tg-"] button {
        background-color: #111111 !important;
        color: white !important;
      }
      
      /* Переопределение цветов ссылок */
      span[style*="color:rgb(0,136,204)"],
      span[style*="color: rgb(0, 136, 204)"],
      span[style*="color:#0088cc"],
      span[style*="color: #0088cc"] {
        color: #111111 !important;
      }
    `;
    
    // Удаляем существующий элемент стиля если он уже был добавлен
    const existingStyle = document.getElementById('telegram-style-overrides');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    document.head.appendChild(styleElement);
    
    // Запускаем интервал, который будет периодически проверять и исправлять новые элементы
    setInterval(() => {
      const elements = document.querySelectorAll('button, [role="button"], div, span');
      elements.forEach(element => {
        if (element instanceof HTMLElement) {
          const style = window.getComputedStyle(element);
          const backgroundColor = style.backgroundColor;
          const textColor = style.color;
          
          // Если это синий цвет Telegram (приблизительно RGB(0, 136, 204)) для фона
          if (backgroundColor.includes('rgb(0, 136, 204)') || 
              backgroundColor.includes('rgb(0,136,204)')) {
            element.style.backgroundColor = '#111111';
            element.style.color = 'white';
            element.style.borderColor = '#111111';
          }
          
          // Если это синий цвет Telegram для текста
          if (textColor.includes('rgb(0, 136, 204)') || 
              textColor.includes('rgb(0,136,204)')) {
            element.style.color = '#111111';
          }
        }
      });
    }, 500); // Проверяем каждые 500 мс
  } catch (error) {
    console.error('Error applying Telegram styles override:', error);
  }
};

// Инициализируем при загрузке
document.addEventListener('DOMContentLoaded', () => {
  // Первая попытка инициализации
  const success = initTelegramApp();
  
  // Если первая попытка не удалась, делаем вторую через небольшую задержку
  if (!success) {
    setTimeout(() => {
      console.log("Retrying Telegram WebApp initialization...");
      const retrySuccess = initTelegramApp();
      
      if (!retrySuccess) {
        console.log("Telegram WebApp initialization failed after retry, running in standalone mode");
      }
    }, 1000);
  }
});

// Монтируем React-приложение
createRoot(document.getElementById("root")!).render(<App />);
