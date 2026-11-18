import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation, useSearchParams, Link, Navigate } from 'react-router-dom';
import { 
  Clock, Trophy, ArrowLeft, RotateCcw, Sparkles, CheckCircle2, 
  XCircle, ArrowRight, Lightbulb, Lock, Star, Award, LogOut 
} from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import GridMatrixEngine from '../../engines/GridMatrixEngine/index.jsx';
import SequenceCodeEngine from '../../engines/SequenceCodeEngine/index.jsx';
import CardMemoryEngine from '../../engines/CardMemoryEngine/index.jsx';
import ChoiceLogicEngine from '../../engines/ChoiceLogicEngine/index.jsx';
import SpatialPathEngine from '../../engines/SpatialPathEngine/index.jsx';
import BotScript from '../dashboard/games/Kids/BotScript';
import { challengeApi, gameApi } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export const PlayArena = () => {
  const { gameSlug: paramGameSlug, slug, gameId, level: paramLevel = '1' } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const queryLevel = searchParams.get('level');
  const gameSlug = gameId || paramGameSlug || slug;
  const currentLevelNum = Number(queryLevel || paramLevel || 1);
  const navigate = useNavigate();
  const { user, progress, updateProfileProgress, isAuthenticated } = useAuth();
  const { demographic } = useTheme();

  const [loading, setLoading] = useState(true);
  const [challengeData, setChallengeData] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [attemptResult, setAttemptResult] = useState(null);
  const [activeHintIndex, setActiveHintIndex] = useState(null);
  const timerRef = useRef(null);

  // Highest completed level
  const highestCompleted = isAuthenticated && progress?.completedGameLevels
    ? (progress.completedGameLevels[gameData?._id] || progress.completedGameLevels[gameSlug] || 0)
    : 5;

  const isKidsRoute = location.pathname.includes('/dashboard/kids/play') || demographic === 'kids';

  const navigateToLevel = (lvl) => {
    if (location.pathname.includes('/dashboard/kids/play')) {
      navigate(`/dashboard/kids/play/${gameSlug}?level=${lvl}`);
    } else {
      navigate(`/games/${gameSlug}/play/${lvl}`);
    }
  };

  const resolveGameMeta = (s) => {
    const metaMap = {
      'bot-script': { title: 'BotScript: Visual Block Coding & Loops', engine: 'SequenceCodeEngine', domain: 'Robotics & AI' },
      'robo-rescue': { title: 'BotScript: Visual Block Coding & Loops', engine: 'SequenceCodeEngine', domain: 'Robotics & AI' },
      'vision-craft': { title: 'VisionCraft: Train-The-Bot', engine: 'ChoiceLogicEngine', domain: 'Robotics & AI' },
      'cyber-weave': { title: 'CyberWeave: The Logic Loom', engine: 'ChoiceLogicEngine', domain: 'Robotics & AI' },
      'data-shield': { title: 'DataShield: Cyber Defender Academy', engine: 'ChoiceLogicEngine', domain: 'Cyber & Defense' },
      'gravity-sling': { title: 'GravitySling: Orbital Mechanics Lab', engine: 'ChoiceLogicEngine', domain: 'Space & Physics' },
      'memory-match': { title: 'Eco-Scanner: Bio-Mimicry AI Lens', engine: 'CardMemoryEngine', domain: 'Cyber & Memory' },
      'pattern-planet': { title: 'Constellation Grid: Polar Coordinates', engine: 'GridMatrixEngine', domain: 'Logic & Math' },
      'maze-explorer': { title: 'Rover Path: Energy-Constrained Dijkstra', engine: 'SpatialPathEngine', domain: 'Logic & Math' },
      'math-quest': { title: 'Alchemica: Kinetic Physics & Balancing', engine: 'ChoiceLogicEngine', domain: 'Logic & Math' }
    };
    return metaMap[s] || { 
      title: s ? s.replace(/-/g, ' ').toUpperCase() : 'GAME ARENA', 
      engine: resolveEngineFromSlug(s), 
      domain: 'Cognitive' 
    };
  };

  const resolveEngineFromSlug = (s) => {
    if (!s) return 'GridMatrixEngine';
    if (s.includes('matrix') || s.includes('pattern') || s.includes('steps')) return 'GridMatrixEngine';
    if (s.includes('sequence') || s.includes('code') || s.includes('robo') || s.includes('bot')) return 'SequenceCodeEngine';
    if (s.includes('pair') || s.includes('match') || s.includes('garden') || s.includes('scanner')) return 'CardMemoryEngine';
    if (s.includes('logic') || s.includes('quest') || s.includes('detective') || s.includes('math') || s.includes('weave') || s.includes('vision') || s.includes('craft') || s.includes('shield') || s.includes('biosphere') || s.includes('gravity') || s.includes('alchemica')) return 'ChoiceLogicEngine';
    if (s.includes('maze') || s.includes('puzzle') || s.includes('wayfinder') || s.includes('rover')) return 'SpatialPathEngine';
    return 'GridMatrixEngine';
  };

  const getFallbackChallenge = (s, lvl) => {
    switch (s) {
      case 'bot-script':
      case 'robo-rescue':
        return {
          _id: 'mock-bot-script-' + lvl,
          level: lvl,
          prompt: `Level ${lvl} Block Coding: Program the rescue robot command sequence to bypass obstacles and reach the emergency switch!`,
          parTimeSeconds: 30,
          baseXp: 120,
          hints: ['Use repetition loops and sensor checks to minimize redundant code lines.'],
          layout: {
            tokens: [
              { id: 't1', label: 'Move Forward', color: '#8B5CF6' },
              { id: 't2', label: 'Turn 90°', color: '#3B82F6' },
              { id: 't3', label: 'Repeat 3x', color: '#F59E0B' },
              { id: 't4', label: 'If Sensor -> Spray Foam', color: '#10B981' }
            ]
          }
        };
      case 'cyber-weave':
        return {
          _id: 'mock-cyber-weave-' + lvl,
          level: lvl,
          prompt: `Level ${lvl} Logic Circuit: Wire the gates so the automated hydroponic pump activates when Soil is Dry (A=False) AND Temperature is Warm (B=True).`,
          parTimeSeconds: 30,
          baseXp: 120,
          hints: ['Use NOT on Moisture to invert False to True, then connect to AND with Temperature.'],
          layout: {
            options: [
              { id: 'opt-1', text: 'NOT(Moisture) AND Temperature' },
              { id: 'opt-2', text: 'Moisture OR NOT(Temperature)' },
              { id: 'opt-3', text: 'Moisture AND Temperature' },
              { id: 'opt-4', text: 'NOT(Moisture) XOR Temperature' }
            ]
          }
        };
      case 'vision-craft':
        return {
          _id: 'mock-vision-craft-' + lvl,
          level: lvl,
          prompt: `Level ${lvl} Model Training: The lunar rover vision model misclassified a white dog at night. How do you mitigate dataset bias?`,
          parTimeSeconds: 35,
          baseXp: 120,
          hints: ['Machine learning classifiers require diverse lighting, angles, and varied coat patterns.'],
          layout: {
            options: [
              { id: 'opt-1', text: 'Add diverse night-vision samples and varied coat patterns to the training set' },
              { id: 'opt-2', text: 'Only train on sunny daylight pictures of brown dogs' },
              { id: 'opt-3', text: 'Lower the model confidence threshold to 10%' },
              { id: 'opt-4', text: 'Disable edge-detection filters and train solely on color hue' }
            ]
          }
        };
      case 'biosphere-9':
        return {
          _id: 'mock-biosphere-9-' + lvl,
          level: lvl,
          prompt: `Level ${lvl} Planetary Equilibrium: After herbivore beetles multiply, they overgraze canopy ferns and oxygen crashes. Which ecological introduction restores balance?`,
          parTimeSeconds: 35,
          baseXp: 120,
          hints: ['Trophic cascades: Apex predators control herbivore overpopulation to allow plant biomass to recover.'],
          layout: {
            options: [
              { id: 'opt-1', text: 'Introduce chameleon predator lizards to stabilize the beetle population' },
              { id: 'opt-2', text: 'Double the beetle count to consume dead moss' },
              { id: 'opt-3', text: 'Shut down all atmospheric water condensers' },
              { id: 'opt-4', text: 'Clear the remaining canopy ferns from the bio-dome' }
            ]
          }
        };
      case 'data-shield':
        return {
          _id: 'mock-data-shield-' + lvl,
          level: lvl,
          prompt: `Level ${lvl} Digital Forensics: You receive an urgent chat: "Your account is locked! Click http://sparkomind-rewards.xyz/login for 10k gems!". What is the safest response?`,
          parTimeSeconds: 25,
          baseXp: 120,
          hints: ['Look at the domain age, misspelled URL, insecure HTTP protocol, and artificial urgency.'],
          layout: {
            options: [
              { id: 'opt-1', text: 'Quarantine the link as a phishing lure and report the spoofed domain' },
              { id: 'opt-2', text: 'Click the link immediately to verify if the gems are authentic' },
              { id: 'opt-3', text: 'Reply with your password to confirm identity' },
              { id: 'opt-4', text: 'Forward the message to your entire contact list' }
            ]
          }
        };
      case 'gravity-sling':
        return {
          _id: 'mock-gravity-sling-' + lvl,
          level: lvl,
          prompt: `Level ${lvl} Orbital Trajectory: The deep-space probe must reach Jupiter without exhausting its finite rocket fuel budget. Which navigational maneuver achieves this?`,
          parTimeSeconds: 30,
          baseXp: 120,
          hints: ['A gravitational assist (slingshot) around a lunar body transfers orbital momentum without burning fuel.'],
          layout: {
            options: [
              { id: 'opt-1', text: 'Execute a lunar gravitational slingshot assist to accelerate for free' },
              { id: 'opt-2', text: 'Burn 100% fuel in a straight vector through the asteroid field' },
              { id: 'opt-3', text: 'Cut all thrusters and drift with zero escape velocity' },
              { id: 'opt-4', text: 'Drop into a stationary low-Earth parking orbit' }
            ]
          }
        };
      default:
        return {
          _id: 'mock-challenge-id',
          level: lvl,
          prompt: 'Observe the visual elements carefully and solve according to the rules.',
          parTimeSeconds: 30,
          baseXp: 100,
          hints: ['Focus on landmarks and patterns.'],
          layout: {
            gridSize: 3,
            previewTiles: [0, 4, 8],
            displayDurationMs: 2500,
            tokens: [
              { id: 'red', label: 'Ruby Red', color: '#EF4444' },
              { id: 'blue', label: 'Sky Blue', color: '#3B82F6' },
              { id: 'yellow', label: 'Sun Yellow', color: '#EAB308' },
              { id: 'green', label: 'Leaf Green', color: '#22C55E' }
            ],
            cards: [
              { id: 'c1', symbol: 'Star' }, { id: 'c2', symbol: 'Rocket' },
              { id: 'c3', symbol: 'Star' }, { id: 'c4', symbol: 'Rocket' }
            ],
            options: [
              { id: 'opt-a', text: 'Option Alpha' },
              { id: 'opt-b', text: 'Option Beta' }
            ],
            gridRows: 3,
            gridCols: 3,
            startNode: { row: 0, col: 0 },
            endNode: { row: 2, col: 2 },
            blockedNodes: [{ row: 1, col: 1 }]
          }
        };
    }
  };

  const loadChallenge = () => {
    setLoading(true);
    setTimerSeconds(0);
    setResultModalOpen(false);
    setAttemptResult(null);
    setActiveHintIndex(null);

    const meta = resolveGameMeta(gameSlug);

    challengeApi.getForPlay(gameSlug, currentLevelNum, demographic)
      .then((res) => {
        if (res.data?.challenge) {
          setChallengeData(res.data.challenge);
          setGameData(res.data.game || { slug: gameSlug, title: meta.title, engine: meta.engine });
        } else {
          setChallengeData(getFallbackChallenge(gameSlug, currentLevelNum));
          setGameData({ slug: gameSlug, title: meta.title, engine: meta.engine });
        }
      })
      .catch(() => {
        setChallengeData(getFallbackChallenge(gameSlug, currentLevelNum));
        setGameData({ slug: gameSlug, title: meta.title, engine: meta.engine });
      })
      .finally(() => {
        setLoading(false);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setTimerSeconds((prev) => prev + 1);
        }, 1000);
      });
  };

  useEffect(() => {
    loadChallenge();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameSlug, currentLevelNum, demographic]);

  const handleSubmitAttempt = async (submittedAnswer) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSubmitting(true);

    try {
      if (challengeData?._id && !challengeData._id.startsWith('mock-') && isAuthenticated) {
        const res = await challengeApi.submitAttempt(challengeData._id, {
          submittedAnswer,
          timeTakenSeconds: timerSeconds
        });
        setAttemptResult(res.data);
        if (res.data?.totalXp !== undefined) {
          updateProfileProgress({
            totalXp: res.data.totalXp,
            level: res.data.level
          });
        }
      } else {
        // Fallback demo validation
        setAttemptResult({
          isCorrect: true,
          accuracyPercentage: 100,
          feedback: 'Challenge Solved! Outstanding performance.',
          xpEarned: challengeData?.baseXp || 120,
          rewardBreakdown: { base: 100, speedBonus: 20 },
          level: currentLevelNum,
          totalXp: (progress?.totalXp || 450) + 120,
          leveledUp: false
        });
      }
    } catch (err) {
      setAttemptResult({
        isCorrect: false,
        accuracyPercentage: 0,
        feedback: err.message || 'Error validating attempt with server.',
        xpEarned: 10
      });
    } finally {
      setIsSubmitting(false);
      setResultModalOpen(true);
    }
  };

  const handleShowHint = () => {
    if (challengeData?.hints && challengeData.hints.length > 0) {
      setActiveHintIndex(0);
    } else {
      alert('Hint: Carefully observe the symmetrical alignments and landmarks.');
    }
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const renderGameEngine = () => {
    const engineType = gameData?.engine || resolveEngineFromSlug(gameSlug);
    const layout = challengeData?.layout || {};

    switch (engineType) {
      case 'GridMatrixEngine':
        return <GridMatrixEngine layout={layout} onSubmitAttempt={handleSubmitAttempt} disabled={isSubmitting} />;
      case 'SequenceCodeEngine':
        return <SequenceCodeEngine layout={layout} onSubmitAttempt={handleSubmitAttempt} disabled={isSubmitting} />;
      case 'CardMemoryEngine':
        return <CardMemoryEngine layout={layout} onSubmitAttempt={handleSubmitAttempt} disabled={isSubmitting} />;
      case 'ChoiceLogicEngine':
        return <ChoiceLogicEngine layout={layout} onSubmitAttempt={handleSubmitAttempt} disabled={isSubmitting} />;
      case 'SpatialPathEngine':
        return <SpatialPathEngine layout={layout} onSubmitAttempt={handleSubmitAttempt} disabled={isSubmitting} />;
      default:
        return <ChoiceLogicEngine layout={layout} onSubmitAttempt={handleSubmitAttempt} disabled={isSubmitting} />;
    }
  };

  const hasNextLevel = currentLevelNum < 5;
  const gameMeta = resolveGameMeta(gameSlug);

  // Dedicated Interactive Game Engines
  if (gameSlug === 'bot-script' || gameSlug === 'robo-rescue') {
    return (
      <div data-theme="dark" style={{ height: '100%', width: '100%' }}>
        <BotScript initialLevel={currentLevelNum} />
      </div>
    );
  }

  if (gameSlug === 'heritage-match' || gameSlug === 'heritagematch') {
    return <Navigate to={`/dashboard/seniors/play/heritage-match?level=${currentLevelNum}`} replace />;
  }

  return (
    <div style={{ display: 'flex', gap: '1.5rem', height: 'calc(100vh - 120px)', overflow: 'hidden' }}>
      {/* ---------------- LEFT SIDE: 1–20 LEVEL GRID ---------------- */}
      <div
        style={{
          width: '280px',
          backgroundColor: '#090D1A',
          borderRadius: '20px',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          padding: '1.5rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          overflowY: 'auto'
        }}
      >
        <div style={{ marginBottom: '1.25rem' }}>
          <Link
            to={isKidsRoute ? "/dashboard/kids" : "/games"}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              color: '#94A3B8', 
              fontSize: '0.85rem', 
              marginBottom: '0.75rem', 
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}
          >
            <ArrowLeft size={16} />
            <span>{isKidsRoute ? 'Active Quests' : 'Games Library'}</span>
          </Link>
          
          <h2 style={{ fontSize: '1.15rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '0.35rem', lineHeight: 1.2 }}>
            {gameMeta.title}
          </h2>

          <div style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: '9999px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#F59E0B', fontSize: '0.7rem', fontWeight: 700 }}>
            {gameMeta.domain}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', marginBottom: '1.25rem', color: '#94A3B8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span>Done</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
            <span>Active</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#475569' }} />
            <span>Locked</span>
          </div>
        </div>

        {/* Level Grid (1 to 20 nodes with 5 active) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
            marginBottom: 'auto'
          }}
        >
          {Array.from({ length: 20 }).map((_, idx) => {
            const lvl = idx + 1;
            const isFinished = isAuthenticated && lvl < currentLevelNum;
            const isCurrent = lvl === currentLevelNum;
            const isAvailable = lvl <= 5;
            const isUnlocked = isAvailable;

            return (
              <button
                key={lvl}
                disabled={!isUnlocked}
                onClick={() => navigateToLevel(lvl)}
                style={{
                  aspectRatio: '1 / 1',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  border: isCurrent 
                    ? '2px solid #F59E0B' 
                    : isFinished 
                    ? '1px solid rgba(16, 185, 129, 0.4)' 
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: isCurrent
                    ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                    : isFinished
                    ? 'rgba(16, 185, 129, 0.2)'
                    : isUnlocked
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(255, 255, 255, 0.02)',
                  color: isCurrent ? '#070A11' : isFinished ? '#10B981' : isUnlocked ? '#FFFFFF' : '#475569',
                  boxShadow: isCurrent ? '0 0 14px rgba(245, 158, 11, 0.5)' : 'none',
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease'
                }}
              >
                {!isUnlocked ? <Lock size={12} /> : lvl}
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '1.25rem', textAlign: 'center' }}>
          Levels 1–5 Available Now • Levels 6–20 in Orbit
        </div>
      </div>

      {/* ---------------- RIGHT SIDE: ACTIVE GAMEPLAY CANVAS ---------------- */}
      <div
        style={{
          flex: 1,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(16px)',
          borderRadius: '20px',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          overflowY: 'auto'
        }}
      >
        {/* Canvas Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ padding: '4px 10px', borderRadius: '9999px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#F59E0B', fontWeight: 800, fontSize: '0.8rem' }}>
                Level {currentLevelNum}
              </span>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#FDE68A',
                  fontWeight: 800,
                  fontSize: '0.8rem'
                }}
              >
                <Trophy size={14} />
                <span>+{challengeData?.baseXp || 120} XP</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Timer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 1rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                fontWeight: 700,
                fontSize: '0.92rem',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <Clock size={16} color="#F59E0B" />
              <span>{formatTimer(timerSeconds)}</span>
            </div>

            {/* Hint Button */}
            <button
              onClick={handleShowHint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.9rem',
                borderRadius: '10px',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                color: '#F59E0B',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <Lightbulb size={16} />
              <span>Hint</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={loadChallenge}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.9rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#94A3B8',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>

            {/* Exit Button */}
            <Link to={isKidsRoute ? "/dashboard/kids" : "/games"}>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.9rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#F87171',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <LogOut size={16} />
                <span>Exit</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Hint Banner if Active */}
        {activeHintIndex !== null && challengeData?.hints?.[activeHintIndex] && (
          <div
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#FDE68A',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem'
            }}
          >
            <Lightbulb size={18} />
            <span><strong>Hint:</strong> {challengeData.hints[activeHintIndex]}</span>
          </div>
        )}

        {/* Challenge Prompt */}
        <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.45rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '0.4rem' }}>
            {challengeData?.prompt}
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem' }}>
            Par Time: {challengeData?.parTimeSeconds || 30}s • Target Reward: +{challengeData?.baseXp || 120} XP
          </p>
        </div>

        {/* Dynamic Engine Mount */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {renderGameEngine()}
        </div>
      </div>

      {/* ---------------- LEVEL COMPLETE RESULT MODAL ---------------- */}
      <Modal
        isOpen={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
        title=""
      >
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          {/* Trophy Graphic */}
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: attemptResult?.isCorrect
                ? 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)'
                : 'linear-gradient(135deg, #FECACA 0%, #EF4444 100%)',
              color: '#070A11',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)'
            }}
          >
            {attemptResult?.isCorrect ? <Trophy size={42} /> : <XCircle size={42} />}
          </div>

          <h2 style={{ fontSize: '1.9rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '0.35rem' }}>
            {attemptResult?.isCorrect ? 'Level Complete!' : 'Challenge Incomplete'}
          </h2>

          <p style={{ fontSize: '1rem', color: '#94A3B8', marginBottom: '1.25rem' }}>
            {attemptResult?.feedback}
          </p>

          {/* Stars Rating */}
          {attemptResult?.isCorrect && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginBottom: '1.5rem', color: '#F59E0B' }}>
              <Star size={28} fill="currentColor" />
              <Star size={28} fill="currentColor" />
              <Star size={28} fill="currentColor" />
            </div>
          )}

          {/* Stats Breakdown Pill */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
              padding: '1.25rem',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '1.75rem'
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Time Taken</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>{formatTimer(timerSeconds)}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>Accuracy</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10B981' }}>
                {attemptResult?.accuracyPercentage ?? 100}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase' }}>XP Awarded</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F59E0B' }}>
                +{attemptResult?.xpEarned || 0}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Button variant="secondary" onClick={loadChallenge} icon={<RotateCcw size={16} />} style={{ flex: 1 }}>
              Play Again
            </Button>

            {attemptResult?.isCorrect && hasNextLevel && (
              <Button
                className="btn-brand"
                onClick={() => {
                  setResultModalOpen(false);
                  navigateToLevel(currentLevelNum + 1);
                }}
                icon={<ArrowRight size={18} />}
                style={{ flex: 2 }}
              >
                Next Level →
              </Button>
            )}

            {(!attemptResult?.isCorrect || !hasNextLevel) && (
              <Link to={isKidsRoute ? "/dashboard/kids" : "/games"} style={{ flex: 1 }}>
                <Button className="btn-brand" style={{ width: '100%' }}>
                  {isKidsRoute ? 'Active Quests' : 'Games Library'}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PlayArena;
