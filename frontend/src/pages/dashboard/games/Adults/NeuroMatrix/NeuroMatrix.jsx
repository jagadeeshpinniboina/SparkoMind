import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, RotateCcw, Brain, Volume2, VolumeX, 
  ArrowRight, Sparkles, Heart, RotateCw, Eye, Target, 
  ArrowRightLeft, ListOrdered, CheckCircle2, ShieldAlert, Pause
} from 'lucide-react';
import neuroMatrixAudio from './NeuroMatrixAudio';
import { useGameProgression, unlockNextLevel } from '../../../../../utils/gameProgression.js';
import GamePauseOverlay from '../../../../../components/GamePauseOverlay';
import styles from './NeuroMatrix.module.css';

// ============================================================================
// 1. EXACT MATHEMATICAL COORDINATE TRANSFORMATION HELPER
// ============================================================================
export const transformCoords = (r, c, N, transformType) => {
  switch (transformType) {
    case 'ROTATE_90_CW':
      return { r: c, c: N - 1 - r };
    case 'ROTATE_90_CCW':
      return { r: N - 1 - c, c: r };
    case 'MIRROR_H':
      return { r: r, c: N - 1 - c };
    case 'NONE':
    case 'SEQUENCE':
    default:
      return { r, c };
  }
};

// ============================================================================
// 2. CLEAN 5-LEVEL SPECIFICATION
// ============================================================================
export const NEUROMATRIX_LEVELS = [
  {
    level: 1,
    title: 'Direct Recall',
    mission: 'Watch the highlighted tiles, then tap the exact same spots.',
    category: 'Spatial Working Memory',
    gridSize: 4,
    nodeCount: 4,
    transform: 'NONE',
    transformLabel: 'Direct Recall',
    isOrdered: false,
    rounds: [
      [
        { r: 0, c: 1 }, { r: 1, c: 3 }, { r: 2, c: 0 }, { r: 3, c: 2 }
      ],
      [
        { r: 0, c: 2 }, { r: 1, c: 0 }, { r: 2, c: 3 }, { r: 3, c: 1 }
      ],
      [
        { r: 0, c: 3 }, { r: 1, c: 1 }, { r: 2, c: 2 }, { r: 3, c: 0 }
      ]
    ]
  },
  {
    level: 2,
    title: 'Clockwise Shift',
    mission: 'Watch the tiles, mentally turn the board 90° right (↻), and tap their new spots.',
    category: 'Mental Rotation (CW)',
    gridSize: 4,
    nodeCount: 4,
    transform: 'ROTATE_90_CW',
    transformLabel: '90° Clockwise Rotation (↻)',
    isOrdered: false,
    rounds: [
      [
        { r: 0, c: 1 }, { r: 1, c: 0 }, { r: 2, c: 3 }, { r: 3, c: 2 }
      ],
      [
        { r: 0, c: 2 }, { r: 1, c: 3 }, { r: 2, c: 1 }, { r: 3, c: 0 }
      ],
      [
        { r: 0, c: 0 }, { r: 1, c: 2 }, { r: 2, c: 0 }, { r: 3, c: 3 }
      ]
    ]
  },
  {
    level: 3,
    title: 'Counter-Clockwise Shift',
    mission: 'Watch the tiles, mentally turn the board 90° left (↺), and tap their new spots.',
    category: 'Mental Rotation (CCW)',
    gridSize: 5,
    nodeCount: 5,
    transform: 'ROTATE_90_CCW',
    transformLabel: '90° Counter-Clockwise Rotation (↺)',
    isOrdered: false,
    rounds: [
      [
        { r: 0, c: 2 }, { r: 1, c: 0 }, { r: 2, c: 4 }, { r: 3, c: 1 }, { r: 4, c: 3 }
      ],
      [
        { r: 0, c: 1 }, { r: 1, c: 4 }, { r: 2, c: 2 }, { r: 3, c: 0 }, { r: 4, c: 3 }
      ],
      [
        { r: 0, c: 3 }, { r: 1, c: 1 }, { r: 2, c: 0 }, { r: 3, c: 4 }, { r: 4, c: 2 }
      ]
    ]
  },
  {
    level: 4,
    title: 'Mirror Inversion',
    mission: 'Flip the pattern left-to-right like a mirror (⇄) and tap the mirrored spots.',
    category: 'Spatial Mirror Inversion',
    gridSize: 5,
    nodeCount: 5,
    transform: 'MIRROR_H',
    transformLabel: 'Horizontal Mirror Flip (⇄)',
    isOrdered: false,
    rounds: [
      [
        { r: 0, c: 1 }, { r: 1, c: 3 }, { r: 2, c: 0 }, { r: 3, c: 4 }, { r: 4, c: 2 }
      ],
      [
        { r: 0, c: 0 }, { r: 1, c: 2 }, { r: 2, c: 4 }, { r: 3, c: 1 }, { r: 4, c: 3 }
      ],
      [
        { r: 0, c: 4 }, { r: 1, c: 0 }, { r: 2, c: 1 }, { r: 3, c: 3 }, { r: 4, c: 2 }
      ]
    ]
  },
  {
    level: 5,
    title: 'Sequential Chain',
    mission: 'Remember the order (1 → 5) and tap the tiles in the exact same sequence.',
    category: 'Sequential Working Memory',
    gridSize: 5,
    nodeCount: 5,
    transform: 'SEQUENCE',
    transformLabel: 'Numbered Sequence (1 → 5)',
    isOrdered: true,
    rounds: [
      [
        { r: 0, c: 2, seq: 1 }, { r: 1, c: 4, seq: 2 }, { r: 2, c: 1, seq: 3 },
        { r: 3, c: 3, seq: 4 }, { r: 4, c: 0, seq: 5 }
      ],
      [
        { r: 0, c: 4, seq: 1 }, { r: 1, c: 1, seq: 2 }, { r: 2, c: 3, seq: 3 },
        { r: 3, c: 0, seq: 4 }, { r: 4, c: 2, seq: 5 }
      ],
      [
        { r: 0, c: 1, seq: 1 }, { r: 1, c: 3, seq: 2 }, { r: 2, c: 0, seq: 3 },
        { r: 3, c: 4, seq: 4 }, { r: 4, c: 2, seq: 5 }
      ]
    ]
  }
];

