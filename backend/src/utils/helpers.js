/**
 * Utility helper functions for SparkoMind backend.
 */

/**
 * Automatically determine demographic tier based on chronological age.
 * @param {number} age
 * @returns {'kids' | 'adults' | 'seniors'}
 */
export const getDemographicFromAge = (age) => {
  const numericAge = Number(age);
  if (isNaN(numericAge) || numericAge <= 0) {
    return 'adults';
  }
  if (numericAge <= 12) {
    return 'kids';
  }
  if (numericAge <= 59) {
    return 'adults';
  }
  return 'seniors';
};

/**
 * Standard HTTP success response envelope.
 */
export const successResponse = (res, { data = null, message = 'Success', statusCode = 200, meta = {} } = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
    timestamp: new Date().toISOString()
  });
};

/**
 * Standard HTTP error response envelope.
 */
export const errorResponse = (res, { message = 'Internal Server Error', statusCode = 500, errors = null } = {}) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  });
};

/**
 * Standard Cookie Configuration for JWT token transmission.
 */
export const getAuthCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
  };
};

/**
 * Wrapper for async express route controllers to avoid repetitive try-catch blocks.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
