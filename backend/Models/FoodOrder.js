import mongoose from 'mongoose';

const foodOrderSchema = new mongoose.Schema(
  {
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resident',
      required: true,
    },
    items: [
      {
        food: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Food',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        unitPrice: {
          type: Number,
          required: true,
          min: 0,
        },
        totalPrice: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'failed'],
      default: 'unpaid',
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    orderedAt: {
      type: Date,
      default: Date.now,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Optional: Auto-calculate totalAmount and totalPrice before saving
foodOrderSchema.pre('validate', function (next) {
  this.totalAmount = this.items.reduce((sum, item) => {
    item.totalPrice = item.quantity * item.unitPrice;
    return sum + item.totalPrice;
  }, 0);
  next();
});

export const FoodOrder = mongoose.model('FoodOrder', foodOrderSchema);