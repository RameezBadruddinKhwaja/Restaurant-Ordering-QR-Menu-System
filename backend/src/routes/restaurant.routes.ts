import { Router } from 'express';
import * as restaurantController from '../controllers/restaurant.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validator';
import {
  createRestaurantSchema,
  updateRestaurantSchema,
  restaurantStatusSchema,
} from '../validators/restaurant.validator';

const router = Router();

// Public routes
router.get('/', restaurantController.getAllRestaurants);
router.get('/:id', restaurantController.getRestaurantById);
router.get('/slug/:slug', restaurantController.getRestaurantBySlug);

// Protected routes - Restaurant Owner
router.post(
  '/',
  authenticate,
  authorize('RESTAURANT_OWNER', 'ADMIN'),
  validate(createRestaurantSchema),
  restaurantController.createRestaurant
);

router.put(
  '/:id',
  authenticate,
  authorize('RESTAURANT_OWNER', 'ADMIN'),
  validate(updateRestaurantSchema),
  restaurantController.updateRestaurant
);

router.delete(
  '/:id',
  authenticate,
  authorize('RESTAURANT_OWNER', 'ADMIN'),
  restaurantController.deleteRestaurant
);

router.get(
  '/owner/my-restaurants',
  authenticate,
  authorize('RESTAURANT_OWNER'),
  restaurantController.getMyRestaurants
);

// Admin only routes
router.patch(
  '/:id/status',
  authenticate,
  authorize('ADMIN'),
  validate(restaurantStatusSchema),
  restaurantController.updateRestaurantStatus
);

export default router;
