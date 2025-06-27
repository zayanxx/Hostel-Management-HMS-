// Validation/staffValidation.js
import { body } from 'express-validator';

export const staffValidationRules = [
  body('userId').isMongoId().withMessage('Valid userId required'),
  body('name').isLength({ min: 3 }).withMessage('Name ≥ 3 chars'),
  body('email').isEmail().withMessage('Valid email required'),
  body('contact').isLength({ min: 10 }).withMessage('Contact ≥ 10 digits'),
  body('department').isIn(['HR','maintenance','reception','security','cleaning','other'])
    .withMessage('Invalid department'),
  body('shift').isIn(['morning','evening','night','rotational'])
    .withMessage('Invalid shift'),
];