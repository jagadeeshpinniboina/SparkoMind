import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGameProgression, unlockNextLevel } from '../../../../../utils/gameProgression.js';
import GamePauseOverlay from '../../../../../components/GamePauseOverlay';
import styles from './TimberUnbolt.module.css';
import timberUnboltAudio from './TimberUnboltAudio';

/**
 * 5 Mathematically Verified 3D TimberUnbolt Levels
 * Built with realistic overlapping timber layers, dedicated open board sockets,
 * single-screw pendulum dangling physics, and natural gravity falls.
 */
export const TIMBERUNBOLT_LEVELS = [
  {
    level: 1,
    title: 'Gentle Release',
    subtitle: 'Introductory 2-Plank Unbolting',
    all_holes: [
      { id: 'h1', x: 250, y: 190, label: 'Header Left' },
      { id: 'h2', x: 450, y: 190, label: 'Overlap Joint' },
      { id: 'h3', x: 450, y: 340, label: 'Column Base' },
      { id: 'e1', x: 350, y: 75, label: 'Open Top' },
      { id: 'e2', x: 180, y: 340, label: 'Open Bottom' }
    ],
    initial_screws: ['h1', 'h2', 'h3'],
    planks: [
      {
        id: 'p1',
        name: 'Warm Teak Header',
        color: 'teak',
        pin_holes: ['h1', 'h2'],
        covers: [],
        x1: 200,
        y1: 190,
        x2: 500,
        y2: 190,
        zIndex: 2,
        dropTilt: 16
      },
      {
        id: 'p2',
        name: 'Emerald Ash Column',
        color: 'emerald',
        pin_holes: ['h2', 'h3'],
        covers: [],
        x1: 450,
        y1: 190,
        x2: 450,
        y2: 375,
        zIndex: 1,
        dropTilt: -14
      }
    ]
  },
  {
    level: 2,
    title: 'Crossed Beams',
    subtitle: 'Pendulum Swing Uncovers Hidden Sockets',
    all_holes: [
      { id: 'h1', x: 230, y: 170, label: 'Left Joint' },
      { id: 'h2', x: 470, y: 170, label: 'Right Joint' },
      { id: 'h3', x: 230, y: 330, label: 'Left Base' },
      { id: 'h4', x: 470, y: 330, label: 'Right Base' },
      { id: 'h_hid', x: 350, y: 170, label: 'Hidden Center' },
      { id: 'e1', x: 350, y: 75, label: 'Open Top' },
      { id: 'e2', x: 110, y: 250, label: 'Open Left' }
    ],
    initial_screws: ['h1', 'h2', 'h3', 'h4'],
    planks: [
      {
        id: 'p1',
        name: 'Amber Oak Crossbar',
        color: 'amber',
        pin_holes: ['h1', 'h2'],
        covers: ['h_hid'],
        x1: 175,
        y1: 170,
        x2: 525,
        y2: 170,
        zIndex: 2,
        dropTilt: 18
      },
      {
        id: 'p2',
        name: 'Teak Left Post',
        color: 'teak',
        pin_holes: ['h1', 'h3'],
        covers: [],
        x1: 230,
        y1: 170,
        x2: 230,
        y2: 370,
        zIndex: 1,
        dropTilt: -16
      },
      {
        id: 'p3',
        name: 'Emerald Right Post',
        color: 'emerald',
        pin_holes: ['h2', 'h4'],
        covers: [],
        x1: 470,
        y1: 170,
        x2: 470,
        y2: 370,
        zIndex: 1,
        dropTilt: 15
      }
    ]
  },
  {
    level: 3,
    title: 'Garden Gate',
    subtitle: 'Layered Frame & Diagonal Brace',
    all_holes: [
      { id: 'h1', x: 220, y: 160, label: 'Top Left' },
      { id: 'h2', x: 480, y: 160, label: 'Top Right' },
      { id: 'h3', x: 220, y: 340, label: 'Bottom Left' },
      { id: 'h4', x: 480, y: 340, label: 'Bottom Right' },
      { id: 'h5', x: 350, y: 250, label: 'Center Hub' },
      { id: 'e1', x: 350, y: 75, label: 'Open Top' },
      { id: 'e2', x: 105, y: 250, label: 'Open Left' },
      { id: 'e3', x: 595, y: 250, label: 'Open Right' }
    ],
    initial_screws: ['h1', 'h2', 'h3', 'h4', 'h5'],
    planks: [
      {
        id: 'p1',
        name: 'Cedar Top Arch',
        color: 'cedar',
        pin_holes: ['h1', 'h2'],
        covers: [],
        x1: 165,
        y1: 160,
        x2: 535,
        y2: 160,
        zIndex: 3,
        dropTilt: 18
      },
      {
        id: 'p2',
        name: 'Amber Diagonal Brace',
        color: 'amber',
        pin_holes: ['h5', 'h4'],
        covers: [],
        x1: 350,
        y1: 250,
        x2: 480,
        y2: 340,
        zIndex: 2,
        dropTilt: -20
      },
      {
        id: 'p3',
        name: 'Teak Left Post',
        color: 'teak',
        pin_holes: ['h1', 'h3'],
        covers: [],
        x1: 220,
        y1: 160,
        x2: 220,
        y2: 380,
        zIndex: 1,
        dropTilt: -15
      },
      {
        id: 'p4',
        name: 'Emerald Right Post',
        color: 'emerald',
        pin_holes: ['h2', 'h4'],
        covers: [],
        x1: 480,
        y1: 160,
        x2: 480,
        y2: 380,
        zIndex: 1,
        dropTilt: 15
      }
    ]
  },
  {
    level: 4,
    title: 'Artisan Frame',
    subtitle: 'Diagonal & Orthogonal Interlocking Joinery',
    all_holes: [
      { id: 'h1', x: 200, y: 150, label: 'Left Top' },
      { id: 'h2', x: 350, y: 150, label: 'Center Top' },
      { id: 'h3', x: 500, y: 150, label: 'Right Top' },
      { id: 'h4', x: 200, y: 330, label: 'Left Base' },
      { id: 'h5', x: 350, y: 330, label: 'Center Base' },
      { id: 'h6', x: 500, y: 330, label: 'Right Base' },
      { id: 'e1', x: 350, y: 70, label: 'Open Crown' },
      { id: 'e2', x: 95, y: 240, label: 'Open West' },
      { id: 'e3', x: 605, y: 240, label: 'Open East' }
    ],
    initial_screws: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    planks: [
      {
        id: 'p1',
        name: 'Amber Top Rail',
        color: 'amber',
        pin_holes: ['h1', 'h2'],
        covers: [],
        x1: 155,
        y1: 150,
        x2: 395,
        y2: 150,
        zIndex: 3,
        dropTilt: 16
      },
      {
        id: 'p2',
        name: 'Cedar Right Arch',
        color: 'cedar',
        pin_holes: ['h2', 'h3'],
        covers: [],
        x1: 305,
        y1: 150,
        x2: 545,
        y2: 150,
        zIndex: 3,
        dropTilt: -16
      },
      {
        id: 'p3',
        name: 'Teak Left Column',
        color: 'teak',
        pin_holes: ['h1', 'h4'],
        covers: [],
        x1: 200,
        y1: 150,
        x2: 200,
        y2: 370,
        zIndex: 2,
        dropTilt: -14
      },
      {
        id: 'p4',
        name: 'Emerald Center Strut',
        color: 'emerald',
        pin_holes: ['h2', 'h5'],
        covers: [],
        x1: 350,
        y1: 150,
        x2: 350,
        y2: 370,
        zIndex: 2,
        dropTilt: 12
      },
      {
        id: 'p5',
        name: 'Teal Right Column',
        color: 'teal',
        pin_holes: ['h3', 'h6'],
        covers: [],
        x1: 500,
        y1: 150,
        x2: 500,
        y2: 370,
        zIndex: 2,
        dropTilt: 14
      }
    ]
  },
  {
    level: 5,
    title: 'Master Joinery',
    subtitle: 'Grand Multi-Tier Joinery Cascade',
    all_holes: [
      { id: 'h1', x: 200, y: 140, label: 'Crown Left' },
      { id: 'h2', x: 350, y: 140, label: 'Crown Apex' },
      { id: 'h3', x: 500, y: 140, label: 'Crown Right' },
      { id: 'h4', x: 200, y: 280, label: 'Pillar Mid Left' },
      { id: 'h5', x: 500, y: 280, label: 'Pillar Mid Right' },
      { id: 'h6', x: 275, y: 360, label: 'Base Left' },
      { id: 'h7', x: 425, y: 360, label: 'Base Right' },
      { id: 'e1', x: 350, y: 65, label: 'Open Top Crown' },
      { id: 'e2', x: 95, y: 240, label: 'Open West Margin' },
      { id: 'e3', x: 605, y: 240, label: 'Open East Margin' }
    ],
    initial_screws: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7'],
    planks: [
      {
        id: 'p1',
        name: 'Crown Left Arch',
        color: 'amber',
        pin_holes: ['h1', 'h2'],
        covers: [],
        x1: 155,
        y1: 140,
        x2: 395,
        y2: 140,
        zIndex: 4,
        dropTilt: 18
      },
      {
        id: 'p2',
        name: 'Crown Right Arch',
        color: 'cedar',
        pin_holes: ['h2', 'h3'],
        covers: [],
        x1: 305,
        y1: 140,
        x2: 545,
        y2: 140,
        zIndex: 4,
        dropTilt: -18
      },
      {
        id: 'p3',
        name: 'Teak Left Pillar',
        color: 'teak',
        pin_holes: ['h1', 'h4'],
        covers: [],
        x1: 200,
        y1: 140,
        x2: 200,
        y2: 315,
        zIndex: 3,
        dropTilt: -15
      },
      {
        id: 'p4',
        name: 'Teal Right Pillar',
        color: 'teal',
        pin_holes: ['h3', 'h5'],
        covers: [],
        x1: 500,
        y1: 140,
        x2: 500,
        y2: 315,
        zIndex: 3,
        dropTilt: 15
      },
      {
        id: 'p5',
        name: 'Emerald Left Base',
        color: 'emerald',
        pin_holes: ['h4', 'h6'],
        covers: [],
        x1: 200,
        y1: 280,
        x2: 275,
        y2: 360,
        zIndex: 2,
        dropTilt: -12
      },
      {
        id: 'p6',
        name: 'Amber Right Base',
        color: 'amber',
        pin_holes: ['h5', 'h7'],
        covers: [],
        x1: 500,
        y1: 280,
        x2: 425,
        y2: 360,
        zIndex: 2,
        dropTilt: 12
      }
    ]
  }
];

