import { Router } from 'express';
import * as menuController from '../controllers/menu.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validator';
import {
  createCategorySchema,
  updateCategorySchema,
  createMenuItemSchema,
  updateMenuItemSchema,
} from '../validators/menu.validator';

const router = Router();

// Categories
router.get('/categories/restaurant/:restaurantId', menuController.getCategoriesByRestaurant);

router.post(
  '/categories',
  authenticate,
  authorize('RESTAURANT_OWNER', 'ADMIN'),
  validate(createCategorySchema),
  menuController.createCategory
);

router.put(
  '/categories/:id',
  authenticate,
  authorize('RESTAURANT_OWNER', 'ADMIN'),
  validate(updateCategorySchema),
  menuController.updateCategory
);

router.delete(
  '/categories/:id',
  authenticate,
  authorize('RESTAURANT_OWNER', 'ADMIN'),
  menuController.deleteCategory
);

// Menu Items
router.get('/items/restaurant/:restaurantId', menuController.getMenuItemsByRestaurant);
router.get('/items/:id', menuController.getMenuItemById);

router.post(
  '/items',
  authenticate,
  authorize('RESTAURANT_OWNER', 'ADMIN'),
  validate(createMenuItemSchema),
  menuController.createMenuItem
);

router.put(
  '/items/:id',
  authenticate,
  authorize('RESTAURANT_OWNER', 'ADMIN'),
  validate(updateMenuItemSchema),
  menuController.updateMenuItem
);

router.delete(
  '/items/:id',
  authenticate,
  authorize('RESTAURANT_OWNER', 'ADMIN'),
  menuController.deleteMenuItem
);

export default router;
