import { Router, Request, Response, NextFunction } from 'express';
import { storage } from '../storage';
import { ensureAuthenticated } from '../middleware';

// Create router
const router = Router();

// Get all products
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await storage.getProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// Get product by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.id;
    const product = await storage.getProduct(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// Get favorite products
router.post('/favorites', async (req: Request, res: Response, next: NextFunction) => {
  try {
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