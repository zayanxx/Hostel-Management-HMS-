import { body, param } from 'express-validator';

export const validateCreateInvoice = [
  body('invoiceNumber').isString().notEmpty(),
  body('resident').isMongoId(),
  body('billing').isMongoId(),
  body('dueDate').isISO8601(),
  body('amount').isFloat({ min: 0 }),
  body('status').optional().isIn(['pending', 'paid', 'overdue', 'cancelled']),
  body('paymentDate').optional().isISO8601(),
  body('notes').optional().isString(),
];

export const validateUpdateInvoice = [
  param('id').isMongoId(),
  body('status').optional().isIn(['pending', 'paid', 'overdue', 'cancelled']),
  body('paymentDate').optional().isISO8601(),
  body('notes').optional().isString(),
];
