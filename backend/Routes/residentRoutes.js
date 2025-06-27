// routes/residentRoutes.js
import express from 'express';
import {
  createResident,
  getResidents,
  getResidentById,
  updateResident,
  deleteResident
} from '../Controllers/residentController.js';
import {
  createResidentValidation,
  updateResidentValidation,
  validate
} from '../Validation/residentValidation.js';
import { validateObjectId, asyncHandler } from '../Middlewares/residentMiddlewares.js';

const router = express.Router();

// Create a new resident
router.post('/', createResidentValidation, validate, asyncHandler(createResident));

// Get all residents
router.get('/', asyncHandler(getResidents));

// Get a resident by ID
router.get('/:id', validateObjectId, asyncHandler(getResidentById));

// Update a resident by ID
router.put('/:id', validateObjectId, updateResidentValidation, validate, asyncHandler(updateResident));

// Delete a resident by ID
router.delete('/:id', validateObjectId, asyncHandler(deleteResident));

export default router;