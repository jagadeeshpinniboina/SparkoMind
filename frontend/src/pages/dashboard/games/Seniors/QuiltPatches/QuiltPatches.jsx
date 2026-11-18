import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGameProgression, unlockNextLevel } from '../../../../../utils/gameProgression.js';
import GamePauseOverlay from '../../../../../components/GamePauseOverlay';
import styles from './QuiltPatches.module.css';
import quiltPatchesAudio from './QuiltPatchesAudio';

/**
 * 5 Mathematically Verified Levels
 * 100% full coverage, zero overlap, exact clue matching.
 */
export const QUILTPATCHES_LEVELS = [
  {
    level: 1,
    title: 'Starter Quilt',
    rows: 4,
    cols: 4,
    cssGridClass: styles.grid4x4,
    clues: [
      { r: 0, c: 0, val: 6 },
      { r: 0, c: 3, val: 2 },
      { r: 2, c: 0, val: 4 },
      { r: 2, c: 2, val: 4 }
    ],
    solutionPatches: [
      { id: 'sol-1-0', r1: 0, c1: 0, r2: 1, c2: 2, val: 6, colorClass: styles.colorEmerald },
      { id: 'sol-1-1', r1: 0, c1: 3, r2: 1, c2: 3, val: 2, colorClass: styles.colorAmber },
      { id: 'sol-1-2', r1: 2, c1: 0, r2: 3, c2: 1, val: 4, colorClass: styles.colorPlum },
      { id: 'sol-1-3', r1: 2, c1: 2, r2: 3, c2: 3, val: 4, colorClass: styles.colorRose }
    ]
  },
  {
    level: 2,
    title: 'Cozy Blanket',
    rows: 4,
    cols: 5,
    cssGridClass: styles.grid4x5,
    clues: [
      { r: 0, c: 0, val: 4 },
      { r: 0, c: 2, val: 3 },
      { r: 1, c: 2, val: 6 },
      { r: 2, c: 0, val: 4 },
      { r: 3, c: 2, val: 3 }
    ],
    solutionPatches: [
      { id: 'sol-2-0', r1: 0, c1: 0, r2: 1, c2: 1, val: 4, colorClass: styles.colorEmerald },
      { id: 'sol-2-1', r1: 0, c1: 2, r2: 0, c2: 4, val: 3, colorClass: styles.colorAmber },
      { id: 'sol-2-2', r1: 1, c1: 2, r2: 2, c2: 4, val: 6, colorClass: styles.colorPlum },
      { id: 'sol-2-3', r1: 2, c1: 0, r2: 3, c2: 1, val: 4, colorClass: styles.colorRose },
      { id: 'sol-2-4', r1: 3, c1: 2, r2: 3, c2: 4, val: 3, colorClass: styles.colorTeal }
    ]
  },
  {
    level: 3,
    title: 'Heritage Tapestry',
    rows: 5,
    cols: 5,
    cssGridClass: styles.grid5x5,
    clues: [
      { r: 0, c: 0, val: 6 },
      { r: 0, c: 3, val: 4 },
      { r: 2, c: 0, val: 2 },
      { r: 3, c: 0, val: 4 },
      { r: 2, c: 2, val: 3 },
      { r: 2, c: 3, val: 6 }
    ],
    solutionPatches: [
      { id: 'sol-3-0', r1: 0, c1: 0, r2: 1, c2: 2, val: 6, colorClass: styles.colorEmerald },
      { id: 'sol-3-1', r1: 0, c1: 3, r2: 1, c2: 4, val: 4, colorClass: styles.colorAmber },
      { id: 'sol-3-2', r1: 2, c1: 0, r2: 2, c2: 1, val: 2, colorClass: styles.colorPlum },
      { id: 'sol-3-3', r1: 3, c1: 0, r2: 4, c2: 1, val: 4, colorClass: styles.colorRose },
      { id: 'sol-3-4', r1: 2, c1: 2, r2: 4, c2: 2, val: 3, colorClass: styles.colorTeal },
      { id: 'sol-3-5', r1: 2, c1: 3, r2: 4, c2: 4, val: 6, colorClass: styles.colorSky }
    ]
  },
  {
    level: 4,
    title: 'Golden Loom',
    rows: 5,
    cols: 6,
    cssGridClass: styles.grid5x6,
    clues: [
      { r: 0, c: 0, val: 6 },
      { r: 0, c: 3, val: 3 },
      { r: 1, c: 3, val: 6 },
      { r: 2, c: 0, val: 4 },
      { r: 2, c: 2, val: 2 },
      { r: 4, c: 4, val: 6 },
      { r: 4, c: 0, val: 3 }
    ],
    solutionPatches: [
      { id: 'sol-4-0', r1: 0, c1: 0, r2: 1, c2: 2, val: 6, colorClass: styles.colorEmerald },
      { id: 'sol-4-1', r1: 0, c1: 3, r2: 0, c2: 5, val: 3, colorClass: styles.colorAmber },
      { id: 'sol-4-2', r1: 1, c1: 3, r2: 2, c2: 5, val: 6, colorClass: styles.colorPlum },
      { id: 'sol-4-3', r1: 2, c1: 0, r2: 3, c2: 1, val: 4, colorClass: styles.colorRose },
      { id: 'sol-4-4', r1: 2, c1: 2, r2: 3, c2: 2, val: 2, colorClass: styles.colorTeal },
      { id: 'sol-4-5', r1: 3, c1: 3, r2: 4, c2: 5, val: 6, colorClass: styles.colorSky },
      { id: 'sol-4-6', r1: 4, c1: 0, r2: 4, c2: 2, val: 3, colorClass: styles.colorGold }
    ]
  },
  {
    level: 5,
    title: 'Royal Mandala Quilt',
    rows: 6,
    cols: 6,
    cssGridClass: styles.grid6x6,
    clues: [
      { r: 0, c: 0, val: 4 },
      { r: 0, c: 2, val: 6 },
      { r: 0, c: 5, val: 3 },
      { r: 2, c: 0, val: 6 },
      { r: 2, c: 3, val: 4 },
      { r: 4, c: 5, val: 3 },
      { r: 4, c: 0, val: 6 },
      { r: 4, c: 3, val: 4 }
    ],
    solutionPatches: [
      { id: 'sol-5-0', r1: 0, c1: 0, r2: 1, c2: 1, val: 4, colorClass: styles.colorEmerald },
      { id: 'sol-5-1', r1: 0, c1: 2, r2: 1, c2: 4, val: 6, colorClass: styles.colorAmber },
      { id: 'sol-5-2', r1: 0, c1: 5, r2: 2, c2: 5, val: 3, colorClass: styles.colorPlum },
      { id: 'sol-5-3', r1: 2, c1: 0, r2: 3, c2: 2, val: 6, colorClass: styles.colorRose },
      { id: 'sol-5-4', r1: 2, c1: 3, r2: 3, c2: 4, val: 4, colorClass: styles.colorTeal },
      { id: 'sol-5-5', r1: 3, c1: 5, r2: 5, c2: 5, val: 3, colorClass: styles.colorSky },
      { id: 'sol-5-6', r1: 4, c1: 0, r2: 5, c2: 2, val: 6, colorClass: styles.colorGold },
      { id: 'sol-5-7', r1: 4, c1: 3, r2: 5, c2: 4, val: 4, colorClass: styles.colorCoral }
    ]
  }
];

