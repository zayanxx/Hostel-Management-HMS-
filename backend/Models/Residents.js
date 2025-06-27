import mongoose from 'mongoose';

const residentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: false
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true
  },
  emergencyContact: {
    name: {
      type: String,
      trim: true,
      default: ''
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    }
  },
  checkInDate: {
    type: Date,
    default: Date.now
  },
  checkOutDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['checked-in', 'checked-out'],
    default: 'checked-in'
  }
}, { timestamps: true });

const Resident = mongoose.model('Resident', residentSchema);

export default Resident;
