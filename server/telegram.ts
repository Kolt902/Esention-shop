import { storage } from "./storage";
import { User } from "@shared/schema";
import { getDb } from './db';
import TelegramBot from 'node-telegram-bot-api';
import { Product, CartItem } from '../client/src/types';

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
  private bot: TelegramBot;

  constructor(token: string, adminIds: string[] = []) {
    if (!token) {
      throw new Error('Telegram bot token is required');
    }
    this.token = token;
    this.apiBaseUrl = `https://api.telegram.org/bot${token}`;
    this.adminIds = adminIds;
    this.isPolling = false;
    this.pollTimeout = null;
    this.bot = new TelegramBot(token, { polling: true });
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
        case 'admin':
          await this.handleAdminCommand(message.chat.id);
          break;
        default:
          await this.sendMessage(message.chat.id, 'Неизвестная команда');
      }
    } catch (error) {
      console.error('Error handling command:', error);
    }
  }

  // Send message helper
  public async sendMessage(chatId: number, text: string, replyMarkup?: any): Promise<boolean> {
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
        body: JSON.stringify({ url })
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
  public async sendWelcomeMessage(chatId: number): Promise<boolean> {
    const keyboard = {
      keyboard: [
        [{
          text: '🏪 Открыть магазин',
          web_app: { url: process.env.WEB_APP_URL }
        }]
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    };

    return this.sendMessage(
      chatId,
      'Добро пожаловать в Esention - ваш премиальный магазин одежды в Европе!\n\n' +
      '• Все цены в евро (€)\n' +
      '• Доставка по всей Европе\n' +
      '• Гарантия подлинности\n' +
      '• Безопасные платежи\n\n' +
      'Используйте кнопку ниже, чтобы открыть магазин:',
      keyboard
    );
  }
  
  // Get current webhook info
  public async getWebhookInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/getWebhookInfo`);
      return response.json();
    } catch (error) {
      console.error('Error getting webhook info:', error);
      return null;
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

  // Handle admin command
  private async handleAdminCommand(chatId: number): Promise<void> {
    const userId = chatId.toString();

    if (!this.isAuthorized(userId)) {
      await this.sendMessage(chatId, '⛔️ У вас нет доступа к админ-панели');
      return;
    }

    const adminKeyboard = {
      inline_keyboard: [
        [{ text: '📊 Статистика', callback_data: 'admin_stats' }],
        [{ text: '📦 Управление товарами', callback_data: 'admin_products' }],
        [{ text: '👥 Пользователи', callback_data: 'admin_users' }]
      ]
    };

    await this.sendMessage(chatId,
      '👨‍💼 <b>Админ-панель</b>\n\nВыберите действие:',
      adminKeyboard
    );
  }
}

// Create bot instance
export const telegramBot = new TelegramBot(
  process.env.TELEGRAM_BOT_TOKEN || '',
  (process.env.TELEGRAM_ADMIN_IDS || '').split(',').map(id => id.trim())
);

// Моковые данные для примера
const products: Product[] = [
  {
    id: 1,
    name: 'Nike Air Max 270',
    price: 12999,
    image: 'https://via.placeholder.com/300',
    category: 'Обувь',
    inStock: 10
  },
  {
    id: 2,
    name: 'Adidas Ultraboost 21',
    price: 14999,
    image: 'https://via.placeholder.com/300',
    category: 'Обувь',
    inStock: 5
  }
];

// Хранилище корзин пользователей
const userCarts = new Map<number, CartItem[]>();

// Обновляем главное меню с новым дизайном
const mainMenuKeyboard = {
  keyboard: [
    [{ text: '🛍 Каталог' }],
    [{ text: '🛒 Корзина' }, { text: '👤 Профиль' }],
    [{ text: '🌐 Открыть веб-версию', web_app: { url: process.env.WEB_APP_URL || '' } }]
  ],
  resize_keyboard: true,
  one_time_keyboard: false
};

// Обновляем меню категорий
const categoriesKeyboard = {
  keyboard: [
    [{ text: '👔 Мужское' }, { text: '👗 Женское' }],
    [{ text: '👟 Обувь' }],
    [{ text: '⬅️ Назад' }]
  ],
  resize_keyboard: true
};

// Обновляем шаблон карточки товара
const createProductCard = (product: Product): string => {
  return `
<b>${product.name}</b>
💰 <b>${product.price.toLocaleString('ru-RU')} €</b>

${product.description || ''}

📦 В наличии
🏷 Категория: ${product.category}
`;
};

// Обновляем приветственное сообщение
const welcomeMessage = `
Добро пожаловать в Esention Store! 🛍

Ваш премиальный магазин одежды в Европе:

• Все цены в евро (€)
• Доставка по всей Европе
• Гарантия подлинности
• Безопасные платежи

Используйте меню ниже для навигации:
`;

// Обработчик команды /start
telegramBot.bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  await telegramBot.bot.sendMessage(chatId, welcomeMessage, {
    parse_mode: 'HTML',
    reply_markup: mainMenuKeyboard
  });
});

// Обработчик кнопки "Каталог"
telegramBot.bot.onText(/🛍 Каталог/, async (msg) => {
  const chatId = msg.chat.id;
  await telegramBot.bot.sendMessage(chatId, 
    'Выберите категорию товаров:', 
    { reply_markup: categoriesKeyboard }
  );
});

// Обработчик категорий
const handleCategory = async (msg: TelegramBot.Message, category: string) => {
  const chatId = msg.chat.id;
  const products = await storage.getProductsByCategory(category);
  
  if (!products || products.length === 0) {
    await telegramBot.bot.sendMessage(chatId, 
      'В данной категории пока нет товаров.',
      { reply_markup: categoriesKeyboard }
    );
    return;
  }

  for (const product of products) {
    const keyboard = {
      inline_keyboard: [
        [
          { text: '🛒 В корзину', callback_data: `add_to_cart:${product.id}` },
          { text: '🔍 Подробнее', callback_data: `product_details:${product.id}` }
        ]
      ]
    };

    await telegramBot.bot.sendPhoto(chatId, product.imageUrl, {
      caption: createProductCard(product),
      parse_mode: 'HTML',
      reply_markup: keyboard
    });
  }
};

// Обработчики категорий
telegramBot.bot.onText(/👔 Мужское/, (msg) => handleCategory(msg, 'Мужское'));
telegramBot.bot.onText(/👗 Женское/, (msg) => handleCategory(msg, 'Женское'));
telegramBot.bot.onText(/👟 Обувь/, (msg) => handleCategory(msg, 'Обувь'));

// Обработчик корзины
telegramBot.bot.onText(/🛒 Корзина/, async (msg) => {
  const chatId = msg.chat.id;
  const cart = await storage.getCart(chatId.toString());

  if (!cart || cart.items.length === 0) {
    await telegramBot.bot.sendMessage(chatId,
      '🛒 Ваша корзина пуста',
      { reply_markup: mainMenuKeyboard }
    );
    return;
  }

  let cartText = '🛒 <b>Ваша корзина:</b>\n\n';
  let total = 0;

  for (const item of cart.items) {
    const product = await storage.getProduct(item.productId);
    if (product) {
      const itemTotal = product.price * item.quantity;
      total += itemTotal;
      cartText += `${product.name}\n`;
      cartText += `Количество: ${item.quantity} x ${product.price}€ = ${itemTotal}€\n\n`;
    }
  }

  cartText += `\n💰 <b>Итого: ${total}€</b>`;

  const keyboard = {
    inline_keyboard: [
      [
        { text: '🗑 Очистить', callback_data: 'clear_cart' },
        { text: '✅ Оформить', callback_data: 'checkout' }
      ]
    ]
  };

  await telegramBot.bot.sendMessage(chatId, cartText, {
    parse_mode: 'HTML',
    reply_markup: keyboard
  });
});

// Обработчик профиля
telegramBot.bot.onText(/👤 Профиль/, async (msg) => {
  const chatId = msg.chat.id;
  const user = await storage.getUserByTelegramId(chatId.toString());

  if (!user) {
    await telegramBot.bot.sendMessage(chatId,
      'Профиль не найден. Используйте /start для регистрации.',
      { reply_markup: mainMenuKeyboard }
    );
    return;
  }

  const orders = await storage.getUserOrders(user.id);
  const profileText = `
👤 <b>Ваш профиль</b>

🪪 ID: ${user.id}
📱 Telegram ID: ${user.telegramId}
📦 Заказов: ${orders.length}
${user.isAdmin ? '👑 Администратор' : ''}

<i>Используйте кнопки ниже для управления профилем:</i>
`;

  const keyboard = {
    inline_keyboard: [
      [
        { text: '📦 Мои заказы', callback_data: 'my_orders' },
        { text: '📍 Адреса доставки', callback_data: 'delivery_addresses' }
      ],
      [
        { text: '⚙️ Настройки', callback_data: 'settings' }
      ]
    ]
  };

  await telegramBot.bot.sendMessage(chatId, profileText, {
    parse_mode: 'HTML',
    reply_markup: keyboard
  });
});

// Обработчик команды админа
telegramBot.bot.onText(/\/admin/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from?.id.toString();

  if (!userId || !telegramBot.isAuthorized(userId)) {
    await telegramBot.bot.sendMessage(chatId, '⛔️ У вас нет доступа к админ-панели');
    return;
  }

  const keyboard = {
    inline_keyboard: [
      [{ text: '📊 Статистика', callback_data: 'admin_stats' }],
      [{ text: '📦 Управление товарами', callback_data: 'admin_products' }],
      [{ text: '👥 Пользователи', callback_data: 'admin_users' }],
      [{ text: '🚚 Заказы', callback_data: 'admin_orders' }]
    ]
  };

  await telegramBot.bot.sendMessage(chatId,
    '👨‍💼 <b>Админ-панель</b>\n\nВыберите раздел:',
    { 
      parse_mode: 'HTML',
      reply_markup: keyboard 
    }
  );
});

// Set bot commands
telegramBot.setCommands([
  { command: 'start', description: 'Запустить бота' },
  { command: 'help', description: 'Помощь' },
  { command: 'admin', description: 'Админ-панель' }
]);
