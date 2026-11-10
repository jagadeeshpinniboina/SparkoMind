import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button.jsx';
import { Play, RotateCcw, ArrowRight } from 'lucide-react';

export const SequenceCodeEngine = ({ layout, onSubmitAttempt, disabled = false }) => {
  const tokens = layout?.tokens || [];
  const displaySpeedMs = layout?.displaySpeedMs || 1000;

  const [phase, setPhase] = useState('ready'); // 'ready' | 'observe' | 'replay'
  const [activeTokenIndex, setActiveTokenIndex] = useState(null);
  const [userSequence, setUserSequence] = useState([]);

  // Mock observation demonstration sequence if provided in previewSequence, else prompt user to start
  const previewSequence = layout?.previewSequence || tokens.slice(0, 4).map((t) => t.id);

  const startObservation = () => {
    setPhase('observe');
    setUserSequence([]);
    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < previewSequence.length) {
        const tokenId = previewSequence[currentStep];
        const tokenIdx = tokens.findIndex((t) => t.id === tokenId);
        setActiveTokenIndex(tokenIdx);

        setTimeout(() => {
          setActiveTokenIndex(null);
        }, displaySpeedMs * 0.7);

        currentStep++;
      } else {
        clearInterval(interval);
        setActiveTokenIndex(null);
        setPhase('replay');
      }
    }, displaySpeedMs);
  };

  useEffect(() => {
    startObservation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout]);

  const handleTokenSelect = (token) => {
    if (phase !== 'replay' || disabled) return;
    setUserSequence((prev) => [...prev, token.id]);
  };

  const handleUndo = () => {
    setUserSequence((prev) => prev.slice(0, -1));
  };

  const handleReset = () => {
    setUserSequence([]);
  };

  const handleSubmit = () => {
    if (phase !== 'replay' || userSequence.length === 0 || disabled) return;
    onSubmitAttempt({ sequence: userSequence });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%', maxWidth: '480px', margin: '0 auto' }}>
      {/* Sequence Stage Status */}
      <div
        style={{
          width: '100%',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: phase === 'observe' ? 'var(--color-primary-light)' : 'var(--bg-surface-elevated)',
          color: phase === 'observe' ? 'var(--color-primary)' : 'var(--text-primary)',
          textAlign: 'center',
          fontWeight: 700,
          fontSize: '0.95rem'
        }}
      >
        {phase === 'observe' && '👀 Watch the Tokens Flash in Sequence...'}
        {phase === 'replay' && '🎯 Replay the Sequence by Tapping Tokens in Order!'}
      </div>

      {/* User Input Sequence Ribbon */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          minHeight: '48px',
          width: '100%',
          padding: '0.5rem 1rem',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          overflowX: 'auto'
        }}
      >
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginRight: '0.5rem' }}>Sequence:</span>
        {userSequence.length === 0 ? (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tap buttons below...</span>
        ) : (
          userSequence.map((tokenId, idx) => {
            const token = tokens.find((t) => t.id === tokenId);
            return (
              <span
                key={idx}
                style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: token?.color || 'var(--color-primary)',
                  color: '#FFFFFF',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}
              >
                {token?.label || tokenId}
              </span>
            );
          })
        )}
      </div>

      {/* Tokens Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '14px',
          width: '100%'
        }}
      >
        {tokens.map((token, idx) => {
          const isFlashed = activeTokenIndex === idx;
          return (
            <button
              key={token.id}
              type="button"
              disabled={phase !== 'replay' || disabled}
              onClick={() => handleTokenSelect(token)}
              style={{
                padding: '1.25rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isFlashed ? token.color : 'var(--bg-surface)',
                color: isFlashed ? '#FFFFFF' : 'var(--text-primary)',
                border: `3px solid ${token.color}`,
                fontWeight: 700,
                fontSize: '1rem',
                boxShadow: isFlashed ? `0 0 24px ${token.color}` : 'var(--shadow-sm)',
                transform: isFlashed ? 'scale(1.04)' : 'scale(1)',
                transition: 'all 150ms ease',
                cursor: phase === 'replay' ? 'pointer' : 'default'
              }}
            >
              {token.label}
            </button>
          );
        })}
      </div>

      {/* Action Controls */}
      {phase === 'replay' && (
        <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
          <Button variant="secondary" onClick={handleUndo} disabled={userSequence.length === 0} style={{ flex: 1 }}>
            Undo
          </Button>
          <Button variant="secondary" onClick={handleReset} disabled={userSequence.length === 0} icon={<RotateCcw size={16} />} style={{ flex: 1 }}>
            Clear
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={userSequence.length === 0 || disabled}
            style={{ flex: 2 }}
            icon={<ArrowRight size={16} />}
          >
            Submit
          </Button>
        </div>
      )}
    </div>
  );
};

export default SequenceCodeEngine;
