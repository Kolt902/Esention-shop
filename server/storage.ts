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
  insertDeliveryAddressSchema,
  avatarParams,
  type InsertAvatarParams,
  virtualClothingItems,
  type InsertVirtualClothingItem,
  userVirtualWardrobe,
  type InsertUserVirtualWardrobe
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

// Types for virtual fitting feature
export type AvatarParams = typeof avatarParams.$inferSelect;
export type VirtualClothingItem = typeof virtualClothingItems.$inferSelect;
export type UserVirtualWardrobe = typeof userVirtualWardrobe.$inferSelect;

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
  
  // Avatar Operations
  getAvatarParams(userId: number): Promise<AvatarParams | undefined>;
  createAvatarParams(params: InsertAvatarParams): Promise<AvatarParams>;
  updateAvatarParams(userId: number, params: Partial<InsertAvatarParams>): Promise<AvatarParams | undefined>;
  
  // Virtual Clothing Operations
  getVirtualClothingItems(filters?: { category?: string, type?: string }): Promise<VirtualClothingItem[]>;
  getVirtualClothingItem(id: number): Promise<VirtualClothingItem | undefined>;
  createVirtualClothingItem(item: InsertVirtualClothingItem): Promise<VirtualClothingItem>;
  
  // User Virtual Wardrobe Operations
  getUserVirtualWardrobe(userId: number): Promise<UserVirtualWardrobe[]>;
  getVirtualWardrobeItem(id: number): Promise<UserVirtualWardrobe | undefined>;
  addToVirtualWardrobe(item: InsertUserVirtualWardrobe): Promise<UserVirtualWardrobe>;
  updateVirtualWardrobeItem(id: number, updates: Partial<InsertUserVirtualWardrobe>): Promise<UserVirtualWardrobe | undefined>;
  removeFromVirtualWardrobe(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private deliveryAddresses: Map<number, DeliveryAddress>;
  private orders: Map<number, Order>;
  private onlineUsers: Map<number, OnlineUser>;
  private avatarParams: Map<number, AvatarParams>;
  private virtualClothingItems: Map<number, VirtualClothingItem>;
  private userVirtualWardrobe: Map<number, UserVirtualWardrobe>;
  private currentUserId: number;
  private currentProductId: number;
  private currentCartItemId: number;
  private currentDeliveryAddressId: number;
  private currentOrderId: number;
  private currentAvatarParamsId: number;
  private currentVirtualClothingId: number;
  private currentWardrobeItemId: number;
  
  // Add admin user for @illia2323
  private adminUsernames = ["illia2323", "zakharr99"];
  
  private initializeVirtualClothing() {
    // Футболки
    this.createVirtualClothingItem({
      name: "Nike Sportswear T-Shirt",
      category: "tops",
      type: "t-shirt",
      productId: 1,
      modelPath: "/models/clothing/nike-tshirt.glb",
      thumbnailUrl: "/images/clothing/nike-tshirt-thumb.jpg",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["black", "white", "red", "blue"]
    });
    
    this.createVirtualClothingItem({
      name: "Adidas Originals Tee",
      category: "tops",
      type: "t-shirt",
      productId: 2,
      modelPath: "/models/clothing/adidas-tshirt.glb",
      thumbnailUrl: "/images/clothing/adidas-tshirt-thumb.jpg",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["white", "black", "green"]
    });
    
    // Брюки
    this.createVirtualClothingItem({
      name: "Nike Tech Fleece Pants",
      category: "bottoms",
      type: "pants",
      productId: 3,
      modelPath: "/models/clothing/nike-pants.glb",
      thumbnailUrl: "/images/clothing/nike-pants-thumb.jpg",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["black", "grey", "navy"]
    });
    
    // Обувь
    this.createVirtualClothingItem({
      name: "Nike Air Force 1",
      category: "footwear",
      type: "sneakers",
      productId: 1,
      modelPath: "/models/footwear/nike-af1.glb",
      thumbnailUrl: "/images/footwear/nike-af1-thumb.jpg",
      sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
      colors: ["white", "black", "custom"]
    });
    
    this.createVirtualClothingItem({
      name: "Adidas Originals Superstar",
      category: "footwear",
      type: "sneakers",
      productId: 4,
      modelPath: "/models/footwear/adidas-superstar.glb",
      thumbnailUrl: "/images/footwear/adidas-superstar-thumb.jpg",
      sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
      colors: ["white", "black", "gold"]
    });
    
    // Верхняя одежда
    this.createVirtualClothingItem({
      name: "Nike Windrunner Jacket",
      category: "outerwear",
      type: "jacket",
      productId: 5,
      modelPath: "/models/clothing/nike-jacket.glb",
      thumbnailUrl: "/images/clothing/nike-jacket-thumb.jpg",
      sizes: ["S", "M", "L", "XL"],
      colors: ["black", "blue", "red"]
    });
  }

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.deliveryAddresses = new Map();
    this.orders = new Map();
    this.onlineUsers = new Map();
    this.avatarParams = new Map();
    this.virtualClothingItems = new Map();
    this.userVirtualWardrobe = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentCartItemId = 1;
    this.currentDeliveryAddressId = 1;
    this.currentOrderId = 1;
    this.currentAvatarParamsId = 1;
    this.currentVirtualClothingId = 1;
    this.currentWardrobeItemId = 1;
    
    // Create main admin user (illia2323)
    this.users.set(this.currentUserId++, {
      id: 1,
      username: this.adminUsernames[0],
      password: "admin123", // This is just a placeholder, in a real app use secure passwords
      telegramId: "818421912",
      isAdmin: true
    });
    
    // Create second admin user (zakharr99)
    this.users.set(this.currentUserId++, {
      id: 2, 
      username: this.adminUsernames[1],
      password: "admin123", // This is just a placeholder, in a real app use secure passwords
      telegramId: "7633144414",
      isAdmin: true
    });
    
    // Initialize with Nike shoe products - all €80
    const price = 8000; // 80 euros in cents
    
    this.createProduct({
      name: "Nike Air Force 1",
      price,
      category: "lifestyle",
      imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-mens-shoes-jBrhbr.png",
      additionalImages: [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/33533fe2-1157-4001-896e-1803b30659c8/air-force-1-07-mens-shoes-jBrhbr.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/a0a300da-2e16-4483-ba64-9a22fcc77580/air-force-1-07-mens-shoes-jBrhbr.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/120a31b0-efa7-41c7-9a84-87b1e56ab9c3/air-force-1-07-mens-shoes-jBrhbr.png"
      ],
      sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
      description: "The radiance lives on in the Nike Air Force 1, the basketball icon that puts a fresh spin on what you know best: crisp leather, bold colors and the perfect amount of flash.",
      brand: "Nike"
    });
    
    this.createProduct({
      name: "Nike Air Max 90",
      price,
      category: "lifestyle",
      imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/a895df73-5f78-4a1d-9d69-663f2491a5d5/air-max-90-mens-shoes-6n3vKB.png",
      additionalImages: [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/30e7815e-da97-472b-b90b-37fcb3bbecf5/air-max-90-mens-shoes-6n3vKB.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/84c3adca-93a4-4960-8c82-8b3637a6c458/air-max-90-mens-shoes-6n3vKB.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/5c0bb96f-b591-4d1d-a137-50b8723ef069/air-max-90-mens-shoes-6n3vKB.png"
      ],
      sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
      description: "Lace up and feel the legacy with the Nike Air Max 90. Featuring the same iconic Waffle sole, stitched overlays and classic TPU details as the original, it lets you walk among the pantheon of Air Max greats.",
      brand: "Nike"
    });
    
    this.createProduct({
      name: "Nike Air Jordan 1",
      price,
      category: "basketball",
      imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/5653944b-9b93-4e57-ad13-cc816a776a9e/air-jordan-1-mid-shoes-86f1ZW.png",
      additionalImages: [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/01c445a4-71e3-448c-9c95-6e09d2b0ada5/air-jordan-1-mid-shoes-86f1ZW.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/32df5710-75c7-48ef-9bc2-964be2f7c0d0/air-jordan-1-mid-shoes-86f1ZW.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b1bd1e36-73a9-4699-800a-c6fbaa75be93/air-jordan-1-mid-shoes-86f1ZW.png"
      ],
      sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
      description: "The Air Jordan 1 Mid brings full-court style and premium comfort to an iconic look. Its Air-Sole unit cushions play on the hardwood, while the padded collar gives you a supportive feel.",
      brand: "Jordan"
    });
    
    this.createProduct({
      name: "Nike Dunk Low",
      price,
      category: "lifestyle",
      imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/c96f77e1-9c8d-4f2e-9c9f-8a3a886aa3c1/dunk-low-shoes-t4Lk3P.png",
      additionalImages: [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/f095a5a5-7e8b-408a-b83b-cae692f04c91/dunk-low-shoes-t4Lk3P.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/2adde5e2-e715-4735-a8e7-f7acf93f395c/dunk-low-shoes-t4Lk3P.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/8c9c2c82-71ee-449c-934a-8760c31cff5d/dunk-low-shoes-t4Lk3P.png"
      ],
      sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
      description: "Created for the hardwood but taken to the streets, this '80s basketball icon returns with perfectly shined overlays and classic team colors. With its iconic hoops design, the Nike Dunk Low channels vintage style back onto the streets.",
      brand: "Nike"
    });
    
    this.createProduct({
      name: "Nike Air Zoom Pegasus",
      price,
      category: "running",
      imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/c3e2c568-a726-4ded-8a1e-25098e7a994e/pegasus-40-mens-road-running-shoes-bRqpc7.png",
      additionalImages: [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/e0c08734-caa0-4021-97ec-90b9209e5c0f/pegasus-40-mens-road-running-shoes-bRqpc7.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/36766fc5-e60b-466d-8ee3-24e61306198c/pegasus-40-mens-road-running-shoes-bRqpc7.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/84d7333c-a88d-4c5c-8c9a-52ed2f5e53b2/pegasus-40-mens-road-running-shoes-bRqpc7.png"
      ],
      sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
      description: "Let the Nike Pegasus 40 help you ascend to new heights. This trusted trainer has the same reliable fit and feel that's helped runners for decades.",
      brand: "Nike"
    });
    
    this.createProduct({
      name: "Nike React Infinity",
      price,
      category: "running",
      imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/670f2ae5-8933-4d93-9354-d03bf6ce2a55/react-infinity-3-mens-road-running-shoes-1bRm03.png",
      additionalImages: [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/7441f11a-6832-4de9-a477-f5135d329047/react-infinity-3-mens-road-running-shoes-1bRm03.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/3d85a910-e267-4c8f-9f17-9c62166e95f8/react-infinity-3-mens-road-running-shoes-1bRm03.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/c84c0664-2279-4ffa-8897-3e7d17a5ffe2/react-infinity-3-mens-road-running-shoes-1bRm03.png"
      ],
      sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
      description: "The Nike React Infinity delivers a smooth ride during your run. These shoes are cushioned for comfort, while the design provides enhanced stability from heel to toe.",
      brand: "Nike"
    });
    
    this.createProduct({
      name: "Nike Blazer Mid",
      price,
      category: "lifestyle",
      imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/d4b8cd01-09cb-4191-8703-a8a1ec2a82d0/blazer-mid-77-vintage-mens-shoes-nw30B2.png",
      additionalImages: [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/1cbf6e93-9686-47a0-aaaf-cc3f4188afa7/blazer-mid-77-vintage-mens-shoes-nw30B2.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/22995310-67d9-4a74-8ee1-2c5aaee50898/blazer-mid-77-vintage-mens-shoes-nw30B2.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/d55b60be-3a69-483e-ad1b-c20a2a59e39b/blazer-mid-77-vintage-mens-shoes-nw30B2.png"
      ],
      sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
      description: "In the '70s, Nike was the new shoe on the block. So new in fact, we were still testing prototypes on elite runners. Of course, the design improved over the years, but the name stuck.",
      brand: "Nike"
    });
    
    this.createProduct({
      name: "Nike LeBron",
      price,
      category: "basketball",
      imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/62831c9e-0b69-436a-bf03-76cf4a71435e/lebron-witness-7-basketball-shoes-XPRc4M.png",
      additionalImages: [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9c5172dc-4c14-458b-b3a3-9b5c2901a877/lebron-witness-7-basketball-shoes-XPRc4M.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/36c0e411-4b96-4715-a9d7-4195657e8c57/lebron-witness-7-basketball-shoes-XPRc4M.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/4c2ed572-e4a0-4b78-816a-97ce33f61e88/lebron-witness-7-basketball-shoes-XPRc4M.png"
      ],
      sizes: ["40", "41", "42", "43", "44", "45", "46", "47"],
      description: "LeBron thrives when the pressure's high and his back's against the wall. The LeBron Witness series is designed to support your game when you pull out clutch plays inspired by the King.",
      brand: "Nike"
    });
    
    this.createProduct({
      name: "Nike Kyrie",
      price,
      category: "basketball",
      imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/1eb91968-f03c-4dce-bfa7-b6b1fe561879/precision-6-basketball-shoes-V704hS.png",
      additionalImages: [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/aa231073-c7ce-4134-bbf2-5ecc19a6c90c/precision-6-basketball-shoes-V704hS.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/47b2f201-5591-4f3e-96de-9324e9e2c6db/precision-6-basketball-shoes-V704hS.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/f0a39818-ff91-4c76-88a8-920fdfa563d1/precision-6-basketball-shoes-V704hS.png"
      ],
      sizes: ["40", "41", "42", "43", "44", "45", "46"],
      description: "The Nike Precision is made for players who beat opponents with skill and strategy more than power, as if they're playing chess while everyone else is playing checkers.",
      brand: "Nike"
    });
    
    this.createProduct({
      name: "Nike Air Max 270",
      price,
      category: "lifestyle",
      imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/vqpbkqglfrtpgxushseg/air-max-270-mens-shoes-KkLcGR.png",
      additionalImages: [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-6b4d1ee2-95a4-4e98-a476-1069a8967627/air-max-270-mens-shoes-KkLcGR.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-71bc507a-95e1-4e78-8ea1-ce21bbf469d2/air-max-270-mens-shoes-KkLcGR.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-30dd4772-04ae-4a14-9d73-c49599fc8a7c/air-max-270-mens-shoes-KkLcGR.png"
      ],
      sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
      description: "Nike's first lifestyle Air Max brings you style, comfort and big attitude in the Nike Air Max 270. The design draws inspiration from Air Max icons, showcasing Nike's greatest innovation with its large window and fresh array of colors.",
      brand: "Nike"
    });
    
    // Добавим футболки
    this.createProduct({
      name: "Nike Sportswear Club",
      price: 2500,
      category: "tshirts",
      imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/5d8b1a7a-bc3e-483e-a89c-2b021c278724/sportswear-club-mens-t-shirt-ShrJfX.png",
      additionalImages: [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b4bb9a9e-aeca-48ee-9e31-100fc16bc1d1/sportswear-club-mens-t-shirt-ShrJfX.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/2aebe14d-6ae2-4071-87c3-716e3a0736c9/sportswear-club-mens-t-shirt-ShrJfX.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/a28123a5-fb79-46a0-b1ed-e53f97e6764e/sportswear-club-mens-t-shirt-ShrJfX.png"
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      description: "The Nike Sportswear Club T-Shirt is made with our everyday cotton fabric and a classic fit for a familiar feel right out of the bag. An embroidered Futura logo on the chest provides a signature Nike look.",
      brand: "Nike"
    });
    
    this.createProduct({
      name: "Nike Dri-FIT Legend",
      price: 3000,
      category: "tshirts",
      imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/49c07831-df25-4122-bd15-de9794095bd0/dri-fit-legend-mens-training-t-shirt-VJGcGZ.png",
      additionalImages: [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/dbafd5e0-46c7-409f-be1e-2248ed2d5d25/dri-fit-legend-mens-training-t-shirt-VJGcGZ.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/aaf6860a-1c76-4a01-97e4-23d85cc644cc/dri-fit-legend-mens-training-t-shirt-VJGcGZ.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/2b095cb3-4a23-439e-822e-2d91ad4f833d/dri-fit-legend-mens-training-t-shirt-VJGcGZ.png"
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      description: "The Nike Dri-FIT Legend T-Shirt delivers a soft feel, sweat-wicking performance and great range of motion to get you through your workout in total comfort.",
      brand: "Nike"
    });
    
    // Добавим кофты (толстовки)
    this.createProduct({
      name: "Nike Sportswear Club Fleece",
      price: 5500,
      category: "hoodies",
      imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/4c9eafe3-18c6-41bb-9cef-104a523f4d66/sportswear-club-fleece-pullover-hoodie-5ZcD7G.png",
      additionalImages: [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/3df5b14d-7eee-449f-9b56-0fc23cc65e82/sportswear-club-fleece-pullover-hoodie-5ZcD7G.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/c00d3354-6eee-44cf-a69d-02a46f6d82e0/sportswear-club-fleece-pullover-hoodie-5ZcD7G.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/1ee17b06-fa5d-46e3-9e1c-46f9a4d9dae3/sportswear-club-fleece-pullover-hoodie-5ZcD7G.png"
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      description: "The Nike Sportswear Club Fleece Pullover Hoodie combines soft fleece fabric with a classic silhouette and minimalist design details to create an essential for your daily wardrobe.",
      brand: "Nike"
    });
    
    this.createProduct({
      name: "Nike Sportswear Tech Fleece",
      price: 7500,
      category: "hoodies",
      imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9a8ee4fe-3047-4fee-9b6d-7940c39c5304/sportswear-tech-fleece-mens-full-zip-hoodie-5ZtTtk.png",
      additionalImages: [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/2f5ec8c4-9764-4d5b-afb6-53a3c5b2a594/sportswear-tech-fleece-mens-full-zip-hoodie-5ZtTtk.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/d12222fe-7c03-40aa-91c7-7b33ac6bf59b/sportswear-tech-fleece-mens-full-zip-hoodie-5ZtTtk.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b3fd8d02-e3d4-40c1-94e3-fce9c44c6eeb/sportswear-tech-fleece-mens-full-zip-hoodie-5ZtTtk.png"
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      description: "Low-profile, lightweight and warm, Nike Tech Fleece offers innovative comfort that easily transitions between seasons. This zip hoodie hits at the hip and features a lightweight 3-piece scuba hood.",
      brand: "Nike"
    });
    
    // Добавим штаны
    this.createProduct({
      name: "Nike Sportswear Club Fleece",
      price: 5000,
      category: "pants",
      imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/2f6ca908-f593-461b-b1b2-40ee9be57ff6/sportswear-club-fleece-joggers-KflRdQ.png",
      additionalImages: [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/45d3a1e6-95e1-461f-aad5-c8a8aee839b7/sportswear-club-fleece-joggers-KflRdQ.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/7a717fda-9db1-4986-933e-400e2ead3e53/sportswear-club-fleece-joggers-KflRdQ.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/57ebc946-353b-4a02-a945-95f8852042fc/sportswear-club-fleece-joggers-KflRdQ.png"
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      description: "The Nike Sportswear Club Fleece Joggers combine the comfort of soft fleece fabric with a tailored look that you can wear every day.",
      brand: "Nike"
    });
    
    this.createProduct({
      name: "Nike Dri-FIT",
      price: 4500,
      category: "pants",
      imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/u1hgnjassyx93bsiogzq/dri-fit-mens-training-pants-VTcVkx.png",
      additionalImages: [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/z3ld9d6i0qxxgbkwjcjb/dri-fit-mens-training-pants-VTcVkx.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/uyg2dcqmwwrxnzhjv1cp/dri-fit-mens-training-pants-VTcVkx.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/ue1kc1crjlwqshbjnuio/dri-fit-mens-training-pants-VTcVkx.png"
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      description: "The Nike Dri-FIT Training Pants combine sweat-wicking technology with breathable construction to keep you cool and comfortable for the duration of your workout.",
      brand: "Nike"
    });
    
    // Добавим куртки
    this.createProduct({
      name: "Nike Sportswear Windrunner",
      price: 8000,
      category: "jackets",
      imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/8b8fbbd5-3e9a-4203-835a-40872626bb38/sportswear-windrunner-mens-hooded-jacket-5qQ49n.png",
      additionalImages: [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/e3d85658-ef39-4a45-a022-a8a25643da34/sportswear-windrunner-mens-hooded-jacket-5qQ49n.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b47acdd5-7846-4978-befe-adc3d8f50a3f/sportswear-windrunner-mens-hooded-jacket-5qQ49n.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/84f04d49-5ed4-4a05-ac3f-2a28cbf9c0bd/sportswear-windrunner-mens-hooded-jacket-5qQ49n.png"
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      description: "The Nike Sportswear Windrunner Jacket updates our first running windbreaker with lightweight fabric, bright retroinspired colors and a adjustable hood for custom coverage.",
      brand: "Nike"
    });
    
    // Добавим аксессуары
    this.createProduct({
      name: "Nike Heritage",
      price: 2000,
      category: "accessories",
      imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/80a3db1f-7e3f-4915-94ba-d7c9cc8fd0a0/heritage-crossbody-bag-xKv3Gk.png",
      additionalImages: [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/c76e2119-acb7-4944-9085-d4f5ae2bda76/heritage-crossbody-bag-xKv3Gk.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/32b68861-15b6-48a4-a5f6-55a5e36b3a1c/heritage-crossbody-bag-xKv3Gk.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/ef768c0d-e9e4-4430-bc96-78ee714b767e/heritage-crossbody-bag-xKv3Gk.png"
      ],
      sizes: ["One Size"],
      description: "The Nike Heritage Crossbody Bag has a main compartment with a small zippered pocket. The shoulder strap is removable and adjustable so you can carry it close to your body or in your hand.",
      brand: "Nike"
    });
    
    // Добавим Adidas кроссовки
    this.createProduct({
      name: "Adidas Ultraboost",
      price: 8500,
      category: "running",
      imageUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/ce8a6f3aa6294de988d7aee901127106_9366/Ultraboost_Light_Shoes_Black_HQ6351_01_standard.jpg",
      additionalImages: [
        "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/270e30d32e0a4a0d8554aee901127d09_9366/Ultraboost_Light_Shoes_Black_HQ6351_02_standard_hover.jpg",
        "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/33f1775a6a85406f9c16aee90112863b_9366/Ultraboost_Light_Shoes_Black_HQ6351_03_standard.jpg",
        "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/1a85c897a3204cb5a6f4aee901129108_9366/Ultraboost_Light_Shoes_Black_HQ6351_04_standard.jpg"
      ],
      sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
      description: "Ultraboost Light is exactly what it sounds like: the lightest Ultraboost ever. The magic lies in the Light BOOST midsole, a new generation of adidas BOOST. Its unique molecule design achieves the lightest BOOST foam to date.",
      brand: "Adidas"
    });
    
    this.createProduct({
      name: "Adidas Stan Smith",
      price: 6500,
      category: "lifestyle",
      imageUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/68ae7ea7849b43eca70aac1e00f5146d_9366/Stan_Smith_Shoes_White_FX5502_01_standard.jpg",
      additionalImages: [
        "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/d02dad63187a4606b1cdac1e00f51e08_9366/Stan_Smith_Shoes_White_FX5502_02_standard_hover.jpg",
        "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/c0b98a79bcc34a38a325ac1e00f527c8_9366/Stan_Smith_Shoes_White_FX5502_03_standard.jpg",
        "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/b47d77eba6f945ea8dabac1e00f53298_9366/Stan_Smith_Shoes_White_FX5502_04_standard.jpg"
      ],
      sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
      description: "Clean, classic and versatile, the Stan Smith is a sneaker that's kept a low profile with a sleek upper shape for over 50 years. This pair stays true to the 1972 trailblazer, with a smooth leather upper, minimalist styling and a casual rubber cupsole.",
      brand: "Adidas"
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
    // Обрабатываем обязательные поля и устанавливаем значения по умолчанию
    const user: User = { 
      id,
      username: insertUser.username,
      password: insertUser.password,
      telegramId: insertUser.telegramId || null,
      isAdmin: insertUser.isAdmin !== undefined ? insertUser.isAdmin : false
    };
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
    // Явно обрабатываем обязательные поля согласно схеме в shared/schema.ts
    const product: Product = { 
      id,
      name: insertProduct.name,
      price: insertProduct.price,
      category: insertProduct.category,
      imageUrl: insertProduct.imageUrl,
      // Обязательно устанавливаем значения по умолчанию для полей с дефолтными значениями
      brand: insertProduct.brand || "",
      additionalImages: Array.isArray(insertProduct.additionalImages) ? insertProduct.additionalImages : [],
      sizes: insertProduct.sizes,
      description: insertProduct.description || ""
    };
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
    // Обрабатываем обязательные поля и устанавливаем значения по умолчанию
    const cartItem: CartItem = { 
      id,
      userId: insertCartItem.userId,
      productId: insertCartItem.productId,
      size: insertCartItem.size || null,
      quantity: insertCartItem.quantity || 1
    };
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
    
    // Обрабатываем обязательные поля и устанавливаем значения по умолчанию
    const address: DeliveryAddress = { 
      id,
      userId: insertAddress.userId,
      fullName: insertAddress.fullName,
      phoneNumber: insertAddress.phoneNumber,
      country: insertAddress.country,
      city: insertAddress.city,
      address: insertAddress.address,
      postalCode: insertAddress.postalCode,
      isDefault: insertAddress.isDefault !== undefined ? insertAddress.isDefault : null
    };
    
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
    // Обрабатываем обязательные поля и устанавливаем значения по умолчанию
    const order: Order = { 
      id,
      userId: insertOrder.userId,
      status: insertOrder.status || "pending",
      totalPrice: insertOrder.totalPrice,
      items: insertOrder.items,
      createdAt: insertOrder.createdAt,
      fullName: insertOrder.fullName,
      phoneNumber: insertOrder.phoneNumber,
      country: insertOrder.country,
      city: insertOrder.city,
      address: insertOrder.address,
      postalCode: insertOrder.postalCode,
      deliveryNotes: insertOrder.deliveryNotes || null,
      paymentMethod: insertOrder.paymentMethod,
      referralCode: insertOrder.referralCode || null
    };
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
    return user.isAdmin || this.adminUsernames.includes(user.username);
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async updateUserAdminStatus(userId: number, isAdmin: boolean): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    // Prevent removing admin status from default admin users
    if (this.adminUsernames.includes(user.username) && !isAdmin) {
      return user; // Don't change admin status for main admins
    }
    
    const updatedUser = { ...user, isAdmin };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  // Avatar Operations
  async getAvatarParams(userId: number): Promise<AvatarParams | undefined> {
    // Find by userId, not by the avatarParam's id
    const avatarParamsArray = Array.from(this.avatarParams.entries());
    for (const [id, params] of avatarParamsArray) {
      if (params.userId === userId) {
        return params;
      }
    }
    return undefined;
  }
  
  async createAvatarParams(params: InsertAvatarParams): Promise<AvatarParams> {
    const id = this.currentAvatarParamsId++;
    const avatarParams: AvatarParams = {
      id,
      userId: params.userId,
      height: params.height ?? 170, // default height in cm
      weight: params.weight ?? 70, // default weight in kg
      bodyType: params.bodyType ?? 'regular', // default body type
      gender: params.gender ?? 'male', // default gender
      measurements: params.measurements ?? {}
    };
    this.avatarParams.set(id, avatarParams);
    return avatarParams;
  }
  
  async updateAvatarParams(userId: number, params: Partial<InsertAvatarParams>): Promise<AvatarParams | undefined> {
    // Find by userId
    let foundParams: AvatarParams | undefined;
    let foundId: number | undefined;
    
    const avatarParamsArray = Array.from(this.avatarParams.entries());
    for (const [id, existingParams] of avatarParamsArray) {
      if (existingParams.userId === userId) {
        foundParams = existingParams;
        foundId = id;
        break;
      }
    }
    
    if (!foundParams || foundId === undefined) return undefined;
    
    const updatedParams: AvatarParams = {
      ...foundParams,
      ...params
    };
    
    this.avatarParams.set(foundId, updatedParams);
    return updatedParams;
  }
  
  // Virtual Clothing Operations
  async getVirtualClothingItems(filters?: { category?: string, type?: string }): Promise<VirtualClothingItem[]> {
    const items: VirtualClothingItem[] = Array.from(this.virtualClothingItems.values());
    
    if (!filters) return items;
    
    return items.filter(item => {
      if (filters.category && item.category !== filters.category) return false;
      if (filters.type && item.type !== filters.type) return false;
      return true;
    });
  }
  
  async getVirtualClothingItem(id: number): Promise<VirtualClothingItem | undefined> {
    return this.virtualClothingItems.get(id);
  }
  
  async createVirtualClothingItem(item: InsertVirtualClothingItem): Promise<VirtualClothingItem> {
    const id = this.currentVirtualClothingId++;
    const clothingItem: VirtualClothingItem = {
      id,
      name: item.name,
      category: item.category,
      type: item.type,
      productId: item.productId,
      modelPath: item.modelPath,
      thumbnailUrl: item.thumbnailUrl,
      sizes: item.sizes ?? [],
      colors: item.colors ?? []
    };
    this.virtualClothingItems.set(id, clothingItem);
    return clothingItem;
  }
  
  // User Virtual Wardrobe Operations
  async getUserVirtualWardrobe(userId: number): Promise<UserVirtualWardrobe[]> {
    const items: UserVirtualWardrobe[] = [];
    const wardrobeItems = Array.from(this.userVirtualWardrobe.values());
    
    for (const item of wardrobeItems) {
      if (item.userId === userId) {
        items.push(item);
      }
    }
    
    return items;
  }
  
  async getVirtualWardrobeItem(id: number): Promise<UserVirtualWardrobe | undefined> {
    return this.userVirtualWardrobe.get(id);
  }
  
  async addToVirtualWardrobe(item: InsertUserVirtualWardrobe): Promise<UserVirtualWardrobe> {
    const id = this.currentWardrobeItemId++;
    const wardrobeItem: UserVirtualWardrobe = {
      id,
      userId: item.userId,
      clothingItemId: item.clothingItemId,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
      dateAdded: item.dateAdded,
      isFavorite: item.isFavorite ?? false
    };
    this.userVirtualWardrobe.set(id, wardrobeItem);
    return wardrobeItem;
  }
  
  async updateVirtualWardrobeItem(id: number, updates: Partial<InsertUserVirtualWardrobe>): Promise<UserVirtualWardrobe | undefined> {
    const item = this.userVirtualWardrobe.get(id);
    if (!item) return undefined;
    
    const updatedItem: UserVirtualWardrobe = {
      ...item,
      ...updates
    };
    
    this.userVirtualWardrobe.set(id, updatedItem);
    return updatedItem;
  }
  
  async removeFromVirtualWardrobe(id: number): Promise<boolean> {
    return this.userVirtualWardrobe.delete(id);
  }
}

// Импортируем DatabaseStorage и создаем инстанс
import { DatabaseStorage } from "./dbStorage";

// Раскомментируйте следующую строку для использования базы данных PostgreSQL:
// export const storage = new DatabaseStorage();

// Закомментируйте следующую строку при переходе на PostgreSQL:
export const storage = new MemStorage();
