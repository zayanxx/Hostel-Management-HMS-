import { Attendance } from '../Models/Attendance.js';
import { Staff } from '../Models/Staff.js';

// ─── Create Attendance ───────────────────────────────────────────────
export const createAttendance = async (req, res) => {
  try {
    const { staff, status, staffName, staffEmail, staffRole } = req.body;

    // 1️⃣ Validate staff exists
    const staffDoc = await Staff.findById(staff);
    if (!staffDoc) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    // 2️⃣ Enforce one record per day
    const today = new Date().setHours(0,0,0,0);
    const exists = await Attendance.findOne({ staff, date: today });
    if (exists) {
      return res
        .status(400)
        .json({ message: 'Attendance for today already exists' });
    }

    // 3️⃣ Create & save
    const record = new Attendance({
      staff,
      staffName,
      staffEmail,
      staffRole,
      date:       today,
      checkInTime:new Date(),
      status
    });
    await record.save();
    return res.status(201).json(record);
  } catch (err) {
    console.error('createAttendance error:', err);
    return res.status(500).json({ message: err.message });
  }
};

// ─── Get My Attendance ─────────────────────────────────────────────
export const getAttendanceByStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const records = await Attendance
      .find({ staff: staffId })
      .sort({ date: -1 });
    return res.status(200).json(records);
  } catch (err) {
    console.error('getAttendanceByStaff error:', err);
    return res.status(500).json({ message: err.message });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { checkInTime, checkOutTime, status } = req.body;

    const attendance = await Attendance.findById(id);
    if (!attendance)
      return res.status(404).json({ message: 'Attendance record not found' });

    if (checkInTime && checkOutTime && new Date(checkInTime) > new Date(checkOutTime)) {
      return res.status(400).json({ message: 'Check-in cannot be later than check-out' });
    }

    if (checkInTime) attendance.checkInTime = checkInTime;
    if (checkOutTime) attendance.checkOutTime = checkOutTime;
    if (status) attendance.status = status;

    await attendance.save();
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await Attendance.findByIdAndDelete(id);

    if (!attendance)
      return res.status(404).json({ message: 'Attendance record not found' });

    res.status(200).json({ message: 'Attendance deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttendanceByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const records = await Attendance.find({
      date: {
        $gte: new Date(startDate).setHours(0, 0, 0, 0),
        $lte: new Date(endDate).setHours(23, 59, 59, 999),
      },
    }).sort({ date: -1 });

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get  all attendance records
export const getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find().sort({ date: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get my attendance records (for staff)
export const getMyAttendance = async (req, res) => {
  try {
    const { staffId } = req.params;
    const records = await Attendance.find({ staff: staffId }).sort({ date: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}