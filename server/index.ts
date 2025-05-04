import express from 'express';
import path from 'path';
import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN must be provided!');
}

// Initialize Express app and Telegram bot
const app = express();
const PORT = process.env.PORT || 4000;
const bot = new Telegraf(process.env.BOT_TOKEN);

// Bot command handlers
bot.command('start', (ctx) => {
  ctx.reply('Открыть Esention Store! 🛍️', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Открыть', web_app: { url: 'https://esention-shop.onrender.com/' } }]
      ]
    }
  });
});

// Start bot
bot.launch();

// Serve static files
app.use(express.static(path.join(__dirname, '../client/dist')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
