import Challenge from '../models/Challenge.js';
import Game from '../models/Game.js';
import Attempt from '../models/Attempt.js';
import UserProgress from '../models/UserProgress.js';
import { validateAttempt } from '../services/gameValidator.service.js';
import { calculateReward } from '../services/xpEngine.service.js';
import { successResponse, errorResponse } from '../utils/helpers.js';

/**
 * Fetch challenge layout for play (ZERO-TRUST: solutionKey strictly omitted)
 * GET /api/v1/challenges/:gameSlug/level/:level
 */
export const getChallengeForPlay = async (req, res, next) => {
  try {
    const { gameSlug, level } = req.params;
    const requestedDemographic = req.query.demographic || req.user?.demographic || 'adults';

    const game = await Game.findOne({ slug: gameSlug, active: true });
    if (!game) {
      return errorResponse(res, {
        statusCode: 404,
        message: `Game '${gameSlug}' not found.`
      });
    }

    // Attempt demographic-specific challenge first, then fallback to 'all'
    let challenge = await Challenge.findOne({
      gameId: game._id,
      level: Number(level),
      demographicTarget: requestedDemographic
    }).select('-solutionKey'); // Double assurance: never emit solutionKey

    if (!challenge) {
      challenge = await Challenge.findOne({
        gameId: game._id,
        level: Number(level)
      }).select('-solutionKey');
    }

    if (!challenge) {
      return errorResponse(res, {
        statusCode: 404,
        message: `No challenge found for game '${gameSlug}' at level ${level}.`
      });
    }

    return successResponse(res, {
      data: {
        game: {
          id: game._id,
          title: game.title,
          slug: game.slug,
          engine: game.engine,
          category: game.category,
          color: game.color,
          icon: game.icon
        },
        challenge
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit challenge attempt for Zero-Trust validation and XP reward computation
 * POST /api/v1/challenges/:id/attempt
 */
export const submitAttempt = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { submittedAnswer, timeTakenSeconds = 0 } = req.body;
    const userId = req.user._id;
    const demographic = req.user.demographic || 'adults';

    // Retrieve challenge WITH private solutionKey
    const challenge = await Challenge.findById(id).select('+solutionKey');
    if (!challenge) {
      return errorResponse(res, {
        statusCode: 404,
        message: 'Challenge not found.'
      });
    }

    const game = await Game.findById(challenge.gameId);
    if (!game) {
      return errorResponse(res, {
        statusCode: 404,
        message: 'Associated game definition not found.'
      });
    }

    // 1. Zero-Trust Server-Side Validation
    const validationResult = validateAttempt({
      engine: game.engine,
      validationRule: challenge.validationRule,
      submittedAnswer,
      solutionKey: challenge.solutionKey
    });

    // 2. Fetch User Progress
    let progress = await UserProgress.findOne({ userId });
    if (!progress) {
      progress = await UserProgress.create({
        userId,
        totalXp: 0,
        level: 1,
        currentStreak: 1
      });
    }

    // 3. Compute Adaptive Rewards
    const reward = calculateReward({
      baseXp: challenge.baseXp || 100,
      difficulty: challenge.difficulty || 'easy',
      isCorrect: validationResult.isCorrect,
      accuracyPercentage: validationResult.accuracyPercentage,
      timeTakenSeconds: Number(timeTakenSeconds),
      parTimeSeconds: challenge.parTimeSeconds || 30,
      demographic,
      currentStreak: progress.currentStreak || 1,
      currentTotalXp: progress.totalXp || 0
    });

    // 4. Record Attempt Log
    const attempt = await Attempt.create({
      userId,
      challengeId: challenge._id,
      gameId: game._id,
      submittedAnswer,
      isCorrect: validationResult.isCorrect,
      timeTakenSeconds: Number(timeTakenSeconds),
      parTimeSeconds: challenge.parTimeSeconds,
      xpEarned: reward.xpEarned,
      accuracyPercentage: validationResult.accuracyPercentage,
      demographicAtAttempt: demographic,
      feedback: validationResult.feedback
    });

    // 5. Update Cumulative Progress
    progress.totalXp = reward.newTotalXp;
    progress.level = reward.currentLevel;
    progress.gamesCompleted += 1;
    progress.lastActiveDate = new Date();

    // Update category-specific metrics
    const cat = game.category || 'logic';
    if (!progress.categoryStats[cat]) {
      progress.categoryStats[cat] = { xp: 0, gamesPlayed: 0, accuracyAvg: 100 };
    }
    const currentCat = progress.categoryStats[cat];
    currentCat.xp += reward.xpEarned;
    currentCat.gamesPlayed += 1;
    currentCat.accuracyAvg = Math.round(
      (currentCat.accuracyAvg * (currentCat.gamesPlayed - 1) + validationResult.accuracyPercentage) /
      currentCat.gamesPlayed
    );

    // Update highest level completed for this game
    if (validationResult.isCorrect) {
      const currentHighest = progress.completedGameLevels?.get(game._id.toString()) || 0;
      if (challenge.level > currentHighest) {
        if (!progress.completedGameLevels) progress.completedGameLevels = new Map();
        progress.completedGameLevels.set(game._id.toString(), challenge.level);
      }
    }

    await progress.save();

    return successResponse(res, {
      message: validationResult.isCorrect ? 'Challenge Solved!' : 'Attempt Recorded',
      data: {
        isCorrect: validationResult.isCorrect,
        accuracyPercentage: validationResult.accuracyPercentage,
        feedback: validationResult.feedback,
        xpEarned: reward.xpEarned,
        rewardBreakdown: reward.breakdown,
        totalXp: progress.totalXp,
        level: progress.level,
        leveledUp: reward.leveledUp,
        levelProgressPercent: reward.levelProgressPercent,
        attemptId: attempt._id
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user attempt history
 * GET /api/v1/challenges/history
 */
export const getAttemptHistory = async (req, res, next) => {
  try {
    const attempts = await Attempt.find({ userId: req.user._id })
      .populate('gameId', 'title slug category icon')
      .populate('challengeId', 'level difficulty')
      .sort({ createdAt: -1 })
      .limit(20);

    return successResponse(res, {
      data: { attempts }
    });
  } catch (error) {
    next(error);
  }
};
