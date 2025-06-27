// Routes/staffRoutes.js
import express from 'express';
import {
  createStaff,
  getAllStaff,
  getMyStaffProfile,
  getStaffById,
  updateStaff,
  deleteStaff,
  getMe
} from '../Controllers/staffController.js';

import { staffValidationRules } from '../Validation/staffValidation.js';
import { authenticateUser } from '../Middlewares/authMiddleware.js';
import { adminAuth } from '../Middlewares/adminMiddleware.js';
import { staffAuthChain } from '../Middlewares/staffMiddleware.js';

const router = express.Router();

/* ----- PUBLIC to Admins only ------------------------------------ */
router.post('/', staffValidationRules, createStaff);
router.get('/', getAllStaff);
router.get('/me', authenticateUser, getMe);
router.get('/:id', getStaffById);
router.put('/:id',staffValidationRules, updateStaff);
router.delete('/:id',deleteStaff);

/* ----- SELF-SERVICE endpoint ------------------------------------ */
router.get('/me', authenticateUser, getMyStaffProfile);   //  GET /api/staff/me

export default router;