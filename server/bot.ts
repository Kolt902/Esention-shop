import TelegramBot from 'node-telegram-bot-api';
import { storage } from './storage';
import { Product, CartItem, User } from '../shared/types';

export class Bot {
  private bot: TelegramBot;
  private adminIds: string[];
  private webAppUrl: string;

  constructor(
    token: string = '7075179069:AAGgtpcyrVilR0ttXFDhtfCfXfG0MqkhE3s',
    webAppUrl: string = 'https://esention-shop.onrender.com',
    adminIds: string[] = []
  ) {
    this.bot = new TelegramBot(token, { polling: true });
    this.adminIds = adminIds;
    this.webAppUrl = webAppUrl;
    this.setupHandlers();
  }

  public async getMe(): Promise<TelegramBot.User> {
    return this.bot.getMe();
  }

  private setupHandlers() {
    // Главное меню с Web App
    const mainMenuKeyboard = {
      keyboard: [
        [{ text: '🏪 Открыть магазин', web_app: { url: this.webAppUrl } }],
        [{ text: '🛒 Корзина' }, { text: '📞 Контакты' }],
      ],
      resize_keyboard: true
    };

    // Приветственное сообщение
    const welcomeMessage = `
Добро пожаловать в Esention Store! 🛍

Ваш премиальный магазин одежды в Европе:

• Все цены в евро (€)
• Доставка по всей Европе
• Гарантия подлинности
• Безопасные платежи

Нажмите кнопку "Открыть магазин" чтобы начать покупки 🛍
`;

    // Обработчик /start
    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      
      // Создаем inline клавиатуру с кнопкой Web App
      const inlineKeyboard = {
        inline_keyboard: [
          [{
            text: '🏪 Открыть магазин',
            web_app: { url: this.webAppUrl }
          }]
        ]
      };

      await this.bot.sendMessage(chatId, welcomeMessage, {
        parse_mode: 'HTML',
        reply_markup: inlineKeyboard
      });

      // Создаем пользователя, если его нет
      const user = await storage.getUserByTelegramId(chatId.toString());
      if (!user) {
        await storage.createUser({
          telegramId: chatId.toString(),
          username: msg.from?.username || '',
          firstName: msg.from?.first_name || '',
          lastName: msg.from?.last_name || ''
        });
      }
    });

    // Обработчик корзины
    this.bot.onText(/🛒 Корзина/, async (msg) => {
      const chatId = msg.chat.id;
      const cartItems = await storage.getCartItems(chatId.toString());

      if (!cartItems || cartItems.length === 0) {
        const emptyCartKeyboard = {
          inline_keyboard: [
            [{
              text: '🏪 Перейти в магазин',
              web_app: { url: this.webAppUrl }
            }]
          ]
        };

        await this.bot.sendMessage(chatId, '🛒 Ваша корзина пуста\nНажмите кнопку ниже, чтобы перейти в магазин', {
          reply_markup: emptyCartKeyboard
        });
        return;
      }

      let total = 0;
      let cartText = '🛒 <b>Ваша корзина:</b>\n\n';

      for (const item of cartItems) {
        const product = await storage.getProduct(item.productId);
        if (product) {
          const itemTotal = product.price * item.quantity;
          total += itemTotal;
          cartText += `${product.name}\n`;
          cartText += `${item.quantity} x ${product.price}€ = ${itemTotal}€\n\n`;
        }
      }

      cartText += `\n💰 <b>Итого: ${total}€</b>`;

      const keyboard = {
        inline_keyboard: [
          [
            { text: '🗑 Очистить', callback_data: 'clear_cart' },
            { text: '✅ Оформить', callback_data: 'checkout' }
          ],
          [{
            text: '🏪 Вернуться в магазин',
            web_app: { url: this.webAppUrl }
          }]
        ]
      };

      await this.bot.sendMessage(chatId, cartText, {
        parse_mode: 'HTML',
        reply_markup: keyboard
      });
    });

    // Обработчик контактов
    this.bot.onText(/📞 Контакты/, async (msg) => {
      const chatId = msg.chat.id;
      const contactsMessage = `
📞 <b>Наши контакты:</b>

📱 Телефон: +7 (999) 123-45-67
✉️ Email: support@esention.store
🌐 Сайт: www.esention.store
📍 Адрес: г. Москва, ул. Примерная, д. 1

⏰ Время работы:
Пн-Пт: 10:00 - 20:00
Сб-Вс: 11:00 - 18:00
`;

      const contactsKeyboard = {
        inline_keyboard: [
          [{
            text: '🏪 Вернуться в магазин',
            web_app: { url: this.webAppUrl }
          }]
        ]
      };

      await this.bot.sendMessage(chatId, contactsMessage, {
        parse_mode: 'HTML',
        reply_markup: contactsKeyboard
      });
    });

    // Обработчик callback-запросов
    this.bot.on('callback_query', async (query) => {
      if (!query.message) return;

      const chatId = query.message.chat.id;
      const data = query.data;

      if (data === 'clear_cart') {
        await storage.clearCart(chatId.toString());
        await this.bot.answerCallbackQuery(query.id, {
          text: '🗑 Корзина очищена'
        });
        await this.bot.deleteMessage(chatId, query.message.message_id);
        
        const emptyCartKeyboard = {
          inline_keyboard: [
            [{
              text: '🏪 Перейти в магазин',
              web_app: { url: this.webAppUrl }
            }]
          ]
        };

        await this.bot.sendMessage(chatId, '🛒 Корзина очищена\nНажмите кнопку ниже, чтобы перейти в магазин', {
          reply_markup: emptyCartKeyboard
        });
      }
    });
  }

  private createProductCard(product: Product): string {
    return `
<b>${product.name}</b>
💰 <b>${product.price.toLocaleString('ru-RU')} €</b>

${product.description || ''}

📦 В наличии
🏷 Категория: ${product.category}
`;
  }

  private isAdmin(userId: string): boolean {
    return this.adminIds.includes(userId);
  }
}

// Создаем экземпляр бота с токеном напрямую
export const bot = new Bot(
  '7075179069:AAGgtpcyrVilR0ttXFDhtfCfXfG0MqkhE3s',
  'https://esention-shop.onrender.com'
); 