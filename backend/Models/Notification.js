import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'recipientModel',
    required: true
  },
  recipientModel: {
    type: String,
    required: true,
    enum: ['Resident', 'Staff', 'Admin']
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'alert', 'reminder'],
    default: 'info'
  },
  channel: {
    type: String,
    enum: ['email', 'sms'],
    default: 'in-app'
  },
  status: {
    type: String,
    enum: ['sent', 'pending', 'failed'],
    default: 'pending'
  },
  sentAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema);