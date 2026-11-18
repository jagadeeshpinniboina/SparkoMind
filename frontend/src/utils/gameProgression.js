import { useState, useEffect, useCallback } from 'react';

// Single standardized localStorage key format: sparkomind_unlocked_<gameId>
const STORAGE_PREFIX = 'sparkomind_unlocked_';
export const PROGRESS_UPDATE_EVENT = 'sparkomind-progress-updated';

export const ALL_GAME_IDS = [
  // Kids Zone (4)
  'bot-script',
  'circuit-connect',
  'gravity-sling',
  'color-lab',
  // Adults Zone (4)
  'neuro-matrix',
  'chrono-reflex',
  'neon-sudoku',
  'crown-grid',
  // Seniors Zone (4)
  'heritage-match',
  'golden-zip',
  'quilt-patches',
  'timber-unbolt'
];

/**
 * Map aliases (e.g. non-hyphenated or alternate IDs) to canonical game IDs
 */
export const getCanonicalGameId = (rawId) => {
  if (!rawId) return 'bot-script';
  const id = String(rawId).toLowerCase().trim();

  switch (id) {
    case 'botscript':
    case 'bot-script':
      return 'bot-script';
    case 'circuitconnect':
    case 'circuit-connect':
      return 'circuit-connect';
    case 'gravitysling':
    case 'gravity-sling':
      return 'gravity-sling';
    case 'colorlab':
    case 'color-lab':
      return 'color-lab';
    case 'neuromatrix':
    case 'neuro-matrix':
      return 'neuro-matrix';
    case 'chronoreflex':
    case 'chrono-reflex':
      return 'chrono-reflex';
    case 'neonsudoku':
    case 'neon-sudoku':
      return 'neon-sudoku';
    case 'crowngrid':
    case 'crown-grid':
      return 'crown-grid';
    case 'heritagematch':
    case 'heritage-match':
    case 'memory-garden':
    case 'memorygarden':
      return 'heritage-match';
    case 'goldenzip':
    case 'golden-zip':
    case 'zip':
      return 'golden-zip';
    case 'quiltpatches':
    case 'quilt-patches':
    case 'patches':
      return 'quilt-patches';
    case 'timberunbolt':
    case 'timber-unbolt':
    case 'unbolt':
    case 'wood-nuts':
    case 'screw-puzzle':
      return 'timber-unbolt';
    default:
      return id;
  }
};

/**
 * Migration helper: Purge legacy / stale keys so games strictly default to L1 unlocked
 */
export const cleanLegacyStorage = () => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (
        k &&
        (k.startsWith('sparkomind_progress_') ||
          k.includes('botscript_unlocked') ||
          k.includes('circuit_unlocked'))
      ) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    console.warn('Failed to clean legacy game progression storage:', e);
  }
};

// Run migration cleanup immediately on bundle load
cleanLegacyStorage();

/**
 * Read highest unlocked level for a game (1-5). Strictly defaults to 1.
 * @param {string} gameId
 * @returns {number}
 */
