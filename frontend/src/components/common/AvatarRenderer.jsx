import React from 'react';
import { getInitials, sanitizeAvatar } from '../../utils/avatar.js';
import styles from './AvatarRenderer.module.css';

/**
 * AvatarRenderer Component
 * Renders a glowing, vibrant Space Cadet avatar badge (emoji, image, or initials)
 * Guaranteeing that 'spark-brain-default' raw string NEVER renders anywhere in UI.
 */
export const AvatarRenderer = ({
  avatar,
  name,
  size = 'md',
  shape = 'circle',
  className = '',
  style = {},
  fallbackInitials = false,
  showGlow = true
}) => {
  const clean = sanitizeAvatar(avatar);

  const sizeClass = styles[`size_${size}`] || styles.size_md;
  const shapeClass = shape === 'rounded' ? styles.avatarBadgeRounded : '';

  // 1. If avatar is a valid external or asset image URL
  const isImage = typeof clean === 'string' && (
    clean.startsWith('http://') ||
    clean.startsWith('https://') ||
    clean.startsWith('data:image/') ||
    clean.startsWith('/assets') ||
    clean.endsWith('.png') ||
    clean.endsWith('.jpg') ||
    clean.endsWith('.svg')
  );

  if (isImage) {
    return (
      <div
        className={`${styles.avatarBadge} ${sizeClass} ${shapeClass} ${className}`}
        style={style}
        title={name || 'User Avatar'}
      >
        <img
          src={clean}
          alt={name || 'User Avatar'}
          className={styles.avatarImg}
          onError={(e) => {
            // Fallback to Space Rocket on broken image URL
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    );
  }

  // 2. If fallbackInitials is requested and avatar is purely empty or initials
  if (fallbackInitials && (!avatar || avatar.length <= 2)) {
    const initials = getInitials({ name });
    return (
      <div
        className={`${styles.avatarBadge} ${sizeClass} ${shapeClass} ${className}`}
        style={style}
        title={name || 'User'}
      >
        <span className={styles.avatarInitials}>{initials}</span>
      </div>
    );
  }

  // 3. Cosmic Space Badge with Emoji Emblem
  return (
    <div
      className={`${styles.avatarBadge} ${sizeClass} ${shapeClass} ${className}`}
      style={style}
      title={name ? `${name}'s Badge` : 'Cadet Badge'}
    >
      <span className={styles.avatarEmoji}>{clean || '🚀'}</span>
    </div>
  );
};

/**
 * Shared helper function returning JSX
 * Usage: {renderUserAvatar(user.avatar, user.name, { size: 'lg' })}
 */
export const renderUserAvatar = (avatarValue, userName, options = {}) => {
  return (
    <AvatarRenderer
      avatar={avatarValue}
      name={userName}
      {...options}
    />
  );
};

export default AvatarRenderer;
