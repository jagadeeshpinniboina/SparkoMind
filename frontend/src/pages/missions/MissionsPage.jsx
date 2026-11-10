import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, Flame, Clock, CheckCircle2, Award, 
  Sparkles, Zap, ArrowRight, Play, RefreshCw 
} from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export const MissionsPage = () => {
  const { user, progress, updateProfileProgress } = useAuth();
  const { demographic } = useTheme();

  const [claimedNotice, setClaimedNotice] = useState(null);

  const [dailyMissions, setDailyMissions] = useState([
    {
      id: 'd1',
      title: 'Warm Up Working Memory',
      desc: 'Complete 2 rounds of Memory Match or Memory Garden.',
      progress: 2,
      total: 2,
      xp: 50,
      claimed: false,
      gameSlug: 'memory-match'
    },
    {
      id: 'd2',
      title: 'Sharp Shooter Accuracy',
      desc: 'Achieve at least 90% accuracy on any Logic Arena challenge.',
      progress: 1,
      total: 1,
      xp: 75,
      claimed: false,
      gameSlug: 'logic-arena'
    },
    {
      id: 'd3',
      title: 'Algorithmic Speed',
      desc: 'Submit a valid sequence solution in Code Sprint under 30 seconds.',
      progress: 0,
      total: 1,
      xp: 100,
      claimed: false,
      gameSlug: 'code-sprint'
    },
    {
      id: 'd4',
      title: 'Spatial Pathfinder',
      desc: 'Clear Level 2 in Maze Explorer or Picture Puzzle.',
      progress: 1,
      total: 1,
      xp: 60,
      claimed: true,
      gameSlug: 'maze-explorer'
    }
  ]);

  const [weeklyQuests, setWeeklyQuests] = useState([
    {
      id: 'w1',
      title: 'Generational Tour',
      desc: 'Play at least one challenge from Kids, Adult, and Senior zones.',
      progress: 3,
      total: 3,
      xp: 250,
      claimed: false
    },
    {
      id: 'w2',
      title: 'The Relentless Streak',
      desc: 'Train for 5 consecutive days this week without missing.',
      progress: Math.min(5, progress?.currentStreak || 5),
      total: 5,
      xp: 350,
      claimed: false
    },
    {
      id: 'w3',
      title: 'Level Master',
      desc: 'Reach Level 5 in any 3 games across the catalogue.',
      progress: 2,
      total: 3,
      xp: 400,
      claimed: false
    }
  ]);

  const handleClaimDaily = (id, xp, title) => {
    setDailyMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, claimed: true } : m))
    );
    if (updateProfileProgress && progress) {
      updateProfileProgress({
        totalXp: (progress.totalXp || 0) + xp
      });
    }
    setClaimedNotice(`+${xp} XP Claimed for "${title}"!`);
    setTimeout(() => setClaimedNotice(null), 3500);
  };

  const handleClaimWeekly = (id, xp, title) => {
    setWeeklyQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, claimed: true } : q))
    );
    if (updateProfileProgress && progress) {
      updateProfileProgress({
        totalXp: (progress.totalXp || 0) + xp
      });
    }
    setClaimedNotice(`+${xp} XP Claimed for "${title}"!`);
    setTimeout(() => setClaimedNotice(null), 3500);
  };

  const totalDailyAvailable = dailyMissions.reduce((acc, m) => acc + m.xp, 0);
  const totalDailyClaimed = dailyMissions.filter((m) => m.claimed).reduce((acc, m) => acc + m.xp, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#1E293B', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Target style={{ color: 'var(--brand-primary)' }} size={32} />
            Daily Missions & Quests
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
            Complete targeted cognitive drills every 24 hours to accelerate your level progression and build habits.
          </p>
        </div>

        {/* Streak Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            backgroundColor: '#FFF2EB',
            border: '1.5px solid #FFD8C4',
            padding: '0.75rem 1.25rem',
            borderRadius: '14px'
          }}
        >
          <div style={{ fontSize: '1.6rem' }}>🔥</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#EA580C' }}>
              {progress?.currentStreak || 5} Day Streak Active!
            </div>
            <div style={{ fontSize: '0.75rem', color: '#9A3412', fontWeight: 600 }}>
              1.2x Multiplier applied to all missions
            </div>
          </div>
        </div>
      </div>

      {/* Floating Notice */}
      {claimedNotice && (
        <div
          style={{
            backgroundColor: '#10B981',
            color: '#FFFFFF',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
          }}
        >
          <Sparkles size={20} />
          {claimedNotice}
        </div>
      )}

      {/* Daily Progress Gauge Banner */}
      <Card
        style={{
          background: 'linear-gradient(135deg, rgba(94, 92, 230, 0.06) 0%, rgba(2, 132, 199, 0.06) 100%)',
          border: '1.5px solid rgba(94, 92, 230, 0.18)',
          padding: '1.75rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              <Clock size={16} /> Resets in 11 hours 42 minutes
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1E293B' }}>
              Daily XP Progress: <span style={{ color: 'var(--brand-primary)' }}>{totalDailyClaimed} / {totalDailyAvailable} XP</span>
            </div>
          </div>
          <div style={{ minWidth: '220px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem' }}>
              <span>Daily Completion</span>
              <span>{Math.round((totalDailyClaimed / totalDailyAvailable) * 100)}%</span>
            </div>
            <div style={{ width: '100%', height: '10px', backgroundColor: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${(totalDailyClaimed / totalDailyAvailable) * 100}%`,
                  height: '100%',
                  background: 'var(--brand-gradient)',
                  borderRadius: '999px'
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Daily Missions List */}
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1E293B', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>⚡</span> Today's Daily Challenges
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {dailyMissions.map((m) => {
            const isCompleted = m.progress >= m.total;
            return (
              <Card
                key={m.id}
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  backgroundColor: m.claimed ? '#F8FAFC' : '#FFFFFF',
                  border: m.claimed ? '1.5px solid #E2E8F0' : isCompleted ? '1.5px solid rgba(16, 185, 129, 0.4)' : '1.5px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '280px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: m.claimed ? '#E2E8F0' : isCompleted ? 'rgba(16, 185, 129, 0.12)' : 'rgba(94, 92, 230, 0.1)',
                      color: m.claimed ? '#94A3B8' : isCompleted ? '#10B981' : 'var(--brand-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800
                    }}
                  >
                    {m.claimed ? <CheckCircle2 size={22} /> : isCompleted ? <Award size={22} /> : <Target size={22} />}
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: m.claimed ? '#64748B' : '#1E293B', textDecoration: m.claimed ? 'line-through' : 'none' }}>
                      {m.title}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.2rem' }}>
                      {m.desc}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--brand-primary)' }}>
                      +{m.xp} XP
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                      Progress: {m.progress}/{m.total}
                    </div>
                  </div>

                  {m.claimed ? (
                    <span
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '10px',
                        backgroundColor: '#F1F5F9',
                        color: '#64748B',
                        fontSize: '0.85rem',
                        fontWeight: 700
                      }}
                    >
                      Claimed ✓
                    </span>
                  ) : isCompleted ? (
                    <button
                      onClick={() => handleClaimDaily(m.id, m.xp, m.title)}
                      style={{
                        padding: '0.6rem 1.25rem',
                        borderRadius: '10px',
                        backgroundColor: '#10B981',
                        color: '#FFFFFF',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                      }}
                    >
                      Claim XP →
                    </button>
                  ) : (
                    <Link to={`/play/${m.gameSlug || 'memory-match'}/1`}>
                      <button
                        style={{
                          padding: '0.6rem 1.25rem',
                          borderRadius: '10px',
                          backgroundColor: 'var(--brand-primary)',
                          color: '#FFFFFF',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <Play size={14} /> Play Now
                      </button>
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Weekly Quests Section */}
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1E293B', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🌟</span> Weekly Master Quests (Resets Monday)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {weeklyQuests.map((q) => {
            const isCompleted = q.progress >= q.total;
            const pct = Math.min(100, Math.round((q.progress / q.total) * 100));

            return (
              <Card
                key={q.id}
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  backgroundColor: q.claimed ? '#F8FAFC' : '#FFFFFF',
                  border: q.claimed ? '1.5px solid #E2E8F0' : isCompleted ? '1.5px solid rgba(16, 185, 129, 0.4)' : '1.5px solid var(--border-subtle)'
                }}
              >
                <div style={{ flex: 1, minWidth: '300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(94, 92, 230, 0.1)', color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
                      Weekly
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1E293B' }}>{q.title}</span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '0.75rem' }}>{q.desc}</p>

                  <div style={{ maxWidth: '340px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748B', fontWeight: 600, marginBottom: '0.25rem' }}>
                      <span>Progress: {q.progress}/{q.total}</span>
                      <span>{pct}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, var(--brand-primary), #FF8C42)',
                          borderRadius: '999px'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 900, fontSize: '1.25rem', color: 'var(--brand-primary)' }}>
                      +{q.xp} XP
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Mastery Reward</div>
                  </div>

                  {q.claimed ? (
                    <span
                      style={{
                        padding: '0.6rem 1.25rem',
                        borderRadius: '10px',
                        backgroundColor: '#F1F5F9',
                        color: '#64748B',
                        fontSize: '0.85rem',
                        fontWeight: 700
                      }}
                    >
                      Claimed ✓
                    </span>
                  ) : isCompleted ? (
                    <button
                      onClick={() => handleClaimWeekly(q.id, q.xp, q.title)}
                      style={{
                        padding: '0.65rem 1.35rem',
                        borderRadius: '10px',
                        backgroundColor: '#10B981',
                        color: '#FFFFFF',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                      }}
                    >
                      Claim Master XP →
                    </button>
                  ) : (
                    <span
                      style={{
                        padding: '0.6rem 1.25rem',
                        borderRadius: '10px',
                        backgroundColor: '#F8FAFC',
                        color: '#94A3B8',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        border: '1px solid #E2E8F0'
                      }}
                    >
                      In Progress
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MissionsPage;
