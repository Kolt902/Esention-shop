import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  telegramId: text("telegram_id"),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  telegramId: true,
  isAdmin: true,
});

// Product Schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(), // price in cents
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  additionalImages: text("additional_images").array().default([]).notNull(), // Array of additional image URLs
  sizes: text("sizes").array().notNull(),
  description: text("description").default("").notNull(),
  brand: text("brand").default("").notNull(),
  isNew: boolean("is_new").default(false).notNull(),
  discount: integer("discount").default(0).notNull(),
  rating: integer("rating").default(0).notNull(),
  inStock: boolean("in_stock").default(true).notNull(),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  price: true,
  category: true,
  imageUrl: true,
  additionalImages: true,
  sizes: true,
  description: true,
  brand: true,
  isNew: true,
  discount: true,
  rating: true,
  inStock: true,
});

// Cart Item Schema - could be used for storing cart items
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  size: text("size"),
});

export const insertCartItemSchema = createInsertSchema(cartItems).pick({
  userId: true,
  productId: true,
  quantity: true,
  size: true,
});

// Delivery Address Schema
export const deliveryAddresses = pgTable("delivery_addresses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  country: text("country").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  postalCode: text("postal_code").notNull(),
  isDefault: boolean("is_default").default(false),
});

export const insertDeliveryAddressSchema = createInsertSchema(deliveryAddresses).pick({
  userId: true,
  fullName: true,
  phoneNumber: true,
  country: true,
  city: true,
  address: true,
  postalCode: true,
  isDefault: true,
});

// Order Schema - enhanced with delivery information
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  status: text("status").notNull().default("pending"),
  totalPrice: integer("total_price").notNull(),
  items: jsonb("items").notNull(),
  createdAt: text("created_at").notNull(),
  // Delivery information
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  country: text("country").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  postalCode: text("postal_code").notNull(),
  deliveryNotes: text("delivery_notes"),
  paymentMethod: text("payment_method").notNull(),
  // Referral information
  referralCode: text("referral_code"),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  status: true,
  totalPrice: true,
  items: true,
  createdAt: true,
  fullName: true,
  phoneNumber: true,
  country: true,
  city: true,
  address: true,
  postalCode: true,
  deliveryNotes: true,
  paymentMethod: true,
  referralCode: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Online Users Schema
export const onlineUsers = pgTable("online_users", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  telegramId: text("telegram_id").notNull(),
  username: text("username").notNull(),
  lastActive: text("last_active").notNull(),
});

export const insertOnlineUserSchema = createInsertSchema(onlineUsers).pick({
  userId: true,
  telegramId: true,
  username: true,
  lastActive: true,
});

export type InsertOnlineUser = z.infer<typeof insertOnlineUserSchema>;
export type OnlineUser = typeof onlineUsers.$inferSelect;

// Avatar Parameters Schema
export const avatarParams = pgTable("avatar_params", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  height: integer("height").default(175).notNull(),
  weight: integer("weight").default(70).notNull(),
  bodyType: text("body_type").default("regular").notNull(), // slim, regular, athletic
  gender: text("gender").default("male").notNull(), // male, female
  measurements: jsonb("measurements").default({}).notNull(), // chest, waist, hips, etc.
});

export const insertAvatarParamsSchema = createInsertSchema(avatarParams).pick({
  userId: true,
  height: true,
  weight: true,
  bodyType: true,
  gender: true,
  measurements: true,
});

export type InsertAvatarParams = z.infer<typeof insertAvatarParamsSchema>;
export type AvatarParams = typeof avatarParams.$inferSelect;

// Virtual Clothing Schema (for AR/VR try-on)
export const virtualClothingItems = pgTable("virtual_clothing_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // top, bottom, shoes, accessory
  category: text("category").notNull(), // same as products.category
  productId: integer("product_id").notNull(), // reference to the physical product
  modelPath: text("model_path").notNull(), // path to 3D model file
  thumbnailUrl: text("thumbnail_url").notNull(),
  colors: text("colors").array().default([]).notNull(),
  sizes: text("sizes").array().default([]).notNull(),
});

export const insertVirtualClothingItemSchema = createInsertSchema(virtualClothingItems).pick({
  name: true,
  type: true,
  category: true,
  productId: true,
  modelPath: true,
  thumbnailUrl: true,
  colors: true,
  sizes: true,
});

export type InsertVirtualClothingItem = z.infer<typeof insertVirtualClothingItemSchema>;
export type VirtualClothingItem = typeof virtualClothingItems.$inferSelect;

// User's Virtual Wardrobe (saved clothing items for the avatar)
export const userVirtualWardrobe = pgTable("user_virtual_wardrobe", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  clothingItemId: integer("clothing_item_id").notNull(),
  selectedColor: text("selected_color").notNull(),
  selectedSize: text("selected_size").notNull(),
  isFavorite: boolean("is_favorite").default(false).notNull(),
  dateAdded: text("date_added").notNull(),
});

export const insertUserVirtualWardrobeSchema = createInsertSchema(userVirtualWardrobe).pick({
  userId: true,
  clothingItemId: true,
  selectedColor: true,
  selectedSize: true,
  isFavorite: true,
  dateAdded: true,
});

export type InsertUserVirtualWardrobe = z.infer<typeof insertUserVirtualWardrobeSchema>;
export type UserVirtualWardrobe = typeof userVirtualWardrobe.$inferSelect;
