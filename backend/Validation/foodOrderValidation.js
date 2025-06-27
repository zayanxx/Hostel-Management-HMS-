import { body, validationResult } from 'express-validator';

export const validateFoodOrder = [
  // Validate items field as an array and ensure it's not empty
  body('items')
    .isArray({ min: 1 })
    .withMessage('Items must be a non-empty array'),
  
  // Validate each item in the items array
  body('items.*.food')
    .exists({ checkFalsy: true })
    .withMessage('Food ID is required for each item')
    .isMongoId()
    .withMessage('Invalid Food ID format'),
  
  body('items.*.quantity')
    .exists({ checkFalsy: true })
    .withMessage('Quantity is required for each item')
    .isInt({ min: 1 })
    .withMessage('Quantity must be an integer of at least 1'),
  
  body('items.*.unitPrice')
    .exists({ checkFalsy: true })
    .withMessage('Unit price is required for each item')
    .isFloat({ min: 0 })
    .withMessage('Unit price must be a non-negative number'),
  
  // Optionally validate paymentStatus
  body('paymentStatus')
    .optional()
    .isIn(['unpaid', 'paid', 'failed'])
    .withMessage('Invalid payment status'),
  
  // Optionally validate order status
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
  
  // Optionally validate deliveredAt if provided
  body('deliveredAt')
    .optional()
    .isISO8601()
    .withMessage('Delivered at must be a valid date')
    .toDate(),

  // Process and return errors, if any
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];