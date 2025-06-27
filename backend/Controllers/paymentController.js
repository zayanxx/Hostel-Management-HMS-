import { Payment } from '../Models/Payment.js';
import Billing from '../Models/Billing.js';
import { Invoice } from '../Models/Invoice.js';
import User from '../Models/User.js';
import Resident from '../Models/Residents.js';

const updateBillingAndInvoiceStatus = async (billingId, invoiceId) => {
  const billing = await Billing.findById(billingId);
  if (!billing) return;

  const payments = await Payment.find({ billing: billingId, status: 'completed' });
  const totalPaid = payments.reduce((sum, p) => sum + p.amountPaid, 0);

  if (totalPaid >= billing.totalAmount) {
    billing.status = 'paid';
    billing.paidAt = new Date();
  } else if (totalPaid > 0) {
    billing.status = 'pending';
  }
  await billing.save();

  if (invoiceId) {
    const invoice = await Invoice.findById(invoiceId);
    if (invoice) {
      if (totalPaid >= invoice.amount) {
        invoice.status = 'paid';
        invoice.paymentDate = new Date();
      } else if (totalPaid > 0) {
        invoice.status = 'pending';
      }
      await invoice.save();
    }
  }
};

export const createPayment = async (req, res) => {
  try {
    const { resident, billing, invoice, amountPaid, paymentMethod, transactionId, remarks } = req.body;

    const payment = await Payment.create({
      resident,
      billing,
      invoice,
      amountPaid,
      paymentMethod,
      transactionId,
      remarks,
    });

    await updateBillingAndInvoiceStatus(billing, invoice);

    res.status(201).json({ message: 'Payment recorded successfully', payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Payment creation failed' });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('resident billing invoice')
      .sort({ createdAt: -1 });

    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

export const getPaymentsByResident = async (req, res) => {
  try {
    const payments = await Payment.find({ resident: req.params.residentId })
      .populate('billing invoice')
      .sort({ paymentDate: -1 });

    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resident payments' });
  }
};

export const getPaymentsByBilling = async (req, res) => {
  try {
    const payments = await Payment.find({ billing: req.params.billingId })
      .populate('resident invoice')
      .sort({ paymentDate: -1 });

    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch billing payments' });
  }
};

// GET: My Payments (for residents)
export const getMyPayments = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== 'resident') {
      return res.status(403).json({ message: 'Access denied: only residents can view payments' });
    }

    const resident = await Resident.findOne({ user: user._id });
    if (!resident) {
      return res.status(404).json({ message: 'Resident profile not found' });
    }

    const payments = await Payment.find({ resident: resident._id }).sort({ createdAt: -1 });

    return res.status(200).json(payments);
  } catch (err) {
    console.error('Get My Payments error:', err.message);
    return res.status(500).json({ message: 'Failed to fetch payments', error: err.message });
  }
};