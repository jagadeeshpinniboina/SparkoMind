import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, LogOut } from 'lucide-react';
import sparkoLogo from '../../../assets/images/logo-transparent.png';
import zoneKidsImg from '../../../assets/images/zone-kids.png';
import zoneAdultsImg from '../../../assets/images/zone-adults.png';
import zoneSeniorsImg from '../../../assets/images/zone-seniors.png';
import { useTheme } from '../../../context/ThemeContext.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';
import styles from './ChooseJourney.module.css';

export const ChooseJourney = () => {
  const { setDemographic } = useTheme();
  const { user, logout, updateUserDemographic } = useAuth();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const popoverRef = useRef(null);

  // Dynamic Initials & User Details (matching prototype requirements)
  const getInitials = () => {
    const first = user?.firstName?.[0] || 'J';
    const last = user?.lastName?.[0] || 'P';
    return `${first}${last}`.toUpperCase();
  };

  const fullName = `${user?.firstName || 'Jagadeesh'} ${user?.lastName || 'Pinniboina'}`.trim();
  const userEmail = user?.email || 'pinniboinajagadeesh76@gmail.com';

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    navigate('/login');
  };

  const handleZoneSelect = (zone) => {
    localStorage.setItem('sparkomind_active_zone', zone);
    setDemographic(zone);
    if (updateUserDemographic) {
      updateUserDemographic(zone).catch(() => {}); // fire without blocking navigation
    }
    navigate(`/dashboard/${zone}`);
  };

  const journeys = [
    {
      id: 'kids',
      name: 'Kids Universe',
      age: 'Ages 6 – 12',
      color: '#F59E0B',
      cardClass: styles.kidsCard,
      visualClass: styles.kidsVisual,
      buttonClass: styles.kidsButton,
      image: zoneKidsImg,
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      badgeBorder: 'rgba(245, 158, 11, 0.3)',
      badgeColor: '#F59E0B',
      subtext: 'Curiosity, playful logic puzzles, and cosmic quests engineered to nurture working memory and foundational cognitive growth.',
      features: [
        'Spatial Reasoning & Working Memory',
        'Pattern Recognition & Visual Logic',
        'Curiosity & Exploratory Problem Solving',
        'Adaptive Frustration-Free Pacing'
      ],
      buttonText: 'Enter Kids Universe'
    },
    {
      id: 'adults',
      name: 'Adults Arena',
      age: 'Ages 13 – 59',
      color: '#38BDF8',
      cardClass: styles.adultsCard,
      visualClass: styles.adultsVisual,
      buttonClass: styles.adultsButton,
      image: zoneAdultsImg,
      badgeBg: 'rgba(56, 189, 248, 0.15)',
      badgeBorder: 'rgba(56, 189, 248, 0.3)',
      badgeColor: '#38BDF8',
      subtext: 'High-velocity computational puzzles, formal logic syllogisms, and reaction metrics engineered for professional peak mental acuity.',
      features: [
        'Computational Logic & Algorithmic Deductions',
        'Executive Function & Rapid Task Switching',
        'High-Density Working Memory Recall',
        'Microsecond Reaction Latency Tracking'
      ],
      buttonText: 'Enter Adults Arena'
    },
    {
      id: 'seniors',
      name: 'Senior Sanctuary',
      age: 'Ages 60+',
      color: '#34D399',
      cardClass: styles.seniorsCard,
      visualClass: styles.seniorsVisual,
      buttonClass: styles.seniorsButton,
      image: zoneSeniorsImg,
      badgeBg: 'rgba(16, 185, 129, 0.15)',
      badgeBorder: 'rgba(16, 185, 129, 0.3)',
      badgeColor: '#34D399',
      subtext: 'Gentle, soothing cognitive exercises with high-contrast text, generous touch targets, and relaxed timers designed for brain vitality.',
      features: [
        'Neuroplasticity & Memory Retention',
        'Verbal Fluency & Word Associations',
        'Mindful Focus & Relaxed Zero-Stress Pacing',
        'High-Contrast Ergonomic Accessibility'
      ],
      buttonText: 'Enter Senior Sanctuary'
    }
  ];

  return (
    <div className={styles.portalPage}>
      {/* 1. Header: Brand Lockup (Logo 44px + "SparkoMind" 28px bold, Gap 8px) */}
      <header className={styles.topBar}>
        <Link to="/" className={styles.brandLockup}>
          <img 
            src={sparkoLogo} 
            alt="SparkoMind Logo" 
            className={`${styles.brandLogo} ${styles.brandLogoImg}`} 
            draggable="false"
          />
          <div className={styles.brandTitle}>
            <span className={styles.brandSparko}>Sparko</span>
            <span className={styles.brandMind}>Mind</span>
          </div>
        </Link>

        {/* 2. Header Right: ONLY 44px Interactive Circular Avatar Badge (No External Text) */}
        <div className={styles.profileContainer} ref={popoverRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className={styles.avatarButton}
            aria-expanded={profileOpen}
            aria-label="User Profile Menu"
          >
            {getInitials()}
          </button>

          {/* 3. Glassmorphic Profile Popover (No Cohort Line) */}
          {profileOpen && (
            <div className={styles.profilePopover}>
              <div className={styles.popoverHeader}>
                <div className={styles.popoverAvatar}>
                  {getInitials()}
                </div>
                <div className={styles.popoverUserMeta}>
                  <div className={styles.popoverFullName} title={fullName}>
                    {fullName}
                  </div>
                  <div className={styles.popoverEmail} title={userEmail}>
                    {userEmail}
                  </div>
                </div>
              </div>

              <div className={styles.popoverSection}>
                <div className={styles.popoverRow}>
                  <span className={styles.popoverLabel}>Session Status</span>
                  <span className={styles.popoverStatusPill}>
                    <span className={styles.greenDot} />
                    Verified Session
                  </span>
                </div>
              </div>

              <div className={styles.popoverFooter}>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={styles.popoverLogoutBtn}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 2. Hero Header */}
      <main className={styles.mainContent}>
        <div className={styles.heroHeader}>
          <h1 className={styles.heroTitle}>Choose Your Journey</h1>
          <p className={styles.heroSubtitle}>
            Activate a personalized neural training environment calibrated for your mind.
          </p>
        </div>

        {/* 3. Obsidian Glassmorphic Cards Grid (Pure 3D Illustrations, Non-Draggable) */}
        <div className={styles.cardsGrid}>
          {journeys.map((j) => (
            <div
              key={j.id}
              onClick={() => handleZoneSelect(j.id)}
              className={`${styles.portalCard} ${j.cardClass}`}
            >
              <div>
                {/* Top 160px Visual Container (Pure 3D Illustration Only - Zero Overlays) */}
                <div className={`${styles.visualContainer} ${j.visualClass}`}>
                  <img
                    src={j.image}
                    alt={j.name}
                    className={styles.characterImage}
                    draggable="false"
                  />
                </div>

                {/* Body Content */}
                <div className={styles.cardBody}>
                  <div className={styles.cardHeaderRow}>
                    <h3 className={styles.cardTitle}>{j.name}</h3>
                    <span
                      className={styles.cardCohortBadge}
                      style={{
                        backgroundColor: j.badgeBg,
                        border: `1px solid ${j.badgeBorder}`,
                        color: j.badgeColor
                      }}
                    >
                      {j.age}
                    </span>
                  </div>

                  <p className={styles.cardSubtext}>{j.subtext}</p>

                  {/* Future-Proof Cognitive Skill Pillars */}
                  <div className={styles.featureList}>
                    {j.features.map((pillar, idx) => (
                      <div key={idx} className={styles.featureItem}>
                        <div
                          className={styles.featureDot}
                          style={{ 
                            backgroundColor: j.color,
                            color: j.color 
                          }}
                        />
                        <span>{pillar}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoneSelect(j.id);
                }}
                className={`${styles.cardButton} ${j.buttonClass}`}
              >
                <span>{j.buttonText}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ChooseJourney;
