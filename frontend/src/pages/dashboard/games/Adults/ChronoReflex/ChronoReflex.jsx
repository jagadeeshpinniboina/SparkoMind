import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, RotateCcw, Brain, Volume2, VolumeX, 
  ArrowRight, Sparkles, Heart, Zap, Flame, ShieldAlert,
  Palette, FileText, Compass, MapPin, CheckCircle2, AlertTriangle, ShieldCheck, Pause
} from 'lucide-react';
import chronoReflexAudio from './ChronoReflexAudio';
import { useGameProgression, unlockNextLevel } from '../../../../../utils/gameProgression.js';
import GamePauseOverlay from '../../../../../components/GamePauseOverlay';
import styles from './ChronoReflex.module.css';

// ============================================================================
// 1. RESPONSE PADS CONSTANTS WITH KEYBIND BADGES
// ============================================================================
export const COLOR_PADS = [
  { id: 'blue', label: 'BLUE', hex: '#3B82F6', keyBadge: '1', keys: ['1', 'a', 'A'] },
  { id: 'green', label: 'GREEN', hex: '#10B981', keyBadge: '2', keys: ['2', 's', 'S'] },
  { id: 'yellow', label: 'YELLOW', hex: '#FACC15', keyBadge: '3', keys: ['3', 'd', 'D'] },
  { id: 'red', label: 'RED', hex: '#EF4444', keyBadge: '4', keys: ['4', 'f', 'F'] }
];

export const DIRECTION_PADS = [
  { id: 'left', label: 'LEFT', symbol: '←', keyBadge: '←', keys: ['ArrowLeft', 'a', 'A', '1'] },
  { id: 'up', label: 'UP', symbol: '↑', keyBadge: '↑', keys: ['ArrowUp', 'w', 'W', '2'] },
  { id: 'down', label: 'DOWN', symbol: '↓', keyBadge: '↓', keys: ['ArrowDown', 's', 'S', '3'] },
  { id: 'right', label: 'RIGHT', symbol: '→', keyBadge: '→', keys: ['ArrowRight', 'd', 'D', '4'] }
];

// Color hex map lookup
const COLOR_HEX_MAP = {
  blue: '#3B82F6',
  green: '#10B981',
  yellow: '#FACC15',
  red: '#EF4444'
};

