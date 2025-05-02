import { storage } from "./storage";
import { User } from "@shared/schema";

interface TelegramUser {
  id: number;
  username?: string;
  first_name: string;
  last_name?: string;
}

export class TelegramBot {
  private token: string;
  private adminIds: string[];
  private apiBaseUrl: string;

  constructor() {
    // Allow development mode without token
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      console.warn('TELEGRAM_BOT_TOKEN not provided, running in development mode with limited functionality');
      this.token = 'dev_mode_token';
    } else {
      this.token = process.env.TELEGRAM_BOT_TOKEN;
    }
    
    this.apiBaseUrl = `https://api.telegram.org/bot${this.token}`;
    
    // Parse admin IDs from env var (comma-separated list)
    this.adminIds = (process.env.TELEGRAM_ADMIN_IDS || '').split(',').map(id => id.trim());
    
    // Per requirements, bot is accessible to everyone, but we still log the admin status
    console.log('Bot will be accessible to everyone as requested');
  }

  // Verify if a user is authorized to use the bot
  public isAuthorized(telegramId: string): boolean {
    // If no admin IDs are specified, everyone is allowed (for development)
    if (this.adminIds.length === 0) return true;
    
    // Check if the user's Telegram ID is in the admin list
    return this.adminIds.includes(telegramId);
  }

  // Generate web app URL
  public generateWebAppUrl(): string {
    // Check if we have a specific WEB_APP_URL environment variable
    if (process.env.WEB_APP_URL) {
      return process.env.WEB_APP_URL;
    }
    
    // For development and testing in Telegram
    // We use a basic URL that will always redirect to the webview 
    // in Replit environment
    return 'https://replit.com/@' + process.env.REPL_OWNER + '/' + 
           process.env.REPL_SLUG;
  }

  // Send message to a user
  public async sendMessage(chatId: number, text: string, replyMarkup?: any): Promise<any> {
    try {
      const url = `${this.apiBaseUrl}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          reply_markup: replyMarkup,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Telegram API error: ${JSON.stringify(errorData)}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending Telegram message:', error);
      throw error;
    }
  }

  // Send welcome message with web app button
  public async sendWelcomeMessage(chatId: number): Promise<any> {
    const webAppUrl = this.generateWebAppUrl();
    const replyMarkup = {
      inline_keyboard: [
        [
          {
            text: 'Открыть магазин',
            web_app: { url: webAppUrl },
          },
        ],
      ],
    };

    return this.sendMessage(
      chatId,
      'Добро пожаловать в магазин одежды! Нажмите кнопку ниже, чтобы открыть каталог.',
      replyMarkup
    );
  }

  // Validate Telegram data
  public validateInitData(initData: string): TelegramUser | null {
    try {
      // In a real implementation, you would verify the hash
      // For this example, we'll just parse the data
      const params = new URLSearchParams(initData);
      const userJson = params.get('user');
      
      if (!userJson) return null;
      
      const user = JSON.parse(userJson);
      return user as TelegramUser;
    } catch (error) {
      console.error('Error validating Telegram data:', error);
      return null;
    }
  }

  // Get or create user from Telegram data
  public async getUserFromTelegramData(telegramUser: TelegramUser): Promise<User | null> {
    try {
      // Look up user by Telegram ID
      let user = await storage.getUserByTelegramId(telegramUser.id.toString());
      
      // If user doesn't exist, create one
      if (!user) {
        user = await storage.createUser({
          username: telegramUser.username || `user_${telegramUser.id}`,
          password: 'telegram_auth', // Not used for Telegram users
          telegramId: telegramUser.id.toString(),
          isAdmin: this.isAuthorized(telegramUser.id.toString()),
        });
      }
      
      return user;
    } catch (error) {
      console.error('Error getting user from Telegram data:', error);
      return null;
    }
  }
}

// Create singleton instance
export const telegramBot = new TelegramBot();
