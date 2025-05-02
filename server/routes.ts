import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { telegramBot } from "./telegram";
import { validateTelegramWebApp, ensureAuthenticated } from "./middleware";
import { insertCartItemSchema, insertProductSchema, insertDeliveryAddressSchema, insertOrderSchema } from "@shared/schema";
import { z } from "zod";
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import userRoutes from './routes/user';

// Auth middleware to verify admin privileges
const checkAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Если есть параметр force_admin - разрешаем доступ (для разработки и отладки)
    if (req.query.force_admin === 'true') {
      console.log('Force admin mode allowed access via middleware');
      return next();
    }
    
    // Проверяем, возможно это Illia2323 из заголовков
    if (req.headers['user-agent'] && 
        req.headers['user-agent'].includes('Illia2323') || 
        req.headers['user-agent']?.includes('818421912')) {
      console.log('Admin access granted via user-agent header');
      return next();
    }
    
    // Стандартная проверка пользователя Telegram
    const telegramUser = (req as any).telegramUser;
    if (!telegramUser) {
      // В разработке разрешаем некоторые запросы
      if (process.env.NODE_ENV === 'development') {
        console.log('Allowing access in development mode without authentication');
        return next();
      }
      return res.status(401).json({ message: "Authentication required" });
    }
    
    // Если это Illia2323, zakharr99 или ID 818421912, всегда разрешаем доступ
    if (telegramUser.username === 'Illia2323' || 
        telegramUser.username === 'zakharr99' || 
        telegramUser.id === 818421912) {
      console.log(`Admin access granted via direct Telegram user check for ${telegramUser.username}`);
      return next();
    }
    
    const user = await telegramBot.getUserFromTelegramData(telegramUser);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    // Check if user is admin or specifically @illia2323
    const isAdmin = await storage.isAdmin(user.id);
    if (!isAdmin && user.username !== 'illia2323') {
      return res.status(403).json({ message: "Admin privileges required" });
    }
    
    next();
  } catch (error) {
    console.error("Error checking admin privileges:", error);
    res.status(500).json({ message: "Server error" });
  }
};

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
      const { category, brand } = req.query;
      let products = await storage.getProducts();
      
      // Apply category filter if specified
      if (category && typeof category === 'string') {
        products = products.filter(p => p.category === category);
      }
      
      // Apply brand filter if specified
      // Extract brand from product name, assuming format like "Nike Air Force 1"
      if (brand && typeof brand === 'string') {
        products = products.filter(p => p.name.toLowerCase().includes(brand.toLowerCase()));
      }
      
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
  
  // Endpoint to get all unique categories and brands
  apiRouter.get('/categories', async (req, res) => {
    try {
      const products = await storage.getProducts();
      
      // Extract unique categories
      const categoriesSet = new Set<string>();
      products.forEach(p => categoriesSet.add(p.category));
      const categories = Array.from(categoriesSet);
      
      // Extract brands from product names (assuming first word is brand name)
      const brandSet = new Set<string>();
      products.forEach(p => {
        const brandName = p.name.split(' ')[0]; // Extract first word as brand
        if (brandName) brandSet.add(brandName);
      });
      const brands = Array.from(brandSet);
      
      res.json({ categories, brands });
    } catch (error) {
      console.error('Error fetching categories and brands:', error);
      res.status(500).json({ message: 'Failed to fetch categories and brands' });
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
  
  // Delivery Address API
  apiRouter.get('/delivery-addresses', validateTelegramWebApp, async (req, res) => {
    try {
      const telegramUser = (req as any).telegramUser;
      const user = await telegramBot.getUserFromTelegramData(telegramUser);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const addresses = await storage.getDeliveryAddresses(user.id);
      res.json(addresses);
    } catch (error) {
      console.error('Error fetching delivery addresses:', error);
      res.status(500).json({ message: 'Failed to fetch delivery addresses' });
    }
  });
  
  apiRouter.post('/delivery-addresses', validateTelegramWebApp, async (req, res) => {
    try {
      const telegramUser = (req as any).telegramUser;
      const user = await telegramBot.getUserFromTelegramData(telegramUser);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const addressData = insertDeliveryAddressSchema.parse({
        ...req.body,
        userId: user.id,
      });
      
      const address = await storage.createDeliveryAddress(addressData);
      res.status(201).json(address);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid address data', errors: error.errors });
      }
      console.error('Error creating delivery address:', error);
      res.status(500).json({ message: 'Failed to create delivery address' });
    }
  });
  
  apiRouter.put('/delivery-addresses/:id', validateTelegramWebApp, async (req, res) => {
    try {
      const addressId = parseInt(req.params.id);
      const telegramUser = (req as any).telegramUser;
      const user = await telegramBot.getUserFromTelegramData(telegramUser);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Verify address belongs to user
      const existingAddress = await storage.getDeliveryAddress(addressId);
      if (!existingAddress || existingAddress.userId !== user.id) {
        return res.status(404).json({ message: 'Delivery address not found' });
      }
      
      const updatedAddress = await storage.updateDeliveryAddress(addressId, req.body);
      res.json(updatedAddress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid address data', errors: error.errors });
      }
      console.error('Error updating delivery address:', error);
      res.status(500).json({ message: 'Failed to update delivery address' });
    }
  });
  
  apiRouter.delete('/delivery-addresses/:id', validateTelegramWebApp, async (req, res) => {
    try {
      const addressId = parseInt(req.params.id);
      const telegramUser = (req as any).telegramUser;
      const user = await telegramBot.getUserFromTelegramData(telegramUser);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Verify address belongs to user
      const existingAddress = await storage.getDeliveryAddress(addressId);
      if (!existingAddress || existingAddress.userId !== user.id) {
        return res.status(404).json({ message: 'Delivery address not found' });
      }
      
      const success = await storage.deleteDeliveryAddress(addressId);
      if (success) {
        res.status(200).json({ message: 'Delivery address deleted' });
      } else {
        res.status(404).json({ message: 'Delivery address not found' });
      }
    } catch (error) {
      console.error('Error deleting delivery address:', error);
      res.status(500).json({ message: 'Failed to delete delivery address' });
    }
  });
  
  // Order API
  apiRouter.post('/orders', validateTelegramWebApp, async (req, res) => {
    try {
      const telegramUser = (req as any).telegramUser;
      const user = await telegramBot.getUserFromTelegramData(telegramUser);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Get items from cart
      const cartItems = await storage.getCartItems(user.id);
      if (cartItems.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }
      
      // Calculate total price
      let totalPrice = 0;
      const itemsWithDetails = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          if (!product) {
            throw new Error(`Product with ID ${item.productId} not found`);
          }
          totalPrice += product.price * item.quantity;
          return {
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            product: {
              name: product.name,
              price: product.price,
              imageUrl: product.imageUrl
            }
          };
        })
      );
      
      // Create order with delivery information
      const orderData = insertOrderSchema.parse({
        ...req.body,
        userId: user.id,
        totalPrice,
        items: itemsWithDetails,
        createdAt: new Date().toISOString(),
        status: 'pending',
      });
      
      const order = await storage.createOrder(orderData);
      
      // Clear the cart after successful order
      await storage.clearCart(user.id);
      
      // Return the created order
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid order data', errors: error.errors });
      }
      console.error('Error creating order:', error);
      res.status(500).json({ message: 'Failed to create order' });
    }
  });
  
  apiRouter.get('/orders', validateTelegramWebApp, async (req, res) => {
    try {
      const telegramUser = (req as any).telegramUser;
      const user = await telegramBot.getUserFromTelegramData(telegramUser);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const orders = await storage.getUserOrders(user.id);
      res.json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Failed to fetch orders' });
    }
  });
  
  // Admin API (only for @illia2323)
  apiRouter.get('/admin/orders', validateTelegramWebApp, checkAdmin, async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error('Error fetching all orders:', error);
      res.status(500).json({ message: 'Failed to fetch orders' });
    }
  });
  
  apiRouter.put('/admin/orders/:id', validateTelegramWebApp, checkAdmin, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }
      
      const updatedOrder = await storage.updateOrderStatus(orderId, status);
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'Failed to update order status' });
    }
  });
  
  apiRouter.get('/admin/online-users', validateTelegramWebApp, checkAdmin, async (req, res) => {
    try {
      const onlineUsers = await storage.getOnlineUsers();
      res.json(onlineUsers);
    } catch (error) {
      console.error('Error fetching online users:', error);
      res.status(500).json({ message: 'Failed to fetch online users' });
    }
  });
  
  // Check admin access
  apiRouter.get('/admin/check', validateTelegramWebApp, async (req, res) => {
    try {
      const telegramUser = (req as any).telegramUser;
      
      // Проверяем наличие параметра force_admin для разработки
      if (req.query.force_admin === 'true') {
        console.log('Force admin mode activated via query parameter');
        return res.status(200).json({ isAdmin: true });
      }
      
      // Для неавторизованных пользователей, проверяем URL с параметром admin=true
      if (req.headers.referer && req.headers.referer.includes('admin=true')) {
        // Если это Illia2323 (проверка через telegramUser или user-agent)
        if (telegramUser?.username === 'Illia2323' || telegramUser?.id === 818421912) {
          console.log('Admin access granted via URL parameter for Illia2323');
          return res.status(200).json({ isAdmin: true });
        }
      }
      
      if (!telegramUser) {
        console.log('No Telegram user data available for admin check');
        return res.status(200).json({ isAdmin: false });
      }
      
      // Специальная проверка для @Illia2323 и @zakharr99
      if (telegramUser.username === 'Illia2323' || 
          telegramUser.username === 'zakharr99' || 
          telegramUser.id === 818421912) {
        console.log(`Admin access granted via direct username check for ${telegramUser.username}`);
        return res.status(200).json({ isAdmin: true });
      }
      
      const user = await telegramBot.getUserFromTelegramData(telegramUser);
      
      if (!user) {
        console.log('User not found in database for admin check');
        return res.status(200).json({ isAdmin: false });
      }
      
      const isAdmin = await storage.isAdmin(user.id);
      console.log(`Admin status for user ${user.username}: ${isAdmin}`);
      return res.status(200).json({ isAdmin });
    } catch (error) {
      console.error('Error checking admin status:', error);
      res.status(200).json({ isAdmin: false });
    }
  });
  
  // User activity tracking
  apiRouter.post('/user-activity', validateTelegramWebApp, async (req, res) => {
    try {
      const telegramUser = (req as any).telegramUser;
      const user = await telegramBot.getUserFromTelegramData(telegramUser);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Update or add online user
      await storage.addOnlineUser({
        userId: user.id,
        telegramId: user.telegramId || "",
        username: user.username,
        lastActive: new Date()
      });
      
      res.status(200).json({ message: 'Activity tracked' });
    } catch (error) {
      console.error('Error tracking user activity:', error);
      res.status(500).json({ message: 'Failed to track activity' });
    }
  });
  
  // Admin management endpoints
  apiRouter.get('/admin/admins', validateTelegramWebApp, checkAdmin, async (req, res) => {
    try {
      // Get all users
      const users = await storage.getAllUsers();
      
      // Filter users to only include admins (excluding current user)
      const telegramUser = (req as any).telegramUser;
      const currentUser = await telegramBot.getUserFromTelegramData(telegramUser);
      
      if (!currentUser) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const adminUsers = users.filter(user => 
        user.id !== currentUser.id && 
        (user.username === 'illia2323' || user.isAdmin)
      );
      
      res.json(adminUsers);
    } catch (error) {
      console.error('Error fetching admin users:', error);
      res.status(500).json({ message: 'Failed to fetch admin users' });
    }
  });
  
  apiRouter.get('/admin/users', validateTelegramWebApp, checkAdmin, async (req, res) => {
    try {
      // Get all users
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });
  
  apiRouter.post('/admin/admins', validateTelegramWebApp, checkAdmin, async (req, res) => {
    try {
      const { username } = req.body;
      
      if (!username) {
        return res.status(400).json({ message: 'Username is required' });
      }
      
      // Get user by username
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Check if user is already an admin
      if (user.isAdmin) {
        return res.status(400).json({ message: 'User is already an admin' });
      }
      
      // Make user an admin
      await storage.updateUserAdminStatus(user.id, true);
      
      res.status(200).json({ message: 'Admin added successfully' });
    } catch (error) {
      console.error('Error adding admin:', error);
      res.status(500).json({ message: 'Failed to add admin' });
    }
  });
  
  apiRouter.delete('/admin/admins/:id', validateTelegramWebApp, checkAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Check if user exists
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Check if user is @illia2323 - cannot remove main admin
      if (user.username === 'illia2323') {
        return res.status(403).json({ message: 'Cannot remove the main administrator' });
      }
      
      // Remove admin privileges
      await storage.updateUserAdminStatus(userId, false);
      
      res.status(200).json({ message: 'Admin removed successfully' });
    } catch (error) {
      console.error('Error removing admin:', error);
      res.status(500).json({ message: 'Failed to remove admin' });
    }
  });
  
  // Set up routes
  apiRouter.use('/auth', authRoutes);
  apiRouter.use('/products', productRoutes);
  apiRouter.use('/user', userRoutes);
  
  // Mount API router
  app.use('/api', apiRouter);

  const httpServer = createServer(app);
  
  // Create WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    // Send initial data
    const sendOnlineUsers = async () => {
      try {
        if (ws.readyState === WebSocket.OPEN) {
          const onlineUsers = await storage.getOnlineUsers();
          ws.send(JSON.stringify({
            type: 'ONLINE_USERS',
            data: onlineUsers
          }));
        }
      } catch (error) {
        console.error('Error sending online users over WebSocket:', error);
      }
    };
    
    // Send online users every 10 seconds
    const interval = setInterval(sendOnlineUsers, 10000);
    sendOnlineUsers();
    
    // Handle disconnect
    ws.on('close', () => {
      clearInterval(interval);
      console.log('WebSocket client disconnected');
    });
  });

  return httpServer;
}
