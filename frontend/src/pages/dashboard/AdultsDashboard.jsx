import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Zap, Play, CheckCircle2, Flame, Award, BarChart3, ShieldCheck, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { ADULTS_GAMES } from '../../data/adultsGamesData.js';
import { useZoneProgression } from '../../utils/gameProgression.js';
import styles from './AdultsDashboard.module.css';

const ADULT_GAME_IDS = ['neuro-matrix', 'chrono-reflex', 'neon-sudoku', 'crown-grid'];

export const AdultsDashboard = () => {
  const { user, progress } = useAuth();
  const { progressMap, isUnlocked } = useZoneProgression(ADULT_GAME_IDS);

  // Active level selection state per game (default to Level 1)
  const [selectedLevels, setSelectedLevels] = useState({
    'neuro-matrix': 1,
    'chrono-reflex': 1,
    'neon-sudoku': 1,
    'crown-grid': 1
  });

  const displayName = user?.name || user?.fullName || 'Jagadeesh Pinniboina';
  const neuroXp = progress?.totalXp || 1450;
  const streak = progress?.currentStreak || 7;
  const levelNum = progress?.level || 4;
  const cognitiveTier = `Tier ${levelNum}: Executive Tactician`;

  // 7-day cognitive performance pulse
  const daysOfWeek = [
    { day: 'Mon', completed: true },
    { day: 'Tue', completed: true },
    { day: 'Wed', completed: true },
    { day: 'Thu', completed: true },
    { day: 'Fri', completed: true, isToday: true },
    { day: 'Sat', completed: false },
    { day: 'Sun', completed: false }
  ];

  const handleLevelSelect = (gameId, lvl) => {
    if (!isUnlocked(gameId, lvl)) return;
    setSelectedLevels((prev) => ({
      ...prev,
      [gameId]: lvl
    }));
  };

  return (
    <div className={styles.container}>
      {/* ====================================================================
         1. HERO PERFORMANCE CONSOLE
         ==================================================================== */}
      <section className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.badgePill}>
              <span className={styles.pulseDot} />
              <span>Adults Neuro-Lab • Cognitive Conditioning Core</span>
            </div>

            <h1 className={styles.heroTitle}>
              Welcome back, <span className={styles.heroTitleHighlight}>{displayName}</span>
            </h1>

            <p className={styles.heroSubtitle}>
              All 4 Advanced Neuro-Lab cognitive drills are online. High-velocity executive conditioning, working memory retention, and systems logic active.
            </p>
          </div>

          {/* Metrics Pills: Neuro XP, Focus Streak, Cognitive Tier */}
          <div className={styles.heroStats}>
            <div className={styles.statTag}>
              <div className={`${styles.statValue} ${styles.statValueCyan}`}>
                {neuroXp.toLocaleString()} XP
              </div>
              <div className={styles.statLabel}>Neuro XP</div>
            </div>

            <div className={styles.statTag}>
              <div className={styles.statValue}>
                {streak} Days <Flame size={18} fill="#F59E0B" color="#F59E0B" />
              </div>
              <div className={styles.statLabel}>Focus Streak</div>
            </div>

            <div className={styles.statTag}>
              <div className={`${styles.statValue} ${styles.statValueEmerald}`}>
                Level {levelNum}
              </div>
              <div className={styles.statLabel}>{cognitiveTier}</div>
            </div>
          </div>
        </div>

        {/* Milestone Console: Synaptic Bandwidth & 7-Day Performance Pulse */}
        <div className={styles.milestoneConsole}>
          {/* Executive Readiness */}
          <div className={styles.progressBlock}>
            <div className={styles.progressLabelRow}>
              <span>Synaptic Bandwidth & Executive Efficiency</span>
              <span className={styles.progressValue}>94.2% Optimal Calibration</span>
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: '94.2%' }} />
            </div>
          </div>

          {/* 7-Day Performance Pulse */}
          <div className={styles.streakConsole}>
            <div className={styles.streakHeader}>
              <span>7-Day Cognitive Pulse</span>
              <span style={{ color: '#06B6D4' }}>{streak} Days Active Streak</span>
            </div>
            <div className={styles.punchCardRow}>
              {daysOfWeek.map((d, idx) => (
                <div key={idx} className={styles.punchDot}>
                  <div
                    className={`${styles.dotCircle} ${d.completed ? styles.dotActive : ''} ${
                      d.isToday ? styles.dotToday : ''
                    }`}
                  >
                    {d.completed ? '✓' : ''}
                  </div>
                  <span className={styles.dotLabel}>{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
         2. 4-MISSION ACTIVE DRILLS SECTION (Strict Demographic Isolation)
         ==================================================================== */}
      <section className={styles.questsSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>
              <Cpu size={24} style={{ color: '#06B6D4' }} />
              <span>Active Drills (4 Advanced Cognitive Conditioning Engines)</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Hands-on mental simulations targeting working memory, executive focus, systems logic, and deductive reasoning.
            </p>
          </div>
        </div>

        {/* 4 Mission Cards Grid */}
        <div className={styles.questsGrid}>
          {ADULTS_GAMES.map((game) => {
            const currentSelectedLvl = selectedLevels[game.id] || 1;
            const currentLevelMeta =
              game.levels.find((l) => l.level === currentSelectedLvl) || game.levels[0];

            return (
              <div key={game.id} className={styles.questCard}>
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
                        <CheckCircle2 size={12} />
                        <span>{skill}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Level Selector Block */}
                <div className={styles.levelSelectorBlock}>
                  <div className={styles.levelHeader}>
                    <span>Conditioning Tier:</span>
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

                {/* Primary CTA: Launch Drill */}
                <Link
                  to={`/dashboard/adults/play/${game.id}?level=${Math.min(currentSelectedLvl, progressMap[game.id] || 1)}`}
                  className={styles.launchBtn}
                >
                  <Play size={16} fill="currentColor" />
                  <span>Launch Drill ▷</span>
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export const AdultDashboard = AdultsDashboard;
export default AdultsDashboard;
