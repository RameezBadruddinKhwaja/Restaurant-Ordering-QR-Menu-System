import { z } from 'zod';

export const createRestaurantSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Restaurant name must be at least 2 characters'),
    description: z.string().optional(),
    phone: z.string().min(10, 'Valid phone number required'),
    email: z.string().email('Valid email required'),
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().min(5, 'Valid zip code required'),
    country: z.string().default('Pakistan'),
    cuisineType: z.array(z.string()).min(1, 'At least one cuisine type required'),
    minOrderAmount: z.number().min(0).default(0),
    deliveryFee: z.number().min(0).default(0),
    taxRate: z.number().min(0).max(1).default(0.16),
    businessHours: z.record(z.object({
      open: z.string(),
      close: z.string(),
    })).optional(),
  }),
});

export const updateRestaurantSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    phone: z.string().min(10).optional(),
    email: z.string().email().optional(),
    address: z.string().min(5).optional(),
    city: z.string().min(2).optional(),
    state: z.string().min(2).optional(),
    zipCode: z.string().min(5).optional(),
    cuisineType: z.array(z.string()).optional(),
    minOrderAmount: z.number().min(0).optional(),
    deliveryFee: z.number().min(0).optional(),
    taxRate: z.number().min(0).max(1).optional(),
    businessHours: z.record(z.object({
      open: z.string(),
      close: z.string(),
    })).optional(),
    acceptsOrders: z.boolean().optional(),
  }),
});

export const restaurantStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED']),
  }),
});
