import React, { useEffect } from 'react';
import { Play, RotateCcw, ArrowLeft, Pause } from 'lucide-react';
import styles from './GamePauseOverlay.module.css';

/**
 * Universal Game Pause Modal Overlay
 * Used across all 12 games (Kids, Adults & Seniors)
 * Keyboard triggered: Escape or P
 */
export const GamePauseOverlay = ({
  isOpen,
  onResume,
  onRestart,
  onExit,
  gameTitle = 'Cognitive Mission',
  level = 1,
  zonePath = '/dashboard'
}) => {
  // Listen for Escape or P key to resume
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        e.stopPropagation();
        onResume?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isOpen, onResume]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlayBackdrop} role="dialog" aria-modal="true" aria-label="Game Paused">
      <div className={styles.pauseModal}>
        {/* Ambient Radial Aura */}
        <div className={styles.modalGlow} />

        <div className={styles.modalHeader}>
          <div className={styles.pauseBadge}>
            <Pause size={28} className={styles.pauseIcon} />
          </div>
          <h2 className={styles.modalTitle}>Game Paused</h2>
          <p className={styles.modalSubtitle}>
            Take a breather! All game countdowns, physics, and sequences are safely frozen.
          </p>
          {gameTitle && (
            <div className={styles.gameInfoPill}>
              <span>{gameTitle}</span>
              {level && <span>• Level {level}</span>}
            </div>
          )}
        </div>

        <div className={styles.modalActions}>
          {/* 1. Primary Glowing Resume CTA */}
          <button
            type="button"
            onClick={onResume}
            className={styles.resumeBtn}
            title="Resume Game (or press Escape / P)"
            autoFocus
          >
            <Play size={20} fill="currentColor" />
            <span>Resume Game</span>
            <span className={styles.keyHint}>[Esc / P]</span>
          </button>

          {/* 2. Secondary Restart Button */}
          {onRestart && (
            <button
              type="button"
              onClick={onRestart}
              className={styles.restartBtn}
              title="Restart this Level"
            >
              <RotateCcw size={18} />
              <span>Restart Level</span>
            </button>
          )}

          {/* 3. Exit to Zone Button */}
          {onExit && (
            <button
              type="button"
              onClick={onExit}
              className={styles.exitBtn}
              title="Exit to Zone Dashboard"
            >
              <ArrowLeft size={18} />
              <span>Exit to Zone</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamePauseOverlay;
