import Room from "../Models/Room.js";
import Resident from "../Models/Residents.js";
import User from "../Models/User.js";

// Create a new Room
export const createRoom = async (req, res) => {
  try {
    const {
      roomNumber,
      type,
      floor,
      capacity,
      occupants,
      status,
      features,
      pricePerMonth,
    } = req.body;

    // At this point, checkRoomNotExist middleware has already verified uniqueness.
    const room = new Room({
      roomNumber,
      type,
      floor,
      capacity,
      occupants,      // Expect an array of Resident ObjectIds if provided
      status,
      features,
      pricePerMonth,
    });

    await room.save();
    // Mongoose auto-handles createdAt/updatedAt via schema options
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Room details
export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedRoom = await Room.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true, // Enforce schema validations on update
    });

    if (!updatedRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json(updatedRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Room record
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findByIdAndDelete(id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a Room by ID
export const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Rooms with optional filtering (e.g., by type, status, floor)
export const getAllRooms = async (req, res) => {
  try {
    const filters = {};

    // Example filters if query parameters are present
    if (req.query.type) {
      filters.type = req.query.type;
    }
    if (req.query.status) {
      filters.status = req.query.status;
    }
    if (req.query.floor) {
      filters.floor = Number(req.query.floor);
    }
    if (req.query.capacity) {
      filters.capacity = Number(req.query.capacity);
    }
    // Extend here with additional filters (e.g., price range) if needed

    const rooms = await Room.find(filters).sort({ roomNumber: 1 });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get My Room for a resident
export const getMyRoom = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Ensure user is a resident
    const user = await User.findById(userId);
    if (!user || user.role !== 'resident') {
      return res.status(403).json({ message: 'Access denied: only residents can view their room' });
    }

    // Find the corresponding resident document
    const resident = await Resident.findOne({ user: user._id });
    if (!resident) {
      return res.status(404).json({ message: 'Resident profile not found' });
    }

    // Ensure the resident has a room assigned
    if (!resident.room) {
      return res.status(404).json({ message: 'No room assigned to this resident' });
    }

    // Populate and return the room
    const room = await Room.findById(resident.room);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    return res.status(200).json(room);
  } catch (err) {
    console.error('Get My Room error:', err.message);
    return res.status(500).json({ message: 'Failed to fetch room', error: err.message });
  }
};


// get available rooms
export const getAvailableRooms = async (req, res) => {
  try {
    // Find all rooms that are not occupied
    const availableRooms = await Room.find({ status: 'available' }).sort({ roomNumber: 1 });
    
    if (availableRooms.length === 0) {
      return res.status(404).json({ message: 'No available rooms found' });
    }
    
    res.status(200).json(availableRooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Allacate a room to a resident
export const allocateRoom = async (req, res) => {
  try {
    const { residentId, roomId } = req.body;

    // Validate inputs
    if (!residentId || !roomId) {
      return res.status(400).json({ message: 'Resident ID and Room ID are required' });
    }

    // Find the resident
    const resident = await Resident.findById(residentId);
    if (!resident) {
      return res.status(404).json({ message: 'Resident not found' });
    }

    // Find the room
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if the room is already occupied
    if (room.status !== 'available') {
      return res.status(400).json({ message: 'Room is not available for allocation' });
    }

    // Update the resident's room and the room's status
    resident.room = room._id;
    room.status = 'occupied';

    await resident.save();
    await room.save();

    res.status(200).json({ message: 'Room allocated successfully', resident, room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}