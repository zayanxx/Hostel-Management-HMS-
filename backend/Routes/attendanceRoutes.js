import express from 'express';
import {
  createAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceByStaff,
  getAttendanceByDateRange,
  getAllAttendance,
  getMyAttendance
} from '../Controllers/attendanceController.js';

import { validateAttendanceInput } from '../Middlewares/attendanceMiddleware.js';

const router = express.Router();

router.post('/', validateAttendanceInput, createAttendance);
router.put('/:id', validateAttendanceInput, updateAttendance);
router.delete('/:id', deleteAttendance);
router.get('/staff/:staffId', getAttendanceByStaff);
router.get('/', getAllAttendance);
router.get('/date-range', getAttendanceByDateRange);
router.get('/my-attendance', getMyAttendance);

export default router;