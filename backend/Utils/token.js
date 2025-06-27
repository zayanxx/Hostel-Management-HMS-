// Utils/token.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const TOKEN_EXPIRY = {
  access: '50m',
  refresh: '7d',
  reset: '50m',
  default: '2h',
};

const getSecret = (type = 'default') => {
  switch (type) {
    case 'access':
      return process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
    case 'refresh':
      return process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    case 'reset':
      return process.env.RESET_TOKEN_SECRET || process.env.JWT_SECRET;
    default:
      return process.env.JWT_SECRET;
  }
};

/**
 * Generate a signed JWT.
 * @param {Object} payload - Payload for the token.
 * @param {String} type - Type of token. ('access', 'refresh', 'reset')
 * @param {String} [customExpiry] - Optional custom expiration time.
 * @returns {String} - Signed JWT.
 */
export const generateToken = (payload, type = 'default', customExpiry = '') => {
  const secret = getSecret(type);
  const expiresIn = customExpiry || TOKEN_EXPIRY[type] || TOKEN_EXPIRY.default;
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verify a given token.
 * @param {String} token - JWT token.
 * @param {String} type - Type of token, defaults to 'default'.
 * @returns {Object} - Decoded token payload.
 */
export const verifyToken = (token, type = 'default') => {
  const secret = getSecret(type);
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    // Wrap error with a generic message while preserving the original error.
    const error = new Error('Invalid or expired token');
    error.original = err;
    throw error;
  }
};

/**
 * Decode token without verification.
 * @param {String} token - JWT token.
 * @returns {Object|null} - The decoded payload, or null if invalid.
 */
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch {
    return null;
  }
};