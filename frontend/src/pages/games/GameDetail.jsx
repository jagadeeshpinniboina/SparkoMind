import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Brain, Play, Clock, Award, ArrowLeft, Lock, CheckCircle2, Star } from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import { gameApi } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

export const GameDetail = () => {
  const { slug } = useParams();
  const { progress, isAuthenticated } = useAuth();
  const [game, setGame] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback defaults
  const fallbackGame = {
    title: slug ? slug.replace(/-/g, ' ').toUpperCase() : 'Brain Challenge',
    slug,
    description: 'A scientifically engineered cognitive exercise focusing on neuroplasticity and mental agility.',
    engine: 'GridMatrixEngine',
    category: 'memory',
    difficultyLevels: [
      { level: 1, title: 'Level 1: Foundations', parTimeSeconds: 20 },
      { level: 2, title: 'Level 2: Building Blocks', parTimeSeconds: 25 },
      { level: 3, title: 'Level 3: Expansion', parTimeSeconds: 30 },
      { level: 4, title: 'Level 4: Advanced Mastery', parTimeSeconds: 35 },
      { level: 5, title: 'Level 5: Peak Acuity', parTimeSeconds: 40 }
    ]
  };

  useEffect(() => {
    setLoading(true);
    gameApi.getBySlug(slug)
      .then((res) => {
        if (res.data?.game) {
          setGame(res.data.game);
          setChallenges(res.data.challenges || []);
        } else {
          setGame(fallbackGame);
        }
      })
      .catch(() => {
        setGame(fallbackGame);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading && !game) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <p>Loading cognitive challenge specification...</p>
      </div>
    );
  }

  const currentGame = game || fallbackGame;
  const levels = currentGame.difficultyLevels || [
    { level: 1, title: 'Level 1: Foundations', parTimeSeconds: 20 },
    { level: 2, title: 'Level 2: Progression', parTimeSeconds: 25 },
    { level: 3, title: 'Level 3: Expansion', parTimeSeconds: 30 },
    { level: 4, title: 'Level 4: Advanced', parTimeSeconds: 35 },
    { level: 5, title: 'Level 5: Mastery', parTimeSeconds: 40 }
  ];

  // Determine highest completed level for this game
  const highestCompleted = isAuthenticated && progress?.completedGameLevels
    ? (progress.completedGameLevels[currentGame._id] || progress.completedGameLevels[currentGame.slug] || 0)
    : 5; // Unlocked by default in demo/practice mode

  const getDifficultyTier = (lvl) => {
    if (lvl <= 2) return { name: 'Easy', color: 'var(--color-success)' };
    if (lvl <= 4) return { name: 'Medium', color: 'var(--color-accent)' };
    return { name: 'Hard', color: 'var(--color-danger)' };
  };

  return (
    <div className="container" style={{ maxWidth: '840px', padding: '3rem 1.5rem' }}>
      <Link
        to="/explore"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          marginBottom: '1.5rem',
          textDecoration: 'none'
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Brain Arena</span>
      </Link>

      <Card style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span className="demographic-pill" style={{ textTransform: 'uppercase' }}>
            {currentGame.category}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Engine: <strong>{currentGame.engine}</strong>
          </span>
        </div>

        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.75rem' }}>{currentGame.title}</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
          {currentGame.description}
        </p>

        {/* Zero-Trust Notice */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            marginBottom: '2.5rem'
          }}
        >
          <Award size={20} style={{ color: 'var(--color-primary)' }} />
          <span>
            <strong>Zero-Trust Protocol Active:</strong> Your solutions are computed strictly on the backend. No answer keys are sent to your browser.
          </span>
        </div>

        {/* Level Selector: Levels 1 to 5 */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.4rem' }}>Playable Levels (1 to 5)</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Completed: {Math.min(5, highestCompleted)} / 5 Levels
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {levels.map((lvl) => {
              const isUnlocked = !isAuthenticated || lvl.level <= highestCompleted + 1;
              const isFinished = isAuthenticated && lvl.level <= highestCompleted;
              const tier = getDifficultyTier(lvl.level);

              return (
                <div
                  key={lvl.level}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem 1.5rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isFinished
                      ? 'var(--color-primary-light)'
                      : isUnlocked
                      ? 'var(--bg-surface-elevated)'
                      : 'var(--bg-app)',
                    border: isFinished ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                    opacity: isUnlocked ? 1 : 0.65,
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: isFinished
                          ? 'var(--color-primary)'
                          : isUnlocked
                          ? 'var(--color-primary-light)'
                          : 'var(--bg-surface-elevated)',
                        color: isFinished ? '#FFFFFF' : 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700
                      }}
                    >
                      {isFinished ? <CheckCircle2 size={20} /> : lvl.level}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{lvl.title}</span>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.5rem',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'var(--bg-surface)',
                            color: tier.color,
                            border: `1px solid ${tier.color}`
                          }}
                        >
                          {tier.name}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        <Clock size={14} />
                        <span>Par Time: {lvl.parTimeSeconds}s</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {isUnlocked ? (
                      <Link to={`/play/${currentGame.slug}/${lvl.level}`}>
                        <Button
                          variant={isFinished ? 'secondary' : 'primary'}
                          size="sm"
                          icon={<Play size={16} />}
                        >
                          {isFinished ? 'Replay' : `Play Level ${lvl.level}`}
                        </Button>
                      </Link>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <Lock size={16} />
                        <span>Locked</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GameDetail;
