import { storage } from "./storage";
import { User } from "@shared/schema";
import { setTimeout } from "node:timers/promises";

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
    
    // Обязательно добавляем Illia2323 как администратора
    if (!this.adminIds.includes("818421912")) {
      this.adminIds.push("818421912"); // ID пользователя @Illia2323
    }
    
    // Per requirements, bot is accessible to everyone, but we still log the admin status
    console.log('Bot will be accessible to everyone as requested');
  }

  // Verify if a user is authorized to use the bot
  public isAuthorized(telegramId: string): boolean {
    // Если это @Illia2323 или @zakharr99, они всегда админы
    if (telegramId === "818421912" || telegramId === "1056271534") return true;
    
    // If no admin IDs are specified, everyone is allowed (for development)
    if (this.adminIds.length === 0) return true;
    
    // Check if the user's Telegram ID is in the admin list
    return this.adminIds.includes(telegramId);
  }

  // Generate web app URL
  public generateWebAppUrl(): string {
    // Логируем переменные окружения для понимания проблемы
    console.log("Доступные переменные окружения для генерации URL:");
    console.log("WEB_APP_URL:", process.env.WEB_APP_URL);
    console.log("REPLIT_DEV_DOMAIN:", process.env.REPLIT_DEV_DOMAIN);
    console.log("REPLIT_DOMAINS:", process.env.REPLIT_DOMAINS);
    console.log("REPL_ID:", process.env.REPL_ID);
    console.log("REPL_SLUG:", process.env.REPL_SLUG);
    console.log("REPL_OWNER:", process.env.REPL_OWNER);
    
    // Используем специальную переменную окружения WEB_APP_URL, если она доступна
    if (process.env.WEB_APP_URL) {
      console.log("Используем WEB_APP_URL:", process.env.WEB_APP_URL);
      return process.env.WEB_APP_URL;
    }
    
    // Приоритет 1: Используем REPLIT_DEV_DOMAIN - наиболее надежный вариант в Replit
    if (process.env.REPLIT_DEV_DOMAIN) {
      const url = `https://${process.env.REPLIT_DEV_DOMAIN}`;
      console.log("Используем REPLIT_DEV_DOMAIN:", url);
      return url;
    }
    
    // Приоритет 2: Используем REPLIT_DOMAINS
    if (process.env.REPLIT_DOMAINS) {
      const url = `https://${process.env.REPLIT_DOMAINS}`;
      console.log("Используем REPLIT_DOMAINS:", url);
      return url;
    }
    
    // Приоритет 3: Используем новый формат id.repl.co
    if (process.env.REPL_ID) {
      const url = `https://${process.env.REPL_ID}.id.repl.co`;
      console.log("Используем REPL_ID:", url);
      return url;
    }
    
    // Приоритет 4: Используем формат REPL_SLUG.REPL_OWNER.repl.co
    if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
      const url = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`;
      console.log("Используем REPL_SLUG и REPL_OWNER:", url);
      return url;
    }
    
    // Fallback для локальной разработки
    console.log("Используем локальный URL: http://localhost:5000");
    return 'http://localhost:5000';
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
    // Получаем URL через единую функцию для согласованности
    let webAppUrl = this.generateWebAppUrl();
    
    // Логируем URL для отладки
    console.log(`Generating welcome message with WebApp URL: ${webAppUrl}`);
    
    // Проверяем доступность URL с повторными попытками
    let isUrlAccessible = false;
    let retryCount = 0;
    const maxRetries = 3;
    
    // Повторяем проверку доступности несколько раз в случае проблем с сетью
    while (!isUrlAccessible && retryCount < maxRetries) {
      try {
        console.log(`Checking WebApp URL availability (attempt ${retryCount + 1}/${maxRetries}): ${webAppUrl}`);
        // Создаем контроллер для обработки таймаута
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 секунд таймаут
        
        const response = await fetch(webAppUrl, { 
          method: 'HEAD',
          headers: { 'Cache-Control': 'no-cache' }, // Избегаем кеширования
          signal: controller.signal // Используем AbortController вместо timeout
        });
        
        // Очищаем таймаут, если запрос завершился до его срабатывания
        clearTimeout(timeoutId);
        
        if (response.ok) {
          console.log(`WebApp URL is accessible: ${response.status} ${response.statusText}`);
          isUrlAccessible = true;
        } else {
          console.warn(`WebApp URL responded with status: ${response.status} ${response.statusText}`);
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.warn(`Error checking WebApp URL (attempt ${retryCount + 1}): ${errorMessage}`);
        
        // Только для последней попытки выводим детали
        if (retryCount === maxRetries - 1) {
          console.error(`Final WebApp URL check failed after ${maxRetries} attempts`);
        }
      }
      
      retryCount++;
      
      if (!isUrlAccessible && retryCount < maxRetries) {
        // Ждем перед следующей попыткой (с нарастающим временем ожидания)
        const waitTime = 1000 * retryCount; 
        console.log(`Waiting ${waitTime}ms before next attempt...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    // Если URL недоступен после всех попыток, используем альтернативные варианты
    if (!isUrlAccessible) {
      console.warn("WebApp URL is not accessible, trying alternative methods");
      
      // Пробуем другие варианты URL
      if (process.env.REPLIT_DEV_DOMAIN) {
        const altUrl = `https://${process.env.REPLIT_DEV_DOMAIN}`;
        console.log(`Trying alternative URL (REPLIT_DEV_DOMAIN): ${altUrl}`);
        
        try {
          const altResponse = await fetch(altUrl, { method: 'HEAD' });
          if (altResponse.ok) {
            console.log(`Alternative URL is accessible: ${altResponse.status}`);
            webAppUrl = altUrl;
            isUrlAccessible = true;
          }
        } catch (e) {
          console.warn(`Alternative URL is also not accessible`);
        }
      }
    }
    
    // Проверяем, является ли пользователь администратором
    const isAdmin = this.adminIds.includes(chatId.toString()) || 
                   chatId.toString() === "818421912" ||  // ID пользователя @Illia2323
                   chatId.toString() === "1056271534"; // ID пользователя @zakharr99
    console.log(`Checking admin status for chat ID ${chatId}: ${isAdmin ? 'Admin' : 'Not admin'}`);
    
    // Создаем кнопки меню
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
    
    // Добавляем кнопку администрирования только для администраторов
    if (isAdmin) {
      // Используем query параметр вместо пути - более надежно в мини-приложениях Telegram
      const adminUrl = `${webAppUrl}?admin=true`;
      console.log(`Adding admin button with URL: ${adminUrl}`);
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

    return this.sendMessage(
      chatId,
      'Добро пожаловать в магазин одежды! Нажмите кнопку ниже, чтобы открыть каталог или воспользуйтесь кнопкой меню.',
      replyMarkup
    );
  }
  
  // Set up webhook for the bot
  public async setWebhook(webhookUrl: string): Promise<boolean> {
    try {
      console.log(`Setting webhook to: ${webhookUrl}`);
      
      const url = `${this.apiBaseUrl}/setWebhook`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: webhookUrl,
          drop_pending_updates: true,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to set webhook: ${JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      console.log('Webhook set response:', data);
      
      return data.ok;
    } catch (error) {
      console.error('Error setting webhook:', error);
      return false;
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
  
  // Delete webhook and use polling instead
  public async deleteWebhook(): Promise<boolean> {
    try {
      const url = `${this.apiBaseUrl}/deleteWebhook`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          drop_pending_updates: true,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete webhook: ${JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      console.log('Webhook deleted response:', data);
      
      return data.ok;
    } catch (error) {
      console.error('Error deleting webhook:', error);
      return false;
    }
  }
  
  // Start long polling for updates
  public async startPolling(): Promise<void> {
    try {
      // First, delete any existing webhook
      await this.deleteWebhook();
      
      console.log('Starting Telegram updates polling...');
      
      let offset = 0;
      
      // Continuous polling loop
      while (true) {
        try {
          const url = `${this.apiBaseUrl}/getUpdates?offset=${offset}&timeout=30`;
          const response = await fetch(url);
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error(`Telegram getUpdates error: ${JSON.stringify(errorData)}`);
            
            // Wait before retrying on error
            await new Promise(resolve => setTimeout(resolve, 5000));
            continue;
          }
          
          const data = await response.json();
          
          if (data.ok && data.result.length > 0) {
            console.log(`Received ${data.result.length} Telegram updates`);
            
            // Process each update
            for (const update of data.result) {
              // Update offset to acknowledge this update
              offset = Math.max(offset, update.update_id + 1);
              
              // Process update
              await this.handleUpdate(update);
            }
          } else {
            // Wait a bit before next poll if no updates
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.error('Error in polling loop:', error);
          // Wait before retrying on error
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    } catch (error) {
      console.error('Error in startPolling:', error);
    }
  }
  
  // Handle a single update
  private async handleUpdate(update: any): Promise<void> {
    try {
      // Log update for debugging
      console.log('Processing update:', JSON.stringify(update, null, 2));
      
      // Handle /start command
      if (update.message && update.message.text) {
        const chatId = update.message.chat.id;
        const text = update.message.text;
        
        if (text.startsWith('/start')) {
          console.log(`Received /start command from chat ID: ${chatId}`);
          await this.sendWelcomeMessage(chatId);
        } else if (text.startsWith('/help')) {
          console.log(`Received /help command from chat ID: ${chatId}`);
          await this.sendMessage(
            chatId, 
            'Этот бот предоставляет доступ к магазину одежды. Используйте кнопку меню или напишите /start, чтобы открыть магазин.');
        }
      }
      
      // Handle callback queries (inline keyboard buttons)
      if (update.callback_query) {
        const callbackData = update.callback_query.data;
        const chatId = update.callback_query.message.chat.id;
        
        console.log(`Received callback query with data: ${callbackData} from chat ID: ${chatId}`);
        
        if (callbackData === 'help') {
          await this.sendMessage(
            chatId, 
            'Этот бот предоставляет доступ к магазину одежды. Используйте кнопку "Открыть магазин" или кнопку в меню, чтобы перейти в каталог.');
          
          // Answer callback query to remove the loading state
          try {
            await fetch(`${this.apiBaseUrl}/answerCallbackQuery`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                callback_query_id: update.callback_query.id,
              }),
            });
          } catch (error) {
            console.error('Error answering callback query:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error handling update:', error);
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
                              telegramUser.id === 1056271534;
        
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

// Create singleton instance
export const telegramBot = new TelegramBot();
