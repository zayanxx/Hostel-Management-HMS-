import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import Admin from '../Models/Admin.js';
import { generateToken, verifyToken } from '../Utils/token.js';
import { sendEmail } from '../Utils/sendEmail.js';

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5004';

// Utility: Send email notifications
const sendAdminNotification = async (email, subject, message) => {
  try {
    await sendEmail({
      to: email,
      subject,
      html: `<p>${message}</p>`,
    });
  } catch (err) {
    console.error(`❌ Failed to send email to ${email}:`, err.message);
  }
};

// Register Admin (or Manager)
export const registerAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password, role, designation, department } = req.body;

    if (!['admin', 'manager'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role provided' });
    }

    if (await Admin.findOne({ email })) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, passwordHash, role, designation, department });
    const savedAdmin = await newAdmin.save();

    await sendAdminNotification(email, 'Admin Registration Successful', `Welcome ${name}, your admin account has been successfully created.`);

    return res.status(201).json({
      message: 'Registration successful',
      admin: { id: savedAdmin._id, name, email, role },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login Admin
export const loginAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ adminId: admin._id, role: admin.role }, 'access');
    await sendAdminNotification(email, 'Admin Login Notification', `Hello ${admin.name}, you have successfully logged in.`);

    return res.status(200).json({
      message: 'Login successful',
      token,
      admin: { id: admin._id, name: admin.name, email, role: admin.role },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const token = generateToken({ adminId: admin._id }, 'reset');
    const resetUrl = `${CLIENT_URL}/reset-password/${token}`;

    await sendAdminNotification(email, 'Reset Password Request', `Hello ${admin.name}, click <a href="${resetUrl}">here</a> to reset your password.`);

    return res.json({ message: 'Reset link sent to your email' });
  } catch (err) {
    return res.status(500).json({ message: 'Could not send reset email', error: err.message });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = verifyToken(token, 'reset');
    const admin = await Admin.findById(decoded.adminId);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    admin.passwordHash = await bcrypt.hash(newPassword, 10);
    await admin.save();

    await sendAdminNotification(admin.email, 'Password Reset Successful', `Hello ${admin.name}, your password has been successfully reset.`);

    return res.json({ message: 'Password reset successful' });
  } catch (err) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
};

// Get Admin Profile
export const getAdminProfile = async (req, res) => {
  if (!req.admin) return res.status(404).json({ message: 'Admin not found' });

  return res.status(200).json({
    admin: {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
      designation: req.admin.designation,
      department: req.admin.department,
    },
  });
};

// Update Admin
export const updateAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedAdmin) return res.status(404).json({ message: 'Admin not found' });

    await sendAdminNotification(updatedAdmin.email, 'Admin Profile Updated', `Hello ${updatedAdmin.name}, your profile has been updated.`);

    return res.status(200).json({
      message: 'Admin updated successfully',
      admin: { id: updatedAdmin._id, name: updatedAdmin.name, email: updatedAdmin.email, role: updatedAdmin.role },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// Delete Admin
export const deleteAdmin = async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) return res.status(404).json({ message: 'Admin not found' });

    await sendAdminNotification(deletedAdmin.email, 'Admin Account Deleted', `Dear ${deletedAdmin.name}, your admin account has been removed.`);

    return res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};