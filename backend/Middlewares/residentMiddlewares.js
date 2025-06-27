// middlewares/residentMiddlewares.js
import mongoose from 'mongoose';

/**
 * Middleware to validate that the provided id in req.params is a valid MongoDB ObjectId.
 */
export const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid ID format' });
  }
  next();
};

/**
 * Async handler middleware to reduce repetitive try/catch blocks.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};