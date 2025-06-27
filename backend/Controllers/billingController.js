import { validationResult } from 'express-validator';
import User from '../Models/User.js';
import Billing from '../Models/Billing.js';
import Resident from '../Models/Residents.js';
import Room from '../Models/Room.js';
import { generateMonthlyBillings } from '../Utils/billing.utils.js';

export const createBilling = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const billing = new Billing(req.body);
    await billing.save();
    res.status(201).json(billing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllBillings = async (req, res) => {
  try {
    const billings = await Billing.find().populate('resident');
    res.json(billings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBillingById = async (req, res) => {
  try {
    const billing = await Billing.findById(req.params.id).populate('resident');
    if (!billing) return res.status(404).json({ error: 'Billing not found' });
    res.json(billing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateBilling = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const billing = await Billing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!billing) return res.status(404).json({ error: 'Billing not found' });
    res.json(billing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteBilling = async (req, res) => {
  try {
    const billing = await Billing.findByIdAndDelete(req.params.id);
    if (!billing) return res.status(404).json({ error: 'Billing not found' });
    res.json({ message: 'Billing deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📅 Auto-generation controller
export const generateBilling = async (req, res) => {
  try {
    const bills = await generateMonthlyBillings();
    res.status(201).json({ message: `${bills.length} bills generated`, bills });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📊 Summaries
export const residentBillingSummary = async (req, res) => {
  try {
    const residentId = req.params.residentId;
    const bills = await Billing.find({ resident: residentId });
    const total = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
    res.json({ count: bills.length, total, bills });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const roomBillingSummary = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const residents = await Resident.find({ room: roomId });
    const residentIds = residents.map(r => r._id);
    const bills = await Billing.find({ resident: { $in: residentIds } });
    const total = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
    res.json({ roomId, total, count: bills.length, bills });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMyBills = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Get the authenticated user
    const user = await User.findById(userId);
    if (!user || user.role !== 'resident') {
      return res.status(403).json({ message: 'Access denied: only residents can view bills' });
    }

    // Find the resident profile using userId
    const resident = await Resident.findOne({ user: user._id });
    if (!resident) {
      return res.status(404).json({ message: 'Resident profile not found' });
    }

    // Fetch all bills linked to this resident
    const bills = await Billing.find({ resident: resident._id }).sort({ createdAt: -1 });

    return res.status(200).json(bills);
  } catch (err) {
    console.error('Get My Bills error:', err.message);
    return res.status(500).json({ message: 'Failed to fetch bills', error: err.message });
  }
};