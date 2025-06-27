import express from 'express';
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from '../Validation/authValidator.js';

import {
  register,
  login,
  forgotPassword,
  resetPassword,
  logout,
  getUserProfile,
  updateUserProfile,
  getMe
} from '../Controllers/authController.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/forgot-password', forgotPasswordValidator, forgotPassword);
router.post('/reset-password/:token', resetPasswordValidator, resetPassword);
router.post('/logout', logout);
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.get('/my-profile',authMiddleware, getMe);

export default router;