import mongoose from "mongoose";

const BillingSchema = new mongoose.Schema({
    resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resident',
    required: true,
    index: true
  },
  billingPeriodStart: {
    type: Date,
    required: true
  },
  billingPeriodEnd: {
    type: Date,
    required: true
  },
  roomFee: {
    type: Number,
    required: true,
    min: 0
  },
  utilitiesFee: {
    type: Number,
    default: 0,
    min: 0
  },
  additionalServicesFee: {
    type: Number,
    default: 0,
    min: 0
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  lateFee: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue', 'cancelled'],
    default: 'pending'
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  paidAt: {
    type: Date
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  }
}, { timestamps: true });

export default mongoose.model('Billing', BillingSchema);