// Rich 3D Hardwood Palette
const PLANK_COLOR_MAP = {
  teak: {
    gradStart: '#9D5E2E',
    gradMid: '#7A421D',
    gradEnd: '#552C12',
    bevelLight: 'rgba(254, 215, 170, 0.45)',
    bevelDark: 'rgba(40, 18, 7, 0.75)',
    stroke: '#D97706',
    grain: '#3D1C0A'
  },
  emerald: {
    gradStart: '#236551',
    gradMid: '#164536',
    gradEnd: '#0D2D23',
    bevelLight: 'rgba(167, 243, 208, 0.45)',
    bevelDark: 'rgba(5, 23, 17, 0.75)',
    stroke: '#10B981',
    grain: '#071F17'
  },
  amber: {
    gradStart: '#D28E33',
    gradMid: '#A76A20',
    gradEnd: '#784611',
    bevelLight: 'rgba(253, 230, 138, 0.45)',
    bevelDark: 'rgba(58, 31, 6, 0.75)',
    stroke: '#F59E0B',
    grain: '#532D08'
  },
  cedar: {
    gradStart: '#A8443D',
    gradMid: '#7B2E29',
    gradEnd: '#531B17',
    bevelLight: 'rgba(254, 202, 202, 0.45)',
    bevelDark: 'rgba(43, 12, 10, 0.75)',
    stroke: '#EF4444',
    grain: '#380E0B'
  },
  teal: {
    gradStart: '#25727D',
    gradMid: '#184D55',
    gradEnd: '#0F3339',
    bevelLight: 'rgba(186, 230, 253, 0.45)',
    bevelDark: 'rgba(8, 28, 32, 0.75)',
    stroke: '#06B6D4',
    grain: '#08252A'
  }
};

