import React from 'react';
import { Star } from 'lucide-react';

export const StarBadge = ({ stars = 3, label = 'Wonder Stars' }) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.4rem 0.85rem',
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--color-accent-light)',
        color: 'var(--color-accent)',
        fontWeight: 700,
        fontSize: '0.9rem'
      }}
    >
      <Star size={18} fill="currentColor" />
      <span>{stars} {label}</span>
    </div>
  );
};

export default StarBadge;
