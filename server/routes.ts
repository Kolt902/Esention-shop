import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { telegramBot } from "./telegram";
import { validateTelegramWebApp, ensureAuthenticated } from "./middleware";
import { insertCartItemSchema, insertProductSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = express.Router();
  
  // Telegram Bot webhook endpoint
  apiRouter.post('/bot/webhook', async (req, res) => {
    try {
      const update = req.body;
      
      // Handle incoming message
      if (update.message) {
        const chatId = update.message.chat.id;
        const text = update.message.text;
        
        if (text === '/start') {
          await telegramBot.sendWelcomeMessage(chatId);
        } else {
          // Handle other messages
          await telegramBot.sendMessage(
            chatId, 
            'Чтобы открыть магазин, используйте команду /start или нажмите на кнопку меню.'
          );
        }
      }
      
      res.sendStatus(200);
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // API endpoints for the web app
  // Products API
  apiRouter.get('/products', async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Failed to fetch products' });
    }
  });
  
  apiRouter.get('/products/:id', async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ message: 'Failed to fetch product' });
    }
  });
  
  // Product creation route - now available to all users with Telegram WebApp
  apiRouter.post('/products', validateTelegramWebApp, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid product data', errors: error.errors });
      }
      console.error('Error creating product:', error);
      res.status(500).json({ message: 'Failed to create product' });
    }
  });
  
  // Cart API
  apiRouter.get('/cart', validateTelegramWebApp, async (req, res) => {
    try {
      const telegramUser = (req as any).telegramUser;
      const user = await telegramBot.getUserFromTelegramData(telegramUser);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const cartItems = await storage.getCartItems(user.id);
      
      // Get product details for each cart item
      const cartWithProductDetails = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return {
            ...item,
            product,
          };
        })
      );
      
      res.json(cartWithProductDetails);
    } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ message: 'Failed to fetch cart' });
    }
  });
  
  apiRouter.post('/cart', validateTelegramWebApp, async (req, res) => {
    try {
      const telegramUser = (req as any).telegramUser;
      const user = await telegramBot.getUserFromTelegramData(telegramUser);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const cartItemData = insertCartItemSchema.parse({
        ...req.body,
        userId: user.id,
      });
      
      const cartItem = await storage.addCartItem(cartItemData);
      res.status(201).json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid cart data', errors: error.errors });
      }
      console.error('Error adding item to cart:', error);
      res.status(500).json({ message: 'Failed to add item to cart' });
    }
  });
  
  apiRouter.delete('/cart/:id', validateTelegramWebApp, async (req, res) => {
    try {
      const cartItemId = parseInt(req.params.id);
      const success = await storage.removeCartItem(cartItemId);
      
      if (!success) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
      
      res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      res.status(500).json({ message: 'Failed to remove item from cart' });
    }
  });
  
  apiRouter.delete('/cart', validateTelegramWebApp, async (req, res) => {
    try {
      const telegramUser = (req as any).telegramUser;
      const user = await telegramBot.getUserFromTelegramData(telegramUser);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      await storage.clearCart(user.id);
      res.status(200).json({ message: 'Cart cleared' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ message: 'Failed to clear cart' });
    }
  });
  
  // Set up Telegram API for front-end
  apiRouter.get('/telegram/init', (req, res) => {
    // Provide configuration data for the front-end
    res.json({
      webAppUrl: telegramBot.generateWebAppUrl(),
    });
  });
  
  // Telegram webhook endpoint
  app.post('/webhook', express.json(), async (req, res) => {
    try {
      const update = req.body;
      
      // Log received update for debugging
      console.log('Received Telegram update:', JSON.stringify(update, null, 2));
      
      // Check if this is a message update with the /start command
      if (update.message && update.message.text && update.message.text.startsWith('/start')) {
        const chatId = update.message.chat.id;
        
        console.log(`Sending welcome message to chat ID: ${chatId}`);
        
        // Send welcome message with WebApp button
        await telegramBot.sendWelcomeMessage(chatId);
      }
      
      // Always respond with 200 OK to Telegram
      res.sendStatus(200);
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.sendStatus(200); // Still return 200 to Telegram
    }
  });
  
  // Mount API router
  app.use('/api', apiRouter);

  const httpServer = createServer(app);

  return httpServer;
}
