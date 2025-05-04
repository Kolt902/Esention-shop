import express, { Request, Response, NextFunction } from 'express';
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

const router = express.Router();

// Avatar parameter validation schema
const updateAvatarSchema = z.object({
  height: z.number().min(100).max(250).default(175),
  weight: z.number().min(30).max(200).default(70),
  bodyType: z.enum(['slim', 'regular', 'athletic']).default('regular'),
  gender: z.enum(['male', 'female']).default('male'),
  measurements: z.record(z.string(), z.number()).default({})
});

// Get user's avatar parameters
router.get('/params', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // If user is authenticated, get their parameters
    if (req.user?._id) {
      const avatarParams = await storage.getAvatarParams(req.user._id);
      
      if (avatarParams) {
        return res.json(avatarParams);
      }
    }
    
    // For unauthenticated users or if parameters not found,
    // return default values
    return res.json({
      height: 175,
      weight: 70,
      bodyType: 'regular',
      gender: 'male',
      measurements: {}
    });
  } catch (error) {
    next(error);
  }
});

// Update or create avatar parameters
router.post('/params', ensureAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Validate input data
    const validatedData = updateAvatarSchema.parse(req.body);
    
    // Check if parameters already exist for this user
    const existingParams = await storage.getAvatarParams(req.user._id);
    
    let avatarParams;
    if (existingParams) {
      // Update existing parameters
      avatarParams = await storage.updateAvatarParams(req.user._id, validatedData);
    } else {
      // Create new parameters
      avatarParams = await storage.createAvatarParams({
        userId: req.user._id,
        ...validatedData
      });
    }
    
    return res.json(avatarParams);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid data', errors: error.errors });
    }
    next(error);
  }
});

// Get all available clothing items for virtual try-on
router.get('/clothing', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Filters
    const category = req.query.category as string | undefined;
    const type = req.query.type as string | undefined;
    
    const clothingItems = await storage.getVirtualClothingItems({ category, type });
    return res.json(clothingItems);
  } catch (error) {
    next(error);
  }
});

// Get user's virtual wardrobe
router.get('/wardrobe', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // If user is authenticated, get their wardrobe
    if (req.user?._id) {
      const wardrobe = await storage.getUserVirtualWardrobe(req.user._id);
      return res.json(wardrobe);
    }
    
    // For unauthenticated users return empty array
    return res.json([]);
  } catch (error) {
    next(error);
  }
});

// Add clothing item to user's virtual wardrobe
router.post('/wardrobe', ensureAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { clothingItemId, selectedColor, selectedSize } = req.body;
    
    if (!clothingItemId || !selectedColor || !selectedSize) {
      return res.status(400).json({ 
        message: 'Missing required fields: clothingItemId, selectedColor, selectedSize' 
      });
    }
    
    // Check if clothing item exists
    const clothingItem = await storage.getVirtualClothingItem(clothingItemId);
    if (!clothingItem) {
      return res.status(404).json({ message: 'Clothing item not found' });
    }
    
    // Add to wardrobe
    const wardrobeItem = await storage.addToVirtualWardrobe({
      userId: req.user._id,
      clothingItemId,
      selectedColor,
      selectedSize,
      isFavorite: false,
      dateAdded: new Date().toISOString()
    });
    
    return res.json(wardrobeItem);
  } catch (error) {
    next(error);
  }
});

// Remove item from virtual wardrobe
router.delete('/wardrobe/:id', ensureAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const wardrobeItemId = req.params.id;
    if (!wardrobeItemId) {
      return res.status(400).json({ message: 'Invalid wardrobe item ID' });
    }
    
    // Check if item belongs to this user
    const wardrobeItem = await storage.getVirtualWardrobeItem(wardrobeItemId);
    if (!wardrobeItem || wardrobeItem.userId !== req.user._id) {
      return res.status(404).json({ message: 'Wardrobe item not found' });
    }
    
    const success = await storage.removeFromVirtualWardrobe(wardrobeItemId);
    if (success) {
      return res.json({ success: true });
    } else {
      return res.status(500).json({ message: 'Failed to remove item from wardrobe' });
    }
  } catch (error) {
    next(error);
  }
});

// Update item in virtual wardrobe (size, color, favorite)
router.patch('/wardrobe/:id', ensureAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const wardrobeItemId = req.params.id;
    if (!wardrobeItemId) {
      return res.status(400).json({ message: 'Invalid wardrobe item ID' });
    }
    
    // Check if item belongs to this user
    const wardrobeItem = await storage.getVirtualWardrobeItem(wardrobeItemId);
    if (!wardrobeItem || wardrobeItem.userId !== req.user._id) {
      return res.status(404).json({ message: 'Wardrobe item not found' });
    }
    
    // Update only allowed fields
    const { selectedColor, selectedSize, isFavorite } = req.body;
    const updates: Record<string, any> = {};
    
    if (selectedColor !== undefined) updates.selectedColor = selectedColor;
    if (selectedSize !== undefined) updates.selectedSize = selectedSize;
    if (isFavorite !== undefined) updates.isFavorite = isFavorite;
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid update fields provided' });
    }
    
    const updatedItem = await storage.updateVirtualWardrobeItem(wardrobeItemId, updates);
    return res.json(updatedItem);
  } catch (error) {
    next(error);
  }
});

export default router;