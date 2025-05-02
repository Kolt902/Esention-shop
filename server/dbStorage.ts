import { db } from "./db";
import { eq, and } from "drizzle-orm";
import {
  users,
  products,
  cartItems,
  deliveryAddresses,
  orders,
  onlineUsers,
  type User,
  type Product,
  type CartItem,
  type Order,
  type OnlineUser,
  type InsertUser,
  type InsertProduct,
  type InsertCartItem,
  type InsertOrder,
  insertDeliveryAddressSchema
} from "@shared/schema";

// Type for DeliveryAddress
type DeliveryAddress = typeof deliveryAddresses.$inferSelect;
// Type for InsertDeliveryAddress
type InsertDeliveryAddress = z.infer<typeof insertDeliveryAddressSchema>;

import { z } from "zod";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User Methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByTelegramId(telegramId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.telegramId, telegramId));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async updateUserAdminStatus(userId: number, isAdmin: boolean): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ isAdmin })
      .where(eq(users.id, userId))
      .returning();
    return user || undefined;
  }

  // Product Methods
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  // Cart Methods
  async getCartItems(userId: number): Promise<CartItem[]> {
    return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
  }

  async addCartItem(insertCartItem: InsertCartItem): Promise<CartItem> {
    const [cartItem] = await db.insert(cartItems).values(insertCartItem).returning();
    return cartItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const [cartItem] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return cartItem || undefined;
  }

  async removeCartItem(id: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id)).returning();
    return result.length > 0;
  }

  async clearCart(userId: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.userId, userId)).returning();
    return true;
  }

  // Delivery Address Methods
  async getDeliveryAddresses(userId: number): Promise<DeliveryAddress[]> {
    return await db.select().from(deliveryAddresses).where(eq(deliveryAddresses.userId, userId));
  }

  async getDeliveryAddress(id: number): Promise<DeliveryAddress | undefined> {
    const [address] = await db.select().from(deliveryAddresses).where(eq(deliveryAddresses.id, id));
    return address || undefined;
  }

  async getDefaultDeliveryAddress(userId: number): Promise<DeliveryAddress | undefined> {
    const [address] = await db
      .select()
      .from(deliveryAddresses)
      .where(
        and(
          eq(deliveryAddresses.userId, userId),
          eq(deliveryAddresses.isDefault, true)
        )
      );
    return address || undefined;
  }

  async createDeliveryAddress(insertAddress: InsertDeliveryAddress): Promise<DeliveryAddress> {
    // If this address is marked as default, remove default flag from other addresses
    if (insertAddress.isDefault) {
      await db
        .update(deliveryAddresses)
        .set({ isDefault: false })
        .where(eq(deliveryAddresses.userId, insertAddress.userId));
    }
    
    const [address] = await db.insert(deliveryAddresses).values(insertAddress).returning();
    return address;
  }

  async updateDeliveryAddress(id: number, addressUpdate: Partial<InsertDeliveryAddress>): Promise<DeliveryAddress | undefined> {
    // If this address is being marked as default, remove default flag from other addresses
    if (addressUpdate.isDefault) {
      const [currentAddress] = await db.select().from(deliveryAddresses).where(eq(deliveryAddresses.id, id));
      if (currentAddress) {
        await db
          .update(deliveryAddresses)
          .set({ isDefault: false })
          .where(
            and(
              eq(deliveryAddresses.userId, currentAddress.userId),
              eq(deliveryAddresses.id, id).not
            )
          );
      }
    }
    
    const [updatedAddress] = await db
      .update(deliveryAddresses)
      .set(addressUpdate)
      .where(eq(deliveryAddresses.id, id))
      .returning();
    return updatedAddress || undefined;
  }

  async deleteDeliveryAddress(id: number): Promise<boolean> {
    const result = await db.delete(deliveryAddresses).where(eq(deliveryAddresses.id, id)).returning();
    return result.length > 0;
  }

  // Order Methods
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return order || undefined;
  }

  // Online Users Methods
  async getOnlineUsers(): Promise<OnlineUser[]> {
    return await db.select().from(onlineUsers);
  }

  async addOnlineUser(user: OnlineUser): Promise<void> {
    // Проверяем существует ли уже пользователь
    const existingUsers = await db
      .select()
      .from(onlineUsers)
      .where(eq(onlineUsers.userId, user.userId));

    if (existingUsers.length > 0) {
      // Если пользователь уже существует, обновляем время активности
      await db
        .update(onlineUsers)
        .set({ lastActive: user.lastActive })
        .where(eq(onlineUsers.userId, user.userId));
    } else {
      // Иначе добавляем нового пользователя
      await db.insert(onlineUsers).values({
        userId: user.userId,
        telegramId: user.telegramId,
        username: user.username,
        lastActive: user.lastActive
      });
    }
  }

  async removeOnlineUser(userId: number): Promise<void> {
    await db.delete(onlineUsers).where(eq(onlineUsers.userId, userId));
  }

  async updateUserActivity(userId: number): Promise<void> {
    await db
      .update(onlineUsers)
      .set({ lastActive: new Date().toISOString() })
      .where(eq(onlineUsers.userId, userId));
  }

  // Admin check
  async isAdmin(userId: number): Promise<boolean> {
    const user = await this.getUser(userId);
    return user?.isAdmin || false;
  }
}