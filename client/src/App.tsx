import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import StorePage from "@/pages/StorePage";
import NotFound from "@/pages/not-found";
import { useEffect, useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={StorePage}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Состояние для отображения загрузки
  const [isAppReady, setIsAppReady] = useState(false);
  
  // Эффект для инициализации приложения
  useEffect(() => {
    // Имитация короткой загрузки для предотвращения мигания контента
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Если приложение не готово, показываем загрузчик
  if (!isAppReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }
  
  // Полное приложение
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
