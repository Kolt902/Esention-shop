// Define the global Telegram object type
declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
  }
}

// Interface for Telegram WebApp object
interface TelegramWebApp {
  version?: string;  // Добавляем поле версии
  platform?: string;
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

// Get the WebApp object from the window
export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === 'undefined') {
    console.log('Window object is not available');
    return null;
  }
  
  if (!window.Telegram?.WebApp) {
    console.log('Telegram WebApp is not available');
    return null;
  }
  
  return window.Telegram.WebApp;
}

// Check if running in Telegram
export function isRunningInTelegram(): boolean {
  try {
    // Проверяем window.Telegram
    if (window.Telegram?.WebApp) {
      return true;
    }
    
    // Проверяем параметры URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('tgWebAppData') || urlParams.has('tgWebAppStartParam')) {
      return true;
    }
    
    // Проверяем User Agent
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('telegram') || userAgent.includes('tgweb')) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Ошибка при проверке окружения Telegram:', error);
    return false;
  }
}

// Set fallback colors for standalone mode or error cases
export function setFallbackColors(): void {
  const fallbackColors = {
    '--tg-theme-bg-color': '#ffffff',
    '--tg-theme-text-color': '#000000',
    '--tg-theme-button-color': '#111111',
    '--tg-theme-button-text-color': '#ffffff',
    '--tg-theme-hint-color': '#999999',
    '--tg-theme-link-color': '#111111'
  };
  
  Object.entries(fallbackColors).forEach(([cssVar, color]) => {
    if (!document.documentElement.style.getPropertyValue(cssVar)) {
      document.documentElement.style.setProperty(cssVar, color);
    }
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

// Add Telegram init data to API requests
export function addTelegramInitDataToRequest(options: RequestInit = {}): RequestInit {
  const initData = getTelegramInitData();
  
  if (!initData) {
    return options;
  }
  
  return {
    ...options,
    headers: {
      ...options.headers,
      'X-Telegram-Init-Data': initData,
    },
  };
}
