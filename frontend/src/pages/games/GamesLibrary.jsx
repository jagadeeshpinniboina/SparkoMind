import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Gamepad2, Search, Filter, Play, Layers, Grid, 
  Compass, Binary, Brain, X, CheckCircle2, Clock, Award, Star 
} from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import { gameApi } from '../../services/api.js';

export const GamesLibrary = () => {
  const [games, setGames] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    gameApi.getAll()
      .then((res) => {
        if (res.data?.games) {
          setGames(res.data.games);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', 'Memory', 'Logic', 'Mathematics', 'Coding', 'Spatial', 'Sequence'];

  const filteredGames = games.filter((g) => {
    const matchesCat = selectedCategory === 'All' || g.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          g.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getEngineIcon = (engine) => {
    switch (engine) {
      case 'GridMatrixEngine': return <Grid size={24} />;
      case 'SequenceCodeEngine': return <Binary size={24} />;
      case 'CardMemoryEngine': return <Layers size={24} />;
      case 'ChoiceLogicEngine': return <Brain size={24} />;
      case 'SpatialPathEngine': return <Compass size={24} />;
      default: return <Brain size={24} />;
    }
  };

  const handleOpenDetail = (game) => {
    setSelectedGame(game);
    setModalOpen(true);
  };

  const handleStartGame = () => {
    if (selectedGame) {
      setModalOpen(false);
      navigate(`/games/${selectedGame.slug}/play/1`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#1E293B', marginBottom: '0.25rem' }}>Games Library</h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
            Choose from 15 scientifically engineered cognitive training games.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '300px' }}>
          <input
            type="text"
            placeholder="Search games, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.5rem', borderRadius: 'var(--radius-full)' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
        </div>
      </div>

      {/* Horizontal Category Filter Pills (PART-3 SPEC) */}
      <div style={{ display: 'flex', gap: '0.65rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.9rem',
                fontWeight: isSelected ? 700 : 500,
                backgroundColor: isSelected ? 'var(--brand-primary)' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#64748B',
                border: isSelected ? '1.5px solid var(--brand-primary)' : '1.5px solid var(--border-subtle)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                whiteSpace: 'nowrap',
                boxShadow: isSelected ? '0 4px 12px rgba(94, 92, 230, 0.25)' : 'none'
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Games Grid (PART-3 SPEC) */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748B' }}>Loading games library...</div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-1 gap-6">
          {filteredGames.map((game) => {
            const zone = game.demographics?.[0] || 'adults';
            const zoneColors = {
              kids: '#FF8C42',
              adults: '#0284C7',
              seniors: '#10B981'
            };
            const zoneColor = zoneColors[zone] || '#5E5CE6';

            return (
              <Card
                key={game.slug}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  cursor: 'pointer'
                }}
                onClick={() => handleOpenDetail(game)}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--color-primary-light)',
                        color: 'var(--brand-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {getEngineIcon(game.engine)}
                    </div>

                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: `${zoneColor}18`,
                        color: zoneColor,
                        textTransform: 'capitalize'
                      }}
                    >
                      {zone} Zone
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', color: '#1E293B', marginBottom: '0.35rem' }}>
                    {game.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {game.description}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748B' }}>
                    🎯 5 Playable Levels
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/games/${game.slug}/play/1`);
                    }}
                    style={{
                      padding: '0.45rem 1.1rem',
                      borderRadius: '10px',
                      backgroundColor: 'var(--brand-primary)',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 3px 10px rgba(94, 92, 230, 0.25)'
                    }}
                  >
                    <Play size={14} />
                    <span>Play</span>
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Selected Game Detail Modal (PART-3 SPEC) */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedGame?.title || 'Game Details'}
      >
        {selectedGame && (
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <span className="demographic-pill" style={{ textTransform: 'capitalize' }}>
                {selectedGame.category}
              </span>
              <span style={{ fontSize: '0.8rem', padding: '0.3rem 0.7rem', borderRadius: 'var(--radius-full)', backgroundColor: '#F1F5F9', color: '#475569', fontWeight: 600 }}>
                {selectedGame.engine}
              </span>
            </div>

            <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {selectedGame.description}
            </p>

            <div style={{ backgroundColor: '#F8FAFD', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.75rem', color: '#1E293B' }}>
                Key Cognitive Features:
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.88rem', color: '#64748B' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--brand-primary)" /> 5 Progressive Difficulty Levels (Easy to Hard)</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--brand-primary)" /> Zero-Trust Server-Side Answer Validation</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--brand-primary)" /> Latency, Accuracy, and Streak multipliers</li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to={`/games/${selectedGame.slug}`} style={{ flex: 1 }}>
                <Button variant="secondary" style={{ width: '100%' }}>
                  View All Levels
                </Button>
              </Link>
              <Button className="btn-brand" onClick={handleStartGame} style={{ flex: 2 }} icon={<Play size={16} />}>
                Start Game (Level 1) →
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default GamesLibrary;
