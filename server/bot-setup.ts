import { telegramBot } from './telegram';

export async function setupBot() {
    try {
        // Проверяем наличие токена
        if (!process.env.TELEGRAM_BOT_TOKEN) {
            throw new Error('TELEGRAM_BOT_TOKEN не установлен');
        }

        // Проверяем webhook URL
        if (!process.env.WEBHOOK_URL) {
            throw new Error('WEBHOOK_URL не установлен');
        }

        console.log('Начинаем настройку бота...');

        // Удаляем старый webhook
        console.log('Удаляем старый webhook...');
        await telegramBot.deleteWebhook();

        // Устанавливаем команды бота
        console.log('Устанавливаем команды бота...');
        const commands = [
            { command: 'start', description: 'Открыть магазин' },
            { command: 'help', description: 'Показать помощь' }
        ];
        await telegramBot.setCommands(commands);

        // Устанавливаем новый webhook
        console.log('Устанавливаем новый webhook...');
        const success = await telegramBot.setWebhook(process.env.WEBHOOK_URL);
        
        if (success) {
            console.log('Webhook успешно установлен');
            
            // Проверяем информацию о webhook
            const webhookInfo = await telegramBot.getWebhookInfo();
            console.log('Информация о webhook:', webhookInfo);
        } else {
            throw new Error('Не удалось установить webhook');
        }

        // Устанавливаем кнопку меню
        console.log('Настраиваем кнопку меню...');
        await telegramBot.setMenuButton({
            type: 'web_app',
            text: 'Открыть магазин',
            web_app: { url: process.env.WEB_APP_URL || '' }
        });

        console.log('Бот успешно настроен!');
        return true;
    } catch (error) {
        console.error('Ошибка при настройке бота:', error);
        return false;
    }
} 