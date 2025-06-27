import { check } from 'express-validator';

export const registerAdminValidator = [
  check('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3, max: 30 }).withMessage('Name must be between 3 and 30 characters'),

  check('email')
    .isEmail().withMessage('Valid email is required'),

  check('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  check('role')
    .optional()
    .isIn(['admin', 'manager']).withMessage('Role must be either admin or manager'),

  check('designation')
    .optional()
    .isLength({ max: 100 }).withMessage('Designation can be at most 100 characters'),

  check('department')
    .optional()
    .isLength({ max: 100 }).withMessage('Department can be at most 100 characters'),
];

export const loginAdminValidator = [
  check('email')
    .isEmail().withMessage('Valid email is required'),

  check('password')
    .exists().withMessage('Password is required'),
];

export const forgotPasswordValidator = [
  check('email')
    .isEmail().withMessage('Valid email is required'),
];

export const resetPasswordValidator = [
  check('newPassword')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];