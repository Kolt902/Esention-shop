import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import StorePage from "@/pages/StorePage";
import AdminPage from "@/pages/AdminPage";
import ProfilePage from "@/pages/ProfilePage";
import ProfileSettingsPage from "@/pages/ProfileSettingsPage";
import VirtualFittingPage from "@/pages/VirtualFittingPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CategoryPage from "@/pages/CategoryPage";
import BrandPage from "@/pages/BrandPage";
import StylePage from "@/pages/StylePage";
import NotFound from "@/pages/not-found";
import { useEffect, useState } from "react";
import { getTelegramWebApp, initTelegramWebApp, isRunningInTelegram } from "@/lib/telegram";
import { StoreProvider } from "@/lib/StoreContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={StorePage}/>
      <Route path="/admin" component={AdminPage}/>
      <Route path="/profile" component={ProfilePage}/>
      <Route path="/settings" component={ProfileSettingsPage}/>
      <Route path="/virtual-fitting" component={VirtualFittingPage}/>
      <Route path="/product/:id" component={ProductDetailPage}/>
      
      {/* Новые маршруты для категорий, брендов и стилей */}
      <Route path="/category/:category" component={CategoryPage}/>
      <Route path="/brand/:brand" component={BrandPage}/>
      <Route path="/style/:style" component={StylePage}/>
      
      {/* Обработка всех остальных маршрутов */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [telegramInitialized, setTelegramInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  
  useEffect(() => {
    const initApp = async () => {
      try {
        const inTelegram = isRunningInTelegram();
        console.log(`Приложение запущено в Telegram: ${inTelegram}`);
        
        if (inTelegram) {
          // Проверяем текущее состояние WebApp
          const webApp = getTelegramWebApp();
          if (webApp) {
            console.log('WebApp уже инициализирован');
            setTelegramInitialized(true);
            setIsAppReady(true);
            return;
          }
          
          // Ждем событие готовности WebApp
          const waitForWebApp = new Promise<boolean>((resolve) => {
            const timeout = setTimeout(() => {
              console.log('Таймаут инициализации WebApp');
              resolve(false);
            }, 5000);
            
            const handleReady = () => {
              console.log('Получено событие готовности WebApp');
              clearTimeout(timeout);
              setTelegramInitialized(true);
              resolve(true);
            };
            
            window.addEventListener('tgWebAppReady', handleReady, { once: true });
          });
          
          const initialized = await waitForWebApp;
          if (!initialized) {
            console.error('Не удалось инициализировать WebApp');
            setInitError('Не удалось инициализировать Telegram WebApp. Пожалуйста, убедитесь, что вы открыли приложение через Telegram.');
          }
        }
        
        setIsAppReady(true);
      } catch (error) {
        console.error('Ошибка при инициализации:', error);
        setInitError(error instanceof Error ? error.message : 'Произошла неизвестная ошибка');
        setIsAppReady(true);
      }
    };
    
    initApp();
  }, []);
  
  if (!isAppReady) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[var(--tg-theme-bg-color,#ffffff)]">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[var(--tg-theme-button-color,#111111)] border-r-transparent"></div>
        <p className="mt-4 text-[var(--tg-theme-text-color,#111111)] font-medium">Загрузка приложения...</p>
        {isRunningInTelegram() && (
          <p className="mt-2 text-sm text-[var(--tg-theme-hint-color,#999999)]">
            {telegramInitialized ? "Telegram WebApp инициализирован" : "Инициализация Telegram..."}
          </p>
        )}
      </div>
    );
  }
  
  if (initError) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center p-4 bg-[var(--tg-theme-bg-color,#ffffff)]">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-bold text-[var(--tg-theme-text-color,#111111)] mb-4">Ошибка инициализации</h1>
          <p className="text-[var(--tg-theme-hint-color,#999999)] mb-6">{initError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[var(--tg-theme-button-color,#111111)] text-[var(--tg-theme-button-text-color,#ffffff)] rounded-lg"
          >
            Повторить
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <StoreProvider>
          <div className="min-h-screen bg-[var(--tg-theme-bg-color,#ffffff)] text-[var(--tg-theme-text-color,#000000)]">
            <Toaster />
            <Router />
          </div>
        </StoreProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
