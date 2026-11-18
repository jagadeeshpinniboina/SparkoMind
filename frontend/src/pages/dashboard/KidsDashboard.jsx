import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Sparkles, Play, CheckCircle2 } from 'lucide-react';
import { KIDS_GAMES } from '../../data/kidsGamesData.js';
import { useZoneProgression } from '../../utils/gameProgression.js';
import { useLiveUserStats } from '../../utils/userStats.js';
import { useTheme } from '../../context/ThemeContext.jsx';
import styles from './KidsDashboard.module.css';

const KIDS_GAME_IDS = ['bot-script', 'circuit-connect', 'gravity-sling', 'color-lab'];

/**
 * Real-time laptop clock greeting helper
 * Computes based on user's system clock:
 * 05:00 - 11:59: Good Morning 🌅
 * 12:00 - 16:59: Good Afternoon ☀️
 * 17:00 - 20:59: Good Evening 🌆
 * 21:00 - 04:59: Good Night 🌙
 */
const getClockGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return { text: 'Good Morning', emoji: '🌅' };
  }
  if (hour >= 12 && hour < 17) {
    return { text: 'Good Afternoon', emoji: '☀️' };
  }
  if (hour >= 17 && hour < 21) {
    return { text: 'Good Evening', emoji: '🌆' };
  }
  return { text: 'Good Night', emoji: '🌙' };
};

const THEME_MAP = {
  'bot-script': {
    cardClass: styles.cardBotScript,
    accentColor: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    badgeBg: 'rgba(56, 189, 248, 0.15)',
    badgeBorder: 'rgba(56, 189, 248, 0.35)',
    badgeColor: '#38BDF8',
    launchBtnClass: styles.launchBtnBotScript,
    actionText: '🚀 Launch Bot Mission'
  },
  'circuit-connect': {
    cardClass: styles.cardCircuit,
    accentColor: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    badgeBorder: 'rgba(245, 158, 11, 0.35)',
    badgeColor: '#FBBF24',
    launchBtnClass: styles.launchBtnCircuit,
    actionText: '⚡ Connect Starship Power'
  },
  'gravity-sling': {
    cardClass: styles.cardGravity,
    accentColor: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    badgeBg: 'rgba(168, 85, 247, 0.15)',
    badgeBorder: 'rgba(168, 85, 247, 0.35)',
    badgeColor: '#EC4899',
    launchBtnClass: styles.launchBtnGravity,
    actionText: '🪐 Launch Orbit Trajectory'
  },
  'color-lab': {
    cardClass: styles.cardColorLab,
    accentColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    badgeBorder: 'rgba(16, 185, 129, 0.35)',
    badgeColor: '#06B6D4',
    launchBtnClass: styles.launchBtnColorLab,
    actionText: '🧪 Synthesize Light Wave'
  }
};

