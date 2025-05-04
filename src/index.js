require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('src/webapp'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion-store', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Initialize bot
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Bot commands
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const keyboard = {
        keyboard: [
            [{
                text: '🏪 Открыть магазин',
                web_app: { url: process.env.WEBAPP_URL || `http://localhost:${PORT}` }
            }]
        ],
        resize_keyboard: true
    };
    
    bot.sendMessage(chatId, 
        'Добро пожаловать в Esention - ваш премиальный магазин одежды в Европе!\n\n' +
        '• Все цены в евро (€)\n' +
        '• Доставка по всей Европе\n' +
        '• Гарантия подлинности\n' +
        '• Безопасные платежи\n\n' +
        'Используйте кнопку ниже, чтобы открыть магазин:',
        { reply_markup: keyboard }
    );
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'webapp', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`WebApp URL: ${process.env.WEBAPP_URL || `http://localhost:${PORT}`}`);
}); 