/**
 * Calculate natural pendulum swing angle around remaining pivot screw
 */
function calculatePendulumDangle(plank, pivotHole, allHoles) {
  // Find other pin hole(s)
  const otherHoleId = plank.pin_holes.find((hId) => hId !== pivotHole.id);
  const otherHole = allHoles.find((h) => h.id === otherHoleId);

  if (!otherHole) return 0;

  const dx = otherHole.x - pivotHole.x;
  const dy = otherHole.y - pivotHole.y;

  const angleRad = Math.atan2(dy, dx);
  const angleDeg = (angleRad * 180) / Math.PI;

  // Natural equilibrium pulls the other end straight down (90 deg)
  let delta = 90 - angleDeg;
  while (delta > 180) delta -= 360;
  while (delta < -180) delta += 360;

  // Clamped with spring damping for dignified senior visual comfort
  const clamped = Math.max(-42, Math.min(42, delta * 0.68));
  return Math.round(clamped);
}

/**
 * BFS Solver for dynamic, real-time optimal hint calculation
 */
function findShortestSolution(currentScrews, activePlanks, allHoleIds) {
  const getDropped = (sc, pl) => pl.filter((p) => p.pin_holes.some((h) => sc.has(h)));
  const surviving = getDropped(currentScrews, activePlanks);

  if (surviving.length === 0) return [];

  const stateKey = (sc, pl) => Array.from(sc).sort().join(',') + '|' + pl.map((p) => p.id).sort().join(',');

  const queue = [{ screws: currentScrews, active: surviving, path: [] }];
  const visited = new Set([stateKey(currentScrews, surviving)]);

  while (queue.length > 0) {
    const { screws, active, path } = queue.shift();

    if (active.length === 0) {
      return path;
    }

    const blocked = new Set();
    active.forEach((p) => {
      (p.covers || []).forEach((ch) => blocked.add(ch));
    });

    const availableDests = allHoleIds.filter((h) => !screws.has(h) && !blocked.has(h));

    for (const s of screws) {
      for (const d of availableDests) {
        const nextScrews = new Set(screws);
        nextScrews.delete(s);
        nextScrews.add(d);

        const nextActive = getDropped(nextScrews, active);
        const key = stateKey(nextScrews, nextActive);

        if (!visited.has(key)) {
          visited.add(key);
          const nextPath = [...path, { from: s, to: d }];
          if (nextActive.length === 0) {
            return nextPath;
          }
          queue.push({ screws: nextScrews, active: nextActive, path: nextPath });
        }
      }
    }
  }

  return null;
}

