import {
  users,
  type User,
  type InsertUser,
  products,
  type Product,
  type InsertProduct,
  cartItems,
  type CartItem,
  type InsertCartItem,
  deliveryAddresses,
  orders,
  type Order,
  type InsertOrder,
  insertDeliveryAddressSchema
} from "@shared/schema";
import { z } from "zod";

// Type for delivery address
export type DeliveryAddress = typeof deliveryAddresses.$inferSelect;
export type InsertDeliveryAddress = z.infer<typeof insertDeliveryAddressSchema>;

// Type for online users
export type OnlineUser = {
  userId: number;
  telegramId: string;
  username: string;
  lastActive: Date;
};

export interface IStorage {
  // User Operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByTelegramId(telegramId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserAdminStatus(userId: number, isAdmin: boolean): Promise<User | undefined>;
  
  // Product Operations
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Cart Operations
  getCartItems(userId: number): Promise<CartItem[]>;
  addCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;
  
  // Delivery Address Operations
  getDeliveryAddresses(userId: number): Promise<DeliveryAddress[]>;
  getDeliveryAddress(id: number): Promise<DeliveryAddress | undefined>;
  getDefaultDeliveryAddress(userId: number): Promise<DeliveryAddress | undefined>;
  createDeliveryAddress(address: InsertDeliveryAddress): Promise<DeliveryAddress>;
  updateDeliveryAddress(id: number, address: Partial<InsertDeliveryAddress>): Promise<DeliveryAddress | undefined>;
  deleteDeliveryAddress(id: number): Promise<boolean>;
  
  // Order Operations
  getOrders(): Promise<Order[]>; // For admin
  getUserOrders(userId: number): Promise<Order[]>; // For individual user
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Online Users Operations
  getOnlineUsers(): Promise<OnlineUser[]>;
  addOnlineUser(user: OnlineUser): Promise<void>;
  removeOnlineUser(userId: number): Promise<void>;
  updateUserActivity(userId: number): Promise<void>;
  
