import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Flame, Trophy, Play, Sparkles, Rocket } from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const KidsDashboard = () => {
  const { user, progress } = useAuth();

  const streak = user?.streak || progress?.currentStreak || 1;
  const level = user?.level || progress?.level || 1;
  const stars = user?.stars || progress?.totalXp || 120;
  const displayName = user?.name || user?.firstName || 'Explorer';

  const kidsGames = [
    { title: 'Memory Match', slug: 'memory-match', stars: 3, icon: '🐰', desc: 'Match cute animals, toys, and magical wonders!' },
    { title: 'Pattern Planet', slug: 'pattern-planet', stars: 3, icon: '⭐', desc: 'Watch the cosmic stars glow and recreate constellations!' },
    { title: 'Maze Explorer', slug: 'maze-explorer', stars: 4, icon: '🗺️', desc: 'Guide the adventurer through trails to the treasure chest!' },
    { title: 'Robo Rescue', slug: 'robo-rescue', stars: 4, icon: '🤖', desc: 'Send color sequence signals to guide the rescue robot!' },
    { title: 'Math Quest', slug: 'math-quest', stars: 5, icon: '🍎', desc: 'Solve cheerful arithmetic riddles to open mystery chests!' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Playful Welcome Header */}
      <div
        className="card-base"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
          color: '#FFFFFF',
          padding: '2.5rem 2rem',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(255, 255, 255, 0.25)', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              <Rocket size={16} />
              <span>Space Cadet Level {level}</span>
            </div>
            <h1 style={{ fontSize: '2.3rem', color: '#FFFFFF', marginBottom: '0.4rem' }}>
              Hey, {displayName}! 🚀
            </h1>
            <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>
              All 5 Kids Zone Quests are ready for today's brain workout!
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stars}</div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Wonder Stars</div>
            </div>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{streak} 🔥</div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Day Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Kids Zone Games */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Sparkles size={22} style={{ color: 'var(--color-accent)' }} />
          <h2 style={{ fontSize: '1.5rem' }}>Kids Zone Quests (5 Games with 5 Levels Each)</h2>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-1 gap-6">
          {kidsGames.map((q) => (
            <Card key={q.slug} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 'var(--radius-lg)' }}>
              <div>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{q.icon}</div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>{q.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>{q.desc}</p>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  ⭐ Levels 1 to 5 Ready to Play
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                <Link to={`/games/${q.slug}`} style={{ flex: 1 }}>
                  <Button variant="secondary" size="sm" style={{ width: '100%' }}>
                    Levels
                  </Button>
                </Link>
                <Link to={`/play/${q.slug}/1`} style={{ flex: 1 }}>
                  <Button variant="accent" size="sm" style={{ width: '100%' }} icon={<Play size={16} />}>
                    Play!
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

export default KidsDashboard;
