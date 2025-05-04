import express from 'express';
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Check environment variables
console.log('Environment variables:');
console.log('BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN ? '✓ Set' : '✗ Not set');
console.log('WEBAPP_URL:', process.env.WEB_APP_URL ? '✓ Set' : '✗ Not set');
console.log('WEBHOOK_URL:', process.env.WEBHOOK_URL ? '✓ Set' : '✗ Not set');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Middleware
app.use(cors({
    origin: process.env.WEB_APP_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Import routes and bot setup
const { registerRoutes } = require('./server/routes');
const { setupBot } = require('./server/bot-setup');

// Start server
(async () => {
    try {
        // Инициализируем бота
        const botSetupSuccess = await setupBot();
        if (!botSetupSuccess) {
            console.error('Ошибка при настройке бота');
        }

        // Запускаем сервер
        const server = await registerRoutes(app);
        server.listen(PORT, HOST, () => {
            console.log(`Сервер запущен на http://${HOST}:${PORT}`);
        });
    } catch (error) {
        console.error('Ошибка при запуске сервера:', error);
        process.exit(1);
    }
})(); 