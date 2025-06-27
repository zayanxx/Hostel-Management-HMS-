// Middlewares/authMiddleware.js
import { verifyToken } from '../Utils/token.js';

export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  // Remove "Bearer" prefix if present.
  const token = authHeader.replace(/^Bearer\s+/, '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Use our helper to verify the token.
    const decoded = verifyToken(token, 'access');
    // Expect the payload to include userId and role.
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (err) {
    if (err.original && err.original.name === 'TokenExpiredError') {
      return res.status(401).json({ code: 'ACCESS_EXPIRED', message: 'Access token expired' });
    }
    return res.status(401).json({ message: err.message });
  }
};

export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied: insufficient privileges' });
  }
  next();
};

// authMiddleware
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  // Remove "Bearer" prefix if present.
  const token = authHeader.replace(/^Bearer\s+/, '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Use our helper to verify the token.
    const decoded = verifyToken(token, 'access');
    // Expect the payload to include userId and role.
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (err) {
    if (err.original && err.original.name === 'TokenExpiredError') {
      return res.status(401).json({ code: 'ACCESS_EXPIRED', message: 'Access token expired' });
    }
    return res.status(401).json({ message: err.message });
  }
}