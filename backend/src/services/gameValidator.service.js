/**
 * SparkoMind Zero-Trust Game Validator Service
 * Evaluates client attempt submissions strictly on the server against private solution keys.
 */

/**
 * Validate a game attempt submission.
 * @param {Object} params
 * @param {string} params.engine - The game engine type ('GridMatrixEngine', etc.)
 * @param {string} params.validationRule - The rule schema ('EXACT_ARRAY', 'SET_EQUAL', etc.)
 * @param {*} params.submittedAnswer - The answer payload submitted by the client
 * @param {*} params.solutionKey - The private solution key fetched securely from the database
 * @returns {{ isCorrect: boolean, accuracyPercentage: number, feedback: string }}
 */
export const validateAttempt = ({ engine, validationRule, submittedAnswer, solutionKey }) => {
  if (submittedAnswer === undefined || submittedAnswer === null) {
    return {
      isCorrect: false,
      accuracyPercentage: 0,
      feedback: 'No answer was submitted.'
    };
  }

  switch (engine) {
    case 'GridMatrixEngine':
      return validateGridMatrix(submittedAnswer, solutionKey, validationRule);

    case 'SequenceCodeEngine':
      return validateSequenceCode(submittedAnswer, solutionKey, validationRule);

    case 'CardMemoryEngine':
      return validateCardMemory(submittedAnswer, solutionKey, validationRule);

    case 'ChoiceLogicEngine':
      return validateChoiceLogic(submittedAnswer, solutionKey, validationRule);

    case 'SpatialPathEngine':
      return validateSpatialPath(submittedAnswer, solutionKey, validationRule);

    default:
      return fallbackValidation(submittedAnswer, solutionKey, validationRule);
  }
};

/**
 * Grid Matrix Validation (Tile coordinate sets or indices)
 */
function validateGridMatrix(submitted, solution, rule) {
  const targetTiles = Array.isArray(solution?.targetTiles) ? solution.targetTiles : (Array.isArray(solution) ? solution : []);
  const userTiles = Array.isArray(submitted?.tiles) ? submitted.tiles : (Array.isArray(submitted) ? submitted : []);

  if (targetTiles.length === 0) {
    return { isCorrect: true, accuracyPercentage: 100, feedback: 'Pattern verified.' };
  }

  // Normalize numbers or strings
  const targetSet = new Set(targetTiles.map(String));
  const userSet = new Set(userTiles.map(String));

  let correctCount = 0;
  for (const item of userSet) {
    if (targetSet.has(item)) correctCount++;
  }

  const falsePositives = userSet.size - correctCount;
  const accuracy = Math.max(0, Math.round(((correctCount - (falsePositives * 0.5)) / targetSet.size) * 100));

  const isExactMatch = targetSet.size === userSet.size && correctCount === targetSet.size;

  return {
    isCorrect: isExactMatch,
    accuracyPercentage: Math.min(100, accuracy),
    feedback: isExactMatch
      ? 'Outstanding! Every single tile matches the pattern!'
      : `You recalled ${correctCount} of ${targetSet.size} tiles correctly.`
  };
}

/**
 * Sequence Code Validation (Exact order matching)
 */
function validateSequenceCode(submitted, solution) {
  const expectedSequence = Array.isArray(solution?.sequence) ? solution.sequence : (Array.isArray(solution) ? solution : []);
  const userSequence = Array.isArray(submitted?.sequence) ? submitted.sequence : (Array.isArray(submitted) ? submitted : []);

  if (expectedSequence.length === 0) {
    return { isCorrect: true, accuracyPercentage: 100, feedback: 'Sequence verified.' };
  }

  let matchedSteps = 0;
  const minLen = Math.min(expectedSequence.length, userSequence.length);

  for (let i = 0; i < minLen; i++) {
    if (String(expectedSequence[i]).toLowerCase() === String(userSequence[i]).toLowerCase()) {
      matchedSteps++;
    }
  }

  const isCorrect = userSequence.length === expectedSequence.length && matchedSteps === expectedSequence.length;
  const accuracyPercentage = Math.round((matchedSteps / expectedSequence.length) * 100);

  return {
    isCorrect,
    accuracyPercentage,
    feedback: isCorrect
      ? 'Perfect sequence execution! Your working memory is razor-sharp.'
      : `You got ${matchedSteps} out of ${expectedSequence.length} steps in the correct order.`
  };
}

