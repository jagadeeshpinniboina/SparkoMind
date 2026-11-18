import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, RotateCcw, Trophy, Star, Volume2, VolumeX, 
  ArrowRight, Sparkles, Droplet, Trash2, FlaskConical, Lock, CheckCircle2, AlertCircle, Pause
} from 'lucide-react';
import { useGameProgression, unlockNextLevel, getUnlockedLevel } from '../../../../../utils/gameProgression.js';
import GamePauseOverlay from '../../../../../components/GamePauseOverlay';
import colorLabAudio from './ColorLabAudio';
import styles from './ColorLab.module.css';

// Base element colors for dynamic RGB blending
const BASE_COLORS = {
  red: [239, 68, 68],
  blue: [59, 130, 246],
  yellow: [250, 204, 21],
  white: [255, 255, 255]
};

// ============================================================================
// DYNAMIC COLOR-MATCHED MULTI-FACETED 360° SVG CRYSTAL COMPONENT
// ============================================================================
const TargetCrystal = ({ color = '#A855F7' }) => {
  const safeId = color.replace(/[^a-zA-Z0-9]/g, '');

  return (
    <svg
      viewBox="0 0 100 120"
      className={styles.targetCrystalSvg}
      style={{
        filter: `drop-shadow(0 0 16px ${color}) drop-shadow(0 0 32px ${color}88)`
      }}
    >
      <defs>
        {/* Crown Table Highlight Gradient */}
        <linearGradient id={`tableGrad-${safeId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.88" />
          <stop offset="45%" stopColor={color} stopOpacity="0.95" />
          <stop offset="100%" stopColor={color} stopOpacity="0.8" />
        </linearGradient>

        {/* Left Facet Gradient */}
        <linearGradient id={`leftFacet-${safeId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
          <stop offset="100%" stopColor={color} stopOpacity="0.9" />
        </linearGradient>

        {/* Right Facet Gradient */}
        <linearGradient id={`rightFacet-${safeId}`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.85" />
        </linearGradient>

        {/* Core Pavilion Gradient */}
        <linearGradient id={`corePavilion-${safeId}`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.98" />
          <stop offset="100%" stopColor="#0B1326" stopOpacity="0.65" />
        </linearGradient>

        {/* Side Flank Gradient */}
        <linearGradient id={`flankGrad-${safeId}`} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.75" />
          <stop offset="100%" stopColor={color} stopOpacity="0.45" />
        </linearGradient>
      </defs>

      {/* Gem Silhouette Underglow */}
      <polygon
        points="50,6 76,28 86,62 50,114 14,62 24,28"
        fill={color}
        fillOpacity="0.22"
      />

      {/* 1. Crown Top Table Facet */}
      <polygon
        points="50,14 70,30 62,56 38,56 30,30"
        fill={`url(#tableGrad-${safeId})`}
        stroke="#FFFFFF"
        strokeWidth="0.8"
        strokeOpacity="0.55"
      />

      {/* 2. Top-Left Crown Facet */}
      <polygon
        points="50,6 24,28 30,30 50,14"
        fill={`url(#leftFacet-${safeId})`}
        stroke="#FFFFFF"
        strokeWidth="0.6"
        strokeOpacity="0.4"
      />

      {/* 3. Top-Right Crown Facet */}
      <polygon
        points="50,6 50,14 70,30 76,28"
        fill={`url(#rightFacet-${safeId})`}
        stroke="#FFFFFF"
        strokeWidth="0.6"
        strokeOpacity="0.4"
      />

      {/* 4. Upper-Left Waist Flank */}
      <polygon
        points="24,28 14,62 38,56 30,30"
        fill={`url(#flankGrad-${safeId})`}
        stroke="#FFFFFF"
        strokeWidth="0.6"
        strokeOpacity="0.3"
      />

      {/* 5. Upper-Right Waist Flank */}
      <polygon
        points="76,28 70,30 62,56 86,62"
        fill={`url(#flankGrad-${safeId})`}
        stroke="#FFFFFF"
        strokeWidth="0.6"
        strokeOpacity="0.3"
      />

      {/* 6. Lower Center Core Pavilion */}
      <polygon
        points="38,56 62,56 50,114"
        fill={`url(#corePavilion-${safeId})`}
        stroke="#FFFFFF"
        strokeWidth="0.8"
        strokeOpacity="0.5"
      />

      {/* 7. Lower-Left Pavilion Facet */}
      <polygon
        points="38,56 14,62 50,114"
        fill={color}
        fillOpacity="0.65"
        stroke="#FFFFFF"
        strokeWidth="0.6"
        strokeOpacity="0.35"
      />

      {/* 8. Lower-Right Pavilion Facet */}
      <polygon
        points="62,56 86,62 50,114"
        fill={color}
        fillOpacity="0.82"
        stroke="#FFFFFF"
        strokeWidth="0.6"
        strokeOpacity="0.35"
      />

      {/* Specular White Gleams */}
      <polygon
        points="46,24 50,18 54,24 50,30"
        fill="#FFFFFF"
        opacity="0.85"
      />
      <circle cx="50" cy="24" r="1.5" fill="#FFFFFF" opacity="0.9" />
      <polygon
        points="38,40 40,36 42,40 40,44"
        fill="#FFFFFF"
        opacity="0.6"
      />
    </svg>
  );
};

// ============================================================================
// 5 PROGRESSIVE LEVELS CONFIGURATION (Zero-Confusion, Intuitive & Fun)
// ============================================================================
export const COLOR_LEVELS = [
  {
    level: 1,
    title: 'Rainbow Basics',
    mission: 'Combine pairs of primary cosmic fluids to synthesize vibrant secondary energy crystals!',
    category: 'Secondary Colors',
    allowWhite: false,
    potions: [
      {
        id: 'p1-purple',
        name: 'Cosmic Purple',
        targetColor: '#A855F7',
        targetDrops: 2,
        recipe: { red: 1, blue: 1 },
        hint: '1 Red Ruby + 1 Blue Cobalt'
      },
      {
        id: 'p1-green',
        name: 'Alien Green',
        targetColor: '#10B981',
        targetDrops: 2,
        recipe: { blue: 1, yellow: 1 },
        hint: '1 Blue Cobalt + 1 Yellow Solar'
      },
      {
        id: 'p1-orange',
        name: 'Supernova Orange',
        targetColor: '#F97316',
        targetDrops: 2,
        recipe: { red: 1, yellow: 1 },
        hint: '1 Red Ruby + 1 Yellow Solar'
      }
    ]
  },
  {
    level: 2,
    title: 'Starlight Pastel',
    mission: 'Starlight White is unlocked! Lighten radiant elements to brew glowing pastel elixirs.',
    category: 'Tints & Pastels',
    allowWhite: true,
    potions: [
      {
        id: 'p2-pink',
        name: 'Nebula Pink',
        targetColor: '#F472B6',
        targetDrops: 2,
        recipe: { red: 1, white: 1 },
        hint: '1 Red Ruby + 1 White Starlight'
      },
      {
        id: 'p2-sky',
        name: 'Celestial Cyan',
        targetColor: '#38BDF8',
        targetDrops: 2,
        recipe: { blue: 1, white: 1 },
        hint: '1 Blue Cobalt + 1 White Starlight'
      },
      {
        id: 'p2-lemon',
        name: 'Starlight Lemon',
        targetColor: '#FEF08A',
        targetDrops: 2,
        recipe: { yellow: 1, white: 1 },
        hint: '1 Yellow Solar + 1 White Starlight'
      }
    ]
  },
  {
    level: 3,
    title: 'Ratio Magic',
    mission: 'Experiment with 2:1 fluid proportions to synthesize deep, rare planetary pigments!',
    category: 'Proportional Mixing',
    allowWhite: false,
    potions: [
      {
        id: 'p3-amber',
        name: 'Solar Amber',
        targetColor: '#D97706',
        targetDrops: 3,
        recipe: { yellow: 2, red: 1 },
        hint: '2 Yellow Solar + 1 Red Ruby'
      },
      {
        id: 'p3-violet',
        name: 'Deep Space Violet',
        targetColor: '#7C3AED',
        targetDrops: 3,
        recipe: { blue: 2, red: 1 },
        hint: '2 Blue Cobalt + 1 Red Ruby'
      },
      {
        id: 'p3-mint',
        name: 'Cosmic Mint',
        targetColor: '#06B6D4',
        targetDrops: 3,
        recipe: { blue: 2, yellow: 1 },
        hint: '2 Blue Cobalt + 1 Yellow Solar'
      }
    ]
  },
  {
    level: 4,
    title: 'Cosmic Shades',
    mission: 'Triple-element blends! Blend secondary bases with starlight for ethereal crystalline tints.',
    category: 'Compound Blending',
    allowWhite: true,
    potions: [
      {
        id: 'p4-lavender',
        name: 'Starlight Lavender',
        targetColor: '#C084FC',
        targetDrops: 3,
        recipe: { red: 1, blue: 1, white: 1 },
        hint: '1 Red + 1 Blue + 1 White'
      },
      {
        id: 'p4-peach',
        name: 'Dawn Peach',
        targetColor: '#FB923C',
        targetDrops: 3,
        recipe: { red: 1, yellow: 1, white: 1 },
        hint: '1 Red + 1 Yellow + 1 White'
      },
      {
        id: 'p4-seafoam',
        name: 'Crystal Seafoam',
        targetColor: '#34D399',
        targetDrops: 3,
        recipe: { blue: 1, yellow: 1, white: 1 },
        hint: '1 Blue + 1 Yellow + 1 White'
      }
    ]
  },
  {
    level: 5,
    title: 'Master Alchemist',
    mission: 'Command 4-drop grand formulas to power up four legendary high-tier alien crystals!',
    category: 'Grand Alchemy',
    allowWhite: true,
    potions: [
      {
        id: 'p5-magenta',
        name: 'Nova Magenta',
        targetColor: '#E11D48',
        targetDrops: 4,
        recipe: { red: 2, blue: 1, white: 1 },
        hint: '2 Red + 1 Blue + 1 White'
      },
      {
        id: 'p5-aurora',
        name: 'Aurora Lime',
        targetColor: '#4ADE80',
        targetDrops: 4,
        recipe: { yellow: 2, blue: 1, white: 1 },
        hint: '2 Yellow + 1 Blue + 1 White'
      },
      {
        id: 'p5-coral',
        name: 'Solar Coral',
        targetColor: '#FB7185',
        targetDrops: 4,
        recipe: { red: 2, yellow: 1, white: 1 },
        hint: '2 Red + 1 Yellow + 1 White'
      },
      {
        id: 'p5-indigo',
        name: 'Astral Indigo',
        targetColor: '#6366F1',
        targetDrops: 4,
        recipe: { blue: 2, red: 1, white: 1 },
        hint: '2 Blue + 1 Red + 1 White'
      }
    ]
  }
];

export const ColorLab = ({ initialLevel = 1 }) => {
  const navigate = useNavigate();

  // Clamp level 1 to 5 & sequential level progression
  const { unlockedLevel, unlockNextLevel: triggerUnlockNext, isLevelUnlocked } = useGameProgression('color-lab');
  const sanitizedLevel = Math.max(1, Math.min(5, Number(initialLevel) || 1));
  const initialAllowed = Math.min(sanitizedLevel, unlockedLevel);
  const [currentLevel, setCurrentLevel] = useState(initialAllowed);
  const [potionIndex, setPotionIndex] = useState(0);
  const [beakerDrops, setBeakerDrops] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'success' | 'error'
  const [feedbackText, setFeedbackText] = useState('');
  const [isVictoryOpen, setIsVictoryOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Keyboard pause shortcut (Escape or P)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (!isVictoryOpen) {
          setIsPaused((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVictoryOpen]);

  // Keep current level clamped if unlockedLevel changes
  useEffect(() => {
    if (currentLevel > unlockedLevel) {
      setCurrentLevel(unlockedLevel);
    }
  }, [unlockedLevel, currentLevel]);

  // Sync level state if initialLevel prop changes
  useEffect(() => {
    const lvl = Math.max(1, Math.min(5, Number(initialLevel) || 1));
    const allowed = Math.min(lvl, unlockedLevel || 1);
    setCurrentLevel(allowed);
  }, [initialLevel, unlockedLevel]);

  // Active level data
  const levelData = useMemo(() => {
    return COLOR_LEVELS.find((l) => l.level === currentLevel) || COLOR_LEVELS[0];
  }, [currentLevel]);

  // Active potion data
  const currentPotion = useMemo(() => {
    return levelData.potions[potionIndex] || levelData.potions[0];
  }, [levelData, potionIndex]);

  // Reset state on level or potion change
  useEffect(() => {
    setPotionIndex(0);
    setBeakerDrops([]);
    setStatus('idle');
    setFeedbackText('');
    setIsVictoryOpen(false);
  }, [currentLevel]);

  // Toggle Mute
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    colorLabAudio.setMuted(next);
  };

  // Compute current liquid color and height
  const liquidStyle = useMemo(() => {
    if (beakerDrops.length === 0) {
      return {
        height: '0%',
        backgroundColor: 'transparent',
        boxShadow: 'none'
      };
    }

    let rSum = 0;
    let gSum = 0;
    let bSum = 0;

    beakerDrops.forEach((colorName) => {
      const rgb = BASE_COLORS[colorName] || [255, 255, 255];
      rSum += rgb[0];
      gSum += rgb[1];
      bSum += rgb[2];
    });

    const count = beakerDrops.length;
    const r = Math.round(rSum / count);
    const g = Math.round(gSum / count);
    const b = Math.round(bSum / count);

    const target = currentPotion.targetDrops;
    const fillPercent = Math.min(88, Math.round((count / target) * 75) + 12);

    return {
      height: `${fillPercent}%`,
      backgroundColor: `rgb(${r}, ${g}, ${b})`,
      boxShadow: `0 0 25px rgba(${r}, ${g}, ${b}, 0.6), inset 0 0 15px rgba(255, 255, 255, 0.4)`
    };
  }, [beakerDrops, currentPotion.targetDrops]);

  // Check if drops match target recipe
  const evaluateMix = useCallback(
    (drops) => {
      const counts = { red: 0, blue: 0, yellow: 0, white: 0 };
      drops.forEach((d) => {
        if (counts[d] !== undefined) counts[d]++;
      });

      const target = currentPotion.recipe;
      const isMatch = ['red', 'blue', 'yellow', 'white'].every((c) => {
        const required = target[c] || 0;
        return counts[c] === required;
      });

      if (isMatch) {
        setStatus('success');
        setFeedbackText('✨ Perfect Alchemy! The Crystal Absorbs the Energy!');
        colorLabAudio.playMatch();

        const timer = setTimeout(() => {
          if (potionIndex < levelData.potions.length - 1) {
            setPotionIndex((prev) => prev + 1);
            setBeakerDrops([]);
            setStatus('idle');
            setFeedbackText('');
            colorLabAudio.playSwirl();
          } else {
            // Wave Complete!
            colorLabAudio.playVictory();
            triggerUnlockNext(currentLevel);
            setIsVictoryOpen(true);
          }
        }, 1100);

        return () => clearTimeout(timer);
      } else {
        setStatus('error');
        setFeedbackText(`💡 Not quite right! Target recipe: ${currentPotion.hint}`);
        colorLabAudio.playWobble();
      }
    },
    [currentPotion, potionIndex, levelData.potions.length, currentLevel]
  );

  // Add a drop from dispenser
  const handleAddDrop = (colorName) => {
    if (status === 'success' || isPaused) return;
    if (beakerDrops.length >= currentPotion.targetDrops) return;

    colorLabAudio.playDrop(colorName);
    const updated = [...beakerDrops, colorName];
    setBeakerDrops(updated);
    setStatus('idle');
    setFeedbackText('');

    // If target capacity reached, auto-evaluate
    if (updated.length === currentPotion.targetDrops) {
      setTimeout(() => {
        evaluateMix(updated);
      }, 250);
    }
  };

  // Empty Beaker
  const handleEmptyBeaker = () => {
    if (status === 'success' || isPaused) return;
    setBeakerDrops([]);
    setStatus('idle');
    setFeedbackText('');
    colorLabAudio.playEmpty();
  };

  // Reset entire level
  const handleResetLevel = () => {
    setPotionIndex(0);
    setBeakerDrops([]);
    setStatus('idle');
    setFeedbackText('');
    colorLabAudio.playSwirl();
  };

  // Next level handler
  const handleNextLevel = () => {
    if (currentLevel < 5) {
      const nextLvl = currentLevel + 1;
      triggerUnlockNext(currentLevel);
      setCurrentLevel(nextLvl);
      navigate(`/dashboard/kids/play/color-lab?level=${nextLvl}`);
    } else {
      setIsVictoryOpen(false);
      navigate('/dashboard/kids');
    }
  };

  const handleLevelSelect = (lvl) => {
    if (!isLevelUnlocked(lvl)) return;
    setCurrentLevel(lvl);
    navigate(`/dashboard/kids/play/color-lab?level=${lvl}`);
  };

  const isBeakerFull = beakerDrops.length >= currentPotion.targetDrops;

  return (
    <div className={styles.labContainer}>
      {/* ====================================================================
         1. TOP NAVIGATION & STATUS HUD
         ==================================================================== */}
      <header className={styles.topHud}>
        {/* Left Section: Back to Arena + Sequential Level Selector */}
        <div className={styles.hudLeft}>
          <Link to="/dashboard/kids" className={styles.kidsArenaExitBtn}>
            ← 🚀 Kids Arena
          </Link>

          <div className={styles.levelSelector}>
            {[1, 2, 3, 4, 5].map((lvl) => {
              const isLocked = lvl > unlockedLevel;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleLevelSelect(lvl)}
                  disabled={isLocked}
                  style={{ pointerEvents: isLocked ? 'none' : 'auto' }}
                  className={`${styles.levelBtn} ${currentLevel === lvl ? styles.activeLevelBtn : ''} ${isLocked ? styles.levelBtnLocked : ''}`}
                  title={isLocked ? `Complete Level ${lvl - 1} to unlock` : `Level ${lvl}`}
                >
                  L{lvl}
                  {isLocked && <span className={styles.lockBadge}>🔒</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Section: Game Name + Active Level Title Badge */}
        <div className={styles.hudCenter}>
          <div className={styles.gameBrand}>
            <span className={styles.brandIcon}>🧪</span>
            <span className={styles.brandTitle}>Color Lab: Photon Mixer</span>
          </div>
          <span className={styles.levelBadge}>Level {currentLevel}: {levelData.title}</span>
        </div>

        {/* Right Section: Potions Status, Audio, Reset */}
        <div className={styles.hudRight}>
          <div className={styles.potionProgressPill}>
            <FlaskConical size={16} />
            <span>
              Potion {potionIndex + 1} / {levelData.potions.length}
            </span>
          </div>

          <button
            type="button"
            onClick={toggleMute}
            className={styles.iconBtn}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <button
            type="button"
            onClick={handleResetLevel}
            className={styles.iconBtn}
            title="Reset Lab"
          >
            <RotateCcw size={16} />
          </button>

          <button
            type="button"
            onClick={() => setIsPaused(true)}
            className={styles.iconBtn}
            title="Pause Game (Esc or P)"
          >
            <Pause size={16} />
          </button>
        </div>
      </header>

      {/* ====================================================================
         2. MISSION BRIEF BANNER
         ==================================================================== */}
      <div className={styles.missionBanner}>
        <div className={styles.missionDetails}>
          <div className={styles.missionTitle}>
            <span>Level {currentLevel}: {levelData.title}</span>
            <span className={styles.badgeCategory}>{levelData.category}</span>
          </div>
          <p className={styles.missionDesc}>{levelData.mission}</p>
        </div>
      </div>

      {/* ====================================================================
         3. MAIN ALCHEMY CHAMBER (3-Column Layout: Target | Beaker | Dispensers)
         ==================================================================== */}
      <main className={styles.labStage3Col}>
        {/* Left Column: Target Crystal Display */}
        <section className={styles.targetPodium}>
          <div className={styles.podiumBadge}>Target Crystal</div>

          <div
            className={styles.targetCrystalGlow}
            style={{
              backgroundColor: `${currentPotion.targetColor}18`,
              boxShadow: `0 0 35px ${currentPotion.targetColor}40`,
              borderColor: `${currentPotion.targetColor}80`
            }}
          >
            <TargetCrystal color={currentPotion.targetColor} />
          </div>

          <h3 className={styles.targetColorName}>{currentPotion.name}</h3>

          <div className={styles.targetDropCount}>
            <Droplet size={15} />
            <span>Target: {currentPotion.targetDrops} Drops</span>
          </div>

          {currentPotion.hint && (
            <div className={styles.recipeHintPill}>
              <span>Formula: {currentPotion.hint}</span>
            </div>
          )}
        </section>

        {/* Center Column: Central Magic Mixing Beaker + Energy Beam */}
        <section className={styles.beakerChamber}>
          {status === 'success' && (
            <div className={styles.energyBeamLeft}>
              <div
                className={styles.beamRay}
                style={{
                  background: `linear-gradient(to left, rgba(255, 255, 255, 0.95), ${currentPotion.targetColor})`,
                  boxShadow: `0 0 20px ${currentPotion.targetColor}, 0 0 35px #FFFFFF`
                }}
              />
              <div className={styles.beamPulseSpark} />
            </div>
          )}

          {/* Flask Graphical Structure */}
          <div className={styles.flaskContainer}>
            <div className={styles.flaskLip} />
            <div className={styles.flaskNeck} />

            <div className={styles.flaskGlass}>
              <div className={styles.tickMarks}>
                <div className={styles.tickLine} />
                <div className={styles.tickLine} />
                <div className={styles.tickLine} />
                <div className={styles.tickLine} />
              </div>

              {/* Dynamic Liquid */}
              <div className={styles.liquidBody} style={liquidStyle}>
                <div className={styles.liquidMeniscus} />

                {beakerDrops.length > 0 && (
                  <>
                    <div className={styles.bubbleParticle} style={{ left: '20%', width: 8, height: 8, animationDelay: '0.2s' }} />
                    <div className={styles.bubbleParticle} style={{ left: '50%', width: 6, height: 6, animationDelay: '0.8s' }} />
                    <div className={styles.bubbleParticle} style={{ left: '75%', width: 10, height: 10, animationDelay: '1.4s' }} />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Droplet Slots */}
          <div className={styles.dropIndicators}>
            {Array.from({ length: currentPotion.targetDrops }).map((_, idx) => {
              const dropColor = beakerDrops[idx];
              const isFilled = dropColor !== undefined;
              const colorHex = dropColor === 'red' ? '#EF4444' : dropColor === 'blue' ? '#3B82F6' : dropColor === 'yellow' ? '#FACC15' : '#FFFFFF';

              return (
                <div
                  key={idx}
                  className={`${styles.dropSlot} ${isFilled ? styles.filled : ''}`}
                  style={isFilled ? { backgroundColor: colorHex, color: colorHex } : {}}
                  title={isFilled ? `Drop ${idx + 1}: ${dropColor}` : 'Empty Drop Slot'}
                />
              );
            })}
          </div>
        </section>

        {/* Right Column: Color Dispenser Valves & Actions */}
        <section className={styles.reagentDock}>
          <div className={styles.dockTitle}>Reagent Dispensers</div>

          <div className={styles.valvesGrid}>
            <button
              type="button"
              onClick={() => handleAddDrop('red')}
              disabled={isBeakerFull || status === 'success'}
              className={`${styles.valveBtn} ${styles.valveRed}`}
            >
              <span style={{ fontSize: '1.2rem' }}>🔴</span>
              <span>Red Ruby</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddDrop('blue')}
              disabled={isBeakerFull || status === 'success'}
              className={`${styles.valveBtn} ${styles.valveBlue}`}
            >
              <span style={{ fontSize: '1.2rem' }}>🔵</span>
              <span>Blue Cobalt</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddDrop('yellow')}
              disabled={isBeakerFull || status === 'success'}
              className={`${styles.valveBtn} ${styles.valveYellow}`}
            >
              <span style={{ fontSize: '1.2rem' }}>🟡</span>
              <span>Yellow Solar</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddDrop('white')}
              disabled={!levelData.allowWhite || isBeakerFull || status === 'success'}
              className={`${styles.valveBtn} ${styles.valveWhite} ${!levelData.allowWhite ? styles.valveLocked : ''}`}
            >
              <span style={{ fontSize: '1.2rem' }}>
                {levelData.allowWhite ? '⚪' : <Lock size={16} />}
              </span>
              <span>White Starlight</span>
            </button>
          </div>

          <div className={styles.actionRow}>
            <button
              type="button"
              onClick={handleEmptyBeaker}
              disabled={beakerDrops.length === 0 || status === 'success'}
              className={styles.emptyBtn}
              title="Empty Beaker"
            >
              <Trash2 size={16} />
              <span>Empty</span>
            </button>

            <button
              type="button"
              onClick={() => evaluateMix(beakerDrops)}
              disabled={beakerDrops.length === 0 || status === 'success'}
              className={styles.mixBtn}
            >
              <Sparkles size={16} />
              <span>Mix & Serve</span>
            </button>
          </div>

          {feedbackText && (
            <div
              className={`${styles.hintCallout} ${
                status === 'success' ? styles.success : status === 'error' ? styles.error : ''
              }`}
            >
              {status === 'success' && <CheckCircle2 size={16} />}
              {status === 'error' && <AlertCircle size={16} />}
              <span>{feedbackText}</span>
            </div>
          )}
        </section>
      </main>

      {/* ====================================================================
         6. VICTORY MODAL OVERLAY
         ==================================================================== */}
      {isVictoryOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.victoryModal}>
            <div className={styles.trophyCircle}>
              🧪
            </div>

            <h3 className={styles.victoryTitle}>Alchemy Level Complete!</h3>
            <p className={styles.victorySubtitle}>
              Spectacular potion work, young alchemist! You've precisely synthesized every cosmic crystal color for this sector!
            </p>

            <div className={styles.xpBadge}>
              <Sparkles size={16} />
              <span>+100 Wonder XP Earned!</span>
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => {
                  setIsVictoryOpen(false);
                  handleResetLevel();
                }}
                className={styles.replayBtn}
              >
                <span>↺ Replay</span>
              </button>

              <button
                type="button"
                onClick={handleNextLevel}
                className={styles.nextLevelBtn}
              >
                <span>{currentLevel < 5 ? 'Next Level' : 'Complete Lab 🚀'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Universal Pause Modal Overlay */}
      <GamePauseOverlay
        isOpen={isPaused}
        onResume={() => setIsPaused(false)}
        onRestart={() => {
          setIsPaused(false);
          handleResetLevel();
        }}
        onExit={() => navigate('/dashboard/kids')}
        gameTitle="Color Lab: Photon Mixer"
        level={currentLevel}
        zonePath="/dashboard/kids"
      />
    </div>
  );
};

export default ColorLab;
