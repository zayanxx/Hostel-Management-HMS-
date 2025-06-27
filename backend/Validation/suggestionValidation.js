// src/Validation/suggestionValidation.js
import { body, validationResult } from 'express-validator'

export const validateSuggestion = [
  body('name')
    .exists({ checkFalsy: true })
    .withMessage('Your name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('subject')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Subject cannot exceed 200 characters'),
  body('content')
    .exists({ checkFalsy: true })
    .withMessage('Content is required')
    .isLength({ min: 3, max: 1000 })
    .withMessage('Content must be between 3 and 1000 characters'),
  // after all checks, gather results
  (req, res, next) => {
    const errs = validationResult(req)
    if (!errs.isEmpty()) {
      return res.status(400).json({ errors: errs.array() })
    }
    next()
  },
]