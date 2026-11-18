import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, RotateCcw, Zap, Trophy, Star, 
  Volume2, VolumeX, ArrowRight, Sparkles, Activity, Pause
} from 'lucide-react';
import { useGameProgression, unlockNextLevel } from '../../../../../utils/gameProgression.js';
import GamePauseOverlay from '../../../../../components/GamePauseOverlay';
import styles from './CircuitConnect.module.css';

// ============================================================================
// AUDIO SYNTHESIZER (Web Audio API, Zero External Assets)
// ============================================================================
class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playRotateClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(720, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {}
  }

  playPowerFlow() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {}
  }

  playVictoryChord() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.09);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.09);
        osc.stop(this.ctx.currentTime + 1.2);
      });
    } catch {}
  }
}

const soundManager = new AudioSynthesizer();

// ============================================================================
// 5 PROGRESSIVE LEVELS CONFIGURATION (Immutable & Exported)
// Direction constants: 0: TOP, 1: RIGHT, 2: BOTTOM, 3: LEFT
// ============================================================================
export const CIRCUIT_LEVELS = [
  {
    level: 1,
    title: 'Spark Start',
    mission: 'Rotate 2 corner conduits to power the starship cabin lamp!',
    rows: 3,
    cols: 3,
    targetCount: 1,
    parMoves: 6,
    initialGrid: [
      { r: 0, c: 0, type: 'source', fixed: true, ports: [1], rot: 0 },
      { r: 0, c: 1, type: 'corner', fixed: false, basePorts: [0, 1], rot: 0 },
      { r: 0, c: 2, type: 'blank', fixed: true },
      { r: 1, c: 0, type: 'blank', fixed: true },
      { r: 1, c: 1, type: 'corner', fixed: false, basePorts: [0, 1], rot: 90 },
      { r: 1, c: 2, type: 'target', fixed: true, targetId: 'lamp', name: 'Cabin Lamp', ports: [3], rot: 0 },
      { r: 2, c: 0, type: 'blank', fixed: true },
      { r: 2, c: 1, type: 'blank', fixed: true },
      { r: 2, c: 2, type: 'blank', fixed: true }
    ]
  },
  {
    level: 2,
    title: 'The Bend',
    mission: 'Route the energy circuit around the central non-conductive asteroid obstacle!',
    rows: 3,
    cols: 3,
    targetCount: 1,
    parMoves: 8,
    initialGrid: [
      { r: 0, c: 0, type: 'source', fixed: true, ports: [1], rot: 0 },
      { r: 0, c: 1, type: 'straight', fixed: false, basePorts: [0, 2], rot: 0 },
      { r: 0, c: 2, type: 'corner', fixed: false, basePorts: [0, 1], rot: 0 },
      { r: 1, c: 0, type: 'blank', fixed: true },
      { r: 1, c: 1, type: 'asteroid', fixed: true },
      { r: 1, c: 2, type: 'straight', fixed: false, basePorts: [0, 2], rot: 90 },
      { r: 2, c: 0, type: 'target', fixed: true, targetId: 'thruster', name: 'Thruster Core', ports: [1], rot: 0 },
      { r: 2, c: 1, type: 'straight', fixed: false, basePorts: [0, 2], rot: 0 },
      { r: 2, c: 2, type: 'corner', fixed: false, basePorts: [0, 1], rot: 90 }
    ]
  },
  {
    level: 3,
    title: 'Twin Crystals',
    mission: 'Split electric flow via the T-junction to illuminate dual engine crystals simultaneously!',
    rows: 3,
    cols: 3,
    targetCount: 2,
    parMoves: 7,
    initialGrid: [
      { r: 0, c: 0, type: 'blank', fixed: true },
      { r: 0, c: 1, type: 'source', fixed: true, ports: [2], rot: 0 },
      { r: 0, c: 2, type: 'blank', fixed: true },
      { r: 1, c: 0, type: 'target', fixed: true, targetId: 'crystalA', name: 'Cyan Crystal', ports: [1], rot: 0 },
      { r: 1, c: 1, type: 't-junction', fixed: false, basePorts: [3, 0, 1], rot: 180 },
      { r: 1, c: 2, type: 'corner', fixed: false, basePorts: [0, 1], rot: 0 },
      { r: 2, c: 0, type: 'blank', fixed: true },
      { r: 2, c: 1, type: 'blank', fixed: true },
      { r: 2, c: 2, type: 'target', fixed: true, targetId: 'crystalB', name: 'Amber Crystal', ports: [0], rot: 0 }
    ]
  },
  {
    level: 4,
    title: 'Grid Surge',
    mission: 'Calibrate a serpentine conduit across 16 tiles to recharge orbital shield arrays!',
    rows: 4,
    cols: 4,
    targetCount: 1,
    parMoves: 12,
    initialGrid: [
      { r: 0, c: 0, type: 'source', fixed: true, ports: [1], rot: 0 },
      { r: 0, c: 1, type: 'straight', fixed: false, basePorts: [0, 2], rot: 0 },
      { r: 0, c: 2, type: 'corner', fixed: false, basePorts: [0, 1], rot: 0 },
      { r: 0, c: 3, type: 'blank', fixed: true },
      { r: 1, c: 0, type: 'blank', fixed: true },
      { r: 1, c: 1, type: 'corner', fixed: false, basePorts: [0, 1], rot: 180 },
      { r: 1, c: 2, type: 'corner', fixed: false, basePorts: [0, 1], rot: 90 },
      { r: 1, c: 3, type: 'blank', fixed: true },
      { r: 2, c: 0, type: 'blank', fixed: true },
      { r: 2, c: 1, type: 'straight', fixed: false, basePorts: [0, 2], rot: 90 },
      { r: 2, c: 2, type: 'blank', fixed: true },
      { r: 2, c: 3, type: 'blank', fixed: true },
      { r: 3, c: 0, type: 'blank', fixed: true },
      { r: 3, c: 1, type: 'corner', fixed: false, basePorts: [0, 1], rot: 270 },
      { r: 3, c: 2, type: 'straight', fixed: false, basePorts: [0, 2], rot: 0 },
      { r: 3, c: 3, type: 'target', fixed: true, targetId: 'shield', name: 'Shield Generator', ports: [3], rot: 0 }
    ]
  },
  {
    level: 5,
    title: 'Master Reactor',
    mission: 'Synchronize dual independent conduits to ignite both Hyperdrive Cores simultaneously!',
    rows: 4,
    cols: 4,
    targetCount: 2,
    parMoves: 10,
    initialGrid: [
      { r: 0, c: 0, type: 'blank', fixed: true },
      { r: 0, c: 1, type: 'blank', fixed: true },
      { r: 0, c: 2, type: 'corner', fixed: false, basePorts: [0, 1], rot: 180 },
      { r: 0, c: 3, type: 'target', fixed: true, targetId: 'engineAlpha', name: 'Hyperdrive Core Alpha', ports: [3], rot: 0 },
      { r: 1, c: 0, type: 'blank', fixed: true },
      { r: 1, c: 1, type: 'source', fixed: true, ports: [1, 2], rot: 0 },
      { r: 1, c: 2, type: 'corner', fixed: false, basePorts: [0, 1], rot: 0 },
      { r: 1, c: 3, type: 'blank', fixed: true },
      { r: 2, c: 0, type: 'blank', fixed: true },
      { r: 2, c: 1, type: 'corner', fixed: false, basePorts: [0, 1], rot: 180 },
      { r: 2, c: 2, type: 'corner', fixed: false, basePorts: [0, 1], rot: 90 },
      { r: 2, c: 3, type: 'blank', fixed: true },
      { r: 3, c: 0, type: 'blank', fixed: true },
      { r: 3, c: 1, type: 'blank', fixed: true },
      { r: 3, c: 2, type: 'target', fixed: true, targetId: 'engineBeta', name: 'Hyperdrive Core Beta', ports: [0], rot: 0 },
      { r: 3, c: 3, type: 'blank', fixed: true }
    ]
  }
];

