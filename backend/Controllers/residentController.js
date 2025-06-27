// controllers/residentController.js
import Resident from "../Models/Residents.js";

/**
 * Create a new resident.
 * Expects request body to contain:
 * - user (ObjectId, required)
 * - room (ObjectId, optional)
 * - contactNumber (String, required)
 * - emergencyContact (Object: { name: String, phone: String }, optional)
 * - checkInDate (Date, optional)
 * - checkOutDate (Date, optional)
 * - status ('checked-in' or 'checked-out', optional)
 */
export const createResident = async (req, res) => {
  const resident = new Resident(req.body);
  const savedResident = await resident.save();
  res.status(201).json({ success: true, data: savedResident });
};

/**
 * Retrieve all residents.
 * Populates associated user and room details.
 */
export const getResidents = async (req, res) => {
  const residents = await Resident.find().populate(['user', 'room']);
  res.status(200).json({ success: true, data: residents });
};

/**
 * Retrieve a single resident by ID.
 */
export const getResidentById = async (req, res) => {
  const resident = await Resident.findById(req.params.id).populate(['user', 'room']);
  if (!resident) {
    return res.status(404).json({ success: false, message: 'Resident not found' });
  }
  res.status(200).json({ success: true, data: resident });
};

/**
 * Update a resident by ID.
 * Expects request body to contain fields for update.
 */
export const updateResident = async (req, res) => {
  const resident = await Resident.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!resident) {
    return res.status(404).json({ success: false, message: 'Resident not found' });
  }
  res.status(200).json({ success: true, data: resident });
};

/**
 * Delete a resident by ID.
 */
export const deleteResident = async (req, res) => {
  const resident = await Resident.findByIdAndDelete(req.params.id);
  if (!resident) {
    return res.status(404).json({ success: false, message: 'Resident not found' });
  }
  res.status(200).json({ success: true, message: 'Resident deleted successfully' });
};