// ============================================================================
// 2. STRICT 5 PROGRESSIVE LEVELS SPECIFICATION
// ============================================================================
export const CHRONOREFLEX_LEVELS = [
  {
    level: 1,
    title: 'Word Match',
    mission: 'Tap the button that matches the word written on screen.',
    category: 'Word Recognition',
    timeWindow: 2800,
    targetCount: 10,
    mode: 'COLOR',
    targets: [
      { id: 1, mode: 'COLOR', word: 'BLUE', ink: 'blue', rule: 'WORD_MEANING', answer: 'blue' },
      { id: 2, mode: 'COLOR', word: 'GREEN', ink: 'green', rule: 'WORD_MEANING', answer: 'green' },
      { id: 3, mode: 'COLOR', word: 'YELLOW', ink: 'yellow', rule: 'WORD_MEANING', answer: 'yellow' },
      { id: 4, mode: 'COLOR', word: 'RED', ink: 'red', rule: 'WORD_MEANING', answer: 'red' },
      { id: 5, mode: 'COLOR', word: 'BLUE', ink: 'blue', rule: 'WORD_MEANING', answer: 'blue' },
      { id: 6, mode: 'COLOR', word: 'YELLOW', ink: 'yellow', rule: 'WORD_MEANING', answer: 'yellow' },
      { id: 7, mode: 'COLOR', word: 'GREEN', ink: 'green', rule: 'WORD_MEANING', answer: 'green' },
      { id: 8, mode: 'COLOR', word: 'RED', ink: 'red', rule: 'WORD_MEANING', answer: 'red' },
      { id: 9, mode: 'COLOR', word: 'BLUE', ink: 'blue', rule: 'WORD_MEANING', answer: 'blue' },
      { id: 10, mode: 'COLOR', word: 'GREEN', ink: 'green', rule: 'WORD_MEANING', answer: 'green' }
    ]
  },
  {
    level: 2,
    title: 'Color Focus',
    mission: 'Ignore the word! Tap the button that matches the font color.',
    category: 'Inhibitory Control',
    timeWindow: 2400,
    targetCount: 12,
    mode: 'COLOR',
    targets: [
      { id: 1, mode: 'COLOR', word: 'RED', ink: 'blue', rule: 'INK_COLOR', answer: 'blue' },
      { id: 2, mode: 'COLOR', word: 'BLUE', ink: 'yellow', rule: 'INK_COLOR', answer: 'yellow' },
      { id: 3, mode: 'COLOR', word: 'YELLOW', ink: 'green', rule: 'INK_COLOR', answer: 'green' },
      { id: 4, mode: 'COLOR', word: 'GREEN', ink: 'red', rule: 'INK_COLOR', answer: 'red' },
      { id: 5, mode: 'COLOR', word: 'RED', ink: 'yellow', rule: 'INK_COLOR', answer: 'yellow' },
      { id: 6, mode: 'COLOR', word: 'YELLOW', ink: 'blue', rule: 'INK_COLOR', answer: 'blue' },
      { id: 7, mode: 'COLOR', word: 'BLUE', ink: 'green', rule: 'INK_COLOR', answer: 'green' },
      { id: 8, mode: 'COLOR', word: 'GREEN', ink: 'yellow', rule: 'INK_COLOR', answer: 'yellow' },
      { id: 9, mode: 'COLOR', word: 'RED', ink: 'green', rule: 'INK_COLOR', answer: 'green' },
      { id: 10, mode: 'COLOR', word: 'YELLOW', ink: 'red', rule: 'INK_COLOR', answer: 'red' },
      { id: 11, mode: 'COLOR', word: 'GREEN', ink: 'blue', rule: 'INK_COLOR', answer: 'blue' },
      { id: 12, mode: 'COLOR', word: 'BLUE', ink: 'red', rule: 'INK_COLOR', answer: 'red' }
    ]
  },
  {
    level: 3,
    title: 'Rule Switcher',
    mission: 'Watch the top badge—it switches between matching the Word and matching the Font Color.',
    category: 'Cognitive Flexibility',
    timeWindow: 2000,
    targetCount: 14,
    mode: 'COLOR',
    targets: [
      // Block 1: INK_COLOR (0..3)
      { id: 1, mode: 'COLOR', word: 'YELLOW', ink: 'blue', rule: 'INK_COLOR', answer: 'blue' },
      { id: 2, mode: 'COLOR', word: 'BLUE', ink: 'green', rule: 'INK_COLOR', answer: 'green' },
      { id: 3, mode: 'COLOR', word: 'RED', ink: 'yellow', rule: 'INK_COLOR', answer: 'yellow' },
      { id: 4, mode: 'COLOR', word: 'GREEN', ink: 'red', rule: 'INK_COLOR', answer: 'red' },
      // Block 2: WORD_MEANING (4..6)
      { id: 5, mode: 'COLOR', word: 'RED', ink: 'blue', rule: 'WORD_MEANING', answer: 'red' },
      { id: 6, mode: 'COLOR', word: 'BLUE', ink: 'green', rule: 'WORD_MEANING', answer: 'blue' },
      { id: 7, mode: 'COLOR', word: 'YELLOW', ink: 'red', rule: 'WORD_MEANING', answer: 'yellow' },
      // Block 3: INK_COLOR (7..10)
      { id: 8, mode: 'COLOR', word: 'RED', ink: 'yellow', rule: 'INK_COLOR', answer: 'yellow' },
      { id: 9, mode: 'COLOR', word: 'BLUE', ink: 'green', rule: 'INK_COLOR', answer: 'green' },
      { id: 10, mode: 'COLOR', word: 'GREEN', ink: 'blue', rule: 'INK_COLOR', answer: 'blue' },
      { id: 11, mode: 'COLOR', word: 'YELLOW', ink: 'red', rule: 'INK_COLOR', answer: 'red' },
      // Block 4: WORD_MEANING (11..13)
      { id: 12, mode: 'COLOR', word: 'GREEN', ink: 'yellow', rule: 'WORD_MEANING', answer: 'green' },
      { id: 13, mode: 'COLOR', word: 'RED', ink: 'blue', rule: 'WORD_MEANING', answer: 'red' },
      { id: 14, mode: 'COLOR', word: 'BLUE', ink: 'green', rule: 'WORD_MEANING', answer: 'blue' }
    ]
  },
  {
    level: 4,
    title: 'Spatial Vector Conflict',
    mission: 'Watch the top badge—it switches between tapping the Arrow Direction and the Screen Side.',
    category: 'Spatial Focus (Simon Effect)',
    timeWindow: 1800,
    targetCount: 15,
    mode: 'DIRECTION',
    targets: [
      // Block 1: ARROW_DIRECTION (0..3)
      { id: 1, mode: 'DIRECTION', arrow: 'left', pos: 'right', rule: 'ARROW_DIRECTION', answer: 'left' },
      { id: 2, mode: 'DIRECTION', arrow: 'right', pos: 'left', rule: 'ARROW_DIRECTION', answer: 'right' },
      { id: 3, mode: 'DIRECTION', arrow: 'left', pos: 'left', rule: 'ARROW_DIRECTION', answer: 'left' },
      { id: 4, mode: 'DIRECTION', arrow: 'right', pos: 'right', rule: 'ARROW_DIRECTION', answer: 'right' },
      // Block 2: SCREEN_POSITION (4..7)
      { id: 5, mode: 'DIRECTION', arrow: 'right', pos: 'left', rule: 'SCREEN_POSITION', answer: 'left' },
      { id: 6, mode: 'DIRECTION', arrow: 'left', pos: 'right', rule: 'SCREEN_POSITION', answer: 'right' },
      { id: 7, mode: 'DIRECTION', arrow: 'right', pos: 'right', rule: 'SCREEN_POSITION', answer: 'right' },
      { id: 8, mode: 'DIRECTION', arrow: 'left', pos: 'left', rule: 'SCREEN_POSITION', answer: 'left' },
      // Block 3: ARROW_DIRECTION (8..11)
      { id: 9, mode: 'DIRECTION', arrow: 'right', pos: 'left', rule: 'ARROW_DIRECTION', answer: 'right' },
      { id: 10, mode: 'DIRECTION', arrow: 'left', pos: 'right', rule: 'ARROW_DIRECTION', answer: 'left' },
      { id: 11, mode: 'DIRECTION', arrow: 'right', pos: 'right', rule: 'ARROW_DIRECTION', answer: 'right' },
      { id: 12, mode: 'DIRECTION', arrow: 'left', pos: 'left', rule: 'ARROW_DIRECTION', answer: 'left' },
      // Block 4: SCREEN_POSITION (12..14)
      { id: 13, mode: 'DIRECTION', arrow: 'right', pos: 'left', rule: 'SCREEN_POSITION', answer: 'left' },
      { id: 14, mode: 'DIRECTION', arrow: 'left', pos: 'right', rule: 'SCREEN_POSITION', answer: 'right' },
      { id: 15, mode: 'DIRECTION', arrow: 'right', pos: 'left', rule: 'SCREEN_POSITION', answer: 'left' }
    ]
  },
  {
    level: 5,
    title: 'Neuro Overdrive',
    mission: 'Watch the top badge—it switches between matching the Word, Font Color, and Arrow Direction.',
    category: 'Rapid Inhibitory Control',
    timeWindow: 1500,
    targetCount: 18,
    mode: 'HYBRID',
    targets: [
      // 0..3: Color INK_COLOR
      { id: 1, mode: 'COLOR', word: 'YELLOW', ink: 'blue', rule: 'INK_COLOR', answer: 'blue' },
      { id: 2, mode: 'COLOR', word: 'BLUE', ink: 'red', rule: 'INK_COLOR', answer: 'red' },
      { id: 3, mode: 'COLOR', word: 'RED', ink: 'green', rule: 'INK_COLOR', answer: 'green' },
      { id: 4, mode: 'COLOR', word: 'GREEN', ink: 'yellow', rule: 'INK_COLOR', answer: 'yellow' },
      // 4..7: Horizontal Vector ARROW_DIRECTION
      { id: 5, mode: 'DIRECTION', arrow: 'left', pos: 'right', rule: 'ARROW_DIRECTION', answer: 'left' },
      { id: 6, mode: 'DIRECTION', arrow: 'right', pos: 'left', rule: 'ARROW_DIRECTION', answer: 'right' },
      { id: 7, mode: 'DIRECTION', arrow: 'left', pos: 'right', rule: 'ARROW_DIRECTION', answer: 'left' },
      { id: 8, mode: 'DIRECTION', arrow: 'right', pos: 'left', rule: 'ARROW_DIRECTION', answer: 'right' },
      // 8..12: Color WORD_MEANING
      { id: 9, mode: 'COLOR', word: 'BLUE', ink: 'yellow', rule: 'WORD_MEANING', answer: 'blue' },
      { id: 10, mode: 'COLOR', word: 'GREEN', ink: 'red', rule: 'WORD_MEANING', answer: 'green' },
      { id: 11, mode: 'COLOR', word: 'RED', ink: 'blue', rule: 'WORD_MEANING', answer: 'red' },
      { id: 12, mode: 'COLOR', word: 'YELLOW', ink: 'green', rule: 'WORD_MEANING', answer: 'yellow' },
      // 13..17: Horizontal Vector SCREEN_POSITION
      { id: 13, mode: 'DIRECTION', arrow: 'right', pos: 'left', rule: 'SCREEN_POSITION', answer: 'left' },
      { id: 14, mode: 'DIRECTION', arrow: 'left', pos: 'right', rule: 'SCREEN_POSITION', answer: 'right' },
      { id: 15, mode: 'DIRECTION', arrow: 'right', pos: 'left', rule: 'SCREEN_POSITION', answer: 'left' },
      { id: 16, mode: 'DIRECTION', arrow: 'left', pos: 'right', rule: 'SCREEN_POSITION', answer: 'right' },
      { id: 17, mode: 'DIRECTION', arrow: 'right', pos: 'left', rule: 'SCREEN_POSITION', answer: 'left' },
      { id: 18, mode: 'DIRECTION', arrow: 'left', pos: 'right', rule: 'SCREEN_POSITION', answer: 'right' }
    ]
  }
];

