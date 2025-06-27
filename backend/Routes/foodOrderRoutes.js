import express from 'express';
import {
  createFoodOrder,
  getAllFoodOrders,
  getFoodOrderById,
  updateFoodOrder,
  deleteFoodOrder,
  getMyFoodOrders
} from '../Controllers/foodOrderController.js';
import { validateFoodOrder } from '../Validation/foodOrderValidation.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';

const router = express.Router();

// Create a new Food Order (resident auto-assigned from req.user)
router.post('/', validateFoodOrder, createFoodOrder);

// Retrieve all Food Orders (with optional query filters)
router.get('/', getAllFoodOrders);

// Get Food Orders for the currently logged-in resident
router.get('/my-orders', authMiddleware, getMyFoodOrders);

// Retrieve a single Food Order by ID
router.get('/:id', getFoodOrderById);

// Update a Food Order (e.g., update order status/payment)
router.put('/:id', validateFoodOrder, updateFoodOrder);

// Delete a Food Order
router.delete('/:id', deleteFoodOrder);


export default router;