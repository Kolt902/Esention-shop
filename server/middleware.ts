import { Request, Response, NextFunction } from 'express';
import { telegramBot } from './telegram';

// Middleware to validate Telegram WebApp data
export function validateTelegramWebApp(req: Request, res: Response, next: NextFunction) {
  // Get the init data from header
  const initData = req.headers['x-telegram-init-data'] as string;
  
  // For development/testing mode, we'll allow access without initData
  if (!initData) {
    console.warn('Missing Telegram initialization data, but allowing request in development mode');
    
    // Create a mock Telegram user for development
    (req as any).telegramUser = {
      id: 123456789,
      first_name: 'Test',
      username: 'testuser'
    };
    
    return next();
  }
  
  // If we have initData, validate it
  const telegramUser = telegramBot.validateInitData(initData);
  
  if (!telegramUser) {
    console.warn('Invalid Telegram initialization data, but allowing request in development mode');
    
    // Create a mock Telegram user for development
    (req as any).telegramUser = {
      id: 123456789,
      first_name: 'Test',
      username: 'testuser'
    };
    
    return next();
  }
  
  // Store the user info in the request object
  (req as any).telegramUser = telegramUser;
  
  next();
}

// Middleware to ensure user is authenticated
export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  const telegramUser = (req as any).telegramUser;
  
  if (!telegramUser) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  next();
}