// Helper to calculate active ports for a given tile type and rotation
const getActivePorts = (tile) => {
  if (tile.type === 'blank' || tile.type === 'asteroid') return [];
  const base = tile.ports || tile.basePorts || [];
  const k = Math.floor((tile.rot % 360) / 90);
  return base.map((p) => (p + k) % 4);
};

// ============================================================================
// INDIVIDUAL TILE WIRE SVG RENDERER
// ============================================================================
const TileWireSVG = ({ tile, isPowered, isSurged }) => {
  const { type } = tile;

  return (
    <svg className={styles.wireCanvas} viewBox="0 0 100 100">
      <defs>
        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. Straight Wire: Top to Bottom (at rot 0) */}
      {type === 'straight' && (
        <g filter={isPowered ? 'url(#neonGlow)' : undefined}>
          <line
            x1="50" y1="0" x2="50" y2="100"
            className={isPowered ? styles.wireConduitPowered : styles.wireConduit}
          />
          <line
            x1="50" y1="0" x2="50" y2="100"
            className={`${isPowered ? styles.wireCorePowered : styles.wireCoreUnpowered} ${isSurged ? styles.wireSurgeAnimation : ''}`}
          />
        </g>
      )}

      {/* 2. Corner Wire: Top to Right (at rot 0) */}
      {type === 'corner' && (
        <g filter={isPowered ? 'url(#neonGlow)' : undefined}>
          <path
            d="M 50 0 L 50 50 L 100 50"
            className={isPowered ? styles.wireConduitPowered : styles.wireConduit}
          />
          <path
            d="M 50 0 L 50 50 L 100 50"
            className={`${isPowered ? styles.wireCorePowered : styles.wireCoreUnpowered} ${isSurged ? styles.wireSurgeAnimation : ''}`}
          />
        </g>
      )}

      {/* 3. T-Junction Wire: Left, Top, Right (at rot 0) */}
      {type === 't-junction' && (
        <g filter={isPowered ? 'url(#neonGlow)' : undefined}>
          <path
            d="M 0 50 L 100 50 M 50 50 L 50 0"
            className={isPowered ? styles.wireConduitPowered : styles.wireConduit}
          />
          <path
            d="M 0 50 L 100 50 M 50 50 L 50 0"
            className={`${isPowered ? styles.wireCorePowered : styles.wireCoreUnpowered} ${isSurged ? styles.wireSurgeAnimation : ''}`}
          />
        </g>
      )}

      {/* 4. Cross Wire: All 4 directions */}
      {type === 'cross' && (
        <g filter={isPowered ? 'url(#neonGlow)' : undefined}>
          <path
            d="M 0 50 L 100 50 M 50 0 L 50 100"
            className={isPowered ? styles.wireConduitPowered : styles.wireConduit}
          />
          <path
            d="M 0 50 L 100 50 M 50 0 L 50 100"
            className={`${isPowered ? styles.wireCorePowered : styles.wireCoreUnpowered} ${isSurged ? styles.wireSurgeAnimation : ''}`}
          />
        </g>
      )}

      {/* 5. Source Generator: Center to Output Port(s) */}
      {type === 'source' && (
        <g>
          {/* Wire stub toward output port */}
          {tile.ports.includes(1) && (
            <line x1="50" y1="50" x2="100" y2="50" className={styles.wireConduitPowered} />
          )}
          {tile.ports.includes(2) && (
            <line x1="50" y1="50" x2="50" y2="100" className={styles.wireConduitPowered} />
          )}
          {tile.ports.includes(1) && (
            <line x1="50" y1="50" x2="100" y2="50" className={styles.wireCorePowered} />
          )}
          {tile.ports.includes(2) && (
            <line x1="50" y1="50" x2="50" y2="100" className={styles.wireCorePowered} />
          )}

          {/* Central Battery Reactor Circle */}
          <circle cx="50" cy="50" r="26" fill="#0F172A" stroke="#10B981" strokeWidth="3" filter="url(#neonGlow)" />
          <circle cx="50" cy="50" r="18" fill="#10B981" fillOpacity="0.3" />
        </g>
      )}

      {/* 6. Target Bulb / Core: Incoming Port(s) to Center */}
      {type === 'target' && (
        <g>
          {/* Wire stub from incoming port toward center */}
          {tile.ports.includes(3) && (
            <line
              x1="0" y1="50" x2="50" y2="50"
              className={isPowered ? styles.wireConduitPowered : styles.wireConduit}
            />
          )}
          {tile.ports.includes(1) && (
            <line
              x1="50" y1="50" x2="100" y2="50"
              className={isPowered ? styles.wireConduitPowered : styles.wireConduit}
            />
          )}
          {tile.ports.includes(0) && (
            <line
              x1="50" y1="0" x2="50" y2="50"
              className={isPowered ? styles.wireConduitPowered : styles.wireConduit}
            />
          )}

          {/* Inner Core */}
          {tile.ports.includes(3) && (
            <line
              x1="0" y1="50" x2="50" y2="50"
              className={isPowered ? styles.wireCorePowered : styles.wireCoreUnpowered}
            />
          )}
          {tile.ports.includes(1) && (
            <line
              x1="50" y1="50" x2="100" y2="50"
              className={isPowered ? styles.wireCorePowered : styles.wireCoreUnpowered}
            />
          )}
          {tile.ports.includes(0) && (
            <line
              x1="50" y1="0" x2="50" y2="50"
              className={isPowered ? styles.wireCorePowered : styles.wireCoreUnpowered}
            />
          )}

          {/* Core Shell */}
          <circle
            cx="50" cy="50" r="24"
            fill="#0F172A"
            stroke={isPowered ? '#F59E0B' : '#475569'}
            strokeWidth="2.5"
            filter={isPowered ? 'url(#neonGlow)' : undefined}
          />
        </g>
      )}

      {/* 7. Asteroid Obstacle */}
      {type === 'asteroid' && (
        <g>
          <polygon
            points="25,25 75,20 85,55 70,85 30,80 15,50"
            fill="#334155" stroke="#64748B" strokeWidth="2.5"
          />
          <circle cx="45" cy="45" r="7" fill="#1E293B" />
          <circle cx="65" cy="65" r="5" fill="#1E293B" />
        </g>
      )}
    </svg>
  );
};

