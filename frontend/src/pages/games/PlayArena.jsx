import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
import { challengeApi, gameApi } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export const PlayArena = () => {
  const { gameSlug: paramGameSlug, slug, level = '1' } = useParams();
  const gameSlug = paramGameSlug || slug;
  const currentLevelNum = Number(level);
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

  // Fallback interactive layout
  const fallbackChallenge = {
    _id: 'mock-challenge-id',
    level: currentLevelNum,
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
        { id: 'c1', symbol: 'Puppy' }, { id: 'c2', symbol: 'Kitten' },
        { id: 'c3', symbol: 'Puppy' }, { id: 'c4', symbol: 'Kitten' }
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

  const loadChallenge = () => {
    setLoading(true);
    setTimerSeconds(0);
    setResultModalOpen(false);
    setAttemptResult(null);
    setActiveHintIndex(null);

    challengeApi.getForPlay(gameSlug, level, demographic)
      .then((res) => {
        if (res.data?.challenge) {
          setChallengeData(res.data.challenge);
          setGameData(res.data.game);
        } else {
          setChallengeData(fallbackChallenge);
          setGameData({ slug: gameSlug, title: gameSlug.replace(/-/g, ' ').toUpperCase(), engine: resolveEngineFromSlug(gameSlug) });
        }
      })
      .catch(() => {
        setChallengeData(fallbackChallenge);
        setGameData({ slug: gameSlug, title: gameSlug.replace(/-/g, ' ').toUpperCase(), engine: resolveEngineFromSlug(gameSlug) });
      })
      .finally(() => {
        setLoading(false);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setTimerSeconds((prev) => prev + 1);
        }, 1000);
      });
  };

  const resolveEngineFromSlug = (slug) => {
    if (slug?.includes('matrix') || slug?.includes('pattern') || slug?.includes('steps')) return 'GridMatrixEngine';
    if (slug?.includes('sequence') || slug?.includes('code') || slug?.includes('robo')) return 'SequenceCodeEngine';
    if (slug?.includes('pair') || slug?.includes('match') || slug?.includes('garden')) return 'CardMemoryEngine';
    if (slug?.includes('logic') || slug?.includes('quest') || slug?.includes('detective') || slug?.includes('math')) return 'ChoiceLogicEngine';
    if (slug?.includes('maze') || slug?.includes('puzzle') || slug?.includes('wayfinder')) return 'SpatialPathEngine';
    return 'GridMatrixEngine';
  };

  useEffect(() => {
    loadChallenge();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameSlug, level, demographic]);

  const handleSubmitAttempt = async (submittedAnswer) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSubmitting(true);

    try {
      if (challengeData?._id && challengeData._id !== 'mock-challenge-id' && isAuthenticated) {
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
          xpEarned: 150,
          rewardBreakdown: { base: 100, speedBonus: 50 },
          level: 1,
          totalXp: 150,
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
        return <GridMatrixEngine layout={layout} onSubmitAttempt={handleSubmitAttempt} disabled={isSubmitting} />;
    }
  };

  const hasNextLevel = currentLevelNum < 5;

  return (
    <div style={{ display: 'flex', gap: '1.5rem', height: 'calc(100vh - 110px)', overflow: 'hidden' }}>
      {/* ---------------- LEFT SIDE: 1–20 LEVEL GRID (PART-3 SPEC) ---------------- */}
      <div
        style={{
          width: '280px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid var(--border-subtle)',
          padding: '1.5rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--card-shadow)',
          overflowY: 'auto'
        }}
      >
        <div style={{ marginBottom: '1.25rem' }}>
          <Link
            to="/games"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', fontSize: '0.85rem', marginBottom: '0.75rem', textDecoration: 'none' }}
          >
            <ArrowLeft size={16} />
            <span>Games Library</span>
          </Link>
          <h2 style={{ fontSize: '1.2rem', color: '#1E293B', marginBottom: '0.2rem' }}>
            {gameData?.title || 'Game Arena'}
          </h2>
          <span className="demographic-pill" style={{ fontSize: '0.72rem' }}>
            Level Progression
          </span>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', marginBottom: '1.25rem', color: '#64748B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span>Done</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#5E5CE6' }} />
            <span>Current</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#CBD5E1' }} />
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
            const isFinished = isAuthenticated && lvl <= highestCompleted;
            const isCurrent = lvl === currentLevelNum;
            const isAvailable = lvl <= 5;
            const isUnlocked = isAvailable && (!isAuthenticated || lvl <= highestCompleted + 1);

            return (
              <button
                key={lvl}
                disabled={!isUnlocked}
                onClick={() => navigate(`/games/${gameSlug}/play/${lvl}`)}
                style={{
                  aspectRatio: '1 / 1',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  border: isCurrent ? '2px solid #5E5CE6' : '1px solid var(--border-subtle)',
                  backgroundColor: isFinished
                    ? '#10B981'
                    : isCurrent
                    ? '#5E5CE6'
                    : isUnlocked
                    ? '#F8FAFD'
                    : '#F1F5F9',
                  color: isFinished || isCurrent ? '#FFFFFF' : isUnlocked ? '#1E293B' : '#94A3B8',
                  boxShadow: isCurrent ? '0 0 12px rgba(94, 92, 230, 0.4)' : 'none',
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {!isUnlocked ? <Lock size={13} /> : lvl}
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '1.25rem', textAlign: 'center' }}>
          Levels 1–5 Available Now • Levels 6–20 Coming Soon
        </div>
      </div>

      {/* ---------------- RIGHT SIDE: ACTIVE GAMEPLAY CANVAS (PART-3 SPEC) ---------------- */}
      <div
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid var(--border-subtle)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--card-shadow)',
          overflowY: 'auto'
        }}
      >
        {/* Canvas Header (PART-3 SPEC: Timer, Score pill, Reset, Hint, Exit) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.25rem', borderBottom: '1.5px solid var(--border-subtle)', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span className="demographic-pill">Level {currentLevelNum}</span>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: '#FFF2EB',
                  color: '#FF8C42',
                  fontWeight: 800,
                  fontSize: '0.85rem'
                }}
              >
                <Trophy size={14} />
                <span>+{challengeData?.baseXp || 100} XP</span>
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
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-app)',
                fontWeight: 700,
                fontSize: '0.95rem',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <Clock size={16} color="var(--brand-primary)" />
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
                border: '1.5px solid #FDE68A',
                backgroundColor: '#FEF3C7',
                color: '#D97706',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <Lightbulb size={16} />
              <span>Get Hint</span>
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
                border: '1.5px solid var(--border-subtle)',
                backgroundColor: '#FFFFFF',
                color: '#64748B',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>

            {/* Exit Button */}
            <Link to="/games">
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.9rem',
                  borderRadius: '10px',
                  border: '1.5px solid #FEE2E2',
                  backgroundColor: '#FEF2F2',
                  color: '#EF4444',
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
              backgroundColor: '#FEF3C7',
              border: '1px solid #FDE68A',
              color: '#92400E',
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
          <h1 style={{ fontSize: '1.5rem', color: '#1E293B', marginBottom: '0.4rem' }}>
            {challengeData?.prompt}
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.88rem' }}>
            Par Time: {challengeData?.parTimeSeconds || 30}s • Target XP: {challengeData?.baseXp || 100} XP
          </p>
        </div>

        {/* Dynamic Engine Mount */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {renderGameEngine()}
        </div>
      </div>

      {/* ---------------- LEVEL COMPLETE RESULT MODAL (PART-3 SPEC) ---------------- */}
      <Modal
        isOpen={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
        title=""
      >
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          {/* Golden Trophy Graphic */}
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: attemptResult?.isCorrect
                ? 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)'
                : 'linear-gradient(135deg, #FECACA 0%, #EF4444 100%)',
              color: '#FFFFFF',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              boxShadow: '0 8px 24px rgba(245, 158, 11, 0.35)'
            }}
          >
            {attemptResult?.isCorrect ? <Trophy size={42} /> : <XCircle size={42} />}
          </div>

          <h2 style={{ fontSize: '1.9rem', color: '#1E293B', marginBottom: '0.35rem' }}>
            {attemptResult?.isCorrect ? 'Level Complete!' : 'Challenge Incomplete'}
          </h2>

          <p style={{ fontSize: '1rem', color: '#64748B', marginBottom: '1.25rem' }}>
            {attemptResult?.feedback}
          </p>

          {/* Stars Rating (PART-3 SPEC) */}
          {attemptResult?.isCorrect && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginBottom: '1.5rem', color: '#F59E0B' }}>
              <Star size={28} fill="currentColor" />
              <Star size={28} fill="currentColor" />
              <Star size={28} fill="currentColor" />
            </div>
          )}

          {/* Stats Breakdown Pill (PART-3 SPEC: Time, Moves, Score) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
              padding: '1.25rem',
              borderRadius: '16px',
              backgroundColor: '#F8FAFD',
              border: '1.5px solid var(--border-subtle)',
              marginBottom: '1.75rem'
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase' }}>Time Taken</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B' }}>{formatTimer(timerSeconds)}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase' }}>Accuracy</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10B981' }}>
                {attemptResult?.accuracyPercentage ?? 100}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase' }}>XP Awarded</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                +{attemptResult?.xpEarned || 0}
              </div>
            </div>
          </div>

          {/* Action Buttons (Next Level / Play Again) */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Button variant="secondary" onClick={loadChallenge} icon={<RotateCcw size={16} />} style={{ flex: 1 }}>
              Play Again
            </Button>

            {attemptResult?.isCorrect && hasNextLevel && (
              <Button
                className="btn-brand"
                onClick={() => {
                  setResultModalOpen(false);
                  navigate(`/games/${gameSlug}/play/${currentLevelNum + 1}`);
                }}
                icon={<ArrowRight size={18} />}
                style={{ flex: 2 }}
              >
                Next Level →
              </Button>
            )}

            {(!attemptResult?.isCorrect || !hasNextLevel) && (
              <Link to="/games" style={{ flex: 1 }}>
                <Button className="btn-brand" style={{ width: '100%' }}>
                  Games Library
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
