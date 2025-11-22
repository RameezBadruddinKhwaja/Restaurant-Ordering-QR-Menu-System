import { z } from 'zod';

export const createTableSchema = z.object({
  body: z.object({
    tableNumber: z.string().min(1, 'Table number is required'),
    capacity: z.number().int().min(1, 'Capacity must be at least 1'),
    restaurantId: z.string().uuid('Valid restaurant ID required'),
    floor: z.string().optional(),
    section: z.string().optional(),
  }),
});

export const updateTableSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    tableNumber: z.string().min(1).optional(),
    capacity: z.number().int().min(1).optional(),
    status: z.enum(['AVAILABLE', 'OCCUPIED', 'RESERVED']).optional(),
    floor: z.string().optional(),
    section: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});
