import { db } from "./db/index";
import { eq, and, between, or, gte, lte, sql } from "drizzle-orm";
import {
  users,
  products,
  cartItems,
  deliveryAddresses,
  orders,
  onlineUsers
} from "./db/schema";
import {
  User,
  Product,
  CartItem,
  DeliveryAddress,
  Order,
  OnlineUser,
  InsertUser,
  InsertProduct,
  InsertCartItem,
  InsertOrder,
  InsertDeliveryAddress
} from "@shared/schema";
import { IStorage } from "./storage";
import {
  adaptUserToDrizzle,
  adaptProductToDrizzle,
  adaptCartItemToDrizzle,
  adaptDeliveryAddressToDrizzle,
  adaptOrderToDrizzle,
  adaptOnlineUserToDrizzle,
  adaptUserFromDrizzle,
  adaptProductFromDrizzle,
  adaptCartItemFromDrizzle,
  adaptDeliveryAddressFromDrizzle,
  adaptOrderFromDrizzle,
  adaptOnlineUserFromDrizzle
} from "./db/adapters";

export class DatabaseStorage implements IStorage {
  // User Methods
  async getUser(id: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users._id, id));
    return user ? adaptUserFromDrizzle(user) : null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user ? adaptUserFromDrizzle(user) : null;
  }

  async getUserByTelegramId(telegramId: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.telegramId, telegramId));
    return user ? adaptUserFromDrizzle(user) : null;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(adaptUserToDrizzle(insertUser)).returning();
    return adaptUserFromDrizzle(user);
  }

  async getAllUsers(): Promise<User[]> {
    const dbUsers = await db.select().from(users);
    return dbUsers.map(adaptUserFromDrizzle);
  }

  async updateUserProfile(userId: string, updates: Partial<InsertUser>): Promise<User | null> {
    const existingUser = await this.getUser(userId);
    if (!existingUser) return null;

    const [user] = await db
      .update(users)
      .set(adaptUserToDrizzle({ ...existingUser, ...updates }))
      .where(eq(users._id, userId))
      .returning();
    return user ? adaptUserFromDrizzle(user) : null;
  }

  async updateUserAdminStatus(userId: string, isAdmin: boolean): Promise<User | null> {
    const [user] = await db
      .update(users)
      .set({ isAdmin })
      .where(eq(users._id, userId))
      .returning();
    return user ? adaptUserFromDrizzle(user) : null;
  }

  // Product Methods
  async getProducts(): Promise<Product[]> {
    const dbProducts = await db.select().from(products);
    return dbProducts.map(adaptProductFromDrizzle);
  }

  async getProduct(id: string): Promise<Product | null> {
    const [product] = await db.select().from(products).where(eq(products._id, id));
    return product ? adaptProductFromDrizzle(product) : null;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(adaptProductToDrizzle(insertProduct)).returning();
    return adaptProductFromDrizzle(product);
  }

  async getProductsByFilter(filters: {
    category?: string;
    brand?: string;
    style?: string;
    gender?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Product[]> {
    let conditions = [];

    if (filters.category) {
      conditions.push(eq(products.category, filters.category));
    }
    if (filters.brand) {
      conditions.push(eq(products.brand, filters.brand));
    }
    if (filters.style) {
      conditions.push(eq(products.style, filters.style));
    }
    if (filters.gender) {
      conditions.push(eq(products.gender, filters.gender));
    }
    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      conditions.push(between(products.price, filters.minPrice, filters.maxPrice));
    } else if (filters.minPrice !== undefined) {
      conditions.push(gte(products.price, filters.minPrice));
    } else if (filters.maxPrice !== undefined) {
      conditions.push(lte(products.price, filters.maxPrice));
    }

    if (conditions.length === 0) {
      return this.getProducts();
    }

    const filteredProducts = await db
      .select()
      .from(products)
      .where(sql.join(conditions, sql` AND `));
    return filteredProducts.map(adaptProductFromDrizzle);
  }

  // Cart Methods
  async getCartItems(userId: string): Promise<CartItem[]> {
    const items = await db.select().from(cartItems).where(eq(cartItems.userId, userId));
    return items.map(adaptCartItemFromDrizzle);
  }

  async addCartItem(insertCartItem: InsertCartItem): Promise<CartItem> {
    const [cartItem] = await db.insert(cartItems).values(adaptCartItemToDrizzle(insertCartItem)).returning();
    return adaptCartItemFromDrizzle(cartItem);
  }

  async updateCartItemQuantity(id: string, quantity: number): Promise<CartItem | null> {
    const [cartItem] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems._id, id))
      .returning();
    return cartItem ? adaptCartItemFromDrizzle(cartItem) : null;
  }

  async removeCartItem(id: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems._id, id)).returning();
    return result.length > 0;
  }

  async clearCart(userId: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.userId, userId)).returning();
    return true;
  }

  // Delivery Address Methods
  async getDeliveryAddresses(userId: string): Promise<DeliveryAddress[]> {
    const addresses = await db.select().from(deliveryAddresses).where(eq(deliveryAddresses.userId, userId));
    return addresses.map(adaptDeliveryAddressFromDrizzle);
  }

  async getDeliveryAddress(id: string): Promise<DeliveryAddress | null> {
    const [address] = await db.select().from(deliveryAddresses).where(eq(deliveryAddresses._id, id));
    return address ? adaptDeliveryAddressFromDrizzle(address) : null;
  }

  async getDefaultDeliveryAddress(userId: string): Promise<DeliveryAddress | null> {
    const [address] = await db
      .select()
      .from(deliveryAddresses)
      .where(
        and(
          eq(deliveryAddresses.userId, userId),
          eq(deliveryAddresses.isDefault, true)
        )
      );
    return address ? adaptDeliveryAddressFromDrizzle(address) : null;
  }

  async createDeliveryAddress(address: InsertDeliveryAddress): Promise<DeliveryAddress> {
    const [newAddress] = await db.insert(deliveryAddresses).values(adaptDeliveryAddressToDrizzle(address)).returning();
    return adaptDeliveryAddressFromDrizzle(newAddress);
  }

  async updateDeliveryAddress(id: string, addressUpdate: Partial<InsertDeliveryAddress>): Promise<DeliveryAddress | null> {
    const existingAddress = await this.getDeliveryAddress(id);
    if (!existingAddress) return null;

    // If this address is being marked as default, remove default flag from other addresses
    if (addressUpdate.isDefault) {
      await db
        .update(deliveryAddresses)
        .set({ isDefault: false })
        .where(eq(deliveryAddresses.userId, existingAddress.userId));
    }

    const [updatedAddress] = await db
      .update(deliveryAddresses)
      .set(adaptDeliveryAddressToDrizzle({ ...existingAddress, ...addressUpdate }))
      .where(eq(deliveryAddresses._id, id))
      .returning();
    return updatedAddress ? adaptDeliveryAddressFromDrizzle(updatedAddress) : null;
  }

  async deleteDeliveryAddress(id: string): Promise<boolean> {
    const result = await db.delete(deliveryAddresses).where(eq(deliveryAddresses._id, id)).returning();
    return result.length > 0;
  }

  // Order Methods
  async getOrders(): Promise<Order[]> {
    const dbOrders = await db.select().from(orders);
    return dbOrders.map(adaptOrderFromDrizzle);
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    const userOrders = await db.select().from(orders).where(eq(orders.userId, userId));
    return userOrders.map(adaptOrderFromDrizzle);
  }

  async getOrder(id: string): Promise<Order | null> {
    const [order] = await db.select().from(orders).where(eq(orders._id, id));
    return order ? adaptOrderFromDrizzle(order) : null;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(adaptOrderToDrizzle(insertOrder)).returning();
    return adaptOrderFromDrizzle(order);
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | null> {
    const [order] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders._id, id))
      .returning();
    return order ? adaptOrderFromDrizzle(order) : null;
  }

  // Online Users Methods
  async getOnlineUsers(): Promise<OnlineUser[]> {
    const dbUsers = await db.select().from(onlineUsers);
    return dbUsers.map(adaptOnlineUserFromDrizzle);
  }

  async addOnlineUser(user: OnlineUser): Promise<void> {
    await db.insert(onlineUsers).values(adaptOnlineUserToDrizzle(user));
  }

  async removeOnlineUser(userId: string): Promise<void> {
    await db.delete(onlineUsers).where(eq(onlineUsers.userId, userId));
  }

  async updateUserActivity(userId: string): Promise<void> {
    await db
      .update(onlineUsers)
      .set({ lastActive: new Date() })
      .where(eq(onlineUsers.userId, userId));
  }

  // Admin check
  async isAdmin(userId: string): Promise<boolean> {
    const user = await this.getUser(userId);
    return user?.isAdmin || false;
  }
}