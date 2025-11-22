import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    restaurantId: z.string().uuid('Valid restaurant ID required'),
    tableId: z.string().uuid().optional(),
    items: z.array(
      z.object({
        menuItemId: z.string().uuid('Valid menu item ID required'),
        quantity: z.number().int().min(1, 'Quantity must be at least 1'),
        variations: z.record(z.string()).optional(),
        specialNotes: z.string().optional(),
      })
    ).min(1, 'At least one item is required'),
    customerName: z.string().min(2, 'Customer name is required'),
    customerPhone: z.string().min(10, 'Valid phone number required'),
    customerEmail: z.string().email().optional(),
    specialInstructions: z.string().optional(),
    deliveryAddress: z.string().optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    status: z.enum([
      'PENDING',
      'CONFIRMED',
      'PREPARING',
      'READY',
      'SERVED',
      'COMPLETED',
      'CANCELLED',
    ]),
  }),
});