  // Admin Operations
  isAdmin(userId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private deliveryAddresses: Map<number, DeliveryAddress>;
  private orders: Map<number, Order>;
  private onlineUsers: Map<number, OnlineUser>;
  private currentUserId: number;
  private currentProductId: number;
  private currentCartItemId: number;
  private currentDeliveryAddressId: number;
  private currentOrderId: number;
  
  // Add admin user for @illia2323
  private adminUsername = "illia2323";

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.deliveryAddresses = new Map();
    this.orders = new Map();
    this.onlineUsers = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentCartItemId = 1;
    this.currentDeliveryAddressId = 1;
    this.currentOrderId = 1;
    
    // Create main admin user (illia2323)
    this.users.set(this.currentUserId++, {
      id: 1,
      username: this.adminUsername,
      password: "admin123", // This is just a placeholder, in a real app use secure passwords
      telegramId: "818421912",
      isAdmin: true
    });
    
    // Create second admin user (zakharr99)
    this.users.set(this.currentUserId++, {
      id: 2, 
      username: "zakharr99",
      password: "admin123", // This is just a placeholder, in a real app use secure passwords
      telegramId: "1056271534",
      isAdmin: true
    });
    
    // Initialize with Nike shoe products - all €80
    const price = 8000; // 80 euros in cents
    
    this.createProduct({
      name: "Nike Air Force 1",
      price,
      category: "lifestyle",
      imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-mens-shoes-jBrhbr.png",
      sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
      description: "The radiance lives on in the Nike Air Force 1, the basketball icon that puts a fresh spin on what you know best: crisp leather, bold colors and the perfect amount of flash.",
    });
    
    this.createProduct({
      name: "Nike Air Max 90",
      price,
      category: "lifestyle",
      imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/a895df73-5f78-4a1d-9d69-663f2491a5d5/air-max-90-mens-shoes-6n3vKB.png",
      sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
      description: "Lace up and feel the legacy with the Nike Air Max 90. Featuring the same iconic Waffle sole, stitched overlays and classic TPU details as the original, it lets you walk among the pantheon of Air Max greats.",
    });
    
    this.createProduct({
      name: "Nike Air Jordan 1",
      price,
      category: "basketball",
      imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/5653944b-9b93-4e57-ad13-cc816a776a9e/air-jordan-1-mid-shoes-86f1ZW.png",
      sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
      description: "The Air Jordan 1 Mid brings full-court style and premium comfort to an iconic look. Its Air-Sole unit cushions play on the hardwood, while the padded collar gives you a supportive feel.",
    });
    
    this.createProduct({
      name: "Nike Dunk Low",
      price,
      category: "lifestyle",
      imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/c96f77e1-9c8d-4f2e-9c9f-8a3a886aa3c1/dunk-low-shoes-t4Lk3P.png",
      sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
      description: "Created for the hardwood but taken to the streets, this '80s basketball icon returns with perfectly shined overlays and classic team colors. With its iconic hoops design, the Nike Dunk Low channels vintage style back onto the streets.",
    });
    
    this.createProduct({
      name: "Nike Air Zoom Pegasus",
      price,
      category: "running",
      imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/c3e2c568-a726-4ded-8a1e-25098e7a994e/pegasus-40-mens-road-running-shoes-bRqpc7.png",
      sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
      description: "Let the Nike Pegasus 40 help you ascend to new heights. This trusted trainer has the same reliable fit and feel that's helped runners for decades.",
    });
    
    this.createProduct({
      name: "Nike React Infinity",
      price,
      category: "running",
      imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/670f2ae5-8933-4d93-9354-d03bf6ce2a55/react-infinity-3-mens-road-running-shoes-1bRm03.png",
      sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
      description: "The Nike React Infinity delivers a smooth ride during your run. These shoes are cushioned for comfort, while the design provides enhanced stability from heel to toe.",
    });
    
    this.createProduct({
      name: "Nike Blazer Mid",
      price,
      category: "lifestyle",
      imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/d4b8cd01-09cb-4191-8703-a8a1ec2a82d0/blazer-mid-77-vintage-mens-shoes-nw30B2.png",
      sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
      description: "In the '70s, Nike was the new shoe on the block. So new in fact, we were still testing prototypes on elite runners. Of course, the design improved over the years, but the name stuck.",
    });
    
    this.createProduct({
      name: "Nike LeBron",
      price,
      category: "basketball",
      imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/62831c9e-0b69-436a-bf03-76cf4a71435e/lebron-witness-7-basketball-shoes-XPRc4M.png",
      sizes: ["40", "41", "42", "43", "44", "45", "46", "47"],
      description: "LeBron thrives when the pressure's high and his back's against the wall. The LeBron Witness series is designed to support your game when you pull out clutch plays inspired by the King.",
    });
    
    this.createProduct({
      name: "Nike Kyrie",
      price,
      category: "basketball",
      imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/1eb91968-f03c-4dce-bfa7-b6b1fe561879/precision-6-basketball-shoes-V704hS.png",
      sizes: ["40", "41", "42", "43", "44", "45", "46"],
      description: "The Nike Precision is made for players who beat opponents with skill and strategy more than power, as if they're playing chess while everyone else is playing checkers.",
    });
    
    this.createProduct({
      name: "Nike Air Max 270",
      price,
      category: "lifestyle",
      imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/vqpbkqglfrtpgxushseg/air-max-270-mens-shoes-KkLcGR.png",
      sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
      description: "Nike's first lifestyle Air Max brings you style, comfort and big attitude in the Nike Air Max 270. The design draws inspiration from Air Max icons, showcasing Nike's greatest innovation with its large window and fresh array of colors.",
    });
  }