const COLOR_CLASSES = [
  styles.colorEmerald,
  styles.colorAmber,
  styles.colorPlum,
  styles.colorRose,
  styles.colorTeal,
  styles.colorSky,
  styles.colorGold,
  styles.colorCoral
];

export const QuiltPatchesArena = ({ initialLevel = 1, onBack }) => {
  const navigate = useNavigate();
  const { unlockedLevel, unlockNextLevel: triggerUnlockNext, isLevelUnlocked } = useGameProgression('quilt-patches');
  const safeInitial = Math.max(1, Math.min(Number(initialLevel) || 1, 5));
  const [levelNumber, setLevelNumber] = useState(Math.min(safeInitial, unlockedLevel));
  const [phase, setPhase] = useState('BRIEFING'); // 'BRIEFING' | 'PLAYING' | 'VICTORY'
  const [placedPatches, setPlacedPatches] = useState([]);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [hintPulsePatchId, setHintPulsePatchId] = useState(null);
  const [isBoardShaking, setIsBoardShaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
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

  // Keep level clamped if unlockedLevel changes
  useEffect(() => {
    if (levelNumber > unlockedLevel) {
      setLevelNumber(unlockedLevel);
    }
  }, [unlockedLevel, levelNumber]);

  // Active drag state: { r, c }
  const [dragAnchor, setDragAnchor] = useState(null);
  const [dragCurrent, setDragCurrent] = useState(null);
  const isDraggingRef = useRef(false);

  // Current level configuration
  const currentLevelConfig = useMemo(() => {
    return QUILTPATCHES_LEVELS.find((l) => l.level === levelNumber) || QUILTPATCHES_LEVELS[0];
  }, [levelNumber]);

  // Sync mute setting
  useEffect(() => {
    quiltPatchesAudio.setMuted(isMuted);
  }, [isMuted]);

  // Reset or load level
  const loadLevel = useCallback((lvlNum) => {
    if (!isLevelUnlocked(lvlNum)) return;
    setLevelNumber(lvlNum);
    setPlacedPatches([]);
    setHintsRemaining(3);
    setHintPulsePatchId(null);
    setDragAnchor(null);
    setDragCurrent(null);
    isDraggingRef.current = false;
    setPhase('BRIEFING');
  }, [isLevelUnlocked]);

  // Quick lookup map for clues: 'r,c' => val
  const clueMap = useMemo(() => {
    const map = new Map();
    currentLevelConfig.clues.forEach((clue) => {
      map.set(`${clue.r},${clue.c}`, clue.val);
    });
    return map;
  }, [currentLevelConfig]);

  // Map for cells covered by placed patches: 'r,c' => patch
  const cellToPatchMap = useMemo(() => {
    const map = new Map();
    placedPatches.forEach((patch) => {
      for (let r = patch.r1; r <= patch.r2; r++) {
        for (let c = patch.c1; c <= patch.c2; c++) {
          map.set(`${r},${c}`, patch);
        }
      }
    });
    return map;
  }, [placedPatches]);

  // Current drag rectangle bounds
  const dragRect = useMemo(() => {
    if (!dragAnchor || !dragCurrent) return null;
    const minR = Math.min(dragAnchor.r, dragCurrent.r);
    const maxR = Math.max(dragAnchor.r, dragCurrent.r);
    const minC = Math.min(dragAnchor.c, dragCurrent.c);
    const maxC = Math.max(dragAnchor.c, dragCurrent.c);
    const height = maxR - minR + 1;
    const width = maxC - minC + 1;
    const area = height * width;
    return { minR, maxR, minC, maxC, height, width, area };
  }, [dragAnchor, dragCurrent]);

  // Total cells covered
  const coveredCellsCount = useMemo(() => {
    return cellToPatchMap.size;
  }, [cellToPatchMap]);

  const totalCells = currentLevelConfig.rows * currentLevelConfig.cols;

  // Check victory condition
  useEffect(() => {
    if (phase !== 'PLAYING') return;

    if (coveredCellsCount === totalCells) {
      // Check that every clue is satisfied exactly once
      let allSatisfied = true;
      for (const clue of currentLevelConfig.clues) {
        const p = cellToPatchMap.get(`${clue.r},${clue.c}`);
        if (!p || p.val !== clue.val) {
          allSatisfied = false;
          break;
        }
      }

      if (allSatisfied) {
        triggerUnlockNext(levelNumber);
        const timer = setTimeout(() => {
          setPhase('VICTORY');
          quiltPatchesAudio.playVictory();
        }, 350);
        return () => clearTimeout(timer);
      }
    }
  }, [coveredCellsCount, totalCells, currentLevelConfig, cellToPatchMap, phase]);

  // Remove a patch
  const removePatch = useCallback((patchId) => {
    setPlacedPatches((prev) => prev.filter((p) => p.id !== patchId));
    quiltPatchesAudio.playUnstitch();
  }, []);

  // Board shake trigger for invalid drag
  const triggerInvalidFeedback = useCallback(() => {
    quiltPatchesAudio.playInvalid();
    setIsBoardShaking(true);
    setTimeout(() => {
      setIsBoardShaking(false);
    }, 380);
  }, []);

  // Validate and commit dragged rectangle
  const commitDragSelection = useCallback(() => {
    if (!dragRect) {
      setDragAnchor(null);
      setDragCurrent(null);
      isDraggingRef.current = false;
      return;
    }

    const { minR, maxR, minC, maxC, area } = dragRect;

    // 1. Check overlap with any already placed patch
    let hasOverlap = false;
    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        if (cellToPatchMap.has(`${r},${c}`)) {
          hasOverlap = true;
          break;
        }
      }
      if (hasOverlap) break;
    }

    if (hasOverlap) {
      triggerInvalidFeedback();
      setDragAnchor(null);
      setDragCurrent(null);
      isDraggingRef.current = false;
      return;
    }

    // 2. Count and check clues inside the rectangle
    const cluesInside = [];
    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        const key = `${r},${c}`;
        if (clueMap.has(key)) {
          cluesInside.push({ r, c, val: clueMap.get(key) });
        }
      }
    }

    // Must enclose exactly 1 clue, and clue.val must equal area
    if (cluesInside.length !== 1 || cluesInside[0].val !== area) {
      triggerInvalidFeedback();
      setDragAnchor(null);
      setDragCurrent(null);
      isDraggingRef.current = false;
      return;
    }

    // Valid patch!
    const clue = cluesInside[0];
    const newPatchColor = COLOR_CLASSES[placedPatches.length % COLOR_CLASSES.length];
    const newPatch = {
      id: `user-patch-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      r1: minR,
      c1: minC,
      r2: maxR,
      c2: maxC,
      val: area,
      clueR: clue.r,
      clueC: clue.c,
      colorClass: newPatchColor
    };

    setPlacedPatches((prev) => [...prev, newPatch]);
    quiltPatchesAudio.playPatchLock();

    setDragAnchor(null);
    setDragCurrent(null);
    isDraggingRef.current = false;
  }, [dragRect, cellToPatchMap, clueMap, placedPatches.length, triggerInvalidFeedback]);

  // Pointer event handlers
  const handleCellPointerDown = (r, c, e) => {
    e.preventDefault();
    if (phase !== 'PLAYING' || isPaused) return;

    // If cell already has a placed patch, clicking it unstiches/removes it!
    const existingPatch = cellToPatchMap.get(`${r},${c}`);
    if (existingPatch) {
      removePatch(existingPatch.id);
      return;
    }

    // Begin drag selection
    isDraggingRef.current = true;
    setDragAnchor({ r, c });
    setDragCurrent({ r, c });
  };

  const handleCellPointerEnter = (r, c) => {
    if (!isDraggingRef.current || !dragAnchor) return;
    setDragCurrent({ r, c });
  };

  // Window-level pointerup to ensure drag release is never swallowed
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (isDraggingRef.current) {
        commitDragSelection();
      }
    };

    window.addEventListener('pointerup', handleGlobalPointerUp);
    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp);
    };
  }, [commitDragSelection]);

  // Hint button: finds first unplaced solution patch
  const handleUseHint = () => {
    if (hintsRemaining <= 0 || phase !== 'PLAYING') return;

    // Find solution patches that are not yet placed identically
    const targetSolutionPatch = currentLevelConfig.solutionPatches.find((sol) => {
      return !placedPatches.some(
        (p) =>
          p.r1 === sol.r1 &&
          p.c1 === sol.c1 &&
          p.r2 === sol.r2 &&
          p.c2 === sol.c2
      );
    });

    if (!targetSolutionPatch) return;

    // Remove any user patches that conflict with this solution patch
    const conflictingIds = new Set();
    for (let r = targetSolutionPatch.r1; r <= targetSolutionPatch.r2; r++) {
      for (let c = targetSolutionPatch.c1; c <= targetSolutionPatch.c2; c++) {
        const existing = cellToPatchMap.get(`${r},${c}`);
        if (existing) {
          conflictingIds.add(existing.id);
        }
      }
    }

    const hintPatchId = `hint-patch-${Date.now()}`;
    const newPatch = {
      id: hintPatchId,
      r1: targetSolutionPatch.r1,
      c1: targetSolutionPatch.c1,
      r2: targetSolutionPatch.r2,
      c2: targetSolutionPatch.c2,
      val: targetSolutionPatch.val,
      colorClass: targetSolutionPatch.colorClass
    };

    setPlacedPatches((prev) => [
      ...prev.filter((p) => !conflictingIds.has(p.id)),
      newPatch
    ]);

    setHintsRemaining((prev) => Math.max(0, prev - 1));
    setHintPulsePatchId(hintPatchId);
    quiltPatchesAudio.playHint();

    setTimeout(() => {
      setHintPulsePatchId(null);
    }, 2200);
  };

  // Reset entire board
  const handleResetBoard = () => {
    if (placedPatches.length === 0) return;
    setPlacedPatches([]);
    quiltPatchesAudio.playReset();
  };

  return (
    <div className={styles.arenaContainer}>
      {/* ----------------------------------------------------------------------
          COMPACT SINGLE-ROW TOP HUD
          ---------------------------------------------------------------------- */}
      <header className={styles.compactHeader}>
        <div className={styles.headerLeft}>
          {onBack ? (
            <button
              onClick={onBack}
              className={styles.seniorsExitBtn}
              title="Return to Seniors Sanctuary"
            >
              ← 🌿 Seniors Sanctuary
            </button>
          ) : (
            <Link
              to="/dashboard/seniors"
              className={styles.seniorsExitBtn}
              title="Return to Seniors Sanctuary"
            >
              ← 🌿 Seniors Sanctuary
            </Link>
          )}

          {/* Level Switcher Pills */}
          <div className={styles.levelTabs}>
            {QUILTPATCHES_LEVELS.map((lvl) => {
              const isLocked = lvl.level > unlockedLevel;
              return (
                <button
                  key={lvl.level}
                  onClick={() => !isLocked && loadLevel(lvl.level)}
                  disabled={isLocked}
                  className={`${styles.tabBtn} ${
                    levelNumber === lvl.level ? styles.tabBtnActive : ''
                  } ${isLocked ? styles.tabBtnLocked : ''}`}
                  title={isLocked ? `Complete Level ${lvl.level - 1} to unlock` : `Level ${lvl.level}: ${lvl.title}`}
                >
                  <span>L{lvl.level}</span>
                  {isLocked && <span className={styles.lockBadge}>🔒</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Level Title & Grid Dimensions */}
        <div className={styles.headerCenter}>
          <h1 className={styles.levelTitleText}>
            🧵 {currentLevelConfig.title}
          </h1>
          <span className={styles.levelBadge}>
            {currentLevelConfig.rows}×{currentLevelConfig.cols} Quilt
          </span>
        </div>

        {/* Status Metrics & Action Controls */}
        <div className={styles.headerRight}>
          <div className={styles.metricsGroup}>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Patches:</span>
              <span className={styles.metricValEmerald}>
                {placedPatches.length} / {currentLevelConfig.solutionPatches.length}
              </span>
            </div>
            <div className={styles.metricDivider} />
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Covered:</span>
              <span className={styles.metricValGold}>
                {coveredCellsCount} / {totalCells}
              </span>
            </div>
          </div>

          <div className={styles.actionBtns}>
            {/* Pause Game */}
            <button
              onClick={() => setIsPaused(true)}
              className={styles.toolBtn}
              title="Pause Game (Esc or P)"
            >
              ⏸ Pause
            </button>

            {/* Glowing Bulb Hint */}
            <button
              onClick={handleUseHint}
              disabled={hintsRemaining <= 0 || phase !== 'PLAYING'}
              className={styles.hintBtn}
              title="Reveal one verified quilt patch"
            >
              💡 Hint ({hintsRemaining})
            </button>

            {/* Reset */}
            <button
              onClick={handleResetBoard}
              disabled={placedPatches.length === 0 || phase !== 'PLAYING'}
              className={styles.toolBtn}
              title="Clear all stitched patches"
            >
              ↺ Reset
            </button>

            {/* Info / Briefing */}
            <button
              onClick={() => setPhase('BRIEFING')}
              className={styles.iconBtn}
              title="View Mission Instructions"
            >
              ℹ
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={styles.iconBtn}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>
      </header>

      {/* ----------------------------------------------------------------------
          STAGE WRAPPER & RECESSED OBSIDIAN-SAGE QUILT TRAY
          ---------------------------------------------------------------------- */}
      <main className={styles.stageWrapper}>
        <div
          className={`${styles.boardWrapper} ${
            isBoardShaking ? styles.boardShake : ''
          }`}
        >
          <div
            className={`${styles.gridBoard} ${currentLevelConfig.cssGridClass}`}
            onPointerLeave={() => {
              // Keep drag active, window listener handles pointerup
            }}
          >
            {Array.from({ length: currentLevelConfig.rows }).map((_, r) =>
              Array.from({ length: currentLevelConfig.cols }).map((_, c) => {
                const cellKey = `${r},${c}`;
                const clueVal = clueMap.get(cellKey);
                const patched = cellToPatchMap.get(cellKey);

                // Dragging highlight calculations
                let isDragSelected = false;
                let isDragBorderTop = false;
                let isDragBorderBottom = false;
                let isDragBorderLeft = false;
                let isDragBorderRight = false;

                if (dragRect) {
                  if (
                    r >= dragRect.minR &&
                    r <= dragRect.maxR &&
                    c >= dragRect.minC &&
                    c <= dragRect.maxC
                  ) {
                    isDragSelected = true;
                    if (r === dragRect.minR) isDragBorderTop = true;
                    if (r === dragRect.maxR) isDragBorderBottom = true;
                    if (c === dragRect.minC) isDragBorderLeft = true;
                    if (c === dragRect.maxC) isDragBorderRight = true;
                  }
                }

                // Stitched patch borders along perimeter of rectangle
                let isStitchTop = false;
                let isStitchBottom = false;
                let isStitchLeft = false;
                let isStitchRight = false;
                let patchColorClass = '';
                let isHintPulse = false;

                if (patched) {
                  isStitchTop = r === patched.r1;
                  isStitchBottom = r === patched.r2;
                  isStitchLeft = c === patched.c1;
                  isStitchRight = c === patched.c2;
                  patchColorClass = patched.colorClass;
                  if (hintPulsePatchId && patched.id === hintPulsePatchId) {
                    isHintPulse = true;
                  }
                }

                // Determine if this cell should anchor the floating size pill
                const showFloatingPill =
                  isDragSelected &&
                  r === dragRect.minR &&
                  c === Math.floor((dragRect.minC + dragRect.maxC) / 2);

                return (
                  <div
                    key={cellKey}
                    onPointerDown={(e) => handleCellPointerDown(r, c, e)}
                    onPointerEnter={() => handleCellPointerEnter(r, c)}
                    className={`
                      ${styles.cell}
                      ${patched ? styles.cellPatched : ''}
                      ${patchColorClass}
                      ${isStitchTop ? styles.stitchTop : ''}
                      ${isStitchBottom ? styles.stitchBottom : ''}
                      ${isStitchLeft ? styles.stitchLeft : ''}
                      ${isStitchRight ? styles.stitchRight : ''}
                      ${isDragSelected ? styles.cellSelectedDrag : ''}
                      ${isDragBorderTop ? styles.dragTop : ''}
                      ${isDragBorderBottom ? styles.dragBottom : ''}
                      ${isDragBorderLeft ? styles.dragLeft : ''}
                      ${isDragBorderRight ? styles.dragRight : ''}
                      ${isHintPulse ? styles.patchHintPulse : ''}
                    `}
                    title={
                      patched
                        ? 'Tap to unstitch this patch'
                        : clueVal
                        ? `Clue: ${clueVal} tiles`
                        : ''
                    }
                  >
                    {/* Live Floating Size Indicator Pill */}
                    {showFloatingPill && (
                      <div className={styles.floatingSizePill}>
                        {dragRect.height} × {dragRect.width} = {dragRect.area}
                      </div>
                    )}

                    {/* Numerical Clue Medallion */}
                    {clueVal !== undefined ? (
                      <div
                        className={`${styles.clueBadge} ${
                          patched ? styles.clueBadgeLocked : ''
                        }`}
                      >
                        {clueVal}
                      </div>
                    ) : (
                      !patched && <div className={styles.emptyPip} />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* ----------------------------------------------------------------------
          PRE-LEVEL WELCOME MISSION BRIEFING MODAL
          ---------------------------------------------------------------------- */}
      {phase === 'BRIEFING' && (
        <div className={styles.briefingOverlay}>
          <div className={styles.briefingCard}>
            <div className={styles.briefingHeader}>
              <span className={styles.missionBadge}>
                Seniors Sanctuary • Spatial Partitioning
              </span>
              <h2 className={styles.briefingTitle}>
                🧵 {currentLevelConfig.title}
              </h2>
            </div>

            <p className={styles.briefingGoal}>
              Drag across the grid to stitch rectangular fabric patches. Every patch
              must enclose <strong>exactly one numbered tile</strong> matching its size.
            </p>

            {/* Visual Mini-Diagram */}
            <div className={styles.diagramBox}>
              <div className={styles.diagramFlow}>
                <div className={styles.miniClueTile}>
                  <div className={styles.miniClueNumber}>4</div>
                </div>
                <span className={styles.diagramArrow}>➔</span>
                <div className={styles.miniPatch2x2}>
                  <div className={styles.miniPatchCell} />
                  <div className={styles.miniPatchCell} />
                  <div className={styles.miniPatchCell} />
                  <div className={styles.miniPatchCell} />
                  <div className={styles.miniPatchBadge}>2×2 = 4</div>
                </div>
              </div>
              <span className={styles.diagramCaption}>
                A tile with number <strong>4</strong> becomes a <strong>2×2</strong> (or <strong>1×4</strong>) stitched patch.
              </span>
            </div>

            <p className={styles.reassuranceText}>
              <span>🌿</span> No timer • No pressure • Tap any stitched patch to undo
            </p>

            <button
              onClick={() => {
                setPhase('PLAYING');
                quiltPatchesAudio.playBriefingStart();
              }}
              className={styles.startButton}
            >
              Begin Stitching 🧵
            </button>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------
          PEACEFUL VICTORY MODAL
          ---------------------------------------------------------------------- */}
      {phase === 'VICTORY' && (
        <div className={styles.modalOverlay}>
          <div className={styles.victoryCard}>
            <span className={styles.victoryIcon}>✨🧵✨</span>
            <h2 className={styles.victoryTitle}>Quilt Masterpiece Complete!</h2>
            <p className={styles.victorySubtitle}>
              Every fabric patch was sewn with precision and patience. Your mind has
              woven a stunning heirloom pattern!
            </p>

            <div className={styles.vitalityPill}>
              <span>🌿 +100 Seniors Vitality Points</span>
            </div>

            <div className={styles.victoryStats}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Patches Stitched</span>
                <span className={styles.statValue}>
                  {placedPatches.length} / {currentLevelConfig.solutionPatches.length}
                </span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Board Coverage</span>
                <span className={styles.statValue}>100% Full</span>
              </div>
            </div>

            <div className={styles.victoryActions}>
              <button
                onClick={() => loadLevel(levelNumber)}
                className={styles.secondaryBtn}
              >
                ↺ Replay Level
              </button>

              {levelNumber < 5 ? (
                <button
                  onClick={() => {
                    triggerUnlockNext(levelNumber);
                    loadLevel(levelNumber + 1);
                  }}
                  className={styles.primaryVictoryBtn}
                >
                  Next Quilt Level ({levelNumber + 1}) →
                </button>
              ) : (
                <button
                  onClick={() => loadLevel(1)}
                  className={styles.primaryVictoryBtn}
                >
                  Replay from Level 1 🌟
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
        onRestart={handleResetBoard}
        onExit={() => navigate('/dashboard/seniors')}
        gameTitle={`Quilt Patches: ${currentLevelConfig.title}`}
        level={levelNumber}
        zonePath="/dashboard/seniors"
      />
    </div>
  );
};

export default QuiltPatchesArena;