// ============================================================================
// MAIN CIRCUITCONNECT COMPONENT
// ============================================================================
export const CircuitConnect = ({ initialLevel = 1 }) => {
  const navigate = useNavigate();

  // Safe level parsing (1 to 5) & sequential level progression
  const { unlockedLevel, unlockNextLevel: triggerUnlockNext, isLevelUnlocked } = useGameProgression('circuit-connect');
  const parsedInitial = parseInt(initialLevel, 10);
  const safeInitialLevel = !isNaN(parsedInitial) && parsedInitial >= 1 && parsedInitial <= 5 ? parsedInitial : 1;
  const initialAllowed = Math.min(safeInitialLevel, unlockedLevel);
  const [level, setLevel] = useState(initialAllowed);

  // Keep level clamped if unlockedLevel changes
  useEffect(() => {
    if (level > unlockedLevel) {
      setLevel(unlockedLevel);
    }
  }, [unlockedLevel, level]);

  const currentLevelConfig = CIRCUIT_LEVELS.find((l) => l.level === level) || CIRCUIT_LEVELS[0];

  // Grid State
  const [grid, setGrid] = useState(() => currentLevelConfig.initialGrid.map((t) => ({ ...t })));
  const [moveCount, setMoveCount] = useState(0);

  // Victory / Surge Animation State
  const [isSurged, setIsSurged] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const surgeTimerRef = useRef(null);

  // Keyboard pause shortcut (Escape or P)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (!isWon) {
          setIsPaused((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWon]);

  // Audio mute toggle
  const toggleMute = () => {
    soundManager.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Reset Level
  const resetLevel = (lvlNum = level) => {
    if (surgeTimerRef.current) clearTimeout(surgeTimerRef.current);
    const cfg = CIRCUIT_LEVELS.find((l) => l.level === lvlNum) || CIRCUIT_LEVELS[0];
    setGrid(cfg.initialGrid.map((t) => ({ ...t })));
    setMoveCount(0);
    setIsSurged(false);
    setIsWon(false);
    soundManager.playPowerFlow();
  };

  // Level Switch
  const handleLevelChange = (lvlNum) => {
    if (lvlNum === level) return;
    if (!isLevelUnlocked('circuit-connect', lvlNum)) return;
    setLevel(lvlNum);
    resetLevel(lvlNum);
  };

  useEffect(() => {
    resetLevel(level);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (surgeTimerRef.current) clearTimeout(surgeTimerRef.current);
    };
  }, []);

  // ============================================================================
  // REAL-TIME BREADTH-FIRST SEARCH CONNECTIVITY ENGINE
  // ============================================================================
  const { poweredSet, poweredTargetIds } = useMemo(() => {
    const rows = currentLevelConfig.rows;
    const cols = currentLevelConfig.cols;

    // Locate all source tiles
    const sources = grid.filter((t) => t.type === 'source');
    const visited = new Set();
    const queue = [];

    sources.forEach((s) => {
      const key = `${s.r},${s.c}`;
      visited.add(key);
      queue.push({ r: s.r, c: s.c, tile: s });
    });

    const powered = new Set(sources.map((s) => `${s.r},${s.c}`));
    const targets = new Set();

    // Map grid for fast coordinate lookup
    const tileMap = new Map();
    grid.forEach((t) => tileMap.set(`${t.r},${t.c}`, t));

    while (queue.length > 0) {
      const curr = queue.shift();
      const currTile = curr.tile;
      const currPorts = getActivePorts(currTile);

      // Check all 4 potential neighbor directions
      currPorts.forEach((dir) => {
        let nr = curr.r;
        let nc = curr.c;

        if (dir === 0) nr -= 1; // TOP
        else if (dir === 1) nc += 1; // RIGHT
        else if (dir === 2) nr += 1; // BOTTOM
        else if (dir === 3) nc -= 1; // LEFT

        // In-bounds check
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          const neighborKey = `${nr},${nc}`;
          const neighborTile = tileMap.get(neighborKey);

          if (neighborTile && neighborTile.type !== 'blank' && neighborTile.type !== 'asteroid') {
            const oppDir = (dir + 2) % 4;
            const neighborPorts = getActivePorts(neighborTile);

            // True mutual electrical connection condition:
            if (neighborPorts.includes(oppDir)) {
              powered.add(neighborKey);

              if (neighborTile.type === 'target') {
                targets.add(neighborTile.targetId || neighborKey);
              }

              if (!visited.has(neighborKey)) {
                visited.add(neighborKey);
                queue.push({ r: nr, c: nc, tile: neighborTile });
              }
            }
          }
        }
      });
    }

    return { poweredSet: powered, poweredTargetIds: targets };
  }, [grid, currentLevelConfig]);

  // Check victory condition
  useEffect(() => {
    if (isWon || isSurged) return;

    if (poweredTargetIds.size >= currentLevelConfig.targetCount) {
      // VICTORY SURGE TRIGGERED!
      setIsSurged(true);
      soundManager.playPowerFlow();
      soundManager.playVictoryChord();
      triggerUnlockNext(level);

      surgeTimerRef.current = setTimeout(() => {
        setIsWon(true);
      }, 800);
    }
  }, [poweredTargetIds, currentLevelConfig, isWon, isSurged, level, triggerUnlockNext]);

  // Click Tile Rotation Handler
  const handleTileClick = (index) => {
    if (isWon || isSurged || isPaused) return;
    const tile = grid[index];
    if (tile.fixed) return; // Fixed tiles do not rotate

    soundManager.playRotateClick();
    setMoveCount((prev) => prev + 1);

    setGrid((prev) => {
      const copy = [...prev];
      const target = copy[index];
      const newRot = (target.rot + 90) % 360;
      copy[index] = { ...target, rot: newRot };
      return copy;
    });
  };

  // Progression to Next Level
  const handleNextLevel = () => {
    if (level < CIRCUIT_LEVELS.length) {
      const nextLvl = level + 1;
      triggerUnlockNext(level);
      handleLevelChange(nextLvl);
      navigate(`/dashboard/kids/play/circuit-connect?level=${nextLvl}`);
    } else {
      navigate('/dashboard/kids');
    }
  };

  // Compute Wonder Stars
  const starsEarned = moveCount <= currentLevelConfig.parMoves + 2 ? 3 : 2;

  return (
    <div className={styles.container}>
      {/* 1. TOP HUD BAR */}
      <header className={styles.hudHeader}>
        {/* Left Section: Back to Arena + Sequential Level Selector */}
        <div className={styles.hudLeft}>
          <Link to="/dashboard/kids" className={styles.kidsArenaExitBtn}>
            ← 🚀 Kids Arena
          </Link>

          <div className={styles.levelTabs}>
            {CIRCUIT_LEVELS.map((lvl) => {
              const isLocked = lvl.level > unlockedLevel;
              return (
                <button
                  key={lvl.level}
                  type="button"
                  onClick={() => handleLevelChange(lvl.level)}
                  className={`${styles.levelTabBtn} ${level === lvl.level ? styles.levelTabActive : ''} ${isLocked ? styles.levelTabLocked : ''}`}
                  disabled={isSurged || isLocked}
                  title={isLocked ? `Complete Level ${lvl.level - 1} to unlock` : `Level ${lvl.level}: ${lvl.title}`}
                >
                  <span>L{lvl.level}</span>
                  {isLocked && <span className={styles.lockBadge}>🔒</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Section: Game Name + Active Level Title Badge */}
        <div className={styles.hudCenter}>
          <div className={styles.gameBrand}>
            <span className={styles.brandIcon}>⚡</span>
            <span className={styles.brandTitle}>Circuit Connect</span>
          </div>
          <span className={styles.levelBadge}>Sector {level}: {currentLevelConfig.title}</span>
        </div>

        {/* Right Section: Stars, Audio, Reset */}
        <div className={styles.hudRight}>
          <div className={styles.starsPill}>
            <Star size={14} fill="currentColor" />
            <span>3 / 3 Stars</span>
          </div>

          <button
            type="button"
            onClick={toggleMute}
            className={styles.utilityBtn}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          <button
            type="button"
            onClick={() => resetLevel()}
            className={styles.utilityBtn}
            disabled={isSurged}
            title="Reset Grid"
          >
            <RotateCcw size={15} />
            <span>Reset Grid</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPaused(true)}
            className={styles.utilityBtn}
            title="Pause Game (Esc or P)"
          >
            <Pause size={15} />
            <span>Pause</span>
          </button>
        </div>
      </header>

      {/* 2. MISSION BRIEF BANNER */}
      <div className={styles.missionBanner}>
        <div className={styles.missionDetails}>
          <h3>
            <Zap size={18} color="#00F0FF" />
            <span>{currentLevelConfig.title} — Sector {level}</span>
          </h3>
          <p>{currentLevelConfig.mission}</p>
        </div>

        <div className={`
          ${styles.circuitStatusBadge}
          ${isSurged ? styles.statusPowered : (poweredTargetIds.size > 0 ? styles.statusSurging : styles.statusDisconnected)}
        `}>
          {isSurged ? (
            <><Sparkles size={15} /> Circuit Complete!</>
          ) : poweredTargetIds.size > 0 ? (
            <><Activity size={15} /> Partial Power Flow</>
          ) : (
            <><Zap size={15} /> Circuit Open</>
          )}
        </div>
      </div>

      {/* 3. MAIN ARENA WORKSPACE */}
      <main className={styles.arenaLayout}>
        <div className={styles.reactorChamber}>
          {/* Cybernetic Corner Brackets */}
          <div className={styles.chamberCornerTL} />
          <div className={styles.chamberCornerTR} />
          <div className={styles.chamberCornerBL} />
          <div className={styles.chamberCornerBR} />

          {/* Interactive Circuit Grid */}
          <div
            className={styles.circuitGrid}
            style={{
              gridTemplateColumns: `repeat(${currentLevelConfig.cols}, 96px)`,
              gridTemplateRows: `repeat(${currentLevelConfig.rows}, 96px)`
            }}
          >
            {grid.map((tile, idx) => {
              const tileKey = `${tile.r},${tile.c}`;
              const isPowered = poweredSet.has(tileKey);
              const isTargetOn = tile.type === 'target' && isPowered;

              return (
                <div
                  key={`${tile.r}-${tile.c}`}
                  onClick={() => handleTileClick(idx)}
                  className={`
                    ${styles.circuitTile}
                    ${tile.fixed ? styles.tileFixed : ''}
                    ${isPowered ? styles.tilePowered : ''}
                    ${isSurged && isPowered ? styles.tileSurged : ''}
                  `}
                  title={tile.fixed ? (tile.type === 'source' ? 'Power Battery (Fixed)' : 'Fixed Module') : 'Click to Rotate 90°'}
                >
                  {/* Rotating Inner SVG Container */}
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      transform: `rotate(${tile.rot}deg)`,
                      transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                  >
                    <TileWireSVG tile={tile} isPowered={isPowered} isSurged={isSurged} />
                  </div>

                  {/* Overlaid Animated Sprites for Source & Target */}
                  {tile.type === 'source' && (
                    <div style={{ position: 'absolute', pointerEvents: 'none' }} className={styles.batteryIcon}>
                      ⚡
                    </div>
                  )}

                  {tile.type === 'target' && (
                    <>
                      <div
                        style={{ position: 'absolute', pointerEvents: 'none' }}
                        className={isTargetOn ? styles.targetBulbOn : styles.targetBulbOff}
                      >
                        {level === 3 ? (tile.targetId === 'crystalA' ? '💎' : '🔮') : '⭐'}
                      </div>
                      {isTargetOn && (
                        <>
                          <div className={styles.electricSpark} style={{ '--spark-ox': '-14px', '--spark-oy': '-14px', top: '22%', left: '22%' }} />
                          <div className={styles.electricSpark} style={{ '--spark-ox': '14px', '--spark-oy': '-14px', top: '22%', right: '22%' }} />
                          <div className={styles.electricSpark} style={{ '--spark-ox': '-14px', '--spark-oy': '14px', bottom: '22%', left: '22%' }} />
                          <div className={styles.electricSpark} style={{ '--spark-ox': '14px', '--spark-oy': '14px', bottom: '22%', right: '22%' }} />
                        </>
                      )}
                    </>
                  )}

                  {tile.type === 'asteroid' && (
                    <div style={{ position: 'absolute', pointerEvents: 'none' }} className={styles.asteroidObstacle}>
                      🪨
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Metrics Bar */}
        <div className={styles.controlsBar}>
          <div className={styles.powerFlowMeter}>
            <span className={styles.flowLabel}>Power Targets:</span>
            <span className={styles.targetsCountPill}>
              {poweredTargetIds.size} / {currentLevelConfig.targetCount} Online
            </span>
          </div>

          <div className={styles.movesCounter}>
            <span>Rotations: <strong>{moveCount}</strong></span>
          </div>
        </div>
      </main>

      {/* ====================================================================
         4. VICTORY MODAL OVERLAY
         ==================================================================== */}
      {isWon && (
        <div className={styles.modalOverlay}>
          <div className={styles.victoryModal}>
            <div className={styles.trophyCircle}>
              ⚡
            </div>

            <h3 className={styles.victoryTitle}>Circuit Complete!</h3>
            <p className={styles.victorySubtitle}>
              Energy conduits locked! You successfully routed electric power through Sector {level}!
            </p>

            <div className={styles.starsRow}>
              {Array.from({ length: starsEarned }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>

            <div className={styles.rewardBox}>
              <div className={styles.rewardItem}>
                <span className={styles.rewardVal}>+100 XP</span>
                <span className={styles.rewardLbl}>Wonder Stars</span>
              </div>
              <div className={styles.rewardItem}>
                <span className={styles.rewardVal}>{moveCount}</span>
                <span className={styles.rewardLbl}>Rotations</span>
              </div>
              <div className={styles.rewardItem}>
                <span className={styles.rewardVal} style={{ color: '#10B981' }}>100%</span>
                <span className={styles.rewardLbl}>Conduit Flow</span>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => resetLevel()}
                className={styles.replayBtn}
              >
                Replay Sector
              </button>

              <button
                type="button"
                onClick={handleNextLevel}
                className={styles.nextLevelBtn}
              >
                <span>{level < CIRCUIT_LEVELS.length ? 'Next Sector' : 'Return to Universe'}</span>
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
          resetLevel();
        }}
        onExit={() => navigate('/dashboard/kids')}
        gameTitle="Circuit Connect: Power Conduit"
        level={level}
        zonePath="/dashboard/kids"
      />
    </div>
  );
};

export default CircuitConnect;
