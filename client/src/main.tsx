import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initTelegramWebApp } from "./lib/telegram";

// Инициализируем Telegram WebApp до монтирования React приложения
// Это предотвратит FOUC (Flash of Unstyled Content)
document.addEventListener('DOMContentLoaded', () => {
  try {
    console.log("DOM loaded, initializing Telegram WebApp...");
    initTelegramWebApp();
    console.log("Telegram WebApp initialized, rendering React app");
  } catch (error) {
    console.error("Error pre-initializing Telegram WebApp:", error);
  }
});

// Монтируем React-приложение
createRoot(document.getElementById("root")!).render(<App />);
