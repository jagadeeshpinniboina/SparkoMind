/**
 * SparkoMind XP & Adaptive Cognitive Progression Engine
 * Calculates rewards strictly on the backend based on demographic, speed, accuracy, and streaks.
 */

/**
 * Calculate XP reward for an attempt.
 * @param {Object} params
 * @param {number} params.baseXp - The baseline XP defined in the challenge (e.g., 100)
 * @param {string} params.difficulty - 'easy' | 'medium' | 'hard'
 * @param {boolean} params.isCorrect - Whether the attempt was successful
 * @param {number} params.accuracyPercentage - Accuracy rate (0 - 100)
 * @param {number} params.timeTakenSeconds - Duration taken by player
 * @param {number} params.parTimeSeconds - Par time baseline
 * @param {string} params.demographic - 'kids' | 'adults' | 'seniors'
 * @param {number} params.currentStreak - Consecutive active days/games streak
 * @param {number} params.currentTotalXp - Player's current cumulative XP
 */
export const calculateReward = ({
  baseXp = 100,
  difficulty = 'easy',
  isCorrect = false,
  accuracyPercentage = 100,
  timeTakenSeconds = 20,
  parTimeSeconds = 30,
  demographic = 'adults',
  currentStreak = 1,
  currentTotalXp = 0
}) => {
  // If completely incorrect with 0 accuracy, award small consolation effort XP (10)
  if (!isCorrect && accuracyPercentage < 40) {
    const consolationXp = 10;
    const newTotalXp = currentTotalXp + consolationXp;
    const levelInfo = computeLevel(newTotalXp);
    return {
      xpEarned: consolationXp,
      breakdown: {
        base: consolationXp,
        difficultyBonus: 0,
        speedBonus: 0,
        demographicBonus: 0,
        streakBonus: 0
      },
      ...levelInfo,
      currentStreak
    };
  }

  // 1. Difficulty Multiplier
  const difficultyMultipliers = {
    easy: 1.0,
    medium: 1.4,
    hard: 2.0
  };
  const diffMultiplier = difficultyMultipliers[difficulty.toLowerCase()] || 1.0;
  const scaledBase = Math.round(baseXp * diffMultiplier);

  // 2. Accuracy Factor
  const accuracyFactor = Math.max(0.3, accuracyPercentage / 100);
  let earned = Math.round(scaledBase * accuracyFactor);

  // 3. Speed Bonus (No penalty for seniors; bonus for faster completion in adults/kids)
  let speedBonus = 0;
  if (isCorrect && timeTakenSeconds < parTimeSeconds) {
    const timeSavedRatio = Math.max(0, (parTimeSeconds - timeTakenSeconds) / parTimeSeconds);
    speedBonus = Math.round(earned * timeSavedRatio * 0.25); // up to 25% extra
  }

  // 4. Demographic-Specific Adaptation
  let demographicBonus = 0;
  if (demographic === 'kids') {
    // Kids: "Wonder Star" exploration incentive
    demographicBonus = Math.round(earned * 0.20);
  } else if (demographic === 'seniors') {
    // Seniors: "Vitality & Focus" consistency reward (never penalize speed)
    demographicBonus = Math.round(earned * 0.25);
  } else {
    // Adults: "Peak Efficiency" precision reward
    if (isCorrect && accuracyPercentage === 100) {
      demographicBonus = Math.round(earned * 0.15);
    }
  }

  // 5. Streak Multiplier
  const streakBonus = Math.min(Math.round(currentStreak * 5), 50);

  const totalAttemptXp = Math.max(15, earned + speedBonus + demographicBonus + streakBonus);
  const newTotalXp = currentTotalXp + totalAttemptXp;
  const levelInfo = computeLevel(newTotalXp, currentTotalXp);

  return {
    xpEarned: totalAttemptXp,
    breakdown: {
      base: earned,
      difficultyBonus: Math.round(scaledBase - baseXp),
      speedBonus,
      demographicBonus,
      streakBonus
    },
    ...levelInfo,
    currentStreak
  };
};

/**
 * Determine level and progress towards next level.
 * Level = floor(sqrt(TotalXP / 100)) + 1
 */
export const computeLevel = (newTotalXp, oldTotalXp = 0) => {
  const currentLevel = Math.max(1, Math.floor(Math.sqrt(newTotalXp / 100)) + 1);
  const oldLevel = Math.max(1, Math.floor(Math.sqrt(oldTotalXp / 100)) + 1);
  const leveledUp = currentLevel > oldLevel;

  // XP needed for current and next levels
  // XP = (Level - 1)^2 * 100
  const currentLevelBaseXp = Math.pow(currentLevel - 1, 2) * 100;
  const nextLevelTotalXp = Math.pow(currentLevel, 2) * 100;
  const xpNeededForNext = nextLevelTotalXp - currentLevelBaseXp;
  const xpIntoCurrentLevel = newTotalXp - currentLevelBaseXp;

  const levelProgressPercent = Math.min(
    100,
    Math.max(0, Math.round((xpIntoCurrentLevel / xpNeededForNext) * 100))
  );

  return {
    currentLevel,
    newTotalXp,
    nextLevelTotalXp,
    xpRemaining: Math.max(0, nextLevelTotalXp - newTotalXp),
    levelProgressPercent,
    leveledUp
  };
};

export default { calculateReward, computeLevel };
