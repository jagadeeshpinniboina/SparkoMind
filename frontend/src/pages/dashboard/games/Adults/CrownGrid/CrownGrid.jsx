import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGameProgression, unlockNextLevel } from '../../../../../utils/gameProgression.js';
import GamePauseOverlay from '../../../../../components/GamePauseOverlay';
import styles from './CrownGrid.module.css';
import crownAudio from './CrownGridAudio.js';

// ---------------------------------------------------------------------------
// 5 PROGRESSIVE HAND-CRAFTED & MATHEMATICALLY VERIFIED CROWNGRID PUZZLES
// Levels 1–2: 5×5 Grids | Levels 3–4: 6×6 Grids | Level 5: 7×7 Grandmaster Grid
// Strictly 1 unique solution per level (guaranteed via backtrack solver)
// ---------------------------------------------------------------------------
export const CROWNGRID_LEVELS = [
  {
    level: 1,
    title: 'Starter Regions',
    subtitle: '5×5 Grid • 5 Color Territories',
    size: 5,
    crownsCount: 5,
    placement: [1, 4, 2, 0, 3],
    regions: [
      [0, 0, 0, 1, 1],
      [3, 0, 2, 2, 1],
      [3, 0, 2, 4, 1],
      [3, 0, 2, 4, 4],
      [3, 3, 4, 4, 4]
    ]
  },
  {
    level: 2,
    title: 'Interlocking Zones',
    subtitle: '5×5 Grid • Irregular Territories',
    size: 5,
    crownsCount: 5,
    placement: [2, 4, 1, 3, 0],
    regions: [
      [2, 0, 0, 1, 1],
      [2, 2, 0, 0, 1],
      [4, 2, 0, 3, 1],
      [4, 2, 0, 3, 1],
      [4, 4, 3, 3, 1]
    ]
  },
  {
    level: 3,
    title: 'Hexa Territories',
    subtitle: '6×6 Grid • 6 Color Territories',
    size: 6,
    crownsCount: 6,
    placement: [3, 0, 4, 2, 5, 1],
    regions: [
      [1, 1, 0, 0, 0, 4],
      [1, 0, 0, 0, 2, 4],
      [1, 3, 3, 2, 2, 4],
      [1, 5, 3, 2, 4, 4],
      [5, 5, 5, 5, 4, 4],
      [5, 5, 5, 5, 4, 4]
    ]
  },
  {
    level: 4,
    title: 'Diagonal Trap',
    subtitle: '6×6 Grid • Winding Territories',
    size: 6,
    crownsCount: 6,
    placement: [3, 0, 4, 1, 5, 2],
    regions: [
      [1, 3, 0, 0, 2, 2],
      [1, 3, 0, 0, 2, 2],
      [1, 3, 5, 2, 2, 4],
      [3, 3, 5, 2, 4, 4],
      [5, 5, 5, 4, 4, 4],
      [5, 5, 5, 4, 4, 4]
    ]
  },
  {
    level: 5,
    title: 'Sovereign Matrix',
    subtitle: '7×7 Grid • 7 Color Territories',
    size: 7,
    crownsCount: 7,
    placement: [0, 4, 1, 5, 3, 6, 2],
    regions: [
      [0, 0, 4, 4, 4, 4, 4],
      [0, 2, 4, 4, 1, 3, 4],
      [0, 2, 4, 4, 1, 3, 5],
      [0, 6, 4, 4, 4, 3, 5],
      [6, 6, 6, 4, 5, 5, 5],
      [6, 6, 6, 6, 5, 5, 5],
      [6, 6, 6, 6, 5, 5, 5]
    ]
  }
];

/**
 * Format elapsed seconds into mm:ss
 */
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Inner Arena Component keyed by levelNum to guarantee atomic state synchronization
 * when switching between grid sizes (5×5, 6×6, 7×7).
 */