export const getUnlockedLevel = (gameId) => {
  if (typeof window === 'undefined' || !window.localStorage) return 1;
  try {
    const canonical = getCanonicalGameId(gameId);
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${canonical}`);
    if (!raw) return 1;

    let parsed = parseInt(raw, 10);
    // Support parsing if stored as JSON object
    if (isNaN(parsed) && raw.startsWith('{')) {
      const obj = JSON.parse(raw);
      parsed = parseInt(obj.unlockedLevel, 10);
    }

    if (isNaN(parsed) || parsed < 1) return 1;
    return Math.min(5, Math.max(1, parsed));
  } catch (e) {
    console.warn(`Failed reading progression for ${gameId}:`, e);
    return 1;
  }
};

/**
 * Unlock a specific level for a game if it is higher than the currently unlocked level.
 * @param {string} gameId
 * @param {number} levelToUnlock
 * @returns {number} The updated unlocked level
 */
export const unlockLevel = (gameId, levelToUnlock) => {
  if (typeof window === 'undefined' || !window.localStorage) return 1;
  try {
    const canonical = getCanonicalGameId(gameId);
    const current = getUnlockedLevel(canonical);
    const target = Math.min(5, Math.max(1, parseInt(levelToUnlock, 10) || 1));
    const nextUnlocked = Math.max(current, target);

    localStorage.setItem(`${STORAGE_PREFIX}${canonical}`, String(nextUnlocked));

    // Dispatch custom window event & trigger update
    window.dispatchEvent(
      new CustomEvent(PROGRESS_UPDATE_EVENT, {
        detail: { gameId: canonical, unlockedLevel: nextUnlocked }
      })
    );

    return nextUnlocked;
  } catch (e) {
    console.warn(`Failed saving progression for ${gameId}:`, e);
    return 1;
  }
};

/**
 * When the player completes Level N, unlock Level N + 1 and save.
 * @param {string} gameId
 * @param {number} completedLevel
 * @returns {number} The updated unlocked level
 */
export const completeLevel = (gameId, completedLevel) => {
  const lvl = parseInt(completedLevel, 10) || 1;
  return unlockLevel(gameId, lvl + 1);
};

export const unlockNextLevel = completeLevel;

/**
 * Check if a specific level is currently unlocked for a game.
 * @param {string} gameId
 * @param {number} level
 * @returns {boolean}
 */
export const isLevelUnlocked = (gameId, level) => {
  const unlocked = getUnlockedLevel(gameId);
  return (parseInt(level, 10) || 1) <= unlocked;
};

/**
 * Reset all progression across all games back to Level 1.
 */
export const resetAllProgress = () => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    ALL_GAME_IDS.forEach((id) => {
      localStorage.setItem(`${STORAGE_PREFIX}${id}`, '1');
    });

    cleanLegacyStorage();

    window.dispatchEvent(
      new CustomEvent(PROGRESS_UPDATE_EVENT, {
        detail: { all: true }
      })
    );
  } catch (e) {
    console.warn('Failed resetting all progress:', e);
  }
};

export const resetGameProgression = (gameId) => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  const canonical = getCanonicalGameId(gameId);
  localStorage.setItem(`${STORAGE_PREFIX}${canonical}`, '1');
  window.dispatchEvent(
    new CustomEvent(PROGRESS_UPDATE_EVENT, {
      detail: { gameId: canonical, unlockedLevel: 1 }
    })
  );
};

/**
 * Reactive React hook for reading and updating game progression for a game.
 * @param {string} gameId
 */
export const useGameProgression = (gameId) => {
  const canonical = getCanonicalGameId(gameId);
  const [unlockedLevel, setUnlockedLevel] = useState(() => getUnlockedLevel(canonical));

  useEffect(() => {
    // Initial sync
    setUnlockedLevel(getUnlockedLevel(canonical));

    const handleUpdate = (e) => {
      if (!e?.detail || e.detail.all || !e.detail.gameId || e.detail.gameId === canonical) {
        setUnlockedLevel(getUnlockedLevel(canonical));
      }
    };

    window.addEventListener(PROGRESS_UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(PROGRESS_UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [canonical]);

  const handleComplete = useCallback(
    (levelNum) => {
      return completeLevel(canonical, levelNum);
    },
    [canonical]
  );

  const handleUnlock = useCallback(
    (targetLvl) => {
      return unlockLevel(canonical, targetLvl);
    },
    [canonical]
  );

  const checkUnlocked = useCallback(
    (lvl) => {
      return (parseInt(lvl, 10) || 1) <= unlockedLevel;
    },
    [unlockedLevel]
  );

  return {
    unlockedLevel,
    completeLevel: handleComplete,
    unlockLevel: handleUnlock,
    unlockNextLevel: handleComplete,
    isLevelUnlocked: checkUnlocked
  };
};

/**
 * Reactive React hook for observing progression across an entire zone of games.
 * @param {string[]} gameIds Array of game IDs to track
 */
export const useZoneProgression = (gameIds = ALL_GAME_IDS) => {
  const ids = Array.isArray(gameIds) && gameIds.length > 0 ? gameIds : ALL_GAME_IDS;

  const getMap = useCallback(() => {
    const map = {};
    ids.forEach((id) => {
      const canonical = getCanonicalGameId(id);
      const lvl = getUnlockedLevel(canonical);
      map[canonical] = lvl;
      map[id] = lvl;
    });
    return map;
  }, [ids]);

  const [progressMap, setProgressMap] = useState(getMap);

  useEffect(() => {
    setProgressMap(getMap());

    const handleUpdate = () => {
      setProgressMap(getMap());
    };

    window.addEventListener(PROGRESS_UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(PROGRESS_UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [getMap]);

  const isUnlocked = useCallback(
    (gameId, level) => {
      const canonical = getCanonicalGameId(gameId);
      const unlocked = progressMap[canonical] || 1;
      return (parseInt(level, 10) || 1) <= unlocked;
    },
    [progressMap]
  );

  return {
    progressMap,
    isUnlocked
  };
};

export default {
  ALL_GAME_IDS,
  PROGRESS_UPDATE_EVENT,
  getCanonicalGameId,
  cleanLegacyStorage,
  getUnlockedLevel,
  unlockLevel,
  completeLevel,
  unlockNextLevel,
  isLevelUnlocked,
  resetAllProgress,
  resetGameProgression,
  useGameProgression,
  useZoneProgression
};
