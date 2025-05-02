import express, { Request, Response } from 'express';
import { storage } from '../storage';
import { ensureAuthenticated } from '../middleware';
import { z } from 'zod';
import { insertAvatarParamsSchema } from '@shared/schema';

const router = express.Router();

// Валидация для обновления аватара
const updateAvatarSchema = insertAvatarParamsSchema.omit({ userId: true });

// Получить параметры аватара пользователя
router.get('/params', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const avatarParams = await storage.getAvatarParams(userId);
    
    if (!avatarParams) {
      // Если параметры ещё не были заданы, возвращаем значения по умолчанию
      return res.json({
        height: 175,
        weight: 70,
        bodyType: 'regular',
        gender: 'male',
        measurements: {}
      });
    }
    
    return res.json(avatarParams);
  } catch (error) {
    console.error('Error fetching avatar params:', error);
    return res.status(500).json({ message: 'Failed to fetch avatar parameters' });
  }
});

// Обновить или создать параметры аватара
router.post('/params', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    
    // Валидируем входные данные
    const validatedData = updateAvatarSchema.parse(req.body);
    
    // Проверяем, существуют ли уже параметры для этого пользователя
    const existingParams = await storage.getAvatarParams(userId);
    
    let avatarParams;
    if (existingParams) {
      // Обновляем существующие параметры
      avatarParams = await storage.updateAvatarParams(userId, validatedData);
    } else {
      // Создаем новые параметры
      avatarParams = await storage.createAvatarParams({
        userId,
        ...validatedData
      });
    }
    
    return res.json(avatarParams);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid data', errors: error.errors });
    }
    
    console.error('Error updating avatar params:', error);
    return res.status(500).json({ message: 'Failed to update avatar parameters' });
  }
});

// Получить все доступные предметы одежды для виртуальной примерки
router.get('/clothing', async (req: Request, res: Response) => {
  try {
    // Фильтры
    const category = req.query.category as string | undefined;
    const type = req.query.type as string | undefined;
    
    const clothingItems = await storage.getVirtualClothingItems({ category, type });
    return res.json(clothingItems);
  } catch (error) {
    console.error('Error fetching virtual clothing items:', error);
    return res.status(500).json({ message: 'Failed to fetch virtual clothing items' });
  }
});

// Получить виртуальный гардероб пользователя
router.get('/wardrobe', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const wardrobe = await storage.getUserVirtualWardrobe(userId);
    return res.json(wardrobe);
  } catch (error) {
    console.error('Error fetching user virtual wardrobe:', error);
    return res.status(500).json({ message: 'Failed to fetch virtual wardrobe' });
  }
});

// Добавить предмет одежды в виртуальный гардероб пользователя
router.post('/wardrobe', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    
    const { clothingItemId, selectedColor, selectedSize } = req.body;
    
    if (!clothingItemId || !selectedColor || !selectedSize) {
      return res.status(400).json({ 
        message: 'Missing required fields: clothingItemId, selectedColor, selectedSize' 
      });
    }
    
    // Проверяем, существует ли такой предмет одежды
    const clothingItem = await storage.getVirtualClothingItem(clothingItemId);
    if (!clothingItem) {
      return res.status(404).json({ message: 'Clothing item not found' });
    }
    
    // Добавляем в гардероб
    const wardrobeItem = await storage.addToVirtualWardrobe({
      userId,
      clothingItemId,
      selectedColor,
      selectedSize,
      isFavorite: false,
      dateAdded: new Date().toISOString()
    });
    
    return res.json(wardrobeItem);
  } catch (error) {
    console.error('Error adding to virtual wardrobe:', error);
    return res.status(500).json({ message: 'Failed to add item to virtual wardrobe' });
  }
});

// Удалить предмет из виртуального гардероба
router.delete('/wardrobe/:id', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const wardrobeItemId = parseInt(req.params.id);
    
    if (isNaN(wardrobeItemId)) {
      return res.status(400).json({ message: 'Invalid wardrobe item ID' });
    }
    
    // Проверяем, что предмет принадлежит этому пользователю
    const wardrobeItem = await storage.getVirtualWardrobeItem(wardrobeItemId);
    if (!wardrobeItem || wardrobeItem.userId !== userId) {
      return res.status(404).json({ message: 'Wardrobe item not found' });
    }
    
    const success = await storage.removeFromVirtualWardrobe(wardrobeItemId);
    if (success) {
      return res.json({ success: true });
    } else {
      return res.status(500).json({ message: 'Failed to remove item from wardrobe' });
    }
  } catch (error) {
    console.error('Error removing from virtual wardrobe:', error);
    return res.status(500).json({ message: 'Failed to remove item from virtual wardrobe' });
  }
});

// Обновить предмет в виртуальном гардеробе (размер, цвет, избранное)
router.patch('/wardrobe/:id', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const wardrobeItemId = parseInt(req.params.id);
    
    if (isNaN(wardrobeItemId)) {
      return res.status(400).json({ message: 'Invalid wardrobe item ID' });
    }
    
    // Проверяем, что предмет принадлежит этому пользователю
    const wardrobeItem = await storage.getVirtualWardrobeItem(wardrobeItemId);
    if (!wardrobeItem || wardrobeItem.userId !== userId) {
      return res.status(404).json({ message: 'Wardrobe item not found' });
    }
    
    // Обновляем только разрешенные поля
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
    console.error('Error updating virtual wardrobe item:', error);
    return res.status(500).json({ message: 'Failed to update virtual wardrobe item' });
  }
});

export default router;