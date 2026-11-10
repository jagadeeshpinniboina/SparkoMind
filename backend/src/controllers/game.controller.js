import Game from '../models/Game.js';
import Challenge from '../models/Challenge.js';
import { successResponse, errorResponse } from '../utils/helpers.js';

/**
 * Get all available games with demographic and category filtering
 * GET /api/v1/games
 */
export const getAllGames = async (req, res, next) => {
  try {
    const { demographic, category, search } = req.query;
    const filter = { active: true };

    if (demographic && ['kids', 'adults', 'seniors'].includes(demographic)) {
      filter.demographics = demographic;
    }

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const games = await Game.find(filter).sort({ title: 1 });

    return successResponse(res, {
      message: 'Games fetched successfully.',
      data: {
        games,
        total: games.length
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get game by slug with challenge level overview
 * GET /api/v1/games/:slug
 */
export const getGameBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const game = await Game.findOne({ slug, active: true });

    if (!game) {
      return errorResponse(res, {
        statusCode: 404,
        message: `Game with slug '${slug}' not found.`
      });
    }

    // Fetch challenge metadata (levels available, but NOT solution keys!)
    const challengesMeta = await Challenge.find({ gameId: game._id })
      .select('level difficulty demographicTarget prompt parTimeSeconds baseXp')
      .sort({ level: 1 });

    return successResponse(res, {
      data: {
        game,
        challenges: challengesMeta
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new game definition (Admin / Seeder)
 * POST /api/v1/games
 */
export const createGame = async (req, res, next) => {
  try {
    const game = await Game.create(req.body);
    return successResponse(res, {
      statusCode: 201,
      message: 'Game registered successfully.',
      data: { game }
    });
  } catch (error) {
    next(error);
  }
};
