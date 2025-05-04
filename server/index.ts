import express from 'express';
import cors from 'cors';
import { Telegraf } from 'telegraf';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Telegram bot configuration
if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN environment variable is not set');
}

const token = process.env.BOT_TOKEN;
const webAppUrl = 'https://esention-shop.onrender.com/';

const bot = new Telegraf(token);
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files with proper cache control and security headers
app.use(express.static(path.join(__dirname, '../client/dist'), {
  setHeaders: (res) => {
    // Disable caching for development
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    // Allow embedding in Telegram Web App iframe
    res.setHeader('X-Frame-Options', 'ALLOW-FROM https://web.telegram.org/');
    res.setHeader('Content-Security-Policy', "frame-ancestors 'self' https://web.telegram.org/");
  }
}));

// Sample products data
const products = [
  {
    id: '1',
    name: 'Nike Dunk Low Retro',
    description: 'Культовые кроссовки в ретро стиле',
    price: 23500,
    imageUrl: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/99486859-0ff3-46b4-949b-2d16af2ad421/dunk-low-retro-shoes.png'
  },
  {
    id: '2',
    name: 'Supreme Box Logo Hoodie',
    description: 'Классическое худи с легендарным логотипом',
    price: 45000,
    imageUrl: 'https://assets.supremenewyork.com/images/products/170734/1.jpg'
  },
  {
    id: '3',
    name: 'Jordan 1 Retro High',
    description: 'Культовые баскетбольные кроссовки',
    price: 34999,
    imageUrl: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/99486859-0ff3-46b4-949b-2d16af2ad421/air-jordan-1-high-og-shoes.png'
  },
  {
    id: '4',
    name: 'Rolex Datejust 41',
    description: 'Легендарные часы в классическом дизайне',
    price: 890000,
    imageUrl: 'https://content.rolex.com/v7/dam/new-watches/2024/datejust/m126234-0051.png'
  }
];

// API endpoints
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Bot commands
bot.command('start', (ctx) => {
  ctx.reply('Открыть Esention Store! 🛍️', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'Открыть',
          web_app: { url: webAppUrl }
        }
      ]]
    }
  });
});

// Launch bot
bot.launch().catch((err) => {
  console.error('Error starting bot:', err);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Serve SPA (Single Page Application)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
