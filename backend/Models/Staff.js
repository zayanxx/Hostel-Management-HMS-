// Models/Staff.js
import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      enum: ['HR', 'maintenance', 'reception', 'security', 'cleaning', 'other'],
      default: 'other',
    },
    shift: {
      type: String,
      enum: ['morning', 'evening', 'night', 'rotational'],
      default: 'rotational',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    joinedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Staff = mongoose.model('Staff', staffSchema);