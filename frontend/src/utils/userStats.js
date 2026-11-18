import { useState, useEffect, useCallback } from 'react';
import {
  ALL_GAME_IDS,
  PROGRESS_UPDATE_EVENT,
  getUnlockedLevel,
  getCanonicalGameId,
  resetAllProgress
} from './gameProgression.js';

export const USER_PROFILE_UPDATE_EVENT = 'sparkomind-profile-updated';
export const QUESTS_UPDATE_EVENT = 'sparkomind-quests-updated';
export const SETTINGS_UPDATE_EVENT = 'sparkomind-settings-updated';

export const KIDS_GAME_META = [
  {
    id: 'bot-script',
    title: 'BotScript',
    icon: '🤖',
    category: 'Robotics & AI',
    primaryColor: '#38BDF8',
    secondaryColor: '#6366F1',
    gradient: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(99, 102, 241, 0.2) 100%)',
    borderColor: 'rgba(56, 189, 248, 0.45)',
    glowColor: 'rgba(56, 189, 248, 0.35)',
    actionLabel: 'Launch Mission ▷'
  },
  {
    id: 'circuit-connect',
    title: 'Circuit Connect',
    icon: '⚡',
    category: 'Logic & Engineering',
    primaryColor: '#F59E0B',
    secondaryColor: '#FBBF24',
    gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(251, 191, 36, 0.2) 100%)',
    borderColor: 'rgba(245, 158, 11, 0.45)',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    actionLabel: 'Connect Power ▷'
  },
  {
    id: 'gravity-sling',
    title: 'Gravity Sling',
    icon: '🪐',
    category: 'Space & Physics',
    primaryColor: '#A855F7',
    secondaryColor: '#EC4899',
    gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(236, 72, 153, 0.2) 100%)',
    borderColor: 'rgba(168, 85, 247, 0.45)',
    glowColor: 'rgba(168, 85, 247, 0.35)',
    actionLabel: 'Launch Orbit ▷'
  },
  {
    id: 'color-lab',
    title: 'Color Lab',
    icon: '🧪',
    category: 'Creativity & Science',
    primaryColor: '#10B981',
    secondaryColor: '#06B6D4',
    gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.2) 100%)',
    borderColor: 'rgba(16, 185, 129, 0.45)',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    actionLabel: 'Synthesize Light ▷'
  }
];

export const ADULTS_GAME_META = [
  { id: 'neuro-matrix', title: 'NeuroMatrix', icon: '🧠', category: 'Memory & Recall' },
  { id: 'chrono-reflex', title: 'ChronoReflex', icon: '⚡', category: 'Reaction & Velocity' },
  { id: 'neon-sudoku', title: 'Neon Sudoku', icon: '🔢', category: 'Deductive Logic' },
  { id: 'crown-grid', title: 'CrownGrid', icon: '👑', category: 'Spatial Strategy' }
];

export const SENIORS_GAME_META = [
  { id: 'heritage-match', title: 'Heritage Match', icon: '🪔', category: 'Cultural Memory' },
  { id: 'golden-zip', title: 'GoldenZip', icon: '🌾', category: 'Focus & Relaxation' },
  { id: 'quilt-patches', title: 'QuiltPatches', icon: '🧵', category: 'Spatial Pattern' },
  { id: 'timber-unbolt', title: 'TimberUnbolt', icon: '🔩', category: 'Dexterity & Physics' }
];

const DEFAULT_DAILY_MISSIONS = [
  {
    id: 'quest-1',
    title: 'First Launch Protocol',
    desc: 'Launch any STEM Lab and complete at least 1 mission level.',
    xpReward: 50,
    starsReward: 1,
    category: 'daily',
    gameId: 'bot-script'
  },
  {
    id: 'quest-2',
    title: 'Circuit Conduit Link',
    desc: 'Power up a conduit loop in Circuit Connect.',
    xpReward: 75,
    starsReward: 1,
    category: 'daily',
    gameId: 'circuit-connect'
  },
  {
    id: 'quest-3',
    title: 'Gravitational Slingshot',
    desc: 'Plot an orbital trajectory in Gravity Sling.',
    xpReward: 100,
    starsReward: 2,
    category: 'daily',
    gameId: 'gravity-sling'
  },
  {
    id: 'quest-4',
    title: 'Photon Wave Synthesis',
    desc: 'Synthesize a radiant light pigment in Color Lab.',
    xpReward: 60,
    starsReward: 1,
    category: 'daily',
    gameId: 'color-lab'
  },
  {
    id: 'quest-5',
    title: 'Wonder Starlight Spark',
    desc: 'Earn 3 Wonder Stars across any cognitive labs.',
    xpReward: 150,
    starsReward: 3,
    category: 'daily',
    gameId: 'all'
  }
];

