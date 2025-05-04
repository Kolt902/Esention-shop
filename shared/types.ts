export interface User {
  id: string;
  telegramId: string;
  username: string;
  firstName: string;
  lastName: string;
  isAdmin?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: string;
  createdAt: Date;
}

export interface InsertUser {
  telegramId: string;
  username: string;
  firstName: string;
  lastName: string;
  isAdmin?: boolean;
}

export interface InsertCartItem {
  userId: string;
  productId: string;
  quantity: number;
}

export interface DeliveryAddress {
  id: string;
  userId: string;
  fullName: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
} 