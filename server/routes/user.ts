import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { ensureAuthenticated } from '../middleware';

// Create router
const router = Router();

// Get current user profile
router.get('/profile', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = await storage.getUser(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Do not send sensitive data like password
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user orders
router.get('/orders', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const orders = await storage.getUserOrders(req.user.id);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user addresses
router.get('/addresses', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const addresses = await storage.getDeliveryAddresses(req.user.id);
    res.json(addresses);
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new address
router.post('/addresses', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const newAddress = await storage.createDeliveryAddress({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json(newAddress);
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update address
router.patch('/addresses/:id', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const addressId = parseInt(req.params.id);
    const address = await storage.getDeliveryAddress(addressId);
    
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    // Ensure user can only update their own addresses
    if (address.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this address' });
    }
    
    const updatedAddress = await storage.updateDeliveryAddress(addressId, req.body);
    res.json(updatedAddress);
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Set address as default
router.patch('/addresses/:id/default', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const addressId = parseInt(req.params.id);
    const address = await storage.getDeliveryAddress(addressId);
    
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    // Ensure user can only update their own addresses
    if (address.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this address' });
    }
    
    // First, set all user addresses as non-default
    const userAddresses = await storage.getDeliveryAddresses(req.user.id);
    for (const addr of userAddresses) {
      if (addr.isDefault && addr.id !== addressId) {
        await storage.updateDeliveryAddress(addr.id, { isDefault: false });
      }
    }
    
    // Then set this address as default
    const updatedAddress = await storage.updateDeliveryAddress(addressId, { isDefault: true });
    res.json(updatedAddress);
  } catch (error) {
    console.error('Error setting default address:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete address
router.delete('/addresses/:id', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const addressId = parseInt(req.params.id);
    const address = await storage.getDeliveryAddress(addressId);
    
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    // Ensure user can only delete their own addresses
    if (address.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this address' });
    }
    
    await storage.deleteDeliveryAddress(addressId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get favorites (based on product IDs)
router.post('/favorites', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const { productIds } = req.body;
    
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.json([]);
    }
    
    const products = await Promise.all(
      productIds.map(id => storage.getProduct(parseInt(id)))
    );
    
    // Filter out any undefined products (not found)
    const validProducts = products.filter(p => p !== undefined);
    
    res.json(validProducts);
  } catch (error) {
    console.error('Error fetching favorite products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;