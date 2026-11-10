import React, { useState } from 'react';
import Button from '../../components/common/Button.jsx';
import { HelpCircle, CheckCircle, ArrowRight } from 'lucide-react';

export const ChoiceLogicEngine = ({ layout, onSubmitAttempt, disabled = false }) => {
  const options = layout?.options || [];
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  const handleSubmit = () => {
    if (!selectedOptionId || disabled) return;
    onSubmitAttempt({ selectedOptionId });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '580px', margin: '0 auto' }}>
      {/* Options List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {options.map((option, idx) => {
          const isSelected = selectedOptionId === option.id;

          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled}
              onClick={() => setSelectedOptionId(option.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.25rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--bg-surface)',
                border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                textAlign: 'left',
                boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                transform: isSelected ? 'translateX(6px)' : 'none',
                transition: 'all 180ms ease',
                cursor: 'pointer'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-full)',
                  border: isSelected ? '2px solid var(--color-primary)' : '2px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent',
                  color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}
              >
                {String.fromCharCode(65 + idx)}
              </div>
              <span style={{ fontSize: '1rem', fontWeight: isSelected ? 600 : 400, flex: 1 }}>
                {option.text}
              </span>
              {isSelected && <CheckCircle size={20} style={{ color: 'var(--color-primary)' }} />}
            </button>
          );
        })}
      </div>

      {/* Confirmation Button */}
      <Button
        variant="primary"
        onClick={handleSubmit}
        disabled={!selectedOptionId || disabled}
        style={{ width: '100%' }}
        icon={<ArrowRight size={18} />}
      >
        Confirm Deduction
      </Button>
    </div>
  );
};

export default ChoiceLogicEngine;
