import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, Flame, Clock, CheckCircle2, Award, 
  Sparkles, Zap, ArrowRight, Play, RefreshCw, Star 
} from 'lucide-react';
import { useLiveUserStats } from '../../utils/userStats.js';
import styles from './MissionsPage.module.css';

export const MissionsPage = () => {
  const {
    displayName,
    totalStars,
    totalXp,
    level,
    streak,
    dailyMissions,
    claimMission
  } = useLiveUserStats();

  const [toastMessage, setToastMessage] = useState(null);

  const [weeklyQuests, setWeeklyQuests] = useState([
    {
      id: 'quest-weekly-1',
      title: 'Galactic Zone Tour',
      desc: 'Launch challenges across Kids Universe, Adults Neuro-Lab, and Senior Sanctuary.',
      xpReward: 250,
      starsReward: 3,
      current: 3,
      target: 3,
      claimed: false
    },
    {
      id: 'quest-weekly-2',
      title: 'Relentless Cosmic Streak',
      desc: 'Maintain a 5-day continuous cognitive workout streak.',
      xpReward: 350,
      starsReward: 5,
      current: Math.min(5, streak),
      target: 5,
      claimed: false
    },
    {
      id: 'quest-weekly-3',
      title: 'Level 5 Supercluster Master',
      desc: 'Conquer Level 5 in at least two different STEM or Cognitive Labs.',
      xpReward: 450,
      starsReward: 5,
      current: 1,
      target: 2,
      claimed: false
    }
  ]);

  const handleClaim = (mission) => {
    claimMission(mission.id, mission.xpReward, mission.starsReward);
    setToastMessage(`🎉 Claimed +${mission.xpReward} XP & ⭐ ${mission.starsReward} Wonder Star!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleClaimWeekly = (id, xp, stars) => {
    setWeeklyQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, claimed: true } : q))
    );
    claimMission(id, xp, stars);
    setToastMessage(`🎉 Claimed +${xp} XP & ⭐ ${stars} Wonder Stars!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toastBanner}>
          <Sparkles size={20} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>
            <Target size={28} className={styles.targetIcon} />
            <span>Daily Missions & Space Quests</span>
          </h1>
          <p className={styles.pageSubtitle}>
            Complete targeted cognitive challenges every 24 hours to earn bonus XP, rank up, and harvest Wonder Stars.
          </p>
        </div>

        <div className={styles.statsConsole}>
          <div className={styles.statPill}>
            <span>⭐ {totalStars} Stars</span>
          </div>
          <div className={styles.statPill}>
            <span>⚡ {totalXp} XP</span>
          </div>
          <div className={styles.statPill}>
            <span>🔥 {streak} Streak</span>
          </div>
        </div>
      </div>

      {/* 1. Daily Missions Section */}
      <section className={styles.sectionBlock}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleRow}>
            <Clock size={20} style={{ color: '#38BDF8' }} />
            <h2 className={styles.sectionTitle}>Daily Cognitive Missions</h2>
            <span className={styles.resetBadge}>Resets Daily at 00:00 UTC</span>
          </div>
        </div>

        <div className={styles.missionsGrid}>
          {dailyMissions.map((mission) => {
            const playLink = mission.gameId === 'all'
              ? '/dashboard/kids'
              : `/dashboard/kids/play/${mission.gameId}`;

            return (
              <div
                key={mission.id}
                className={`${styles.missionCard} ${mission.claimed ? styles.cardClaimed : ''}`}
              >
                <div className={styles.cardTop}>
                  <div className={styles.rewardBadges}>
                    <span className={styles.xpBadge}>+{mission.xpReward} XP</span>
                    <span className={styles.starBadge}>⭐ +{mission.starsReward}</span>
                  </div>

                  <h3 className={styles.missionTitle}>{mission.title}</h3>
                  <p className={styles.missionDesc}>{mission.desc}</p>
                </div>

                <div className={styles.cardActions}>
                  <Link to={playLink} className={styles.launchLink} title="Launch Lab">
                    <Play size={14} fill="currentColor" />
                    <span>Launch Lab ▷</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => !mission.claimed && handleClaim(mission)}
                    disabled={mission.claimed}
                    className={`${styles.claimBtn} ${mission.claimed ? styles.claimBtnClaimed : ''}`}
                  >
                    {mission.claimed ? (
                      <>
                        <CheckCircle2 size={16} />
                        <span>Claimed</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>Claim Reward</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Weekly Quests Section */}
      <section className={styles.sectionBlock}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleRow}>
            <Award size={20} style={{ color: '#F59E0B' }} />
            <h2 className={styles.sectionTitle}>Weekly Grand Quests</h2>
            <span className={styles.resetBadge}>Resets Every Monday</span>
          </div>
        </div>

        <div className={styles.weeklyGrid}>
          {weeklyQuests.map((quest) => {
            const isReady = quest.current >= quest.target;

            return (
              <div
                key={quest.id}
                className={`${styles.weeklyCard} ${quest.claimed ? styles.cardClaimed : ''}`}
              >
                <div className={styles.weeklyTop}>
                  <div className={styles.rewardBadges}>
                    <span className={styles.xpBadge}>+{quest.xpReward} XP</span>
                    <span className={styles.starBadge}>⭐ +{quest.starsReward} Stars</span>
                  </div>

                  <h3 className={styles.missionTitle}>{quest.title}</h3>
                  <p className={styles.missionDesc}>{quest.desc}</p>

                  <div className={styles.questProgress}>
                    <div className={styles.questLabelRow}>
                      <span>Objective Progress</span>
                      <span>{quest.current} / {quest.target}</span>
                    </div>
                    <div className={styles.track}>
                      <div
                        className={styles.fill}
                        style={{ width: `${Math.min(100, Math.round((quest.current / quest.target) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <button
                    type="button"
                    onClick={() => isReady && !quest.claimed && handleClaimWeekly(quest.id, quest.xpReward, quest.starsReward)}
                    disabled={quest.claimed || !isReady}
                    className={`${styles.claimBtn} ${quest.claimed ? styles.claimBtnClaimed : ''} ${!isReady ? styles.claimBtnDisabled : ''}`}
                  >
                    {quest.claimed ? (
                      <>
                        <CheckCircle2 size={16} />
                        <span>Claimed</span>
                      </>
                    ) : isReady ? (
                      <>
                        <Sparkles size={16} />
                        <span>Claim Reward</span>
                      </>
                    ) : (
                      <span>In Progress ({quest.current}/{quest.target})</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default MissionsPage;
