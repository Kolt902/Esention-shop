const express = require('express');
const path = require('path');
const cors = require('cors');
const localtunnel = require('localtunnel');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'webapp')));

// Маршрут для главной страницы
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'webapp', 'index.html'));
});

// API для получения товаров
app.get('/api/products', (req, res) => {
    const products = [
        {
            id: 1,
            name: 'Nike Air Max',
            price: 12999,
            image: 'https://via.placeholder.com/300'
        },
        {
            id: 2,
            name: 'Adidas Yeezy',
            price: 24999,
            image: 'https://via.placeholder.com/300'
        },
        {
            id: 3,
            name: 'Supreme Box Logo Hoodie',
            price: 45000,
            image: 'https://via.placeholder.com/300'
        }
    ];
    res.json(products);
});

// Запускаем сервер и создаем туннель
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        const tunnel = await localtunnel({ 
            port: PORT,
            subdomain: 'fashionstore-bot', // Фиксированный поддомен
            allow_invalid_certs: true,
            local_https: false,
            allow_http: true
        });
        
        console.log(`Public URL: ${tunnel.url}`);
        
        // Обновляем URL в keyboards.js
        const fs = require('fs');
        const keyboardsPath = path.join(__dirname, 'keyboards.js');
        let keyboardsContent = fs.readFileSync(keyboardsPath, 'utf8');
        keyboardsContent = keyboardsContent.replace(
            /webApp\('🏪 Открыть магазин', '[^']+'\)/,
            `webApp('🏪 Открыть магазин', '${tunnel.url}')`
        );
        fs.writeFileSync(keyboardsPath, keyboardsContent);
        
        tunnel.on('close', () => {
            console.log('Tunnel closed');
        });

        tunnel.on('error', (err) => {
            console.error('Tunnel error:', err);
        });
    } catch (error) {
        console.error('Error creating tunnel:', error);
    }
}); 