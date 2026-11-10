import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export const AudioPrompt = ({ text = 'Read prompt aloud' }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis not supported in this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85; // Calmer, slower pacing for seniors
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      type="button"
      onClick={handleSpeak}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.65rem 1.25rem',
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--color-primary-light)',
        color: 'var(--color-primary)',
        fontSize: '1rem',
        fontWeight: 600,
        border: '2px solid var(--color-primary)',
        cursor: 'pointer'
      }}
      aria-label="Listen to instructions aloud"
    >
      {isPlaying ? <VolumeX size={20} /> : <Volume2 size={20} />}
      <span>{isPlaying ? 'Stop Reading' : 'Listen to Instructions'}</span>
    </button>
  );
};

export default AudioPrompt;
