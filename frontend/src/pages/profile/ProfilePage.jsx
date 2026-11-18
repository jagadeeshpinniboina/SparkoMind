import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Calendar, Shield, Award, Flame, 
  Sparkles, Brain, Cpu, Compass, Layers, CheckCircle2, 
  Edit3, Save, RefreshCw, BarChart2, Star, Check 
} from 'lucide-react';
import { useLiveUserStats } from '../../utils/userStats.js';
import { AVATAR_BADGES, AvatarRenderer } from '../../utils/avatar.js';
import styles from './ProfilePage.module.css';

export const ProfilePage = () => {
  const {
    displayName,
    avatar,
    bio,
    totalStars,
    totalXp,
    level,
    streak,
    updateProfile
  } = useLiveUserStats();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(displayName);
  const [editAvatar, setEditAvatar] = useState(avatar || '🚀');
  const [editBio, setEditBio] = useState(bio);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync initial state when stats update
  useEffect(() => {
    setEditName(displayName);
    setEditAvatar(avatar || '🚀');
    setEditBio(bio);
  }, [displayName, avatar, bio]);

  const handleSave = (e) => {
    e.preventDefault();
    const finalAvatar = editAvatar || '🚀';
    const finalName = editName.trim() || 'Jagadeesh Pinniboina';
    const finalBio = editBio || 'Space Cadet exploring cognitive STEM labs across SparkoMind.';

    updateProfile({
      name: finalName,
      avatar: finalAvatar,
      bio: finalBio
    });

    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const currentBadgeInfo = AVATAR_BADGES.find(
    (b) => b.emoji === (isEditing ? editAvatar : (avatar || '🚀'))
  ) || AVATAR_BADGES[0];

  const cognitiveDimensions = [
    { dimension: 'Algorithmic Sequence & Code', score: 94, icon: Cpu, color: '#38BDF8' },
    { dimension: 'Working Memory & Recall', score: 92, icon: Brain, color: '#F59E0B' },
    { dimension: 'Spatial Reasoning & Conduits', score: 88, icon: Compass, color: '#A855F7' },
    { dimension: 'Orbital Velocity & Physics', score: 85, icon: Flame, color: '#EC4899' },
    { dimension: 'Light & Color Synthesis', score: 90, icon: Sparkles, color: '#10B981' }
  ];

  return (
    <div className={styles.container}>
      {/* 1. Header Row */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>
            <User size={28} className={styles.userIcon} />
            <span>My Profile & Cognitive Identity</span>
          </h1>
          <p className={styles.pageSubtitle}>
            Manage your personal learner identity, avatar badge, and cognitive index.
          </p>
        </div>

        {saveSuccess && (
          <div className={styles.toastSuccess}>
            <CheckCircle2 size={18} />
            <span>Profile updated & synchronized live across SparkoMind!</span>
          </div>
        )}
      </div>

      {/* 2. Main Profile Card */}
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          {/* Glowing Avatar Display Badge */}
          <div className={styles.avatarContainer}>
            <AvatarRenderer
              avatar={isEditing ? editAvatar : avatar}
              name={isEditing ? editName : displayName}
              size="xl"
              shape="rounded"
            />
          </div>

          {/* User Details & Edit Form */}
          <div className={styles.profileDetails}>
            {!isEditing ? (
              <>
                <div className={styles.nameRow}>
                  <div className={styles.nameLockup}>
                    <h2 className={styles.profileName}>{displayName}</h2>
                    <span className={styles.avatarTag}>
                      {currentBadgeInfo.emoji} {currentBadgeInfo.label}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className={styles.editBtn}
                    title="Edit Display Name & Avatar Badge"
                  >
                    <Edit3 size={16} />
                    <span>Edit Profile</span>
                  </button>
                </div>
                <div className={styles.badgeRow}>
                  <span className={styles.rankBadge}>Level {level} Space Pioneer</span>
                  <span className={styles.statsPill}>⭐ {totalStars} Wonder Stars</span>
                  <span className={styles.statsPill}>🔥 {streak} Day Streak</span>
                </div>
                <p className={styles.bioText}>
                  {bio || 'Cadet exploring cognitive STEM labs across SparkoMind.'}
                </p>
              </>
            ) : (
              <form onSubmit={handleSave} className={styles.editForm}>
                {/* Visual Avatar Badge Picker (6 Badges) */}
                <div className={styles.badgePickerSection}>
                  <label className={styles.pickerLabel}>
                    <Sparkles size={14} style={{ color: '#38BDF8' }} />
                    <span>Choose Your Cognitive Avatar Badge:</span>
                  </label>
                  <div className={styles.badgeGrid}>
                    {AVATAR_BADGES.map((badge) => {
                      const isSelected = editAvatar === badge.emoji;
                      return (
                        <button
                          key={badge.id}
                          type="button"
                          className={`${styles.badgeCard} ${isSelected ? styles.badgeCardActive : ''}`}
                          onClick={() => setEditAvatar(badge.emoji)}
                        >
                          <span className={styles.badgeCardEmoji}>{badge.emoji}</span>
                          <div className={styles.badgeCardContent}>
                            <span className={styles.badgeCardTitle}>{badge.label}</span>
                            <span className={styles.badgeCardSubtitle}>{badge.subtitle}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.fieldLabel}>Display Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className={styles.textInput}
                    placeholder="Enter your name or cadet codename..."
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.fieldLabel}>Explorer Bio</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className={styles.textArea}
                    rows="2"
                    placeholder="Briefly describe your cognitive learning mission..."
                  />
                </div>

                <div className={styles.formActionRow}>
                  <button type="submit" className={styles.saveBtn}>
                    <Save size={16} />
                    <span>Save & Update Everywhere</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditName(displayName);
                      setEditAvatar(avatar || '🚀');
                      setEditBio(bio);
                      setIsEditing(false);
                    }}
                    className={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Live Milestone Numbers Strip */}
        <div className={styles.metricStrip}>
          <div className={styles.stripItem}>
            <span className={styles.stripLabel}>Wonder Stars</span>
            <span className={styles.stripValue}>⭐ {totalStars}</span>
          </div>
          <div className={styles.stripItem}>
            <span className={styles.stripLabel}>Experience Points</span>
            <span className={styles.stripValue}>⚡ {totalXp} XP</span>
          </div>
          <div className={styles.stripItem}>
            <span className={styles.stripLabel}>Cognitive Level</span>
            <span className={styles.stripValue}>Tier {level}</span>
          </div>
          <div className={styles.stripItem}>
            <span className={styles.stripLabel}>Active Streak</span>
            <span className={styles.stripValue}>🔥 {streak} Days</span>
          </div>
        </div>
      </div>

      {/* 3. Cognitive Aptitude Radar / Dimensions */}
      <div className={styles.radarCard}>
        <div className={styles.radarHeader}>
          <h2 className={styles.radarTitle}>
            <BarChart2 size={22} style={{ color: '#38BDF8' }} />
            <span>Cognitive Aptitude Index</span>
          </h2>
          <span className={styles.radarSub}>Multi-dimensional skill diagnostics calculated from active gameplay</span>
        </div>

        <div className={styles.dimensionsList}>
          {cognitiveDimensions.map((dim) => {
            const Icon = dim.icon;

            return (
              <div key={dim.dimension} className={styles.dimRow}>
                <div className={styles.dimInfo}>
                  <div className={styles.dimIconBox} style={{ background: `${dim.color}22`, color: dim.color }}>
                    <Icon size={18} />
                  </div>
                  <span className={styles.dimName}>{dim.dimension}</span>
                </div>

                <div className={styles.dimMeter}>
                  <div className={styles.meterTrack}>
                    <div
                      className={styles.meterFill}
                      style={{ width: `${dim.score}%`, background: dim.color }}
                    />
                  </div>
                  <span className={styles.dimScore} style={{ color: dim.color }}>
                    {dim.score}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
