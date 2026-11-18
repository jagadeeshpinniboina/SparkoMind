import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Search, Play, CheckCircle2, Cpu, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { KIDS_GAMES } from '../../data/kidsGamesData.js';
import { ADULTS_GAMES } from '../../data/adultsGamesData.js';
import { SENIORS_GAMES } from '../../data/seniorsGamesData.js';
import styles from './GamesLibrary.module.css';

export const GamesLibrary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { demographic } = useTheme();

  // Strict dynamic detection of active zone
  const storedZone = typeof window !== 'undefined' ? localStorage.getItem('sparkomind_active_zone') : null;
  const isSeniors =
    location.pathname.includes('/seniors') ||
    searchParams.get('zone') === 'seniors' ||
    (storedZone === 'seniors' && !location.pathname.includes('/kids') && !location.pathname.includes('/adults')) ||
    (demographic === 'seniors' && !location.pathname.includes('/kids') && !location.pathname.includes('/adults'));

  const isAdults = 
    !isSeniors && (
      location.pathname.includes('/adults') || 
      searchParams.get('zone') === 'adults' || 
      (storedZone === 'adults' && !location.pathname.includes('/kids')) ||
      (demographic === 'adults' && !location.pathname.includes('/kids'))
    );

  const activeZone = isSeniors ? 'seniors' : isAdults ? 'adults' : 'kids';

  // Strict isolated game dataset per demographic zone
  const rawGames = isSeniors ? SENIORS_GAMES : isAdults ? ADULTS_GAMES : KIDS_GAMES;

  // Filter Categories
  const categories = useMemo(() => {
    if (isSeniors) {
      return ['All', 'Visual Memory', 'Verbal Fluency', 'Auditory Memory', 'Spatial Harmony'];
    }
    if (isAdults) {
      return ['All', 'Working Memory', 'Executive Focus', 'Systems Logic', 'Deductive Reasoning'];
    }
    return ['All', 'Robotics & AI', 'Logic & Engineering', 'Space & Physics', 'Creativity & Science'];
  }, [isSeniors, isAdults]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter games based on Category & Search Query
  const filteredGames = useMemo(() => {
    return rawGames.filter((g) => {
      // 1. Category filter
      if (selectedCategory !== 'All' && g.category !== selectedCategory) {
        return false;
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const title = (g.title || '').toLowerCase();
        const tagline = (g.tagline || '').toLowerCase();
        const skillsStr = (g.skills || []).join(' ').toLowerCase();
        if (!title.includes(q) && !tagline.includes(q) && !skillsStr.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [rawGames, selectedCategory, searchQuery]);

  const accentColor = isSeniors ? '#10B981' : isAdults ? '#06B6D4' : '#F59E0B';

  return (
    <div className={styles.container}>
      {/* Top Banner */}
      <div className={styles.topBanner}>
        <div className={styles.headerText}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            {isSeniors ? (
              <Sparkles size={22} style={{ color: '#10B981' }} />
            ) : isAdults ? (
              <Cpu size={22} style={{ color: '#06B6D4' }} />
            ) : (
              <Sparkles size={22} style={{ color: '#F59E0B' }} />
            )}
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '0.25rem 0.75rem',
                borderRadius: '8px',
                background: isSeniors ? 'rgba(16, 185, 129, 0.12)' : isAdults ? 'rgba(6, 182, 212, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                color: accentColor,
                border: `1px solid ${isSeniors ? 'rgba(16, 185, 129, 0.35)' : isAdults ? 'rgba(6, 182, 212, 0.35)' : 'rgba(245, 158, 11, 0.35)'}`
              }}
            >
              {isSeniors
                ? 'Seniors Sanctuary • Mindful Vitality Core'
                : isAdults
                ? 'Adults Neuro-Lab • Cognitive Conditioning'
                : 'Kids Universe • STEM & AI Workspace'}
            </span>
          </div>

          <h1 className={styles.title}>
            {isSeniors
              ? 'Seniors Mindful Vitality Activities'
              : isAdults
              ? 'Adults Cognitive Conditioning Engines'
              : 'Kids Cognitive Research Labs'}
          </h1>
          <p className={styles.subtitle}>
            {isSeniors
              ? 'Tranquil cognitive exercises designed for relaxed memory recall, verbal sharpness, and sensory harmony with zero stress.'
              : isAdults
              ? 'High-velocity mental conditioning drills targeting working memory, executive focus, systems logic, and deductive reasoning.'
              : 'Explore the 4 Next-Gen STEM, AI, and systems reasoning labs with 5 progressive mission levels each.'}
          </p>
        </div>

        {/* Glassmorphic Search Bar */}
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder={
              isSeniors
                ? 'Search mindful activities, memory, verbal...'
                : isAdults
                ? 'Search drills, skills, domains...'
                : 'Search labs, algorithms, skills...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            style={isSeniors ? { borderColor: 'rgba(16, 185, 129, 0.3)' } : isAdults ? { borderColor: 'rgba(6, 182, 212, 0.25)' } : {}}
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className={styles.filterPills}>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`${styles.filterPill} ${isSelected ? styles.filterPillActive : ''}`}
              style={
                isSelected
                  ? isSeniors
                    ? {
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(16, 185, 129, 0.2) 100%)',
                        color: '#FDE68A',
                        borderColor: '#F59E0B',
                        boxShadow: '0 0 16px rgba(245, 158, 11, 0.3)'
                      }
                    : isAdults
                    ? {
                        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(16, 185, 129, 0.2) 100%)',
                        color: '#06B6D4',
                        borderColor: 'rgba(6, 182, 212, 0.7)',
                        boxShadow: '0 0 16px rgba(6, 182, 212, 0.3)'
                      }
                    : {}
                  : {}
              }
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Games Grid: Obsidian Dark Glass Cards */}
      {filteredGames.length === 0 ? (
        <div className={styles.emptyState}>
          No cognitive engines found matching "{searchQuery}". Try selecting another category!
        </div>
      ) : (
        <div className={styles.gamesGrid}>
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className={styles.gameCard}
              style={
                isSeniors
                  ? {
                      borderColor: 'rgba(16, 185, 129, 0.25)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
                    }
                  : isAdults
                  ? {
                      borderColor: 'rgba(6, 182, 212, 0.22)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
                    }
                  : {}
              }
            >
              <div>
                <div className={styles.cardHeader}>
                  <span
                    className={styles.emojiIcon}
                    role="img"
                    aria-label={game.title}
                    style={
                      isSeniors
                        ? {
                            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(19, 32, 28, 0.8) 75%)',
                            border: '1px solid rgba(16, 185, 129, 0.4)',
                            borderRadius: '14px',
                            padding: '6px',
                            boxShadow: '0 0 16px rgba(16, 185, 129, 0.2)'
                          }
                        : isAdults
                        ? {
                            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, rgba(15, 23, 42, 0.8) 75%)',
                            border: '1px solid rgba(6, 182, 212, 0.35)',
                            borderRadius: '14px',
                            padding: '6px',
                            boxShadow: '0 0 16px rgba(6, 182, 212, 0.2)'
                          }
                        : {}
                    }
                  >
                    {game.icon}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span
                      className={styles.zoneBadge}
                      style={
                        isSeniors
                          ? {
                              background: 'rgba(16, 185, 129, 0.15)',
                              color: '#10B981',
                              border: '1px solid rgba(16, 185, 129, 0.35)'
                            }
                          : isAdults
                          ? {
                              background: 'rgba(6, 182, 212, 0.12)',
                              color: '#06B6D4',
                              border: '1px solid rgba(6, 182, 212, 0.35)'
                            }
                          : {}
                      }
                    >
                      {game.category}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700 }}>
                      {game.targetAge}
                    </span>
                  </div>
                </div>

                <h3 className={styles.gameTitle}>{game.title}</h3>
                <p className={styles.gameDesc}>{game.tagline}</p>

                {/* Skills Row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '0.75rem' }}>
                  {game.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: isSeniors
                          ? 'rgba(16, 185, 129, 0.12)'
                          : isAdults
                          ? 'rgba(16, 185, 129, 0.1)'
                          : 'rgba(56, 189, 248, 0.1)',
                        color: isSeniors ? '#A7F3D0' : isAdults ? '#34D399' : '#38BDF8',
                        border: `1px solid ${isSeniors ? 'rgba(16, 185, 129, 0.3)' : isAdults ? 'rgba(16, 185, 129, 0.25)' : 'rgba(56, 189, 248, 0.25)'}`
                      }}
                    >
                      <CheckCircle2 size={11} />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.levelsTag}>
                  ⭐ 5 Progressive Levels
                </span>

                <button
                  onClick={() =>
                    navigate(
                      isSeniors
                        ? `/dashboard/seniors/play/${game.id}?level=1`
                        : isAdults
                        ? `/dashboard/adults/play/${game.id}?level=1`
                        : `/dashboard/kids/play/${game.id}?level=1`
                    )
                  }
                  className={styles.playBtn}
                  style={
                    isSeniors
                      ? {
                          background: 'linear-gradient(135deg, #F59E0B 0%, #10B981 100%)',
                          color: '#0B1210',
                          boxShadow: '0 0 16px rgba(245, 158, 11, 0.35)'
                        }
                      : isAdults
                      ? {
                          background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
                          color: '#04141E',
                          boxShadow: '0 0 16px rgba(6, 182, 212, 0.4)'
                        }
                      : {}
                  }
                >
                  <Play size={14} fill="currentColor" />
                  <span>{isSeniors ? 'Start Activity ▷' : 'Launch ▷'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GamesLibrary;
