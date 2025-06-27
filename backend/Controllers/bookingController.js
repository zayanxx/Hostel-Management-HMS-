import Booking from '../Models/Booking.js';
import Room from '../Models/Booking.js';
import User from '../Models/User.js';
import Resident from '../Models/Residents.js';

// Create a new booking (resident auto-assigned)
export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, notes } = req.body;

    // Ensure user is authenticated before assigning resident
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if the room exists
    const roomExists = await Room.findById(room);
    if (!roomExists) return res.status(404).json({ message: 'Room not found' });

    const booking = new Booking({
      resident: req.user._id, // Automatically save authenticated resident
      room,
      bookedBy: req.user._id,
      checkInDate,
      checkOutDate,
      status: 'pending', // Default status
      paymentStatus: 'pending', // Default payment status
      notes,
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings (optionally filter by status, paymentStatus, or room)
export const getAllBookings = async (req, res) => {
  try {
    const { status, paymentStatus, room } = req.query;
    const filters = {};

    if (status) filters.status = status;
    if (paymentStatus) filters.paymentStatus = paymentStatus;
    if (room) filters.room = room;

    const bookings = await Booking.find(filters).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a booking (e.g., admin updates status)
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedBooking) return res.status(404).json({ message: 'Booking not found' });

    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a booking
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) return res.status(404).json({ message: 'Booking not found' });

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get my bookings (for residents) 
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Get the authenticated user
    const user = await User.findById(userId);
    if (!user || user.role !== 'resident') {
      return res.status(403).json({ message: 'Access denied: only residents can view bookings' });
    }

    // Find the resident profile using userId
    const resident = await Resident.findOne({ user: user._id });
    if (!resident) {
      return res.status(404).json({ message: 'Resident profile not found' });
    }

    // Fetch bookings related to the resident
    const bookings = await Booking.find({ resident: resident._id }).sort({ createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (err) {
    console.error('Get My Bookings error:', err.message);
    return res.status(500).json({ message: 'Failed to fetch bookings', error: err.message });
  }
};