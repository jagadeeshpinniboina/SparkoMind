import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sun, Play, Smile, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { SENIORS_GAMES } from '../../data/seniorsGamesData.js';
import { useZoneProgression } from '../../utils/gameProgression.js';
import styles from './SeniorDashboard.module.css';

const SENIOR_GAME_IDS = ['heritage-match', 'golden-zip', 'quilt-patches', 'timber-unbolt'];

export const SeniorDashboard = () => {
  const { user, progress } = useAuth();
  const { progressMap, isUnlocked } = useZoneProgression(SENIOR_GAME_IDS);

  // Active level selection per game (default to Level 1)
  const [selectedLevels, setSelectedLevels] = useState({
    'heritage-match': 1,
    'golden-zip': 1,
    'quilt-patches': 1,
    'timber-unbolt': 1
  });

  const streak = user?.streak || progress?.currentStreak || 5;
  const level = user?.level || progress?.level || 2;
  const points = user?.points || progress?.totalXp || 350;
  const displayName = user?.name || user?.firstName || 'Friend';

  const handleLevelSelect = (gameId, lvl) => {
    if (!isUnlocked(gameId, lvl)) return;
    setSelectedLevels(prev => ({
      ...prev,
      [gameId]: lvl
    }));
  };

  return (
    <div className={styles.container}>
      {/* ====================================================================
         1. HERO MINDFUL GREETING BANNER
         ==================================================================== */}
      <section className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.badgePill}>
              <span className={styles.pulseDot} />
              <span>Seniors Sanctuary • Mindful Vitality Core</span>
            </div>

            <h1 className={styles.heroTitle}>
              Good Day, <span className={styles.heroTitleHighlight}>{displayName}</span>
            </h1>

            <p className={styles.heroSubtitle}>
              Welcome back to your peaceful brain sanctuary. Engage in relaxed memory recall, verbal associations, and harmonious sensory exercises at your own serene pace.
            </p>
          </div>

          {/* Vitality Metrics */}
          <div className={styles.heroStats}>
            <div className={styles.statTag}>
              <div className={`${styles.statValue} ${styles.statValueGold}`}>
                {points.toLocaleString()} Points
              </div>
              <div className={styles.statLabel}>Vitality Points</div>
            </div>

            <div className={styles.statTag}>
              <div className={styles.statValue}>
                {streak} Days <Heart size={20} fill="#EF4444" color="#EF4444" />
              </div>
              <div className={styles.statLabel}>Active Days</div>
            </div>

            <div className={styles.statTag}>
              <div className={`${styles.statValue} ${styles.statValueEmerald}`}>
                Level {level}
              </div>
              <div className={styles.statLabel}>Mindful Vitality</div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
         2. SENIOR ZONE ACTIVITIES (4 Dedicated Harmonious Drills)
         ==================================================================== */}
      <section className={styles.activitiesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <Sparkles size={26} style={{ color: '#F59E0B' }} />
            <span>Mindful Activities (4 Dedicated Harmonious Drills)</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Soothing sensory exercises with zero stress, no countdown timers, and progressive levels designed for relaxed mental sharpness.
          </p>
        </div>

        {/* 4 Activity Cards Grid */}
        <div className={styles.activitiesGrid}>
          {SENIORS_GAMES.map((game) => {
            const currentSelectedLvl = selectedLevels[game.id] || 1;
            const currentLevelMeta =
              game.levels.find((l) => l.level === currentSelectedLvl) || game.levels[0];

            return (
              <div key={game.id} className={styles.activityCard}>
                <div className={styles.cardTop}>
                  <div className={styles.cardHeaderRow}>
                    <span className={styles.emojiBadge} role="img" aria-label={game.title}>
                      {game.icon}
                    </span>
                    <div className={styles.badgeStack}>
                      <span className={styles.categoryBadge}>{game.category}</span>
                      <span className={styles.ageBadge}>{game.targetAge}</span>
                    </div>
                  </div>

                  <h3 className={styles.cardTitle}>{game.title}</h3>
                  <p className={styles.tagline}>{game.tagline}</p>

                  {/* Skills Tags */}
                  <div className={styles.skillsRow}>
                    {game.skills.map((skill, sIdx) => (
                      <span key={sIdx} className={styles.skillPill}>
                        <CheckCircle2 size={13} style={{ color: '#10B981' }} />
                        <span>{skill}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Level Selector Block */}
                <div className={styles.levelSelectorBlock}>
                  <div className={styles.levelHeader}>
                    <span>Select Journey Level:</span>
                    <span className={styles.activeLevelTitle}>
                      L{currentSelectedLvl}: {currentLevelMeta.title}
                    </span>
                  </div>

                  <div className={styles.levelPillsRow}>
                    {game.levels.map((lvlItem) => {
                      const maxUnlocked = progressMap[game.id] || 1;
                      const isLocked = lvlItem.level > maxUnlocked;
                      const isLvlActive = currentSelectedLvl === lvlItem.level;
                      return (
                        <button
                          key={lvlItem.level}
                          type="button"
                          onClick={() => handleLevelSelect(game.id, lvlItem.level)}
                          disabled={isLocked}
                          style={{ pointerEvents: isLocked ? 'none' : 'auto' }}
                          className={`${styles.levelBtn} ${isLvlActive ? styles.levelBtnActive : ''} ${isLocked ? styles.levelBtnLocked : ''}`}
                          title={isLocked ? `Complete Level ${lvlItem.level - 1} to unlock` : `Level ${lvlItem.level}: ${lvlItem.title} - ${lvlItem.description}`}
                        >
                          <span>L{lvlItem.level}</span>
                          {isLocked && <span className={styles.lockIcon}>🔒</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Primary CTA: Launch Activity */}
                <Link
                  to={`/dashboard/seniors/play/${game.id}?level=${Math.min(currentSelectedLvl, progressMap[game.id] || 1)}`}
                  className={styles.launchBtn}
                >
                  <Play size={18} fill="currentColor" />
                  <span>Start Activity ▷</span>
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default SeniorDashboard;
