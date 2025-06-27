import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // basic email validation
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['staff', 'resident', 'user'],  // admin removed
      default: 'user'
    },
  }, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;