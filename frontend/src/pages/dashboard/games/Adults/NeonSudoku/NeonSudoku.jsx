import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGameProgression, unlockNextLevel } from '../../../../../utils/gameProgression.js';
import GamePauseOverlay from '../../../../../components/GamePauseOverlay';
import styles from './NeonSudoku.module.css';
import sudokuAudio from './NeonSudokuAudio.js';

// ---------------------------------------------------------------------------
// 5 PROGRESSIVE HAND-CRAFTED & MATHEMATICALLY VERIFIED SUDOKU PUZZLES
// Levels 1–3: 4×4 Grid (2×2 Sub-boxes) | Levels 4–5: 9×9 Grid (3×3 Sub-boxes)
// ---------------------------------------------------------------------------
export const SUDOKU_LEVELS = [
  {
    level: 1,
    title: 'Warmup Matrix',
    subtitle: '4×4 Mini-Grid • 2×2 Sub-boxes',
    size: 4,
    boxRows: 2,
    boxCols: 2,
    digits: [1, 2, 3, 4],
    initialGrid: [
      [0, 2, 3, 0],
      [0, 4, 1, 0],
      [2, 1, 0, 3],
      [4, 3, 0, 1]
    ],
    solutionGrid: [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, 1]
    ],
    givenClues: 10,
    emptyCells: 6
  },
  {
    level: 2,
    title: 'Speed Matrix',
    subtitle: '4×4 Speed Sprint • 2×2 Sub-boxes',
    size: 4,
    boxRows: 2,
    boxCols: 2,
    digits: [1, 2, 3, 4],
    initialGrid: [
      [0, 2, 3, 0],
      [0, 4, 1, 0],
      [0, 1, 0, 0],
      [4, 3, 0, 1]
    ],
    solutionGrid: [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, 1]
    ],
    givenClues: 8,
    emptyCells: 8
  },
  {
    level: 3,
    title: 'Expert Quadrant',
    subtitle: '4×4 Deep Deduction • 2×2 Sub-boxes',
    size: 4,
    boxRows: 2,
    boxCols: 2,
    digits: [1, 2, 3, 4],
    initialGrid: [
      [0, 0, 3, 0],
      [0, 4, 1, 0],
      [0, 1, 0, 0],
      [4, 3, 0, 0]
    ],
    solutionGrid: [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, 1]
    ],
    givenClues: 6,
    emptyCells: 10
  },
  {
    level: 4,
    title: 'Classic Arena',
    subtitle: 'Full 9×9 Sudoku • 3×3 Sub-boxes',
    size: 9,
    boxRows: 3,
    boxCols: 3,
    digits: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    initialGrid: [
      [0, 0, 4, 6, 7, 8, 9, 0, 0],
      [0, 0, 2, 1, 9, 5, 3, 0, 0],
      [0, 0, 8, 3, 4, 2, 5, 0, 0],
      [0, 0, 9, 7, 6, 1, 4, 0, 0],
      [0, 0, 6, 8, 5, 3, 7, 0, 0],
      [0, 1, 3, 9, 2, 4, 8, 0, 0],
      [0, 0, 1, 5, 3, 7, 0, 0, 4],
      [0, 0, 7, 4, 1, 9, 0, 0, 0],
      [0, 4, 5, 2, 8, 6, 0, 0, 9]
    ],
    solutionGrid: [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ],
    givenClues: 46,
    emptyCells: 35
  },
  {
    level: 5,
    title: 'Grandmaster Matrix',
    subtitle: 'Full 9×9 Master Matrix • 3×3 Sub-boxes',
    size: 9,
    boxRows: 3,
    boxCols: 3,
    digits: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    initialGrid: [
      [0, 0, 0, 0, 7, 8, 9, 0, 0],
      [0, 0, 0, 1, 9, 5, 3, 0, 0],
      [0, 0, 0, 3, 4, 2, 5, 0, 0],
      [0, 0, 9, 0, 6, 1, 4, 0, 0],
      [0, 0, 6, 0, 5, 3, 7, 0, 0],
      [0, 1, 0, 0, 2, 4, 8, 0, 0],
      [0, 0, 1, 0, 3, 7, 0, 0, 4],
      [0, 0, 7, 0, 1, 9, 0, 0, 0],
      [0, 4, 5, 2, 8, 6, 0, 0, 9]
    ],
    solutionGrid: [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ],
    givenClues: 36,
    emptyCells: 45
  }
];

