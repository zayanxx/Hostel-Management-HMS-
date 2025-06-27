import { body, param } from 'express-validator';

export const validateCreateBilling = [
  body('resident').isMongoId(),
  body('billingPeriodStart').isISO8601(),
  body('billingPeriodEnd').isISO8601(),
  body('roomFee').isFloat({ min: 0 }),
  body('utilitiesFee').optional().isFloat({ min: 0 }),
  body('additionalServicesFee').optional().isFloat({ min: 0 }),
  body('discountAmount').optional().isFloat({ min: 0 }),
  body('lateFee').optional().isFloat({ min: 0 }),
  body('totalAmount').isFloat({ min: 0 }),
  body('status').optional().isIn(['pending', 'paid', 'overdue', 'cancelled']),
  body('notes').optional().isString(),
];

export const validateUpdateBilling = [
  param('id').isMongoId(),
  body('status').optional().isIn(['pending', 'paid', 'overdue', 'cancelled']),
  body('paidAt').optional().isISO8601(),
  body('notes').optional().isString(),
];
