import { Router, Request, Response, NextFunction } from 'express';
import { storage } from '../storage';
import { validateTelegramWebApp } from '../middleware';
import { telegramBot } from '../telegram';
import { User } from '@shared/schema';

// Extend Request type to include user
declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
    isAuthenticated(): boolean;
    login(user: User, callback: (err: any) => void): void;
    logout(callback: (err: any) => void): void;
  }
}

// Create router
const router = Router();

// Check if user is logged in
router.get('/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.isAuthenticated() && req.user?._id) {
      const user = await storage.getUser(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Do not send sensitive data like password
      const { password, ...safeUser } = user;
      res.json({ 
        isAuthenticated: true, 
        user: safeUser 
      });
    } else {
      res.json({ 
        isAuthenticated: false, 
        user: null 
      });
    }
  } catch (error) {
    next(error);
  }
});

// Login via Telegram
router.post('/telegram', validateTelegramWebApp, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const telegramUserData = req.body.user;
    
    if (!telegramUserData) {
      return res.status(400).json({ message: 'Invalid Telegram data' });
    }
    
    // Process Telegram user data and get or create the user
    const user = await telegramBot.getUserFromTelegramData(telegramUserData);
    
    if (!user) {
      return res.status(400).json({ message: 'Failed to process Telegram user data' });
    }
    
    // Login the user
    req.login(user, (err) => {
      if (err) {
        console.error('Error logging in Telegram user:', err);
        return res.status(500).json({ message: 'Login failed' });
      }
      
      // Do not send sensitive data like password
      const { password, ...safeUser } = user;
      return res.json({ 
        success: true, 
        user: safeUser
      });
    });
  } catch (error) {
    next(error);
  }
});

// Logout
router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      console.error('Error logging out:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ success: true });
  });
});

export default router;