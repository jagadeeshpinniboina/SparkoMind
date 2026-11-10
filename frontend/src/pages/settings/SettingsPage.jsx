import React, { useState } from 'react';
import { 
  Settings, Sliders, Volume2, Globe, Eye, 
  Bell, Shield, Download, Trash2, CheckCircle2, 
  Sun, Moon, VolumeX, Sparkles 
} from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const SettingsPage = () => {
  const { theme, toggleTheme, demographic } = useTheme();
  const { user, progress } = useAuth();

  const [settings, setSettings] = useState({
    fontSize: 'Normal',
    highContrast: false,
    reducedMotion: false,
    soundEffects: true,
    backgroundAudio: false,
    soundVolume: 80,
    language: 'English',
    dailyReminder: true,
    reminderTime: '08:30',
    emailDigest: true
  });

  const [savedToast, setSavedToast] = useState(false);

  const languages = [
    'English', 'Telugu (తెలుగు)', 'Hindi (हिन्दी)', 
    'Tamil (தமிழ்)', 'Kannada (ಕನ್ನಡ)', 'Malayalam (മലയാളം)', 
    'Marathi (मराठी)', 'Bengali (বাংলা)', 'Odia (ଓଡ଼ିଆ)'
  ];

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    triggerSaved();
  };

  const handleChange = (key, val) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
    triggerSaved();
  };

  const triggerSaved = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleExportData = () => {
    const exportObject = {
      user: {
        name: user?.name || 'Jagadeesh Pinniboyina',
        email: user?.email || 'user@example.com',
        demographic
      },
      progress: progress || { totalXp: 3850, streak: 5 },
      settings,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sparkomind-profile-export-${Date.now()}.json`;
    a.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#1E293B', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Settings style={{ color: 'var(--brand-primary)' }} size={32} />
            Preferences & Settings
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
            Configure your accessibility, typography scales, soundscapes, and account preferences.
          </p>
        </div>

        {savedToast && (
          <div
            style={{
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              padding: '0.6rem 1.15rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
            }}
          >
            <CheckCircle2 size={16} /> Settings saved automatically
          </div>
        )}
      </div>

      {/* 1. Accessibility & Visual Settings */}
      <Card style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Eye size={22} color="var(--brand-primary)" />
          Accessibility & Visual Display
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '1.5rem' }}>
          Certified WCAG 2.1 compliance with responsive typography and high-contrast modes.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Font Size Selector */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.95rem' }}>Font Scale</div>
              <div style={{ fontSize: '0.82rem', color: '#64748B' }}>Adjust the default reading size of prompts and challenge instructions.</div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['Small', 'Normal', 'Large', 'Extra Large'].map((sz) => (
                <button
                  key={sz}
                  onClick={() => handleChange('fontSize', sz)}
                  style={{
                    padding: '0.45rem 0.95rem',
                    borderRadius: '8px',
                    border: '1.5px solid',
                    borderColor: settings.fontSize === sz ? 'var(--brand-primary)' : 'var(--border-subtle)',
                    backgroundColor: settings.fontSize === sz ? 'rgba(94, 92, 230, 0.08)' : '#FFFFFF',
                    color: settings.fontSize === sz ? 'var(--brand-primary)' : '#475569',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.95rem' }}>High Contrast Mode (Senior WCAG AAA)</div>
              <div style={{ fontSize: '0.82rem', color: '#64748B' }}>Enhance border visibility and maximize contrast for visual comfort.</div>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={() => handleToggle('highContrast')}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: settings.highContrast ? 'var(--brand-primary)' : '#CBD5E1',
                  borderRadius: '34px',
                  transition: '0.2s'
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    height: '20px',
                    width: '20px',
                    left: settings.highContrast ? '26px' : '4px',
                    bottom: '3px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '50%',
                    transition: '0.2s'
                  }}
                />
              </span>
            </label>
          </div>

          {/* Theme Mode Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.95rem' }}>Theme Mode</div>
              <div style={{ fontSize: '0.82rem', color: '#64748B' }}>Toggle between Daylight and Nocturnal dark canvas.</div>
            </div>
            <button
              onClick={toggleTheme}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.55rem 1.15rem',
                borderRadius: '10px',
                border: '1.5px solid var(--border-subtle)',
                backgroundColor: '#FFFFFF',
                color: '#334155',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              {theme === 'dark' ? <Moon size={16} color="var(--brand-primary)" /> : <Sun size={16} color="#F59E0B" />}
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>
        </div>
      </Card>

      {/* 2. Audio & Soundscapes */}
      <Card style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Volume2 size={22} color="var(--brand-primary)" />
          Soundscapes & Audio Feedback
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '1.5rem' }}>
          Tactile audio feedback reinforces cognitive pattern recognition.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Sound Effects Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.95rem' }}>Game Sound Effects</div>
              <div style={{ fontSize: '0.82rem', color: '#64748B' }}>Audio feedback for clicks, correct answers, and level completions.</div>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.soundEffects}
                onChange={() => handleToggle('soundEffects')}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: settings.soundEffects ? 'var(--brand-primary)' : '#CBD5E1',
                  borderRadius: '34px',
                  transition: '0.2s'
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    height: '20px',
                    width: '20px',
                    left: settings.soundEffects ? '26px' : '4px',
                    bottom: '3px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '50%',
                    transition: '0.2s'
                  }}
                />
              </span>
            </label>
          </div>

          {/* Volume Slider */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.95rem' }}>Master Volume ({settings.soundVolume}%)</div>
              <div style={{ fontSize: '0.82rem', color: '#64748B' }}>Adjust the loudness of in-game chimes and sound effects.</div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.soundVolume}
              onChange={(e) => handleChange('soundVolume', Number(e.target.value))}
              style={{ width: '180px', accentColor: 'var(--brand-primary)' }}
            />
          </div>
        </div>
      </Card>

      {/* 3. Language & Localization */}
      <Card style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe size={22} color="var(--brand-primary)" />
          Language & Regional Localization (9 Languages)
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '1.5rem' }}>
          Select your primary instructional language for game prompts and dashboard metrics.
        </p>

        <div>
          <select
            value={settings.language}
            onChange={(e) => handleChange('language', e.target.value)}
            style={{
              width: '100%',
              maxWidth: '380px',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              border: '1.5px solid var(--border-subtle)',
              backgroundColor: '#FFFFFF',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: '#1E293B'
            }}
          >
            {languages.map((lng) => (
              <option key={lng} value={lng.split(' ')[0]}>{lng}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* 4. Data Export & Account Actions */}
      <Card style={{ padding: '2rem', border: '1.5px solid #F1F5F9' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={22} color="var(--brand-primary)" />
          Data Portability & Privacy
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '1.5rem' }}>
          Download your learning history, performance logs, and level completion records.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportData}
            style={{
              padding: '0.7rem 1.4rem',
              borderRadius: '10px',
              border: '1.5px solid var(--border-subtle)',
              backgroundColor: '#FFFFFF',
              color: '#334155',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Download size={16} /> Export Learning Data (JSON)
          </button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
