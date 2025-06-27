import express from 'express';
import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  generateInvoiceFromBilling,
  getInvoicesByResident,
  getMyInvoices
} from '../Controllers/invoiceController.js';

import {
  validateCreateInvoice,
  validateUpdateInvoice
} from '../Validation/invoiceValidation.js';

import { authMiddleware } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', validateCreateInvoice, createInvoice);

router.get('/', getAllInvoices);

// Get invoices for the currently logged-in resident
router.get('/my-invoices', authMiddleware, getMyInvoices);

router.get('/:id', getInvoiceById);

router.put('/:id', validateUpdateInvoice, updateInvoice);

router.delete('/:id', deleteInvoice);

// 🔁 Generate invoice from a billing entry
router.post('/generate/:billingId', generateInvoiceFromBilling);

// 🧍 Get all invoices for a resident
router.get('/resident/:residentId', getInvoicesByResident);

export default router;
