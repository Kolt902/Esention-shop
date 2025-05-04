import { pgTable, text, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  _id: text('_id').primaryKey(),
  username: text('username').notNull(),
  password: text('password').notNull(),
  telegramId: text('telegram_id'),
  isAdmin: boolean('is_admin').default(false),
  email: text('email'),
  fullName: text('full_name'),
  phone: text('phone'),
  avatarUrl: text('avatar_url'),
  lastLogin: text('last_login'),
  registrationDate: text('registration_date'),
  referralCode: text('referral_code'),
  referredBy: text('referred_by'),
  referralCount: integer('referral_count').default(0),
  referralDiscount: integer('referral_discount').default(0),
  notificationSettings: jsonb('notification_settings').default({
    orderUpdates: true,
    promotions: true,
    newArrivals: true,
    priceDrops: false
  }),
  preferences: jsonb('preferences').default({
    language: 'en',
    theme: 'auto',
    currency: 'EUR'
  }),
  createdAt: timestamp('created_at').defaultNow()
});

export const products = pgTable('products', {
  _id: text('_id').primaryKey(),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  category: text('category').notNull(),
  imageUrl: text('image_url').notNull(),
  additionalImages: text('additional_images').array(),
  sizes: text('sizes').array(),
  description: text('description').default(''),
  brand: text('brand').default(''),
  style: text('style'),
  gender: text('gender').default('unisex'),
  isNew: boolean('is_new').default(false),
  discount: integer('discount').default(0),
  rating: integer('rating').default(0),
  inStock: boolean('in_stock').default(true),
  originalUrl: text('original_url'),
  colors: text('colors').array(),
  categorySlug: text('category_slug'),
  brandSlug: text('brand_slug'),
  styleSlug: text('style_slug')
});

export const cartItems = pgTable('cart_items', {
  _id: text('_id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users._id),
  productId: text('product_id')
    .notNull()
    .references(() => products._id),
  quantity: integer('quantity').default(1),
  size: text('size')
});

export const deliveryAddresses = pgTable('delivery_addresses', {
  _id: text('_id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users._id),
  fullName: text('full_name').notNull(),
  phoneNumber: text('phone_number').notNull(),
  country: text('country').notNull(),
  city: text('city').notNull(),
  address: text('address').notNull(),
  postalCode: text('postal_code').notNull(),
  isDefault: boolean('is_default').default(false)
});

export const orders = pgTable('orders', {
  _id: text('_id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users._id),
  status: text('status').default('pending'),
  totalPrice: integer('total_price').notNull(),
  items: jsonb('items').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  fullName: text('full_name').notNull(),
  phoneNumber: text('phone_number').notNull(),
  country: text('country').notNull(),
  city: text('city').notNull(),
  address: text('address').notNull(),
  postalCode: text('postal_code').notNull(),
  deliveryNotes: text('delivery_notes'),
  paymentMethod: text('payment_method').notNull(),
  referralCode: text('referral_code')
});

export const onlineUsers = pgTable('online_users', {
  _id: text('_id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users._id),
  telegramId: text('telegram_id').notNull(),
  username: text('username').notNull(),
  lastActive: timestamp('last_active').defaultNow()
}); 