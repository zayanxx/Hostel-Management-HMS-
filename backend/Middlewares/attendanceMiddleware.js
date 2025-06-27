export const validateAttendanceInput = (req, res, next) => {
  const { staff, status } = req.body;

  if (!staff) return res.status(400).json({ message: 'Staff ID is required' });

  const validStatuses = ['present', 'absent', 'on_leave', 'holiday'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  next();
};
