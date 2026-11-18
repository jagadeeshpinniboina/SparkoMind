import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, RotateCcw, Play, Square, Trash2, ArrowUp, 
  RotateCw, RefreshCw, Zap, Trophy, Star, AlertTriangle, 
  CheckCircle, ArrowRight, ChevronUp, ChevronDown,
  Volume2, VolumeX, Sparkles, Pause
} from 'lucide-react';
import botAudio from './BotScriptAudio';
import { useGameProgression, unlockNextLevel } from '../../../../../utils/gameProgression.js';
import GamePauseOverlay from '../../../../../components/GamePauseOverlay';
import styles from './BotScript.module.css';

// 5 Progressive Levels Configuration (Immutable & Defined at top)
export const LEVELS_CONFIG = [
  {
    level: 1,
    title: 'First Steps',
    mission: 'Move the robot straight forward to enter the orbital portal.',
    rows: 5,
    cols: 5,
    robotStart: { row: 4, col: 2, dir: 'N' },
    portal: { row: 1, col: 2 },
    asteroids: [],
    batteries: [],
    maxSlots: 4,
    allowedBlocks: ['MOVE_FORWARD']
  },
  {
    level: 2,
    title: 'Space Debris',
    mission: 'Turn to bypass the floating asteroid field and reach the portal.',
    rows: 5,
    cols: 5,
    robotStart: { row: 4, col: 1, dir: 'N' },
    portal: { row: 1, col: 3 },
    asteroids: [{ row: 2, col: 1 }, { row: 3, col: 3 }],
    batteries: [],
    maxSlots: 8,
    allowedBlocks: ['MOVE_FORWARD', 'TURN_LEFT', 'TURN_RIGHT']
  },
  {
    level: 3,
    title: 'Power Loop',
    mission: 'Slot limit is 3! Use loop commands to reach the distant portal.',
    rows: 6,
    cols: 6,
    robotStart: { row: 5, col: 2, dir: 'N' },
    portal: { row: 1, col: 2 },
    asteroids: [],
    batteries: [],
    maxSlots: 3,
    allowedBlocks: ['MOVE_FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'LOOP_2X', 'LOOP_3X']
  },
  {
    level: 4,
    title: 'Orb Collector',
    mission: 'Collect both Energy Orbs to charge your battery before portal opens.',
    rows: 6,
    cols: 6,
    robotStart: { row: 5, col: 0, dir: 'E' },
    portal: { row: 1, col: 5 },
    asteroids: [{ row: 5, col: 4 }, { row: 4, col: 1 }, { row: 3, col: 4 }],
    batteries: [{ row: 5, col: 3 }, { row: 2, col: 3 }],
    maxSlots: 10,
    allowedBlocks: ['MOVE_FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'LOOP_2X', 'LOOP_3X']
  },
  {
    level: 5,
    title: 'The Asteroid Labyrinth',
    mission: 'Thread the winding space corridor, collect all orbs, and warp to safety.',
    rows: 7,
    cols: 7,
    robotStart: { row: 6, col: 1, dir: 'N' },
    portal: { row: 0, col: 5 },
    asteroids: [
      { row: 5, col: 0 }, { row: 5, col: 2 }, { row: 5, col: 3 },
      { row: 3, col: 1 }, { row: 3, col: 2 }, { row: 3, col: 4 },
      { row: 1, col: 3 }, { row: 1, col: 4 }
    ],
    batteries: [{ row: 4, col: 1 }, { row: 2, col: 5 }],
    maxSlots: 14,
    allowedBlocks: ['MOVE_FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'LOOP_2X', 'LOOP_3X']
  }
];

export const BotScript = ({ initialLevel = 1 }) => {
  // Safe integer level resolution & sequential level progression
  const { unlockedLevel, unlockNextLevel: triggerUnlockNext, isLevelUnlocked } = useGameProgression('bot-script');
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

  const currentConfig = LEVELS_CONFIG.find((l) => l.level === level) || LEVELS_CONFIG[0];

  // Game Grid State
  const [robot, setRobot] = useState({ ...(currentConfig?.robotStart || { row: 4, col: 2, dir: 'N' }) });
  const [collectedBatteries, setCollectedBatteries] = useState([]);
  const [isGridShaking, setIsGridShaking] = useState(false);
  const [collidedTile, setCollidedTile] = useState(null);
  const [thrusterPuffs, setThrusterPuffs] = useState([]);
  const [floatingPops, setFloatingPops] = useState([]);
  const [pathTrail, setPathTrail] = useState([]);
  const [sparks, setSparks] = useState([]);

  // Audio & Sensory State
  const [isMuted, setIsMuted] = useState(false);

  // Block Program Tray
  const [commands, setCommands] = useState([]);
  const [executingIndex, setExecutingIndex] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: 'Assemble code blocks to navigate your robot.', type: 'default' });

  // Victory Modal State
  const [victoryModalOpen, setVictoryModalOpen] = useState(false);
  const [starsEarned, setStarsEarned] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const executionTimerRef = useRef(null);
  const navigate = useNavigate();

  // Keyboard pause shortcut (Escape or P)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (!victoryModalOpen) {
          setIsPaused((prev) => {
            const next = !prev;
            if (next && isRunning) {
              if (executionTimerRef.current) clearInterval(executionTimerRef.current);
              setIsRunning(false);
              setStatusMessage({ text: '⏸ Execution paused. Click Run or Reset to continue.', type: 'default' });
            }
            return next;
          });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [victoryModalOpen, isRunning]);

  // Toggle Audio Mute
  const toggleMute = () => {
    botAudio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Reset to level initial configuration
  const resetLevel = (lvlNum = level) => {
    if (executionTimerRef.current) clearInterval(executionTimerRef.current);
    const cfg = LEVELS_CONFIG.find((l) => l.level === lvlNum) || LEVELS_CONFIG[0];
    setRobot({ ...cfg.robotStart });
    setCollectedBatteries([]);
    setIsGridShaking(false);
    setCollidedTile(null);
    setThrusterPuffs([]);
    setFloatingPops([]);
    setPathTrail([]);
    setSparks([]);
    setIsRunning(false);
    setExecutingIndex(-1);
    setStatusMessage({ text: cfg.mission, type: 'default' });
    setVictoryModalOpen(false);
  };

  useEffect(() => {
    resetLevel(level);
    setCommands([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (executionTimerRef.current) clearInterval(executionTimerRef.current);
    };
  }, []);

  // Direction Rotation Degrees
  const getRotationDegrees = (dir) => {
    switch (dir) {
      case 'N': return 0;
      case 'E': return 90;
      case 'S': return 180;
      case 'W': return 270;
      default: return 0;
    }
  };

  // Turn Logic
  const getNextDirLeft = (dir) => {
    const map = { N: 'W', W: 'S', S: 'E', E: 'N' };
    return map[dir] || 'N';
  };

  const getNextDirRight = (dir) => {
    const map = { N: 'E', E: 'S', S: 'W', W: 'N' };
    return map[dir] || 'N';
  };

  // Add Block to Sequence Tray
  const handleAddBlock = (blockType) => {
    if (isRunning) return;
    if (commands.length >= currentConfig.maxSlots) {
      botAudio.playCollision();
      setStatusMessage({ text: `Slot limit reached (${currentConfig.maxSlots} max blocks)!`, type: 'error' });
      return;
    }

    botAudio.playBlockClick();

    const newCommand = {
      id: `${blockType}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: blockType,
      label: getBlockLabel(blockType)
    };

    setCommands((prev) => [...prev, newCommand]);
    setStatusMessage({ text: `Added ${newCommand.label}.`, type: 'default' });
  };

  const handleRemoveBlock = (index) => {
    if (isRunning) return;
    botAudio.playBlockClick();
    setCommands((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleMoveBlock = (index, delta) => {
    if (isRunning) return;
    const targetIdx = index + delta;
    if (targetIdx < 0 || targetIdx >= commands.length) return;

    botAudio.playBlockClick();

    setCommands((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  const handleClearAll = () => {
    if (isRunning) return;
    botAudio.playBlockClick();
    setCommands([]);
    resetLevel();
  };

  const getBlockLabel = (type) => {
    switch (type) {
      case 'MOVE_FORWARD': return 'Move Forward';
      case 'TURN_LEFT': return 'Turn Left 90°';
      case 'TURN_RIGHT': return 'Turn Right 90°';
      case 'LOOP_2X': return 'Loop 2x (Move 2)';
      case 'LOOP_3X': return 'Loop 3x (Move 3)';
      default: return type;
    }
  };

  // Unroll commands to atomic execution steps
  const unrollCommands = () => {
    const atomicSteps = [];
    commands.forEach((cmd, cmdIdx) => {
      if (cmd.type === 'MOVE_FORWARD') {
        atomicSteps.push({ action: 'MOVE', sourceCmdIdx: cmdIdx });
      } else if (cmd.type === 'TURN_LEFT') {
        atomicSteps.push({ action: 'TURN_L', sourceCmdIdx: cmdIdx });
      } else if (cmd.type === 'TURN_RIGHT') {
        atomicSteps.push({ action: 'TURN_R', sourceCmdIdx: cmdIdx });
      } else if (cmd.type === 'LOOP_2X') {
        atomicSteps.push({ action: 'MOVE', sourceCmdIdx: cmdIdx });
        atomicSteps.push({ action: 'MOVE', sourceCmdIdx: cmdIdx });
      } else if (cmd.type === 'LOOP_3X') {
        atomicSteps.push({ action: 'MOVE', sourceCmdIdx: cmdIdx });
        atomicSteps.push({ action: 'MOVE', sourceCmdIdx: cmdIdx });
        atomicSteps.push({ action: 'MOVE', sourceCmdIdx: cmdIdx });
      }
    });
    return atomicSteps;
  };

  // Execute Script Step-by-Step
  const handleRunScript = () => {
    if (commands.length === 0) {
      botAudio.playCollision();
      setStatusMessage({ text: 'Add at least one command block before running!', type: 'error' });
      return;
    }

    // Reset robot & collected state first
    setRobot({ ...currentConfig.robotStart });
    setCollectedBatteries([]);
    setIsGridShaking(false);
    setCollidedTile(null);
    setThrusterPuffs([]);
    setFloatingPops([]);
    setPathTrail([]);
    setSparks([]);
    setIsRunning(true);
    setStatusMessage({ text: 'Executing program sequence...', type: 'default' });

    const atomicSteps = unrollCommands();
    let currentStep = 0;
    let localRobot = { ...currentConfig.robotStart };
    let localCollected = [];

    executionTimerRef.current = setInterval(() => {
      if (currentStep >= atomicSteps.length) {
        // Program finished executing
        clearInterval(executionTimerRef.current);
        setIsRunning(false);
        setExecutingIndex(-1);

        // Check Victory Conditions
        const isAtPortal = localRobot.row === currentConfig.portal.row && localRobot.col === currentConfig.portal.col;
        const hasAllBatteries = localCollected.length === currentConfig.batteries.length;

        if (isAtPortal && hasAllBatteries) {
          botAudio.playVictory();
          setStatusMessage({ text: 'Mission Accomplished! Portal reached safely!', type: 'success' });
          setStarsEarned(3);
          triggerUnlockNext(level);
          setVictoryModalOpen(true);
        } else if (isAtPortal && !hasAllBatteries) {
          botAudio.playCollision();
          setStatusMessage({ text: `⚠️ Portal locked! Gather all ${currentConfig.batteries.length} energy orbs first.`, type: 'error' });
        } else {
          botAudio.playCollision();
          setStatusMessage({ text: 'Program finished, but robot did not land on the portal.', type: 'error' });
        }
        return;
      }

      const step = atomicSteps[currentStep];
      setExecutingIndex(step.sourceCmdIdx);

      if (step.action === 'TURN_L') {
        botAudio.playTurn();
        localRobot = { ...localRobot, dir: getNextDirLeft(localRobot.dir) };
        setRobot({ ...localRobot });
      } else if (step.action === 'TURN_R') {
        botAudio.playTurn();
        localRobot = { ...localRobot, dir: getNextDirRight(localRobot.dir) };
        setRobot({ ...localRobot });
      } else if (step.action === 'MOVE') {
        let nextRow = localRobot.row;
        let nextCol = localRobot.col;

        if (localRobot.dir === 'N') nextRow -= 1;
        if (localRobot.dir === 'S') nextRow += 1;
        if (localRobot.dir === 'E') nextCol += 1;
        if (localRobot.dir === 'W') nextCol -= 1;

        // Collision Check: Boundaries
        if (nextRow < 0 || nextRow >= currentConfig.rows || nextCol < 0 || nextCol >= currentConfig.cols) {
          clearInterval(executionTimerRef.current);
          setIsRunning(false);
          setIsGridShaking(true);
          setCollidedTile({ row: localRobot.row, col: localRobot.col });
          botAudio.playCollision();
          setStatusMessage({ text: '⚠️ Collision Alert! Robot drove out of bounds.', type: 'error' });
          setTimeout(() => {
            setIsGridShaking(false);
            setCollidedTile(null);
          }, 600);
          return;
        }

        // Collision Check: Asteroids
        const hitAsteroid = currentConfig.asteroids.some((a) => a.row === nextRow && a.col === nextCol);
        if (hitAsteroid) {
          clearInterval(executionTimerRef.current);
          setIsRunning(false);
          setIsGridShaking(true);
          setCollidedTile({ row: nextRow, col: nextCol });
          botAudio.playCollision();
          setStatusMessage({ text: `⚠️ Collision! Asteroid impact at (${nextRow}, ${nextCol}). Check your path!`, type: 'error' });
          setTimeout(() => {
            setIsGridShaking(false);
            setCollidedTile(null);
          }, 600);
          return;
        }

        // Glowing cyan path trail at previous position
        setPathTrail((prev) => [...prev, { row: localRobot.row, col: localRobot.col }]);

        // Emit Thruster Particle Puff at previous position
        const puffId = `puff-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        setThrusterPuffs((prev) => [...prev, { id: puffId, row: localRobot.row, col: localRobot.col }]);
        setTimeout(() => {
          setThrusterPuffs((prev) => prev.filter((p) => p.id !== puffId));
        }, 600);

        // Thruster sparks burst
        const sparkIds = Array.from({ length: 6 }).map((_, i) => ({
          id: `spark-${Date.now()}-${i}-${Math.random()}`,
          row: localRobot.row,
          col: localRobot.col,
          tx: (Math.random() - 0.5) * 44,
          ty: (Math.random() - 0.5) * 44
        }));
        setSparks((prev) => [...prev, ...sparkIds]);
        setTimeout(() => {
          setSparks((prev) => prev.filter((s) => !sparkIds.some((si) => si.id === s.id)));
        }, 600);

        // Move Robot
        botAudio.playStepMove();
        localRobot = { ...localRobot, row: nextRow, col: nextCol };
        setRobot({ ...localRobot });

        // Battery Pickup Check
        const batteryAtTile = currentConfig.batteries.find(
          (b) => b.row === nextRow && b.col === nextCol && !localCollected.some((c) => c.row === b.row && c.col === b.col)
        );

        if (batteryAtTile) {
          localCollected = [...localCollected, batteryAtTile];
          setCollectedBatteries([...localCollected]);
          botAudio.playBatteryPickup();

          // Spawn floating "+50 Energy" text tag
          const popId = `pop-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
          setFloatingPops((prev) => [...prev, { id: popId, row: nextRow, col: nextCol, text: '+50 Energy' }]);
          setTimeout(() => {
            setFloatingPops((prev) => prev.filter((p) => p.id !== popId));
          }, 900);

          setStatusMessage({ text: `⚡ Collected Energy Orb (${localCollected.length}/${currentConfig.batteries.length})!`, type: 'success' });
        }
      }

      currentStep += 1;
    }, 450);
  };

  const handleStopScript = () => {
    if (executionTimerRef.current) clearInterval(executionTimerRef.current);
    setIsRunning(false);
    setExecutingIndex(-1);
    setStatusMessage({ text: 'Execution stopped by user.', type: 'default' });
  };

  const handleNextLevel = () => {
    setVictoryModalOpen(false);
    if (level < LEVELS_CONFIG.length) {
      const nextLvl = level + 1;
      triggerUnlockNext(level);
      setLevel(nextLvl);
      navigate(`/dashboard/kids/play/bot-script?level=${nextLvl}`);
    } else {
      navigate('/dashboard/kids');
    }
  };

  const handleLevelChange = (newLvl) => {
    if (isRunning) return;
    if (!isLevelUnlocked(newLvl)) return;
    setLevel(newLvl);
  };

  return (
    <div className={styles.container}>
      {/* 1. Top HUD Bar */}
      <header className={styles.topHud}>
        {/* Left Section: Back to Arena + Sequential Level Selector */}
        <div className={styles.hudLeft}>
          <Link to="/dashboard/kids" className={styles.kidsArenaExitBtn}>
            ← 🚀 Kids Arena
          </Link>

          <div className={styles.levelSelectStrip}>
            {LEVELS_CONFIG.map((lvl) => {
              const isLocked = lvl.level > unlockedLevel;
              return (
                <button
                  key={lvl.level}
                  onClick={() => handleLevelChange(lvl.level)}
                  className={`${styles.levelTabBtn} ${level === lvl.level ? styles.levelTabActive : ''} ${isLocked ? styles.levelTabLocked : ''}`}
                  disabled={isRunning || isLocked}
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
          <div className={styles.titleLockup}>
            <span className={styles.gameEmoji}>🤖</span>
            <div>
              <h2 className={styles.gameTitle}>BotScript: Block Coding</h2>
            </div>
            <span className={styles.levelBadge}>Level {level}: {currentConfig.title}</span>
          </div>
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
            className={styles.resetBtn}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          <button onClick={() => resetLevel()} className={styles.resetBtn} disabled={isRunning} title="Reset Robot">
            <RotateCcw size={15} />
            <span>Reset Grid</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (isRunning && executionTimerRef.current) {
                clearInterval(executionTimerRef.current);
                setIsRunning(false);
                setStatusMessage({ text: '⏸ Execution paused. Click Run or Reset to continue.', type: 'default' });
              }
              setIsPaused(true);
            }}
            className={styles.resetBtn}
            title="Pause Game (Esc or P)"
          >
            <Pause size={15} />
            <span>Pause</span>
          </button>
        </div>
      </header>

      {/* 2. Main Workspace Split Layout */}
      <div className={styles.workspace}>
        {/* Left Column: Interactive Space Grid */}
        <section className={styles.gridViewport}>
          <div className={styles.levelInfoBar}>
            <div>
              <h3 className={styles.missionHeading}>{currentConfig.title}</h3>
              <p className={styles.objectiveText}>{currentConfig.mission}</p>
            </div>

            {currentConfig.batteries.length > 0 && (
              <div className={styles.batteryCounter}>
                <Zap size={14} color="#F59E0B" />
                <span>Orbs: {collectedBatteries.length} / {currentConfig.batteries.length}</span>
              </div>
            )}
          </div>

          {/* Grid Board */}
          <div
            className={`${styles.gridBoard} ${isGridShaking ? styles.gridBoardShake : ''}`}
            style={{
              gridTemplateColumns: `repeat(${currentConfig.cols}, 1fr)`,
              gridTemplateRows: `repeat(${currentConfig.rows}, 1fr)`
            }}
          >
            {Array.from({ length: currentConfig.rows }).map((_, rIdx) =>
              Array.from({ length: currentConfig.cols }).map((_, cIdx) => {
                const isRobot = robot.row === rIdx && robot.col === cIdx;
                const isPortal = currentConfig.portal.row === rIdx && currentConfig.portal.col === cIdx;
                const isAsteroid = currentConfig.asteroids.some((a) => a.row === rIdx && a.col === cIdx);
                const isCollided = collidedTile && collidedTile.row === rIdx && collidedTile.col === cIdx;
                const hasBattery = currentConfig.batteries.some(
                  (b) => b.row === rIdx && b.col === cIdx && !collectedBatteries.some((cb) => cb.row === rIdx && cb.col === cIdx)
                );
                const hasThrusterPuff = thrusterPuffs.some((p) => p.row === rIdx && p.col === cIdx);
                const cellPops = floatingPops.filter((p) => p.row === rIdx && p.col === cIdx);
                const isTrailCell = pathTrail.some((t) => t.row === rIdx && t.col === cIdx);
                const cellSparks = sparks.filter((s) => s.row === rIdx && s.col === cIdx);

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`
                      ${styles.gridCell}
                      ${isPortal ? styles.cellPortal : ''}
                      ${isPortal && isRobot ? styles.cellPortalActive : ''}
                      ${isAsteroid ? styles.cellAsteroid : ''}
                      ${isCollided ? styles.cellCollided : ''}
                      ${hasBattery ? styles.cellBattery : ''}
                    `}
                  >
                    {/* Glowing Cyan Path Trail */}
                    {isTrailCell && !isRobot && !isPortal && !isAsteroid && (
                      <div className={styles.trailGlow}>
                        <div className={styles.trailDot} />
                      </div>
                    )}

                    {/* Thruster Particle Puff Trail */}
                    {hasThrusterPuff && <div className={styles.thrusterPuff} />}

                    {/* Thruster Sparks Burst */}
                    {cellSparks.map((sp) => (
                      <div
                        key={sp.id}
                        className={styles.sparkBurst}
                        style={{ '--spark-tx': `${sp.tx}px`, '--spark-ty': `${sp.ty}px` }}
                      />
                    ))}

                    {/* Floating Energy Pop (+50 Energy) */}
                    {cellPops.map((pop) => (
                      <span key={pop.id} className={styles.floatingPop}>
                        {pop.text}
                      </span>
                    ))}

                    {/* Render Portal */}
                    {isPortal && !isRobot && (
                      <span className={styles.portalVortex} title="Mission Target Portal">
                        🌀
                      </span>
                    )}

                    {/* Render Asteroid */}
                    {isAsteroid && (
                      <span className={styles.asteroidRock} title="Asteroid Obstacle">
                        🪨
                      </span>
                    )}

                    {/* Render Battery Orb */}
                    {hasBattery && !isRobot && (
                      <span className={styles.batteryOrb} title="Energy Battery Orb">
                        ⚡
                      </span>
                    )}

                    {/* Render Robot */}
                    {isRobot && (
                      <div
                        className={styles.robotSprite}
                        style={{ transform: `rotate(${getRotationDegrees(robot.dir)}deg)` }}
                        title={`Robot facing ${robot.dir}`}
                      >
                        <span className={styles.directionArrow}>▲</span>
                        <span className={styles.robotEmoji}>🤖</span>
                        {isRunning && <div className={styles.thrusterFlame} />}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Real-time Status / Hint Banner */}
          <div
            className={`
              ${styles.feedbackBanner}
              ${statusMessage.type === 'error' ? styles.statusError : ''}
              ${statusMessage.type === 'success' ? styles.statusSuccess : ''}
              ${statusMessage.type === 'default' ? styles.statusDefault : ''}
            `}
          >
            {statusMessage.type === 'error' && <AlertTriangle size={18} />}
            {statusMessage.type === 'success' && <CheckCircle size={18} />}
            <span>{statusMessage.text}</span>
          </div>
        </section>

        {/* Right Column: Block-Coding Console */}
        <section className={styles.codingConsole}>
          <div className={styles.consoleHeader}>
            <h3 className={styles.consoleTitle}>
              <RefreshCw size={17} style={{ color: '#F59E0B' }} />
              <span>Program Instructions</span>
            </h3>

            <span className={`${styles.slotsIndicator} ${commands.length >= currentConfig.maxSlots ? styles.slotsFull : ''}`}>
              Slots: {commands.length} / {currentConfig.maxSlots}
            </span>
          </div>

          {/* Palette Blocks */}
          <div className={styles.paletteSection}>
            <p className={styles.sectionLabel}>Click to Add Block</p>
            <div className={styles.paletteGrid}>
              {currentConfig.allowedBlocks.includes('MOVE_FORWARD') && (
                <button
                  type="button"
                  onClick={() => handleAddBlock('MOVE_FORWARD')}
                  className={`${styles.paletteBlock} ${styles.blockMove}`}
                  disabled={isRunning || commands.length >= currentConfig.maxSlots}
                >
                  <ArrowUp size={16} />
                  <span>Move Forward</span>
                </button>
              )}

              {currentConfig.allowedBlocks.includes('TURN_LEFT') && (
                <button
                  type="button"
                  onClick={() => handleAddBlock('TURN_LEFT')}
                  className={`${styles.paletteBlock} ${styles.blockTurnLeft}`}
                  disabled={isRunning || commands.length >= currentConfig.maxSlots}
                >
                  <RotateCcw size={16} />
                  <span>Turn Left 90°</span>
                </button>
              )}

              {currentConfig.allowedBlocks.includes('TURN_RIGHT') && (
                <button
                  type="button"
                  onClick={() => handleAddBlock('TURN_RIGHT')}
                  className={`${styles.paletteBlock} ${styles.blockTurnRight}`}
                  disabled={isRunning || commands.length >= currentConfig.maxSlots}
                >
                  <RotateCw size={16} />
                  <span>Turn Right 90°</span>
                </button>
              )}

              {currentConfig.allowedBlocks.includes('LOOP_2X') && (
                <button
                  type="button"
                  onClick={() => handleAddBlock('LOOP_2X')}
                  className={`${styles.paletteBlock} ${styles.blockLoop}`}
                  disabled={isRunning || commands.length >= currentConfig.maxSlots}
                >
                  <RefreshCw size={15} />
                  <span>Loop 2x Move</span>
                </button>
              )}

              {currentConfig.allowedBlocks.includes('LOOP_3X') && (
                <button
                  type="button"
                  onClick={() => handleAddBlock('LOOP_3X')}
                  className={`${styles.paletteBlock} ${styles.blockLoop}`}
                  disabled={isRunning || commands.length >= currentConfig.maxSlots}
                >
                  <RefreshCw size={15} />
                  <span>Loop 3x Move</span>
                </button>
              )}
            </div>
          </div>

          {/* Program Sequence Tray */}
          <div className={styles.traySection}>
            <p className={styles.sectionLabel}>Execution Tray</p>
            <div className={styles.sequenceTray}>
              {commands.length === 0 ? (
                <div className={styles.emptyTrayPrompt}>
                  <p>Your command sequence is empty.</p>
                  <span>Click blocks above to program the robot!</span>
                </div>
              ) : (
                commands.map((cmd, idx) => (
                  <div
                    key={cmd.id}
                    className={`${styles.trayItem} ${executingIndex === idx ? styles.trayItemExecuting : ''}`}
                  >
                    <div className={styles.itemLeft}>
                      <span className={styles.stepNumber}>#{idx + 1}</span>
                      <span>{cmd.label}</span>
                    </div>

                    <div className={styles.itemActions}>
                      <button
                        type="button"
                        onClick={() => handleMoveBlock(idx, -1)}
                        disabled={isRunning || idx === 0}
                        className={styles.orderBtn}
                        title="Move Up"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveBlock(idx, 1)}
                        disabled={isRunning || idx === commands.length - 1}
                        className={styles.orderBtn}
                        title="Move Down"
                      >
                        <ChevronDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveBlock(idx)}
                        disabled={isRunning}
                        className={styles.deleteBtn}
                        title="Delete Block"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Run & Clear Controls */}
          <div className={styles.controlBar}>
            {!isRunning ? (
              <button
                type="button"
                onClick={handleRunScript}
                className={styles.runBtn}
                disabled={commands.length === 0}
              >
                <Play size={18} fill="currentColor" />
                <span>Run Script ▶</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStopScript}
                className={styles.stopBtn}
              >
                <Square size={17} fill="currentColor" />
                <span>Stop Script ⏹</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleClearAll}
              className={styles.clearBtn}
              disabled={isRunning || commands.length === 0}
            >
              <Trash2 size={16} />
              <span>Clear</span>
            </button>
          </div>
        </section>
      </div>

      {/* 3. Victory Modal Overlay */}
      {victoryModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.victoryModal}>
            {/* Confetti & Stars Particle Burst */}
            <div className={styles.confettiContainer}>
              {['⭐', '✨', '⚡', '🎉', '🌟', '✦', '⭐', '✨', '💎'].map((emoji, i) => (
                <span
                  key={i}
                  className={styles.confettiParticle}
                  style={{
                    left: `${6 + i * 10}%`,
                    animationDelay: `${(i * 0.2).toFixed(2)}s`,
                    animationDuration: `${(1.8 + (i % 3) * 0.4).toFixed(2)}s`
                  }}
                >
                  {emoji}
                </span>
              ))}
            </div>

            <div className={styles.trophyCircle}>
              🏆
            </div>

            <h3 className={styles.victoryTitle}>Mission Accomplished!</h3>
            <p className={styles.victorySubtitle}>
              You successfully calibrated BotScript code to navigate Level {level}!
            </p>

            <div className={styles.starsRow}>
              <span>★</span>
              <span>★</span>
              <span>★</span>
            </div>

            <div className={styles.rewardBox}>
              <div className={styles.rewardItem}>
                <span className={styles.rewardVal}>+100 XP</span>
                <span className={styles.rewardLbl}>Wonder Stars</span>
              </div>
              <div className={styles.rewardItem}>
                <span className={styles.rewardVal}>{commands.length} Blocks</span>
                <span className={styles.rewardLbl}>Code Length</span>
              </div>
              <div className={styles.rewardItem}>
                <span className={styles.rewardVal}>100%</span>
                <span className={styles.rewardLbl}>Accuracy</span>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => resetLevel()}
                className={styles.replayBtn}
              >
                Replay
              </button>

              <button
                type="button"
                onClick={handleNextLevel}
                className={styles.nextLevelBtn}
              >
                <span>{level < LEVELS_CONFIG.length ? 'Next Level' : 'Back to Dashboard'}</span>
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
        gameTitle="BotScript: Block Coding"
        level={level}
        zonePath="/dashboard/kids"
      />
    </div>
  );
};

export default BotScript;