export const sanitizeAvatar = (av) => {
  if (!av || typeof av !== 'string') return '🚀';
  const trimmed = av.trim();
  if (trimmed === 'spark-brain-default' || trimmed.startsWith('spark-') || trimmed.includes('default')) {
    return '🚀';
  }
  return trimmed;
};

export const getStoredUserProfile = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { name: 'Cadet Leo', avatar: '🚀', bio: 'Space Cadet exploring cognitive STEM labs!' };
  }
  try {
    const raw = localStorage.getItem('sparkomind_user');
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        name: parsed.name || parsed.firstName || 'Cadet Leo',
        avatar: sanitizeAvatar(parsed.avatar),
        bio: parsed.bio || 'Space Cadet exploring cognitive STEM labs!',
        ...parsed
      };
    }
  } catch (e) {
    console.warn('Failed reading stored user profile:', e);
  }
  return { name: 'Cadet Leo', avatar: '🚀', bio: 'Space Cadet exploring cognitive STEM labs!' };
};

export const saveUserProfile = (updates) => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const current = getStoredUserProfile();
    const sanitizedUpdates = {
      ...updates,
      avatar: updates.avatar ? sanitizeAvatar(updates.avatar) : current.avatar
    };
    const merged = { ...current, ...sanitizedUpdates };
    localStorage.setItem('sparkomind_user', JSON.stringify(merged));
    localStorage.setItem('user', JSON.stringify(merged));
    if (merged.avatar) {
      localStorage.setItem('sparkomind_avatar', merged.avatar);
    }
    window.dispatchEvent(new CustomEvent(USER_PROFILE_UPDATE_EVENT, { detail: merged }));
  } catch (e) {
    console.warn('Failed saving user profile:', e);
  }
};

export const getStoredBonusStats = () => {
  if (typeof window === 'undefined' || !window.localStorage) return { bonusXp: 0, bonusStars: 0, claimedMissions: [] };
  try {
    const xp = parseInt(localStorage.getItem('sparkomind_bonus_xp') || '0', 10) || 0;
    const stars = parseInt(localStorage.getItem('sparkomind_bonus_stars') || '0', 10) || 0;
    const rawClaimed = localStorage.getItem('sparkomind_claimed_missions');
    const claimed = rawClaimed ? JSON.parse(rawClaimed) : [];
    return { bonusXp: xp, bonusStars: stars, claimedMissions: Array.isArray(claimed) ? claimed : [] };
  } catch (e) {
    return { bonusXp: 0, bonusStars: 0, claimedMissions: [] };
  }
};

export const claimMissionReward = (missionId, xpReward = 50, starsReward = 1) => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const { bonusXp, bonusStars, claimedMissions } = getStoredBonusStats();
    if (claimedMissions.includes(missionId)) return;

    const nextClaimed = [...claimedMissions, missionId];
    const nextXp = bonusXp + xpReward;
    const nextStars = bonusStars + starsReward;

    localStorage.setItem('sparkomind_bonus_xp', String(nextXp));
    localStorage.setItem('sparkomind_bonus_stars', String(nextStars));
    localStorage.setItem('sparkomind_claimed_missions', JSON.stringify(nextClaimed));

    window.dispatchEvent(new CustomEvent(QUESTS_UPDATE_EVENT, { detail: { missionId, nextXp, nextStars } }));
  } catch (e) {
    console.warn('Failed claiming mission reward:', e);
  }
};

export const getStoredSettings = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { soundEffects: true, animations: true, language: 'English' };
  }
  try {
    const raw = localStorage.getItem('sparkomind_settings');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return { soundEffects: true, animations: true, language: 'English' };
};

export const saveSettings = (newSettings) => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const current = getStoredSettings();
    const merged = { ...current, ...newSettings };
    localStorage.setItem('sparkomind_settings', JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent(SETTINGS_UPDATE_EVENT, { detail: merged }));
  } catch (e) {
    console.warn('Failed saving settings:', e);
  }
};

/**
 * Calculates live real-time aggregate statistics from all 12 games + user bonuses
 */
