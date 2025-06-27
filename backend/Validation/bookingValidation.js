import { body, validationResult } from 'express-validator';

export const validateBooking = [
  body('room')
    .exists({ checkFalsy: true })
    .withMessage('Room ID is required')
    .isMongoId()
    .withMessage('Invalid Room ID'),

  body('checkInDate')
    .exists({ checkFalsy: true })
    .withMessage('Check-in date is required')
    .isISO8601()
    .withMessage('Invalid check-in date format')
    .toDate(),

  body('checkOutDate')
    .exists({ checkFalsy: true })
    .withMessage('Check-out date is required')
    .isISO8601()
    .withMessage('Invalid check-out date format')
    .toDate()
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.checkInDate)) {
        throw new Error('Check-out date must be after check-in date');
      }
      return true;
    }),

  body('notes')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];