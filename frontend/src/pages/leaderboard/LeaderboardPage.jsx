import React, { useState } from 'react';
import { 
  Trophy, Medal, Flame, Star, Sparkles, Filter, 
  Search, Shield, Users, ArrowUp, ArrowDown, Award 
} from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export const LeaderboardPage = () => {
  const { user, progress } = useAuth();
  const { demographic } = useTheme();

  const [activeTab, setActiveTab] = useState('All');
  const [timeframe, setTimeframe] = useState('Weekly');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample demographic-aware leaderboard dataset
  const leaderboardData = [
    {
      rank: 1,
      name: 'Aarav Sharma',
      username: '@aarav_s',
      avatar: '👑',
      zone: 'kids',
      zoneLabel: 'Kids Zone',
      level: 14,
      streak: 12,
      accuracy: 96,
      xp: 4850,
      badge: 'Math Prodigy'
    },
    {
      rank: 2,
      name: 'Dr. Evelyn Reed',
      username: '@evelyn_neuro',
      avatar: '🌟',
      zone: 'seniors',
      zoneLabel: 'Senior Zone',
      level: 18,
      streak: 21,
      accuracy: 98,
      xp: 4620,
      badge: 'Botanical Master'
    },
    {
      rank: 3,
      name: 'Priyanka Sen',
      username: '@priya_code',
      avatar: '⚡',
      zone: 'adults',
      zoneLabel: 'Adult Zone',
      level: 16,
      streak: 9,
      accuracy: 94,
      xp: 4310,
      badge: 'Algorithmic Ace'
    },
    {
      rank: 4,
      name: user?.name || 'Jagadeesh Pinniboyina',
      username: '@jagadeesh',
      avatar: '🚀',
      zone: user?.demographic || demographic || 'adults',
      zoneLabel: (user?.demographic || demographic) === 'kids' ? 'Kids Zone' : (user?.demographic || demographic) === 'seniors' ? 'Senior Zone' : 'Adult Zone',
      level: 12,
      streak: progress?.currentStreak || 5,
      accuracy: 92,
      xp: progress?.totalXp || 3850,
      badge: 'Rising Star',
      isCurrentUser: true
    },
    {
      rank: 5,
      name: 'Rohan Mehta',
      username: '@rohan_m',
      avatar: '🎯',
      zone: 'adults',
      zoneLabel: 'Adult Zone',
      level: 11,
      streak: 4,
      accuracy: 89,
      xp: 3420,
      badge: 'Logic Master'
    },
    {
      rank: 6,
      name: 'Ananya Roy',
      username: '@ananya_r',
      avatar: '🎨',
      zone: 'kids',
      zoneLabel: 'Kids Zone',
      level: 9,
      streak: 7,
      accuracy: 91,
      xp: 3150,
      badge: 'Pattern Seeker'
    },
    {
      rank: 7,
      name: 'Robert Chen',
      username: '@robert_c',
      avatar: '🌿',
      zone: 'seniors',
      zoneLabel: 'Senior Zone',
      level: 10,
      streak: 14,
      accuracy: 95,
      xp: 2980,
      badge: 'Garden Guardian'
    },
    {
      rank: 8,
      name: 'Siddharth Rao',
      username: '@sid_dev',
      avatar: '💻',
      zone: 'adults',
      zoneLabel: 'Adult Zone',
      level: 8,
      streak: 3,
      accuracy: 87,
      xp: 2640,
      badge: 'SQL Commander'
    },
    {
      rank: 9,
      name: 'Tara Pillai',
      username: '@tara_kids',
      avatar: '🧸',
      zone: 'kids',
      zoneLabel: 'Kids Zone',
      level: 7,
      streak: 6,
      accuracy: 88,
      xp: 2210,
      badge: 'Maze Runner'
    },
    {
      rank: 10,
      name: 'Margaret Vance',
      username: '@margaret_v',
      avatar: '🌸',
      zone: 'seniors',
      zoneLabel: 'Senior Zone',
      level: 9,
      streak: 11,
      accuracy: 93,
      xp: 2050,
      badge: 'Word Whisperer'
    }
  ];

  const getZoneBadgeColor = (zone) => {
    switch (zone) {
      case 'kids':
        return { bg: 'rgba(255, 140, 66, 0.12)', text: '#FF8C42', border: 'rgba(255, 140, 66, 0.25)' };
      case 'seniors':
        return { bg: 'rgba(16, 185, 129, 0.12)', text: '#10B981', border: 'rgba(16, 185, 129, 0.25)' };
      default:
        return { bg: 'rgba(2, 132, 199, 0.12)', text: '#0284C7', border: 'rgba(2, 132, 199, 0.25)' };
    }
  };

  const filteredData = leaderboardData.filter((player) => {
    const matchesTab = 
      activeTab === 'All' ||
      (activeTab === 'Kids' && player.zone === 'kids') ||
      (activeTab === 'Adults' && player.zone === 'adults') ||
      (activeTab === 'Seniors' && player.zone === 'seniors');
    
    const matchesSearch = 
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.username.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const topThree = filteredData.slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#1E293B', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Trophy style={{ color: 'var(--brand-primary)' }} size={32} />
            Global Cognitive Leaderboard
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
            Live generational rankings computed via latency, accuracy, streak, and challenge difficulty.
          </p>
        </div>

        {/* Timeframe selector */}
        <div style={{ display: 'flex', backgroundColor: '#FFFFFF', padding: '0.25rem', borderRadius: '12px', border: '1.5px solid var(--border-subtle)' }}>
          {['Weekly', 'All-Time'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                backgroundColor: timeframe === tf ? 'var(--brand-primary)' : 'transparent',
                color: timeframe === tf ? '#FFFFFF' : '#64748B',
                transition: 'all 0.15s ease'
              }}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-3 md:grid-cols-1 gap-6" style={{ alignItems: 'flex-end' }}>
        {/* Rank 2 (Silver) */}
        {topThree[1] && (
          <Card
            style={{
              padding: '1.75rem 1.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: '2px solid #CBD5E1',
              position: 'relative'
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#E2E8F0',
                color: '#475569',
                fontWeight: 800,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                top: '-14px'
              }}
            >
              🥈 2
            </div>
            <div style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              {topThree[1].avatar}
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1E293B' }}>{topThree[1].name}</div>
            <div style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '0.5rem' }}>{topThree[1].username}</div>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                backgroundColor: getZoneBadgeColor(topThree[1].zone).bg,
                color: getZoneBadgeColor(topThree[1].zone).text,
                fontWeight: 700,
                marginBottom: '1rem'
              }}
            >
              {topThree[1].zoneLabel}
            </span>
            <div style={{ fontWeight: 800, fontSize: '1.35rem', color: 'var(--brand-primary)' }}>
              {topThree[1].xp.toLocaleString()} XP
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <span>Lvl {topThree[1].level}</span>
              <span>•</span>
              <span>🔥 {topThree[1].streak}d Streak</span>
            </div>
          </Card>
        )}

        {/* Rank 1 (Gold - Elevated) */}
        {topThree[0] && (
          <Card
            style={{
              padding: '2.25rem 1.75rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: '2px solid #F59E0B',
              boxShadow: '0 8px 24px rgba(245, 158, 11, 0.18)',
              position: 'relative',
              transform: 'translateY(-10px)'
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: '#FEF3C7',
                color: '#B45309',
                fontWeight: 900,
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                top: '-20px',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
              }}
            >
              👑 1
            </div>
            <div style={{ fontSize: '3.2rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              {topThree[0].avatar}
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#1E293B' }}>{topThree[0].name}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '0.65rem' }}>{topThree[0].username}</div>
            <span
              style={{
                fontSize: '0.78rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                backgroundColor: getZoneBadgeColor(topThree[0].zone).bg,
                color: getZoneBadgeColor(topThree[0].zone).text,
                fontWeight: 700,
                marginBottom: '1rem'
              }}
            >
              {topThree[0].zoneLabel}
            </span>
            <div style={{ fontWeight: 900, fontSize: '1.6rem', color: 'var(--brand-primary)' }}>
              {topThree[0].xp.toLocaleString()} XP
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748B', display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <span>Lvl {topThree[0].level}</span>
              <span>•</span>
              <span>🔥 {topThree[0].streak}d Streak</span>
              <span>•</span>
              <span>{topThree[0].accuracy}% Acc</span>
            </div>
          </Card>
        )}

        {/* Rank 3 (Bronze) */}
        {topThree[2] && (
          <Card
            style={{
              padding: '1.75rem 1.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: '2px solid #D97706',
              position: 'relative'
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#FFEDD5',
                color: '#9A3412',
                fontWeight: 800,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                top: '-14px'
              }}
            >
              🥉 3
            </div>
            <div style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              {topThree[2].avatar}
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1E293B' }}>{topThree[2].name}</div>
            <div style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '0.5rem' }}>{topThree[2].username}</div>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                backgroundColor: getZoneBadgeColor(topThree[2].zone).bg,
                color: getZoneBadgeColor(topThree[2].zone).text,
                fontWeight: 700,
                marginBottom: '1rem'
              }}
            >
              {topThree[2].zoneLabel}
            </span>
            <div style={{ fontWeight: 800, fontSize: '1.35rem', color: 'var(--brand-primary)' }}>
              {topThree[2].xp.toLocaleString()} XP
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <span>Lvl {topThree[2].level}</span>
              <span>•</span>
              <span>🔥 {topThree[2].streak}d Streak</span>
            </div>
          </Card>
        )}
      </div>

      {/* Filter and Search Bar */}
      <Card style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['All', 'Kids', 'Adults', 'Seniors'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.55rem 1.15rem',
                  borderRadius: '10px',
                  border: '1.5px solid',
                  borderColor: activeTab === tab ? 'var(--brand-primary)' : 'var(--border-subtle)',
                  backgroundColor: activeTab === tab ? 'rgba(94, 92, 230, 0.08)' : '#FFFFFF',
                  color: activeTab === tab ? 'var(--brand-primary)' : '#64748B',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab === 'All' ? 'All Demographic Zones' : `${tab} Zone`}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search player or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.4rem',
                borderRadius: '10px',
                border: '1.5px solid var(--border-subtle)',
                backgroundColor: '#F8FAFD',
                fontSize: '0.88rem'
              }}
            />
          </div>
        </div>
      </Card>

      {/* Leaderboard Table (PART-3 SPEC) */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFD', borderBottom: '1.5px solid var(--border-subtle)', color: '#64748B', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '1rem 1.25rem', width: '80px' }}>Rank</th>
                <th style={{ padding: '1rem 1.25rem' }}>Player</th>
                <th style={{ padding: '1rem 1.25rem' }}>Demographic</th>
                <th style={{ padding: '1rem 1.25rem' }}>Level</th>
                <th style={{ padding: '1rem 1.25rem' }}>Streak</th>
                <th style={{ padding: '1rem 1.25rem' }}>Accuracy</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Total XP</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((player) => {
                const zoneStyle = getZoneBadgeColor(player.zone);
                return (
                  <tr
                    key={player.rank}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      backgroundColor: player.isCurrentUser ? 'rgba(94, 92, 230, 0.05)' : 'transparent',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    {/* Rank */}
                    <td style={{ padding: '1.1rem 1.25rem', fontWeight: 800, fontSize: '1rem', color: '#1E293B' }}>
                      {player.rank === 1 ? '🥇 1' : player.rank === 2 ? '🥈 2' : player.rank === 3 ? '🥉 3' : `#${player.rank}`}
                    </td>

                    {/* Player Info */}
                    <td style={{ padding: '1.1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            backgroundColor: '#F1F5F9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.3rem'
                          }}
                        >
                          {player.avatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            {player.name}
                            {player.isCurrentUser && (
                              <span style={{ fontSize: '0.72rem', backgroundColor: 'var(--brand-primary)', color: '#FFFFFF', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                                YOU
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                            {player.username} • <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>{player.badge}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Zone Badge */}
                    <td style={{ padding: '1.1rem 1.25rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '999px',
                          backgroundColor: zoneStyle.bg,
                          color: zoneStyle.text,
                          fontWeight: 700,
                          border: `1px solid ${zoneStyle.border}`
                        }}
                      >
                        {player.zoneLabel}
                      </span>
                    </td>

                    {/* Level */}
                    <td style={{ padding: '1.1rem 1.25rem', fontWeight: 600, color: '#334155' }}>
                      Lvl {player.level}
                    </td>

                    {/* Streak */}
                    <td style={{ padding: '1.1rem 1.25rem', fontWeight: 700, color: '#FF8C42' }}>
                      🔥 {player.streak} days
                    </td>

                    {/* Accuracy */}
                    <td style={{ padding: '1.1rem 1.25rem', fontWeight: 600, color: '#334155' }}>
                      {player.accuracy}%
                    </td>

                    {/* XP */}
                    <td style={{ padding: '1.1rem 1.25rem', textAlign: 'right', fontWeight: 800, fontSize: '1.05rem', color: 'var(--brand-primary)' }}>
                      {player.xp.toLocaleString()} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default LeaderboardPage;