  // User Methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByTelegramId(telegramId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.telegramId === telegramId,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Product Methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  // Cart Methods
  async getCartItems(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.userId === userId
    );
  }

  async addCartItem(insertCartItem: InsertCartItem): Promise<CartItem> {
    const id = this.currentCartItemId++;
    const cartItem: CartItem = { ...insertCartItem, id };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;
    
    const updatedCartItem = { ...cartItem, quantity };
    this.cartItems.set(id, updatedCartItem);
    return updatedCartItem;
  }

  async removeCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: number): Promise<boolean> {
    const cartItemsToRemove = Array.from(this.cartItems.values())
      .filter(item => item.userId === userId)
      .map(item => item.id);
    
    cartItemsToRemove.forEach(id => this.cartItems.delete(id));
    return true;
  }
  
  // Delivery Address Methods
  async getDeliveryAddresses(userId: number): Promise<DeliveryAddress[]> {
    return Array.from(this.deliveryAddresses.values()).filter(
      (address) => address.userId === userId
    );
  }
  
  async getDeliveryAddress(id: number): Promise<DeliveryAddress | undefined> {
    return this.deliveryAddresses.get(id);
  }
  
  async getDefaultDeliveryAddress(userId: number): Promise<DeliveryAddress | undefined> {
    return Array.from(this.deliveryAddresses.values()).find(
      (address) => address.userId === userId && address.isDefault === true
    );
  }
  
  async createDeliveryAddress(insertAddress: InsertDeliveryAddress): Promise<DeliveryAddress> {
    const id = this.currentDeliveryAddressId++;
    const address: DeliveryAddress = { ...insertAddress, id };
    
    // If this address is marked as default, remove default flag from other addresses
    if (address.isDefault) {
      const userAddresses = await this.getDeliveryAddresses(address.userId);
      userAddresses.forEach((addr) => {
        if (addr.id !== id && addr.isDefault) {
          const updated = { ...addr, isDefault: false };
          this.deliveryAddresses.set(addr.id, updated);
        }
      });
    }
    
    this.deliveryAddresses.set(id, address);
    return address;
  }
  
  async updateDeliveryAddress(id: number, addressUpdate: Partial<InsertDeliveryAddress>): Promise<DeliveryAddress | undefined> {
    const address = this.deliveryAddresses.get(id);
    if (!address) return undefined;
    
    const updatedAddress = { ...address, ...addressUpdate };
    
    // If this address is being marked as default, remove default flag from other addresses
    if (addressUpdate.isDefault && address.isDefault !== addressUpdate.isDefault) {
      const userAddresses = await this.getDeliveryAddresses(address.userId);
      userAddresses.forEach((addr) => {
        if (addr.id !== id && addr.isDefault) {
          const updated = { ...addr, isDefault: false };
          this.deliveryAddresses.set(addr.id, updated);
        }
      });
    }
    
    this.deliveryAddresses.set(id, updatedAddress);
    return updatedAddress;
  }
  
  async deleteDeliveryAddress(id: number): Promise<boolean> {
    return this.deliveryAddresses.delete(id);
  }
  
  // Order Methods
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }
  
  async getUserOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { ...insertOrder, id };
    this.orders.set(id, order);
    return order;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  // Online Users Methods
  async getOnlineUsers(): Promise<OnlineUser[]> {
    return Array.from(this.onlineUsers.values());
  }
  
  async addOnlineUser(user: OnlineUser): Promise<void> {
    this.onlineUsers.set(user.userId, user);
  }
  
  async removeOnlineUser(userId: number): Promise<void> {
    this.onlineUsers.delete(userId);
  }
  
  async updateUserActivity(userId: number): Promise<void> {
    const user = this.onlineUsers.get(userId);
    if (user) {
      user.lastActive = new Date();
      this.onlineUsers.set(userId, user);
    }
  }
  
  // Helper method to check if a user is admin
  async isAdmin(userId: number): Promise<boolean> {
    const user = await this.getUser(userId);
    if (!user) return false;
    
    // Check if user is admin or has specific username
    return user.isAdmin || user.username === this.adminUsername;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async updateUserAdminStatus(userId: number, isAdmin: boolean): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    // Prevent removing admin status from user @illia2323
    if (user.username === this.adminUsername && !isAdmin) {
      return user; // Don't change admin status for main admin
    }
    
    const updatedUser = { ...user, isAdmin };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
}

export const storage = new MemStorage();
