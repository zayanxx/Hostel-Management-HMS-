import { body, validationResult } from 'express-validator';

export const validateRoom = [
  // roomNumber is required and must be a non-empty string
  body('roomNumber')
    .exists({ checkFalsy: true })
    .withMessage('Room number is required')
    .isString()
    .withMessage('Room number must be a string')
    .trim(),

  // type must be one of the predefined values if provided
  body('type')
    .optional()
    .isIn(['single', 'double', 'triple', 'suite', 'other'])
    .withMessage('Invalid room type'),

  // floor is required and must be a number
  body('floor')
    .exists({ checkFalsy: true })
    .withMessage('Floor is required')
    .isNumeric()
    .withMessage('Floor must be a number'),

  // capacity is required and must be an integer of at least 1
  body('capacity')
    .exists({ checkFalsy: true })
    .withMessage('Capacity is required')
    .isInt({ min: 1 })
    .withMessage('Capacity must be at least 1'),

  // occupants: if provided should be an array and each element a valid MongoDB ObjectId
  body('occupants')
    .optional()
    .isArray()
    .withMessage('Occupants must be an array')
    .custom((arr) => {
      for (let id of arr) {
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
          throw new Error('Invalid occupant id');
        }
      }
      return true;
    }),

  // status if provided must be one of the allowed values
  body('status')
    .optional()
    .isIn(['available', 'occupied', 'maintenance', 'reserved'])
    .withMessage('Invalid room status'),

  // features should be an array of strings if provided
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array')
    .custom((arr) => {
      for (let feature of arr) {
        if (typeof feature !== 'string') {
          throw new Error('Each feature must be a string');
        }
      }
      return true;
    }),

  // pricePerMonth is required and must be a non-negative number
  body('pricePerMonth')
    .exists({ checkFalsy: true })
    .withMessage('Price per month is required')
    .isFloat({ min: 0 })
    .withMessage('Price per month must be a non-negative number'),

  // Gather errors and send response if any validation failed
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];