export const KidsDashboard = () => {
  const { theme } = useTheme();

  // Live user progression, XP, stars, streak, profile
  const {
    displayName,
    streak,
    totalStars,
    totalXp,
    level,
    xpInCurrentLevel,
    xpPercent
  } = useLiveUserStats();

  // Real-time laptop clock greeting (updates every 60 seconds)
  const [clockGreeting, setClockGreeting] = useState(getClockGreeting);

  useEffect(() => {
    const timer = setInterval(() => {
      setClockGreeting(getClockGreeting());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Active progression state across all 4 Kids games
  const { progressMap: unlockedLevels, isUnlocked } = useZoneProgression(KIDS_GAME_IDS);

  // Active level selection state per game (default to Level 1)
  const [selectedLevels, setSelectedLevels] = useState(() => ({
    'bot-script': 1,
    'circuit-connect': 1,
    'gravity-sling': 1,
    'color-lab': 1
  }));

  // 7-day lunar streak punch card
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
         1. HERO COSMIC SPACE-LAB BANNER
         Theme-Reactive: Moon & Stars in Dark Mode / Sun & Clouds in Light Mode
         ==================================================================== */}
      <section className={`${styles.heroBanner} ${theme === 'light' ? styles.heroBannerDay : styles.heroBannerNight}`}>
        {/* Theme-Reactive Celestial Backdrop */}
        {theme === 'light' ? (
          <div className={styles.celestialSkyDay} aria-hidden="true">
            {/* Radiant Glowing Sun with rotating light rays */}
            <div className={styles.radiantSunWrapper}>
              <div className={styles.sunAura} />
              <svg className={styles.sunRaysSvg} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="sunCoreGrad" cx="50" cy="50" r="24" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="35%" stopColor="#FEF08A" />
                    <stop offset="75%" stopColor="#FBBF24" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </radialGradient>
                </defs>
                {/* 12 Radiant Rays */}
                <g stroke="#FEF08A" strokeWidth="3" strokeLinecap="round" opacity="0.9">
                  <line x1="50" y1="6" x2="50" y2="18" />
                  <line x1="50" y1="82" x2="50" y2="94" />
                  <line x1="6" y1="50" x2="18" y2="50" />
                  <line x1="82" y1="50" x2="94" y2="50" />
                  <line x1="18.9" y1="18.9" x2="27.4" y2="27.4" />
                  <line x1="72.6" y1="72.6" x2="81.1" y2="81.1" />
                  <line x1="18.9" y1="81.1" x2="27.4" y2="72.6" />
                  <line x1="72.6" y1="27.4" x2="81.1" y2="18.9" />
                  <line x1="33" y1="10" x2="37" y2="21" strokeWidth="2" opacity="0.75" />
                  <line x1="67" y1="10" x2="63" y2="21" strokeWidth="2" opacity="0.75" />
                  <line x1="33" y1="90" x2="37" y2="79" strokeWidth="2" opacity="0.75" />
                  <line x1="67" y1="90" x2="63" y2="79" strokeWidth="2" opacity="0.75" />
                </g>
                <circle cx="50" cy="50" r="23" fill="url(#sunCoreGrad)" />
                <circle cx="45" cy="45" r="8" fill="#FFFFFF" opacity="0.4" />
              </svg>
            </div>

            {/* Gently Drifting Soft Clouds */}
            <div className={styles.cloudTrack}>
              <div className={`${styles.cloudPuff} ${styles.cloud1}`}>
                <svg viewBox="0 0 120 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 46 L96 46 A14 14 0 0 0 96 22 A20 20 0 0 0 62 14 A22 22 0 0 0 24 25 A16 16 0 0 0 20 46 Z"
                    fill="#FFFFFF"
                    fillOpacity="0.82"
                  />
                </svg>
              </div>
              <div className={`${styles.cloudPuff} ${styles.cloud2}`}>
                <svg viewBox="0 0 100 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M16 40 L84 40 A12 12 0 0 0 84 20 A17 17 0 0 0 54 12 A19 19 0 0 0 22 22 A14 14 0 0 0 16 40 Z"
                    fill="#FFFFFF"
                    fillOpacity="0.72"
                  />
                </svg>
              </div>
              <div className={`${styles.cloudPuff} ${styles.cloud3}`}>
                <svg viewBox="0 0 130 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22 50 L108 50 A16 16 0 0 0 108 24 A22 22 0 0 0 70 15 A25 25 0 0 0 28 27 A18 18 0 0 0 22 50 Z"
                    fill="#FFFFFF"
                    fillOpacity="0.65"
                  />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.celestialSkyNight} aria-hidden="true">
            {/* Animated Glowing Crescent Moon with Craters & Floating Hover */}
            <div className={styles.crescentMoonWrapper}>
              <div className={styles.moonAura} />
              <svg className={styles.moonSvg} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="crescentMoonGrad" cx="32" cy="30" r="26" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFFBEB" />
                    <stop offset="45%" stopColor="#FEF3C7" />
                    <stop offset="85%" stopColor="#FDE68A" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </radialGradient>
                </defs>
                <path
                  d="M45 10C33.5 10 24 19.5 24 31C24 42.5 33.5 52 45 52C47.8 52 50.4 51.5 52.8 50.5C46.2 55.8 37.8 59 28.5 59C13.9 59 2 47.1 2 32.5C2 17.9 13.9 6 28.5 6C37.8 6 46.2 9.2 52.8 14.5C50.4 13.5 47.8 10 45 10Z"
                  fill="url(#crescentMoonGrad)"
                />
                <circle cx="22" cy="25" r="3" fill="#D97706" opacity="0.32" />
                <circle cx="28" cy="38" r="2.2" fill="#D97706" opacity="0.28" />
                <circle cx="16" cy="36" r="1.8" fill="#D97706" opacity="0.3" />
              </svg>
            </div>

            {/* Twinkling Constellation Stars */}
            <div className={styles.constellationStars}>
              <span className={`${styles.celestialStar} ${styles.cStar1}`}>✦</span>
              <span className={`${styles.celestialStar} ${styles.cStar2}`}>★</span>
              <span className={`${styles.celestialStar} ${styles.cStar3}`}>✦</span>
              <span className={`${styles.celestialStar} ${styles.cStar4}`}>★</span>
              <span className={`${styles.celestialStar} ${styles.cStar5}`}>✦</span>
              <span className={`${styles.celestialStar} ${styles.cStar6}`}>★</span>
            </div>
          </div>
        )}

        <div className={styles.heroContent}>
          <div className={styles.heroLeftCol}>
            <div className={styles.badgeRowWithMascot}>
              {/* Animated Space Cadet Mascot Badge (Glossy SVG Helmet) */}
              <div className={styles.floatingMascotWrapper}>
                <div className={styles.cadetMascotBadge} title="Space Cadet STEM Mascot">
                  <svg className={styles.mascotSvg} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <radialGradient id="cadetHelmetGrad" cx="32" cy="28" r="26" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="45%" stopColor="#E0F2FE" />
                        <stop offset="85%" stopColor="#7DD3FC" />
                        <stop offset="100%" stopColor="#0284C7" />
                      </radialGradient>
                      <linearGradient id="cadetVisorGrad" x1="18" y1="20" x2="46" y2="44" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#F59E0B" />
                        <stop offset="40%" stopColor="#FBBF24" />
                        <stop offset="80%" stopColor="#D97706" />
                        <stop offset="100%" stopColor="#78350F" />
                      </linearGradient>
                      <linearGradient id="cadetAntennaGrad" x1="32" y1="2" x2="32" y2="12" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FDE68A" />
                        <stop offset="100%" stopColor="#F59E0B" />
                      </linearGradient>
                      <filter id="cadetGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Outer Cosmic Halo Ring */}
                    <circle cx="32" cy="34" r="28" fill="rgba(56, 189, 248, 0.2)" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4 2" />

                    {/* Rocket Ears / Ear Pods */}
                    <rect x="7" y="27" width="7" height="14" rx="3.5" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
                    <rect x="50" y="27" width="7" height="14" rx="3.5" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
                    <circle cx="10.5" cy="34" r="2" fill="#FBBF24" />
                    <circle cx="53.5" cy="34" r="2" fill="#FBBF24" />

                    {/* Antenna with golden beacon star */}
                    <line x1="32" y1="12" x2="32" y2="5" stroke="#FDE68A" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="32" cy="4" r="3.5" fill="url(#cadetAntennaGrad)" filter="url(#cadetGlow)" />

                    {/* Main Helmet Dome */}
                    <circle cx="32" cy="34" r="22" fill="url(#cadetHelmetGrad)" stroke="#0284C7" strokeWidth="2" />

                    {/* Golden Visor */}
                    <rect x="18" y="24" width="28" height="18" rx="9" fill="url(#cadetVisorGrad)" stroke="#B45309" strokeWidth="1.5" />

                    {/* Visor Gloss Reflection */}
                    <ellipse cx="25" cy="28" rx="5" ry="2.5" fill="#FFFFFF" opacity="0.75" transform="rotate(-15 25 28)" />
                    <circle cx="38" cy="27" r="1.5" fill="#FFFFFF" opacity="0.6" />

                    {/* Collar Rim */}
                    <path d="M22 52 C22 49, 42 49, 42 52 L38 56 C38 56, 26 56, 26 56 Z" fill="#0284C7" stroke="#38BDF8" strokeWidth="1" />
                  </svg>
                </div>
                <div className={styles.mascotShadow} />
              </div>

              <div className={styles.badgePill}>
                <Rocket size={16} />
                <span>Space Cadet Level {level}: Galactic STEM Pioneer</span>
              </div>
            </div>

            <h1 className={styles.heroTitle}>
              <span>{clockGreeting.text}, {displayName}!</span>
              <span className={styles.waveHand}>{clockGreeting.emoji}</span>
            </h1>

            <p className={styles.heroSubtitle}>
              All <strong>4 Next-Gen STEM & AI Labs</strong> are primed and ready for your daily cognitive mission!
            </p>
          </div>

          <div className={styles.heroRightCol}>
            {/* Stat Counters directly above milestone console */}
            <div className={styles.heroStats}>
              <div className={styles.statTag}>
                <div className={styles.statValue}>⭐ {totalStars}</div>
                <div className={styles.statLabel}>Wonder Stars</div>
              </div>
              <div className={styles.statTag}>
                <div className={styles.statValue}>{streak} 🔥</div>
                <div className={styles.statLabel}>Day Streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Console: XP Progress + 7-Day Lunar Streak Punch Card */}
        <div className={styles.milestoneConsole}>
          {/* Level Progress */}
          <div className={styles.progressBlock}>
            <div className={styles.progressLabelRow}>
              <span>Level {level} Progress</span>
              <span className={styles.progressValue}>
                {xpInCurrentLevel} / 600 XP ({xpPercent}%)
              </span>
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${xpPercent}%` }} />
            </div>
          </div>

          {/* 7-Day Lunar Streak Tracker */}
          <div className={styles.streakConsole}>
            <div className={styles.streakHeader}>
              <span>7-Day Lunar Streak Tracker</span>
              <span style={{ color: '#FDE68A' }}>{streak} Days Active 🔥</span>
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
         2. ACTIVE QUESTS SECTION (4 NEXT-GEN STEM & AI LABS, 2×2 BALANCED GRID)
         ==================================================================== */}
      <section className={styles.questsSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>
              <Sparkles size={24} style={{ color: '#F59E0B' }} />
              <span>Active Quests (4 Next-Gen STEM & AI Labs)</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Zero-quiz, game-based learning nurturing working memory, algorithmic coding, and physics intuition.
            </p>
          </div>
        </div>

        {/* Balanced 2×2 Responsive Grid for 4 Labs */}
        <div className={styles.questsGrid}>
          {KIDS_GAMES.map((game) => {
            const currentSelectedLvl = selectedLevels[game.id] || 1;
            const currentLevelMeta =
              game.levels.find((l) => l.level === currentSelectedLvl) || game.levels[0];
            const unlocked = unlockedLevels[game.id] || 1;
            const clearedCount = Math.min(5, Math.max(0, unlocked - 1));
            const theme = THEME_MAP[game.id] || THEME_MAP['bot-script'];

            return (
              <div key={game.id} className={`${styles.questCard} ${theme.cardClass}`}>
                {/* Radial ambient aura top corner */}
                <div className={styles.cardAura} style={{ background: theme.glowColor }} />

                <div className={styles.cardTop}>
                  <div className={styles.cardHeaderRow}>
                    {/* Animated 3D Floating Icon Badge */}
                    <div className={styles.iconBadgeWrapper}>
                      <span className={styles.emojiBadge} role="img" aria-label={game.title}>
                        {game.icon}
                      </span>
                    </div>

                    <div className={styles.badgeStack}>
                      <span
                        className={styles.categoryBadge}
                        style={{
                          background: theme.badgeBg,
                          borderColor: theme.badgeBorder,
                          color: theme.badgeColor
                        }}
                      >
                        {game.category}
                      </span>
                      <span className={styles.ageBadge}>{game.targetAge}</span>
                    </div>
                  </div>

                  <h3 className={styles.cardTitle}>{game.title}</h3>
                  <p className={styles.tagline}>{game.tagline}</p>

                  {/* Skills Tags */}
                  <div className={styles.skillsRow}>
                    {game.skills.map((skill, sIdx) => (
                      <span key={sIdx} className={styles.skillPill}>
                        <CheckCircle2 size={12} style={{ color: theme.accentColor }} />
                        <span>{skill}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Unified Compact Mission Tier & Star Selector Bar */}
                <div className={styles.missionTierBar}>
                  <div className={styles.tierHeader}>
                    <div className={styles.tierTitleGroup}>
                      <span className={styles.tierLabel}>Mission Tier:</span>
                      <span className={styles.tierCurrentTitle}>
                        L{currentSelectedLvl}: {currentLevelMeta.title}
                      </span>
                    </div>
                    <span className={styles.tierClearedBadge}>
                      ⭐ {clearedCount}/5 Cleared
                    </span>
                  </div>

                  <div className={styles.tierPillsRow}>
                    {game.levels.map((lvlItem) => {
                      const isLocked = !isUnlocked(game.id, lvlItem.level);
                      const isCleared = lvlItem.level <= clearedCount;
                      const isActive = currentSelectedLvl === lvlItem.level;

                      return (
                        <button
                          key={lvlItem.level}
                          type="button"
                          onClick={() => handleLevelSelect(game.id, lvlItem.level)}
                          disabled={isLocked}
                          style={{ pointerEvents: isLocked ? 'none' : 'auto' }}
                          className={`${styles.tierBtn} ${
                            isActive ? styles.tierBtnActive : ''
                          } ${isCleared ? styles.tierBtnCleared : ''} ${
                            isLocked ? styles.tierBtnLocked : ''
                          }`}
                          title={
                            isLocked
                              ? `Complete Level ${lvlItem.level - 1} to unlock`
                              : `${isCleared ? 'Cleared ★ ' : ''}Level ${lvlItem.level}: ${lvlItem.title}`
                          }
                        >
                          <span className={styles.tierBtnContent}>
                            {isLocked ? (
                              <>
                                <span className={styles.lockIcon}>🔒</span>
                                <span>L{lvlItem.level}</span>
                              </>
                            ) : isCleared ? (
                              <>
                                <span className={styles.starIcon}>⭐</span>
                                <span>L{lvlItem.level}</span>
                              </>
                            ) : (
                              <span>L{lvlItem.level}</span>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Primary Playful CTA: Launch Mission */}
                <Link
                  to={`/dashboard/kids/play/${game.id}?level=${Math.min(
                    currentSelectedLvl,
                    unlockedLevels[game.id] || 1
                  )}`}
                  className={`${styles.launchBtn} ${theme.launchBtnClass}`}
                >
                  <Play size={18} fill="currentColor" />
                  <span>{theme.actionText}</span>
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default KidsDashboard;
