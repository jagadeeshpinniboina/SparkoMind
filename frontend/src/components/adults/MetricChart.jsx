import React from 'react';

export const MetricChart = ({ title, score = 85, target = 100, category = 'Memory' }) => {
  const percentage = Math.min(100, Math.round((score / target) * 100));

  return (
    <div
      style={{
        padding: '1.25rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{category}</span>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)' }}>{percentage}%</span>
      </div>

      <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{title}</div>

      <div
        style={{
          width: '100%',
          height: '8px',
          backgroundColor: 'var(--bg-surface-elevated)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: 'var(--color-primary)',
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.4s ease'
          }}
        />
      </div>
    </div>
  );
};

export default MetricChart;
