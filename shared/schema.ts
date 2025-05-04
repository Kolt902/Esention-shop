import { z } from "zod";

// User Schema
export const userSchema = z.object({
  _id: z.string().optional(),
  username: z.string(),
  password: z.string(),
  telegramId: z.string().optional(),
  isAdmin: z.boolean().default(false),
  email: z.string().optional(),
  fullName: z.string().optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().optional(),
  lastLogin: z.string().optional(),
  registrationDate: z.string().optional(),
  referralCode: z.string().optional(),
  referredBy: z.string().optional(),
  referralCount: z.number().default(0),
  referralDiscount: z.number().default(0),
  notificationSettings: z.object({
    orderUpdates: z.boolean().default(true),
    promotions: z.boolean().default(true),
    newArrivals: z.boolean().default(true),
    priceDrops: z.boolean().default(false)
  }).default({}),
  preferences: z.object({
    language: z.string().default("en"),
    theme: z.string().default("auto"),
    currency: z.string().default("EUR")
  }).default({}),
  createdAt: z.string().optional()
});

export type User = z.infer<typeof userSchema>;

// Product Schema
export const productSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  price: z.number(),
  category: z.string(),
  imageUrl: z.string(),
  additionalImages: z.array(z.string()).default([]),
  sizes: z.array(z.string()),
  description: z.string().default(""),
  brand: z.string().default(""),
  style: z.string().optional(),
  gender: z.string().default("unisex"),
  isNew: z.boolean().default(false),
  discount: z.number().default(0),
  rating: z.number().default(0),
  inStock: z.boolean().default(true),
  originalUrl: z.string().optional(),
  colors: z.array(z.string()).default([]),
  categorySlug: z.string().optional(),
  brandSlug: z.string().optional(),
  styleSlug: z.string().optional()
});

export type Product = z.infer<typeof productSchema>;

// Cart Item Schema
export const cartItemSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  productId: z.string(),
  quantity: z.number().default(1),
  size: z.string().optional()
});

export type CartItem = z.infer<typeof cartItemSchema>;

// Delivery Address Schema
export const deliveryAddressSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  fullName: z.string(),
  phoneNumber: z.string(),
  country: z.string(),
  city: z.string(),
  address: z.string(),
  postalCode: z.string(),
  isDefault: z.boolean().default(false)
});

export type DeliveryAddress = z.infer<typeof deliveryAddressSchema>;

// Order Schema
export const orderSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  status: z.string().default("pending"),
  totalPrice: z.number(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number(),
    size: z.string().optional(),
    price: z.number()
  })),
  createdAt: z.string(),
  fullName: z.string(),
  phoneNumber: z.string(),
  country: z.string(),
  city: z.string(),
  address: z.string(),
  postalCode: z.string(),
  deliveryNotes: z.string().optional(),
  paymentMethod: z.string(),
  referralCode: z.string().optional()
});

export type Order = z.infer<typeof orderSchema>;

// Online User Schema
export const onlineUserSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  telegramId: z.string(),
  username: z.string(),
  lastActive: z.date()
});

export type OnlineUser = z.infer<typeof onlineUserSchema>;

// Export all types
export type {
  User as InsertUser,
  Product as InsertProduct,
  CartItem as InsertCartItem,
  DeliveryAddress as InsertDeliveryAddress,
  Order as InsertOrder,
  OnlineUser as InsertOnlineUser
};
