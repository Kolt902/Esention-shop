-- Create users table
CREATE TABLE IF NOT EXISTS users (
  _id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  telegram_id TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  last_login TEXT,
  registration_date TEXT,
  referral_code TEXT,
  referred_by TEXT,
  referral_count INTEGER DEFAULT 0,
  referral_discount INTEGER DEFAULT 0,
  notification_settings JSONB DEFAULT '{"orderUpdates": true, "promotions": true, "newArrivals": true, "priceDrops": false}',
  preferences JSONB DEFAULT '{"language": "en", "theme": "auto", "currency": "EUR"}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  _id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  additional_images TEXT[],
  sizes TEXT[],
  description TEXT DEFAULT '',
  brand TEXT DEFAULT '',
  style TEXT,
  gender TEXT DEFAULT 'unisex',
  is_new BOOLEAN DEFAULT FALSE,
  discount INTEGER DEFAULT 0,
  rating INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT TRUE,
  original_url TEXT,
  colors TEXT[],
  category_slug TEXT,
  brand_slug TEXT,
  style_slug TEXT
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  _id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(_id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(_id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  size TEXT
);

-- Create delivery_addresses table
CREATE TABLE IF NOT EXISTS delivery_addresses (
  _id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(_id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  _id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(_id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  total_price INTEGER NOT NULL,
  items JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  delivery_notes TEXT,
  payment_method TEXT NOT NULL,
  referral_code TEXT
);

-- Create online_users table
CREATE TABLE IF NOT EXISTS online_users (
  _id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(_id) ON DELETE CASCADE,
  telegram_id TEXT NOT NULL,
  username TEXT NOT NULL,
  last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_style ON products(style);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_delivery_addresses_user_id ON delivery_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_online_users_user_id ON online_users(user_id); 