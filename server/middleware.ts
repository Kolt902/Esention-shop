import { Request, Response, NextFunction } from 'express';
import { telegramBot } from './telegram';

// Middleware для валидации данных Telegram WebApp
export function validateTelegramWebApp(req: Request, res: Response, next: NextFunction) {
  try {
    // Получаем данные инициализации из заголовка
    const initData = req.headers['x-telegram-init-data'] as string;
    
    // В режиме разработки разрешаем доступ без данных инициализации
    if (process.env.NODE_ENV === 'development' && !initData) {
      console.log('Режим разработки: пропускаем проверку данных инициализации');
      
      // Создаем тестового пользователя
      (req as any).telegramUser = {
        id: 123456789,
        first_name: 'Test',
        username: 'testuser'
      };
      
      return next();
    }
    
    // Проверяем наличие данных инициализации
    if (!initData) {
      console.warn('Отсутствуют данные инициализации Telegram');
      return res.status(403).json({
        error: 'Отсутствуют данные инициализации Telegram'
      });
    }
    
    // Валидируем данные
    const telegramUser = telegramBot.validateInitData(initData);
    
    if (!telegramUser) {
      console.warn('Недействительные данные инициализации Telegram');
      return res.status(403).json({
        error: 'Недействительные данные инициализации Telegram'
      });
    }
    
    // Сохраняем информацию о пользователе в запросе
    (req as any).telegramUser = telegramUser;
    
    next();
  } catch (error) {
    console.error('Ошибка при валидации данных Telegram:', error);
    res.status(500).json({
      error: 'Внутренняя ошибка сервера при валидации данных Telegram'
    });
  }
}

// Middleware to ensure user is authenticated
export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  const telegramUser = (req as any).telegramUser;
  
  if (!telegramUser) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  next();
}
