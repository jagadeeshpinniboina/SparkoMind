import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Cpu, Play, CheckCircle2, RotateCcw, 
  Sparkles, Zap, Brain, Shield, Activity 
} from 'lucide-react';
import styles from './PlayArena.module.css';
import BotScript from './games/Kids/BotScript/BotScript';
import CircuitConnect from './games/Kids/CircuitConnect/CircuitConnect';
import GravitySling from './games/Kids/GravitySling/GravitySling';
import ColorLab from './games/Kids/ColorLab/ColorLab';
import NeuroMatrix from './games/Adults/NeuroMatrix/NeuroMatrix';
import ChronoReflex from './games/Adults/ChronoReflex/ChronoReflex';
import NeonSudoku from './games/Adults/NeonSudoku/NeonSudoku';
import CrownGrid from './games/Adults/CrownGrid/CrownGrid';
import HeritageMatch from './games/Seniors/HeritageMatch/HeritageMatch';
import GoldenZip from './games/Seniors/GoldenZip/GoldenZip';
import QuiltPatches from './games/Seniors/QuiltPatches/QuiltPatches';
import TimberUnbolt from './games/Seniors/TimberUnbolt/TimberUnbolt';
import { ADULTS_GAMES } from '../../data/adultsGamesData.js';
import { SENIORS_GAMES } from '../../data/seniorsGamesData.js';
import { getUnlockedLevel, getCanonicalGameId } from '../../utils/gameProgression.js';

