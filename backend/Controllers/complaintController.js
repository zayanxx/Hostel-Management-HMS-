import Complaint from '../Models/Complaint.js';
import User from '../Models/User.js';
import Resident from '../Models/Residents.js';

// Create a new complaint
export const createComplaint = async (req, res) => {
  try {
    const { resident, room, subject, description, priority } = req.body;

    const complaint = new Complaint({
      resident,
      room,
      subject,
      description,
      priority,
      status: 'open'
    });

    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all complaints (optionally filter by status, priority, or room)
export const getAllComplaints = async (req, res) => {
  try {
    const { status, priority, room } = req.query;
    const filters = {};

    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (room) filters.room = room;

    const complaints = await Complaint.find(filters).sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a complaint by ID
export const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findById(id);

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a complaint (e.g., admin assigns staff or changes status)
export const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedComplaint = await Complaint.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedComplaint) return res.status(404).json({ message: 'Complaint not found' });

    res.status(200).json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a complaint
export const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedComplaint = await Complaint.findByIdAndDelete(id);

    if (!deletedComplaint) return res.status(404).json({ message: 'Complaint not found' });

    res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET: My Complaints (for residents)
export const getMyComplaints = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== 'resident') {
      return res.status(403).json({ message: 'Access denied: only residents can view complaints' });
    }

    const resident = await Resident.findOne({ user: user._id });
    if (!resident) {
      return res.status(404).json({ message: 'Resident profile not found' });
    }

    const complaints = await Complaint.find({ resident: resident._id }).sort({ createdAt: -1 });

    return res.status(200).json(complaints);
  } catch (err) {
    console.error('Get My Complaints error:', err.message);
    return res.status(500).json({ message: 'Failed to fetch complaints', error: err.message });
  }
};