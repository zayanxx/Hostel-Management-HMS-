import { validationResult } from 'express-validator';
import { Invoice } from '../Models/Invoice.js';
import Billing from '../Models/Billing.js';
import Resident from '../Models/Residents.js';
import User from '../Models/User.js';

export const createInvoice = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('resident billing');
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('resident billing');
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateInvoice = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Generate invoice from billing
export const generateInvoiceFromBilling = async (req, res) => {
  try {
    const billingId = req.params.billingId;
    const billing = await Billing.findById(billingId).populate('resident');
    if (!billing) return res.status(404).json({ error: 'Billing not found' });

    const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const dueDate = new Date(new Date().setDate(new Date().getDate() + 15));

    const invoice = new Invoice({
      invoiceNumber,
      resident: billing.resident._id,
      billing: billing._id,
      amount: billing.totalAmount,
      dueDate,
    });

    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Filtered by resident
export const getInvoicesByResident = async (req, res) => {
  try {
    const invoices = await Invoice.find({ resident: req.params.residentId }).populate('billing');
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET: My Invoices (for residents)
export const getMyInvoices = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Validate user and role
    const user = await User.findById(userId);
    if (!user || user.role !== 'resident') {
      return res.status(403).json({ message: 'Access denied: only residents can view invoices' });
    }

    // Get the resident profile
    const resident = await Resident.findOne({ user: user._id });
    if (!resident) {
      return res.status(404).json({ message: 'Resident profile not found' });
    }

    // Fetch all invoices related to the resident
    const invoices = await Invoice.find({ resident: resident._id }).sort({ createdAt: -1 });

    return res.status(200).json(invoices);
  } catch (err) {
    console.error('Get My Invoices error:', err.message);
    return res.status(500).json({ message: 'Failed to fetch invoices', error: err.message });
  }
};