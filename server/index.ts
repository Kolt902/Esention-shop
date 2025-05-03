import express, { Request, Response, NextFunction } from 'express';
import { Server } from 'http';
import { registerRoutes } from './routes';
import { setupVite } from './vite';
import { telegramBot } from './telegram';
import cors from 'cors';
import path from 'path';

const app = express();

// Включаем CORS
app.use(cors({
  origin: '*', // В продакшене нужно указать конкретный домен
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Telegram-Init-Data', 'Authorization']
}));

// Парсинг JSON
app.use(express.json());

// Middleware для логирования запросов
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Функция для раздачи статических файлов
function serveStatic(app: express.Application) {
  const clientDistPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDistPath));
  
  // Всегда возвращаем index.html для всех маршрутов (кроме API)
  app.get('*', (req: Request, res: Response) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    }
  });
}

(async () => {
  const server = await registerRoutes(app);

  // Обработка ошибок
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Ошибка:', err);
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Внутренняя ошибка сервера";
    res.status(status).json({ message });
  });

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || '5000', 10);
  const host = process.env.HOST || '0.0.0.0';
  
  server.listen(port, host, async () => {
    console.log(`Сервер запущен на http://${host}:${port}`);
    
    if (process.env.TELEGRAM_BOT_TOKEN) {
      try {
        // Получаем URL для WebApp
        const webAppUrl = process.env.WEB_APP_URL || `http://${host}:${port}`;
        console.log(`Используется URL для WebApp: ${webAppUrl}`);
        
        // Настраиваем вебхук или поллинг
        if (process.env.WEBHOOK_URL) {
          const webhookUrl = process.env.WEBHOOK_URL;
          console.log(`Настройка вебхука: ${webhookUrl}`);
          const success = await telegramBot.setWebhook(webhookUrl);
          console.log(`Настройка вебхука ${success ? 'успешна' : 'не удалась'}`);
        } else {
          console.log('Запуск бота в режиме поллинга');
          await telegramBot.deleteWebhook();
          telegramBot.startPolling();
        }
        
        // Настраиваем команды бота
        await telegramBot.setCommands([
          { command: 'start', description: 'Открыть магазин' },
          { command: 'help', description: 'Показать помощь' }
        ]);
        
        // Настраиваем кнопку меню
        await telegramBot.setMenuButton({
          type: 'web_app',
          text: 'Открыть магазин',
          web_app: { url: webAppUrl }
        });
        
      } catch (error) {
        console.error('Ошибка при настройке бота:', error);
      }
    } else {
      console.log('TELEGRAM_BOT_TOKEN не указан, пропускаем инициализацию бота');
    }
  });
})().catch((err) => {
  console.error('Не удалось запустить сервер:', err);
  process.exit(1);
});
