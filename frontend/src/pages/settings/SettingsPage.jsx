import React, { useState } from 'react';
import { 
  Settings, Sliders, Volume2, Globe, Eye, 
  Bell, Shield, Download, Trash2, CheckCircle2, 
  Sun, Moon, VolumeX, Sparkles, AlertTriangle, RotateCcw 
} from 'lucide-react';
import { useLiveUserStats, getStoredSettings, saveSettings } from '../../utils/userStats.js';
import styles from './SettingsPage.module.css';

export const SettingsPage = () => {
  const {
    displayName,
    totalStars,
    totalXp,
    level,
    resetAll
  } = useLiveUserStats();

  const [settings, setSettings] = useState(getStoredSettings);
  const [toastMessage, setToastMessage] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);

  const languages = [
    'English', 'Telugu (తెలుగు)', 'Hindi (हिन्दी)', 
    'Tamil (தமிழ்)', 'Kannada (ಕನ್ನಡ)', 'Malayalam (മലയാളം)', 
    'Marathi (मराठी)', 'Bengali (বাংলা)', 'Odia (ଓଡ଼ିଆ)'
  ];

  const handleToggle = (key) => {
    const nextVal = !settings[key];
    const nextSettings = { ...settings, [key]: nextVal };
    setSettings(nextSettings);
    saveSettings(nextSettings);
    showToast(`Setting "${key}" updated.`);
  };

  const handleLanguageChange = (lng) => {
    const nextSettings = { ...settings, language: lng };
    setSettings(nextSettings);
    saveSettings(nextSettings);
    showToast(`Language set to ${lng}.`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportData = () => {
    const exportObject = {
      user: { displayName, level, totalStars, totalXp },
      settings,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sparkomind-profile-export-${Date.now()}.json`;
    a.click();
    showToast('Learning data exported successfully!');
  };

  const handleConfirmReset = () => {
    resetAll();
    setShowResetModal(false);
    showToast('🚀 All game progress reset back to Level 1!');
  };

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toastBanner}>
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Confirmation Modal */}
      {showResetModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <div className={styles.warningIconBox}>
                <AlertTriangle size={32} style={{ color: '#EF4444' }} />
              </div>
              <h3 className={styles.modalTitle}>Reset All Game Progress?</h3>
            </div>

            <p className={styles.modalBody}>
              Are you sure you want to reset all game levels back to <strong>Level 1</strong>?
              This will lock Levels 2–5 across all 12 games in <strong>Kids Universe</strong>, <strong>Adults Arena</strong>, and <strong>Senior Sanctuary</strong>, and reset your Wonder Stars.
            </p>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.confirmResetBtn}
                onClick={handleConfirmReset}
              >
                <RotateCcw size={16} />
                <span>Yes, Reset to Level 1</span>
              </button>

              <button
                type="button"
                className={styles.cancelModalBtn}
                onClick={() => setShowResetModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Row */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>
            <Settings size={28} className={styles.settingsIcon} />
            <span>Preferences & Settings</span>
          </h1>
          <p className={styles.pageSubtitle}>
            Configure soundscapes, visual animations, regional language, and game progression.
          </p>
        </div>
      </div>

      {/* 1. Audio & Soundscapes */}
      <div className={styles.settingsCard}>
        <div className={styles.cardHeader}>
          <Volume2 size={22} style={{ color: '#38BDF8' }} />
          <h2 className={styles.cardTitle}>Audio & Sound Effects</h2>
        </div>

        <div className={styles.togglesList}>
          <div className={styles.toggleRow}>
            <div className={styles.toggleText}>
              <span className={styles.toggleTitle}>Sound Effects (SFX)</span>
              <span className={styles.toggleDesc}>Play tactical audio cues, pops, clicks, and celebratory victory chimes.</span>
            </div>
            <button
              type="button"
              className={`${styles.switchBtn} ${settings.soundEffects ? styles.switchActive : ''}`}
              onClick={() => handleToggle('soundEffects')}
            >
              <div className={styles.switchHandle} />
            </button>
          </div>

          <div className={styles.toggleRow}>
            <div className={styles.toggleText}>
              <span className={styles.toggleTitle}>Background Ambient Soundscapes</span>
              <span className={styles.toggleDesc}>Gentle white noise, binaural beats, and meditative cosmic background hums.</span>
            </div>
            <button
              type="button"
              className={`${styles.switchBtn} ${settings.backgroundAudio ? styles.switchActive : ''}`}
              onClick={() => handleToggle('backgroundAudio')}
            >
              <div className={styles.switchHandle} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Visuals & Motion */}
      <div className={styles.settingsCard}>
        <div className={styles.cardHeader}>
          <Eye size={22} style={{ color: '#F59E0B' }} />
          <h2 className={styles.cardTitle}>Display & Motion Preferences</h2>
        </div>

        <div className={styles.togglesList}>
          <div className={styles.toggleRow}>
            <div className={styles.toggleText}>
              <span className={styles.toggleTitle}>Interactive Animations & Particles</span>
              <span className={styles.toggleDesc}>Enable floating mascots, twinkling starfields, and tile expansion waves.</span>
            </div>
            <button
              type="button"
              className={`${styles.switchBtn} ${settings.animations ? styles.switchActive : ''}`}
              onClick={() => handleToggle('animations')}
            >
              <div className={styles.switchHandle} />
            </button>
          </div>

          <div className={styles.toggleRow}>
            <div className={styles.toggleText}>
              <span className={styles.toggleTitle}>High Contrast Focus Mode</span>
              <span className={styles.toggleDesc}>Sharpen borders and increase luminosity on grid lines and puzzle boards.</span>
            </div>
            <button
              type="button"
              className={`${styles.switchBtn} ${settings.highContrast ? styles.switchActive : ''}`}
              onClick={() => handleToggle('highContrast')}
            >
              <div className={styles.switchHandle} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Regional Language */}
      <div className={styles.settingsCard}>
        <div className={styles.cardHeader}>
          <Globe size={22} style={{ color: '#10B981' }} />
          <h2 className={styles.cardTitle}>Language & Regional Localization (9 Languages)</h2>
        </div>

        <p className={styles.cardDesc}>
          Select your primary instructional language for game prompts, button labels, and mission telemetry.
        </p>

        <div className={styles.langSelectWrapper}>
          <select
            value={settings.language || 'English'}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className={styles.langSelect}
          >
            {languages.map((lng) => (
              <option key={lng} value={lng.split(' ')[0]}>
                {lng}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Data Portability & Danger Zone */}
      <div className={`${styles.settingsCard} ${styles.dangerCard}`}>
        <div className={styles.cardHeader}>
          <Shield size={22} style={{ color: '#EF4444' }} />
          <h2 className={styles.cardTitle}>Data Portability & Progression Management</h2>
        </div>

        <p className={styles.cardDesc}>
          Export your learning statistics or reset all game levels back to the beginning.
        </p>

        <div className={styles.actionButtonsRow}>
          <button
            type="button"
            onClick={handleExportData}
            className={styles.exportBtn}
          >
            <Download size={16} />
            <span>Export Learning Data (JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className={styles.resetBtn}
            title="Reset all game levels back to Level 1"
          >
            <Trash2 size={16} />
            <span>Reset All Game Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
