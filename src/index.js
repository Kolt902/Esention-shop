require('dotenv').config();
const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const { mainKeyboard } = require('./keyboards');

// Проверка значения токена
console.log('BOT_TOKEN:', process.env.BOT_TOKEN);

// Запуск веб-сервера
require('./server');

// Инициализация бота
const bot = new Telegraf(process.env.BOT_TOKEN);

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Обработка команды /start
bot.command('start', async (ctx) => {
  console.log('Получена команда /start');
  const firstName = ctx.from.first_name;
  try {
    await ctx.reply(
      `Привет, ${firstName}! 👋\n\n` +
      'Добро пожаловать в наш модный магазин! 🛍\n' +
      'У нас ты найдешь самые стильные вещи по лучшим ценам.\n\n' +
      'Нажми на кнопку "Открыть магазин" чтобы начать покупки! 🏪',
      mainKeyboard
    );
    console.log('Ответ на команду /start отправлен');
  } catch (error) {
    console.error('Ошибка при отправке ответа:', error);
  }
});

// Обработка команды /help
bot.command('help', (ctx) => {
  ctx.reply(
    'Как пользоваться ботом:\n\n' +
    '1. Нажмите "🏪 Открыть магазин" для просмотра каталога\n' +
    '2. Выберите интересующие товары\n' +
    '3. Добавьте их в корзину\n' +
    '4. Оформите заказ\n\n' +
    'По всем вопросам пишите: @support',
    mainKeyboard
  );
});

// Обработка текстовых сообщений
bot.on('text', async (ctx) => {
  const text = ctx.message.text;

  switch (text) {
    case '👜 Мои заказы':
      await ctx.reply('Здесь будет история ваших заказов');
      break;
    case '❓ Помощь':
      await ctx.reply(
        'Чем могу помочь?\n\n' +
        'По всем вопросам пишите: @support'
      );
      break;
    default:
      await ctx.reply('Используйте меню для навигации', mainKeyboard);
  }
});

// Запуск бота
bot.launch()
  .then(() => {
    console.log('Bot successfully started');
    console.log('Bot username:', bot.botInfo?.username);
  })
  .catch((err) => {
    console.error('Bot start error:', err);
    console.error('Error details:', err.message);
  });

// Включаем graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM')); 