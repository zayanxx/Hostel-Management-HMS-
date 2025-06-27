import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdmin,
  deleteAdmin,
  forgotPassword,
  resetPassword
} from '../Controllers/adminController.js';

import {
  registerAdminValidator,
  loginAdminValidator,
  forgotPasswordValidator,
  resetPasswordValidator
} from '../Validation/adminValidation.js';

import { adminAuth } from '../Middlewares/adminMiddleware.js';

const router = express.Router();

// Register Admin (or Manager)
router.post('/register', registerAdminValidator, registerAdmin);

// Admin Login
router.post('/login', loginAdminValidator, loginAdmin);

// Forgot Password
router.post('/forgot-password', forgotPasswordValidator, forgotPassword);

// Reset Password
router.post('/reset-password/:token', resetPasswordValidator, resetPassword);

// Protected Route to Get Admin Profile
router.get('/profile', adminAuth, getAdminProfile);

// Update Admin Profile
router.put('/update/:id', adminAuth, updateAdmin);

// Delete Admin Account
router.delete('/delete/:id', adminAuth, deleteAdmin);

export default router;