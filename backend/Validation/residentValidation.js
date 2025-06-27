// validations/residentValidation.js
import { check, validationResult } from 'express-validator';

export const createResidentValidation = [
  check('user')
    .notEmpty().withMessage('User field is required')
    .isMongoId().withMessage('User must be a valid MongoDB ID'),
  check('contactNumber')
    .notEmpty().withMessage('Contact number is required'),
  check('room')
    .optional()
    .isMongoId().withMessage('Room must be a valid MongoDB ID'),
  check('status')
    .optional()
    .isIn(['checked-in', 'checked-out'])
    .withMessage('Status must be either checked-in or checked-out'),
  check('checkInDate')
    .optional()
    .isISO8601().toDate().withMessage('Check-in date must be a valid ISO8601 date'),
  check('checkOutDate')
    .optional()
    .isISO8601().toDate().withMessage('Check-out date must be a valid ISO8601 date'),
  check('emergencyContact.name')
    .optional()
    .isString().withMessage('Emergency contact name must be a string'),
  check('emergencyContact.phone')
    .optional()
    .isString().withMessage('Emergency contact phone must be a string')
];

export const updateResidentValidation = [
  check('user')
    .optional()
    .isMongoId().withMessage('User must be a valid MongoDB ID'),
  check('contactNumber')
    .optional()
    .notEmpty().withMessage('Contact number cannot be empty'),
  check('room')
    .optional()
    .isMongoId().withMessage('Room must be a valid MongoDB ID'),
  check('status')
    .optional()
    .isIn(['checked-in', 'checked-out'])
    .withMessage('Status must be either checked-in or checked-out'),
  check('checkInDate')
    .optional()
    .isISO8601().toDate().withMessage('Check-in date must be a valid ISO8601 date'),
  check('checkOutDate')
    .optional()
    .isISO8601().toDate().withMessage('Check-out date must be a valid ISO8601 date'),
  check('emergencyContact.name')
    .optional()
    .isString().withMessage('Emergency contact name must be a string'),
  check('emergencyContact.phone')
    .optional()
    .isString().withMessage('Emergency contact phone must be a string')
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
};