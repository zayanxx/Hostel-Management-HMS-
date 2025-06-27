import { body, validationResult } from 'express-validator';

export const validateFood = [
  // Name is required, must be a string, and trimmed
  body('name')
    .exists({ checkFalsy: true })
    .withMessage('Food name is required')
    .isString()
    .withMessage('Food name must be a string')
    .trim(),

  // Description is optional but should be a string if provided
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .trim(),

  // Category should be one of the allowed values if provided
  body('category')
    .optional()
    .isIn(['breakfast', 'lunch', 'dinner', 'snack', 'beverage', 'other'])
    .withMessage('Invalid category value'),

  // Price is required and must be a non-negative number
  body('price')
    .exists({ checkFalsy: true })
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  // isAvailable is optional but, if provided, must be a boolean
  body('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('isAvailable must be a boolean'),

  // Collect validation errors and return if any
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];