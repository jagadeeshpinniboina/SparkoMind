import React, { useState } from 'react';
import { 
  TrendingUp, Award, Target, Flame, CheckCircle2, 
  Sparkles, Zap, Brain, Layers, BarChart3, ChevronRight,
  Play, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLiveUserStats, KIDS_GAME_META, ADULTS_GAME_META, SENIORS_GAME_META } from '../../utils/userStats.js';
import styles from './ProgressPage.module.css';

export const ProgressPage = () => {
  const {
    displayName,
    avatar,
    totalStars,
    totalXp,
    level,
    streak,
    allLevels
  } = useLiveUserStats();

  const [activeTab, setActiveTab] = useState('kids');

  // Compute stats per zone
  const computeZoneStats = (metaList) => {
    return metaList.map((game) => {
      const unlocked = allLevels[game.id] || 1;
      const cleared = Math.min(5, Math.max(0, unlocked - 1));
      const percent = Math.round((cleared / 5) * 100);
      return {
        ...game,
        unlockedLevel: unlocked,
        clearedLevels: cleared,
        percent
      };
    });
  };

  const kidsStats = computeZoneStats(KIDS_GAME_META);
  const adultsStats = computeZoneStats(ADULTS_GAME_META);
  const seniorsStats = computeZoneStats(SENIORS_GAME_META);

  // Overall platform completion: 12 games × 5 levels = 60 levels total
  let totalClearedAcrossPlatform = 0;
  [...kidsStats, ...adultsStats, ...seniorsStats].forEach((g) => {
    totalClearedAcrossPlatform += g.clearedLevels;
  });
  const overallPercentage = Math.round((totalClearedAcrossPlatform / 60) * 100);

  const activeZoneList = activeTab === 'kids' 
    ? kidsStats 
    : activeTab === 'adults' 
    ? adultsStats 
    : seniorsStats;

  return (
    <div className={styles.container}>
      {/* 1. Header Banner */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>
            <TrendingUp size={28} className={styles.titleIcon} />
            <span>My Cognitive Progress & Analytics</span>
          </h1>
          <p className={styles.pageSubtitle}>
            Live synchronization of your level completion gauges, Wonder Stars, and cognitive velocity.
          </p>
        </div>

        <div className={styles.userBadgePill}>
          <span className={styles.userAvatar}>{avatar}</span>
          <div>
            <div className={styles.userName}>{displayName}</div>
            <div className={styles.userRank}>Level {level} Explorer</div>
          </div>
        </div>
      </div>

      {/* 2. Top Summary Metric Cards */}
      <div className={styles.summaryGrid}>
        {/* Overall Circular Progress Gauge */}
        <div className={styles.metricCard}>
          <div className={styles.gaugeWrapper}>
            <svg width="130" height="130" viewBox="0 0 130 130">
              <circle
                cx="65"
                cy="65"
                r="52"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="12"
              />
              <circle
                cx="65"
                cy="65"
                r="52"
                fill="none"
                stroke="url(#progressGaugeGradient)"
                strokeWidth="12"
                strokeDasharray="326.72"
                strokeDashoffset={326.72 - (326.72 * overallPercentage) / 100}
                strokeLinecap="round"
                transform="rotate(-90 65 65)"
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
              <defs>
                <linearGradient id="progressGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="50%" stopColor="#818CF8" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
            </svg>
            <div className={styles.gaugeText}>
              <span className={styles.gaugeNumber}>{overallPercentage}%</span>
              <span className={styles.gaugeSub}>Platform</span>
            </div>
          </div>
          <div className={styles.gaugeMeta}>
            <div className={styles.gaugeTitle}>Overall Mastery</div>
            <div className={styles.gaugeDesc}>
              {totalClearedAcrossPlatform} of 60 Total Levels Cleared
            </div>
          </div>
        </div>

        {/* Total Wonder Stars */}
        <div className={styles.metricCard}>
          <div className={styles.statIconBox} style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }}>
            <Star size={28} fill="currentColor" />
          </div>
          <div>
            <div className={styles.statValue}>⭐ {totalStars}</div>
            <div className={styles.statTitle}>Wonder Stars Earned</div>
            <div className={styles.statSub}>Earned from labs & daily missions</div>
          </div>
        </div>

        {/* Total Experience Points */}
        <div className={styles.metricCard}>
          <div className={styles.statIconBox} style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' }}>
            <Zap size={28} />
          </div>
          <div>
            <div className={styles.statValue}>{totalXp} XP</div>
            <div className={styles.statTitle}>Cognitive Velocity</div>
            <div className={styles.statSub}>Level {level} (Next tier in {600 - (totalXp % 600)} XP)</div>
          </div>
        </div>

        {/* Active Streak */}
        <div className={styles.metricCard}>
          <div className={styles.statIconBox} style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' }}>
            <Flame size={28} />
          </div>
          <div>
            <div className={styles.statValue}>{streak} Days 🔥</div>
            <div className={styles.statTitle}>Training Streak</div>
            <div className={styles.statSub}>Active consecutive days on SparkoMind</div>
          </div>
        </div>
      </div>

      {/* 3. Per-Game Completion Section */}
      <div className={styles.gamesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <Layers size={22} style={{ color: '#F59E0B' }} />
            <span>Per-Game Level Completion Bars</span>
          </h2>

          {/* Zone Selector Tabs */}
          <div className={styles.zoneTabs}>
            <button
              type="button"
              className={`${styles.zoneTab} ${activeTab === 'kids' ? styles.zoneTabActive : ''}`}
              onClick={() => setActiveTab('kids')}
            >
              🚀 Kids Universe (4)
            </button>
            <button
              type="button"
              className={`${styles.zoneTab} ${activeTab === 'adults' ? styles.zoneTabActive : ''}`}
              onClick={() => setActiveTab('adults')}
            >
              ⚡ Adults Neuro-Lab (4)
            </button>
            <button
              type="button"
              className={`${styles.zoneTab} ${activeTab === 'seniors' ? styles.zoneTabActive : ''}`}
              onClick={() => setActiveTab('seniors')}
            >
              🌿 Senior Sanctuary (4)
            </button>
          </div>
        </div>

        {/* Grid of Per-Game Progress Cards */}
        <div className={styles.gameCardsGrid}>
          {activeZoneList.map((game) => {
            const playUrl = activeTab === 'kids' 
              ? `/dashboard/kids/play/${game.id}` 
              : activeTab === 'adults' 
              ? `/dashboard/adults/play/${game.id}` 
              : `/dashboard/seniors/play/${game.id}`;

            return (
              <div key={game.id} className={styles.gameCard}>
                <div className={styles.gameCardTop}>
                  <div className={styles.gameIconBox}>
                    <span className={styles.gameEmoji}>{game.icon}</span>
                  </div>
                  <div className={styles.gameInfo}>
                    <h3 className={styles.gameTitle}>{game.title}</h3>
                    <span className={styles.gameCategory}>{game.category}</span>
                  </div>
                  <div className={styles.gameLevelBadge}>
                    Level {game.unlockedLevel} / 5
                  </div>
                </div>

                {/* Progress bar */}
                <div className={styles.barContainer}>
                  <div className={styles.barLabelRow}>
                    <span>Progress: {game.clearedLevels} / 5 Cleared</span>
                    <span className={styles.barPercent}>{game.percent}%</span>
                  </div>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${game.percent}%` }}
                    />
                  </div>
                </div>

                {/* Star indicators */}
                <div className={styles.starsTrackRow}>
                  {[1, 2, 3, 4, 5].map((lvl) => {
                    const isCleared = lvl <= game.clearedLevels;
                    const isPlayable = lvl <= game.unlockedLevel;
                    return (
                      <div
                        key={lvl}
                        className={`${styles.starPill} ${isCleared ? styles.starPillCleared : isPlayable ? styles.starPillPlayable : styles.starPillLocked}`}
                      >
                        <span>{isCleared ? '⭐' : isPlayable ? 'L' + lvl : '🔒'}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Launch Link */}
                <Link to={playUrl} className={styles.playLink}>
                  <Play size={14} fill="currentColor" />
                  <span>Resume {game.title} ▷</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
