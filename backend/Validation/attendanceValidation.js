import { body, validationResult } from 'express-validator';

export const validateAttendance = [
  // Validate that staff ID is provided and is a valid MongoDB ObjectId
  body('staff')
    .exists({ checkFalsy: true })
    .withMessage('Staff ID is required')
    .bail()
    .isMongoId()
    .withMessage('Invalid Staff ID'),

  // Validate checkInTime exists and is in a valid ISO8601 format
  body('checkInTime')
    .exists({ checkFalsy: true })
    .withMessage('Check-in time is required')
    .bail()
    .isISO8601()
    .withMessage('Invalid check-in date format')
    .toDate(),

  // Validate checkOutTime, if provided, is in a valid ISO8601 format
  body('checkOutTime')
    .optional()
    .isISO8601()
    .withMessage('Invalid check-out date format')
    .toDate(),

  // Validate that status, if provided, is one of the allowed values
  body('status')
    .optional()
    .isIn(['present', 'absent', 'on_leave', 'holiday'])
    .withMessage('Invalid status type'),

  // Custom validator to ensure check-in is not later than check-out
  body('checkOutTime').custom((value, { req }) => {
    if (value) {
      const checkInTime = req.body.checkInTime;
      if (checkInTime && new Date(checkInTime) > new Date(value)) {
        throw new Error('Check-in time cannot be after check-out time');
      }
    }
    return true;
  }),

  // Process the result of validations and report any errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];