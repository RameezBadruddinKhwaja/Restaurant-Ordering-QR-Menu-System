import { Router } from 'express';
import * as tableController from '../controllers/table.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validator';
import { createTableSchema, updateTableSchema } from '../validators/table.validator';

const router = Router();

// Public routes
router.get('/restaurant/:restaurantId', tableController.getTablesByRestaurant);
router.get('/qr/:qrCode', tableController.getTableByQRCode);
router.get('/:id', tableController.getTableById);

// Protected routes
router.post(
  '/',
  authenticate,
  authorize('RESTAURANT_OWNER', 'ADMIN'),
  validate(createTableSchema),
  tableController.createTable
);

router.put(
  '/:id',
  authenticate,
  authorize('RESTAURANT_OWNER', 'ADMIN'),
  validate(updateTableSchema),
  tableController.updateTable
);

router.delete(
  '/:id',
  authenticate,
  authorize('RESTAURANT_OWNER', 'ADMIN'),
  tableController.deleteTable
);

router.post(
  '/:id/regenerate-qr',
  authenticate,
  authorize('RESTAURANT_OWNER', 'ADMIN'),
  tableController.regenerateQRCode
);

export default router;
