const { Markup } = require('telegraf');

const mainKeyboard = Markup.keyboard([
  [Markup.button.webApp('🏪 Открыть магазин', 'https://smooth-planets-allow.loca.lt')],
  ['👜 Мои заказы', '❓ Помощь']
]).resize();

module.exports = {
  mainKeyboard
}; 