export const TimberUnbolt = ({ initialLevel = 1, onBack }) => {
  const navigate = useNavigate();
  const { unlockedLevel, unlockNextLevel: triggerUnlockNext, isLevelUnlocked } = useGameProgression('timber-unbolt');
  const safeInitial = Math.max(1, Math.min(Number(initialLevel) || 1, 5));
  const [levelNumber, setLevelNumber] = useState(Math.min(safeInitial, unlockedLevel));
  const [phase, setPhase] = useState('BRIEFING'); // 'BRIEFING' | 'PLAYING' | 'VICTORY'
  const [screws, setScrews] = useState(new Set());
  const [selectedScrew, setSelectedScrew] = useState(null); // hole ID
  const [fallenPlankIds, setFallenPlankIds] = useState(new Set());
  const [moveHistory, setMoveHistory] = useState([]);
  const [blockedPlankId, setBlockedPlankId] = useState(null);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [activeHint, setActiveHint] = useState(null); // { from: holeId, to: holeId }
  const [isMuted, setIsMuted] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
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

  // Active level config
  const currentLevelConfig = useMemo(() => {
    return TIMBERUNBOLT_LEVELS.find((l) => l.level === levelNumber) || TIMBERUNBOLT_LEVELS[0];
  }, [levelNumber]);

  const allHoleIds = useMemo(() => {
    return currentLevelConfig.all_holes.map((h) => h.id);
  }, [currentLevelConfig]);

  // Synchronized refs to eliminate closure staleness
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const screwsRef = useRef(screws);
  screwsRef.current = screws;

  const fallenPlanksRef = useRef(fallenPlankIds);
  fallenPlanksRef.current = fallenPlankIds;

  // Sync mute state
  useEffect(() => {
    timberUnboltAudio.setMuted(isMuted);
  }, [isMuted]);

  // Load level
  const loadLevel = useCallback((lvlNum) => {
    if (!isLevelUnlocked(lvlNum)) return;
    const targetLvl = TIMBERUNBOLT_LEVELS.find((l) => l.level === lvlNum) || TIMBERUNBOLT_LEVELS[0];
    setLevelNumber(lvlNum);
    setScrews(new Set(targetLvl.initial_screws));
    setSelectedScrew(null);
    setFallenPlankIds(new Set());
    setMoveHistory([]);
    setBlockedPlankId(null);
    setHintsRemaining(3);
    setActiveHint(null);
    setToastMessage('');
    phaseRef.current = 'BRIEFING';
    setPhase('BRIEFING');
  }, [isLevelUnlocked]);

  // Initialize on mount or level change
  useEffect(() => {
    setScrews(new Set(currentLevelConfig.initial_screws));
    setSelectedScrew(null);
    setFallenPlankIds(new Set());
    setMoveHistory([]);
    setBlockedPlankId(null);
    setActiveHint(null);
  }, [currentLevelConfig]);

  // Check if a hole is currently blocked by an unfallen plank
  const getCoveringPlank = useCallback(
    (holeId) => {
      const activePlanks = currentLevelConfig.planks.filter((p) => !fallenPlanksRef.current.has(p.id));
      return activePlanks.find((p) => (p.covers || []).includes(holeId));
    },
    [currentLevelConfig]
  );

  // Tap a Screw to lift or deselect
  const handleScrewClick = useCallback(
    (holeId) => {
      if (phaseRef.current !== 'PLAYING' || isPaused) return;

      if (selectedScrew === holeId) {
        // Deselect
        setSelectedScrew(null);
        timberUnboltAudio.playScrewPlace();
      } else {
        // Lift screw (triggers 270deg spin & lift audio)
        setSelectedScrew(holeId);
        timberUnboltAudio.playScrewLift();
      }
    },
    [selectedScrew, isPaused]
  );

  // Tap an Empty Socket to place the lifted screw
  const handleSocketClick = useCallback(
    (holeId) => {
      if (phaseRef.current !== 'PLAYING' || isPaused) return;
      if (!selectedScrew) return; // No screw currently lifted

      // 1. Check if socket already has a screw
      if (screwsRef.current.has(holeId)) return;

      // 2. Check if socket is covered by an unfallen plank
      const coveringPlank = getCoveringPlank(holeId);
      if (coveringPlank) {
        timberUnboltAudio.playPlankBlocked();
        setBlockedPlankId(coveringPlank.id);
        setToastMessage(`Socket covered by ${coveringPlank.name}`);
        setTimeout(() => setBlockedPlankId(null), 500);
        setTimeout(() => setToastMessage(''), 2200);
        return;
      }

      // 3. Valid Move: Transfer screw
      const prevScrews = new Set(screwsRef.current);
      const prevFallen = new Set(fallenPlanksRef.current);

      setMoveHistory((prev) => [...prev, { screws: prevScrews, fallenPlanks: prevFallen }]);

      const nextScrews = new Set(prevScrews);
      nextScrews.delete(selectedScrew);
      nextScrews.add(holeId);

      screwsRef.current = nextScrews;
      setScrews(nextScrews);
      setSelectedScrew(null);
      setActiveHint(null);
      timberUnboltAudio.playScrewPlace();

      // 4. Check for newly dropped or dangling planks
      const activePlanks = currentLevelConfig.planks.filter((p) => !prevFallen.has(p.id));
      const newlyDropped = [];
      let hadPendulumSwing = false;

      activePlanks.forEach((plank) => {
        const remainingScrewsCount = plank.pin_holes.filter((h) => nextScrews.has(h)).length;
        if (remainingScrewsCount === 0) {
          newlyDropped.push(plank.id);
        } else if (remainingScrewsCount === 1) {
          hadPendulumSwing = true;
        }
      });

      if (newlyDropped.length > 0) {
        timberUnboltAudio.playPlankDrop();
        const updatedFallen = new Set(prevFallen);
        newlyDropped.forEach((id) => updatedFallen.add(id));
        fallenPlanksRef.current = updatedFallen;
        setFallenPlankIds(updatedFallen);

        // Check Victory
        if (updatedFallen.size === currentLevelConfig.planks.length) {
          triggerUnlockNext(levelNumber);
          setTimeout(() => {
            phaseRef.current = 'VICTORY';
            setPhase('VICTORY');
            timberUnboltAudio.playVictory();
          }, 700);
        }
      } else if (hadPendulumSwing) {
        timberUnboltAudio.playPendulumSwing();
      }
    },
    [selectedScrew, getCoveringPlank, currentLevelConfig]
  );

  // Undo Last Move
  const handleUndo = useCallback(() => {
    if (moveHistory.length === 0 || phaseRef.current !== 'PLAYING') return;

    const previousState = moveHistory[moveHistory.length - 1];
    setMoveHistory((prev) => prev.slice(0, -1));

    screwsRef.current = previousState.screws;
    setScrews(previousState.screws);

    fallenPlanksRef.current = previousState.fallenPlanks;
    setFallenPlankIds(previousState.fallenPlanks);

    setSelectedScrew(null);
    setActiveHint(null);
    timberUnboltAudio.playUndo();
  }, [moveHistory]);

  // Reset Board
  const handleResetBoard = useCallback(() => {
    setScrews(new Set(currentLevelConfig.initial_screws));
    screwsRef.current = new Set(currentLevelConfig.initial_screws);
    setFallenPlankIds(new Set());
    fallenPlanksRef.current = new Set();
    setSelectedScrew(null);
    setMoveHistory([]);
    setBlockedPlankId(null);
    setActiveHint(null);
    setToastMessage('');
    timberUnboltAudio.playReset();
  }, [currentLevelConfig]);

  // Hint
  const handleUseHint = useCallback(() => {
    if (hintsRemaining <= 0 || phaseRef.current !== 'PLAYING') return;

    const activePlanks = currentLevelConfig.planks.filter((p) => !fallenPlanksRef.current.has(p.id));
    const solutionPath = findShortestSolution(screwsRef.current, activePlanks, allHoleIds);

    if (solutionPath && solutionPath.length > 0) {
      const nextMove = solutionPath[0];
      setActiveHint(nextMove);
      setHintsRemaining((prev) => Math.max(0, prev - 1));
      timberUnboltAudio.playHint();

      // Automatically lift the hinted screw for senior ease of use
      setSelectedScrew(nextMove.from);
    }
  }, [hintsRemaining, currentLevelConfig, allHoleIds]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (phaseRef.current === 'BRIEFING') {
          e.preventDefault();
          phaseRef.current = 'PLAYING';
          setPhase('PLAYING');
          timberUnboltAudio.playBriefingStart();
          return;
        }
        if (phaseRef.current === 'VICTORY') {
          e.preventDefault();
          if (levelNumber < TIMBERUNBOLT_LEVELS.length) {
            loadLevel(levelNumber + 1);
          } else {
            loadLevel(1);
          }
          return;
        }
      }

      if (phaseRef.current !== 'PLAYING') return;

      if (e.key === 'u' || e.key === 'U' || (e.ctrlKey && e.key === 'z')) {
        e.preventDefault();
        handleUndo();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleResetBoard();
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        handleUseHint();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [levelNumber, loadLevel, handleUndo, handleResetBoard, handleUseHint]);

  const releasedCount = fallenPlankIds.size;
  const totalPlanks = currentLevelConfig.planks.length;

  return (
    <div className={styles.arenaContainer}>
      {/* ----------------------------------------------------------------------
          1. COMPACT SINGLE-ROW TOP HUD
          ---------------------------------------------------------------------- */}
      <header className={styles.compactHeader}>
        <div className={styles.headerLeft}>
          {onBack ? (
            <button
              type="button"
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

          {/* Level Switcher Tabs */}
          <div className={styles.levelTabs}>
            {TIMBERUNBOLT_LEVELS.map((lvl) => {
              const isLocked = lvl.level > unlockedLevel;
              return (
                <button
                  type="button"
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

        {/* Level Title & Planks Badge */}
        <div className={styles.headerCenter}>
          <h1 className={styles.levelTitleText}>
            🔩 {currentLevelConfig.title}
          </h1>
          <span className={styles.levelBadge}>
            Planks: {releasedCount} / {totalPlanks} Released
          </span>
        </div>

        {/* Metrics & Actions */}
        <div className={styles.headerRight}>
          <div className={styles.metricsGroup}>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Screws:</span>
              <span className={styles.metricValGold}>{screws.size}</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Remaining:</span>
              <span className={styles.metricValEmerald}>
                {totalPlanks - releasedCount}
              </span>
            </div>
          </div>

          <div className={styles.actionBtns}>
            {/* Pause Game */}
            <button
              type="button"
              onClick={() => setIsPaused(true)}
              className={styles.iconBtn}
              title="Pause Game (Esc or P)"
            >
              ⏸
            </button>

            {/* Glowing Bulb Hint */}
            <button
              type="button"
              onClick={handleUseHint}
              disabled={hintsRemaining <= 0 || phase !== 'PLAYING'}
              className={styles.hintBtn}
              title="Highlight the next screw and target hole"
            >
              💡 Hint ({hintsRemaining})
            </button>

            {/* Info / Briefing */}
            <button
              type="button"
              onClick={() => {
                phaseRef.current = 'BRIEFING';
                setPhase('BRIEFING');
              }}
              className={styles.iconBtn}
              title="View Mission Instructions"
            >
              ℹ
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
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
          2. STAGE & 3D WOODEN BACKBOARD ARENA
          ---------------------------------------------------------------------- */}
      <main className={styles.stageWrapper}>
        <div className={styles.boardFrame}>
          <svg
            className={styles.boardSvg}
            viewBox="0 0 700 480"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Wooden Plank 3D Gradient Fills */}
              {Object.entries(PLANK_COLOR_MAP).map(([key, c]) => (
                <linearGradient
                  key={`plankGrad_${key}`}
                  id={`plankGrad_${key}`}
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor={c.gradStart} />
                  <stop offset="48%" stopColor={c.gradMid} />
                  <stop offset="100%" stopColor={c.gradEnd} />
                </linearGradient>
              ))}

              {/* Brass Rim Metallic Gradient */}
              <linearGradient id="gradBrassRim" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF3C7" />
                <stop offset="35%" stopColor="#F59E0B" />
                <stop offset="75%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>

              {/* Golden Brass Screw Radial Specular Gradient */}
              <radialGradient id="gradBrassScrew" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="25%" stopColor="#FDE68A" />
                <stop offset="65%" stopColor="#D97706" />
                <stop offset="90%" stopColor="#92400E" />
                <stop offset="100%" stopColor="#451A03" />
              </radialGradient>

              {/* Recessed Socket Cavity Inner Shadow */}
              <radialGradient id="socketCavityGrad" cx="50%" cy="40%" r="55%">
                <stop offset="0%" stopColor="#040806" />
                <stop offset="55%" stopColor="#040806" />
                <stop offset="100%" stopColor="#0D1714" />
              </radialGradient>

              {/* Woodgrain Overlay Texture Pattern */}
              <pattern
                id="woodgrainPattern"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 0 20 Q 40 16 80 20 M 0 45 Q 40 48 80 45 M 0 68 Q 40 64 80 68"
                  stroke="#000000"
                  strokeWidth="1.2"
                  fill="none"
                  opacity="0.22"
                />
              </pattern>

              {/* Multi-Layer Plank 3D Drop Shadow */}
              <filter id="plank3DShadow" x="-25%" y="-25%" width="150%" height="150%">
                <feDropShadow
                  dx="0"
                  dy="10"
                  stdDeviation="10"
                  floodColor="#000000"
                  floodOpacity="0.75"
                />
              </filter>

              {/* Lifted Screw Glowing Spotlight */}
              <filter id="screwLiftGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow
                  dx="0"
                  dy="6"
                  stdDeviation="8"
                  floodColor="#F59E0B"
                  floodOpacity="0.95"
                />
              </filter>
            </defs>

            {/* 1. Backing Board Frame (Dark Teak Finish) */}
            <rect
              x="20"
              y="20"
              width="660"
              height="440"
              rx="22"
              fill="#0E1A16"
              stroke="rgba(245, 158, 11, 0.32)"
              strokeWidth="2.5"
            />

            {/* Backboard Inner Shadow Frame */}
            <rect
              x="22"
              y="22"
              width="656"
              height="436"
              rx="20"
              fill="none"
              stroke="rgba(0, 0, 0, 0.45)"
              strokeWidth="4"
            />

            {/* Corner Decorative Brass Rivets */}
            {[
              { cx: 42, cy: 42 },
              { cx: 658, cy: 42 },
              { cx: 42, cy: 438 },
              { cx: 658, cy: 438 }
            ].map((rivet, idx) => (
              <g key={`rivet-${idx}`}>
                <circle cx={rivet.cx} cy={rivet.cy} r={7} fill="#B45309" opacity="0.8" />
                <circle cx={rivet.cx} cy={rivet.cy} r={5} fill="url(#gradBrassRim)" />
                <circle cx={rivet.cx - 1.5} cy={rivet.cy - 1.5} r={1.5} fill="#FEF3C7" />
              </g>
            ))}

            {/* 2. LAYER: Recessed Brass Sockets on Board */}
            {currentLevelConfig.all_holes.map((hole) => {
              const hasScrew = screws.has(hole.id);
              const isCovered = Boolean(getCoveringPlank(hole.id));
              const isTargetHint = activeHint && activeHint.to === hole.id;
              const isAvailableDest = Boolean(selectedScrew && !hasScrew && !isCovered);

              return (
                <g
                  key={`socket-${hole.id}`}
                  data-hole-id={hole.id}
                  onClick={() => !hasScrew && handleSocketClick(hole.id)}
                  className={`
                    ${styles.socketGroup}
                    ${!hasScrew ? styles.socketEmpty : ''}
                    ${isCovered ? styles.socketBlocked : ''}
                  `}
                >
                  {/* Outer Recessed Shadow Rim */}
                  <circle cx={hole.x} cy={hole.y + 1} r={23.5} fill="rgba(0,0,0,0.5)" />

                  {/* Brushed Golden-Brass Washer Rim */}
                  <circle
                    cx={hole.x}
                    cy={hole.y}
                    r={22}
                    fill="#040806"
                    stroke={
                      isAvailableDest
                        ? '#F59E0B'
                        : isCovered
                        ? 'rgba(255, 255, 255, 0.12)'
                        : 'rgba(245, 158, 11, 0.45)'
                    }
                    strokeWidth={isAvailableDest ? 3 : 2}
                  />

                  {/* Deep 3D Cavity Well */}
                  <circle cx={hole.x} cy={hole.y} r={16} fill="url(#socketCavityGrad)" />

                  {/* Top Specular Arc Highlight */}
                  <path
                    d={`M ${hole.x - 12} ${hole.y - 7} A 16 16 0 0 1 ${hole.x + 12} ${hole.y - 7}`}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.28)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />

                  {/* Pulsing Target Halo when a screw is lifted */}
                  {isAvailableDest && (
                    <circle
                      cx={hole.x}
                      cy={hole.y}
                      r={26}
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth={2.5}
                      strokeDasharray="4 3"
                      className={styles.socketHighlight}
                    />
                  )}

                  {/* Hint Spotlight Ring */}
                  {isTargetHint && (
                    <circle
                      cx={hole.x}
                      cy={hole.y}
                      r={25}
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth={3.5}
                      className={styles.hintRing}
                    />
                  )}
                </g>
              );
            })}

            {/* 3. LAYER: 3D Hardwood Planks with Pendulum Dangle & Gravity Fall */}
            {[...currentLevelConfig.planks]
              .sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1))
              .map((plank) => {
                const isDropped = fallenPlankIds.has(plank.id);
                const isBlockedFlash = blockedPlankId === plank.id;
                const colors = PLANK_COLOR_MAP[plank.color] || PLANK_COLOR_MAP.teak;

                // Check remaining screws in this plank
                const remainingHoles = plank.pin_holes.filter((h) => screws.has(h));
                const isDangling = !isDropped && remainingHoles.length === 1;

                // Calculate pivot point and swing angle if dangling
                let transformStr = '';
                if (isDropped) {
                  transformStr = `translate(0, 480) rotate(${plank.dropTilt || 16})`;
                } else if (isDangling) {
                  const pivotHole = currentLevelConfig.all_holes.find(
                    (h) => h.id === remainingHoles[0]
                  );
                  if (pivotHole) {
                    const dangleDeg = calculatePendulumDangle(
                      plank,
                      pivotHole,
                      currentLevelConfig.all_holes
                    );
                    transformStr = `rotate(${dangleDeg}, ${pivotHole.x}, ${pivotHole.y})`;
                  }
                }

                return (
                  <g
                    key={`plank-${plank.id}`}
                    data-plank-id={plank.id}
                    filter="url(#plank3DShadow)"
                    transform={transformStr}
                    className={`
                      ${styles.plankGroup}
                      ${isDropped ? styles.plankDropping : ''}
                      ${isDangling ? styles.plankDangling : ''}
                      ${isBlockedFlash ? styles.plankBlockedFlash : ''}
                    `}
                  >
                    {/* 3.1 Dark 3D Bottom Thickness Edge */}
                    <line
                      x1={plank.x1}
                      y1={plank.y1 + 4}
                      x2={plank.x2}
                      y2={plank.y2 + 4}
                      strokeLinecap="round"
                      stroke="#050B08"
                      strokeWidth={54}
                      opacity={0.8}
                    />

                    {/* 3.2 Main Hardwood Plank Body */}
                    <line
                      x1={plank.x1}
                      y1={plank.y1}
                      x2={plank.x2}
                      y2={plank.y2}
                      strokeLinecap="round"
                      stroke={`url(#plankGrad_${plank.color})`}
                      strokeWidth={50}
                    />

                    {/* 3.3 Subtle Woodgrain Overlay */}
                    <line
                      x1={plank.x1}
                      y1={plank.y1}
                      x2={plank.x2}
                      y2={plank.y2}
                      strokeLinecap="round"
                      stroke="url(#woodgrainPattern)"
                      strokeWidth={46}
                    />

                    {/* 3.4 Top Edge Warm Highlight Bevel */}
                    <line
                      x1={plank.x1}
                      y1={plank.y1 - 2}
                      x2={plank.x2}
                      y2={plank.y2 - 2}
                      strokeLinecap="round"
                      stroke={colors.bevelLight}
                      strokeWidth={46}
                      fill="none"
                    />

                    {/* 3.5 Bottom Edge Bevel Shadow */}
                    <line
                      x1={plank.x1}
                      y1={plank.y1 + 2}
                      x2={plank.x2}
                      y2={plank.y2 + 2}
                      strokeLinecap="round"
                      stroke={colors.bevelDark}
                      strokeWidth={46}
                      fill="none"
                      opacity={0.35}
                    />

                    {/* 3.6 Recessed Metal Grommets / Hole Collars on Plank */}
                    {plank.pin_holes.map((holeId) => {
                      const hole = currentLevelConfig.all_holes.find((h) => h.id === holeId);
                      if (!hole) return null;

                      return (
                        <g key={`grommet-${plank.id}-${holeId}`}>
                          <circle
                            cx={hole.x}
                            cy={hole.y}
                            r={20}
                            fill="#060C0A"
                            stroke="rgba(245, 158, 11, 0.4)"
                            strokeWidth={2}
                          />
                          <circle
                            cx={hole.x}
                            cy={hole.y}
                            r={15.5}
                            fill="#020604"
                          />
                        </g>
                      );
                    })}
                  </g>
                );
              })}

            {/* 4. LAYER: 3D Glossy Brass Screws */}
            {currentLevelConfig.all_holes.map((hole) => {
              const hasScrew = screws.has(hole.id);
              if (!hasScrew) return null;

              const isLifted = selectedScrew === hole.id;
              const isHintSource = activeHint && activeHint.from === hole.id;

              return (
                <g
                  key={`screw-${hole.id}`}
                  data-screw-hole={hole.id}
                  onClick={() => handleScrewClick(hole.id)}
                  transform={`translate(${hole.x}, ${hole.y})`}
                  className={`
                    ${styles.screwGroup}
                    ${isLifted ? styles.screwLifted : ''}
                  `}
                >
                  {/* Screw Deep Shadow */}
                  <circle
                    r={isLifted ? 23 : 19}
                    cy={isLifted ? 8 : 2}
                    fill="rgba(0,0,0,0.6)"
                  />

                  {/* Outer Brass Flange Head */}
                  <circle
                    r={18}
                    fill="url(#gradBrassScrew)"
                    stroke="#FFFBEB"
                    strokeWidth={1.5}
                  />

                  {/* Inner Concentric Machined Ridge */}
                  <circle
                    r={13}
                    fill="none"
                    stroke="#78350F"
                    strokeWidth={1.2}
                    opacity={0.8}
                  />

                  {/* Phillips Cross Slot with 270deg Smooth Unscrew Spin */}
                  <g
                    transform={isLifted ? 'rotate(270)' : 'rotate(0)'}
                    style={{ transition: 'transform 0.32s cubic-bezier(0.34, 1.45, 0.64, 1)' }}
                  >
                    {/* Shadow Slot */}
                    <line
                      x1={-7.5}
                      y1={0}
                      x2={7.5}
                      y2={0}
                      stroke="#2A1002"
                      strokeWidth={4}
                      strokeLinecap="round"
                    />
                    <line
                      x1={0}
                      y1={-7.5}
                      x2={0}
                      y2={7.5}
                      stroke="#2A1002"
                      strokeWidth={4}
                      strokeLinecap="round"
                    />
                    {/* Metallic Highlight Edges */}
                    <line
                      x1={-6.5}
                      y1={-0.8}
                      x2={6.5}
                      y2={-0.8}
                      stroke="#FEF3C7"
                      strokeWidth={1.2}
                    />
                    <line
                      x1={-0.8}
                      y1={-6.5}
                      x2={-0.8}
                      y2={6.5}
                      stroke="#FEF3C7"
                      strokeWidth={1.2}
                    />
                  </g>

                  {/* Hint Spotlight Halo */}
                  {isHintSource && (
                    <circle
                      r={25}
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth={3.5}
                      className={styles.hintRing}
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </main>

      {/* ----------------------------------------------------------------------
          3. BOTTOM ACTION BAR & SENIORS GUIDANCE
          ---------------------------------------------------------------------- */}
      <footer className={styles.bottomBar}>
        <div className={styles.instructionBox}>
          <span className={styles.instructionIcon}>💡</span>
          <span>
            {selectedScrew ? (
              <>
                Screw unbolted! Tap any <strong className={styles.instructionHighlight}>open green socket</strong> on the board to place.
              </>
            ) : toastMessage ? (
              <strong className={styles.instructionHighlight}>{toastMessage}</strong>
            ) : (
              <>
                Tap a <strong className={styles.instructionHighlight}>golden screw</strong> to unscrew, then move it to an open board hole.
              </>
            )}
          </span>
        </div>

        <div className={styles.bottomButtons}>
          {/* Undo Move */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={moveHistory.length === 0}
            className={styles.undoBtn}
            title="Undo last screw move (U)"
          >
            ↩ Undo
          </button>

          {/* Reset Board */}
          <button
            type="button"
            onClick={handleResetBoard}
            disabled={moveHistory.length === 0 && fallenPlankIds.size === 0}
            className={styles.resetBtn}
            title="Reset current puzzle (R)"
          >
            ↺ Reset
          </button>
        </div>
      </footer>

      {/* ----------------------------------------------------------------------
          4. PRE-LEVEL MISSION BRIEFING MODAL
          ---------------------------------------------------------------------- */}
      {phase === 'BRIEFING' && (
        <div className={styles.briefingOverlay}>
          <div className={styles.briefingCard}>
            <div className={styles.briefingHeader}>
              <span className={styles.missionBadge}>
                Seniors Sanctuary • Spatial Physics & Logic
              </span>
              <h2 className={styles.briefingTitle}>
                🔩 {currentLevelConfig.title}
              </h2>
            </div>

            <p className={styles.briefingGoal}>
              Move the golden brass screws into open board holes so every wooden plank
              is released, dangles freely, and drops clear of the frame.
            </p>

            {/* Visual Mini-Diagram */}
            <div className={styles.diagramBox}>
              <div className={styles.diagramSteps}>
                <div className={styles.diagramStep}>
                  <span className={styles.stepIcon}>🔩</span>
                  <span className={styles.stepLabel}>1. Tap Screw</span>
                  <span className={styles.stepSub}>Spins 270° & unbolts</span>
                </div>
                <span className={styles.diagramArrow}>➔</span>
                <div className={styles.diagramStep}>
                  <span className={styles.stepIcon}>⭕</span>
                  <span className={styles.stepLabel}>2. Tap Empty Hole</span>
                  <span className={styles.stepSub}>Places in open board hole</span>
                </div>
                <span className={styles.diagramArrow}>➔</span>
                <div className={styles.diagramStep}>
                  <span className={styles.stepIcon}>🪵</span>
                  <span className={styles.stepLabel}>3. Swing & Drop!</span>
                  <span className={styles.stepSub}>Dangles & falls clear</span>
                </div>
              </div>
              <span className={styles.diagramCaption}>
                1 screw left swings the plank like a pendulum. 0 screws drops the plank!
              </span>
            </div>

            <p className={styles.reassuranceText}>
              <span>🌿</span> No timer • No pressure • Gentle physics logic
            </p>

            <button
              type="button"
              onClick={() => {
                phaseRef.current = 'PLAYING';
                setPhase('PLAYING');
                timberUnboltAudio.playBriefingStart();
              }}
              className={styles.startButton}
            >
              Start Playing 🔩
            </button>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------
          5. PEACEFUL VICTORY MODAL
          ---------------------------------------------------------------------- */}
      {phase === 'VICTORY' && (
        <div className={styles.modalOverlay}>
          <div className={styles.victoryCard}>
            <span className={styles.victoryIcon}>✨🪵✨</span>
            <h2 className={styles.victoryTitle}>All Planks Released!</h2>
            <p className={styles.victorySubtitle}>
              Every bolt was smoothly repositioned and every wooden beam has swung and fallen
              clear of the frame. Masterful joinery work!
            </p>

            <div className={styles.vitalityPill}>
              <span>🌿 +100 Seniors Vitality Points</span>
            </div>

            <div className={styles.victoryStats}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Planks Released</span>
                <span className={styles.statValue}>
                  {totalPlanks} / {totalPlanks}
                </span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Joinery Status</span>
                <span className={styles.statValue}>100% Unbolted</span>
              </div>
            </div>

            <div className={styles.victoryActions}>
              <button
                type="button"
                onClick={() => loadLevel(levelNumber)}
                className={styles.secondaryBtn}
              >
                ↺ Replay Level
              </button>

              {levelNumber < TIMBERUNBOLT_LEVELS.length ? (
                <button
                  type="button"
                  onClick={() => {
                    triggerUnlockNext(levelNumber);
                    loadLevel(levelNumber + 1);
                  }}
                  className={styles.primaryVictoryBtn}
                >
                  Next Joinery Level ({levelNumber + 1}) →
                </button>
              ) : (
                <button
                  type="button"
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
        onRestart={() => {
          setIsPaused(false);
          loadLevel(levelNumber);
        }}
        onExit={() => navigate('/dashboard/seniors')}
        gameTitle={`TimberUnbolt: ${currentLevelConfig.title}`}
        level={levelNumber}
        zonePath="/dashboard/seniors"
      />
    </div>
  );
};

export default TimberUnbolt;
