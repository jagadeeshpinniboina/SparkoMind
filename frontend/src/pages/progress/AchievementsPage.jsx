import React, { useState } from 'react';
import { 
  Trophy, Award, Star, Flame, Lock, CheckCircle2, 
  Sparkles, Zap, Brain, Shield, Compass, ChevronRight 
} from 'lucide-react';
import { useLiveUserStats } from '../../utils/userStats.js';
import styles from './AchievementsPage.module.css';

export const AchievementsPage = () => {
  const {
    displayName,
    avatar,
    totalStars,
    totalXp,
    level,
    streak,
    allLevels
  } = useLiveUserStats();

  const [activeFilter, setActiveFilter] = useState('All');

  // Compute live achievement status from actual progression
  const botLevel = allLevels['bot-script'] || 1;
  const circuitLevel = allLevels['circuit-connect'] || 1;
  const gravityLevel = allLevels['gravity-sling'] || 1;
  const colorLevel = allLevels['color-lab'] || 1;
  const neuroLevel = allLevels['neuro-matrix'] || 1;
  const reflexLevel = allLevels['chrono-reflex'] || 1;
  const heritageLevel = allLevels['heritage-match'] || 1;
  const goldenLevel = allLevels['golden-zip'] || 1;

  const totalClearedAny = (botLevel > 1 || circuitLevel > 1 || gravityLevel > 1 || colorLevel > 1 || neuroLevel > 1);
  const allKidsMaxed = (botLevel >= 5 && circuitLevel >= 5 && gravityLevel >= 5 && colorLevel >= 5);

  const achievementsList = [
    {
      id: 'ach-first-launch',
      title: 'First Launch Protocol',
      desc: 'Complete your very first mission level in any STEM or Cognitive Lab.',
      category: 'Milestones',
      tier: 'Bronze',
      xpReward: 50,
      icon: '🚀',
      unlocked: totalClearedAny,
      current: totalClearedAny ? 1 : 0,
      target: 1
    },
    {
      id: 'ach-bot-coder',
      title: 'Bot Coder Pioneer',
      desc: 'Master the command sequencer and unlock Level 2 in BotScript.',
      category: 'Kids Zone',
      tier: 'Silver',
      xpReward: 100,
      icon: '🤖',
      unlocked: botLevel >= 2,
      current: Math.min(5, botLevel),
      target: 2
    },
    {
      id: 'ach-circuit-master',
      title: 'Circuit Navigator',
      desc: 'Route energy conduits to illuminate the starship in Circuit Connect.',
      category: 'Kids Zone',
      tier: 'Silver',
      xpReward: 100,
      icon: '⚡',
      unlocked: circuitLevel >= 2,
      current: Math.min(5, circuitLevel),
      target: 2
    },
    {
      id: 'ach-gravity-ace',
      title: 'Orbital Slingshot Ace',
      desc: 'Execute a gravitational curve around planetary bodies in Gravity Sling.',
      category: 'Kids Zone',
      tier: 'Silver',
      xpReward: 100,
      icon: '🪐',
      unlocked: gravityLevel >= 2,
      current: Math.min(5, gravityLevel),
      target: 2
    },
    {
      id: 'ach-color-alchemist',
      title: 'Photon Wave Alchemist',
      desc: 'Synthesize radiant light wavelengths in Color Lab.',
      category: 'Kids Zone',
      tier: 'Silver',
      xpReward: 100,
      icon: '🧪',
      unlocked: colorLevel >= 2,
      current: Math.min(5, colorLevel),
      target: 2
    },
    {
      id: 'ach-star-cadet',
      title: 'Starlight Apprentice',
      desc: 'Accumulate 5 Wonder Stars across cognitive lab challenges.',
      category: 'Milestones',
      tier: 'Silver',
      xpReward: 150,
      icon: '⭐',
      unlocked: totalStars >= 5,
      current: Math.min(5, totalStars),
      target: 5
    },
    {
      id: 'ach-solar-architect',
      title: 'Solar System Architect',
      desc: 'Accumulate 15 Wonder Stars across any cognitive labs.',
      category: 'Milestones',
      tier: 'Gold',
      xpReward: 300,
      icon: '🌟',
      unlocked: totalStars >= 15,
      current: Math.min(15, totalStars),
      target: 15
    },
    {
      id: 'ach-cosmic-legend',
      title: 'Cosmic Lab Legend',
      desc: 'Conquer all 5 levels in all 4 Kids STEM Labs!',
      category: 'Kids Zone',
      tier: 'Platinum',
      xpReward: 500,
      icon: '👑',
      unlocked: allKidsMaxed,
      current: (botLevel >= 5 ? 1 : 0) + (circuitLevel >= 5 ? 1 : 0) + (gravityLevel >= 5 ? 1 : 0) + (colorLevel >= 5 ? 1 : 0),
      target: 4
    },
    {
      id: 'ach-streak-pioneer',
      title: 'Consistency Pioneer',
      desc: 'Maintain a 5-day continuous brain workout streak.',
      category: 'Streaks',
      tier: 'Silver',
      xpReward: 150,
      icon: '🔥',
      unlocked: streak >= 5,
      current: Math.min(5, streak),
      target: 5
    },
    {
      id: 'ach-streak-titan',
      title: 'Streak Titan',
      desc: 'Maintain a 14-day continuous cognitive workout streak.',
      category: 'Streaks',
      tier: 'Platinum',
      xpReward: 500,
      icon: '⚡',
      unlocked: streak >= 14,
      current: Math.min(14, streak),
      target: 14
    },
    {
      id: 'ach-neuro-virtuoso',
      title: 'Synaptic Architect',
      desc: 'Unlock Level 2 or higher in Adults NeuroMatrix.',
      category: 'Adults Zone',
      tier: 'Gold',
      xpReward: 200,
      icon: '🧠',
      unlocked: neuroLevel >= 2,
      current: Math.min(5, neuroLevel),
      target: 2
    },
    {
      id: 'ach-heritage-keeper',
      title: 'Heritage Chronicler',
      desc: 'Unlock Level 2 or higher in Seniors Heritage Match.',
      category: 'Seniors Zone',
      tier: 'Gold',
      xpReward: 200,
      icon: '🪔',
      unlocked: heritageLevel >= 2,
      current: Math.min(5, heritageLevel),
      target: 2
    }
  ];

  const unlockedCount = achievementsList.filter((a) => a.unlocked).length;
  const totalCount = achievementsList.length;

  const filteredAchievements = activeFilter === 'All'
    ? achievementsList
    : achievementsList.filter((a) => a.category === activeFilter);

  return (
    <div className={styles.container}>
      {/* 1. Header Row */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>
            <Trophy size={28} className={styles.trophyIcon} />
            <span>Trophy Room & Badges</span>
          </h1>
          <p className={styles.pageSubtitle}>
            Unlock badges dynamically as you conquer levels, sustain streaks, and earn Wonder Stars.
          </p>
        </div>

        {/* Global Trophy Progress Pill */}
        <div className={styles.unlockedCounterPill}>
          <Sparkles size={18} style={{ color: '#F59E0B' }} />
          <span><strong>{unlockedCount}</strong> of {totalCount} Badges Unlocked</span>
        </div>
      </div>

      {/* 2. Filter Pills */}
      <div className={styles.filterRow}>
        {['All', 'Kids Zone', 'Adults Zone', 'Seniors Zone', 'Milestones', 'Streaks'].map((cat) => (
          <button
            key={cat}
            type="button"
            className={`${styles.filterBtn} ${activeFilter === cat ? styles.filterBtnActive : ''}`}
            onClick={() => setActiveFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. Achievements Grid */}
      <div className={styles.achievementsGrid}>
        {filteredAchievements.map((item) => {
          const percent = Math.min(100, Math.round((item.current / item.target) * 100));

          return (
            <div
              key={item.id}
              className={`${styles.badgeCard} ${item.unlocked ? styles.badgeCardUnlocked : styles.badgeCardLocked}`}
            >
              <div className={styles.cardTopRow}>
                {/* Icon Badge */}
                <div className={styles.iconCircle}>
                  <span className={styles.badgeEmoji}>{item.icon}</span>
                </div>

                {/* Tier & XP Pill */}
                <div className={styles.pillGroup}>
                  <span className={`${styles.tierBadge} ${styles['tier_' + item.tier.toLowerCase()]}`}>
                    {item.tier}
                  </span>
                  <span className={styles.xpPill}>+{item.xpReward} XP</span>
                </div>
              </div>

              {/* Title & Desc */}
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>
                  {item.title}
                  {item.unlocked && <span className={styles.checkMark}>✓</span>}
                </h3>
                <p className={styles.cardDesc}>{item.desc}</p>
              </div>

              {/* Progress Bar & Status */}
              <div className={styles.progressContainer}>
                <div className={styles.progressHeader}>
                  <span className={styles.statusLabel}>
                    {item.unlocked ? 'Unlocked & Claimed' : 'In Progress'}
                  </span>
                  <span className={styles.countLabel}>
                    {item.current} / {item.target}
                  </span>
                </div>

                <div className={styles.track}>
                  <div
                    className={styles.fill}
                    style={{
                      width: `${percent}%`,
                      background: item.unlocked
                        ? 'linear-gradient(90deg, #F59E0B 0%, #10B981 100%)'
                        : 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)'
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsPage;
