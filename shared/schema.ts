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
