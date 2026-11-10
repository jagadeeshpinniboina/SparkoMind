import { Router } from 'express';
import { getChallengeForPlay, submitAttempt, getAttemptHistory } from '../controllers/challenge.controller.js';
import { protect, optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Retrieve challenge for game and level (Zero-Trust: no solution key)
router.get('/:gameSlug/level/:level', optionalAuth, getChallengeForPlay);

// Submit challenge attempt for verification
router.post('/:id/attempt', protect, submitAttempt);

// Get player attempt history
router.get('/history', protect, getAttemptHistory);

export default router;
