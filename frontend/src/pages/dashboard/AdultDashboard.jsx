import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Flame, Zap, Play, ArrowUpRight, Binary, Brain, Shield } from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const AdultDashboard = () => {
  const { user, progress } = useAuth();

  const metrics = [
    { label: 'Cumulative XP', value: progress?.totalXp || 0, change: '+18% this wk' },
    { label: 'Current Level', value: `Level ${progress?.level || 1}`, change: 'Top 12%' },
    { label: 'Active Streak', value: `${progress?.currentStreak || 1} Days`, change: 'Consistent' },
    { label: 'Core Catalogue', value: '5 Games', change: '25 Levels Total' }
  ];

  const adultGames = [
    { title: 'Code Sprint', slug: 'code-sprint', category: 'Sequence Engine', desc: 'Memorize and execute algorithmic token pipelines with speed.', icon: Binary },
    { title: 'Logic Arena', slug: 'logic-arena', category: 'Choice Logic', desc: 'Evaluate formal syllogisms and deduction matrices under par time.', icon: Brain },
    { title: 'SQL Quest', slug: 'sql-quest', category: 'Relational Logic', desc: 'Debug execution order, joins, and window aggregations.', icon: Activity },
    { title: 'Memory Matrix', slug: 'memory-matrix', category: 'Grid Matrix', desc: 'High-density spatial pattern recall on expanding grids.', icon: Zap },
    { title: 'Cyber Detective', slug: 'cyber-detective', category: 'Cyber Forensics', desc: 'Analyze digital telemetry, IOCs, and protocol anomalies.', icon: Shield }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Overview */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
            Cognitive Command Center
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Welcome back, {user?.name || 'Trainee'}. All 5 Adult Zone cognitive engines are online and verified.
          </p>
        </div>
        <Link to="/explore">
          <Button variant="primary" icon={<Play size={16} />}>
            Brain Arena (All 15 Games)
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 md:grid-cols-2 gap-4">
        {metrics.map((m, idx) => (
          <Card key={idx} style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
              {m.label}
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>{m.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <ArrowUpRight size={14} />
              <span>{m.change}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Adult Zone Games (5 Games x 5 Levels) */}
      <div>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>Adult Zone Challenges (5 Games with 5 Levels Each)</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {adultGames.map((w) => {
            const Icon = w.icon;
            return (
              <Card
                key={w.slug}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.25rem 1.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-primary-light)',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <span className="demographic-pill" style={{ fontSize: '0.72rem', marginBottom: '0.25rem' }}>
                      {w.category}
                    </span>
                    <h3 style={{ fontSize: '1.15rem' }}>{w.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      {w.desc}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <Link to={`/games/${w.slug}`}>
                    <Button variant="secondary" size="sm">
                      Levels
                    </Button>
                  </Link>
                  <Link to={`/play/${w.slug}/1`}>
                    <Button variant="outline" size="sm" icon={<Play size={14} />}>
                      Play Lvl 1
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdultDashboard;
