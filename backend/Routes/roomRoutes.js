import express from 'express';
import {
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomById,
  getAllRooms,
  getMyRoom,
  getAvailableRooms,
  allocateRoom
} from '../Controllers/roomController.js';
import { validateRoom } from '../Validation/roomValidation.js';
import { checkRoomNotExist } from '../Middlewares/roomMiddleware.js';
import {authMiddleware} from '../Middlewares/authMiddleware.js';

const router = express.Router();

// POST /api/rooms - Create a new room (check for unique room number first)
router.post('/', checkRoomNotExist, validateRoom, createRoom);

// PUT /api/rooms/:id - Update an existing room, with validation
router.put('/:id', validateRoom, updateRoom);

// DELETE /api/rooms/:id - Delete a room record
router.delete('/:id', deleteRoom);

// GET /api/rooms/myroom - Get the room assigned to the currently logged-in resident
router.get('/myroom', authMiddleware, getMyRoom);

// GET /api/rooms/:id - Get a room by its ID
router.get('/:id', getRoomById);

// GET /api/rooms - Retrieve all rooms with optional filtering (e.g., by type, status)
router.get('/', getAllRooms);

// GET /api/rooms/available - Get all available rooms (optionally filter by type, capacity)
router.get('/available', getAvailableRooms);

// POST /api/rooms/allocate - Allocate a room to a resident (requires resident ID and room ID)
router.post('/allocate', allocateRoom);

export default router;