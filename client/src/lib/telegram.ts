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
export function initTelegramWebApp(): boolean {
  try {
    console.log("Initializing Telegram Web App...");
    
    // Проверка наличия Telegram WebApp - более надежная проверка
    if (typeof window === 'undefined') {
      console.error("Window object is not available");
      return false;
    }
    
    // Дополнительная проверка, чтобы видеть, что доступно
    if ('Telegram' in window) {
      console.log("Telegram object is available in window");
      if ('WebApp' in (window as any).Telegram) {
        console.log("WebApp object is available in Telegram");
      } else {
        console.warn("WebApp object is NOT available in Telegram");
      }
    } else {
      console.warn("Telegram object is NOT available in window");
    }
    
    const webApp = getTelegramWebApp();
    
    if (webApp) {
      // Call ready() to notify Telegram that we're ready
      console.log("Telegram Web App found, calling ready()");
      
      try {
        webApp.ready();
      } catch (readyError) {
        console.error("Error calling WebApp.ready():", readyError);
        // Continue anyway, as the app can still function
      }
      
      // Ensure the viewport is expanded in Telegram
      try {
        if (webApp.expand && !webApp.isExpanded) {
          console.log("Expanding Telegram WebApp viewport");
          webApp.expand();
        }
      } catch (expandError) {
        console.error("Error expanding Telegram viewport:", expandError);
        // Continue anyway, as this is not critical
      }
      
      // Настройка цветов темы
      try {
        if (webApp.themeParams) {
          console.log("Applying Telegram theme parameters:", webApp.themeParams);
          
          // Set CSS variables for theming
          const themeMapping = {
            bg_color: '--tg-theme-bg-color',
            text_color: '--tg-theme-text-color',
            button_color: '--tg-theme-button-color',
            button_text_color: '--tg-theme-button-text-color',
            hint_color: '--tg-theme-hint-color',
            link_color: '--tg-theme-link-color'
          };
          
          // Apply all available theme parameters
          Object.entries(themeMapping).forEach(([key, cssVar]) => {
            const value = webApp.themeParams[key as keyof typeof webApp.themeParams];
            if (value) {
              document.documentElement.style.setProperty(cssVar, value);
            }
          });
          
          // Устанавливаем дополнительные свойства для дизайна в Telegram
          document.documentElement.classList.add('telegram-webapp');
        } else {
          console.log("No Telegram theme parameters found, using defaults");
          setFallbackColors();
        }
      } catch (themeError) {
        console.error("Error applying theme:", themeError);
        setFallbackColors();
      }
      
      // Настройка кнопки возврата (Back Button)
      try {
        // Проверяем наличие BackButton и поддержку его методов
        if (webApp.BackButton && typeof webApp.BackButton.hide === 'function') {
          webApp.BackButton.hide();
        }
      } catch (backError) {
        console.log("BackButton is not supported in this version");
      }
      
      console.log("Telegram Web App initialization complete");
      return true;
    } else {
      console.log("Telegram Web App not found in window, running in standalone mode");
      setFallbackColors();
      return false;
    }
  } catch (error) {
    console.error("Error initializing Telegram Web App:", error);
    setFallbackColors();
    return false;
  }
}

// Set fallback colors for standalone mode or error cases
function setFallbackColors(): void {
  const fallbackColors = {
    '--tg-theme-bg-color': '#ffffff',
    '--tg-theme-text-color': '#000000',
    '--tg-theme-button-color': '#0088CC',
    '--tg-theme-button-text-color': '#ffffff',
    '--tg-theme-hint-color': '#999999',
    '--tg-theme-link-color': '#0088CC'
  };
  
  Object.entries(fallbackColors).forEach(([cssVar, color]) => {
    document.documentElement.style.setProperty(cssVar, color);
  });
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
