import { body, validationResult } from 'express-validator';

export const validateComplaint = [
  body('resident')
    .exists({ checkFalsy: true })
    .withMessage('Resident ID is required')
    .isMongoId()
    .withMessage('Invalid Resident ID'),

  body('room')
    .optional()
    .isMongoId()
    .withMessage('Invalid Room ID'),

  body('subject')
    .exists({ checkFalsy: true })
    .withMessage('Subject is required')
    .isLength({ max: 200 })
    .withMessage('Subject cannot exceed 200 characters'),

  body('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required')
    .isLength({ min: 3, max: 1000 })
    .withMessage('Description must be between 3 and 1000 characters'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];