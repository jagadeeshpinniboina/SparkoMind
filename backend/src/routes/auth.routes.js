import { Router } from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  logout,
  getMe,
  updatePreferences,
  sendOtp,
  sendEmailOtp,
  verifyOtp,
  forgotPassword,
  resetPassword
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// Validation chains
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('A valid email address is required.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  body('age').isInt({ min: 4, max: 120 }).withMessage('Age must be between 4 and 120.')
];

const loginValidation = [
  body('email').isEmail().withMessage('A valid email address is required.'),
  body('password').notEmpty().withMessage('Password is required.')
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', logout);
router.post('/send-otp', sendOtp);
router.post('/send-email-otp', sendEmailOtp);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);
router.put('/preferences', protect, updatePreferences);

export default router;