// ============================================================================
// 3. NATURAL LANGUAGE COPY & MINI-PREVIEW CONFIGURATION (Lumosity/Elevate Style)
// ============================================================================
export const getLevelInstruction = (level) => {
  switch (level) {
    case 1:
      return 'Watch the highlighted tiles, then tap the exact same spots.';
    case 2:
      return 'Watch the tiles, mentally turn the board 90° right (↻), and tap their new spots.';
    case 3:
      return 'Watch the tiles, mentally turn the board 90° left (↺), and tap their new spots.';
    case 4:
      return 'Flip the pattern left-to-right like a mirror (⇄) and tap the mirrored spots.';
    case 5:
      return 'Remember the order (1 → 5) and tap the tiles in the exact same sequence.';
    default:
      return 'Watch the highlighted tiles, then tap the required spots.';
  }
};

export const MINI_PREVIEWS = {
  1: {
    before: [{ r: 0, c: 1 }],
    after: [{ r: 0, c: 1 }],
    transformText: 'Direct',
    icon: '➔'
  },
  2: {
    before: [{ r: 0, c: 1 }],
    after: [{ r: 1, c: 2 }],
    transformText: '↻ 90°',
    icon: '↻'
  },
  3: {
    before: [{ r: 0, c: 1 }],
    after: [{ r: 1, c: 0 }],
    transformText: '↺ 90°',
    icon: '↺'
  },
  4: {
    before: [{ r: 1, c: 0 }],
    after: [{ r: 1, c: 2 }],
    transformText: '⇄ Flip',
    icon: '⇄'
  },
  5: {
    before: [
      { r: 0, c: 0, num: 1 },
      { r: 1, c: 1, num: 2 },
      { r: 2, c: 2, num: 3 }
    ],
    after: [
      { r: 0, c: 0, num: 1 },
      { r: 1, c: 1, num: 2 },
      { r: 2, c: 2, num: 3 }
    ],
    transformText: '1 → 2 → 3',
    icon: '🔢'
  }
};

