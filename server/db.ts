import { MongoClient, Db } from 'mongodb';

let db: Db | null = null;

export async function connectToDatabase() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI не установлен в переменных окружения');
        }

        const client = await MongoClient.connect(process.env.MONGODB_URI);
        db = client.db();
        console.log('Успешно подключились к MongoDB');
        return db;
    } catch (error) {
        console.error('Ошибка подключения к MongoDB:', error);
        throw error;
    }
}

export function getDb() {
    if (!db) {
        throw new Error('База данных не инициализирована. Сначала вызовите connectToDatabase()');
    }
    return db;
}