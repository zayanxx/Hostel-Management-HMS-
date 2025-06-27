// Controllers/staffController.js
import { Staff } from '../Models/Staff.js';
import { validationResult } from 'express-validator';
import User from '../Models/User.js';

/* --------------------------- CREATE ---------------------------------- */
export const createStaff = async (req, res) => {
  /* validate */
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { userId, name, email, contact, department, shift } = req.body;

    /* prevent duplicate staff linked to same user or email */
    if (await Staff.findOne({ $or: [{ user: userId }, { email }] })) {
      return res.status(409).json({ message: 'Staff with same user/email exists' });
    }

    const staff = await Staff.create({ user: userId, name, email, contact, department, shift });
    res.status(201).json({ message: 'Staff created', staff });
  } catch (err) {
    console.error('createStaff:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/* --------------------------- READ ALL -------------------------------- */
export const getAllStaff = async (_req, res) => {
  try {
    const staff = await Staff.find().populate('user', 'name email role');
    res.json({ count: staff.length, staff });
  } catch (err) {
    console.error('getAllStaff:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/* --------------------------- READ ME -------------------------------- */
export const getMyStaffProfile = async (req, res) => {
  try {
    const staff = await Staff.findOne({ user: req.user.userId }).populate('user', 'name email role');
    if (!staff) return res.status(404).json({ message: 'No staff profile for this user' });
    res.json(staff);
  } catch (err) {
    console.error('getMyStaffProfile:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/* --------------------------- READ BY ID ----------------------------- */
export const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).populate('user', 'name email role');
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.json(staff);
  } catch (err) {
    console.error('getStaffById:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/* --------------------------- UPDATE --------------------------------- */
export const updateStaff = async (req, res) => {
  const { id } = req.params;
  try {
    const staff = await Staff.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.json({ message: 'Staff updated', staff });
  } catch (err) {
    console.error('updateStaff:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/* --------------------------- DELETE --------------------------------- */
export const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.json({ message: 'Staff deleted' });
  } catch (err) {
    console.error('deleteStaff:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// get me
// In Controllers/staffController.js
export const getMe = async (req, res) => {
  try {
    const staff = await Staff.findOne({ user: req.user.userId }).populate('user', 'name email role');
    if (!staff) return res.status(404).json({ message: 'No staff profile found for this user' });
    res.json(staff);
  } catch (err) {
    console.error('getMe:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
