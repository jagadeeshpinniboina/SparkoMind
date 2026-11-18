import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGameProgression, unlockNextLevel } from '../../../../../utils/gameProgression.js';
import GamePauseOverlay from '../../../../../components/GamePauseOverlay';
import styles from './GoldenZip.module.css';
import goldenZipAudio from './GoldenZipAudio.js';

// ---------------------------------------------------------------------------
// 5 MATHEMATICALLY VERIFIED HAMILTONIAN PATH LEVELS
// 100% solvable paths visiting every single tile and hitting checkpoints 1..K in order
// ---------------------------------------------------------------------------
export const GOLDENZIP_LEVELS = [
  {
    level: 1,
    title: 'Gentle Meadow',
    subtitle: '4×4 Grid • 4 Golden Checkpoints',
    rows: 4,
    cols: 4,
    gridClass: styles.grid4x4,
    checkpoints: [
      { number: 1, r: 0, c: 0, stepIndex: 0 },
      { number: 2, r: 1, c: 2, stepIndex: 5 },
      { number: 3, r: 2, c: 2, stepIndex: 10 },
      { number: 4, r: 3, c: 0, stepIndex: 15 }
    ],
    solutionPath: [
      { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }, { r: 0, c: 3 },
      { r: 1, c: 3 }, { r: 1, c: 2 }, { r: 1, c: 1 }, { r: 1, c: 0 },
      { r: 2, c: 0 }, { r: 2, c: 1 }, { r: 2, c: 2 }, { r: 2, c: 3 },
      { r: 3, c: 3 }, { r: 3, c: 2 }, { r: 3, c: 1 }, { r: 3, c: 0 }
    ]
  },
  {
    level: 2,
    title: 'Winding Brook',
    subtitle: '4×4 Grid • 5 Golden Checkpoints',
    rows: 4,
    cols: 4,
    gridClass: styles.grid4x4,
    checkpoints: [
      { number: 1, r: 0, c: 0, stepIndex: 0 },
      { number: 2, r: 3, c: 1, stepIndex: 4 },
      { number: 3, r: 0, c: 2, stepIndex: 8 },
      { number: 4, r: 3, c: 3, stepIndex: 12 },
      { number: 5, r: 0, c: 3, stepIndex: 15 }
    ],
    solutionPath: [
      { r: 0, c: 0 }, { r: 1, c: 0 }, { r: 2, c: 0 }, { r: 3, c: 0 },
      { r: 3, c: 1 }, { r: 2, c: 1 }, { r: 1, c: 1 }, { r: 0, c: 1 },
      { r: 0, c: 2 }, { r: 1, c: 2 }, { r: 2, c: 2 }, { r: 3, c: 2 },
      { r: 3, c: 3 }, { r: 2, c: 3 }, { r: 1, c: 3 }, { r: 0, c: 3 }
    ]
  },
  {
    level: 3,
    title: 'Garden Walk',
    subtitle: '5×5 Grid • 5 Golden Checkpoints',
    rows: 5,
    cols: 5,
    gridClass: styles.grid5x5,
    checkpoints: [
      { number: 1, r: 0, c: 0, stepIndex: 0 },
      { number: 2, r: 1, c: 3, stepIndex: 6 },
      { number: 3, r: 2, c: 2, stepIndex: 12 },
      { number: 4, r: 3, c: 3, stepIndex: 18 },
      { number: 5, r: 4, c: 4, stepIndex: 24 }
    ],
    solutionPath: [
      { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }, { r: 0, c: 3 }, { r: 0, c: 4 },
      { r: 1, c: 4 }, { r: 1, c: 3 }, { r: 1, c: 2 }, { r: 1, c: 1 }, { r: 1, c: 0 },
      { r: 2, c: 0 }, { r: 2, c: 1 }, { r: 2, c: 2 }, { r: 2, c: 3 }, { r: 2, c: 4 },
      { r: 3, c: 4 }, { r: 3, c: 3 }, { r: 3, c: 2 }, { r: 3, c: 1 }, { r: 3, c: 0 },
      { r: 4, c: 0 }, { r: 4, c: 1 }, { r: 4, c: 2 }, { r: 4, c: 3 }, { r: 4, c: 4 }
    ]
  },
  {
    level: 4,
    title: 'Golden Courtyard',
    subtitle: '5×5 Grid • 6 Golden Checkpoints',
    rows: 5,
    cols: 5,
    gridClass: styles.grid5x5,
    checkpoints: [
      { number: 1, r: 0, c: 0, stepIndex: 0 },
      { number: 2, r: 4, c: 1, stepIndex: 5 },
      { number: 3, r: 0, c: 2, stepIndex: 10 },
      { number: 4, r: 4, c: 3, stepIndex: 15 },
      { number: 5, r: 0, c: 4, stepIndex: 20 },
      { number: 6, r: 4, c: 4, stepIndex: 24 }
    ],
    solutionPath: [
      { r: 0, c: 0 }, { r: 1, c: 0 }, { r: 2, c: 0 }, { r: 3, c: 0 }, { r: 4, c: 0 },
      { r: 4, c: 1 }, { r: 3, c: 1 }, { r: 2, c: 1 }, { r: 1, c: 1 }, { r: 0, c: 1 },
      { r: 0, c: 2 }, { r: 1, c: 2 }, { r: 2, c: 2 }, { r: 3, c: 2 }, { r: 4, c: 2 },
      { r: 4, c: 3 }, { r: 3, c: 3 }, { r: 2, c: 3 }, { r: 1, c: 3 }, { r: 0, c: 3 },
      { r: 0, c: 4 }, { r: 1, c: 4 }, { r: 2, c: 4 }, { r: 3, c: 4 }, { r: 4, c: 4 }
    ]
  },
  {
    level: 5,
    title: 'Grand Pavilion',
    subtitle: '6×6 Grid • 7 Golden Checkpoints',
    rows: 6,
    cols: 6,
    gridClass: styles.grid6x6,
    checkpoints: [
      { number: 1, r: 0, c: 0, stepIndex: 0 },
      { number: 2, r: 1, c: 5, stepIndex: 6 },
      { number: 3, r: 2, c: 0, stepIndex: 12 },
      { number: 4, r: 3, c: 5, stepIndex: 18 },
      { number: 5, r: 4, c: 0, stepIndex: 24 },
      { number: 6, r: 5, c: 5, stepIndex: 30 },
      { number: 7, r: 5, c: 0, stepIndex: 35 }
    ],
    solutionPath: [
      { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }, { r: 0, c: 3 }, { r: 0, c: 4 }, { r: 0, c: 5 },
      { r: 1, c: 5 }, { r: 1, c: 4 }, { r: 1, c: 3 }, { r: 1, c: 2 }, { r: 1, c: 1 }, { r: 1, c: 0 },
      { r: 2, c: 0 }, { r: 2, c: 1 }, { r: 2, c: 2 }, { r: 2, c: 3 }, { r: 2, c: 4 }, { r: 2, c: 5 },
      { r: 3, c: 5 }, { r: 3, c: 4 }, { r: 3, c: 3 }, { r: 3, c: 2 }, { r: 3, c: 1 }, { r: 3, c: 0 },
      { r: 4, c: 0 }, { r: 4, c: 1 }, { r: 4, c: 2 }, { r: 4, c: 3 }, { r: 4, c: 4 }, { r: 4, c: 5 },
      { r: 5, c: 5 }, { r: 5, c: 4 }, { r: 5, c: 3 }, { r: 5, c: 2 }, { r: 5, c: 1 }, { r: 5, c: 0 }
    ]
  }
];