const CrownGridArena = ({
  levelConfig,
  levelNum,
  setLevelNum,
  unlockedLevel,
  onLevelComplete,
  soundMuted,
  onToggleSound
}) => {
  const navigate = useNavigate();
  const size = levelConfig.size;

  // Phases: 'BRIEFING' | 'PLAYING' | 'VICTORY'
  const [phase, setPhase] = useState('BRIEFING');

  // Board state: 2D array of size N×N
  // Values: null (empty), 'x' (elimination mark), 'crown' (👑)
  const [board, setBoard] = useState(() =>
    Array.from({ length: size }, () => new Array(size).fill(null))
  );

  // Set of conflicting cell coordinates: "r-c"
  const [conflicts, setConflicts] = useState(new Set());

  // Real-Time Glowing Bulb Hint charges (3 per level)
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [hintsUsed, setHintsUsed] = useState(0);

  // Target cell pulsing amber spotlight ring: "r-c"
  const [hintPulseCell, setHintPulseCell] = useState(null);

  // Real-time juice: Conflicting pairs for laser warning lines, crown sparkle, auto-x ripple
  const [conflictPairs, setConflictPairs] = useState([]);
  const [sparkleCell, setSparkleCell] = useState(null);
  const [autoXMap, setAutoXMap] = useState({});

  // Victory celebration state
  const [isVictoryWave, setIsVictoryWave] = useState(false);

  // Elapsed time counter
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Keyboard pause shortcut (Escape or P)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (phase !== 'VICTORY') {
          setIsPaused((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase]);

  const pulseTimerRef = useRef(null);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    };
  }, []);

  // Timer counter during PLAYING phase
  useEffect(() => {
    if (phase !== 'PLAYING' || isPaused) return;
    const interval = setInterval(() => {
      setElapsedTime(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, isPaused]);

  // Recalculate conflicts across all placed crowns:
  // Same row, same col, same region, or adjacent (horizontal, vertical, diagonal)
  const calculateConflicts = useCallback((currentBoard) => {
    const newConflicts = new Set();
    const crowns = [];
    const pairs = [];

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (currentBoard[r][c] === 'crown') {
          crowns.push({ r, c, reg: levelConfig.regions[r][c] });
        }
      }
    }

    for (let i = 0; i < crowns.length; i++) {
      for (let j = i + 1; j < crowns.length; j++) {
        const c1 = crowns[i];
        const c2 = crowns[j];
        const sameRow = c1.r === c2.r;
        const sameCol = c1.c === c2.c;
        const sameRegion = c1.reg === c2.reg;
        const adjacent = Math.abs(c1.r - c2.r) <= 1 && Math.abs(c1.c - c2.c) <= 1;

        if (sameRow || sameCol || sameRegion || adjacent) {
          newConflicts.add(`${c1.r}-${c1.c}`);
          newConflicts.add(`${c2.r}-${c2.c}`);
          pairs.push({ c1: { r: c1.r, c: c1.c }, c2: { r: c2.r, c: c2.c } });
        }
      }
    }

    setConflictPairs(pairs);
    return newConflicts;
  }, [size, levelConfig.regions]);

  // Count placed crowns
  const crownsCount = useMemo(() => {
    let count = 0;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (board[r][c] === 'crown') count++;
      }
    }
    return count;
  }, [board, size]);

  // Check victory condition
  useEffect(() => {
    if (phase !== 'PLAYING') return;

    if (crownsCount === levelConfig.crownsCount && conflicts.size === 0) {
      // Complete board verified!
      setIsVictoryWave(true);
      crownAudio.playVictory();
      unlockNextLevel('crown-grid', levelConfig.level);

      const timer = setTimeout(() => {
        setPhase('VICTORY');
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [crownsCount, conflicts.size, levelConfig.crownsCount, phase]);

  // 3-State Cell Tap Cycle: empty -> 'x' -> 'crown' -> empty
  const handleCellClick = (r, c) => {
    if (phase !== 'PLAYING' || isPaused) return;

    const currentVal = board[r][c];
    let nextVal = null;

    if (currentVal === null) {
      nextVal = 'x';
      crownAudio.playCrossTap();
    } else if (currentVal === 'x') {
      nextVal = 'crown';
      crownAudio.playCrownPlace();
      setSparkleCell({ r, c, id: Date.now() });
    } else {
      nextVal = null;
      crownAudio.playClear();
    }

    const nextBoard = board.map(row => [...row]);
    nextBoard[r][c] = nextVal;

    const crownKey = `${r}-${c}`;

    if (nextVal === 'crown') {
      // Auto-X ripple: Invalidate row, col, adjacent box, and region
      const newAutoKeys = [];
      for (let nr = 0; nr < size; nr++) {
        for (let nc = 0; nc < size; nc++) {
          if (nr === r && nc === c) continue;
          const sameRow = nr === r;
          const sameCol = nc === c;
          const sameReg = levelConfig.regions[nr][nc] === levelConfig.regions[r][c];
          const adjacent = Math.abs(nr - r) <= 1 && Math.abs(nc - c) <= 1;

          if (sameRow || sameCol || sameReg || adjacent) {
            if (nextBoard[nr][nc] === null) {
              nextBoard[nr][nc] = 'x';
              newAutoKeys.push(`${nr}-${nc}`);
            }
          }
        }
      }
      setAutoXMap((prev) => ({
        ...prev,
        [crownKey]: new Set(newAutoKeys)
      }));
    } else if (currentVal === 'crown' && nextVal !== 'crown') {
      // Crown removed: Clear auto-X marks associated with this crown if not protected by another crown
      const thisCrownAutoKeys = autoXMap[crownKey];
      if (thisCrownAutoKeys) {
        const otherAutoKeys = new Set();
        Object.entries(autoXMap).forEach(([k, set]) => {
          if (k !== crownKey) {
            set.forEach((ak) => otherAutoKeys.add(ak));
          }
        });

        thisCrownAutoKeys.forEach((ak) => {
          if (!otherAutoKeys.has(ak)) {
            const [ar, ac] = ak.split('-').map(Number);
            if (nextBoard[ar][ac] === 'x') {
              nextBoard[ar][ac] = null;
            }
          }
        });

        setAutoXMap((prev) => {
          const updated = { ...prev };
          delete updated[crownKey];
          return updated;
        });
      }
    }

    setBoard(nextBoard);

    const nextConflicts = calculateConflicts(nextBoard);
    if (nextConflicts.size > conflicts.size) {
      crownAudio.playConflictWarning();
    }
    setConflicts(nextConflicts);
  };

  // Right-click shortcut: Toggle 'x' directly
  const handleContextMenu = (e, r, c) => {
    e.preventDefault();
    if (phase !== 'PLAYING') return;

    const currentVal = board[r][c];
    const nextVal = currentVal === 'x' ? null : 'x';

    if (nextVal === 'x') {
      crownAudio.playCrossTap();
    } else {
      crownAudio.playClear();
    }

    const nextBoard = board.map(row => [...row]);
    nextBoard[r][c] = nextVal;
    setBoard(nextBoard);

    const nextConflicts = calculateConflicts(nextBoard);
    setConflicts(nextConflicts);
  };

  // Real-Time Glowing Bulb Hint (💡)
  const handleBulbHint = () => {
    if (phase !== 'PLAYING' || hintsRemaining <= 0) return;

    const solution = levelConfig.placement; // solution[r] is column of queen in row r
    let targetR = -1;
    let targetC = -1;

    // 1. Find a row where solution crown is not placed
    for (let r = 0; r < size; r++) {
      const correctC = solution[r];
      if (board[r][correctC] !== 'crown') {
        targetR = r;
        targetC = correctC;
        break;
      }
    }

    if (targetR === -1) return; // All crowns placed correctly

    const nextBoard = board.map(row => [...row]);

    // If the user placed a crown anywhere else in this row, remove it
    for (let c = 0; c < size; c++) {
      if (c !== targetC && nextBoard[targetR][c] === 'crown') {
        nextBoard[targetR][c] = 'x';
      }
    }

    // Place the correct crown
    nextBoard[targetR][targetC] = 'crown';

    setBoard(nextBoard);
    setHintsRemaining(prev => prev - 1);
    setHintsUsed(prev => prev + 1);

    // Spotlight pulse animation
    const cellKey = `${targetR}-${targetC}`;
    setHintPulseCell(cellKey);
    crownAudio.playHintUsed();

    if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    pulseTimerRef.current = setTimeout(() => {
      setHintPulseCell(null);
    }, 850);

    const nextConflicts = calculateConflicts(nextBoard);
    setConflicts(nextConflicts);
  };

  // Reset current board
  const handleResetBoard = () => {
    if (phase !== 'PLAYING') return;
    setBoard(Array.from({ length: size }, () => new Array(size).fill(null)));
    setConflicts(new Set());
    setConflictPairs([]);
    setAutoXMap({});
    setSparkleCell(null);
    crownAudio.playClear();
  };

  // Start puzzle from Mission Briefing
  const handleStartBriefing = () => {
    crownAudio.playBriefingStart();
    setPhase('PLAYING');
  };

  // Keyboard shortcut to start level (Enter or Space)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (phase === 'BRIEFING' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleStartBriefing();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase]);

  // Determine grid CSS class based on size
  const gridClass = size === 5 ? styles.grid5x5 : size === 6 ? styles.grid6x6 : styles.grid7x7;

  return (
    <>
      {/* --------------------------------------------------------------------
         HUD CONTROLS & STATUS
         -------------------------------------------------------------------- */}
      <div className={styles.topHud}>
        <div className={styles.hudLeft}>
          <Link to="/dashboard/adults" className={styles.adultsExitBtn} title="Return to Adults Neuro-Lab">
            ← 🧠 Adults Neuro-Lab
          </Link>
        </div>

        <div className={styles.hudCenter}>
          <div className={styles.levelTabs}>
            {CROWNGRID_LEVELS.map(l => {
              const isLocked = l.level > unlockedLevel;
              return (
                <button
                  key={l.level}
                  className={`${styles.tabBtn} ${l.level === levelNum ? styles.tabBtnActive : ''} ${isLocked ? styles.tabBtnLocked : ''}`}
                  onClick={() => !isLocked && setLevelNum(l.level)}
                  disabled={isLocked}
                  title={isLocked ? `Complete Level ${l.level - 1} to unlock` : `${l.title} (${l.size}×${l.size})`}
                >
                  <span>L{l.level}</span>
                  {isLocked && <span className={styles.lockBadge}>🔒</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.hudRight}>
          <div className={styles.timerBadge}>
            <span>⏱️</span>
            <span>{formatTime(elapsedTime)}</span>
          </div>

          <button
            className={styles.iconBtn}
            onClick={() => setIsPaused(true)}
            title="Pause Game (Esc or P)"
          >
            ⏸
          </button>

          <button
            className={styles.iconBtn}
            onClick={() => setPhase('BRIEFING')}
            title="Review Mission Rules"
          >
            ℹ
          </button>

          <button
            className={styles.iconBtn}
            onClick={onToggleSound}
            title={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {soundMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------------------
         HEADER STRIP
         -------------------------------------------------------------------- */}
      <div className={styles.headerStrip}>
        <div className={styles.titleRow}>
          <h1 className={styles.mainTitle}>
            Level {levelConfig.level}: {levelConfig.title}
          </h1>
          <span className={styles.sizeBadge}>{size}×{size} GRID</span>
        </div>
        <p className={styles.subtitleText}>{levelConfig.subtitle}</p>
      </div>

      {/* --------------------------------------------------------------------
         MAIN PLAYING STAGE
         -------------------------------------------------------------------- */}
      <div className={styles.stageWrapper}>
        {/* Real-time Status Indicator */}
        <div className={styles.statusStrip}>
          <div className={styles.statusItem}>
            <span>Crowns:</span>
            <span className={styles.crownsProgress}>
              👑 {crownsCount} / {levelConfig.crownsCount}
            </span>
          </div>

          <div className={styles.conflictIndicator}>
            {conflicts.size > 0 ? (
              <span className={styles.conflictActive}>
                ⚠️ {conflicts.size} Crowns Clashing
              </span>
            ) : crownsCount === levelConfig.crownsCount ? (
              <span style={{ color: '#10B981', fontWeight: 700 }}>
                ✓ All Crowns Placed!
              </span>
            ) : (
              <span>✓ No Conflicts</span>
            )}
          </div>
        </div>

        {/* Puzzle Board Grid */}
        <div
          className={`${styles.gridBoard} ${gridClass}`}
          role="grid"
          aria-label={`${size} by ${size} CrownGrid Board`}
        >
          {/* Live Conflict Warning Lines connecting conflicting crowns */}
          {conflictPairs.length > 0 && (
            <svg className={styles.conflictSvgOverlay} viewBox="0 0 100 100" preserveAspectRatio="none">
              {conflictPairs.map((pair, idx) => {
                const x1 = ((pair.c1.c + 0.5) / size) * 100;
                const y1 = ((pair.c1.r + 0.5) / size) * 100;
                const x2 = ((pair.c2.c + 0.5) / size) * 100;
                const y2 = ((pair.c2.r + 0.5) / size) * 100;
                return (
                  <g key={`conflict-line-${idx}`}>
                    <line
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      stroke="rgba(239, 68, 68, 0.45)"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <line
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      stroke="#EF4444"
                      strokeWidth="2.5"
                      strokeDasharray="6 3"
                      strokeLinecap="round"
                      className={styles.conflictWarningLine}
                    />
                  </g>
                );
              })}
            </svg>
          )}

          {board.map((row, r) =>
            row.map((cellVal, c) => {
              const reg = levelConfig.regions[r][c];
              const cellKey = `${r}-${c}`;
              const hasConflict = conflicts.has(cellKey);
              const isPulsing = hintPulseCell === cellKey;

              // Border classes for region territory dividers
              const borderTopClass = (r === 0 || levelConfig.regions[r - 1][c] !== reg) ? styles.borderTop : '';
              const borderBottomClass = (r === size - 1 || levelConfig.regions[r + 1][c] !== reg) ? styles.borderBottom : '';
              const borderLeftClass = (c === 0 || levelConfig.regions[r][c - 1] !== reg) ? styles.borderLeft : '';
              const borderRightClass = (c === size - 1 || levelConfig.regions[r][c + 1] !== reg) ? styles.borderRight : '';

              const regionClass = styles[`region${reg % 7}`] || '';

              return (
                <div
                  key={cellKey}
                  className={`
                    ${styles.cell}
                    ${regionClass}
                    ${borderTopClass}
                    ${borderBottomClass}
                    ${borderLeftClass}
                    ${borderRightClass}
                    ${hasConflict ? styles.cellConflict : ''}
                    ${isPulsing ? styles.cellHintPulse : ''}
                    ${isVictoryWave && cellVal === 'crown' ? styles.cellVictoryWave : ''}
                  `}
                  onClick={() => handleCellClick(r, c)}
                  onContextMenu={(e) => handleContextMenu(e, r, c)}
                  role="gridcell"
                  tabIndex={0}
                  aria-label={`Row ${r + 1} Col ${c + 1} Region ${reg + 1}: ${cellVal || 'empty'}`}
                >
                  {/* Golden Sparkle Pulse upon Crown Placement */}
                  {sparkleCell?.r === r && sparkleCell?.c === c && (
                    <span key={sparkleCell.id} className={styles.crownSparklePulse} />
                  )}
                  {cellVal === 'x' && <span className={styles.cellCross}>×</span>}
                  {cellVal === 'crown' && <span className={styles.cellCrown}>👑</span>}
                </div>
              );
            })
          )}
        </div>

        {/* Action Controls & Real-Time Bulb Hint */}
        <div className={styles.controlsBar}>
          <button
            className={styles.bulbHintBtn}
            onClick={handleBulbHint}
            disabled={hintsRemaining <= 0 || phase !== 'PLAYING'}
            title={hintsRemaining > 0 ? `Reveal correct crown (${hintsRemaining} left)` : 'No hints remaining'}
          >
            <span>💡</span> Hint • {hintsRemaining}
          </button>

          <button
            className={styles.actionBtn}
            onClick={handleResetBoard}
            disabled={phase !== 'PLAYING'}
            title="Reset board to empty"
          >
            <span>↺</span> Clear
          </button>
        </div>

        {/* Tactile input hint */}
        <div className={styles.hintBar}>
          <span>Tap:</span>
          <span className={styles.kbdKey}>Empty</span>
          <span>→</span>
          <span className={styles.kbdKey}>×</span>
          <span>→</span>
          <span className={styles.kbdKey}>👑</span>
          <span>| Right-Click: Quick ×</span>
        </div>
      </div>

      {/* --------------------------------------------------------------------
         PRE-LEVEL MISSION BRIEFING OVERLAY
         -------------------------------------------------------------------- */}
      {phase === 'BRIEFING' && (
        <div className={styles.briefingOverlay}>
          <div className={styles.briefingCard}>
            <div className={styles.briefingHeader}>
              <span className={styles.missionBadge}>
                Level {levelConfig.level} • Mission Briefing
              </span>
              <h2 className={styles.briefingTitle}>{levelConfig.title}</h2>
              <p className={styles.briefingGoal}>
                Place exactly <strong>{levelConfig.crownsCount} crowns</strong> on the board. Each row, column, and color territory must contain exactly one crown.
              </p>
            </div>

            {/* 3 Core Rules */}
            <div className={styles.rulesBox}>
              <div className={styles.ruleItem}>
                <span className={styles.ruleIcon}>👑</span>
                <span>
                  <strong>1 Crown Per Zone:</strong> Exactly 1 crown in every Row, Column, and Color Territory.
                </span>
              </div>
              <div className={styles.ruleItem}>
                <span className={styles.ruleIcon}>🚫</span>
                <span>
                  <strong>No Touching:</strong> Crowns cannot touch each other horizontally, vertically, or diagonally.
                </span>
              </div>
              <div className={styles.ruleItem}>
                <span className={styles.ruleIcon}>🖱️</span>
                <span>
                  <strong>3-State Tap:</strong> Tap once for <code style={{ color: '#94A3B8' }}>×</code> (elimination), twice for <code>👑</code>, three times to clear.
                </span>
              </div>
            </div>

            <div className={styles.briefingTips}>
              <p>💡 Tip: Use elimination markers (<code style={{ color: '#94A3B8' }}>×</code>) to isolate where crowns cannot go.</p>
              <p>👑 When you place a crown, immediately cross out all adjacent 8 cells!</p>
            </div>

            <button
              className={styles.startButton}
              onClick={handleStartBriefing}
              autoFocus
            >
              <span>✓ Got It, Start ▷</span>
            </button>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------
         VICTORY MODAL OVERLAY
         -------------------------------------------------------------------- */}
      {phase === 'VICTORY' && (
        <div className={styles.modalOverlay}>
          <div className={styles.victoryCard}>
            <div className={styles.victoryIcon}>👑</div>
            <h2 className={styles.victoryTitle}>Territory Mastered!</h2>
            <p className={styles.victorySubtitle}>
              All {levelConfig.crownsCount} crowns placed with zero conflicts across all color territories.
            </p>

            <div className={styles.xpPill}>
              <span>⚡</span> +150 Neuro XP
            </div>

            <div className={styles.victoryStats}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Solve Time</span>
                <span className={styles.statValue}>{formatTime(elapsedTime)}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Hints Used</span>
                <span className={styles.statValue}>{hintsUsed}</span>
              </div>
            </div>

            <div className={styles.victoryActions}>
              <button
                className={styles.secondaryBtn}
                onClick={() => {
                  setPhase('BRIEFING');
                  setBoard(Array.from({ length: size }, () => new Array(size).fill(null)));
                  setConflicts(new Set());
                  setIsVictoryWave(false);
                }}
              >
                Replay
              </button>

              {levelConfig.level < CROWNGRID_LEVELS.length ? (
                <button
                  className={styles.primaryVictoryBtn}
                  onClick={onLevelComplete}
                  autoFocus
                >
                  Next Level →
                </button>
              ) : (
                <button
                  className={styles.primaryVictoryBtn}
                  onClick={() => navigate('/dashboard/adults')}
                  autoFocus
                >
                  Finish Arena ⚡
                </button>
              )}
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
          setBoard(Array.from({ length: size }, () => new Array(size).fill(null)));
          setConflicts(new Set());
          setIsVictoryWave(false);
        }}
        onExit={() => navigate('/dashboard/adults')}
        gameTitle={`CrownGrid: ${levelConfig.title}`}
        level={levelConfig.level}
        zonePath="/dashboard/adults"
      />
    </>
  );
};

/**
 * Main Controller Component
 */
export const CrownGrid = ({ initialLevel = 1 }) => {
  const { unlockedLevel, unlockNextLevel: triggerUnlockNext, isLevelUnlocked } = useGameProgression('crown-grid');
  const [levelNum, setLevelNum] = useState(
    () => Math.min(Math.max(initialLevel, 1), Math.min(unlockedLevel, CROWNGRID_LEVELS.length))
  );
  const [soundMuted, setSoundMuted] = useState(false);

  // Keep level clamped if unlockedLevel changes
  useEffect(() => {
    if (levelNum > unlockedLevel) {
      setLevelNum(unlockedLevel);
    }
  }, [unlockedLevel, levelNum]);

  const levelConfig = useMemo(
    () => CROWNGRID_LEVELS[levelNum - 1] || CROWNGRID_LEVELS[0],
    [levelNum]
  );

  const handleNextLevel = () => {
    if (levelNum < CROWNGRID_LEVELS.length) {
      triggerUnlockNext(levelNum);
      setLevelNum(l => l + 1);
    }
  };

  const handleToggleSound = () => {
    const nextMuted = !soundMuted;
    setSoundMuted(nextMuted);
    crownAudio.setMuted(nextMuted);
  };

  return (
    <div className={styles.arenaContainer}>
      {/* Render inner arena with key={levelNum} to guarantee atomic state resetting */}
      <CrownGridArena
        key={`crowngrid-arena-level-${levelNum}`}
        levelConfig={levelConfig}
        levelNum={levelNum}
        setLevelNum={setLevelNum}
        unlockedLevel={unlockedLevel}
        onLevelComplete={handleNextLevel}
        soundMuted={soundMuted}
        onToggleSound={handleToggleSound}
      />
    </div>
  );
};

export default CrownGrid;
