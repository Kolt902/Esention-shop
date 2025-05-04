import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { telegramBot } from './server/telegram';
import { connectToDatabase } from './server/db';

// Load environment variables
dotenv.config();

// Check environment variables
console.log('Environment variables:');
console.log('TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN ? '✓ Set' : '✗ Not set');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✓ Set' : '✗ Not set');
console.log('WEB_APP_URL:', process.env.WEB_APP_URL ? '✓ Set' : '✗ Not set');
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

// Webhook endpoint
app.post('/webhook', express.json(), async (req, res) => {
    try {
        const update = req.body;
        console.log('Received update:', JSON.stringify(update, null, 2));

        if (update.message?.text === '/start') {
            const chatId = update.message.chat.id;
            console.log(`Sending welcome message to ${chatId}`);
            
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

            await telegramBot.sendWelcomeMessage(chatId);
        }

        res.sendStatus(200);
    } catch (error) {
        console.error('Error handling webhook:', error);
        res.sendStatus(200); // Always return 200 to Telegram
    }
});

// Start server
async function startServer() {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await connectToDatabase();

        // Delete existing webhook
        console.log('Deleting existing webhook...');
        await telegramBot.deleteWebhook();

        // Set new webhook
        console.log('Setting new webhook...');
        const webhookUrl = process.env.WEBHOOK_URL;
        if (!webhookUrl) {
            throw new Error('WEBHOOK_URL is not set');
        }

        const success = await telegramBot.setWebhook(webhookUrl);
        if (!success) {
            throw new Error('Failed to set webhook');
        }

        console.log('Webhook set successfully');

        // Start listening
        app.listen(PORT, HOST, () => {
            console.log(`Server running at http://${HOST}:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer(); 