import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect routes: requires valid JWT in cookie or Authorization header.
 */
export const protect = async (req, res, next) => {
  try {
    let token = null;

    // Check cookie first (HTTP-only)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please authenticate to access this resource.'
      });
    }

    const secret = process.env.JWT_SECRET || 'supersecretjwtkey_sparkomind_production_grade_token_2026';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this session no longer exists.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional authentication: populates req.user if valid token exists, but doesn't block if missing.
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const secret = process.env.JWT_SECRET || 'supersecretjwtkey_sparkomind_production_grade_token_2026';
      const decoded = jwt.verify(token, secret);
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      }
    }

    next();
  } catch {
    // If token invalid, proceed anonymously
    next();
  }
};

export default { protect, optionalAuth };
