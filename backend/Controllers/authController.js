import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';

import User from '../Models/User.js';
import Resident from '../Models/Residents.js';
import Room from '../Models/Room.js';
import { Staff } from '../Models/Staff.js';
import { sendEmail } from '../Utils/sendEmail.js';
import { generateToken, verifyToken } from '../Utils/token.js';

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5004';

// Utility: Send registration email
const sendRegistrationEmail = async (email, name) => {
  try {
    await sendEmail({
      to: email,
      subject: 'Registration Successful',
      html: `<p>Welcome ${name}, thank you for registering with our system.</p>`,
    });
  } catch (err) {
    console.error('Error sending registration email:', err.message);
  }
};

// REGISTER
export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const {
      name,
      email,
      password,
      role,
      room,
      contactNumber,
      emergencyContact,
      department,
      shift,
    } = req.body;

    if (!['resident', 'staff'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role provided' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, passwordHash, role });
    const savedUser = await newUser.save();

    if (role === 'resident') {
      if (!emergencyContact?.name || !emergencyContact?.phone) {
        return res.status(400).json({ message: 'Incomplete emergency contact' });
      }

      await new Resident({
        user: savedUser._id,
        name,
        email,
        room: room ? await Room.findById(room) : null,
        contactNumber,
        emergencyContact,
      }).save();
    } else if (role === 'staff') {
      if (!department || !shift) {
        return res.status(400).json({ message: 'Department and shift are required for staff' });
      }

      await new Staff({
        user: savedUser._id,
        name,
        email,
        contact: contactNumber,
        department,
        shift,
      }).save();
    }

    await sendRegistrationEmail(email, name);
    return res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error('Registration error:', err.message);
    return res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ userId: user._id, role: user.role }, 'access');
    return res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'User not found' });

    const token = generateToken({ userId: user._id }, 'reset');
    const resetUrl = `${CLIENT_URL}/reset-password/${token}`;

    await sendEmail({
      to: user.email,
      subject: 'Password Reset',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });

    return res.status(200).json({ message: 'Reset link sent' });
  } catch (err) {
    console.error('Forgot Password error:', err.message);
    return res.status(500).json({ message: 'Error sending reset email', error: err.message });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = verifyToken(token, 'reset');
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    await sendEmail({
      to: user.email,
      subject: 'Password Reset Confirmation',
      html: `<p>Your password has been successfully reset.</p>`,
    });

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset Password error:', err.message);
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
};

// GET USER PROFILE
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId).select('-passwordHash -__v');
    if (!user) return res.status(404).json({ message: 'User not found' });

    let profile = {};
    if (user.role === 'resident') {
      profile = await Resident.findOne({ user: userId }).lean() || {};
    } else if (user.role === 'staff') {
      profile = await Staff.findOne({ user: userId }).lean() || {};
    }

    return res.status(200).json({ user, profile });
  } catch (err) {
    console.error('Get Profile error:', err.message);
    return res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};

// UPDATE USER PROFILE
export const updateUserProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { name, email, contactNumber, emergencyContact, department, shift } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists && exists._id.toString() !== userId.toString()) {
        return res.status(409).json({ message: 'Email already in use' });
      }
      user.email = email;
    }
    await user.save();

    let updatedProfile = null;
    if (user.role === 'resident') {
      updatedProfile = await Resident.findOneAndUpdate(
        { user: userId },
        { contactNumber, emergencyContact },
        { new: true }
      );
    } else if (user.role === 'staff') {
      updatedProfile = await Staff.findOneAndUpdate(
        { user: userId },
        { contact: contactNumber, department, shift },
        { new: true }
      );
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      profile: updatedProfile,
    });
  } catch (err) {
    console.error('Update Profile error:', err.message);
    return res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};

// LOGOUT
export const logout = (req, res) => {
  try {
    // Frontend should just remove the token
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err.message);
    return res.status(500).json({ message: 'Logout failed', error: err.message });
  }
};

// get me
export const getMe = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId).select('-passwordHash -__v');
    if (!user) return res.status(404).json({ message: 'User not found' });
    let profile = {};
    if (user.role === 'resident') {
      profile = await Resident.findById(user._id).select('-__v');
    }
    else if (user.role === 'staff') {
      profile = await Staff.findById(user._id).select('-__v');
    }
    return res.status(200).json({ user, profile });
  } catch (err) {
    console.error('Get Me error:', err.message);
    return res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
};