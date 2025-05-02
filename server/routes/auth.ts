import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { validateTelegramWebApp } from '../middleware';
import { telegramBot } from '../telegram';

// Create router
const router = Router();

// Check if user is logged in
router.get('/status', async (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    const user = await storage.getUser(req.user.id);
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
});

// Login via Telegram
router.post('/telegram', validateTelegramWebApp, async (req: Request, res: Response) => {
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
    console.error('Telegram login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout
router.post('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      console.error('Error logging out:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ success: true });
  });
});

export default router;