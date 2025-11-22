export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  RESTAURANT_OWNER = 'RESTAURANT_OWNER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cuisineType: string[];
  status: string;
  isActive: boolean;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  discountPrice?: number;
  images: string[];
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  spiceLevel: number;
  allergens: string[];
  calories?: number;
  prepTime?: number;
  isAvailable: boolean;
  isFeatured: boolean;
  categoryId: string;
  category?: Category;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  SERVED = 'SERVED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  subtotal: number;
  itemName: string;
  itemImage?: string;
  variations?: Record<string, string>;
  specialNotes?: string;
  menuItem?: MenuItem;
}

export interface Order {
  id: string;
  orderNumber: string;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  specialInstructions?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}
