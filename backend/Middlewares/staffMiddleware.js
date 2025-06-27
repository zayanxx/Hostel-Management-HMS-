// Middlewares/staffMiddleware.js
import { authenticateUser } from './authMiddleware.js';
import { adminAuth } from './adminMiddleware.js'; // imported for context/documentation; not used directly

/**
 * Middleware to check if the user has privileges to modify staff data.
 * Allow modification if the user:
 *   - Has been validated as an admin (req.admin exists),
 *   - OR has a role of 'staff' or 'admin' (from req.user payload).
 * Otherwise, return a 403 (forbidden) response.
 */
export const canModifyStaff = (req, res, next) => {
  // If the adminAuth middleware was called earlier and set req.admin, then allow.
  if (req.admin) return next();

  // Also allow if the authenticated user's role is 'staff' or 'admin'.
  if (req.user && (req.user.role === 'staff' || req.user.role === 'admin')) {
    return next();
  }

  return res.status(403).json({ message: 'Insufficient privileges' });
};

/**
 * Helper middleware chain for staff-related routes:
 *   1. authenticateUser - verifies the JWT and populates req.user.
 *   2. canModifyStaff   - ensures the user is allowed to perform modifications.
 */
export const staffAuthChain = [authenticateUser, canModifyStaff];