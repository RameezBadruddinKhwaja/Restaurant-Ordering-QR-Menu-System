import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validator';
import { orderLimiter } from '../middleware/rateLimiter';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/order.validator';

const router = Router();

// Customer routes
router.post(
  '/',
  authenticate,
  orderLimiter,
  validate(createOrderSchema),
  orderController.createOrder
);

router.get('/my-orders', authenticate, orderController.getMyOrders);

router.get('/:id', authenticate, orderController.getOrderById);

router.patch('/:id/cancel', authenticate, orderController.cancelOrder);

// Restaurant owner routes
router.get(
  '/restaurant/:restaurantId',
  authenticate,
  authorize('RESTAURANT_OWNER', 'ADMIN'),
  orderController.getRestaurantOrders
);

router.patch(
  '/:id/status',
  authenticate,
  authorize('RESTAURANT_OWNER', 'ADMIN'),
  validate(updateOrderStatusSchema),
  orderController.updateOrderStatus
);

export default router;
