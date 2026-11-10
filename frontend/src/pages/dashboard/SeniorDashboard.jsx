import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sun, Play, Smile, Compass, Layers, Brain, Grid } from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const SeniorDashboard = () => {
  const { user, progress } = useAuth();

  const streak = user?.streak || progress?.currentStreak || 1;
  const level = user?.level || progress?.level || 1;
  const points = user?.points || progress?.totalXp || 120;
  const displayName = user?.name || user?.firstName || 'Friend';

  const seniorGames = [
    {
      title: 'Memory Garden',
      slug: 'memory-garden',
      desc: 'Delight in peaceful botanical flower pairings designed for soothing visual recall.',
      icon: '🌸',
      category: 'Card Pairs'
    },
    {
      title: 'Everyday Math',
      slug: 'everyday-math',
      desc: 'Maintain practical financial sharpness, grocery budgeting, and mental calculations.',
      icon: '💵',
      category: 'Choice Logic'
    },
    {
      title: 'Word Garden',
      slug: 'word-garden',
      desc: 'Reawaken vocabulary, proverbs, and soothing word associations in a calm atmosphere.',
      icon: '📖',
      category: 'Word Pairs'
    },
    {
      title: 'Sequence Steps',
      slug: 'sequence-steps',
      desc: 'Follow gentle illuminated stepping stones across a tranquil zen pond.',
      icon: '🌿',
      category: 'Grid Stepping'
    },
    {
      title: 'Picture Puzzle',
      slug: 'picture-puzzle',
      desc: 'Stroll scenic garden paths from the morning gate to the gazebo.',
      icon: '⛲',
      category: 'Scenic Path'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Calm Senior Greeting Banner */}
      <div
        className="card-base"
        style={{
          backgroundColor: 'var(--color-primary-light)',
          border: '2px solid var(--color-primary)',
          padding: '2.5rem 2rem',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
          <Sun size={32} style={{ color: 'var(--color-primary)' }} />
          <h1 style={{ fontSize: '2.2rem', color: 'var(--text-primary)' }}>
            Good Day, {displayName}
          </h1>
        </div>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '720px' }}>
          Welcome back to your mindful brain sanctuary. All 5 Senior Zone exercises are available with 5 gentle levels each.
        </p>

        {/* Vitality Streak Bar */}
        <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Heart size={28} style={{ color: 'var(--color-primary)' }} />
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>{streak} Days Active</div>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Vitality Streak</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Smile size={28} style={{ color: 'var(--color-accent)' }} />
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>Level {level} Vitality</div>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{points} Mind Points</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Senior Zone Games */}
      <div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.25rem' }}>Senior Zone Activities (5 Games with 5 Levels Each)</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {seniorGames.map((act) => (
            <Card
              key={act.slug}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.75rem 2rem',
                border: '2px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <span style={{ fontSize: '2.5rem' }}>{act.icon}</span>
                <div>
                  <span className="demographic-pill" style={{ fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                    {act.category}
                  </span>
                  <h3 style={{ fontSize: '1.45rem', marginBottom: '0.35rem' }}>{act.title}</h3>
                  <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>{act.desc}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link to={`/games/${act.slug}`}>
                  <Button variant="secondary" size="md">
                    Levels
                  </Button>
                </Link>
                <Link to={`/play/${act.slug}/1`}>
                  <Button variant="primary" size="md" icon={<Play size={18} />}>
                    Start Level 1
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeniorDashboard;
