import { Maintenance } from '../Models/Maintenance.js';
import Room from '../Models/Room.js';
import User from '../Models/User.js';
import Resident from '../Models/Residents.js';

// Create a new maintenance request
export const createMaintenance = async (req, res) => {
  try {
    const { room, issueTitle, issueDescription, priority } = req.body;

    // Optionally assign resident from the authenticated user (if the requester is a resident)
    const residentId = req.user && req.user.role === 'resident' ? req.user._id : null;

    // Ensure the room exists
    const roomExists = await Room.findById(room);
    if (!roomExists) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const maintenance = new Maintenance({
      resident: residentId, // May be null for staff/admin requests
      room,
      issueTitle,
      issueDescription,
      priority, // If not provided, defaults to "medium" in the schema
      status: 'submitted', // Default value per schema
    });

    await maintenance.save();
    res.status(201).json(maintenance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all maintenance records with optional filtering (status, priority, room)
export const getAllMaintenance = async (req, res) => {
  try {
    const { status, priority, room } = req.query;
    const filters = {};

    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (room) filters.room = room;

    const maintenances = await Maintenance.find(filters).sort({ createdAt: -1 });
    res.status(200).json(maintenances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retrieve a maintenance record by its ID
export const getMaintenanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const maintenance = await Maintenance.findById(id);

    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }
    res.status(200).json(maintenance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a maintenance request (for example, to assign a staff member or update status)
export const updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedMaintenance = await Maintenance.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedMaintenance) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }
    res.status(200).json(updatedMaintenance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a maintenance record
export const deleteMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMaintenance = await Maintenance.findByIdAndDelete(id);

    if (!deletedMaintenance) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }
    res.status(200).json({ message: 'Maintenance request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET: My Maintenance Requests (for residents)
export const getMyMaintenanceRequests = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== 'resident') {
      return res.status(403).json({ message: 'Access denied: only residents can view maintenance requests' });
    }

    const resident = await Resident.findOne({ user: user._id });
    if (!resident) {
      return res.status(404).json({ message: 'Resident profile not found' });
    }

    const requests = await Maintenance.find({ resident: resident._id }).sort({ createdAt: -1 });

    return res.status(200).json(requests);
  } catch (err) {
    console.error('Get My Maintenance Requests error:', err.message);
    return res.status(500).json({ message: 'Failed to fetch maintenance requests', error: err.message });
  }
};