import express from 'express';
import {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
  getMyMaintenanceRequests
} from '../Controllers/maintenanceController.js';
import { validateMaintenance } from '../Validation/maintenanceValidation.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';

const router = express.Router();

// POST /api/maintenances - Create a new maintenance request
router.post('/', validateMaintenance, createMaintenance);

// GET /api/maintenances - Retrieve all maintenance records (with optional filters)
router.get('/', getAllMaintenance);

// GET /api/maintenances/my-requests - Get maintenance requests for the currently logged-in resident
router.get('/my-requests', authMiddleware, getMyMaintenanceRequests);

// GET /api/maintenances/:id - Retrieve a maintenance request by ID
router.get('/:id', getMaintenanceById);

// PUT /api/maintenances/:id - Update an existing maintenance request
router.put('/:id', updateMaintenance);

// DELETE /api/maintenances/:id - Delete a maintenance request
router.delete('/:id', deleteMaintenance);



export default router;