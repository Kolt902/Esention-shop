// Типы данных для приложения

// Тип для пользователя
export interface User {
  id: number;
  username: string;
  telegramId?: string;
  isAdmin: boolean;
  avatarUrl?: string;
}

// Тип для продукта
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  additionalImages?: string[];
  sizes?: string[];
  description?: string;
  brand?: string;
  featured?: boolean;
  inStock?: boolean;
}

// Тип для элемента корзины
export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

// Тип для адреса доставки
export interface DeliveryAddress {
  id: number;
  userId: number;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// Тип для элемента заказа
export interface OrderItem {
  id: number;
  productId: number;
  orderId: number;
  quantity: number;
  price: number;
  size?: string;
  product: {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
  };
}

// Тип для заказа
export interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

// Тип для пользователя онлайн
export interface OnlineUser {
  userId: number;
  telegramId: string;
  username: string;
  lastActive: Date;
}

// Тип для данных формы доставки
export interface DeliveryFormData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

// Тип для данных формы заказа
export interface OrderFormData extends DeliveryFormData {
  paymentMethod: string;
  saveAddress: boolean;
  makeDefault: boolean;
}