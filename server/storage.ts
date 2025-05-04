import {
  User,
  Product,
  CartItem,
  Order,
  InsertUser,
  InsertCartItem,
} from "../shared/types";

export interface IStorage {
  // User Operations
  getUser(id: string): Promise<User | null>;
  getUserByTelegramId(telegramId: string): Promise<User | null>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Product Operations
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | null>;
  getProductsByFilter(filters: { category?: string }): Promise<Product[]>;
  
  // Cart Operations
  getCartItems(userId: string): Promise<CartItem[]>;
  addCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  removeCartItem(id: string): Promise<boolean>;
  clearCart(userId: string): Promise<boolean>;
  
  // Order Operations
  getOrders(): Promise<Order[]>;
  getUserOrders(userId: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | null>;
}

class MemoryStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private cart: Map<string, CartItem[]>;
  private orders: Map<string, Order[]>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.cart = new Map();
    this.orders = new Map();

    // Add some sample products
    this.initializeSampleProducts();
  }

  private initializeSampleProducts() {
    const sampleProducts: Product[] = [
      {
        id: '1',
        name: 'Мужская куртка',
        description: 'Стильная куртка из натуральной кожи',
        price: 299.99,
        category: 'Мужское',
        imageUrl: 'https://example.com/jacket.jpg'
      },
      {
        id: '2',
        name: 'Женское платье',
        description: 'Элегантное вечернее платье',
        price: 199.99,
        category: 'Женское',
        imageUrl: 'https://example.com/dress.jpg'
      },
      {
        id: '3',
        name: 'Кроссовки Nike',
        description: 'Спортивные кроссовки для бега',
        price: 149.99,
        category: 'Обувь',
        imageUrl: 'https://example.com/sneakers.jpg'
      }
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  // User Operations
  async getUser(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getUserByTelegramId(telegramId: string): Promise<User | null> {
    return Array.from(this.users.values()).find(user => user.telegramId === telegramId) || null;
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser = { ...user, id: Date.now().toString() };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Product Operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | null> {
    return this.products.get(id) || null;
  }

  async getProductsByFilter(filters: { category?: string }): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => {
      if (filters.category && product.category !== filters.category) {
        return false;
      }
      return true;
    });
  }

  // Cart Operations
  async getCartItems(userId: string): Promise<CartItem[]> {
    return this.cart.get(userId) || [];
  }

  async addCartItem(cartItem: InsertCartItem): Promise<CartItem> {
    const userCart = this.cart.get(cartItem.userId) || [];
    const newItem = { ...cartItem, id: Date.now().toString() };
    userCart.push(newItem);
    this.cart.set(cartItem.userId, userCart);
    return newItem;
  }

  async removeCartItem(id: string): Promise<boolean> {
    for (const [userId, items] of this.cart.entries()) {
      const index = items.findIndex(item => item.id === id);
      if (index !== -1) {
        items.splice(index, 1);
        this.cart.set(userId, items);
        return true;
      }
    }
    return false;
  }

  async clearCart(userId: string): Promise<boolean> {
    this.cart.delete(userId);
    return true;
  }

  // Order Operations
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).flat();
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.orders.get(userId) || [];
  }

  async getOrder(id: string): Promise<Order | null> {
    for (const orders of this.orders.values()) {
      const order = orders.find(o => o.id === id);
      if (order) return order;
    }
    return null;
  }
}

// Export storage instance
export const storage = new MemoryStorage();