// Natural language instructions per level (inspired by Lumosity / Elevate)
export const getReflexInstruction = (level) => {
  switch (level) {
    case 1:
      return 'Tap the button that matches the word written on screen.';
    case 2:
      return 'Ignore the word! Tap the button that matches the font color.';
    case 3:
      return 'Watch the top badge—it switches between matching the Word and matching the Font Color.';
    case 4:
      return 'Watch the top badge—it switches between tapping the Arrow Direction and the Screen Side.';
    case 5:
      return 'Watch the top badge—it switches between matching the Word, Font Color, and Arrow Direction.';
    default:
      return 'Watch the top badge and react as fast as you can!';
  }
};

const TOTAL_LIVES = 5;

// ============================================================================
// 3. REACT INTERACTIVE ENGINE
// ============================================================================
export const ChronoReflex = ({ initialLevel = 1 }) => {
  const navigate = useNavigate();

  // Clamp level 1 to 5 & sequential level progression
  const { unlockedLevel, unlockNextLevel: triggerUnlockNext, isLevelUnlocked } = useGameProgression('chrono-reflex');
  const sanitizedLevel = Math.max(1, Math.min(5, Number(initialLevel) || 1));
  const initialAllowed = Math.min(sanitizedLevel, unlockedLevel);
  const [currentLevel, setCurrentLevel] = useState(initialAllowed);
  const [targetIndex, setTargetIndex] = useState(0);

  // Keep level clamped if unlockedLevel changes
  useEffect(() => {
    if (currentLevel > unlockedLevel) {
      setCurrentLevel(unlockedLevel);
    }
  }, [unlockedLevel, currentLevel]);

  // Phase state: 'BRIEFING' (Mandatory pre-level gate) | 'PLAYING'
  const [phase, setPhase] = useState('BRIEFING');

  // Single-source Monotonic Stimulus ID (strictly increments on every spawn)
  const [roundStep, setRoundStep] = useState(1);
  const roundStepRef = useRef(1);

  // Input Debounce & Lock Guard (0% chance of double clicks or post-answer timeout)
  const isLockedRef = useRef(false);

  // Status & Telemetry
  const [neuralShield, setNeuralShield] = useState(TOTAL_LIVES); // 5 lives
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctHits, setCorrectHits] = useState(0);

  // Timer Bar: 100% -> 0%
  const [timerPercent, setTimerPercent] = useState(100);

  // Visual feedback states
  const [feedbackState, setFeedbackState] = useState(null); // 'HIT' | 'MISS' | 'TIMEOUT'
  const [clickedPadId, setClickedPadId] = useState(null);
  const [reactionCallout, setReactionCallout] = useState(null); // { time: ms, id }
  const [isRulePulsing, setIsRulePulsing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Modals
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

  // Timing references
  const startTimeRef = useRef(Date.now());
  const timerRafRef = useRef(null);

  // Active level data
  const levelConfig = useMemo(() => {
    return CHRONOREFLEX_LEVELS.find((l) => l.level === currentLevel) || CHRONOREFLEX_LEVELS[0];
  }, [currentLevel]);

  // Current active target stimulus
  const currentTarget = useMemo(() => {
    return levelConfig.targets[targetIndex] || levelConfig.targets[0];
  }, [levelConfig, targetIndex]);

  // Track previous rule to trigger attention pulse on rule switches
  const prevRuleRef = useRef(currentTarget?.rule);

  // Active pad mode (COLOR vs DIRECTION)
  const activePadMode = currentTarget?.mode || 'COLOR';

  // Audio toggle
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    chronoReflexAudio.setMuted(next);
  };

  // Rule switch alert animation & sound
  useEffect(() => {
    if (phase === 'PLAYING' && prevRuleRef.current && prevRuleRef.current !== currentTarget.rule) {
      setIsRulePulsing(true);
      chronoReflexAudio.playRuleSwitch();
      const t = setTimeout(() => setIsRulePulsing(false), 550);
      return () => clearTimeout(t);
    }
    prevRuleRef.current = currentTarget.rule;
  }, [currentTarget.rule, phase]);

  // ==========================================================================
  // RESET LEVEL STATE (Always gates with BRIEFING phase)
  // ==========================================================================
  const resetLevelState = useCallback((lvlNum) => {
    if (timerRafRef.current) {
      cancelAnimationFrame(timerRafRef.current);
      timerRafRef.current = null;
    }
    setPhase('BRIEFING');
    roundStepRef.current += 1;
    setRoundStep(roundStepRef.current);
    isLockedRef.current = false;
    setTargetIndex(0);
    setNeuralShield(TOTAL_LIVES);
    setCombo(0);
    setMaxCombo(0);
    setReactionTimes([]);
    setTotalAttempts(0);
    setCorrectHits(0);
    setTimerPercent(100);
    setFeedbackState(null);
    setClickedPadId(null);
    setIsVictoryOpen(false);
    setIsGameOverOpen(false);
  }, []);

  // Synchronize if initialLevel prop changes
  useEffect(() => {
    const lvl = Math.max(1, Math.min(5, Number(initialLevel) || 1));
    if (lvl !== currentLevel) {
      setCurrentLevel(lvl);
      resetLevelState(lvl);
    }
  }, [initialLevel, currentLevel, resetLevelState]);

  // ==========================================================================
  // START MISSION HANDLER (Exits BRIEFING and begins gameplay timer)
  // ==========================================================================
  const handleStartMission = useCallback(() => {
    setPhase('PLAYING');
    startTimeRef.current = Date.now();
    roundStepRef.current += 1;
    setRoundStep(roundStepRef.current);
    isLockedRef.current = false;
    setTimerPercent(100);
    chronoReflexAudio.playRuleSwitch();
  }, []);

  // ==========================================================================
  // ADVANCE TO NEXT TARGET OR TRIGGER VICTORY
  // ==========================================================================
  const advanceTarget = useCallback(() => {
    if (timerRafRef.current) {
      cancelAnimationFrame(timerRafRef.current);
      timerRafRef.current = null;
    }

    if (targetIndex < levelConfig.targets.length - 1) {
      const nextIdx = targetIndex + 1;
      setTargetIndex(nextIdx);
      roundStepRef.current += 1;
      setRoundStep(roundStepRef.current);
      isLockedRef.current = false; // UNLOCKED for new stimulus!
      setFeedbackState(null);
      setClickedPadId(null);
      setTimerPercent(100);
      startTimeRef.current = Date.now();
    } else {
      // Completed all targets!
      chronoReflexAudio.playVictory();
      triggerUnlockNext(currentLevel);
      setIsVictoryOpen(true);
    }
  }, [targetIndex, levelConfig.targets.length, currentLevel, triggerUnlockNext]);

  // ==========================================================================
  // TIMEOUT HANDLER (Strict step-guarded)
  // ==========================================================================
  const handleTimeout = useCallback((stepAtTimeout) => {
    // If input was already locked, not playing, or step has changed, abort!
    if (phase !== 'PLAYING' || isLockedRef.current || roundStepRef.current !== stepAtTimeout) return;
    isLockedRef.current = true; // Lock immediately!

    if (timerRafRef.current) {
      cancelAnimationFrame(timerRafRef.current);
      timerRafRef.current = null;
    }

    setFeedbackState('TIMEOUT');
    setCombo(0);
    setTotalAttempts((prev) => prev + 1);
    chronoReflexAudio.playTimeout();

    setNeuralShield((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        setTimeout(() => setIsGameOverOpen(true), 350);
        return 0;
      }
      setTimeout(() => advanceTarget(), 420);
      return next;
    });
  }, [advanceTarget, phase]);

  // ==========================================================================
  // SINGLE-SOURCE RAF COUNTDOWN TIMER (Gated strictly to phase === 'PLAYING')
  // ==========================================================================
  useEffect(() => {
    if (phase !== 'PLAYING' || isVictoryOpen || isGameOverOpen || isPaused) return;

    const currentStep = roundStep;
    const duration = levelConfig.timeWindow;
    const startTime = Date.now();
    startTimeRef.current = startTime;

    const tick = () => {
      // Abort if step changed or input locked
      if (roundStepRef.current !== currentStep || isLockedRef.current) {
        return;
      }

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setTimerPercent(remaining);

      if (elapsed >= duration) {
        handleTimeout(currentStep);
      } else {
        timerRafRef.current = requestAnimationFrame(tick);
      }
    };

    timerRafRef.current = requestAnimationFrame(tick);

    return () => {
      if (timerRafRef.current) {
        cancelAnimationFrame(timerRafRef.current);
        timerRafRef.current = null;
      }
    };
  }, [phase, roundStep, currentLevel, levelConfig.timeWindow, isVictoryOpen, isGameOverOpen, isPaused, handleTimeout]);

  // ==========================================================================
  // HANDLE USER RESPONSE (Pad Click or Keypress)
  // ==========================================================================
  const handleAnswer = useCallback((responseId) => {
    if (phase !== 'PLAYING' || isLockedRef.current || isVictoryOpen || isGameOverOpen || isPaused) return;
    isLockedRef.current = true; // Lock immediately!

    // Clear timer immediately
    if (timerRafRef.current) {
      cancelAnimationFrame(timerRafRef.current);
      timerRafRef.current = null;
    }

    const reactionTime = Date.now() - startTimeRef.current;
    setReactionTimes((prev) => [...prev, reactionTime]);
    setTotalAttempts((prev) => prev + 1);
    setClickedPadId(responseId);

    const isCorrect = responseId === currentTarget.answer;

    if (isCorrect) {
      // HIT!
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setMaxCombo((prev) => Math.max(prev, nextCombo));
      setCorrectHits((prev) => prev + 1);
      setFeedbackState('HIT');
      chronoReflexAudio.playHit(nextCombo);

      // Real-time floating reaction callout badge (550ms fade)
      const calloutId = Date.now();
      setReactionCallout({ time: reactionTime, id: calloutId });
      setTimeout(() => {
        setReactionCallout((prev) => (prev?.id === calloutId ? null : prev));
      }, 550);

      setTimeout(() => advanceTarget(), 220); // Crisp 220ms hit flash
    } else {
      // MISS!
      setCombo(0);
      setFeedbackState('MISS');
      chronoReflexAudio.playError();

      setNeuralShield((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setTimeout(() => setIsGameOverOpen(true), 350);
          return 0;
        }
        setTimeout(() => advanceTarget(), 420); // 420ms error penalty
        return next;
      });
    }
  }, [currentTarget.answer, combo, isVictoryOpen, isGameOverOpen, advanceTarget, phase]);

  // ==========================================================================
  // KEYBOARD LISTENER (Handles Space/Enter in BRIEFING, Keys in PLAYING)
  // ==========================================================================
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isVictoryOpen || isGameOverOpen) return;

      // When in BRIEFING: Space or Enter starts the drill immediately
      if (phase === 'BRIEFING') {
        if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
          e.preventDefault();
          handleStartMission();
        }
        return;
      }

      if (isLockedRef.current) return;
      if (e.repeat) return;

      const activePads = activePadMode === 'COLOR' ? COLOR_PADS : DIRECTION_PADS;
      const matchedPad = activePads.find((p) => p.keys.includes(e.key));

      if (matchedPad) {
        e.preventDefault();
        handleAnswer(matchedPad.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, activePadMode, handleAnswer, handleStartMission, isVictoryOpen, isGameOverOpen]);

  // Level selector click
  const handleLevelSelect = (lvl) => {
    if (!isLevelUnlocked(lvl)) return;
    setCurrentLevel(lvl);
    resetLevelState(lvl);
    navigate(`/dashboard/adults/play/chrono-reflex?level=${lvl}`);
  };

  // Retry level
  const handleRetry = () => {
    resetLevelState(currentLevel);
  };

  // Quick retry after defeat
  const handleRetryDefeat = () => {
    resetLevelState(currentLevel);
    // Directly start without re-reading briefing if retrying after defeat
    setTimeout(() => {
      handleStartMission();
    }, 50);
  };

  // Next level navigation
  const handleNextLevel = () => {
    if (currentLevel < 5) {
      const nextLvl = currentLevel + 1;
      triggerUnlockNext(currentLevel);
      setCurrentLevel(nextLvl);
      resetLevelState(nextLvl);
      navigate(`/dashboard/adults/play/chrono-reflex?level=${nextLvl}`);
    } else {
      navigate('/dashboard/adults/games');
    }
  };

  // Telemetry computations
  const avgReactionTime = reactionTimes.length > 0 
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length) 
    : 0;
  const accuracy = totalAttempts > 0 
    ? Math.round((correctHits / totalAttempts) * 100) 
    : 100;

  // Rule banner visual metadata with high-contrast accent borders
  const ruleMeta = useMemo(() => {
    switch (currentTarget?.rule) {
      case 'INK_COLOR':
        return {
          icon: Palette,
          label: 'TAP INK COLOR',
          sub: 'Suppress word text; match the font ink pigment.',
          color: '#3B82F6',
          borderClass: styles.ruleBorderBlue
        };
      case 'WORD_MEANING':
        return {
          icon: FileText,
          label: 'TAP WORD MEANING',
          sub: 'Ignore font ink; match semantic text meaning.',
          color: '#FACC15',
          borderClass: styles.ruleBorderYellow
        };
      case 'ARROW_DIRECTION':
        return {
          icon: Compass,
          label: 'TAP ARROW DIRECTION',
          sub: 'Ignore screen position; react strictly to arrow direction.',
          color: '#10B981',
          borderClass: styles.ruleBorderEmerald
        };
      case 'SCREEN_POSITION':
        return {
          icon: MapPin,
          label: 'TAP SCREEN POSITION',
          sub: 'Ignore arrow direction; react strictly to screen zone location.',
          color: '#EC4899',
          borderClass: styles.ruleBorderPink
        };
      default:
        return {
          icon: Zap,
          label: 'CALIBRATE REFLEX',
          sub: 'React immediately to target stimulus.',
          color: '#3B82F6',
          borderClass: styles.ruleBorderBlue
        };
    }
  }, [currentTarget?.rule]);

  const RuleIcon = ruleMeta.icon;

  // Dynamic Streak Aura escalation (1-2x: Cyan, 3-5x: Emerald-Gold, 6x+: Electric Violet pulse)
  const getStreakAuraClass = () => {
    if (combo >= 6) return styles.auraVioletPulse;
    if (combo >= 3) return styles.auraEmeraldGold;
    if (combo >= 1) return styles.auraCyan;
    return '';
  };

  return (
    <div className={styles.reflexContainer}>
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
          {/* Reaction Speed Metric */}
          <div className={styles.telemetryBadge}>
            <Zap size={13} style={{ color: '#06B6D4' }} />
            <span>{avgReactionTime > 0 ? `${avgReactionTime} ms` : '-- ms'}</span>
          </div>

          {/* Combo Multiplier */}
          <div className={`${styles.telemetryBadge} ${combo >= 3 ? styles.comboActive : ''}`}>
            <Flame size={13} style={{ color: combo >= 3 ? '#F59E0B' : '#64748B' }} />
            <span>x{combo}</span>
          </div>

          {/* Neural Shield (5 Lives) */}
          <div className={styles.integrityPill}>
            <div className={styles.heartsGroup}>
              {Array.from({ length: TOTAL_LIVES }).map((_, idx) => {
                const h = idx + 1;
                return (
                  <Heart
                    key={h}
                    size={14}
                    fill={h <= neuralShield ? 'currentColor' : 'none'}
                    className={h <= neuralShield ? styles.heartFilled : styles.heartEmpty}
                  />
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleRetry}
            className={styles.iconBtn}
            title="Restart Level"
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

        <div className={styles.targetProgressBadge}>
          <Brain size={15} style={{ color: '#10B981' }} />
          <span>Target {targetIndex + 1} / {levelConfig.targetCount}</span>
        </div>
      </div>

      {/* ====================================================================
         3. DYNAMIC HIGH-CONTRAST RULE BANNER
         ==================================================================== */}
      <div className={`${styles.ruleBanner} ${isRulePulsing ? styles.ruleBannerPulse : ''}`}>
        <div className={`${styles.rulePill} ${ruleMeta.borderClass}`}>
          <RuleIcon size={16} />
          <span>{ruleMeta.label}</span>
        </div>
        <span className={styles.ruleSubText}>{ruleMeta.sub}</span>
      </div>

      {/* ====================================================================
         4. CENTRAL STIMULUS ARENA & DEPLETING COUNTDOWN
         ==================================================================== */}
      <div className={`${styles.stimulusStage} ${feedbackState === 'MISS' || feedbackState === 'TIMEOUT' ? styles.stageShake : ''} ${getStreakAuraClass()}`}>
        {/* Real-time floating reaction speed callout badge */}
        {reactionCallout && (
          <div key={reactionCallout.id} className={styles.reactionSpeedBadge}>
            ⚡ {reactionCallout.time}ms!
          </div>
        )}

        {/* Depleting Timer Bar */}
        <div className={styles.timerTrack}>
          <div
            className={styles.timerFill}
            style={{
              width: `${timerPercent}%`,
              background: timerPercent > 50 
                ? 'linear-gradient(90deg, #06B6D4, #10B981)' 
                : timerPercent > 25 
                ? 'linear-gradient(90deg, #F59E0B, #EAB308)' 
                : 'linear-gradient(90deg, #EF4444, #DC2626)'
            }}
          />
        </div>

        {/* Central Card: Color Stroop Word OR Horizontal Vector Track */}
        <div className={styles.stimulusCard}>
          {activePadMode === 'COLOR' ? (
            // Color Stroop Word Display
            <div
              className={styles.stroopWord}
              style={{
                color: COLOR_HEX_MAP[currentTarget.ink] || '#FFFFFF',
                textShadow: `0 0 28px ${COLOR_HEX_MAP[currentTarget.ink] || '#06B6D4'}90`
              }}
            >
              {currentTarget.word}
            </div>
          ) : (
            // Horizontal Vector Track: [ LEFT ZONE ]  |  [ RIGHT ZONE ]
            <div className={styles.vectorTrack}>
              {/* LEFT ZONE */}
              <div className={`${styles.zoneHalf} ${currentTarget.pos === 'left' ? styles.zoneActive : styles.zoneInactive}`}>
                <div className={styles.zoneTag}>[ LEFT ZONE ]</div>
                {currentTarget.pos === 'left' && (
                  <div className={styles.vectorArrow}>
                    {currentTarget.arrow === 'left' ? '←' : '→'}
                  </div>
                )}
              </div>

              {/* DIVIDER */}
              <div className={styles.zoneDivider} />

              {/* RIGHT ZONE */}
              <div className={`${styles.zoneHalf} ${currentTarget.pos === 'right' ? styles.zoneActive : styles.zoneInactive}`}>
                <div className={styles.zoneTag}>[ RIGHT ZONE ]</div>
                {currentTarget.pos === 'right' && (
                  <div className={styles.vectorArrow}>
                    {currentTarget.arrow === 'left' ? '←' : '→'}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Feedback Hit/Miss Flash Overlay */}
          {feedbackState === 'HIT' && (
            <div className={styles.feedbackHit}>
              <CheckCircle2 size={32} />
              <span>PERFECT HIT</span>
            </div>
          )}

          {feedbackState === 'MISS' && (
            <div className={styles.feedbackMiss}>
              <AlertTriangle size={32} />
              <span>INTERFERENCE ERROR</span>
            </div>
          )}

          {feedbackState === 'TIMEOUT' && (
            <div className={styles.feedbackTimeout}>
              <ShieldAlert size={32} />
              <span>LATENCY EXCEEDED</span>
            </div>
          )}
        </div>
      </div>

      {/* ====================================================================
         5. 4 TACTILE NEON RESPONSE PADS WITH CLEAR KEYBIND BADGES
         ==================================================================== */}
      <div className={styles.padsContainer}>
        {activePadMode === 'COLOR' ? (
          // COLOR PADS
          COLOR_PADS.map((pad) => {
            const isSelected = clickedPadId === pad.id;
            return (
              <button
                key={pad.id}
                type="button"
                onClick={() => handleAnswer(pad.id)}
                className={`
                  ${styles.responsePad} 
                  ${styles['padColor_' + pad.id]}
                  ${isSelected && feedbackState === 'HIT' ? styles.padHit : ''}
                  ${isSelected && feedbackState === 'MISS' ? styles.padMiss : ''}
                `}
                style={{
                  '--pad-color': pad.hex,
                  '--pad-glow': `${pad.hex}50`
                }}
              >
                <div className={styles.padHeader}>
                  <div className={styles.padColorDot} style={{ background: pad.hex }} />
                  <span className={styles.keyBadge}>[{pad.keyBadge}]</span>
                </div>
                <span className={styles.padLabel}>{pad.label}</span>
              </button>
            );
          })
        ) : (
          // DIRECTIONAL PADS
          DIRECTION_PADS.map((pad) => {
            const isSelected = clickedPadId === pad.id;
            return (
              <button
                key={pad.id}
                type="button"
                onClick={() => handleAnswer(pad.id)}
                className={`
                  ${styles.responsePad} 
                  ${styles.padDirection}
                  ${isSelected && feedbackState === 'HIT' ? styles.padHit : ''}
                  ${isSelected && feedbackState === 'MISS' ? styles.padMiss : ''}
                `}
              >
                <div className={styles.padHeader}>
                  <span className={styles.padSymbol}>{pad.symbol}</span>
                  <span className={styles.keyBadge}>[{pad.keyBadge}]</span>
                </div>
                <span className={styles.padLabel}>{pad.label}</span>
              </button>
            );
          })
        )}
      </div>

      {/* Controls Hint Strip */}
      <footer className={styles.controlsFooter}>
        <span>⌨️ Keyboard bound: Tap <strong>[1, 2, 3, 4]</strong>, <strong>[A, S, D, F]</strong> or <strong>[Arrow Keys]</strong></span>
      </footer>

      {/* ====================================================================
         6. PRE-LEVEL MISSION BRIEFING OVERLAY (Mandatory Start Gate)
         ==================================================================== */}
      {phase === 'BRIEFING' && (
        <div className={styles.briefingOverlay}>
          <div className={styles.briefingCard}>
            <div className={styles.briefingHeader}>
              <div className={styles.briefingIconCircle} style={{ color: ruleMeta.color, borderColor: ruleMeta.color }}>
                <RuleIcon size={26} />
              </div>
              <div>
                <span className={styles.briefingBadge}>HOW TO PLAY • LEVEL {currentLevel}</span>
                <h3 className={styles.briefingTitle}>{levelConfig.title}</h3>
              </div>
            </div>

            {/* Natural, Human Instruction */}
            <p className={styles.briefingInstruction}>
              {getReflexInstruction(currentLevel)}
            </p>

            {/* Visual Color Reference Key */}
            <div className={styles.colorLegendStrip}>
              <span className={styles.colorLegendTitle}>COLOR REFERENCE KEY</span>
              <div className={styles.colorLegendSwatches}>
                <div className={styles.colorLegendItem}>
                  <span className={styles.colorLegendDot} style={{ background: '#3B82F6', boxShadow: '0 0 10px #3B82F6' }} />
                  <span className={styles.colorLegendName} style={{ color: '#60A5FA' }}>BLUE</span>
                </div>
                <div className={styles.colorLegendItem}>
                  <span className={styles.colorLegendDot} style={{ background: '#10B981', boxShadow: '0 0 10px #10B981' }} />
                  <span className={styles.colorLegendName} style={{ color: '#34D399' }}>GREEN</span>
                </div>
                <div className={styles.colorLegendItem}>
                  <span className={styles.colorLegendDot} style={{ background: '#FACC15', boxShadow: '0 0 10px #FACC15' }} />
                  <span className={styles.colorLegendName} style={{ color: '#FDE047' }}>YELLOW</span>
                </div>
                <div className={styles.colorLegendItem}>
                  <span className={styles.colorLegendDot} style={{ background: '#EF4444', boxShadow: '0 0 10px #EF4444' }} />
                  <span className={styles.colorLegendName} style={{ color: '#F87171' }}>RED</span>
                </div>
              </div>
            </div>

            {/* Live Visual "How It Works" Preview */}
            <div className={styles.howItWorksCard}>
              <div className={styles.howItWorksHeader}>HOW IT WORKS</div>
              {levelConfig.mode !== 'DIRECTION' ? (
                <div className={styles.howItWorksRow}>
                  {/* Sample Stimulus: Word YELLOW in Blue font */}
                  <div className={styles.previewStimulusBox}>
                    <span className={styles.previewWord} style={{ color: '#3B82F6' }}>
                      {currentLevel === 1 ? 'BLUE' : 'YELLOW'}
                    </span>
                    <span className={styles.previewSubtext}>
                      {currentLevel === 1 ? 'Word matches Blue' : 'Word is Yellow • Font is Blue'}
                    </span>
                  </div>

                  <div className={styles.previewArrow}>→</div>

                  {/* Highlighted Blue Button */}
                  <div className={styles.previewPadBox}>
                    <div className={styles.previewButtonBlue}>
                      <div className={styles.padColorDot} style={{ background: '#3B82F6' }} />
                      <span className={styles.previewButtonLabel}>BLUE</span>
                      <span className={styles.keyBadge}>[1]</span>
                    </div>
                    <div className={styles.previewCorrectBadge}>
                      <CheckCircle2 size={13} style={{ color: '#10B981' }} />
                      <span>{currentLevel === 1 ? '✓ Tap Matching Word' : '✓ Tap Font Color'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.howItWorksRow}>
                  {/* Directional Stimulus Box */}
                  <div className={styles.previewStimulusBox}>
                    <span className={styles.previewZoneTag}>[ LEFT ZONE ]</span>
                    <span className={styles.previewArrowGlyph}>→</span>
                    <span className={styles.previewSubtext}>Arrow: Right • Screen: Left</span>
                  </div>

                  <div className={styles.previewArrow}>→</div>

                  {/* Highlighted Direction Button */}
                  <div className={styles.previewPadBox}>
                    <div className={styles.previewButtonHighlight}>
                      <span className={styles.padSymbol}>→</span>
                      <span className={styles.previewButtonLabel}>RIGHT</span>
                      <span className={styles.keyBadge}>[→]</span>
                    </div>
                    <div className={styles.previewCorrectBadge}>
                      <CheckCircle2 size={13} style={{ color: '#10B981' }} />
                      <span>✓ Tap Arrow Dir</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Clean Pill: 12 Targets • 5 Lives */}
            <div className={styles.briefingPillContainer}>
              <div className={styles.briefingPill}>
                <span>{levelConfig.targetCount} Targets</span>
                <span className={styles.pillDot}>•</span>
                <span>{TOTAL_LIVES} Lives</span>
              </div>
            </div>

            {/* Launch CTA */}
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
              ⚡
            </div>

            <h3 className={styles.victoryTitle}>Chrono-Reflex Calibrated!</h3>
            <p className={styles.victorySubtitle}>
              Executive inhibitory control and neural reaction velocity calibrated with precision.
            </p>

            <div className={styles.metricsRow}>
              <div className={styles.metricBadge}>
                <div className={styles.metricValue}>{avgReactionTime} ms</div>
                <div className={styles.metricLabel}>Avg Speed</div>
              </div>
              <div className={styles.metricBadge}>
                <div className={styles.metricValue}>{accuracy}%</div>
                <div className={styles.metricLabel}>Accuracy</div>
              </div>
              <div className={styles.metricBadge}>
                <div className={styles.metricValue}>x{maxCombo}</div>
                <div className={styles.metricLabel}>Max Streak</div>
              </div>
            </div>

            <div className={styles.xpBadge}>
              <Sparkles size={16} />
              <span>+150 Neuro XP Earned!</span>
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={handleRetry}
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
         8. DEFEAT MODAL OVERLAY
         ==================================================================== */}
      {isGameOverOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.victoryModal} style={{ borderColor: 'rgba(239, 68, 68, 0.5)' }}>
            <div className={styles.trophyCircle} style={{ borderColor: '#EF4444', background: 'rgba(239, 68, 68, 0.2)' }}>
              ⚠️
            </div>

            <h3 className={styles.victoryTitle}>Neural Shields Depleted</h3>
            <p className={styles.victorySubtitle}>
              Reaction latency exceeded tolerance or cognitive interference caused misfires. Reset your focus and try again.
            </p>

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={handleRetryDefeat}
                className={styles.nextLevelBtn}
                style={{ background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)', flex: 1 }}
              >
                <span>↺ Recalibrate & Retry</span>
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
          handleRetry();
        }}
        onExit={() => navigate('/dashboard/adults')}
        gameTitle="ChronoReflex: Inhibitory Control"
        level={currentLevel}
        zonePath="/dashboard/adults"
      />
    </div>
  );
};

export default ChronoReflex;
