import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGameProgression, unlockNextLevel } from '../../../../../utils/gameProgression.js';
import GamePauseOverlay from '../../../../../components/GamePauseOverlay';
import styles from './HeritageMatch.module.css';
import heritageAudio from './HeritageMatchAudio.js';

// ---------------------------------------------------------------------------
// 10 TIMELESS CULTURAL & NATURE MOTIFS
// High contrast, universally recognized icons with large readable labels
// ---------------------------------------------------------------------------
export const MOTIFS = [
  { id: 'lotus', icon: '🪷', label: 'Lotus' },
  { id: 'peacock', icon: '🦚', label: 'Peacock' },
  { id: 'diya', icon: '🪔', label: 'Diya' },
  { id: 'violin', icon: '🎻', label: 'Violin' },
  { id: 'hibiscus', icon: '🌺', label: 'Hibiscus' },
  { id: 'temple', icon: '🏛️', label: 'Temple' },
  { id: 'banyan', icon: '🌿', label: 'Banyan' },
  { id: 'sunrise', icon: '☀️', label: 'Sunrise' },
  { id: 'dove', icon: '🕊️', label: 'Dove' },
  { id: 'chai', icon: '🍵', label: 'Chai' }
];

// ---------------------------------------------------------------------------
// 5 PROGRESSIVE RELAXED SENIORS LEVELS
// No timers, large touch targets, gentle pair progression
// ---------------------------------------------------------------------------
export const HERITAGE_LEVELS = [
  {
    level: 1,
    title: 'Gentle Start',
    subtitle: '3×2 Grid • 3 Harmonious Pairs',
    gridClass: styles.grid3x2,
    cols: 3,
    rows: 2,
    pairsCount: 3
  },
  {
    level: 2,
    title: 'Garden Walk',
    subtitle: '4×2 Grid • 4 Serene Nature Pairs',
    gridClass: styles.grid4x2,
    cols: 4,
    rows: 2,
    pairsCount: 4
  },
  {
    level: 3,
    title: 'Heritage Courtyard',
    subtitle: '4×3 Grid • 6 Traditional Pairs',
    gridClass: styles.grid4x3,
    cols: 4,
    rows: 3,
    pairsCount: 6
  },
  {
    level: 4,
    title: 'Golden Pavilion',
    subtitle: '4×4 Grid • 8 Balanced Pairs',
    gridClass: styles.grid4x4,
    cols: 4,
    rows: 4,
    pairsCount: 8
  },
  {
    level: 5,
    title: 'Grand Gallery',
    subtitle: '5×4 Grid • 10 Master Cultural Pairs',
    gridClass: styles.grid5x4,
    cols: 5,
    rows: 4,
    pairsCount: 10
  }
];

/**
 * Fisher-Yates Card Deck Generator
 */
