import express from 'express';
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getMyBookings
} from '../Controllers/bookingController.js';
import { validateBooking } from '../Validation/bookingValidation.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';

const router = express.Router();

// Create a booking (resident auto-assigned)
router.post('/', validateBooking, createBooking);

// Get all bookings (filter by status, paymentStatus, or room)
router.get('/', getAllBookings);

// get my bookings
router.get('/my-bookings', authMiddleware, getMyBookings);

// Get a booking by ID
router.get('/:id', getBookingById);

// Update a booking (for admins)
router.put('/:id', updateBooking);

// Delete a booking
router.delete('/:id', deleteBooking);



export default router;