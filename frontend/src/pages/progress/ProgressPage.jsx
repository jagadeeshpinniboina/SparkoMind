import React, { useState } from 'react';
import { 
  TrendingUp, Award, Target, Flame, CheckCircle2, 
  Sparkles, Zap, Brain, Layers, BarChart3, ChevronRight 
} from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export const ProgressPage = () => {
  const { user, progress, updateProfileProgress } = useAuth();
  const { demographic } = useTheme();

  const [missions, setMissions] = useState([
    { id: 1, title: 'Complete 2 Memory Match games', xp: 50, progress: 2, total: 2, claimed: false },
    { id: 2, title: 'Score 90%+ Accuracy on Logic Arena', xp: 75, progress: 1, total: 1, claimed: false },
    { id: 3, title: 'Achieve a 3-Day Workout Streak', xp: 100, progress: Math.min(3, progress?.currentStreak || 1), total: 3, claimed: false },
    { id: 4, title: 'Try a game in the Spatial Category', xp: 50, progress: 1, total: 1, claimed: true }
  ]);

  const handleClaimMission = (id, xp) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, claimed: true } : m))
    );
    if (updateProfileProgress && progress) {
      updateProfileProgress({
        totalXp: (progress.totalXp || 0) + xp
      });
    }
  };

  const gameProgressList = [
    { title: 'Memory Match', category: 'Memory', level: 3, maxLevel: 5, accuracy: 94 },
    { title: 'Code Sprint', category: 'Sequence', level: 2, maxLevel: 5, accuracy: 88 },
    { title: 'Logic Arena', category: 'Logic', level: 4, maxLevel: 5, accuracy: 92 },
    { title: 'Maze Explorer', category: 'Spatial', level: 3, maxLevel: 5, accuracy: 85 },
    { title: 'Everyday Math', category: 'Logic', level: 5, maxLevel: 5, accuracy: 98 }
  ];

  const achievementBadges = [
    { title: 'Quick Learner', desc: 'Completed first 3 challenges', icon: '⚡', unlocked: true },
    { title: 'Memory Master', desc: 'Matched all pairs in under 30s', icon: '🧠', unlocked: true },
    { title: '5-Day Streak', desc: 'Trained consecutively for 5 days', icon: '🔥', unlocked: (progress?.currentStreak || 1) >= 5 },
    { title: 'Logic Solver', desc: 'Solved 10 deductive syllogisms', icon: '🎯', unlocked: true },
    { title: 'Grandmaster', desc: 'Reached Level 10 across all games', icon: '👑', unlocked: false }
  ];

  // Overall calculations (PART-3 SPEC: Circular progress gauge)
  const totalCompletedLevels = 12;
  const totalLevelsCatalogue = 20;
  const overallPercentage = Math.round((totalCompletedLevels / totalLevelsCatalogue) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2rem', color: '#1E293B', marginBottom: '0.25rem' }}>My Progress & Analytics</h1>
        <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
          Detailed cognitive velocity, level completion gauge, and mission rewards.
        </p>
      </div>

      {/* Top Row: Circular Progress Gauge & Summary Metrics (PART-3 SPEC) */}
      <div className="grid grid-cols-3 md:grid-cols-1 gap-6">
        {/* Circular Overall Gauge */}
        <Card style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: '130px', height: '130px', marginBottom: '1.25rem' }}>
            <svg width="130" height="130" viewBox="0 0 130 130">
              <circle
                cx="65"
                cy="65"
                r="54"
                fill="none"
                stroke="#E5E9F2"
                strokeWidth="12"
              />
              <circle
                cx="65"
                cy="65"
                r="54"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="12"
                strokeDasharray="339.29"
                strokeDashoffset={339.29 - (339.29 * overallPercentage) / 100}
                strokeLinecap="round"
                transform="rotate(-90 65 65)"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#5E5CE6" />
                  <stop offset="100%" stopColor="#FF8C42" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E293B' }}>{overallPercentage}%</span>
              <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase' }}>Overall</span>
            </div>
          </div>

          <h3 style={{ fontSize: '1.15rem', color: '#1E293B', marginBottom: '0.25rem' }}>
            {totalCompletedLevels} of {totalLevelsCatalogue} Levels Cleared
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
            You are advancing faster than 78% of trainees this week!
          </p>
        </Card>

        {/* Cognitive Velocity Stats */}
        <Card style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span className="demographic-pill" style={{ marginBottom: '0.75rem' }}>Cognitive Index</span>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.25rem' }}>
              {progress?.totalXp || 0} <span style={{ fontSize: '1rem', color: '#FF8C42', fontWeight: 700 }}>XP</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
              Cumulative cognitive score based on speed, zero-trust accuracy, and daily streaks.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Current Level</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#5E5CE6' }}>Level {progress?.level || 1}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Active Streak</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FF8C42' }}>{progress?.currentStreak || 1} Days 🔥</div>
            </div>
          </div>
        </Card>

        {/* Category Breakdown */}
        <Card style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#1E293B', marginBottom: '1rem' }}>Category Mastery</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { name: 'Memory', pct: 85, color: '#5E5CE6' },
              { name: 'Logic', pct: 92, color: '#0284C7' },
              { name: 'Spatial', pct: 78, color: '#10B981' },
              { name: 'Sequence', pct: 88, color: '#FF8C42' }
            ].map((c) => (
              <div key={c.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 600, color: '#475569' }}>{c.name}</span>
                  <span style={{ fontWeight: 700, color: c.color }}>{c.pct}%</span>
                </div>
                <div style={{ height: '7px', backgroundColor: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${c.pct}%`, backgroundColor: c.color, borderRadius: '9999px' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Middle Row: Detailed Progress per Game (PART-3 SPEC) */}
      <Card style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.35rem', color: '#1E293B', marginBottom: '1.25rem' }}>
          Detailed Game Progress
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {gameProgressList.map((g) => (
            <div
              key={g.title}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: '#F8FAFD',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1E293B' }}>{g.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Category: {g.category}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Current Level</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#5E5CE6' }}>Level {g.level} / {g.maxLevel}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Accuracy Avg</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#10B981' }}>{g.accuracy}%</div>
                </div>

                <div style={{ width: '120px' }}>
                  <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(g.level / g.maxLevel) * 100}%`, backgroundColor: '#5E5CE6', borderRadius: '9999px' }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Bottom Row: Daily Missions Checklist (PART-3 SPEC) & Achievement Badges */}
      <div className="grid grid-cols-2 md:grid-cols-1 gap-6">
        {/* Daily Missions */}
        <Card style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.3rem', color: '#1E293B' }}>🎯 Daily Missions</h2>
            <span style={{ fontSize: '0.82rem', color: '#64748B' }}>Resets at midnight</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {missions.map((m) => {
              const isReadyToClaim = m.progress >= m.total && !m.claimed;
              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.95rem 1.15rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: m.claimed ? '#F8FAFD' : '#FFFFFF'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem', color: m.claimed ? '#94A3B8' : '#1E293B', textDecoration: m.claimed ? 'line-through' : 'none' }}>
                      {m.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>
                      Progress: {m.progress} / {m.total} • <strong>+{m.xp} XP</strong>
                    </div>
                  </div>

                  <div>
                    {m.claimed ? (
                      <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <CheckCircle2 size={16} /> Claimed
                      </span>
                    ) : isReadyToClaim ? (
                      <button
                        onClick={() => handleClaimMission(m.id, m.xp)}
                        style={{
                          padding: '0.4rem 0.95rem',
                          borderRadius: '8px',
                          backgroundColor: '#10B981',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        Claim XP
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>In Progress</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Achievement Badges */}
        <Card style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.3rem', color: '#1E293B' }}>🏆 Key Achievements</h2>
            <span style={{ fontSize: '0.82rem', color: '#5E5CE6', fontWeight: 600 }}>4 of 5 Unlocked</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {achievementBadges.map((b) => (
              <div
                key={b.title}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: b.unlocked ? '#FFFFFF' : '#F8FAFD',
                  opacity: b.unlocked ? 1 : 0.6
                }}
              >
                <div style={{ fontSize: '1.8rem' }}>{b.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1E293B' }}>{b.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{b.desc}</div>
                </div>
                {b.unlocked ? (
                  <CheckCircle2 size={18} color="#10B981" />
                ) : (
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>Locked</span>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProgressPage;
