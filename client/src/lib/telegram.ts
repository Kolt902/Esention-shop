// Interface for Telegram WebApp object
interface TelegramWebApp {
  version?: string;  // Добавляем поле версии
  ready: () => void;
  close: () => void;
  expand: () => void;
  MainButton: {
    text: string;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
  };
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  openTelegramLink: (url: string) => void;
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    auth_date?: number;
    hash?: string;
  };
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
}

// Get the WebApp object from the window with version detection
export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === 'undefined') return null;
  
  if ('Telegram' in window && 'WebApp' in (window as any).Telegram) {
    const webApp = (window as any).Telegram.WebApp;
    
    // Лог версии для отладки
    try {
      const versionInfo = webApp.version || 'unknown';
      console.log(`Detected Telegram WebApp version: ${versionInfo}`);
    } catch (e) {
      console.log("Couldn't detect Telegram WebApp version");
    }
    
    return webApp;
  }
  return null;
}

// Initialize Telegram WebApp with enhanced error handling and retries
export function initTelegramWebApp(maxRetries = 3): boolean {
  try {
    console.log("Initializing Telegram Web App...");
    
    // Проверка наличия Window объекта
    if (typeof window === 'undefined') {
      console.error("Window object is not available");
      return false;
    }
    
    // Определяем, скаким методом мы должны инициализировать TG WebApp
    // (поведение зависит от версии Telegram WebApp API)
    let useInitializationMethod = 'auto';
    
    // Проверяем доступность объектов с подробным логированием
    if ('Telegram' in window) {
      console.log("√ Telegram object is available in window");
      
      if ('WebApp' in (window as any).Telegram) {
        console.log("√ WebApp object is available in Telegram");
        
        // Получаем объект WebApp
        const webApp = (window as any).Telegram.WebApp;
        
        // Логируем версию для отладки
        try {
          const versionInfo = webApp.version || 'unknown';
          console.log(`Detected Telegram WebApp version: ${versionInfo}`);
          
          // Определяем метод инициализации в зависимости от версии
          if (versionInfo && typeof versionInfo === 'string') {
            // Версия может быть в формате "6.0" или "6.5"
            const majorVersion = parseFloat(versionInfo);
            if (majorVersion >= 6.0) {
              useInitializationMethod = 'modern';
              console.log("Using modern WebApp initialization method (v6.0+)");
            } else {
              useInitializationMethod = 'legacy';
              console.log("Using legacy WebApp initialization method (<v6.0)");
            }
          }
        } catch (e) {
          console.warn("Couldn't detect Telegram WebApp version, using auto detection");
        }
        
        // Начинаем инициализацию с проверкой и повторными попытками
        return initializeWebAppWithRetries(maxRetries, useInitializationMethod);
      } else {
        console.warn("× WebApp object is NOT available in Telegram");
      }
    } else {
      console.warn("× Telegram object is NOT available in window");
    }
    
    // Если Telegram не доступен, используем запасной режим
    console.log("Telegram Web App not found, running in standalone mode");
    setFallbackColors();
    return false;
  } catch (error) {
    console.error("Error in main initTelegramWebApp function:", error);
    setFallbackColors();
    return false;
  }
}

