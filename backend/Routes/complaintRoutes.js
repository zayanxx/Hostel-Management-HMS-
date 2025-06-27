import express from 'express';
import {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  getMyComplaints
} from '../Controllers/complaintController.js';
import { validateComplaint } from '../Validation/complaintValidation.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';

const router = express.Router();

// Create a complaint
router.post('/', validateComplaint, createComplaint);

// Get all complaints (optionally filter by status, priority, or room)
router.get('/', getAllComplaints);

// Get complaints for the currently logged-in resident
router.get('/my-complaints', authMiddleware, getMyComplaints);

// Get a complaint by ID
router.get('/:id', getComplaintById);

// Update a complaint (for staff/admin)
router.put('/:id', updateComplaint);

// Delete a complaint
router.delete('/:id', deleteComplaint);


export default router;