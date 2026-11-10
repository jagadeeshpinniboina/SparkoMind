import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button.jsx';
import { Sparkles, Brain, Lightbulb, Rocket, Star, Layers, Trophy } from 'lucide-react';

export const CardMemoryEngine = ({ layout, onSubmitAttempt, disabled = false }) => {
  const cards = layout?.cards || [];
  const [flippedIds, setFlippedIds] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [mismatches, setMismatches] = useState(0);

  // Icon symbol lookup
  const getSymbolIcon = (symbol) => {
    switch (symbol) {
      case 'Brain': return <Brain size={28} />;
      case 'Lightbulb': return <Lightbulb size={28} />;
      case 'Rocket': return <Rocket size={28} />;
      case 'Star': return <Star size={28} />;
      default: return <Sparkles size={28} />;
    }
  };

  const handleCardClick = (card) => {
    if (disabled || flippedIds.includes(card.id) || matchedIds.includes(card.id) || flippedIds.length >= 2) {
      return;
    }

    const nextFlipped = [...flippedIds, card.id];
    setFlippedIds(nextFlipped);

    if (nextFlipped.length === 2) {
      const card1 = cards.find((c) => c.id === nextFlipped[0]);
      const card2 = cards.find((c) => c.id === nextFlipped[1]);

      // Check client-side pair matching visual
      if (card1?.symbol === card2?.symbol) {
        setMatchedIds((prev) => [...prev, card1.id, card2.id]);
        setFlippedIds([]);
      } else {
        setMismatches((prev) => prev + 1);
        setTimeout(() => {
          setFlippedIds([]);
        }, 900);
      }
    }
  };

  const totalPairs = cards.length / 2;
  const completedPairs = matchedIds.length / 2;
  const isFinished = completedPairs === totalPairs && totalPairs > 0;

  const handleSubmit = () => {
    if (disabled) return;
    onSubmitAttempt({
      completedPairs,
      mismatches,
      matchedCount: completedPairs
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%', maxWidth: '520px', margin: '0 auto' }}>
      {/* Pairs Progress Counter */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0.75rem 1.25rem',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.9rem',
          fontWeight: 600
        }}
      >
        <span>Pairs Matched: <strong style={{ color: 'var(--color-primary)' }}>{completedPairs} / {totalPairs}</strong></span>
        <span>Flips: <strong style={{ color: 'var(--text-secondary)' }}>{mismatches + completedPairs}</strong></span>
      </div>

      {/* Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: '12px',
          width: '100%'
        }}
      >
        {cards.map((card) => {
          const isFlipped = flippedIds.includes(card.id);
          const isMatched = matchedIds.includes(card.id);
          const isOpen = isFlipped || isMatched;

          return (
            <button
              key={card.id}
              type="button"
              disabled={disabled || isOpen}
              onClick={() => handleCardClick(card)}
              style={{
                aspectRatio: '1 / 1',
                borderRadius: 'var(--radius-sm)',
                border: isMatched
                  ? '2px solid var(--color-success)'
                  : isOpen
                  ? '2px solid var(--color-primary)'
                  : '2px solid var(--border-subtle)',
                backgroundColor: isOpen ? 'var(--bg-surface)' : 'var(--color-primary-light)',
                color: isMatched
                  ? 'var(--color-success)'
                  : isOpen
                  ? 'var(--color-primary)'
                  : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isOpen ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                transform: isOpen ? 'scale(0.96)' : 'scale(1)',
                transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: isOpen ? 'default' : 'pointer'
              }}
              aria-label={isOpen ? card.symbol : 'Hidden card'}
            >
              {isOpen ? getSymbolIcon(card.symbol) : <Layers size={22} style={{ color: 'var(--color-primary)' }} />}
            </button>
          );
        })}
      </div>

      {/* Submit Button */}
      <div style={{ width: '100%' }}>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!isFinished || disabled}
          style={{ width: '100%' }}
          icon={isFinished ? <Trophy size={18} /> : null}
        >
          {isFinished ? 'Submit Completed Pairs' : `Match All Cards (${completedPairs}/${totalPairs})`}
        </Button>
      </div>
    </div>
  );
};

export default CardMemoryEngine;
