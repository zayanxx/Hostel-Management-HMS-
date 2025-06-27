import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['single', 'double', 'triple', 'suite', 'other'],
    default: 'single'
  },
  floor: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  occupants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resident'
  }],
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance', 'reserved'],
    default: 'available'
  },
  features: {
    type: [String], // e.g., ['AC', 'Attached Bathroom', 'Balcony']
    default: []
  },
  pricePerMonth: {
    type: Number,
    required: true,
    min: 0
  }
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);

export default Room;