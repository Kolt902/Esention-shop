import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';

async function checkBot() {
    try {
        dotenv.config();
        const token = process.env.TELEGRAM_BOT_TOKEN;
        if (!token) {
            console.error('❌ TELEGRAM_BOT_TOKEN не установлен');
            return;
        }

        const bot = new TelegramBot(token);
        
        // Получаем информацию о боте
        const me = await bot.getMe();
        console.log('✅ Информация о боте:', me);
        
        // Получаем информацию о вебхуке
        const webhookInfo = await bot.getWebhookInfo();
        console.log('📡 Информация о вебхуке:', webhookInfo);
        
        // Получаем команды
        const commands = await bot.getMyCommands();
        console.log('📝 Команды:', commands);
        
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
    }
}

checkBot(); 