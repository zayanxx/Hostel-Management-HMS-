import express from 'express';
import {
  createPayment,
  getAllPayments,
  getPaymentsByResident,
  getPaymentsByBilling,
  getMyPayments
} from '../Controllers/paymentController.js';
import { validatePayment } from '../Validation/validatePayment.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', validatePayment, createPayment);
router.get('/', getAllPayments);
router.get('/my-payments', authMiddleware, getMyPayments);
router.get('/resident/:residentId', getPaymentsByResident);
router.get('/billing/:billingId', getPaymentsByBilling);


export default router;
