import { Router, Request, Response, NextFunction } from 'express';
import { storage } from '../storage';
import { ensureAuthenticated } from '../middleware';
import { z } from 'zod';
import { User } from '@shared/schema';

// Extend Request type to include user
declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}

// Schema for profile updates
const updateProfileSchema = z.object({
  email: z.string().email().optional(),
  fullName: z.string().optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  preferences: z.object({
    language: z.enum(['ru', 'en', 'pl', 'cs', 'de']),
    theme: z.enum(['light', 'dark', 'auto']),
    currency: z.enum(['EUR', 'USD', 'RUB', 'PLN'])
  }).optional(),
  notificationSettings: z.object({
    orderUpdates: z.boolean(),
    promotions: z.boolean(),
    newArrivals: z.boolean(),
    priceDrops: z.boolean()
  }).optional()
}).partial();

// Create router
const router = Router();

// Get current user profile
router.get('/profile', ensureAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await storage.getUser(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Do not send sensitive data like password
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.patch('/profile', ensureAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Validate data through schema
    const validatedData = updateProfileSchema.parse(req.body);
    
    // Update user profile
    const updatedUser = await storage.updateUserProfile(req.user._id, validatedData);
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Do not send password in response
    const { password, ...safeUser } = updatedUser;
    res.json(safeUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid profile data', 
        errors: error.errors 
      });
    }
    next(error);
  }
});

// Get user orders
router.get('/orders', ensureAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const orders = await storage.getUserOrders(req.user._id);
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// Get user addresses
router.get('/addresses', ensureAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const addresses = await storage.getDeliveryAddresses(req.user._id);
    res.json(addresses);
  } catch (error) {
    next(error);
  }
});

// Create new address
router.post('/addresses', ensureAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const newAddress = await storage.createDeliveryAddress({
      ...req.body,
      userId: req.user._id
    });
    res.status(201).json(newAddress);
  } catch (error) {
    next(error);
  }
});

// Update address
router.patch('/addresses/:id', ensureAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const addressId = req.params.id;
    if (!addressId) {
      return res.status(400).json({ message: 'Address ID is required' });
    }

    const address = await storage.getDeliveryAddress(addressId);
    
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    // Ensure user can only update their own addresses
    if (address.userId !== req.user._id) {
      return res.status(403).json({ message: 'Not authorized to update this address' });
    }
    
    const updatedAddress = await storage.updateDeliveryAddress(addressId, req.body);
    res.json(updatedAddress);
  } catch (error) {
    next(error);
  }
});

// Set address as default
router.patch('/addresses/:id/default', ensureAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const addressId = req.params.id;
    if (!addressId) {
      return res.status(400).json({ message: 'Address ID is required' });
    }

    const address = await storage.getDeliveryAddress(addressId);
    
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    // Ensure user can only update their own addresses
    if (address.userId !== req.user._id) {
      return res.status(403).json({ message: 'Not authorized to update this address' });
    }
    
    // First, set all user addresses as non-default
    const userAddresses = await storage.getDeliveryAddresses(req.user._id);
    for (const addr of userAddresses) {
      if (addr.isDefault && addr._id !== addressId) {
        await storage.updateDeliveryAddress(addr._id, { isDefault: false });
      }
    }
    
    // Then set this address as default
    const updatedAddress = await storage.updateDeliveryAddress(addressId, { isDefault: true });
    res.json(updatedAddress);
  } catch (error) {
    next(error);
  }
});

// Delete address
router.delete('/addresses/:id', ensureAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const addressId = req.params.id;
    if (!addressId) {
      return res.status(400).json({ message: 'Address ID is required' });
    }

    const address = await storage.getDeliveryAddress(addressId);
    
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    // Ensure user can only delete their own addresses
    if (address.userId !== req.user._id) {
      return res.status(403).json({ message: 'Not authorized to delete this address' });
    }
    
    await storage.deleteDeliveryAddress(addressId);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Get favorites (based on product IDs)
router.post('/favorites', ensureAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { productIds } = req.body;
    
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.json([]);
    }
    
    const products = await Promise.all(
      productIds.map(id => storage.getProduct(id))
    );
    
    // Filter out any null products (not found)
    const validProducts = products.filter(p => p !== null);
    res.json(validProducts);
  } catch (error) {
    next(error);
  }
});

export default router;