export const calculateLiveStats = () => {
  // 1. Scan unlocked levels across all 12 games
  const allLevels = {};
  let totalGameStars = 0;

  ALL_GAME_IDS.forEach((id) => {
    const lvl = getUnlockedLevel(id);
    allLevels[id] = lvl;
    // Each level beyond L1 represents a cleared level (1 star each)
    const cleared = Math.max(0, lvl - 1);
    totalGameStars += cleared;
  });

  // 2. Bonus stats from claimed daily quests
  const { bonusXp, bonusStars, claimedMissions } = getStoredBonusStats();

  // 3. User profile
  const profile = getStoredUserProfile();

  // 4. Streak
  let streak = 5;
  if (typeof window !== 'undefined' && window.localStorage) {
    const rawStreak = localStorage.getItem('sparkomind_streak');
    if (rawStreak) {
      const parsed = parseInt(rawStreak, 10);
      if (!isNaN(parsed) && parsed > 0) streak = parsed;
    }
  }

  // Base Wonder Stars & XP
  const totalStars = 25 + (totalGameStars * 3) + bonusStars;
  const totalXp = 450 + (totalGameStars * 100) + bonusXp;

  // Level computation: 600 XP per level tier
  const level = Math.floor(totalXp / 600) + 1;
  const xpInCurrentLevel = totalXp % 600;
  const xpPercent = Math.min(100, Math.round((xpInCurrentLevel / 600) * 100));

  // Per-game stats for the 4 Kids Games
  const kidsGamesStats = KIDS_GAME_META.map((meta) => {
    const unlocked = allLevels[meta.id] || 1;
    // Cleared is unlocked - 1 (capped at 5)
    const cleared = Math.min(5, Math.max(0, unlocked - 1));
    return {
      ...meta,
      unlockedLevel: unlocked,
      clearedLevels: cleared,
      isMaxed: cleared >= 5
    };
  });

  // Quick Resume: pick the kids game with highest progress, or first uncompleted level
  let quickResume = kidsGamesStats.find((g) => g.unlockedLevel < 5) || kidsGamesStats[0];

  return {
    displayName: profile.name || 'Cadet Leo',
    avatar: profile.avatar || '🚀',
    bio: profile.bio || '',
    streak,
    totalStars,
    totalXp,
    level,
    xpInCurrentLevel,
    xpPercent,
    allLevels,
    kidsGamesStats,
    quickResume,
    claimedMissions,
    dailyMissions: DEFAULT_DAILY_MISSIONS.map((m) => ({
      ...m,
      claimed: claimedMissions.includes(m.id)
    }))
  };
};

/**
 * Custom React Hook that provides live, reactive user stats across all views
 */
export const useLiveUserStats = () => {
  const [stats, setStats] = useState(calculateLiveStats);

  useEffect(() => {
    const handleUpdate = () => {
      setStats(calculateLiveStats());
    };

    window.addEventListener(PROGRESS_UPDATE_EVENT, handleUpdate);
    window.addEventListener(USER_PROFILE_UPDATE_EVENT, handleUpdate);
    window.addEventListener(QUESTS_UPDATE_EVENT, handleUpdate);
    window.addEventListener(SETTINGS_UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(PROGRESS_UPDATE_EVENT, handleUpdate);
      window.removeEventListener(USER_PROFILE_UPDATE_EVENT, handleUpdate);
      window.removeEventListener(QUESTS_UPDATE_EVENT, handleUpdate);
      window.removeEventListener(SETTINGS_UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const claimMission = useCallback((missionId, xpReward, starsReward) => {
    claimMissionReward(missionId, xpReward, starsReward);
  }, []);

  const updateProfile = useCallback((updates) => {
    saveUserProfile(updates);
  }, []);

  const resetAll = useCallback(() => {
    resetAllProgress();
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('sparkomind_bonus_xp');
      localStorage.removeItem('sparkomind_bonus_stars');
      localStorage.removeItem('sparkomind_claimed_missions');
    }
    window.dispatchEvent(new CustomEvent(PROGRESS_UPDATE_EVENT, { detail: { all: true } }));
    window.dispatchEvent(new CustomEvent(QUESTS_UPDATE_EVENT, { detail: { reset: true } }));
  }, []);

  return {
    ...stats,
    claimMission,
    updateProfile,
    resetAll
  };
};

export default {
  KIDS_GAME_META,
  ADULTS_GAME_META,
  SENIORS_GAME_META,
  getStoredUserProfile,
  saveUserProfile,
  getStoredBonusStats,
  claimMissionReward,
  getStoredSettings,
  saveSettings,
  calculateLiveStats,
  useLiveUserStats
};
