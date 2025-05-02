// Interface for Telegram WebApp object
interface TelegramWebApp {
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
  if (typeof window !== 'undefined' && 'Telegram' in window && 'WebApp' in (window as any).Telegram) {
    return (window as any).Telegram.WebApp;
  }
  return null;
}

// Initialize Telegram WebApp
export function initTelegramWebApp(): void {
  const webApp = getTelegramWebApp();
  if (webApp) {
    webApp.ready();
    
    // Apply theme colors if available
    if (webApp.themeParams) {
      if (webApp.themeParams.bg_color) {
        document.documentElement.style.setProperty('--tg-theme-bg-color', webApp.themeParams.bg_color);
      }
      if (webApp.themeParams.text_color) {
        document.documentElement.style.setProperty('--tg-theme-text-color', webApp.themeParams.text_color);
      }
      if (webApp.themeParams.button_color) {
        document.documentElement.style.setProperty('--tg-theme-button-color', webApp.themeParams.button_color);
      }
      if (webApp.themeParams.button_text_color) {
        document.documentElement.style.setProperty('--tg-theme-button-text-color', webApp.themeParams.button_text_color);
      }
    }
  }
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
