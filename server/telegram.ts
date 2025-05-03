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
  private apiBaseUrl: string;
  private adminIds: string[];
  private isPolling: boolean;
  private pollTimeout: NodeJS.Timeout | null;

  constructor(token: string, adminIds: string[] = []) {
    this.token = token;
    this.apiBaseUrl = `https://api.telegram.org/bot${token}`;
    this.adminIds = adminIds;
    this.isPolling = false;
    this.pollTimeout = null;
  }

  // Set bot commands
  public async setCommands(commands: Array<{ command: string; description: string }>): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/setMyCommands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commands })
      });

      if (!response.ok) {
        throw new Error(`Failed to set commands: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.ok;
    } catch (error) {
      console.error('Error setting bot commands:', error);
      return false;
    }
  }

  // Set menu button
  public async setMenuButton(button: {
    type: string;
    text: string;
    web_app: { url: string };
  }): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/setChatMenuButton`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menu_button: button })
      });

      if (!response.ok) {
        throw new Error(`Failed to set menu button: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.ok;
    } catch (error) {
      console.error('Error setting menu button:', error);
      return false;
    }
  }

  // Start polling
  public async startPolling(timeout: number = 30): Promise<void> {
    if (this.isPolling) {
      console.log('Polling already started');
      return;
    }

    this.isPolling = true;
    let offset = 0;

    const poll = async () => {
      if (!this.isPolling) return;

      try {
        const response = await fetch(`${this.apiBaseUrl}/getUpdates`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            offset,
            timeout
          })
        });

        if (!response.ok) {
          throw new Error(`Polling failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.ok && data.result.length > 0) {
          // Process updates
          for (const update of data.result) {
            // Update offset
            offset = update.update_id + 1;
            
            // Handle update
            await this.handleUpdate(update);
          }
        }

        // Schedule next poll
        this.pollTimeout = setTimeout(() => poll(), 1000);
      } catch (error) {
        console.error('Error in polling:', error);
        // Retry after delay
        this.pollTimeout = setTimeout(() => poll(), 5000);
      }
    };

    // Start polling
    await poll();
  }

  // Stop polling
  public stopPolling(): void {
    this.isPolling = false;
    if (this.pollTimeout) {
      clearTimeout(this.pollTimeout);
      this.pollTimeout = null;
    }
  }

  // Handle update
  private async handleUpdate(update: any): Promise<void> {
    try {
      if (update.message) {
        const { message } = update;
        
        // Handle commands
        if (message.text && message.text.startsWith('/')) {
          const command = message.text.split(' ')[0].substring(1);
          await this.handleCommand(command, message);
        }
      }
    } catch (error) {
      console.error('Error handling update:', error);
    }
  }

  // Handle command
  private async handleCommand(command: string, message: any): Promise<void> {
    try {
      switch (command) {
        case 'start':
          await this.sendWelcomeMessage(message.chat.id);
          break;
        case 'help':
          await this.sendMessage(message.chat.id, 'Используйте кнопку меню для открытия магазина');
          break;
        default:
          await this.sendMessage(message.chat.id, 'Неизвестная команда');
      }
    } catch (error) {
      console.error('Error handling command:', error);
    }
  }

  // Send message helper
  private async sendMessage(chatId: number, text: string, replyMarkup?: any): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          reply_markup: replyMarkup
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.ok;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  // Delete webhook
  public async deleteWebhook(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/deleteWebhook`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error(`Failed to delete webhook: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.ok;
    } catch (error) {
      console.error('Error deleting webhook:', error);
      return false;
    }
  }

  // Set webhook
  public async setWebhook(url: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          allowed_updates: ['message', 'callback_query']
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to set webhook: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.ok;
    } catch (error) {
      console.error('Error setting webhook:', error);
      return false;
    }
  }

  // Verify if a user is authorized to use the bot
  public isAuthorized(telegramId: string): boolean {
    // Если это @Illia2323 или @zakharr99, они всегда админы
    if (telegramId === "818421912" || telegramId === "7633144414") return true;
    
    // If no admin IDs are specified, everyone is allowed (for development)
    if (this.adminIds.length === 0) return true;
    
    // Check if the user's Telegram ID is in the admin list
    return this.adminIds.includes(telegramId);
  }

  // Generate web app URL
  public generateWebAppUrl(): string {
    // Use WEB_APP_URL from environment if available
    if (process.env.WEB_APP_URL) {
      console.log("Using WEB_APP_URL:", process.env.WEB_APP_URL);
      return process.env.WEB_APP_URL;
    }
    
    // Fallback for local development
    const port = process.env.PORT || 5000;
    const host = process.env.HOST || 'localhost';
    const url = `http://${host}:${port}`;
    console.log("Using local development URL:", url);
    return url;
  }

  // Send welcome message with web app button
  public async sendWelcomeMessage(chatId: number): Promise<any> {
    try {
      // Get WebApp URL from environment variable or use default
      const webAppUrl = process.env.WEB_APP_URL || 'http://localhost:5000';
      console.log(`Using WebApp URL: ${webAppUrl}`);

      // Create menu buttons
      const keyboard = [
        [
          {
            text: 'Открыть магазин',
            web_app: { url: webAppUrl },
          },
        ],
        [
          {
            text: 'Помощь',
            callback_data: 'help'
          }
        ]
      ];

      // Check if user is admin
      const isAdmin = this.adminIds.includes(chatId.toString()) || 
                     chatId.toString() === "818421912" ||
                     chatId.toString() === "7633144414";

      // Add admin button for admins
      if (isAdmin) {
        const adminUrl = `${webAppUrl}?admin=true`;
        keyboard.push([
          {
            text: 'Администрирование',
            web_app: { url: adminUrl },
          }
        ]);
      }

      const replyMarkup = {
        inline_keyboard: keyboard,
        resize_keyboard: true,
        one_time_keyboard: false
      };

      // Send welcome message with buttons
      return this.sendMessage(
        chatId,
        'Добро пожаловать в магазин одежды! Нажмите кнопку ниже, чтобы открыть каталог или воспользуйтесь кнопкой меню.',
        replyMarkup
      );
    } catch (error) {
      console.error('Error sending welcome message:', error);
      throw error;
    }
  }
  
  // Get current webhook info
  public async getWebhookInfo(): Promise<any> {
    try {
      const url = `${this.apiBaseUrl}/getWebhookInfo`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to get webhook info: ${JSON.stringify(errorData)}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting webhook info:', error);
      return { ok: false, error: 'Failed to get webhook info' };
    }
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
        // Проверяем, является ли пользователь @Illia2323 или @zakharr99
        const isSpecialAdmin = telegramUser.username === 'Illia2323' || 
                              telegramUser.username === 'zakharr99' || 
                              telegramUser.id === 818421912 ||
                              telegramUser.id === 7633144414;
        
        user = await storage.createUser({
          username: telegramUser.username || `user_${telegramUser.id}`,
          password: 'telegram_auth', // Not used for Telegram users
          telegramId: telegramUser.id.toString(),
          isAdmin: isSpecialAdmin || this.isAuthorized(telegramUser.id.toString()),
        });
      }
      
      return user;
    } catch (error) {
      console.error('Error getting user from Telegram data:', error);
      return null;
    }
  }
}

// Create bot instance
export const telegramBot = new TelegramBot(
  process.env.TELEGRAM_BOT_TOKEN || '',
  (process.env.TELEGRAM_ADMIN_IDS || '').split(',').map(id => id.trim()).concat(['818421912', '7633144414'])
);
