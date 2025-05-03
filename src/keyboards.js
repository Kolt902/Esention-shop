const { Markup } = require('telegraf');

const mainKeyboard = Markup.keyboard([
  [Markup.button.webApp('🏪 Открыть магазин', 'https://esention-shop.onrender.com')],
  ['👜 Мои заказы', '❓ Помощь']
]).resize();

module.exports = {
  mainKeyboard
}; 