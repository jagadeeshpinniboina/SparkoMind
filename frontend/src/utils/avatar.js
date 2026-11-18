/**
 * Avatar & Identity Utilities for SparkoMind
 * Provides bulletproof initials generation, avatar sanitization,
 * and guaranteed elimination of 'spark-brain-default' raw string.
 */
import React from 'react';

/**
 * 6 Official Visual Avatar Badges with Cosmic Identity Titles
 */
export const AVATAR_BADGES = [
  { id: 'rocket', emoji: '🚀', label: 'Space Rocket', subtitle: 'Cosmic Explorer' },
  { id: 'robot', emoji: '🤖', label: 'Robo Cadet', subtitle: 'Robot Architect' },
  { id: 'saturn', emoji: '🪐', label: 'Saturn Explorer', subtitle: 'Slingshot Ace' },
  { id: 'bolt', emoji: '⚡', label: 'Spark Bolt', subtitle: 'Circuit Explorer' },
  { id: 'flask', emoji: '🧪', label: 'Photon Alchemist', subtitle: 'Photon Wizard' },
  { id: 'star', emoji: '🌟', label: 'Super Star', subtitle: 'Star Navigator' }
];

/**
 * Sanitizes any avatar string:
 * Maps 'spark-brain-default', null, empty string, or any invalid ID to '🚀' Space Rocket
 */
export const sanitizeAvatar = (av) => {
  if (!av || typeof av !== 'string') return '🚀';
  const trimmed = av.trim();
  if (
    trimmed === 'spark-brain-default' ||
    trimmed.startsWith('spark-') ||
    trimmed.toLowerCase().includes('default') ||
    trimmed === ''
  ) {
    return '🚀';
  }
  return trimmed;
};

/**
 * Bulletproof initials generator from User object or name string.
 * Examples:
 *   { firstName: 'Jagadeesh', lastName: 'Pinniboina' } -> 'JP'
 *   { name: 'Jagadeesh Pinniboina' } -> 'JP'
 *   { name: 'Jagadeesh' } -> 'JA'
 *   null / undefined -> 'SM'
 */
export const getInitials = (user) => {
  if (!user) return 'SM';

  if (typeof user === 'string') {
    const raw = user.trim();
    const parts = raw.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
    }
    return (raw.slice(0, 2) || 'SM').toUpperCase();
  }

  if (user.firstName && user.lastName) {
    const f = String(user.firstName).trim()[0] || '';
    const l = String(user.lastName).trim()[0] || '';
    if (f && l) return `${f}${l}`.toUpperCase();
  }

  const raw = (user.name || user.email || 'SM').trim();
  const nameParts = raw.split(/\s+/).filter(Boolean);

  if (nameParts.length >= 2) {
    const firstInitial = nameParts[0][0] || '';
    const secondInitial = nameParts[1][0] || '';
    return `${firstInitial}${secondInitial}`.toUpperCase();
  }

  if (nameParts.length === 1 && nameParts[0].length >= 2) {
    return nameParts[0].slice(0, 2).toUpperCase();
  }

  return (raw.slice(0, 2) || 'SM').toUpperCase();
};

/**
 * Automatically cleans any legacy 'spark-brain-default' strings from localStorage
 */
export const migrateLegacyAvatar = () => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const rawUser = localStorage.getItem('sparkomind_user');
    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      if (
        !parsed.avatar ||
        parsed.avatar === 'spark-brain-default' ||
        (typeof parsed.avatar === 'string' && (parsed.avatar.startsWith('spark-') || parsed.avatar.includes('default')))
      ) {
        parsed.avatar = '🚀';
        localStorage.setItem('sparkomind_user', JSON.stringify(parsed));
      }
    }
    const rawLegacy = localStorage.getItem('user');
    if (rawLegacy) {
      const parsed = JSON.parse(rawLegacy);
      if (
        !parsed.avatar ||
        parsed.avatar === 'spark-brain-default' ||
        (typeof parsed.avatar === 'string' && (parsed.avatar.startsWith('spark-') || parsed.avatar.includes('default')))
      ) {
        parsed.avatar = '🚀';
        localStorage.setItem('user', JSON.stringify(parsed));
      }
    }
    const rawAv = localStorage.getItem('sparkomind_avatar');
    if (rawAv === 'spark-brain-default' || !rawAv) {
      localStorage.setItem('sparkomind_avatar', '🚀');
    }
  } catch (e) {
    // Ignore parse errors
  }
};

// Run migration immediately on file evaluation
migrateLegacyAvatar();

export { AvatarRenderer, renderUserAvatar } from '../components/common/AvatarRenderer.jsx';

export default getInitials;