export const PlayArena = () => {
  const { gameId } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Enforce Signature Dark Theme in all games without overwriting localStorage dashboard preference
  useEffect(() => {
    const prevTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', 'dark');
    return () => {
      document.documentElement.setAttribute('data-theme', prevTheme);
    };
  }, []);

  // Normalize gameId: ensure check matches both hyphenated and non-hyphenated formats
  const normalizedGameId = (gameId || '').toLowerCase().trim();
  const canonicalGameId = getCanonicalGameId(normalizedGameId);

  // Route guard: strictly clamp requested level to unlocked level (prevent URL bypassing)
  const rawLevelParam = parseInt(searchParams.get('level'), 10) || 1;
  const currentUnlocked = getUnlockedLevel(canonicalGameId);
  const levelParam = Math.max(1, Math.min(rawLevelParam, currentUnlocked));

  // ==========================================================================
  // 1. KIDS ZONE GAMES DISPATCHER (GLOBAL VIEWPORT LOCKED)
  // ==========================================================================
  if (normalizedGameId === 'bot-script' || normalizedGameId === 'botscript') {
    return (
      <div className={styles.arenaViewportLock} data-theme="dark">
        <BotScript initialLevel={levelParam} />
      </div>
    );
  }

  if (normalizedGameId === 'circuit-connect' || normalizedGameId === 'circuitconnect') {
    return (
      <div className={styles.arenaViewportLock} data-theme="dark">
        <CircuitConnect initialLevel={levelParam} />
      </div>
    );
  }

  if (normalizedGameId === 'gravity-sling' || normalizedGameId === 'gravitysling') {
    return (
      <div className={styles.arenaViewportLock} data-theme="dark">
        <GravitySling initialLevel={levelParam} />
      </div>
    );
  }

  if (normalizedGameId === 'color-lab' || normalizedGameId === 'colorlab') {
    return (
      <div className={styles.arenaViewportLock} data-theme="dark">
        <ColorLab initialLevel={levelParam} />
      </div>
    );
  }

  // ==========================================================================
  // 2. ADULTS ZONE FULLY PLAYABLE GAMES DISPATCHER (GLOBAL VIEWPORT LOCKED)
  // ==========================================================================
  if (normalizedGameId === 'neuro-matrix' || normalizedGameId === 'neuromatrix') {
    return (
      <div className={styles.arenaViewportLock} data-theme="dark">
        <NeuroMatrix initialLevel={levelParam} />
      </div>
    );
  }

  if (normalizedGameId === 'chrono-reflex' || normalizedGameId === 'chronoreflex') {
    return (
      <div className={styles.arenaViewportLock} data-theme="dark">
        <ChronoReflex initialLevel={levelParam} />
      </div>
    );
  }

  if (normalizedGameId === 'neon-sudoku' || normalizedGameId === 'neonsudoku') {
    return (
      <div className={styles.arenaViewportLock} data-theme="dark">
        <NeonSudoku initialLevel={levelParam} />
      </div>
    );
  }

  if (normalizedGameId === 'crown-grid' || normalizedGameId === 'crowngrid') {
    return (
      <div className={styles.arenaViewportLock} data-theme="dark">
        <CrownGrid initialLevel={levelParam} />
      </div>
    );
  }

  // ==========================================================================
  // 3. SENIORS ZONE FULLY PLAYABLE GAMES DISPATCHER (GLOBAL VIEWPORT LOCKED)
  // ==========================================================================
  if (
    normalizedGameId === 'heritage-match' ||
    normalizedGameId === 'heritagematch' ||
    normalizedGameId === 'memory-garden' ||
    normalizedGameId === 'memorygarden'
  ) {
    return (
      <div className={styles.arenaViewportLock} data-theme="dark">
        <HeritageMatch initialLevel={levelParam} />
      </div>
    );
  }

  if (
    normalizedGameId === 'golden-zip' ||
    normalizedGameId === 'goldenzip' ||
    normalizedGameId === 'zip'
  ) {
    return (
      <div className={styles.arenaViewportLock} data-theme="dark">
        <GoldenZip initialLevel={levelParam} />
      </div>
    );
  }

  if (
    normalizedGameId === 'quilt-patches' ||
    normalizedGameId === 'quiltpatches' ||
    normalizedGameId === 'patches'
  ) {
    return (
      <div className={styles.arenaViewportLock} data-theme="dark">
        <QuiltPatches initialLevel={levelParam} />
      </div>
    );
  }

  if (
    normalizedGameId === 'timber-unbolt' ||
    normalizedGameId === 'timberunbolt' ||
    normalizedGameId === 'unbolt' ||
    normalizedGameId === 'wood-nuts' ||
    normalizedGameId === 'screw-puzzle'
  ) {
    return (
      <div className={styles.arenaViewportLock} data-theme="dark">
        <TimberUnbolt initialLevel={levelParam} />
      </div>
    );
  }

  // ==========================================================================
  // 4. SENIORS ZONE CALIBRATION STAGING ARENA
  // ==========================================================================
  const seniorGame = SENIORS_GAMES.find(
    (g) => g.id === normalizedGameId || g.id.replace(/-/g, '') === normalizedGameId
  );

  if (seniorGame) {
    const currentLevel = Math.max(1, Math.min(5, levelParam));
    const levelMeta = seniorGame.levels.find((l) => l.level === currentLevel) || seniorGame.levels[0];

    const handleLevelSelect = (lvl) => {
      navigate(`/dashboard/seniors/play/${seniorGame.id}?level=${lvl}`);
    };

    return (
      <div
        style={{
          minHeight: '80vh',
          background: '#0B1210',
          backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.08) 0%, rgba(11, 18, 16, 0) 70%)',
          color: '#F8FAFC',
          padding: '2rem 1.5rem',
          maxWidth: '1000px',
          margin: '0 auto',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <Link
            to="/dashboard/seniors"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#10B981',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '0.45rem 0.9rem',
              borderRadius: '10px',
              border: '1.5px solid rgba(16, 185, 129, 0.3)',
              background: 'rgba(16, 185, 129, 0.1)'
            }}
          >
            <ArrowLeft size={16} /> Seniors Sanctuary
          </Link>

          <span
            style={{
              padding: '0.35rem 0.9rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 800,
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#F59E0B',
              border: '1px solid rgba(245, 158, 11, 0.4)'
            }}
          >
            Seniors Zone • Mindful Vitality
          </span>
        </div>

        <div
          style={{
            background: 'rgba(19, 32, 28, 0.95)',
            border: '2px solid rgba(245, 158, 11, 0.4)',
            borderRadius: '24px',
            padding: '2.5rem',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
          }}
        >
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{seniorGame.icon}</div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
            {seniorGame.title}
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#94A3B8', maxWidth: '600px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            {seniorGame.tagline}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            {seniorGame.levels.map((lvl) => (
              <button
                key={lvl.level}
                onClick={() => handleLevelSelect(lvl.level)}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  border: lvl.level === currentLevel ? '2px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.15)',
                  background: lvl.level === currentLevel ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(16, 185, 129, 0.2) 100%)' : 'rgba(11, 18, 16, 0.8)',
                  color: lvl.level === currentLevel ? '#FDE68A' : '#94A3B8'
                }}
              >
                Level {lvl.level}
              </button>
            ))}
          </div>

          <div
            style={{
              background: 'rgba(11, 18, 16, 0.65)',
              borderRadius: '16px',
              padding: '1.25rem',
              maxWidth: '480px',
              margin: '0 auto 2rem',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <h3 style={{ fontSize: '1.15rem', color: '#F59E0B', margin: '0 0 0.35rem 0' }}>
              Level {currentLevel}: {levelMeta.title}
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#CBD5E1', margin: 0 }}>
              {levelMeta.description}
            </p>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.75rem',
              borderRadius: '14px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1.5px solid rgba(16, 185, 129, 0.4)',
              color: '#A7F3D0',
              fontWeight: 700,
              fontSize: '1.1rem'
            }}
          >
            🌿 Calibration Active • Coming Soon to Seniors Sanctuary
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // 5. ADULTS ZONE CALIBRATION STAGING ARENA (For Upcoming Drills)
  // ==========================================================================
  const adultGame = ADULTS_GAMES.find(
    (g) => g.id === normalizedGameId || g.id.replace(/-/g, '') === normalizedGameId
  );

  if (adultGame) {
    const currentLevel = Math.max(1, Math.min(5, levelParam));
    const levelMeta = adultGame.levels.find((l) => l.level === currentLevel) || adultGame.levels[0];

    const handleLevelSelect = (lvl) => {
      navigate(`/dashboard/adults/play/${adultGame.id}?level=${lvl}`);
    };

    return (
      <div
        style={{
          minHeight: '80vh',
          background: '#070A11',
          backgroundImage: 
            'radial-gradient(circle at 50% 15%, rgba(6, 182, 212, 0.08) 0%, transparent 60%), radial-gradient(circle at 85% 85%, rgba(16, 185, 129, 0.06) 0%, transparent 50%)',
          color: '#F8FAFC',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '1.5rem 1rem 3rem',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}
      >
        {/* Top HUD */}
        <header
          style={{
            width: '100%',
            maxWidth: '920px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            borderRadius: '18px',
            padding: '0.85rem 1.4rem',
            marginBottom: '1.5rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <Link
              to="/dashboard/adults"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#94A3B8',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                padding: '0.5rem 0.9rem',
                borderRadius: '10px',
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                transition: 'all 0.2s ease'
              }}
            >
              <ArrowLeft size={16} />
              <span>Adults Neuro-Lab</span>
            </Link>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(8, 14, 26, 0.7)',
                padding: '0.3rem 0.5rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleLevelSelect(lvl)}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    border: '1px solid transparent',
                    background: currentLevel === lvl ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.3) 0%, rgba(16, 185, 129, 0.25) 100%)' : 'transparent',
                    color: currentLevel === lvl ? '#06B6D4' : '#64748B',
                    borderColor: currentLevel === lvl ? 'rgba(6, 182, 212, 0.7)' : 'transparent',
                    boxShadow: currentLevel === lvl ? '0 0 12px rgba(6, 182, 212, 0.35)' : 'none',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  L{lvl}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.95rem',
                background: 'rgba(6, 182, 212, 0.12)',
                border: '1px solid rgba(6, 182, 212, 0.35)',
                borderRadius: '10px',
                color: '#22D3EE',
                fontSize: '0.85rem',
                fontWeight: 700
              }}
            >
              <Sparkles size={15} />
              <span>+150 Neuro XP</span>
            </div>
          </div>
        </header>

        {/* Central Conditioning Stage */}
        <div
          style={{
            width: '100%',
            maxWidth: '920px',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(6, 182, 212, 0.25)',
            borderRadius: '24px',
            padding: '2.5rem 2rem',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 40px rgba(6, 182, 212, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '1.5rem'
          }}
        >
          {/* Holographic Glowing Icon */}
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '22px',
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(15, 23, 42, 0.9) 75%)',
              border: '2px solid #06B6D4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.8rem',
              boxShadow: '0 0 35px rgba(6, 182, 212, 0.45)'
            }}
          >
            {adultGame.icon}
          </div>

          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '0.3rem 0.85rem',
                borderRadius: '8px',
                background: 'rgba(6, 182, 212, 0.12)',
                color: '#06B6D4',
                border: '1px solid rgba(6, 182, 212, 0.35)',
                marginBottom: '0.75rem'
              }}
            >
              <span>{adultGame.category}</span>
              <span>•</span>
              <span>{adultGame.targetAge}</span>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.5rem' }}>
              {adultGame.title}
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '1rem', maxWidth: '620px', lineHeight: 1.6, margin: '0 auto' }}>
              {adultGame.tagline}
            </p>
          </div>

          {/* Active Level Target Console */}
          <div
            style={{
              width: '100%',
              maxWidth: '680px',
              background: 'rgba(8, 14, 26, 0.75)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B' }}>
                Conditioning Objective (Level {currentLevel})
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10B981' }}>
                Online & Primed
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              {levelMeta.title}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>
              {levelMeta.description}
            </p>

            {/* Skills Row */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
              {adultGame.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.25rem 0.65rem',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    color: '#34D399',
                    border: '1px solid rgba(16, 185, 129, 0.25)'
                  }}
                >
                  <CheckCircle2 size={12} />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <Link
              to="/dashboard/adults"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1.5rem',
                borderRadius: '14px',
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94A3B8',
                fontWeight: 700,
                fontSize: '0.92rem',
                textDecoration: 'none'
              }}
            >
              ← Back to Neuro-Lab
            </Link>

            <button
              type="button"
              onClick={() => alert(`Starting Level ${currentLevel} calibration drill for ${adultGame.title}!`)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.85rem 1.8rem',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
                border: 'none',
                color: '#04141E',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 0 25px rgba(6, 182, 212, 0.45)',
                transition: 'all 0.2s ease'
              }}
            >
              <Play size={16} fill="currentColor" />
              <span>Begin Level {currentLevel} Drill</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // 6. EXPLICIT FALLBACK UI
  // ==========================================================================
  const isSeniorsContext = location.pathname.includes('/seniors');
  const isAdultsContext = location.pathname.includes('/adults');

  const fallbackTitle = isSeniorsContext
    ? 'Seniors Sanctuary'
    : isAdultsContext
    ? 'Adults Neuro-Lab'
    : 'Kids Universe';

  const fallbackColor = isSeniorsContext
    ? '#10B981'
    : isAdultsContext
    ? '#06B6D4'
    : '#EC4899';

  const fallbackLink = isSeniorsContext
    ? '/dashboard/seniors'
    : isAdultsContext
    ? '/dashboard/adults'
    : '/dashboard/kids';

  return (
    <div
      style={{
        color: '#FFFFFF',
        padding: '60px 20px',
        textAlign: 'center',
        background: isSeniorsContext ? '#0B1210' : '#070A11',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '20px',
        border: `1px solid ${isSeniorsContext ? 'rgba(16, 185, 129, 0.35)' : isAdultsContext ? 'rgba(6, 182, 212, 0.3)' : 'rgba(236, 72, 153, 0.25)'}`,
        margin: '20px auto',
        maxWidth: '800px'
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        {isSeniorsContext ? '🪷' : isAdultsContext ? '⚡' : '🧪'}
      </div>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#FFFFFF' }}>
        Game "{gameId}" not found in {fallbackTitle}
      </h2>
      <p style={{ color: '#94A3B8', marginBottom: '1.5rem', maxWidth: '480px', lineHeight: 1.6 }}>
        {isSeniorsContext
          ? 'HeritageMatch is calibrated and ready to play in the Seniors Sanctuary.'
          : isAdultsContext
          ? 'NeuroMatrix, ChronoReflex, NeonSudoku, and CrownGrid are calibrated and available in the Adults Neuro-Lab.'
          : 'BotScript, Circuit Connect, Gravity Sling, and Color Lab are fully operational in the Kids Universe!'}
      </p>
      <Link
        to={fallbackLink}
        style={{
          color: fallbackColor,
          textDecoration: 'none',
          fontWeight: 700,
          padding: '0.65rem 1.4rem',
          borderRadius: '12px',
          border: `1px solid ${fallbackColor}`,
          background: `${fallbackColor}20`,
          display: 'inline-block',
          transition: 'all 0.2s ease'
        }}
      >
        ← Return to {fallbackTitle}
      </Link>
    </div>
  );
};

export default PlayArena;
