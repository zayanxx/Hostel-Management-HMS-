import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resident',
    required: false  // Can be null if maintenance is requested by staff/admin
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  issueTitle: {
    type: String,
    required: true,
    trim: true
  },
  issueDescription: {
    type: String,
    required: true,
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['submitted', 'assigned', 'in_progress', 'completed', 'cancelled'],
    default: 'submitted'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  },
  resolvedAt: {
    type: Date
  },
  comments: {
    type: String,
    trim: true,
    default: ''
  }
}, { timestamps: true });

maintenanceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export const Maintenance = mongoose.model('Maintenance', maintenanceSchema);