// src/Models/Suggestion.js
import mongoose from 'mongoose'

const suggestionSchema = new mongoose.Schema(
  {
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resident',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    subject: {
      type: String,
      trim: true,
      maxlength: 200,
      default: '',
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ['new', 'under_review', 'implemented', 'rejected'],
      default: 'new',
    },
  },
  { timestamps: true }
)

// index by resident so we can efficiently query “my suggestions”
suggestionSchema.index({ resident: 1 })

export default mongoose.model('Suggestion', suggestionSchema)