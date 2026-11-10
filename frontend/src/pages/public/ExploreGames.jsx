import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Layers, Binary, Grid, Compass, ArrowRight, Play, Shield } from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import { gameApi } from '../../services/api.js';
import { useTheme } from '../../context/ThemeContext.jsx';

export const ExploreGames = () => {
  const { demographic } = useTheme();
  const [games, setGames] = useState([]);
  const [selectedZone, setSelectedZone] = useState('all'); // 'all' | 'kids' | 'adults' | 'seniors'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (selectedZone !== 'all') {
      params.demographic = selectedZone;
    }
    if (selectedCategory !== 'all') {
      params.category = selectedCategory;
    }

    gameApi.getAll(params)
      .then((res) => {
        if (res.data?.games) {
          setGames(res.data.games);
        }
      })
      .catch((err) => {
        console.error('Failed to load games:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedZone, selectedCategory]);

  const categories = ['all', 'memory', 'logic', 'spatial', 'sequence'];
  const zones = [
    { id: 'all', label: 'All Zones (15)' },
    { id: 'kids', label: '🚀 Kids Zone (5)' },
    { id: 'adults', label: '⚡ Adult Zone (5)' },
    { id: 'seniors', label: '🌱 Senior Zone (5)' }
  ];

  const getEngineIcon = (engine) => {
    switch (engine) {
      case 'GridMatrixEngine': return <Grid size={22} />;
      case 'SequenceCodeEngine': return <Binary size={22} />;
      case 'CardMemoryEngine': return <Layers size={22} />;
      case 'ChoiceLogicEngine': return <Brain size={22} />;
      case 'SpatialPathEngine': return <Compass size={22} />;
      default: return <Brain size={22} />;
    }
  };

  const getZoneBadgeColor = (demographics) => {
    if (demographics?.includes('kids')) return '#3B82F6';
    if (demographics?.includes('seniors')) return '#059669';
    return '#8B5CF6';
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Cognitive Brain Arena</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto' }}>
          15 Core Games designed across Kids, Adults, and Seniors with 5 progressive challenge levels each and zero-trust verification.
        </p>
      </div>

      {/* Zone Filters */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {zones.map((z) => (
          <button
            key={z.id}
            onClick={() => setSelectedZone(z.id)}
            style={{
              padding: '0.6rem 1.4rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.92rem',
              fontWeight: selectedZone === z.id ? 700 : 500,
              backgroundColor: selectedZone === z.id ? 'var(--color-primary)' : 'var(--bg-surface)',
              color: selectedZone === z.id ? '#FFFFFF' : 'var(--text-secondary)',
              border: selectedZone === z.id ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
              transition: 'all var(--transition-fast)',
              cursor: 'pointer'
            }}
          >
            {z.label}
          </button>
        ))}
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '0.35rem 0.95rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 600,
              textTransform: 'capitalize',
              backgroundColor: selectedCategory === cat ? 'var(--bg-surface-elevated)' : 'transparent',
              color: selectedCategory === cat ? 'var(--color-primary)' : 'var(--text-muted)',
              border: selectedCategory === cat ? '1px solid var(--color-primary)' : '1px solid transparent',
              cursor: 'pointer'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Games Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
          Loading games from MongoDB Atlas...
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-1 gap-6">
          {games.map((game) => {
            const zoneColor = getZoneBadgeColor(game.demographics);
            const primaryZone = game.demographics?.[0] || 'adults';

            return (
              <Card
                key={game.slug}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--color-primary-light)',
                        color: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {getEngineIcon(game.engine)}
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: 'var(--bg-app)',
                          color: zoneColor,
                          border: `1px solid ${zoneColor}`,
                          textTransform: 'capitalize'
                        }}
                      >
                        {primaryZone} Zone
                      </span>

                      <span className="demographic-pill" style={{ textTransform: 'uppercase', fontSize: '0.72rem' }}>
                        {game.category}
                      </span>
                    </div>
                  </div>

                  <h2 style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>{game.title}</h2>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {game.description}
                  </p>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    Levels: <strong>1 to 5 Available</strong> (Easy → Hard)
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Link to={`/games/${game.slug}`} style={{ flex: 1 }}>
                    <Button variant="secondary" size="sm" style={{ width: '100%' }}>
                      Levels
                    </Button>
                  </Link>
                  <Link to={`/play/${game.slug}/1`} style={{ flex: 1 }}>
                    <Button variant="primary" size="sm" style={{ width: '100%' }} icon={<Play size={15} />}>
                      Play Lvl 1
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExploreGames;
