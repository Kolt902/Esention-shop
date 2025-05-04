import { nanoid } from 'nanoid';
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

// Адаптеры для преобразования типов из Zod в Drizzle

export function adaptUserToDrizzle(user: InsertUser) {
  return {
    _id: nanoid(),
    username: user.username,
    password: user.password,
    telegramId: user.telegramId || null,
    isAdmin: user.isAdmin || false,
    email: user.email || null,
    fullName: user.fullName || null,
    phone: user.phone || null,
    avatarUrl: user.avatarUrl || null,
    lastLogin: user.lastLogin || null,
    registrationDate: user.registrationDate || null,
    referralCode: user.referralCode || null,
    referredBy: user.referredBy || null,
    referralCount: user.referralCount || 0,
    referralDiscount: user.referralDiscount || 0,
    notificationSettings: user.notificationSettings || {
      orderUpdates: true,
      promotions: true,
      newArrivals: true,
      priceDrops: false
    },
    preferences: user.preferences || {
      language: "en",
      theme: "auto",
      currency: "EUR"
    },
    createdAt: new Date()
  };
}

export function adaptProductToDrizzle(product: InsertProduct) {
  return {
    _id: nanoid(),
    name: product.name,
    price: product.price,
    category: product.category,
    imageUrl: product.imageUrl,
    additionalImages: product.additionalImages || [],
    sizes: product.sizes,
    description: product.description || "",
    brand: product.brand || "",
    style: product.style || null,
    gender: product.gender || "unisex",
    isNew: product.isNew || false,
    discount: product.discount || 0,
    rating: product.rating || 0,
    inStock: product.inStock || true,
    originalUrl: product.originalUrl || null,
    colors: product.colors || [],
    categorySlug: product.categorySlug || null,
    brandSlug: product.brandSlug || null,
    styleSlug: product.styleSlug || null
  };
}

export function adaptCartItemToDrizzle(cartItem: InsertCartItem) {
  return {
    _id: nanoid(),
    userId: cartItem.userId,
    productId: cartItem.productId,
    quantity: cartItem.quantity || 1,
    size: cartItem.size || null
  };
}

export function adaptDeliveryAddressToDrizzle(address: InsertDeliveryAddress) {
  return {
    _id: nanoid(),
    userId: address.userId,
    fullName: address.fullName,
    phoneNumber: address.phoneNumber,
    country: address.country,
    city: address.city,
    address: address.address,
    postalCode: address.postalCode,
    isDefault: address.isDefault || false
  };
}

export function adaptOrderToDrizzle(order: InsertOrder) {
  return {
    _id: nanoid(),
    userId: order.userId,
    status: order.status || "pending",
    totalPrice: order.totalPrice,
    items: order.items,
    createdAt: new Date(),
    fullName: order.fullName,
    phoneNumber: order.phoneNumber,
    country: order.country,
    city: order.city,
    address: order.address,
    postalCode: order.postalCode,
    deliveryNotes: order.deliveryNotes || null,
    paymentMethod: order.paymentMethod,
    referralCode: order.referralCode || null
  };
}

export function adaptOnlineUserToDrizzle(user: OnlineUser) {
  return {
    _id: nanoid(),
    userId: user.userId,
    telegramId: user.telegramId,
    username: user.username,
    lastActive: new Date()
  };
}

// Адаптеры для преобразования типов из Drizzle в Zod

export function adaptUserFromDrizzle(user: any): User {
  return {
    username: user.username,
    password: user.password,
    telegramId: user.telegramId || undefined,
    isAdmin: user.isAdmin || false,
    email: user.email || undefined,
    fullName: user.fullName || undefined,
    phone: user.phone || undefined,
    avatarUrl: user.avatarUrl || undefined,
    lastLogin: user.lastLogin || undefined,
    registrationDate: user.registrationDate || undefined,
    referralCode: user.referralCode || undefined,
    referredBy: user.referredBy || undefined,
    referralCount: user.referralCount || 0,
    referralDiscount: user.referralDiscount || 0,
    notificationSettings: user.notificationSettings || {
      orderUpdates: true,
      promotions: true,
      newArrivals: true,
      priceDrops: false
    },
    preferences: user.preferences || {
      language: "en",
      theme: "auto",
      currency: "EUR"
    },
    createdAt: user.createdAt?.toISOString() || undefined
  };
}

export function adaptProductFromDrizzle(product: any): Product {
  return {
    name: product.name,
    price: product.price,
    category: product.category,
    imageUrl: product.imageUrl,
    additionalImages: product.additionalImages || [],
    sizes: product.sizes || [],
    description: product.description || "",
    brand: product.brand || "",
    style: product.style || undefined,
    gender: product.gender || "unisex",
    isNew: product.isNew || false,
    discount: product.discount || 0,
    rating: product.rating || 0,
    inStock: product.inStock || true,
    originalUrl: product.originalUrl || undefined,
    colors: product.colors || [],
    categorySlug: product.categorySlug || undefined,
    brandSlug: product.brandSlug || undefined,
    styleSlug: product.styleSlug || undefined
  };
}

export function adaptCartItemFromDrizzle(cartItem: any): CartItem {
  return {
    userId: cartItem.userId,
    productId: cartItem.productId,
    quantity: cartItem.quantity || 1,
    size: cartItem.size || undefined
  };
}

export function adaptDeliveryAddressFromDrizzle(address: any): DeliveryAddress {
  return {
    userId: address.userId,
    fullName: address.fullName,
    phoneNumber: address.phoneNumber,
    country: address.country,
    city: address.city,
    address: address.address,
    postalCode: address.postalCode,
    isDefault: address.isDefault || false
  };
}

export function adaptOrderFromDrizzle(order: any): Order {
  return {
    userId: order.userId,
    status: order.status || "pending",
    totalPrice: order.totalPrice,
    items: order.items,
    createdAt: order.createdAt?.toISOString() || new Date().toISOString(),
    fullName: order.fullName,
    phoneNumber: order.phoneNumber,
    country: order.country,
    city: order.city,
    address: order.address,
    postalCode: order.postalCode,
    deliveryNotes: order.deliveryNotes || undefined,
    paymentMethod: order.paymentMethod,
    referralCode: order.referralCode || undefined
  };
}

export function adaptOnlineUserFromDrizzle(user: any): OnlineUser {
  return {
    userId: user.userId,
    telegramId: user.telegramId,
    username: user.username,
    lastActive: user.lastActive || new Date()
  };
} 