/**
 * Card Memory Validation
 */
function validateCardMemory(submitted, solution) {
  const requiredPairs = Number(solution?.totalPairs || (Array.isArray(solution?.pairs) ? solution.pairs.length : 6));
  const completedPairs = Number(submitted?.completedPairs || submitted?.matchedCount || 0);
  const mismatches = Number(submitted?.mismatches || 0);

  const isCorrect = completedPairs >= requiredPairs;
  const accuracyBase = Math.max(10, 100 - (mismatches * 5));
  const accuracyPercentage = isCorrect ? accuracyBase : Math.round((completedPairs / requiredPairs) * 100);

  return {
    isCorrect,
    accuracyPercentage,
    feedback: isCorrect
      ? 'Fantastic visual recall! All cards successfully paired.'
      : `Completed ${completedPairs} of ${requiredPairs} pairs.`
  };
}

/**
 * Choice Logic Validation
 */
function validateChoiceLogic(submitted, solution) {
  const targetOption = String(solution?.correctOptionId || solution?.answer || solution).trim().toLowerCase();
  const userOption = String(submitted?.selectedOptionId || submitted?.answer || submitted).trim().toLowerCase();

  const isCorrect = targetOption === userOption;

  return {
    isCorrect,
    accuracyPercentage: isCorrect ? 100 : 0,
    feedback: isCorrect
      ? 'Brilliant deduction! Your logical conclusion is completely accurate.'
      : 'That answer did not match the deductive evidence. Review the clues and try again!'
  };
}

/**
 * Spatial Path Validation
 */
function validateSpatialPath(submitted, solution) {
  const expectedPath = Array.isArray(solution?.path) ? solution.path : (Array.isArray(solution) ? solution : []);
  const userPath = Array.isArray(submitted?.path) ? submitted.path : (Array.isArray(submitted) ? submitted : []);

  if (expectedPath.length === 0) {
    return { isCorrect: true, accuracyPercentage: 100, feedback: 'Path reached destination.' };
  }

  // Check destination reached
  const lastTarget = JSON.stringify(expectedPath[expectedPath.length - 1]);
  const lastUser = JSON.stringify(userPath[userPath.length - 1]);
  const reachedDestination = lastTarget === lastUser;

  // Check intermediate checkpoints
  let validSteps = 0;
  for (let i = 0; i < Math.min(expectedPath.length, userPath.length); i++) {
    if (JSON.stringify(expectedPath[i]) === JSON.stringify(userPath[i])) {
      validSteps++;
    }
  }

  const isCorrect = reachedDestination && (validSteps / expectedPath.length >= 0.8);
  const accuracyPercentage = Math.round((validSteps / expectedPath.length) * 100);

  return {
    isCorrect,
    accuracyPercentage,
    feedback: isCorrect
      ? 'Path navigated successfully without obstacle violations!'
      : 'The path deviated from the optimal navigation constraints.'
  };
}

/**
 * Fallback Generic Equalizer
 */
function fallbackValidation(submitted, solution, rule) {
  if (rule === 'SET_EQUAL' && Array.isArray(submitted) && Array.isArray(solution)) {
    const s1 = new Set(submitted.map(String));
    const s2 = new Set(solution.map(String));
    const isCorrect = s1.size === s2.size && [...s1].every(x => s2.has(x));
    return { isCorrect, accuracyPercentage: isCorrect ? 100 : 0, feedback: isCorrect ? 'Valid solution.' : 'Mismatch.' };
  }

  const isCorrect = JSON.stringify(submitted) === JSON.stringify(solution);
  return {
    isCorrect,
    accuracyPercentage: isCorrect ? 100 : 0,
    feedback: isCorrect ? 'Solution validated successfully.' : 'Submitted answer is incorrect.'
  };
}

export default { validateAttempt };
