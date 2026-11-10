import { Router } from 'express';
import { getAllGames, getGameBySlug, createGame } from '../controllers/game.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getAllGames);
router.get('/:slug', getGameBySlug);
router.post('/', protect, createGame);

export default router;
