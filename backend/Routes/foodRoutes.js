import express from 'express';
import {
  createFood,
  getAllFoods,
  getFoodById,
  updateFood,
  deleteFood,
} from '../Controllers/foodController.js';
import { validateFood } from '../Validation/foodValidation.js';

const router = express.Router();

// Create a new Food item
router.post('/', validateFood, createFood);

// Get all Food items, with optional filters (e.g., category, isAvailable)
router.get('/', getAllFoods);

// Get a Food item by its ID
router.get('/:id', getFoodById);

// Update an existing Food item
router.put('/:id', validateFood, updateFood);

// Delete a Food item
router.delete('/:id', deleteFood);

export default router;