// Вспомогательная функция для инициализации WebApp с повторными попытками
function initializeWebAppWithRetries(maxRetries: number, method: string): boolean {
  let retryCount = 0;
  let success = false;
  
  while (retryCount < maxRetries && !success) {
    try {
      const webApp = getTelegramWebApp();
      
      if (!webApp) {
        console.warn(`WebApp not available (attempt ${retryCount + 1}/${maxRetries})`);
        retryCount++;
        if (retryCount < maxRetries) {
          console.log(`Waiting before retry ${retryCount + 1}...`);
          // В браузере мы должны использовать setTimeout вместо await
          // Здесь делаем синхронную задержку между попытками
          const now = Date.now();
          while (Date.now() - now < 300 * retryCount) { /* синхронное ожидание */ }
        }
        continue;
      }
      
      // Call ready() to notify Telegram that we're ready
      console.log(`Attempting to initialize WebApp (attempt ${retryCount + 1}/${maxRetries})`);
      
      // 1. Инициализация с вызовом ready()
      if (method === 'auto' || method === 'modern' || method === 'legacy') {
        try {
          console.log("Calling WebApp.ready()");
          webApp.ready();
        } catch (readyError) {
          console.error("Error calling WebApp.ready():", readyError);
        }
      }
      
      // 2. Расширяем видимую область в Telegram (если поддерживается)
      try {
        if (typeof webApp.expand === 'function' && !webApp.isExpanded) {
          console.log("Expanding Telegram WebApp viewport");
          webApp.expand();
        }
      } catch (expandError) {
        console.warn("Error expanding Telegram viewport:", expandError);
      }
      
      // 3. Настройка цветов темы
      try {
        if (webApp.themeParams) {
          console.log("Applying Telegram theme parameters");
          
          // Маппинг параметров темы на CSS переменные
          const themeMapping = {
            bg_color: '--tg-theme-bg-color',
            text_color: '--tg-theme-text-color',
            button_color: '--tg-theme-button-color',
            button_text_color: '--tg-theme-button-text-color',
            hint_color: '--tg-theme-hint-color',
            link_color: '--tg-theme-link-color'
          };
          
          // Применяем все доступные параметры темы, но переопределяем цвета кнопок на черные
          Object.entries(themeMapping).forEach(([key, cssVar]) => {
            // Получаем значение из Telegram темы
            const value = webApp.themeParams[key as keyof typeof webApp.themeParams];
            
            // Для кнопок всегда устанавливаем черный цвет, независимо от параметров Telegram
            if (key === 'button_color') {
              document.documentElement.style.setProperty(cssVar, '#111111');
            } 
            // Для ссылок тоже устанавливаем черный цвет
            else if (key === 'link_color') {
              document.documentElement.style.setProperty(cssVar, '#111111');
            }
            // Для остальных параметров используем оригинальные значения
            else if (value) {
              document.documentElement.style.setProperty(cssVar, value);
            }
          });
          
          // Добавляем класс, чтобы CSS мог определить запуск в Telegram
          document.documentElement.classList.add('telegram-webapp');
        } else {
          console.log("No Telegram theme parameters found, using defaults");
          setFallbackColors();
        }
      } catch (themeError) {
        console.error("Error applying theme:", themeError);
        setFallbackColors();
      }
      
      // 4. Настройка кнопки возврата (если поддерживается)
      try {
        if (webApp.BackButton && typeof webApp.BackButton.hide === 'function') {
          webApp.BackButton.hide();
        }
      } catch (backError) {
        console.warn("BackButton operations not supported");
      }
      
      console.log("✓ Telegram Web App initialization complete");
      success = true;
      return true;
    } catch (error) {
      console.error(`Error during WebApp initialization (attempt ${retryCount + 1}):`, error);
      retryCount++;
      
      if (retryCount < maxRetries) {
        console.log(`Waiting before retry ${retryCount + 1}...`);
        // Синхронная задержка перед следующей попыткой
        const now = Date.now();
        while (Date.now() - now < 300 * retryCount) { /* синхронное ожидание */ }
      }
    }
  }
  
  if (!success) {
    console.error(`WebApp initialization failed after ${maxRetries} attempts, falling back to standalone mode`);
    setFallbackColors();
    return false;
  }
  
  return success;
}

// Set fallback colors for standalone mode or error cases
function setFallbackColors(): void {
  const fallbackColors = {
    '--tg-theme-bg-color': '#ffffff',
    '--tg-theme-text-color': '#000000',
    '--tg-theme-button-color': '#111111', // Changed from #0088CC to black
    '--tg-theme-button-text-color': '#ffffff',
    '--tg-theme-hint-color': '#999999',
    '--tg-theme-link-color': '#111111' // Changed from #0088CC to black
  };
  
  Object.entries(fallbackColors).forEach(([cssVar, color]) => {
    document.documentElement.style.setProperty(cssVar, color);
  });
  
  // Override default Telegram button styles directly
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    /* Force black buttons for Telegram interfaces */
    .telegram-button,
    .telegram-webapp button,
    .telegram-container button,
    *[style*="background-color: rgb(0, 136, 204)"],
    *[style*="background-color:#0088cc"],
    button[style*="background"],
    .tgme_widget_button,
    .web_app_button,
    .tgme_action_button_new,
    .tgme_widget_message_link,
    .tgme_widget_login_button {
      background-color: #111111 !important;
      border-color: #111111 !important;
    }
    
    /* Force black text links */
    *[style*="color: rgb(0, 136, 204)"],
    *[style*="color:#0088cc"],
    a[href^="tg://"],
    a[href^="https://t.me/"] {
      color: #111111 !important;
    }
  `;
  document.head.appendChild(styleTag);
}

// Open chat with the bot
export function openTelegramChat(): void {
  const webApp = getTelegramWebApp();
  if (webApp) {
    webApp.close();
  }
}

// Close the WebApp
export function closeTelegramWebApp(): void {
  const webApp = getTelegramWebApp();
  if (webApp) {
    webApp.close();
  }
}

// Get init data for API calls
export function getTelegramInitData(): string {
  const webApp = getTelegramWebApp();
  return webApp?.initData || '';
}

// Get the current user from WebApp data
export function getCurrentUser() {
  const webApp = getTelegramWebApp();
  return webApp?.initDataUnsafe?.user;
}

// Check if we're running in Telegram
export function isRunningInTelegram(): boolean {
  return getTelegramWebApp() !== null;
}

// Add Telegram init data to API requests
export function addTelegramInitDataToRequest(options: RequestInit = {}): RequestInit {
  const initData = getTelegramInitData();
  
  if (!initData) {
    return options;
  }
  
  const headers = {
    ...options.headers,
    'X-Telegram-Init-Data': initData,
  };
  
  return {
    ...options,
    headers,
  };
}
