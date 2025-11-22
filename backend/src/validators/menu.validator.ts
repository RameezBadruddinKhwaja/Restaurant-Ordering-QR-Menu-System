import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Category name must be at least 2 characters'),
    description: z.string().optional(),
    restaurantId: z.string().uuid('Valid restaurant ID required'),
    sortOrder: z.number().int().default(0),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    sortOrder: z.number().int().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const createMenuItemSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Item name must be at least 2 characters'),
    description: z.string().optional(),
    price: z.number().min(0, 'Price must be positive'),
    discountPrice: z.number().min(0).optional(),
    categoryId: z.string().uuid('Valid category ID required'),
    restaurantId: z.string().uuid('Valid restaurant ID required'),
    isVegetarian: z.boolean().default(false),
    isVegan: z.boolean().default(false),
    isGlutenFree: z.boolean().default(false),
    spiceLevel: z.number().int().min(0).max(5).default(0),
    allergens: z.array(z.string()).default([]),
    calories: z.number().int().min(0).optional(),
    prepTime: z.number().int().min(0).optional(),
  }),
});

export const updateMenuItemSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    price: z.number().min(0).optional(),
    discountPrice: z.number().min(0).optional(),
    categoryId: z.string().uuid().optional(),
    isVegetarian: z.boolean().optional(),
    isVegan: z.boolean().optional(),
    isGlutenFree: z.boolean().optional(),
    spiceLevel: z.number().int().min(0).max(5).optional(),
    allergens: z.array(z.string()).optional(),
    calories: z.number().int().min(0).optional(),
    prepTime: z.number().int().min(0).optional(),
    isAvailable: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
  }),
});
