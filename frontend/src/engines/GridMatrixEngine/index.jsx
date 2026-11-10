import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button.jsx';
import { Eye, CheckCircle2, RotateCcw } from 'lucide-react';

export const GridMatrixEngine = ({ layout, onSubmitAttempt, disabled = false }) => {
  const gridSize = layout?.gridSize || 3;
  const previewTiles = layout?.previewTiles || [];
  const displayDurationMs = layout?.displayDurationMs || 2500;

  const [phase, setPhase] = useState('memorize'); // 'memorize' | 'interact'
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [countdownPercent, setCountdownPercent] = useState(100);

  // Memorization Phase Timer
  useEffect(() => {
    setSelectedTiles([]);
    setPhase('memorize');
    setCountdownPercent(100);

    const stepMs = 50;
    const interval = setInterval(() => {
      setCountdownPercent((prev) => {
        const nextVal = prev - (stepMs / displayDurationMs) * 100;
        return nextVal > 0 ? nextVal : 0;
      });
    }, stepMs);

    const timer = setTimeout(() => {
      setPhase('interact');
      clearInterval(interval);
    }, displayDurationMs);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [layout, displayDurationMs]);

  const handleTileClick = (index) => {
    if (phase !== 'interact' || disabled) return;

    setSelectedTiles((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleReset = () => {
    if (phase === 'interact') {
      setSelectedTiles([]);
    }
  };

  const handleSubmit = () => {
    if (phase !== 'interact' || disabled) return;
    onSubmitAttempt({ tiles: selectedTiles });
  };

  const totalTiles = gridSize * gridSize;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%', maxWidth: '440px', margin: '0 auto' }}>
      {/* Phase Status Banner */}
      <div
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: phase === 'memorize' ? 'var(--color-primary-light)' : 'var(--bg-surface-elevated)',
          color: phase === 'memorize' ? 'var(--color-primary)' : 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 600,
          fontSize: '0.9rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {phase === 'memorize' ? <Eye size={18} /> : <CheckCircle2 size={18} />}
          <span>{phase === 'memorize' ? 'Memorize the Glowing Pattern!' : 'Recreate the Pattern Now!'}</span>
        </div>
        {phase === 'memorize' && (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {Math.ceil((countdownPercent / 100) * (displayDurationMs / 1000))}s
          </span>
        )}
      </div>

      {/* Countdown Progress Bar */}
      {phase === 'memorize' && (
        <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${countdownPercent}%`,
              backgroundColor: 'var(--color-primary)',
              transition: 'width 50ms linear'
            }}
          />
        </div>
      )}

      {/* The Matrix Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          gap: '12px',
          width: '100%',
          aspectRatio: '1 / 1',
          padding: '16px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          border: 'var(--card-border)'
        }}
      >
        {Array.from({ length: totalTiles }).map((_, index) => {
          const isHighlighted = phase === 'memorize' && previewTiles.includes(index);
          const isSelected = phase === 'interact' && selectedTiles.includes(index);

          return (
            <button
              key={index}
              type="button"
              disabled={phase === 'memorize' || disabled}
              onClick={() => handleTileClick(index)}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 'var(--radius-sm)',
                border: isSelected ? '3px solid var(--color-primary)' : '2px solid var(--border-subtle)',
                backgroundColor: isHighlighted
                  ? 'var(--color-accent)'
                  : isSelected
                  ? 'var(--color-primary)'
                  : 'var(--bg-app)',
                transform: isHighlighted || isSelected ? 'scale(0.96)' : 'scale(1)',
                transition: 'all var(--transition-fast)',
                cursor: phase === 'interact' ? 'pointer' : 'default',
                boxShadow: isHighlighted ? '0 0 15px var(--color-accent)' : 'none'
              }}
              aria-label={`Grid cell ${index + 1}`}
            />
          );
        })}
      </div>

      {/* Controls */}
      {phase === 'interact' && (
        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
          <Button variant="secondary" onClick={handleReset} icon={<RotateCcw size={16} />} style={{ flex: 1 }}>
            Clear
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={selectedTiles.length === 0 || disabled}
            style={{ flex: 2 }}
          >
            Submit Answer ({selectedTiles.length})
          </Button>
        </div>
      )}
    </div>
  );
};

export default GridMatrixEngine;
