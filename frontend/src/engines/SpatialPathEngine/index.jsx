import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button.jsx';
import { Compass, RotateCcw, Flag, Navigation } from 'lucide-react';

export const SpatialPathEngine = ({ layout, onSubmitAttempt, disabled = false }) => {
  const rows = layout?.gridRows || 3;
  const cols = layout?.gridCols || 3;
  const startNode = layout?.startNode || { row: 0, col: 0 };
  const endNode = layout?.endNode || { row: rows - 1, col: cols - 1 };
  const blockedNodes = layout?.blockedNodes || [];

  const [path, setPath] = useState([startNode]);

  useEffect(() => {
    setPath([startNode]);
  }, [layout, startNode]);

  const isBlocked = (r, c) => {
    return blockedNodes.some((b) => b.row === r && b.col === c);
  };

  const isCurrentHead = (r, c) => {
    const head = path[path.length - 1];
    return head.row === r && head.col === c;
  };

  const isInPath = (r, c) => {
    return path.some((p) => p.row === r && p.col === c);
  };

  const handleCellClick = (r, c) => {
    if (disabled || isBlocked(r, c)) return;

    const head = path[path.length - 1];
    // Check adjacency (cardinal: up, down, left, right)
    const rowDiff = Math.abs(head.row - r);
    const colDiff = Math.abs(head.col - c);

    if (rowDiff + colDiff === 1) {
      // Valid adjacent step
      if (!isInPath(r, c)) {
        setPath((prev) => [...prev, { row: r, col: c }]);
      }
    }
  };

  const handleReset = () => {
    setPath([startNode]);
  };

  const handleUndo = () => {
    if (path.length > 1) {
      setPath((prev) => prev.slice(0, -1));
    }
  };

  const currentHead = path[path.length - 1];
  const reachedDestination = currentHead.row === endNode.row && currentHead.col === endNode.col;

  const handleSubmit = () => {
    if (disabled || path.length < 2) return;
    onSubmitAttempt({ path });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%', maxWidth: '420px', margin: '0 auto' }}>
      {/* Maze Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gap: '8px',
          width: '100%',
          aspectRatio: '1 / 1',
          padding: '16px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          border: 'var(--card-border)'
        }}
      >
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((_, c) => {
            const isStart = startNode.row === r && startNode.col === c;
            const isEnd = endNode.row === r && endNode.col === c;
            const blocked = isBlocked(r, c);
            const inPath = isInPath(r, c);
            const isHead = isCurrentHead(r, c);

            return (
              <button
                key={`${r}-${c}`}
                type="button"
                disabled={disabled || blocked}
                onClick={() => handleCellClick(r, c)}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: blocked
                    ? 'var(--bg-surface-elevated)'
                    : isHead
                    ? 'var(--color-accent)'
                    : inPath
                    ? 'var(--color-primary-light)'
                    : isEnd
                    ? 'var(--color-success)'
                    : 'var(--bg-app)',
                  border: isHead
                    ? '3px solid var(--color-accent)'
                    : inPath
                    ? '2px solid var(--color-primary)'
                    : '1px solid var(--border-subtle)',
                  color: isEnd ? '#FFFFFF' : 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: blocked ? 'not-allowed' : 'pointer',
                  transition: 'all 120ms ease'
                }}
              >
                {isHead && <Navigation size={20} style={{ color: '#FFFFFF' }} />}
                {!isHead && isStart && <Compass size={20} style={{ color: 'var(--color-primary)' }} />}
                {!isHead && isEnd && <Flag size={20} />}
                {blocked && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>✕</span>}
              </button>
            );
          })
        )}
      </div>

      {/* Controller Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
        <Button variant="secondary" onClick={handleUndo} disabled={path.length <= 1} style={{ flex: 1 }}>
          Undo
        </Button>
        <Button variant="secondary" onClick={handleReset} disabled={path.length <= 1} icon={<RotateCcw size={16} />} style={{ flex: 1 }}>
          Reset
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!reachedDestination || disabled}
          style={{ flex: 2 }}
        >
          {reachedDestination ? 'Submit Route' : 'Reach Goal First'}
        </Button>
      </div>
    </div>
  );
};

export default SpatialPathEngine;
