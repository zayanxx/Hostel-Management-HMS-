import { body, validationResult } from 'express-validator';

export const validateMaintenance = [
  body('room')
    .exists({ checkFalsy: true })
    .withMessage('Room ID is required')
    .isMongoId()
    .withMessage('Invalid Room ID'),

  body('issueTitle')
    .exists({ checkFalsy: true })
    .withMessage('Issue title is required')
    .isLength({ max: 200 })
    .withMessage('Issue title cannot exceed 200 characters')
    .trim(),

  body('issueDescription')
    .exists({ checkFalsy: true })
    .withMessage('Issue description is required')
    .isLength({ min: 5, max: 1000 })
    .withMessage('Issue description must be between 5 and 1000 characters')
    .trim(),

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
  },
];