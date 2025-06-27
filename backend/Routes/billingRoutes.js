import express from 'express';
import {
  createBilling,
  getAllBillings,
  getBillingById,
  updateBilling,
  deleteBilling,
  generateBilling,
  residentBillingSummary,
  roomBillingSummary,
  getMyBills
} from '../Controllers/billingController.js';

import {
  validateCreateBilling,
  validateUpdateBilling,
} from '../Validation/billingValidation.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', validateCreateBilling, createBilling);
router.get('/', getAllBillings);
router.get('/my-bills', authMiddleware, getMyBills);
router.get('/:id', getBillingById);
router.put('/:id', validateUpdateBilling, updateBilling);
router.delete('/:id', deleteBilling);

// Special routes
router.post('/generate/automatic', generateBilling);
router.get('/summary/resident/:residentId', residentBillingSummary);
router.get('/summary/room/:roomId', roomBillingSummary);

export default router;