// ============================================================================
// 4. REACT INTERACTIVE ENGINE
// ============================================================================
export const NeuroMatrix = ({ initialLevel = 1 }) => {
  const navigate = useNavigate();

  // Clamp level 1 to 5 & sequential level progression
  const { unlockedLevel, unlockNextLevel: triggerUnlockNext, isLevelUnlocked } = useGameProgression('neuro-matrix');
  const sanitizedLevel = Math.max(1, Math.min(5, Number(initialLevel) || 1));
  const initialAllowed = Math.min(sanitizedLevel, unlockedLevel);
  const [currentLevel, setCurrentLevel] = useState(initialAllowed);
  const [roundIndex, setRoundIndex] = useState(0); // 0, 1, 2

  // Keep level clamped if unlockedLevel changes
  useEffect(() => {
    if (currentLevel > unlockedLevel) {
      setCurrentLevel(unlockedLevel);
    }
  }, [unlockedLevel, currentLevel]);

  // Immutable round state generated at round start
  const [initialPattern, setInitialPattern] = useState([]);
  const [expectedTargets, setExpectedTargets] = useState([]);

  // Phase state: 'BRIEFING' (Pre-level start gate) | 'MEMORIZE' | 'TRANSFORM' | 'RECALL'
  const [phase, setPhase] = useState('BRIEFING');
  const [countdownPercent, setCountdownPercent] = useState(100);
  const [neuralIntegrity, setNeuralIntegrity] = useState(3); // 3 strikes max
  const [isMuted, setIsMuted] = useState(false);

  // Recalled cells: set of string "r,c"
  const [recalledCells, setRecalledCells] = useState(new Set());
  // In Level 5 sequence mode: next expected sequence number (1..5)
  const [nextExpectedSeq, setNextExpectedSeq] = useState(1);
  // Flashing error cell key
  const [errorCell, setErrorCell] = useState(null);

  // Real-time juice: Shockwave pulse
  const [shockwaveCell, setShockwaveCell] = useState(null);

  // Solution Ghost preview: true on 0 integrity or manual inspection
  const [showGhost, setShowGhost] = useState(false);

  // Modal dialog states
  const [isVictoryOpen, setIsVictoryOpen] = useState(false);
  const [isGameOverOpen, setIsGameOverOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Keyboard pause shortcut (Escape or P)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (!isVictoryOpen && !isGameOverOpen) {
          setIsPaused((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVictoryOpen, isGameOverOpen]);

  // Performance telemetry
  const [totalClicks, setTotalClicks] = useState(0);
  const [successfulClicks, setSuccessfulClicks] = useState(0);

  // Active level configuration
  const levelConfig = useMemo(() => {
    return NEUROMATRIX_LEVELS.find((l) => l.level === currentLevel) || NEUROMATRIX_LEVELS[0];
  }, [currentLevel]);

  // Toggle audio mute
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    neuroMatrixAudio.setMuted(next);
  };

  // ==========================================================================
  // START ROUND: Generate immutable initialPattern & compute expectedTargets
  // ==========================================================================
  const startRound = useCallback(
    (lvlNum, rIdx, shouldBrief = false) => {
      const config = NEUROMATRIX_LEVELS.find((l) => l.level === lvlNum) || NEUROMATRIX_LEVELS[0];
      const validRIdx = Math.max(0, Math.min(config.rounds.length - 1, rIdx));
      const rawPattern = config.rounds[validRIdx];

      // Compute exact expected targets using pure JavaScript mathematical mapping
      const targets = rawPattern.map((pt) => {
        const trans = transformCoords(pt.r, pt.c, config.gridSize, config.transform);
        return {
          origR: pt.r,
          origC: pt.c,
          r: trans.r,
          c: trans.c,
          key: `${trans.r},${trans.c}`,
          seq: pt.seq || null
        };
      });

      setInitialPattern(rawPattern);
      setExpectedTargets(targets);
      setCountdownPercent(100);
      setRecalledCells(new Set());
      setNextExpectedSeq(1);
      setErrorCell(null);
      setShockwaveCell(null);
      setShowGhost(false);
      setIsGameOverOpen(false);
      setIsVictoryOpen(false);

      if (shouldBrief) {
        setPhase('BRIEFING');
      } else {
        setPhase('MEMORIZE');
        neuroMatrixAudio.playFlash();
      }
    },
    []
  );

  // Launch initial round with BRIEFING gate on mount
  useEffect(() => {
    startRound(currentLevel, roundIndex, true);
  }, []);

  // Synchronize if initialLevel prop changes
  useEffect(() => {
    const lvl = Math.max(1, Math.min(5, Number(initialLevel) || 1));
    if (lvl !== currentLevel) {
      setCurrentLevel(lvl);
      setRoundIndex(0);
      setNeuralIntegrity(3);
      startRound(lvl, 0, true);
    }
  }, [initialLevel]);

  // ==========================================================================
  // START MISSION HANDLER (Exits BRIEFING gate and begins MEMORIZE flash)
  // ==========================================================================
  const handleStartMission = useCallback(() => {
    setPhase('MEMORIZE');
    neuroMatrixAudio.playFlash();
  }, []);

  // ==========================================================================
  // KEYBOARD LISTENER (Space or Enter to start mission in BRIEFING)
  // ==========================================================================
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isVictoryOpen || isGameOverOpen) return;

      if (phase === 'BRIEFING') {
        if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
          e.preventDefault();
          handleStartMission();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, handleStartMission, isVictoryOpen, isGameOverOpen]);

  // ==========================================================================
  // PHASE 1: 2.5s Countdown timer for MEMORIZE
  // ==========================================================================
  useEffect(() => {
    if (phase !== 'MEMORIZE' || isPaused) return;

    const DURATION = 2500;
    const INTERVAL = 25;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPercent = Math.max(0, 100 - (elapsed / DURATION) * 100);
      setCountdownPercent(remainingPercent);

      if (elapsed >= DURATION) {
        clearInterval(timer);
        if (levelConfig.transform === 'NONE') {
          setPhase('RECALL');
        } else {
          setPhase('TRANSFORM');
          neuroMatrixAudio.playWhoosh();
        }
      }
    }, INTERVAL);

    return () => clearInterval(timer);
  }, [phase, levelConfig.transform, isPaused]);

  // ==========================================================================
  // PHASE 2: 1.0s Smooth display for TRANSFORM banner
  // ==========================================================================
  useEffect(() => {
    if (phase !== 'TRANSFORM' || isPaused) return;

    const transformTimer = setTimeout(() => {
      setPhase('RECALL');
    }, 1000);

    return () => clearTimeout(transformTimer);
  }, [phase, isPaused]);

  // ==========================================================================
  // PHASE 3: Handle Cell Click during RECALL
  // ==========================================================================
  const handleCellClick = (r, c) => {
    if (phase !== 'RECALL' || isPaused) return;
    const key = `${r},${c}`;

    // If already correctly recalled, ignore
    if (recalledCells.has(key)) return;

    setTotalClicks((prev) => prev + 1);

    // Mode A: Level 5 (Sequential Chain Mode - strict ascending order 1..5)
    if (levelConfig.isOrdered) {
      const targetMatch = expectedTargets.find((t) => t.r === r && t.c === c);
      if (targetMatch && targetMatch.seq === nextExpectedSeq) {
        // Correct node in sequence!
        const nextRecalled = new Set(recalledCells);
        nextRecalled.add(key);
        setRecalledCells(nextRecalled);
        setShockwaveCell({ r, c, key, id: Date.now() });
        setSuccessfulClicks((prev) => prev + 1);
        neuroMatrixAudio.playHit(nextExpectedSeq);

        if (nextExpectedSeq === levelConfig.nodeCount) {
          handleRoundSuccess();
        } else {
          setNextExpectedSeq((prev) => prev + 1);
        }
      } else {
        triggerErrorStrike(key);
      }
      return;
    }

    // Mode B: Levels 1 to 4 (Direct Recall, 90° CW, 90° CCW, Mirror H)
    const targetMatch = expectedTargets.find((t) => t.r === r && t.c === c);
    if (targetMatch) {
      // Correct coordinate match!
      const nextRecalled = new Set(recalledCells);
      nextRecalled.add(key);
      setRecalledCells(nextRecalled);
      setShockwaveCell({ r, c, key, id: Date.now() });
      setSuccessfulClicks((prev) => prev + 1);
      neuroMatrixAudio.playHit(nextRecalled.size);

      if (nextRecalled.size === levelConfig.nodeCount) {
        handleRoundSuccess();
      }
    } else {
      triggerErrorStrike(key);
    }
  };

  // Trigger error feedback and deduct neural integrity strike (Crisp 220ms Glitch Flash)
  const triggerErrorStrike = (key) => {
    setErrorCell(key);
    neuroMatrixAudio.playError();
    setTimeout(() => setErrorCell(null), 220);

    setNeuralIntegrity((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        setShowGhost(true);
        setTimeout(() => {
          setIsGameOverOpen(true);
        }, 650);
        return 0;
      }
      return next;
    });
  };

  // Handle successful round completion
  const handleRoundSuccess = () => {
    if (roundIndex < 2) {
      setTimeout(() => {
        const nextRound = roundIndex + 1;
        setRoundIndex(nextRound);
        // Continue seamlessly to Round 2 or 3 without re-briefing
        startRound(currentLevel, nextRound, false);
      }, 700);
    } else {
      // All 3 rounds in level successfully cleared!
      setTimeout(() => {
        neuroMatrixAudio.playVictory();
        triggerUnlockNext(currentLevel);
        setIsVictoryOpen(true);
      }, 600);
    }
  };

  // Next level navigation (triggers new level Mission Briefing)
  const handleNextLevel = () => {
    if (currentLevel < 5) {
      const nextLvl = currentLevel + 1;
      triggerUnlockNext(currentLevel);
      setCurrentLevel(nextLvl);
      setRoundIndex(0);
      setNeuralIntegrity(3);
      setIsVictoryOpen(false);
      startRound(nextLvl, 0, true);
      navigate(`/dashboard/adults/play/neuro-matrix?level=${nextLvl}`);
    } else {
      setIsVictoryOpen(false);
      navigate('/dashboard/adults/games');
    }
  };

  // Level selector click (triggers level Mission Briefing)
  const handleLevelSelect = (lvl) => {
    if (!isLevelUnlocked(lvl)) return;
    setCurrentLevel(lvl);
    setRoundIndex(0);
    setNeuralIntegrity(3);
    setShowGhost(false);
    setIsVictoryOpen(false);
    setIsGameOverOpen(false);
    startRound(lvl, 0, true);
    navigate(`/dashboard/adults/play/neuro-matrix?level=${lvl}`);
  };

  // Restart current round directly
  const handleRetryRound = () => {
    setNeuralIntegrity(3);
    setShowGhost(false);
    setIsGameOverOpen(false);
    startRound(currentLevel, roundIndex, false);
  };

  // Restart entire drill from Level 1
  const handleRestartDrill = () => {
    setNeuralIntegrity(3);
    setRoundIndex(0);
    setShowGhost(false);
    setIsGameOverOpen(false);
    setIsVictoryOpen(false);
    startRound(currentLevel, 0, true);
  };

  // Close Game Over modal to inspect the Solution Ghost on the matrix
  const handleInspectGhost = () => {
    setIsGameOverOpen(false);
    setShowGhost(true);
  };

  const gridSize = levelConfig.gridSize;
  const accuracyPercent = totalClicks > 0 ? Math.round((successfulClicks / totalClicks) * 100) : 100;

  return (
    <div className={styles.matrixContainer}>
      {/* ====================================================================
         1. TOP NAVIGATION & STATUS HUD
         ==================================================================== */}
      <header className={styles.topHud}>
        <div className={styles.hudLeft}>
          <Link to="/dashboard/adults" className={styles.adultsExitBtn} title="Return to Adults Neuro-Lab">
            ← 🧠 Adults Neuro-Lab
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

        <div className={styles.hudRight}>
          {/* Neural Integrity (3 Strikes Max) */}
          <div className={styles.integrityPill}>
            <span>Integrity:</span>
            <div className={styles.heartsGroup}>
              {[1, 2, 3].map((h) => (
                <Heart
                  key={h}
                  size={14}
                  fill={h <= neuralIntegrity ? 'currentColor' : 'none'}
                  className={h <= neuralIntegrity ? styles.heartFilled : styles.heartEmpty}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleRestartDrill}
            className={styles.iconBtn}
            title="Restart Drill"
          >
            <RotateCcw size={15} />
          </button>

          <button
            type="button"
            onClick={toggleMute}
            className={styles.iconBtn}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          <button
            type="button"
            onClick={() => setIsPaused(true)}
            className={styles.iconBtn}
            title="Pause Drill (Esc or P)"
          >
            <Pause size={15} />
          </button>
        </div>
      </header>

      {/* ====================================================================
         2. MISSION BRIEF BANNER
         ==================================================================== */}
      <div className={styles.missionBanner}>
        <div className={styles.missionDetails}>
          <div className={styles.missionTitle}>
            <span>Level {currentLevel}: {levelConfig.title}</span>
            <span className={styles.badgeCategory}>{levelConfig.category}</span>
          </div>
          <p className={styles.missionDesc}>{levelConfig.mission}</p>
        </div>

        <div className={styles.roundCounterBadge}>
          <Brain size={16} style={{ color: '#06B6D4' }} />
          <span>Round {roundIndex + 1} / 3</span>
        </div>
      </div>

      {/* ====================================================================
         3. PHASE STATUS & COUNTDOWN BAR
         ==================================================================== */}
      <div className={styles.phaseStatusCard}>
        {phase === 'BRIEFING' && (
          <div className={`${styles.phasePill} ${styles.phaseBriefing}`}>
            <Brain size={15} />
            <span>Mission Briefing Active (Paused)</span>
          </div>
        )}

        {phase === 'MEMORIZE' && (
          <div className={`${styles.phasePill} ${styles.phaseMemorize}`}>
            <Eye size={15} />
            <span>Phase 1: Memorize Pattern ({levelConfig.nodeCount} Nodes)</span>
          </div>
        )}

        {phase === 'TRANSFORM' && (
          <div className={`${styles.phasePill} ${styles.phaseTransform}`}>
            {levelConfig.transform === 'ROTATE_90_CW' && <RotateCw size={15} className={styles.spinIconCw} />}
            {levelConfig.transform === 'ROTATE_90_CCW' && <RotateCw size={15} className={styles.spinIconCcw} />}
            {levelConfig.transform === 'MIRROR_H' && <ArrowRightLeft size={15} />}
            {levelConfig.transform === 'SEQUENCE' && <ListOrdered size={15} />}
            <span>Phase 2: {levelConfig.transformLabel}</span>
          </div>
        )}

        {phase === 'RECALL' && (
          <div className={`${styles.phasePill} ${styles.phaseRecall}`}>
            <Target size={15} />
            <span>
              Phase 3: Reconstruct Pattern ({recalledCells.size} / {levelConfig.nodeCount})
            </span>
          </div>
        )}

        {/* Countdown Bar during MEMORIZE */}
        {phase === 'MEMORIZE' && (
          <div className={styles.countdownTrack}>
            <div className={styles.countdownFill} style={{ width: `${countdownPercent}%` }} />
          </div>
        )}

        {/* Transformation Indicator during RECALL */}
        {phase === 'RECALL' && levelConfig.transform !== 'NONE' && (
          <div className={styles.transformBadge}>
            {levelConfig.transform === 'ROTATE_90_CW' && <RotateCw size={13} />}
            {levelConfig.transform === 'ROTATE_90_CCW' && <RotateCw size={13} />}
            {levelConfig.transform === 'MIRROR_H' && <ArrowRightLeft size={13} />}
            {levelConfig.transform === 'SEQUENCE' && <ListOrdered size={13} />}
            <span>Rule: {levelConfig.transformLabel}</span>
          </div>
        )}

        {/* Ghost Solution Banner if active */}
        {showGhost && (
          <div className={styles.ghostNotification}>
            <Sparkles size={14} style={{ color: '#06B6D4' }} />
            <span>Solution Ghost Active — Transformed targets are illuminated with dashed outlines.</span>
            <button
              type="button"
              onClick={handleRetryRound}
              className={styles.ghostRetryBtn}
            >
              ↺ Retry Round
            </button>
          </div>
        )}
      </div>

      {/* ====================================================================
         4. INTERACTIVE MATRIX ARENA
         ==================================================================== */}
      <div className={styles.matrixStage}>
        {/* Animated Transform Card Overlay between MEMORIZE and RECALL */}
        {phase === 'TRANSFORM' && (
          <div className={styles.transformOverlay}>
            <div className={styles.transformIconWrapper}>
              {levelConfig.transform === 'ROTATE_90_CW' && <RotateCw size={44} className={styles.iconSpinCw} />}
              {levelConfig.transform === 'ROTATE_90_CCW' && <RotateCw size={44} className={styles.iconSpinCcw} />}
              {levelConfig.transform === 'MIRROR_H' && <ArrowRightLeft size={44} className={styles.iconFlipH} />}
              {levelConfig.transform === 'SEQUENCE' && <ListOrdered size={44} className={styles.iconSeq} />}
            </div>
            <div className={styles.transformBannerTitle}>
              {levelConfig.transformLabel}
            </div>
            <div className={styles.transformBannerSub}>
              Mental shift active: Grid DOM coordinates remain fixed!
            </div>
          </div>
        )}

        {/* Pure DOM Grid: Zero CSS Rotate on Container */}
        <div className={styles.gridWrapper}>
          <div
            className={styles.neuroGrid}
            style={{
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gridTemplateRows: `repeat(${gridSize}, 1fr)`
            }}
          >
            {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
              const r = Math.floor(idx / gridSize);
              const c = idx % gridSize;
              const cellKey = `${r},${c}`;

              // Is this cell illuminated during MEMORIZE?
              const initialNode = initialPattern.find((p) => p.r === r && p.c === c);
              const isMemorizeLit = phase === 'MEMORIZE' && !!initialNode;

              // Is this cell correctly recalled during RECALL?
              const isRecalled = recalledCells.has(cellKey);
              const recalledTarget = isRecalled ? expectedTargets.find((t) => t.r === r && t.c === c) : null;

              // Is this cell flashing an error strike?
              const isError = errorCell === cellKey;

              // Is this cell a Solution Ghost target?
              const isGhost = showGhost && !isRecalled && expectedTargets.some((t) => t.r === r && t.c === c);
              const ghostTarget = isGhost ? expectedTargets.find((t) => t.r === r && t.c === c) : null;

              const isCellDisabled = phase !== 'RECALL';

              return (
                <div
                  key={cellKey}
                  className={`
                    ${styles.gridCell}
                    ${isCellDisabled ? styles.cellDisabled : ''}
                    ${isMemorizeLit ? styles.cellMemorize : ''}
                    ${isRecalled ? styles.cellCorrect : ''}
                    ${isError ? styles.cellError : ''}
                    ${isGhost ? styles.cellGhost : ''}
                  `}
                  onClick={() => handleCellClick(r, c)}
                  title={isGhost ? `Solution Node (${r}, ${c})` : undefined}
                >
                  {/* Expanding Cyan-Emerald Radial Shockwave Ring */}
                  {shockwaveCell?.key === cellKey && (
                    <span key={shockwaveCell.id} className={styles.shockwaveRing} />
                  )}
                  {/* Sequence number in Level 5 during MEMORIZE */}
                  {isMemorizeLit && levelConfig.isOrdered && initialNode?.seq && (
                    <span className={styles.sequenceNumber}>{initialNode.seq}</span>
                  )}

                  {/* Recalled node display: sequence number in Level 5, checkmark in Levels 1-4 */}
                  {isRecalled && (
                    <span className={styles.sequenceNumber}>
                      {levelConfig.isOrdered ? recalledTarget?.seq || '✓' : '✓'}
                    </span>
                  )}

                  {/* Ghost solution preview */}
                  {isGhost && (
                    <div className={styles.ghostBadge}>
                      {levelConfig.isOrdered && ghostTarget?.seq ? (
                        <span>#{ghostTarget.seq}</span>
                      ) : (
                        <Sparkles size={16} />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ====================================================================
         5. CONTROLS HINT FOOTER
         ==================================================================== */}
      <footer className={styles.controlsHint}>
        <div className={styles.hintItem}>
          <span className={styles.hintIcon}>👁️ Memorize</span>
          <span>Remember illuminated tiles</span>
        </div>
        <div className={styles.hintItem}>
          <span className={styles.hintIcon}>↻ Mental Shift</span>
          <span>Apply rule mentally</span>
        </div>
        <div className={styles.hintItem}>
          <span className={styles.hintIcon}>🎯 Tap Spots</span>
          <span>3 rounds per level • 3 lives</span>
        </div>
      </footer>

      {/* ====================================================================
         6. PRE-LEVEL MISSION BRIEFING OVERLAY (Mandatory Start Gate)
         ==================================================================== */}
      {phase === 'BRIEFING' && (
        <div className={styles.briefingOverlay}>
          <div className={styles.briefingCard}>
            <div className={styles.briefingHeader}>
              <div className={styles.briefingIconCircle}>
                <Brain size={26} />
              </div>
              <div>
                <span className={styles.briefingBadge}>HOW TO PLAY • LEVEL {currentLevel}</span>
                <h3 className={styles.briefingTitle}>{levelConfig.title}</h3>
              </div>
            </div>

            {/* Natural, Jargon-Free Instruction */}
            <p className={styles.briefingInstruction}>
              {getLevelInstruction(currentLevel)}
            </p>

            {/* Interactive Visual Mini-Diagram (3x3 Preview) */}
            <div className={styles.miniDiagramWrapper}>
              {/* BEFORE GRID */}
              <div className={styles.miniGridBox}>
                <span className={styles.miniGridLabel}>Before</span>
                <div className={styles.miniGrid}>
                  {Array.from({ length: 9 }).map((_, idx) => {
                    const r = Math.floor(idx / 3);
                    const c = idx % 3;
                    const preview = MINI_PREVIEWS[currentLevel] || MINI_PREVIEWS[1];
                    const activeNode = preview.before.find((n) => n.r === r && n.c === c);
                    return (
                      <div
                        key={idx}
                        className={`${styles.miniCell} ${activeNode ? styles.miniCellCyan : ''}`}
                      >
                        {activeNode?.num ? <span className={styles.miniCellNum}>{activeNode.num}</span> : null}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TRANSFORMATION BADGE */}
              <div className={styles.miniTransformBadge}>
                <span className={styles.miniTransformIcon}>
                  {(MINI_PREVIEWS[currentLevel] || MINI_PREVIEWS[1]).icon}
                </span>
                <span className={styles.miniTransformText}>
                  {(MINI_PREVIEWS[currentLevel] || MINI_PREVIEWS[1]).transformText}
                </span>
              </div>

              {/* AFTER GRID (Tap Here) */}
              <div className={styles.miniGridBox}>
                <span className={`${styles.miniGridLabel} ${styles.miniGridLabelGreen}`}>Tap Here</span>
                <div className={styles.miniGrid}>
                  {Array.from({ length: 9 }).map((_, idx) => {
                    const r = Math.floor(idx / 3);
                    const c = idx % 3;
                    const preview = MINI_PREVIEWS[currentLevel] || MINI_PREVIEWS[1];
                    const activeNode = preview.after.find((n) => n.r === r && n.c === c);
                    return (
                      <div
                        key={idx}
                        className={`${styles.miniCell} ${activeNode ? styles.miniCellEmerald : ''}`}
                      >
                        {activeNode?.num ? (
                          <span className={styles.miniCellNum}>{activeNode.num}</span>
                        ) : activeNode ? (
                          <span className={styles.miniCheck}>✓</span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Subtle Pill: 3 Rounds • 3 Lives */}
            <div className={styles.briefingPillContainer}>
              <div className={styles.briefingPill}>
                <span>3 Rounds</span>
                <span className={styles.pillDot}>•</span>
                <span>3 Lives</span>
              </div>
            </div>

            {/* Clean Controls Footer */}
            <div className={styles.briefingFooter}>
              <span className={styles.briefingKeyboardHint}>
                Press <kbd>Space</kbd> or <kbd>Enter</kbd> to begin
              </span>
              <button
                type="button"
                onClick={handleStartMission}
                className={styles.startMissionBtn}
              >
                <span>Got It, Start ▷</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
         7. VICTORY MODAL OVERLAY
         ==================================================================== */}
      {isVictoryOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.victoryModal}>
            <div className={styles.trophyCircle}>
              🧠
            </div>

            <h3 className={styles.victoryTitle}>Neural Matrix Synchronized!</h3>
            <p className={styles.victorySubtitle}>
              Flawless spatial reconstruction! Your executive working memory and mental rotation calibrated with peak precision.
            </p>

            <div className={styles.metricsRow}>
              <div className={styles.metricBadge}>
                <div className={styles.metricValue}>{accuracyPercent}%</div>
                <div className={styles.metricLabel}>Precision</div>
              </div>
              <div className={styles.metricBadge}>
                <div className={styles.metricValue}>3 / 3</div>
                <div className={styles.metricLabel}>Rounds Cleared</div>
              </div>
            </div>

            <div className={styles.xpBadge}>
              <Sparkles size={16} />
              <span>+150 Neuro XP Earned!</span>
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={handleRestartDrill}
                className={styles.replayBtn}
              >
                <span>↺ Replay</span>
              </button>

              <button
                type="button"
                onClick={handleNextLevel}
                className={styles.nextLevelBtn}
              >
                <span>{currentLevel < 5 ? 'Next Level' : 'Complete Challenge 🚀'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
         8. DEFEAT / DESYNC MODAL OVERLAY (With Solution Ghost Inspection)
         ==================================================================== */}
      {isGameOverOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.victoryModal} style={{ borderColor: 'rgba(239, 68, 68, 0.5)' }}>
            <div className={styles.trophyCircle} style={{ borderColor: '#EF4444', background: 'rgba(239, 68, 68, 0.2)' }}>
              ⚠️
            </div>

            <h3 className={styles.victoryTitle}>Neural Desync Detected</h3>
            <p className={styles.victorySubtitle}>
              All 3 Neural Integrity shields were depleted. You can inspect the Solution Ghost to see where the coordinates shifted, or retry the round immediately.
            </p>

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={handleInspectGhost}
                className={styles.replayBtn}
                style={{ borderColor: 'rgba(6, 182, 212, 0.5)', color: '#06B6D4' }}
              >
                <span>👁️ Inspect Solution Ghost</span>
              </button>

              <button
                type="button"
                onClick={handleRetryRound}
                className={styles.nextLevelBtn}
                style={{ background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)' }}
              >
                <span>↺ Retry Round</span>
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
          handleRetryRound();
        }}
        onExit={() => navigate('/dashboard/adults')}
        gameTitle="NeuroMatrix: Spatial Recall"
        level={currentLevel}
        zonePath="/dashboard/adults"
      />
    </div>
  );
};

export default NeuroMatrix;
