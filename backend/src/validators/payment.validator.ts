import { z } from 'zod';

export const createPaymentIntentSchema = z.object({
  body: z.object({
    orderId: z.string().uuid('Valid order ID required'),
    amount: z.number().min(1, 'Amount must be greater than 0'),
    currency: z.string().default('PKR'),
  }),
});

export const confirmPaymentSchema = z.object({
  body: z.object({
    paymentIntentId: z.string().min(1, 'Payment intent ID required'),
    orderId: z.string().uuid('Valid order ID required'),
  }),
});
