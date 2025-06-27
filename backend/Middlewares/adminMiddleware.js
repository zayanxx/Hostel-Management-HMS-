// Middlewares/adminMiddleware.js
import { verifyToken } from '../Utils/token.js';
import Admin from '../Models/Admin.js';

export const adminAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or invalid' });
  }
  const token = authHeader.split(' ')[1];

  try {
    // verifyToken will throw if invalid or expired.
    const decoded = verifyToken(token, 'access');
    const admin = await Admin.findById(decoded.adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    req.admin = admin;
    next();
  } catch (err) {
    // Distinguish between TokenExpiredError and other errors.
    if (err.original && err.original.name === 'TokenExpiredError') {
      return res.status(401).json({ code: 'ACCESS_EXPIRED', message: 'Access token expired' });
    }
    return res.status(401).json({ message: err.message });
  }
};