/**
 * Inner Arena Component keyed by levelNum
 */
const GoldenZipArena = ({
  levelConfig,
  onSelectLevel,
  onLevelComplete,
  soundMuted,
  onToggleSound,
  unlockedLevel = 1
}) => {
  const navigate = useNavigate();

  // Phases: 'BRIEFING' | 'PLAYING' | 'VICTORY'
  const [phase, setPhase] = useState('BRIEFING');

  // Player's active path: starts at Checkpoint 1
  const [path, setPath] = useState(() => [levelConfig.solutionPath[0]]);

  // Dragging interaction state
  const isDraggingRef = useRef(false);

  // Remaining Hint charges
  const [hintsLeft, setHintsLeft] = useState(3);

  // Animated spotlight coordinates for Bulb Hint
  const [hintSpotlights, setHintSpotlights] = useState([]);

  // Shaking cell coordinate for invalid step
  const [shakeCoord, setShakeCoord] = useState(null);

  // Moves counter
  const [movesCount, setMovesCount] = useState(0);
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

  // Map of checkpoints by "r,c"
  const checkpointMap = useMemo(() => {
    const map = {};
    levelConfig.checkpoints.forEach((cp) => {
      map[`${cp.r},${cp.c}`] = cp.number;
    });
    return map;
  }, [levelConfig]);

  const totalCells = levelConfig.rows * levelConfig.cols;
  const totalCheckpoints = levelConfig.checkpoints.length;

  // Highest checkpoint currently reached in path
  const currentCheckpointReached = useMemo(() => {
    let highest = 1;
    path.forEach((p) => {
      const num = checkpointMap[`${p.r},${p.c}`];
      if (num && num > highest) highest = num;
    });
    return highest;
  }, [path, checkpointMap]);

  // Set of visited coordinates for fast lookup
  const pathSet = useMemo(() => {
    const s = new Set();
    path.forEach((p) => s.add(`${p.r},${p.c}`));
    return s;
  }, [path]);

  const headCoord = path[path.length - 1];

  // Map of connection bridges for each cell in path (up, down, left, right)
  const pathConnections = useMemo(() => {
    const map = {};
    for (let i = 0; i < path.length; i++) {
      const curr = path[i];
      const key = `${curr.r},${curr.c}`;
      map[key] = { up: false, down: false, left: false, right: false };

      if (i > 0) {
        const prev = path[i - 1];
        if (prev.r === curr.r - 1) map[key].up = true;
        if (prev.r === curr.r + 1) map[key].down = true;
        if (prev.c === curr.c - 1) map[key].left = true;
        if (prev.c === curr.c + 1) map[key].right = true;
      }

      if (i < path.length - 1) {
        const next = path[i + 1];
        if (next.r === curr.r - 1) map[key].up = true;
        if (next.r === curr.r + 1) map[key].down = true;
        if (next.c === curr.c - 1) map[key].left = true;
        if (next.c === curr.c + 1) map[key].right = true;
      }
    }
    return map;
  }, [path]);

  // Valid next step coordinates (for responsive hover cues)
  const validNextCoords = useMemo(() => {
    const set = new Set();
    if (!headCoord) return set;
    const neighbors = [
      { r: headCoord.r - 1, c: headCoord.c },
      { r: headCoord.r + 1, c: headCoord.c },
      { r: headCoord.r, c: headCoord.c - 1 },
      { r: headCoord.r, c: headCoord.c + 1 }
    ];

    neighbors.forEach((n) => {
      if (n.r >= 0 && n.r < levelConfig.rows && n.c >= 0 && n.c < levelConfig.cols) {
        const key = `${n.r},${n.c}`;
        if (!pathSet.has(key)) {
          const cp = checkpointMap[key];
          if (!cp || cp === currentCheckpointReached + 1) {
            set.add(key);
          }
        }
      }
    });
    return set;
  }, [headCoord, levelConfig, pathSet, checkpointMap, currentCheckpointReached]);

  // Global mouse/pointer up listener to cancel drag
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      isDraggingRef.current = false;
    };
    window.addEventListener('pointerup', handleGlobalPointerUp);
    return () => window.removeEventListener('pointerup', handleGlobalPointerUp);
  }, []);

  // Keyboard shortcut to start from briefing (Enter or Space)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (phase === 'BRIEFING' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleStartPlaying();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase]);

  const handleStartPlaying = () => {
    goldenZipAudio.playBriefingStart();
    setPhase('PLAYING');
  };

  const handleRestartLevel = () => {
    setPath([levelConfig.solutionPath[0]]);
    setHintSpotlights([]);
    setShakeCoord(null);
    setMovesCount(0);
    handleStartPlaying();
  };

  // Check victory condition
  const checkVictory = useCallback((testPath) => {
    if (testPath.length === totalCells) {
      const lastCell = testPath[testPath.length - 1];
      const lastCp = checkpointMap[`${lastCell.r},${lastCell.c}`];
      if (lastCp === totalCheckpoints) {
        goldenZipAudio.playVictory();
        unlockNextLevel('golden-zip', levelConfig.level);
        setTimeout(() => {
          setPhase('VICTORY');
        }, 550);
        return true;
      }
    }
    return false;
  }, [totalCells, checkpointMap, totalCheckpoints]);

  // Step or Backtrack Logic
  const tryStepToCell = useCallback((r, c) => {
    if (phase !== 'PLAYING' || isPaused) return;

    setPath((prevPath) => {
      const head = prevPath[prevPath.length - 1];

      // If clicked current head, nothing to do
      if (head.r === r && head.c === c) return prevPath;

      // Check if (r, c) is already in the path
      const existingIdx = prevPath.findIndex((p) => p.r === r && p.c === c);

      if (existingIdx !== -1) {
        // BACKTRACK: User clicked on an earlier cell in their path
        goldenZipAudio.playUndo();
        return prevPath.slice(0, existingIdx + 1);
      }

      // Check orthogonal adjacency to current head: |Δr| + |Δc| === 1
      const dist = Math.abs(head.r - r) + Math.abs(head.c - c);
      if (dist !== 1) return prevPath; // Not adjacent

      // Validate checkpoint order
      const cpNumber = checkpointMap[`${r},${c}`];
      if (cpNumber) {
        let highestCp = 1;
        prevPath.forEach((p) => {
          const num = checkpointMap[`${p.r},${p.c}`];
          if (num && num > highestCp) highestCp = num;
        });

        if (cpNumber !== highestCp + 1) {
          // Out of order checkpoint attempt
          goldenZipAudio.playInvalid();
          setShakeCoord(`${r},${c}`);
          setTimeout(() => setShakeCoord(null), 350);
          return prevPath;
        }
      }

      // Valid step!
      setMovesCount((m) => m + 1);

      if (cpNumber) {
        goldenZipAudio.playCheckpointReached(cpNumber);
      } else {
        goldenZipAudio.playStep(prevPath.length);
      }

      const nextPath = [...prevPath, { r, c }];
      checkVictory(nextPath);
      return nextPath;
    });
  }, [phase, checkpointMap, checkVictory]);

  // Pointer Down on Cell
  const handleCellPointerDown = (r, c) => {
    isDraggingRef.current = true;
    tryStepToCell(r, c);
  };

  // Pointer Enter on Cell (for smooth dragging)
  const handleCellPointerEnter = (r, c) => {
    if (!isDraggingRef.current) return;
    tryStepToCell(r, c);
  };

  // Undo Button: Backtrack 1 step
  const handleUndo = () => {
    if (path.length > 1) {
      goldenZipAudio.playUndo();
      setPath((prev) => prev.slice(0, prev.length - 1));
    }
  };

  // Reset Button: Return to Checkpoint 1
  const handleReset = () => {
    goldenZipAudio.playReset();
    setPath([levelConfig.solutionPath[0]]);
  };

  // Glowing Bulb Hint (3 charges per level: advances 3 steps)
  const handleHint = () => {
    if (hintsLeft <= 0 || phase !== 'PLAYING') return;

    setHintsLeft((h) => h - 1);
    goldenZipAudio.playHint();

    const sol = levelConfig.solutionPath;

    // Find length of common prefix
    let commonLen = 0;
    while (
      commonLen < path.length &&
      commonLen < sol.length &&
      path[commonLen].r === sol[commonLen].r &&
      path[commonLen].c === sol[commonLen].c
    ) {
      commonLen++;
    }

    // Advance by up to 3 next steps along solution path
    const targetEnd = Math.min(commonLen + 3, sol.length);
    const newPath = sol.slice(0, targetEnd);
    const addedSpots = sol.slice(commonLen, targetEnd).map((p) => `${p.r},${p.c}`);

    setPath(newPath);
    setHintSpotlights(addedSpots);
    setTimeout(() => setHintSpotlights([]), 1400);

    checkVictory(newPath);
  };

  return (
    <>
      {/* --------------------------------------------------------------------
         UNIFIED COMPACT HEADER BAR (SINGLE ROW • SAVES ~180px)
         -------------------------------------------------------------------- */}
      <header className={styles.compactHeader}>
        {/* Left Section: Back to Sanctuary + Level Pills */}
        <div className={styles.headerLeft}>
          <Link
            to="/dashboard/seniors"
            className={styles.seniorsExitBtn}
            title="Return to Seniors Sanctuary"
          >
            ← 🌿 Seniors Sanctuary
          </Link>

          <div className={styles.levelTabs}>
            {GOLDENZIP_LEVELS.map((l) => {
              const isLocked = l.level > unlockedLevel;
              return (
                <button
                  key={l.level}
                  className={`${styles.tabBtn} ${l.level === levelConfig.level ? styles.tabBtnActive : ''} ${isLocked ? styles.tabBtnLocked : ''}`}
                  onClick={() => !isLocked && onSelectLevel(l.level)}
                  disabled={isLocked}
                  title={isLocked ? `Complete Level ${l.level - 1} to unlock` : `${l.title} (${l.rows}×${l.cols} Grid)`}
                >
                  <span>L{l.level}</span>
                  {isLocked && <span className={styles.lockBadge}>🔒</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Section: Level Title & Checkpoints Badge */}
        <div className={styles.headerCenter}>
          <h1 className={styles.levelTitleText}>
            Level {levelConfig.level}: {levelConfig.title}
          </h1>
          <span className={styles.levelBadge}>{totalCheckpoints} Checkpoints</span>
        </div>

        {/* Right Section: Live Metrics & Quick Actions */}
        <div className={styles.headerRight}>
          <div className={styles.metricsGroup}>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Tiles:</span>
              <span className={styles.metricValEmerald}>
                {path.length} / {totalCells}
              </span>
            </div>
            <div className={styles.metricDivider} />
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Visited:</span>
              <span className={styles.metricValGold}>
                {currentCheckpointReached} / {totalCheckpoints}
              </span>
            </div>
          </div>

          <div className={styles.actionBtns}>
            {/* Pause Game */}
            <button
              className={styles.toolBtn}
              onClick={() => setIsPaused(true)}
              title="Pause Game (Esc or P)"
            >
              <span>⏸</span> Pause
            </button>

            {/* Glowing Bulb Hint */}
            <button
              className={styles.hintBtn}
              onClick={handleHint}
              disabled={hintsLeft <= 0 || phase !== 'PLAYING'}
              title={`Reveal next 3 steps (${hintsLeft} hints left)`}
            >
              <span>💡</span> Hint ({hintsLeft})
            </button>

            {/* Backtrack / Undo */}
            <button
              className={styles.toolBtn}
              onClick={handleUndo}
              disabled={path.length <= 1 || phase !== 'PLAYING'}
              title="Undo last step"
            >
              <span>↩</span> Undo
            </button>

            {/* Reset */}
            <button
              className={styles.toolBtn}
              onClick={handleReset}
              disabled={path.length <= 1 || phase !== 'PLAYING'}
              title="Reset path back to 1"
            >
              <span>↺</span> Reset
            </button>

            {/* Info / Overview */}
            <button
              className={styles.iconBtn}
              onClick={() => setPhase('BRIEFING')}
              title="Read Activity Overview"
            >
              ℹ
            </button>

            {/* Sound Toggle */}
            <button
              className={styles.iconBtn}
              onClick={onToggleSound}
              title={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {soundMuted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>
      </header>

      {/* --------------------------------------------------------------------
         MAIN PLAYING STAGE (FLEX-CENTERED IN REMAINING VIEWPORT HEIGHT)
         -------------------------------------------------------------------- */}
      <div className={styles.stageWrapper}>
        <div className={styles.boardWrapper}>
          {/* Interactive Grid with Continuous 3D Golden Ribbon Path Fill */}
          <div
            className={`${styles.gridBoard} ${levelConfig.gridClass}`}
            role="grid"
            aria-label={`${levelConfig.title} Path Board`}
          >
            {Array.from({ length: levelConfig.rows }).map((_, r) =>
              Array.from({ length: levelConfig.cols }).map((_, c) => {
                const coordKey = `${r},${c}`;
                const isInPath = pathSet.has(coordKey);
                const isHead = headCoord && headCoord.r === r && headCoord.c === c;
                const cpNum = checkpointMap[coordKey];
                const isHinted = hintSpotlights.includes(coordKey);
                const isShaking = shakeCoord === coordKey;
                const isValidNext = validNextCoords.has(coordKey);
                const conn = pathConnections[coordKey];

                return (
                  <div
                    key={coordKey}
                    className={`
                      ${styles.cell}
                      ${isInPath ? styles.cellInPath : ''}
                      ${isHead ? styles.cellHead : ''}
                      ${isValidNext ? styles.cellValidNext : ''}
                      ${isHinted ? styles.hintPulse : ''}
                      ${isShaking ? styles.cellShake : ''}
                    `}
                    onPointerDown={() => handleCellPointerDown(r, c)}
                    onPointerEnter={() => handleCellPointerEnter(r, c)}
                    role="gridcell"
                    tabIndex={0}
                    aria-label={`Cell (${r + 1}, ${c + 1})${cpNum ? ` Checkpoint ${cpNum}` : ''}${isInPath ? ' Visited' : ''}`}
                  >
                    {/* Thick continuous golden connector bridges spanning the 8px gap */}
                    {conn?.right && <div className={styles.bridgeRight} />}
                    {conn?.left && <div className={styles.bridgeLeft} />}
                    {conn?.down && <div className={styles.bridgeDown} />}
                    {conn?.up && <div className={styles.bridgeUp} />}

                    {/* Checkpoint Badges or Inner Pips */}
                    {cpNum ? (
                      <div
                        className={`
                          ${styles.checkpointBadge}
                          ${isInPath ? styles.checkpointVisited : styles.checkpointUnvisited}
                        `}
                      >
                        {cpNum}
                      </div>
                    ) : isHead ? (
                      <div className={styles.headPip} />
                    ) : !isInPath ? (
                      <div className={styles.emptyPip} />
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------
         PRE-LEVEL WELCOME BRIEFING OVERLAY (ZERO-SCROLL GUARANTEE)
         -------------------------------------------------------------------- */}
      {phase === 'BRIEFING' && (
        <div className={styles.briefingOverlay} draggable="false">
          <div className={styles.briefingCard} draggable="false">
            <div className={styles.briefingHeader}>
              <span className={styles.missionBadge}>
                Level {levelConfig.level} • Welcome
              </span>
              <h2 className={styles.briefingTitle}>{levelConfig.title}</h2>
              <p className={styles.briefingGoal}>
                Guide the golden ribbon from 1 to the final number in order, passing through every tile once.
              </p>
            </div>

            {/* Mini Visual Diagram matching new Golden Ribbon style */}
            <div className={styles.diagramBox} draggable="false">
              <div className={styles.diagramFlow} draggable="false">
                <div className={`${styles.diagramNode} ${styles.diagramStart}`} draggable="false">
                  ①
                </div>
                <span className={styles.diagramArrow}>→</span>
                <div className={`${styles.diagramNode} ${styles.diagramStep}`} draggable="false">
                  🌿
                </div>
                <span className={styles.diagramArrow}>→</span>
                <div className={`${styles.diagramNode} ${styles.diagramStep}`} draggable="false">
                  🌿
                </div>
                <span className={styles.diagramArrow}>→</span>
                <div className={`${styles.diagramNode} ${styles.diagramNext}`} draggable="false">
                  ②
                </div>
                <span className={styles.diagramArrow}>→</span>
                <div className={`${styles.diagramNode} ${styles.diagramNext}`} draggable="false">
                  ③
                </div>
              </div>
              <span className={styles.diagramCaption}>
                Tap neighbor tiles or press & drag smoothly • Connect checkpoints in order
              </span>
            </div>

            <p className={styles.reassuranceText} draggable="false">
              <span>✨</span> There is no timer. Take all the time you need to weave your path.
            </p>

            <button
              className={styles.startButton}
              onClick={handleStartPlaying}
              autoFocus
              draggable="false"
            >
              <span>Start Playing ▷</span>
            </button>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------
         VICTORY MODAL OVERLAY (WARM, DIGNIFIED • ZERO SCROLL)
         -------------------------------------------------------------------- */}
      {phase === 'VICTORY' && (
        <div className={styles.modalOverlay} draggable="false">
          <div className={styles.victoryCard} draggable="false">
            <div className={styles.victoryIcon} draggable="false">✨</div>
            <h2 className={styles.victoryTitle} draggable="false">Harmonious Flow!</h2>
            <p className={styles.victorySubtitle} draggable="false">
              You guided the golden ribbon across all {totalCells} tiles and connected all {totalCheckpoints} checkpoints in peaceful sequence.
            </p>

            <div className={styles.vitalityPill}>
              <span>🌿</span> +100 Vitality Points
            </div>

            <div className={styles.victoryStats}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Tiles Filled</span>
                <span className={styles.statValue}>
                  {totalCells} / {totalCells}
                </span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Steps Taken</span>
                <span className={styles.statValue}>{movesCount}</span>
              </div>
            </div>

            <div className={styles.victoryActions}>
              <button
                className={styles.secondaryBtn}
                onClick={handleRestartLevel}
              >
                Play Again
              </button>

              {levelConfig.level < GOLDENZIP_LEVELS.length ? (
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
                  onClick={() => navigate('/dashboard/seniors')}
                  autoFocus
                >
                  Return to Sanctuary 🌿
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
        onRestart={handleReset}
        onExit={() => navigate('/dashboard/seniors')}
        gameTitle={`GoldenZip: ${levelConfig.title}`}
        level={levelConfig.level}
        zonePath="/dashboard/seniors"
      />
    </>
  );
};

/**
 * Main Controller Component
 */
export const GoldenZip = ({ initialLevel = 1 }) => {
  const { unlockedLevel, unlockNextLevel: triggerUnlockNext, isLevelUnlocked } = useGameProgression('golden-zip');
  const [levelNum, setLevelNum] = useState(
    () => Math.min(Math.max(initialLevel, 1), Math.min(unlockedLevel, GOLDENZIP_LEVELS.length))
  );
  const [soundMuted, setSoundMuted] = useState(false);

  // Keep level clamped if unlockedLevel changes
  useEffect(() => {
    if (levelNum > unlockedLevel) {
      setLevelNum(unlockedLevel);
    }
  }, [unlockedLevel, levelNum]);

  const levelConfig = useMemo(
    () => GOLDENZIP_LEVELS[levelNum - 1] || GOLDENZIP_LEVELS[0],
    [levelNum]
  );

  const handleNextLevel = () => {
    if (levelNum < GOLDENZIP_LEVELS.length) {
      triggerUnlockNext(levelNum);
      setLevelNum((l) => l + 1);
    }
  };

  const handleSelectLevel = (lvl) => {
    if (!isLevelUnlocked(lvl)) return;
    setLevelNum(lvl);
  };

  const handleToggleSound = () => {
    const nextMuted = !soundMuted;
    setSoundMuted(nextMuted);
    goldenZipAudio.setMuted(nextMuted);
  };

  return (
    <div className={styles.arenaContainer}>
      <GoldenZipArena
        key={`golden-zip-level-${levelNum}`}
        levelConfig={levelConfig}
        onSelectLevel={handleSelectLevel}
        onLevelComplete={handleNextLevel}
        soundMuted={soundMuted}
        onToggleSound={handleToggleSound}
        unlockedLevel={unlockedLevel}
      />
    </div>
  );
};

export default GoldenZip;
