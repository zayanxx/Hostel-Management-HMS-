import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true,
  },
  staffName: {
    type: String,
    required: true,
    trim: true,
  },
  staffEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  staffRole: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
    default: () => new Date().setHours(0, 0, 0, 0),
  },
  checkInTime: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
  checkOutTime: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'on_leave', 'holiday'],
    default: 'present',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

attendanceSchema.index({ staff: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model('Attendance', attendanceSchema);
