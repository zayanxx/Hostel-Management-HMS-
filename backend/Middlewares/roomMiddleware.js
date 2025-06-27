import Room from '../Models/Room.js';

export const checkRoomNotExist = async (req, res, next) => {
  try {
    const { roomNumber } = req.body;
    if (!roomNumber) {
      return res.status(400).json({ message: 'Room number is required' });
    }
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room number already exists' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};