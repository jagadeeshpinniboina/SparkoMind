import React, { useState } from 'react';
import { 
  Trophy, Award, Star, Flame, Lock, CheckCircle2, 
  Sparkles, Zap, Brain, Shield, Compass, ChevronRight 
} from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const AchievementsPage = () => {
  const { user, progress } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');

  const allAchievements = [
    {
      id: 'first_spark',
      title: 'First Spark',
      desc: 'Complete your very first brain workout challenge.',
      tier: 'Bronze',
      xpReward: 50,
      icon: '⚡',
      category: 'Milestones',
      unlocked: true,
      progress: 1,
      total: 1,
      unlockedDate: 'Oct 28, 2026'
    },
    {
      id: 'quick_thinker',
      title: 'Quick Thinker',
      desc: 'Solve any challenge in under 15 seconds with 100% accuracy.',
      tier: 'Silver',
      xpReward: 100,
      icon: '⏱️',
      category: 'Velocity',
      unlocked: true,
      progress: 1,
      total: 1,
      unlockedDate: 'Nov 02, 2026'
    },
    {
      id: 'memory_virtuoso',
      title: 'Memory Virtuoso',
      desc: 'Complete Level 5 in Memory Match without a single mismatch.',
      tier: 'Gold',
      xpReward: 250,
      icon: '🧠',
      category: 'Memory',
      unlocked: true,
      progress: 5,
      total: 5,
      unlockedDate: 'Nov 04, 2026'
    },
    {
      id: 'streak_pioneer',
      title: 'Consistency Pioneer',
      desc: 'Maintain a 5-day continuous brain training streak.',
      tier: 'Silver',
      xpReward: 150,
      icon: '🔥',
      category: 'Streaks',
      unlocked: (progress?.currentStreak || 5) >= 5,
      progress: Math.min(5, progress?.currentStreak || 5),
      total: 5,
      unlockedDate: 'Nov 05, 2026'
    },
    {
      id: 'streak_titan',
      title: 'Streak Titan',
      desc: 'Maintain a 14-day continuous brain training streak.',
      tier: 'Platinum',
      xpReward: 500,
      icon: '👑',
      category: 'Streaks',
      unlocked: false,
      progress: Math.min(14, progress?.currentStreak || 5),
      total: 14
    },
    {
      id: 'logic_champion',
      title: 'Logic Champion',
      desc: 'Answer 25 logical reasoning challenges correctly.',
      tier: 'Gold',
      xpReward: 200,
      icon: '🎯',
      category: 'Logic',
      unlocked: true,
      progress: 25,
      total: 25,
      unlockedDate: 'Nov 06, 2026'
    },
    {
      id: 'code_runner',
      title: 'Algorithmic Architect',
      desc: 'Solve all 5 levels of Code Sprint or Robo Rescue.',
      tier: 'Silver',
      xpReward: 175,
      icon: '💻',
      category: 'Logic',
      unlocked: true,
      progress: 5,
      total: 5,
      unlockedDate: 'Nov 06, 2026'
    },
    {
      id: 'spatial_navigator',
      title: 'Spatial Pathfinder',
      desc: 'Navigate Maze Explorer Level 5 with zero wall collisions.',
      tier: 'Gold',
      xpReward: 220,
      icon: '🧭',
      category: 'Spatial',
      unlocked: false,
      progress: 3,
      total: 5
    },
    {
      id: 'demographic_explorer',
      title: 'Generational Polymath',
      desc: 'Experience at least one game in all three demographic zones.',
      tier: 'Gold',
      xpReward: 300,
      icon: '🌈',
      category: 'Milestones',
      unlocked: true,
      progress: 3,
      total: 3,
      unlockedDate: 'Nov 07, 2026'
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      desc: 'Attain 100% accuracy on 10 consecutive games.',
      tier: 'Platinum',
      xpReward: 400,
      icon: '✨',
      category: 'Velocity',
      unlocked: false,
      progress: 7,
      total: 10
    },
    {
      id: 'botanical_zen',
      title: 'Botanical Harmony',
      desc: 'Cultivate all plants to full bloom in Memory Garden.',
      tier: 'Bronze',
      xpReward: 80,
      icon: '🌸',
      category: 'Memory',
      unlocked: true,
      progress: 5,
      total: 5,
      unlockedDate: 'Nov 03, 2026'
    },
    {
      id: 'grandmaster_elite',
      title: 'SparkoMind Grandmaster',
      desc: 'Earn 10,000 XP and reach Level 20 across the platform.',
      tier: 'Platinum',
      xpReward: 1000,
      icon: '🏆',
      category: 'Milestones',
      unlocked: false,
      progress: 3850,
      total: 10000
    }
  ];

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'Bronze':
        return { color: '#B45309', bg: '#FEF3C7', border: '#FDE68A' };
      case 'Silver':
        return { color: '#475569', bg: '#F1F5F9', border: '#CBD5E1' };
      case 'Gold':
        return { color: '#D97706', bg: '#FFFBEB', border: '#FCD34D' };
      case 'Platinum':
        return { color: '#5E5CE6', bg: '#EEF2FF', border: '#C7D2FE' };
      default:
        return { color: '#64748B', bg: '#F8FAFC', border: '#E2E8F0' };
    }
  };

  const unlockedList = allAchievements.filter((a) => a.unlocked);
  const totalUnlockedXp = unlockedList.reduce((acc, curr) => acc + curr.xpReward, 0);

  const filteredAchievements = allAchievements.filter((a) => {
    if (activeFilter === 'Unlocked') return a.unlocked;
    if (activeFilter === 'In Progress') return !a.unlocked && a.progress > 0;
    if (activeFilter === 'Locked') return !a.unlocked && a.progress === 0;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2rem', color: '#1E293B', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Award style={{ color: 'var(--brand-primary)' }} size={32} />
          Badges & Achievements
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
          Unlock commemorative trophies and bonus XP as your cognitive power expands across age domains.
        </p>
      </div>

      {/* Summary Banner */}
      <Card
        style={{
          background: 'linear-gradient(135deg, rgba(94, 92, 230, 0.08) 0%, rgba(255, 140, 66, 0.08) 100%)',
          border: '1.5px solid rgba(94, 92, 230, 0.2)',
          padding: '2rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'var(--brand-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 8px 20px rgba(94, 92, 230, 0.35)'
              }}
            >
              <Trophy size={32} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E293B' }}>
                {unlockedList.length} of {allAchievements.length} Unlocked ({Math.round((unlockedList.length / allAchievements.length) * 100)}%)
              </div>
              <div style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '0.2rem' }}>
                Total Achievement Bonus: <strong style={{ color: 'var(--brand-primary)' }}>+{totalUnlockedXp.toLocaleString()} XP</strong>
              </div>
            </div>
          </div>

          <div style={{ minWidth: '220px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem' }}>
              <span>Progress to Next Tier</span>
              <span>{unlockedList.length}/{allAchievements.length}</span>
            </div>
            <div style={{ width: '100%', height: '10px', backgroundColor: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${(unlockedList.length / allAchievements.length) * 100}%`,
                  height: '100%',
                  background: 'var(--brand-gradient)',
                  borderRadius: '999px',
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {['All', 'Unlocked', 'In Progress', 'Locked'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            style={{
              padding: '0.5rem 1.15rem',
              borderRadius: '10px',
              border: '1.5px solid',
              borderColor: activeFilter === tab ? 'var(--brand-primary)' : 'var(--border-subtle)',
              backgroundColor: activeFilter === tab ? 'rgba(94, 92, 230, 0.08)' : '#FFFFFF',
              color: activeFilter === tab ? 'var(--brand-primary)' : '#64748B',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Achievement Cards Grid */}
      <div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
        {filteredAchievements.map((item) => {
          const tierStyle = getTierBadge(item.tier);
          const pct = Math.min(100, Math.round((item.progress / item.total) * 100));

          return (
            <Card
              key={item.id}
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: item.unlocked ? 1 : 0.82,
                position: 'relative',
                border: item.unlocked ? `1.5px solid ${tierStyle.border}` : '1.5px solid var(--border-subtle)',
                backgroundColor: item.unlocked ? '#FFFFFF' : '#F8FAFC'
              }}
            >
              <div>
                {/* Top Badge & Tier */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: item.unlocked ? tierStyle.bg : '#E2E8F0',
                      border: `1.5px solid ${item.unlocked ? tierStyle.border : '#CBD5E1'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.6rem',
                      filter: item.unlocked ? 'none' : 'grayscale(100%)'
                    }}
                  >
                    {item.icon}
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                        backgroundColor: tierStyle.bg,
                        color: tierStyle.color,
                        border: `1px solid ${tierStyle.border}`,
                        textTransform: 'uppercase'
                      }}
                    >
                      {item.tier}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(94, 92, 230, 0.1)',
                        color: 'var(--brand-primary)'
                      }}
                    >
                      +{item.xpReward} XP
                    </span>
                  </div>
                </div>

                {/* Title & Desc */}
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.35rem' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {item.desc}
                </p>
              </div>

              {/* Bottom Progress or Unlocked Status */}
              <div>
                {item.unlocked ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: '#10B981', fontWeight: 600 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <CheckCircle2 size={16} /> Unlocked
                    </span>
                    <span style={{ color: '#94A3B8' }}>{item.unlockedDate}</span>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748B', fontWeight: 600, marginBottom: '0.35rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Lock size={12} /> Progress
                      </span>
                      <span>{item.progress} / {item.total} ({pct}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '7px', backgroundColor: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          backgroundColor: 'var(--brand-primary)',
                          borderRadius: '999px'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsPage;