/**
 * Inner Arena Component keyed by levelNum to guarantee atomic state synchronization
 * when switching between grid sizes (4×4 and 9×9).
 */
const NeonSudokuArena = ({
  levelConfig,
  onLevelComplete,
  soundMuted,
  onToggleSound
}) => {
  const navigate = useNavigate();

  // Phases: 'BRIEFING' | 'PLAYING' | 'VICTORY'
  const [phase, setPhase] = useState('BRIEFING');

  // Board state: safely initialized to current level's exact size
  const [grid, setGrid] = useState(() =>
    levelConfig.initialGrid.map(row => [...row])
  );

  // Selected cell: { r: 0, c: 0 }, defaulted to first empty cell
  const [selectedCell, setSelectedCell] = useState(() => {
    for (let r = 0; r < levelConfig.size; r++) {
      for (let c = 0; c < levelConfig.size; c++) {
        if (levelConfig.initialGrid?.[r]?.[c] === 0) {
          return { r, c };
        }
      }
    }
    return { r: 0, c: 0 };
  });

  // Conflicts Set: "r-c"
  const [conflicts, setConflicts] = useState(new Set());

  // Same-number spotlight: soft Electric Cyan highlight across all matching digits
  const [spotlightDigit, setSpotlightDigit] = useState(() => {
    return levelConfig.initialGrid?.[0]?.[1] || 1;
  });

  // Real-Time Glowing Bulb Hint: 3 hint charges per level
  const [hintsRemaining, setHintsRemaining] = useState(3);

  // Cells revealed by Hint: Set of "r-c" rendered in golden-amber
  const [hintedCells, setHintedCells] = useState(new Set());

  // Target cell currently pulsing amber spotlight ring: "r-c"
  const [hintPulseCell, setHintPulseCell] = useState(null);

  // Cells currently animated with 600ms completion glow: Set of "r-c"
  const [completionGlowCells, setCompletionGlowCells] = useState(new Set());

  // Track completed lines to only glow on new completion
  const completedRowsRef = useRef(new Set());
  const completedColsRef = useRef(new Set());
  const completedBoxesRef = useRef(new Set());

  // Timers refs
  const glowTimerRef = useRef(null);
  const pulseTimerRef = useRef(null);

  // Statistics
  const [elapsedTime, setElapsedTime] = useState(0);
  const [mistakesCount, setMistakesCount] = useState(0);
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

  const boardRef = useRef(null);

  // Initialize line completion tracking
  useEffect(() => {
    completedRowsRef.current = new Set();
    completedColsRef.current = new Set();
    completedBoxesRef.current = new Set();

    return () => {
      if (glowTimerRef.current) clearTimeout(glowTimerRef.current);
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    };
  }, []);

  // Safe helper: check if cell is locked initial clue
  const isGivenCell = useCallback(
    (r, c) => (levelConfig.initialGrid?.[r]?.[c] ?? 0) !== 0,
    [levelConfig]
  );

  // Elapsed time counter during PLAYING phase
  useEffect(() => {
    if (phase !== 'PLAYING' || isPaused) return;
    const interval = setInterval(() => {
      setElapsedTime(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, isPaused]);

  // Recalculate all row, column, and sub-box conflicts safely
  const recalculateConflicts = useCallback((currentGrid) => {
    const size = levelConfig.size;
    const bRows = levelConfig.boxRows;
    const bCols = levelConfig.boxCols;
    const newConflicts = new Set();

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const val = currentGrid?.[r]?.[c] ?? 0;
        if (val === 0) continue;

        // Check row
        for (let c2 = 0; c2 < size; c2++) {
          if (c2 !== c && (currentGrid?.[r]?.[c2] ?? 0) === val) {
            newConflicts.add(`${r}-${c}`);
            newConflicts.add(`${r}-${c2}`);
          }
        }

        // Check col
        for (let r2 = 0; r2 < size; r2++) {
          if (r2 !== r && (currentGrid?.[r2]?.[c] ?? 0) === val) {
            newConflicts.add(`${r}-${c}`);
            newConflicts.add(`${r2}-${c}`);
          }
        }

        // Check sub-box
        const bStartR = Math.floor(r / bRows) * bRows;
        const bStartC = Math.floor(c / bCols) * bCols;
        for (let br = 0; br < bRows; br++) {
          for (let bc = 0; bc < bCols; bc++) {
            const checkR = bStartR + br;
            const checkC = bStartC + bc;
            if (
              (checkR !== r || checkC !== c) &&
              (currentGrid?.[checkR]?.[checkC] ?? 0) === val
            ) {
              newConflicts.add(`${r}-${c}`);
              newConflicts.add(`${checkR}-${checkC}`);
            }
          }
        }
      }
    }
    return newConflicts;
  }, [levelConfig]);

  // Check victory condition safely
  const checkVictory = useCallback((currentGrid, currentConflicts) => {
    const size = levelConfig.size;
    if (currentConflicts.size > 0) return false;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if ((currentGrid?.[r]?.[c] ?? 0) === 0) return false;
      }
    }
    return true;
  }, [levelConfig]);

  // Check for row, column, or sub-box completions to sweep 600ms Emerald glow
  const checkCompletionGlow = useCallback((currentGrid, currentConflicts) => {
    const size = levelConfig.size;
    const bRows = levelConfig.boxRows;
    const bCols = levelConfig.boxCols;
    const newlyGlowingCells = new Set();

    // 1. Check Rows
    for (let r = 0; r < size; r++) {
      if (completedRowsRef.current.has(r)) continue;
      let full = true;
      for (let c = 0; c < size; c++) {
        if ((currentGrid?.[r]?.[c] ?? 0) === 0 || currentConflicts.has(`${r}-${c}`)) {
          full = false;
          break;
        }
      }
      if (full) {
        completedRowsRef.current.add(r);
        for (let c = 0; c < size; c++) newlyGlowingCells.add(`${r}-${c}`);
      }
    }

    // 2. Check Columns
    for (let c = 0; c < size; c++) {
      if (completedColsRef.current.has(c)) continue;
      let full = true;
      for (let r = 0; r < size; r++) {
        if ((currentGrid?.[r]?.[c] ?? 0) === 0 || currentConflicts.has(`${r}-${c}`)) {
          full = false;
          break;
        }
      }
      if (full) {
        completedColsRef.current.add(c);
        for (let r = 0; r < size; r++) newlyGlowingCells.add(`${r}-${c}`);
      }
    }

    // 3. Check Sub-Boxes
    const boxesPerRow = size / bCols;
    const boxesPerCol = size / bRows;
    const totalBoxes = boxesPerRow * boxesPerCol;

    for (let b = 0; b < totalBoxes; b++) {
      if (completedBoxesRef.current.has(b)) continue;
      const bRowIndex = Math.floor(b / boxesPerRow);
      const bColIndex = b % boxesPerRow;
      const bStartR = bRowIndex * bRows;
      const bStartC = bColIndex * bCols;

      let full = true;
      for (let br = 0; br < bRows; br++) {
        for (let bc = 0; bc < bCols; bc++) {
          const cr = bStartR + br;
          const cc = bStartC + bc;
          if ((currentGrid?.[cr]?.[cc] ?? 0) === 0 || currentConflicts.has(`${cr}-${cc}`)) {
            full = false;
            break;
          }
        }
        if (!full) break;
      }

      if (full) {
        completedBoxesRef.current.add(b);
        for (let br = 0; br < bRows; br++) {
          for (let bc = 0; bc < bCols; bc++) {
            newlyGlowingCells.add(`${bStartR + br}-${bStartC + bc}`);
          }
        }
      }
    }

    if (newlyGlowingCells.size > 0) {
      setCompletionGlowCells(newlyGlowingCells);
      sudokuAudio.playLineClear();

      if (glowTimerRef.current) clearTimeout(glowTimerRef.current);
      glowTimerRef.current = setTimeout(() => {
        setCompletionGlowCells(new Set());
      }, 750);
    }
  }, [levelConfig]);

  // Handle cell click selection and soft same-number spotlight
  const handleCellClick = (r, c) => {
    setSelectedCell({ r, c });
    const cellVal = grid?.[r]?.[c] ?? 0;
    setSpotlightDigit(cellVal > 0 ? cellVal : 0);
    sudokuAudio.playCellSelect();
  };

  // Place digit into selected cell
  const handlePlaceDigit = useCallback((digit) => {
    if (phase !== 'PLAYING') return;
    const { r, c } = selectedCell;

    setSpotlightDigit(digit);

    if (isGivenCell(r, c)) return;
    if (digit < 1 || digit > levelConfig.size) return;

    setGrid(prev => {
      const nextGrid = prev.map(row => [...row]);
      if (!nextGrid[r]) return prev;
      nextGrid[r][c] = digit;

      const newConflicts = recalculateConflicts(nextGrid);
      setConflicts(newConflicts);

      if (newConflicts.has(`${r}-${c}`)) {
        sudokuAudio.playConflictWarning();
        setMistakesCount(m => m + 1);
      } else {
        sudokuAudio.playDigitPlace(digit);
        checkCompletionGlow(nextGrid, newConflicts);
      }

      if (checkVictory(nextGrid, newConflicts)) {
        setTimeout(() => {
          setPhase('VICTORY');
          sudokuAudio.playVictory();
          unlockNextLevel('neon-sudoku', levelConfig.level);
        }, 220);
      }

      return nextGrid;
    });
  }, [phase, selectedCell, isGivenCell, levelConfig, recalculateConflicts, checkCompletionGlow, checkVictory]);

  // Erase digit in currently selected cell
  const handleErase = useCallback(() => {
    if (phase !== 'PLAYING') return;
    const { r, c } = selectedCell;
    if (isGivenCell(r, c)) return;
    if ((grid?.[r]?.[c] ?? 0) === 0) return;

    // Remove from hinted set if erased
    setHintedCells(prev => {
      const next = new Set(prev);
      next.delete(`${r}-${c}`);
      return next;
    });

    completedRowsRef.current.delete(r);
    completedColsRef.current.delete(c);
    const bRows = levelConfig.boxRows;
    const bCols = levelConfig.boxCols;
    const boxesPerRow = levelConfig.size / bCols;
    const boxIndex = Math.floor(r / bRows) * boxesPerRow + Math.floor(c / bCols);
    completedBoxesRef.current.delete(boxIndex);

    setGrid(prev => {
      const nextGrid = prev.map(row => [...row]);
      if (!nextGrid[r]) return prev;
      nextGrid[r][c] = 0;
      const newConflicts = recalculateConflicts(nextGrid);
      setConflicts(newConflicts);
      sudokuAudio.playErase();
      return nextGrid;
    });
  }, [phase, selectedCell, isGivenCell, grid, levelConfig, recalculateConflicts]);

  // Real-Time Glowing Bulb (💡) Hint System
  const handleBulbHint = useCallback(() => {
    if (phase !== 'PLAYING' || hintsRemaining <= 0) return;

    let targetR = -1;
    let targetC = -1;

    // 1. Target Selection: Check if player currently has an empty cell selected
    if (selectedCell && (grid?.[selectedCell.r]?.[selectedCell.c] ?? 0) === 0) {
      targetR = selectedCell.r;
      targetC = selectedCell.c;
    } else {
      // 2. Otherwise pick the best empty cell (prioritizing rows/boxes with fewest empty cells)
      const size = levelConfig.size;
      const bRows = levelConfig.boxRows;
      const bCols = levelConfig.boxCols;
      const emptyCandidates = [];

      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if ((grid?.[r]?.[c] ?? 0) === 0) {
            let rowFilled = 0, colFilled = 0, boxFilled = 0;
            for (let i = 0; i < size; i++) {
              if ((grid?.[r]?.[i] ?? 0) !== 0) rowFilled++;
              if ((grid?.[i]?.[c] ?? 0) !== 0) colFilled++;
            }
            const bStartR = Math.floor(r / bRows) * bRows;
            const bStartC = Math.floor(c / bCols) * bCols;
            for (let br = 0; br < bRows; br++) {
              for (let bc = 0; bc < bCols; bc++) {
                if ((grid?.[bStartR + br]?.[bStartC + bc] ?? 0) !== 0) boxFilled++;
              }
            }
            const score = Math.max(rowFilled, colFilled, boxFilled) * 10 + (rowFilled + colFilled + boxFilled);
            emptyCandidates.push({ r, c, score });
          }
        }
      }

      if (emptyCandidates.length === 0) return;
      emptyCandidates.sort((a, b) => b.score - a.score);
      targetR = emptyCandidates[0].r;
      targetC = emptyCandidates[0].c;
    }

    const correctDigit = levelConfig.solutionGrid?.[targetR]?.[targetC];
    if (!correctDigit) return;

    // Decrement remaining bulb charges
    setHintsRemaining(h => Math.max(0, h - 1));
    setSelectedCell({ r: targetR, c: targetC });
    setSpotlightDigit(correctDigit);

    // Warm golden-amber spotlight pulse
    const cellKey = `${targetR}-${targetC}`;
    setHintPulseCell(cellKey);
    if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    pulseTimerRef.current = setTimeout(() => {
      setHintPulseCell(null);
    }, 750);

    // Mark as hinted (rendered in glowing golden-amber text)
    setHintedCells(prev => new Set(prev).add(cellKey));

    // Play crisp Web Audio chime
    sudokuAudio.playHintUsed();

    // Fill valid digit into board
    setGrid(prev => {
      const nextGrid = prev.map(row => [...row]);
      if (!nextGrid[targetR]) return prev;
      nextGrid[targetR][targetC] = correctDigit;

      const newConflicts = recalculateConflicts(nextGrid);
      setConflicts(newConflicts);

      checkCompletionGlow(nextGrid, newConflicts);

      if (checkVictory(nextGrid, newConflicts)) {
        setTimeout(() => {
          setPhase('VICTORY');
          sudokuAudio.playVictory();
          unlockNextLevel('neon-sudoku', levelConfig.level);
        }, 220);
      }

      return nextGrid;
    });
  }, [phase, hintsRemaining, selectedCell, grid, levelConfig, recalculateConflicts, checkCompletionGlow, checkVictory]);

  // Start Level from Briefing
  const handleStartMission = useCallback(() => {
    setPhase('PLAYING');
    sudokuAudio.playBriefingStart();
  }, []);

  // Keyboard navigation & controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (phase === 'BRIEFING') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleStartMission();
        }
        return;
      }

      if (phase === 'VICTORY') {
        if (e.key === 'Enter') {
          e.preventDefault();
          onLevelComplete();
        }
        return;
      }

      if (phase !== 'PLAYING' || isPaused) return;

      const { r, c } = selectedCell;
      const size = levelConfig.size;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedCell({ r: (r - 1 + size) % size, c });
        sudokuAudio.playCellSelect();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedCell({ r: (r + 1) % size, c });
        sudokuAudio.playCellSelect();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedCell({ r, c: (c - 1 + size) % size });
        sudokuAudio.playCellSelect();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedCell({ r, c: (c + 1) % size });
        sudokuAudio.playCellSelect();
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        handleErase();
      } else if (e.key.toLowerCase() === 'h') {
        e.preventDefault();
        handleBulbHint();
      } else {
        const num = parseInt(e.key, 10);
        if (!isNaN(num) && num >= 1 && num <= levelConfig.size) {
          e.preventDefault();
          handlePlaceDigit(num);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, selectedCell, levelConfig, handleStartMission, onLevelComplete, handlePlaceDigit, handleErase, handleBulbHint]);

  // Reset Level Board
  const handleResetCurrent = () => {
    setGrid(levelConfig.initialGrid.map(row => [...row]));
    setConflicts(new Set());
    setHintedCells(new Set());
    setHintsRemaining(3);
    completedRowsRef.current.clear();
    completedColsRef.current.clear();
    completedBoxesRef.current.clear();
    sudokuAudio.playErase();
  };

  // Format Elapsed Time MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Placed count per digit
  const digitCounts = useMemo(() => {
    const counts = {};
    for (let d = 1; d <= levelConfig.size; d++) counts[d] = 0;
    for (let r = 0; r < levelConfig.size; r++) {
      for (let c = 0; c < levelConfig.size; c++) {
        const val = grid?.[r]?.[c] ?? 0;
        if (val >= 1 && val <= levelConfig.size) {
          counts[val] = (counts[val] || 0) + 1;
        }
      }
    }
    return counts;
  }, [grid, levelConfig]);

  // Filled cells count
  const filledCellsCount = useMemo(() => {
    let filled = 0;
    for (let r = 0; r < levelConfig.size; r++) {
      for (let c = 0; c < levelConfig.size; c++) {
        if ((grid?.[r]?.[c] ?? 0) !== 0) filled++;
      }
    }
    return filled;
  }, [grid, levelConfig]);

  const totalCells = levelConfig.size * levelConfig.size;

  return (
    <>
      {/* Clean Top HUD Controls Strip */}
      <div className={styles.hudRight}>
        <div className={styles.timerBadge} title="Elapsed Time">
          <span>⏱</span> {formatTime(elapsedTime)}
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
          onClick={handleResetCurrent}
          title="Reset Board"
        >
          ↻
        </button>
        <button
          className={styles.iconBtn}
          onClick={onToggleSound}
          title={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {soundMuted ? '🔇' : '🔊'}
        </button>
      </div>

      {/* Header Info */}
      <div className={styles.headerStrip}>
        <div className={styles.titleRow}>
          <h1 className={styles.mainTitle}>{levelConfig.title}</h1>
          <span className={styles.sizeBadge}>
            {levelConfig.size}×{levelConfig.size} Grid
          </span>
        </div>
        <p className={styles.subtitleText}>{levelConfig.subtitle}</p>
      </div>

      {/* Stage Wrapper */}
      <div className={styles.stageWrapper}>
        {/* Clean Status Strip */}
        <div className={styles.statusStrip}>
          <div className={styles.statusItem}>
            <span>Grid Progress:</span>
            <span className={styles.statusVal}>
              {filledCellsCount} / {totalCells}
            </span>
          </div>

          <div className={styles.conflictIndicator}>
            {conflicts.size > 0 ? (
              <span className={styles.conflictActive}>
                ⚠ {conflicts.size / 2 > 1 ? `${conflicts.size} Conflicts` : 'Conflict Detected'}
              </span>
            ) : (
              <span style={{ color: '#10B981', fontWeight: 600 }}>
                ✓ No Conflicts
              </span>
            )}
          </div>
        </div>

        {/* Sudoku Grid Board */}
        <div
          ref={boardRef}
          className={`${styles.gridBoard} ${
            levelConfig.size === 4 ? styles.gridBoard4x4 : styles.gridBoard9x9
          }`}
          tabIndex={0}
        >
          {grid.map((rowArr, r) =>
            rowArr.map((val, c) => {
              const cellKey = `${r}-${c}`;
              const isSelected = selectedCell.r === r && selectedCell.c === c;
              const isGiven = isGivenCell(r, c);
              const isHinted = hintedCells.has(cellKey);
              const hasConflict = conflicts.has(cellKey);
              const isSameDigit = spotlightDigit > 0 && val === spotlightDigit;
              const isGlowing = completionGlowCells.has(cellKey);
              const isHintPulse = hintPulseCell === cellKey;

              // Row / Col / Box crosshair highlight
              const inSameRow = selectedCell.r === r;
              const inSameCol = selectedCell.c === c;
              const inSameBox =
                Math.floor(r / levelConfig.boxRows) ===
                  Math.floor(selectedCell.r / levelConfig.boxRows) &&
                Math.floor(c / levelConfig.boxCols) ===
                  Math.floor(selectedCell.c / levelConfig.boxCols);
              const isCrosshair = (inSameRow || inSameCol || inSameBox) && !isSelected;

              // Alternating sub-box background tint
              const boxIndex =
                Math.floor(r / levelConfig.boxRows) *
                  (levelConfig.size / levelConfig.boxCols) +
                Math.floor(c / levelConfig.boxCols);
              const isEvenBox = boxIndex % 2 === 0;

              // Sub-box borders
              const isSubBoxRight =
                levelConfig.size === 4
                  ? c === 1
                  : c === 2 || c === 5; // 9x9 has box dividers after col 2 and col 5
              const isSubBoxBottom =
                levelConfig.size === 4
                  ? r === 1
                  : r === 2 || r === 5; // 9x9 has box dividers after row 2 and row 5

              let cellClasses = [styles.cell];
              if (isEvenBox) cellClasses.push(styles.boxTintEven);
              else cellClasses.push(styles.boxTintOdd);

              if (levelConfig.size === 4) {
                if (isSubBoxRight) cellClasses.push(styles.subBoxRight4x4);
                if (isSubBoxBottom) cellClasses.push(styles.subBoxBottom4x4);
              } else {
                if (isSubBoxRight) cellClasses.push(styles.subBoxRight9x9);
                if (isSubBoxBottom) cellClasses.push(styles.subBoxBottom9x9);
              }

              if (isGiven) cellClasses.push(styles.cellGiven);
              else if (isHinted) cellClasses.push(styles.cellHinted);
              else cellClasses.push(styles.cellEditable);

              if (isCrosshair) cellClasses.push(styles.cellCrosshair);
              if (isSameDigit && !isSelected) cellClasses.push(styles.cellSameDigit);
              if (isSelected) cellClasses.push(styles.cellSelected);
              if (hasConflict) cellClasses.push(styles.cellConflict);
              if (isGlowing) cellClasses.push(styles.cellCompletionGlow);
              if (isHintPulse) cellClasses.push(styles.cellHintPulse);
              if (phase === 'VICTORY') cellClasses.push(styles.cellVictoryWave);

              return (
                <div
                  key={cellKey}
                  className={cellClasses.join(' ')}
                  onClick={() => handleCellClick(r, c)}
                  role="button"
                  aria-label={`Cell row ${r + 1}, column ${c + 1}, value ${val || 'empty'}`}
                >
                  {val > 0 ? val : ''}
                </div>
              );
            })
          )}
        </div>

        {/* Dynamic Tactile Number Pad + Glowing Bulb Hint + Erase */}
        <div className={styles.numpadContainer}>
          {levelConfig.digits.map(digit => {
            const count = digitCounts[digit] || 0;
            const isCompleted = count >= levelConfig.size;
            return (
              <button
                key={digit}
                className={`${styles.numpadBtn} ${isCompleted ? styles.numpadCompleted : ''}`}
                onClick={() => {
                  handlePlaceDigit(digit);
                  setSpotlightDigit(digit);
                }}
                title={`Input number ${digit} (${count}/${levelConfig.size} placed)`}
              >
                <span className={styles.numpadDigit}>{digit}</span>
                <span className={styles.numpadCount}>
                  {isCompleted ? '✓' : `${count}/${levelConfig.size}`}
                </span>
              </button>
            );
          })}

          {/* Real-Time Glowing Bulb (💡) Hint Button */}
          <button
            className={styles.bulbHintBtn}
            onClick={handleBulbHint}
            disabled={hintsRemaining <= 0 || phase !== 'PLAYING'}
            title={`Reveal valid digit (${hintsRemaining} charges remaining • Shortcut: H)`}
          >
            <span>💡 Hint • {hintsRemaining}</span>
          </button>

          {/* Erase Button */}
          <button
            className={`${styles.numpadBtn} ${styles.eraseBtn}`}
            onClick={handleErase}
            title="Erase active cell (Backspace)"
          >
            <span>⌫ Erase</span>
          </button>
        </div>

        {/* Minimalist Keyboard Hint */}
        <div className={styles.hintBar}>
          <span>Controls:</span>
          <span className={styles.kbdKey}>1–{levelConfig.size}</span>
          <span>to place</span>
          <span className={styles.kbdKey}>H</span>
          <span>hint</span>
          <span className={styles.kbdKey}>Arrows</span>
          <span>navigate</span>
          <span className={styles.kbdKey}>Backspace</span>
          <span>erase</span>
        </div>
      </div>

      {/* Pre-Level Mission Briefing Overlay */}
      {phase === 'BRIEFING' && (
        <div className={styles.briefingOverlay}>
          <div className={styles.briefingCard}>
            <div className={styles.briefingHeader}>
              <span className={styles.missionBadge}>
                Deductive Logic Mission • Level {levelConfig.level}
              </span>
              <h2 className={styles.briefingTitle}>{levelConfig.title}</h2>
              <p className={styles.briefingGoal}>
                {levelConfig.size === 4
                  ? 'Fill every row, column, and 2×2 shaded block with numbers 1–4 without repeating any number.'
                  : 'Fill every row, column, and 3×3 shaded block with numbers 1–9 without repeating any number.'}
              </p>
            </div>

            {/* Visual Example Preview (Valid vs Duplicate) */}
            <div className={styles.previewBox}>
              <div className={styles.previewSide}>
                <span className={`${styles.previewLabel} ${styles.labelValid}`}>
                  ✓ Valid Placement
                </span>
                <div className={styles.miniGrid}>
                  <div className={`${styles.miniCell} ${styles.miniCellValid}`}>1</div>
                  <div className={`${styles.miniCell} ${styles.miniCellValid}`}>2</div>
                  <div className={`${styles.miniCell} ${styles.miniCellValid}`}>3</div>
                  <div className={`${styles.miniCell} ${styles.miniCellValid}`}>4</div>
                </div>
              </div>

              <div style={{ color: '#475569', fontSize: '1.2rem' }}>vs</div>

              <div className={styles.previewSide}>
                <span className={`${styles.previewLabel} ${styles.labelInvalid}`}>
                  ✗ Duplicate Conflict
                </span>
                <div className={styles.miniGrid}>
                  <div className={`${styles.miniCell} ${styles.miniCellConflict}`}>2</div>
                  <div className={`${styles.miniCell} ${styles.miniCellValid}`}>1</div>
                  <div className={`${styles.miniCell} ${styles.miniCellConflict}`}>2</div>
                  <div className={`${styles.miniCell} ${styles.miniCellValid}`}>4</div>
                </div>
              </div>
            </div>

            <div className={styles.briefingTips}>
              <p>
                <span>💡</span>
                <span>
                  <strong>Glowing Bulb Hint:</strong> Click 💡 Hint • 3 anytime to reveal a correct number on any selected cell.
                </span>
              </p>
              <p>
                <span>⚡</span>
                <span>
                  <strong>Clues:</strong> {levelConfig.givenClues} starting numbers are locked in silver. Fill the remaining {levelConfig.emptyCells} cells.
                </span>
              </p>
            </div>

            <button
              className={styles.startButton}
              onClick={handleStartMission}
              autoFocus
            >
              <span>Got It, Start</span> <span>▷</span>
            </button>
          </div>
        </div>
      )}

      {/* Victory Modal Overlay */}
      {phase === 'VICTORY' && (
        <div className={styles.modalOverlay}>
          <div className={styles.victoryCard}>
            <div className={styles.victoryIcon}>🏆</div>
            <h2 className={styles.victoryTitle}>Matrix Solved!</h2>
            <p className={styles.victorySubtitle}>
              Level {levelConfig.level} ({levelConfig.title}) completed with perfect deductive logic.
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
                <span className={styles.statLabel}>Correction Pulses</span>
                <span className={styles.statValue}>{mistakesCount}</span>
              </div>
            </div>

            <div className={styles.victoryActions}>
              <button
                className={styles.secondaryBtn}
                onClick={handleResetCurrent}
              >
                Replay
              </button>
              {levelConfig.level < SUDOKU_LEVELS.length ? (
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
        onRestart={handleResetCurrent}
        onExit={() => navigate('/dashboard/adults')}
        gameTitle={`Neon Sudoku: ${levelConfig.title}`}
        level={levelConfig.level}
        zonePath="/dashboard/adults"
      />
    </>
  );
};

/**
 * Main Controller Component
 */
export const NeonSudoku = ({ initialLevel = 1 }) => {
  const { unlockedLevel, unlockNextLevel: triggerUnlockNext, isLevelUnlocked } = useGameProgression('neon-sudoku');
  const [levelNum, setLevelNum] = useState(
    () => Math.min(Math.max(initialLevel, 1), Math.min(unlockedLevel, SUDOKU_LEVELS.length))
  );
  const [soundMuted, setSoundMuted] = useState(false);

  // Keep level clamped if unlockedLevel changes
  useEffect(() => {
    if (levelNum > unlockedLevel) {
      setLevelNum(unlockedLevel);
    }
  }, [unlockedLevel, levelNum]);

  const levelConfig = useMemo(
    () => SUDOKU_LEVELS[levelNum - 1] || SUDOKU_LEVELS[0],
    [levelNum]
  );

  const handleNextLevel = () => {
    if (levelNum < SUDOKU_LEVELS.length) {
      triggerUnlockNext(levelNum);
      setLevelNum(l => l + 1);
    }
  };

  const handleToggleSound = () => {
    const nextMuted = !soundMuted;
    setSoundMuted(nextMuted);
    sudokuAudio.setMuted(nextMuted);
  };

  return (
    <div className={styles.arenaContainer}>
      {/* Clean Top HUD Navigation Strip */}
      <div className={styles.topHud}>
        <div className={styles.hudLeft}>
          <Link to="/dashboard/adults" className={styles.adultsExitBtn} title="Return to Adults Neuro-Lab">
            ← 🧠 Adults Neuro-Lab
          </Link>

          {/* Level Selector Tabs */}
          <div className={styles.levelTabs}>
            {SUDOKU_LEVELS.map(l => {
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
      </div>

      {/* Render inner arena with key={levelNum} to guarantee atomic state resetting */}
      <NeonSudokuArena
        key={`sudoku-arena-level-${levelNum}`}
        levelConfig={levelConfig}
        onLevelComplete={handleNextLevel}
        soundMuted={soundMuted}
        onToggleSound={handleToggleSound}
      />
    </div>
  );
};

export default NeonSudoku;
