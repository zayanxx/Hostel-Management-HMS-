import { check } from 'express-validator';

export const registerValidator = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long'),
  check('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  check('role')
    .optional()
    .isIn(['resident', 'staff', 'user'])
    .withMessage('Invalid role'),
  check('contactNumber')
    .optional()
    .isString()
    .withMessage('Contact number must be provided as text'),
];

export const loginValidator = [
  check('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required'),
  check('password')
    .exists()
    .withMessage('Password is required'),
];

export const forgotPasswordValidator = [
  check('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required'),
];

export const resetPasswordValidator = [
  check('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
];