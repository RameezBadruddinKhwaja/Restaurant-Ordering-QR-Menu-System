import { Router } from 'express';
import express from 'express';
import * as paymentController from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validator';
import {
  createPaymentIntentSchema,
  confirmPaymentSchema,
} from '../validators/payment.validator';

const router = Router();

// Stripe webhook (must be before express.json middleware)
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.handleStripeWebhook
);

// Protected routes
router.post(
  '/create-intent',
  authenticate,
  validate(createPaymentIntentSchema),
  paymentController.createPaymentIntent
);

router.post(
  '/confirm',
  authenticate,
  validate(confirmPaymentSchema),
  paymentController.confirmPayment
);

router.get(
  '/order/:orderId',
  authenticate,
  paymentController.getPaymentByOrder
);

export default router;
