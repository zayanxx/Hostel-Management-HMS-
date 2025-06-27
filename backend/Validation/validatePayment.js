import { body, validationResult } from 'express-validator';

export const validatePayment = [
  body('resident').isMongoId().withMessage('Invalid resident ID'),
  body('billing').isMongoId().withMessage('Invalid billing ID'),
  body('invoice').optional().isMongoId().withMessage('Invalid invoice ID'),
  body('amountPaid').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('paymentMethod').isIn(['cash', 'card', 'online', 'upi', 'other']).withMessage('Invalid payment method'),
  body('transactionId').optional().isString(),
  body('remarks').optional().isString(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  }
];