function generateDeck(pairsCount) {
  const selectedMotifs = MOTIFS.slice(0, pairsCount);
  const cards = [];

  selectedMotifs.forEach((motif) => {
    // Each motif appears twice
    cards.push({
      cardId: `${motif.id}-a`,
      motifId: motif.id,
      icon: motif.icon,
      label: motif.label
    });
    cards.push({
      cardId: `${motif.id}-b`,
      motifId: motif.id,
      icon: motif.icon,
      label: motif.label
    });
  });

  // Shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}

/**
 * Inner Arena Component keyed by levelNum
 */
const HeritageMatchArena = ({
  levelConfig,
  onSelectLevel,
  onLevelComplete,
  soundMuted,
  onToggleSound,
  unlockedLevel = 1
}) => {
  const navigate = useNavigate();

  // Phases: 'BRIEFING' | 'PEEKING' | 'PLAYING' | 'VICTORY'
  const [phase, setPhase] = useState('BRIEFING');

  // Deck of cards
  const [deck, setDeck] = useState(() => generateDeck(levelConfig.pairsCount));

  // Matched card IDs: Set of cardId strings
  const [matchedCardIds, setMatchedCardIds] = useState(new Set());

  // Currently flipped/selected indices: array of 0, 1, or 2 card indices
  const [selectedIndices, setSelectedIndices] = useState([]);

  // Lock user clicks during flip-back or peek
  const [isLocked, setIsLocked] = useState(false);

  // Moves counter (gentle, zero stress)
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

  // Timers
  const peekTimerRef = useRef(null);
  const flipTimerRef = useRef(null);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (peekTimerRef.current) clearTimeout(peekTimerRef.current);
      if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
    };
  }, []);

  // Handle starting level from Briefing: Trigger 2.5s Gentle Initial Peek
  const handleStartPlaying = () => {
    heritageAudio.playBriefingStart();
    setPhase('PEEKING');
    setIsLocked(true);

    heritageAudio.playPeekStart();

    // After 2.5s peek, smoothly flip face-down and begin playing
    peekTimerRef.current = setTimeout(() => {
      setPhase('PLAYING');
      setIsLocked(false);
    }, 2500);
  };

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

  // Restart current level
  const handleRestartLevel = () => {
    if (peekTimerRef.current) clearTimeout(peekTimerRef.current);
    if (flipTimerRef.current) clearTimeout(flipTimerRef.current);

    setDeck(generateDeck(levelConfig.pairsCount));
    setMatchedCardIds(new Set());
    setSelectedIndices([]);
    setMovesCount(0);
    setIsLocked(false);

    handleStartPlaying();
  };

  // Card click handler
  const handleCardClick = (index) => {
    if (phase !== 'PLAYING' || isLocked || isPaused) return;

    const clickedCard = deck[index];
    if (!clickedCard) return;

    // Ignore if card is already matched or already selected
    if (matchedCardIds.has(clickedCard.cardId) || selectedIndices.includes(index)) {
      return;
    }

    // Flip the clicked card
    heritageAudio.playCardFlip();
    const newSelected = [...selectedIndices, index];
    setSelectedIndices(newSelected);

    // If first card flipped, wait for second card
    if (newSelected.length === 1) {
      return;
    }

    // If second card flipped, evaluate pair
    if (newSelected.length === 2) {
      setMovesCount(m => m + 1);
      const card1 = deck[newSelected[0]];
      const card2 = deck[newSelected[1]];

      if (card1.motifId === card2.motifId) {
        // MATCH FOUND!
        heritageAudio.playMatchCelebration();
        const nextMatched = new Set(matchedCardIds);
        nextMatched.add(card1.cardId);
        nextMatched.add(card2.cardId);
        setMatchedCardIds(nextMatched);
        setSelectedIndices([]);

        // Check if all pairs are matched
        if (nextMatched.size === deck.length) {
          setIsLocked(true);
          unlockNextLevel('heritage-match', levelConfig.level);
          const victoryTimer = setTimeout(() => {
            heritageAudio.playVictory();
            setPhase('VICTORY');
          }, 650);
          return () => clearTimeout(victoryTimer);
        }
      } else {
        // MISMATCH: Show for 1.1s so seniors can comfortably remember, then flip back
        setIsLocked(true);
        heritageAudio.playGentleMiss();

        flipTimerRef.current = setTimeout(() => {
          setSelectedIndices([]);
          setIsLocked(false);
        }, 1100);
      }
    }
  };

  // Pairs found count
  const pairsFound = Math.floor(matchedCardIds.size / 2);

  return (
    <>
      {/* --------------------------------------------------------------------
         UNIFIED COMPACT HEADER BAR (SINGLE ROW: RECOVERS ~180px)
         -------------------------------------------------------------------- */}
      <header className={styles.compactHeader}>
        {/* Left Section: Back to Sanctuary + Level Pills */}
        <div className={styles.headerLeft}>
          <Link to="/dashboard/seniors" className={styles.seniorsExitBtn} title="Return to Seniors Sanctuary">
            ← 🌿 Seniors Sanctuary
          </Link>

          <div className={styles.levelTabs}>
            {HERITAGE_LEVELS.map(l => {
              const isLocked = l.level > unlockedLevel;
              return (
                <button
                  key={l.level}
                  className={`${styles.tabBtn} ${l.level === levelConfig.level ? styles.tabBtnActive : ''} ${isLocked ? styles.tabBtnLocked : ''}`}
                  onClick={() => !isLocked && onSelectLevel(l.level)}
                  disabled={isLocked}
                  title={isLocked ? `Complete Level ${l.level - 1} to unlock` : `${l.title} (${l.pairsCount} Pairs)`}
                >
                  <span>L{l.level}</span>
                  {isLocked && <span className={styles.lockBadge}>🔒</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Section: Level Title & Pairs Count Badge */}
        <div className={styles.headerCenter}>
          <h1 className={styles.levelTitleText}>
            Level {levelConfig.level}: {levelConfig.title}
          </h1>
          <span className={styles.levelBadge}>{levelConfig.pairsCount} Pairs</span>
        </div>

        {/* Right Section: Live Metrics & Quick Actions */}
        <div className={styles.headerRight}>
          <div className={styles.metricsGroup}>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Pairs:</span>
              <span className={styles.metricValEmerald}>
                {pairsFound} / {levelConfig.pairsCount}
              </span>
            </div>
            <div className={styles.metricDivider} />
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Moves:</span>
              <span className={styles.metricValGold}>{movesCount}</span>
            </div>
          </div>

          <div className={styles.actionBtns}>
            <button
              className={styles.compactActionBtn}
              onClick={() => setIsPaused(true)}
              title="Pause Game (Esc or P)"
            >
              <span>⏸</span> Pause
            </button>

            <button
              className={styles.compactActionBtn}
              onClick={handleRestartLevel}
              title="Restart this level with a fresh shuffle"
            >
              <span>↺</span> Reshuffle
            </button>

            <button
              className={styles.iconBtn}
              onClick={() => setPhase('BRIEFING')}
              title="Read Activity Overview"
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
      </header>

      {/* --------------------------------------------------------------------
         MAIN PLAYING STAGE (FLEX-CENTERED IN REMAINING HEIGHT)
         -------------------------------------------------------------------- */}
      <div className={styles.stageWrapper}>
        {/* 2.5s Gentle Initial Peek Banner */}
        {phase === 'PEEKING' && (
          <div className={styles.peekBanner}>
            <span>🌿</span>
            <span>Take a moment to look at the cards...</span>
          </div>
        )}

        {/* Cards Grid */}
        <div
          className={`${styles.cardsGrid} ${levelConfig.gridClass}`}
          role="grid"
          aria-label={`${levelConfig.title} Cards Grid`}
        >
          {deck.map((card, idx) => {
            const isFlipped =
              phase === 'PEEKING' ||
              matchedCardIds.has(card.cardId) ||
              selectedIndices.includes(idx);
            const isMatched = matchedCardIds.has(card.cardId);

            return (
              <div
                key={card.cardId}
                className={`
                  ${styles.cardContainer}
                  ${isFlipped ? styles.cardFlippedContainer : ''}
                  ${isMatched ? styles.cardMatched : ''}
                `}
                onClick={() => handleCardClick(idx)}
                onMouseEnter={() => !isFlipped && heritageAudio.playHoverTick()}
                role="button"
                tabIndex={0}
                draggable="false"
                aria-label={`Tile ${idx + 1}: ${isFlipped ? card.label : 'Hidden'}`}
              >
                <div
                  className={`
                    ${styles.cardInner}
                    ${isFlipped ? styles.cardInnerFlipped : ''}
                  `}
                  draggable="false"
                >
                  {/* Card Back (Face-Down): Tactile Numbered Silk-Textured Tile */}
                  <div className={`${styles.cardFace} ${styles.cardBack}`} draggable="false">
                    <span className={styles.tileNumber} draggable="false">{idx + 1}</span>
                  </div>

                  {/* Card Front (Face-Up): Inside-Only Cultural Medallion Reveal */}
                  <div className={`${styles.cardFace} ${styles.cardFront}`} draggable="false">
                    <div className={styles.iconMedallion} draggable="false">
                      <span className={styles.cardIcon} draggable="false">{card.icon}</span>
                    </div>
                    <span className={styles.cardLabel} draggable="false">{card.label}</span>
                    {isMatched && (
                      <span className={styles.matchCheckBadge} draggable="false">✓</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --------------------------------------------------------------------
         PRE-LEVEL WELCOME BRIEFING OVERLAY
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
                Tap any two cards to flip them over and match the identical pairs at your own relaxed pace.
              </p>
            </div>

            {/* 2-Step Visual Guide with Real Game Deck Cards */}
            <div className={styles.visualGuideBox} draggable="false">
              {/* Example 1: Matching Pair */}
              <div className={styles.guideExample} draggable="false">
                <div className={styles.exampleCardsRow} draggable="false">
                  <div className={`${styles.miniCard} ${styles.miniCardMatched}`} draggable="false">
                    <div className={styles.miniMedallionMatched} draggable="false">
                      <span className={styles.miniCardIcon} draggable="false">🪷</span>
                    </div>
                    <span className={styles.miniCardLabel} draggable="false">Lotus</span>
                    <span className={styles.miniCheckBadge} draggable="false">✓</span>
                  </div>
                  <div className={`${styles.miniCard} ${styles.miniCardMatched}`} draggable="false">
                    <div className={styles.miniMedallionMatched} draggable="false">
                      <span className={styles.miniCardIcon} draggable="false">🪷</span>
                    </div>
                    <span className={styles.miniCardLabel} draggable="false">Lotus</span>
                    <span className={styles.miniCheckBadge} draggable="false">✓</span>
                  </div>
                </div>
                <div className={styles.guideCaptionMatch}>
                  <span className={styles.captionTagMatch}>✓ Pair Matched!</span>
                  <span className={styles.captionDesc}>Identical tiles lock with golden glow</span>
                </div>
              </div>

              {/* Example 2: Non-Matching Pair */}
              <div className={styles.guideExample} draggable="false">
                <div className={styles.exampleCardsRow} draggable="false">
                  <div className={styles.miniCard} draggable="false">
                    <div className={styles.miniMedallion} draggable="false">
                      <span className={styles.miniCardIcon} draggable="false">🦚</span>
                    </div>
                    <span className={styles.miniCardLabel} draggable="false">Peacock</span>
                  </div>
                  <div className={styles.miniCard} draggable="false">
                    <div className={styles.miniMedallion} draggable="false">
                      <span className={styles.miniCardIcon} draggable="false">🪔</span>
                    </div>
                    <span className={styles.miniCardLabel} draggable="false">Diya</span>
                  </div>
                </div>
                <div className={styles.guideCaptionMismatch}>
                  <span className={styles.captionTagMismatch}>✗ Different Cards</span>
                  <span className={styles.captionDesc}>Remember their spots & flip back</span>
                </div>
              </div>
            </div>

            <p className={styles.reassuranceText} draggable="false">
              <span>✨</span> There is no timer. Take all the time you need to enjoy the motifs.
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
         VICTORY MODAL OVERLAY (WARM & DIGNIFIED)
         -------------------------------------------------------------------- */}
      {phase === 'VICTORY' && (
        <div className={styles.modalOverlay} draggable="false">
          <div className={styles.victoryCard} draggable="false">
            <div className={styles.victoryIcon} draggable="false">🪷</div>
            <h2 className={styles.victoryTitle} draggable="false">Peaceful Completion!</h2>
            <p className={styles.victorySubtitle} draggable="false">
              You matched all {levelConfig.pairsCount} pairs with mindful care and attention.
            </p>

            <div className={styles.vitalityPill}>
              <span>🌿</span> +100 Vitality Points
            </div>

            <div className={styles.victoryStats}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Pairs Matched</span>
                <span className={styles.statValue}>
                  {levelConfig.pairsCount} / {levelConfig.pairsCount}
                </span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Turns Taken</span>
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

              {levelConfig.level < HERITAGE_LEVELS.length ? (
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
        onRestart={handleRestartLevel}
        onExit={() => navigate('/dashboard/seniors')}
        gameTitle={`Heritage Match: ${levelConfig.title}`}
        level={levelConfig.level}
        zonePath="/dashboard/seniors"
      />
    </>
  );
};

/**
 * Main Controller Component
 */
export const HeritageMatch = ({ initialLevel = 1 }) => {
  const { unlockedLevel, unlockNextLevel: triggerUnlockNext, isLevelUnlocked } = useGameProgression('heritage-match');
  const [levelNum, setLevelNum] = useState(
    () => Math.min(Math.max(initialLevel, 1), Math.min(unlockedLevel, HERITAGE_LEVELS.length))
  );
  const [soundMuted, setSoundMuted] = useState(false);

  // Keep level clamped if unlockedLevel changes
  useEffect(() => {
    if (levelNum > unlockedLevel) {
      setLevelNum(unlockedLevel);
    }
  }, [unlockedLevel, levelNum]);

  const levelConfig = useMemo(
    () => HERITAGE_LEVELS[levelNum - 1] || HERITAGE_LEVELS[0],
    [levelNum]
  );

  const handleNextLevel = () => {
    if (levelNum < HERITAGE_LEVELS.length) {
      triggerUnlockNext(levelNum);
      setLevelNum(l => l + 1);
    }
  };

  const handleSelectLevel = (lvl) => {
    if (!isLevelUnlocked(lvl)) return;
    setLevelNum(lvl);
  };

  const handleToggleSound = () => {
    const nextMuted = !soundMuted;
    setSoundMuted(nextMuted);
    heritageAudio.setMuted(nextMuted);
  };

  return (
    <div className={styles.arenaContainer}>
      {/* Keyed Arena Component to Guarantee Fresh Deck & State on Level Switch */}
      <HeritageMatchArena
        key={`heritage-match-level-${levelNum}`}
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

export default HeritageMatch;
