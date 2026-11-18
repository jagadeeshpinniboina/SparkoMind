import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getInitials } from '../utils/avatar.js';
import AvatarRenderer from '../components/common/AvatarRenderer.jsx';
import styles from './LandingPage.module.css';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

// Official High-Res Raster Images
import logoTransparent from '../assets/images/logo-transparent.png';
import logoImg from '../assets/images/logo.png';
import heroSceneImg from '../assets/images/hero-scene.png';
import kidAvatarImg from '../assets/images/kid-avatar.png';
import adultAvatarImg from '../assets/images/adult-avatar.png';
import seniorAvatarImg from '../assets/images/senior-avatar.png';

const NAV_ITEMS = [
  { name: 'Home', id: 'hero' },
  { name: 'Games', id: 'games' },
  { name: 'Age Zones', id: 'age-zones' },
  { name: 'How It Works', id: 'how-it-works' },
  { name: 'About', id: 'about' },
  { name: 'Contact', id: 'contact' }
];

export const LandingPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const hasUserSession = isAuthenticated || !!localStorage.getItem('sparkomind_token');
  const currentUser = user || (() => {
    try {
      const raw = localStorage.getItem('sparkomind_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const [activeSection, setActiveSection] = useState('Home');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Smooth scroll and active section update
  const handleNavClick = (item, e) => {
    setActiveSection(item.name);
    if (item.name === 'Home' || item.id === 'hero') {
      scrollToTop();
      return;
    }
    if (item.id === 'age-zones') {
      scrollToAgeZones(e);
      return;
    }
    const element = document.getElementById(item.id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveSection('Home');
  };

  // Synchronized scroll tracking: Back to Top toggle & exact section active indicator
  useEffect(() => {
    const handleScroll = () => {
      // Toggle Back to Top button
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }

      // Check current visible section without ghosting
      if (window.scrollY < 200) {
        setActiveSection('Home');
        return;
      }

      const scrollPos = window.scrollY + 220;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_ITEMS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(NAV_ITEMS[i].name);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProtectedAction = (targetPath = '/select-zone', zone = null) => {
    if (zone) {
      localStorage.setItem('sparkomind_active_zone', zone);
    }
    if (hasUserSession) {
      navigate(targetPath);
    } else {
      navigate('/login', { state: { from: { pathname: targetPath } } });
    }
  };

  const handleGetStarted = () => {
    if (hasUserSession) {
      navigate('/select-zone');
    } else {
      navigate('/register');
    }
  };

  const scrollToAgeZones = (e) => {
    e?.preventDefault();
    const element = document.getElementById('age-zones');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleExploreGames = () => {
    const element = document.getElementById('games');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* ====================================================================
          1. TOP NAVBAR (Seamless High-End Dark Glass)
          - Logo: 40px icon + "Sparko" (#FFFFFF) + "Mind" (#8B5CF6)
          - Dynamic Moving Single Underline Indicator
          - Logged Out: ONLY Login button
          - Logged In: User Profile Avatar & Dashboard CTA
          ==================================================================== */}
      <header className={styles.navbar}>
        {/* Brand Logo */}
        <Link
          to="/"
          className={`${styles.navBrand} ${styles.brandLockup}`}
          onClick={(e) => {
            e.preventDefault();
            scrollToTop();
          }}
        >
          <img src={logoTransparent} alt="SparkoMind Logo" className={`${styles.brandLogo} ${styles.brandLogoImg}`} />
          <span className={styles.brandTitle}>
            Sparko<span className={styles.brandAccent}>Mind</span>
          </span>
        </Link>

        {/* Dynamic Nav Links with Single Moving Underline */}
        <nav className={styles.navLinks} aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.name;
            return (
              <button
                key={item.name}
                type="button"
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                onClick={() => handleNavClick(item)}
              >
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons: Logged-Out has ONLY Login */}
        <div className={styles.navActions}>
          {hasUserSession ? (
            <div className={styles.loggedInActions}>
              <Link to="/select-zone" className={styles.avatarLink} title={currentUser?.name || "Dashboard"}>
                <AvatarRenderer
                  avatar={currentUser?.avatar}
                  name={currentUser?.name}
                  size="sm"
                  fallbackInitials={true}
                />
              </Link>
              <Link to="/select-zone" className={styles.dashboardNavBtn}>
                Dashboard
              </Link>
            </div>
          ) : (
            <Link to="/login" className={styles.loginBtn}>
              Login
            </Link>
          )}
        </div>
      </header>

      {/* ====================================================================
          2. HERO SECTION & DEMOGRAPHIC CARDS (#hero)
          ==================================================================== */}
      <div id="hero">
        <main className={styles.heroSection}>
          {/* Left Column: Typography & CTAs */}
          <div className={styles.heroLeft}>
            <h1 className={styles.headline}>
              <span className={styles.whiteText}>Spark Your </span>
              <span className={styles.glowViolet}>Mind.</span>
              <br />
              <span className={styles.whiteText}>Shape Your </span>
              <span className={styles.glowCyan}>Future.</span>
            </h1>

            <p className={styles.subtitle}>
              Fun brain games, coding challenges and skill-building activities for Kids, Adults and Seniors.
            </p>

            <div className={styles.ctaGroup}>
              <button
                type="button"
                onClick={handleGetStarted}
                className={styles.primaryCta}
              >
                Get Started →
              </button>
              <button
                type="button"
                onClick={handleExploreGames}
                className={styles.secondaryCta}
              >
                Explore Games
              </button>
            </div>
          </div>

          {/* Right Column: Hero Artwork */}
          <div className={styles.heroRight}>
            <div className={styles.heroArtworkWrapper}>
              <img
                src={heroSceneImg}
                alt="SparkoMind Cognitive Brain Training Ecosystem"
                className={styles.heroArtworkImg}
              />
            </div>
          </div>
        </main>

        {/* 3 High-Contrast Pastel Floating Demographic Cards */}
        <section
          className={styles.cardsRow}
          aria-label="Demographic Category Selection"
        >
          {/* Card 1: For Kids */}
          <div className={`${styles.zonePreviewCard} ${styles.demoCard} ${styles.kidsCard}`}>
            <img src={kidAvatarImg} alt="For Kids" className={styles.cardAvatar} />
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>For Kids</h3>
              <p className={styles.cardSubtitle}>Build focus, memory and creativity.</p>
            </div>
          </div>

          {/* Card 2: For Adults */}
          <div className={`${styles.zonePreviewCard} ${styles.demoCard} ${styles.adultsCard}`}>
            <img src={adultAvatarImg} alt="For Adults" className={styles.cardAvatar} />
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>For Adults</h3>
              <p className={styles.cardSubtitle}>
                Improve logic, problem-solving and technical skills.
              </p>
            </div>
          </div>

          {/* Card 3: For Seniors */}
          <div className={`${styles.zonePreviewCard} ${styles.demoCard} ${styles.seniorsCard}`}>
            <img src={seniorAvatarImg} alt="For Seniors" className={styles.cardAvatar} />
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>For Seniors</h3>
              <p className={styles.cardSubtitle}>Keep your mind active and healthy.</p>
            </div>
          </div>
        </section>
      </div>

      {/* ====================================================================
          3. IN-PAGE GUEST PREVIEW: FEATURED GAMES (#games)
          ==================================================================== */}
      <section
        id="games"
        className={`${styles.contentSection} ${styles.featuredGamesSection || ''}`}
        style={{ scrollMarginTop: '90px' }}
      >
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>🎮 Game Engine</div>
          <h2 className={styles.sectionTitle}>Featured Cognitive Games</h2>
          <p className={styles.sectionSubtitle}>
            Scientific brain workouts dynamically calibrated to your demographic and skill progression.
          </p>
        </div>

        <div className={styles.gamesGrid}>
          {/* Game 1 */}
          <div className={styles.gameCard} onClick={() => handleProtectedAction('/games/memory-matrix')}>
            <div>
              <div className={styles.gameIconCircle} style={{ background: 'rgba(251, 146, 60, 0.15)', color: '#FB923C' }}>
                🧩
              </div>
              <div className={styles.gameHeader}>
                <h3 className={styles.gameTitle}>Memory Matrix</h3>
                <span className={styles.gameTag} style={{ background: 'rgba(251, 146, 60, 0.2)', color: '#FDBA74' }}>
                  Kids & Adults
                </span>
              </div>
              <p className={styles.gameDesc}>
                Recall flashing tile patterns on dynamically expanding spatial matrices to build working memory.
              </p>
            </div>
            <div className={styles.gameFooter}>
              <span className={styles.gameStat}>⚡ 3 Min Daily</span>
              <span className={styles.playPromptBtn}>Play Challenge →</span>
            </div>
          </div>

          {/* Game 2 */}
          <div className={styles.gameCard} onClick={() => handleProtectedAction('/games/logic-circuit')}>
            <div>
              <div className={styles.gameIconCircle} style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' }}>
                ⚡
              </div>
              <div className={styles.gameHeader}>
                <h3 className={styles.gameTitle}>Logic Circuit</h3>
                <span className={styles.gameTag} style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#7DD3FC' }}>
                  Adults Zone
                </span>
              </div>
              <p className={styles.gameDesc}>
                Connect Boolean logic gates, verify truth tables, and route signals under time pressure.
              </p>
            </div>
            <div className={styles.gameFooter}>
              <span className={styles.gameStat}>🧠 Medium Logic</span>
              <span className={styles.playPromptBtn}>Play Challenge →</span>
            </div>
          </div>

          {/* Game 3 */}
          <div className={styles.gameCard} onClick={() => handleProtectedAction('/games/pattern-blitz')}>
            <div>
              <div className={styles.gameIconCircle} style={{ background: 'rgba(167, 243, 208, 0.15)', color: '#34D399' }}>
                🎯
              </div>
              <div className={styles.gameHeader}>
                <h3 className={styles.gameTitle}>Pattern Blitz</h3>
                <span className={styles.gameTag} style={{ background: 'rgba(167, 243, 208, 0.2)', color: '#6EE7B7' }}>
                  All Zones
                </span>
              </div>
              <p className={styles.gameDesc}>
                Spot geometric shifts and symmetry anomalies in rapid sequence to boost processing speed.
              </p>
            </div>
            <div className={styles.gameFooter}>
              <span className={styles.gameStat}>⏱️ Speed Reflex</span>
              <span className={styles.playPromptBtn}>Play Challenge →</span>
            </div>
          </div>

          {/* Game 4 */}
          <div className={styles.gameCard} onClick={() => handleProtectedAction('/games/code-quest')}>
            <div>
              <div className={styles.gameIconCircle} style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#C084FC' }}>
                💻
              </div>
              <div className={styles.gameHeader}>
                <h3 className={styles.gameTitle}>Code Quest</h3>
                <span className={styles.gameTag} style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#D8B4FE' }}>
                  Coding Path
                </span>
              </div>
              <p className={styles.gameDesc}>
                Solve algorithmic puzzles, fix syntax bugs, and debug interactive code blocks in real time.
              </p>
            </div>
            <div className={styles.gameFooter}>
              <span className={styles.gameStat}>🏆 Certified XP</span>
              <span className={styles.playPromptBtn}>Play Challenge →</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. IN-PAGE GUEST PREVIEW: AGE ZONES (#age-zones)
          ==================================================================== */}
      <section
        id="age-zones"
        className={`${styles.contentSection} ${styles.tailoredAgeZonesSection || ''}`}
        style={{ scrollMarginTop: '90px' }}
      >
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>🧬 Generational Training</div>
          <h2 className={styles.sectionTitle}>Tailored Age Zones</h2>
          <p className={styles.sectionSubtitle}>
            Different stages of life have distinct neural strengths. Our curriculum adapts accordingly.
          </p>
        </div>

        <div className={styles.zonesGrid}>
          {/* Kids Zone */}
          <div className={styles.zoneCard}>
            <div>
              <div className={styles.zoneIconRow}>
                <img src={kidAvatarImg} alt="Kids Zone" className={styles.zoneAvatarMini} />
                <div>
                  <h3 className={styles.zoneName}>Kids Zone</h3>
                  <span className={styles.zoneAgeTag} style={{ color: '#FB923C' }}>Ages 6 to 12</span>
                </div>
              </div>
              <p className={styles.zoneDetails}>
                Engaging gamified worlds that ignite curiosity, cultivate logical thinking, and teach algorithmic concepts.
              </p>
              <div className={styles.zoneChips}>
                <span className={styles.zoneChip}>Visual Memory</span>
                <span className={styles.zoneChip}>Creativity</span>
                <span className={styles.zoneChip}>Coding Basics</span>
                <span className={styles.zoneChip}>Badges & Mascot</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleProtectedAction('/dashboard/kids', 'kids')}
              className={styles.zoneActionBtn}
              style={{ background: '#FED7AA', color: '#9A3412' }}
            >
              Explore Kids Zone →
            </button>
          </div>

          {/* Adults Zone */}
          <div className={styles.zoneCard}>
            <div>
              <div className={styles.zoneIconRow}>
                <img src={adultAvatarImg} alt="Adult Zone" className={styles.zoneAvatarMini} />
                <div>
                  <h3 className={styles.zoneName}>Adults Zone</h3>
                  <span className={styles.zoneAgeTag} style={{ color: '#38BDF8' }}>Ages 13 to 59</span>
                </div>
              </div>
              <p className={styles.zoneDetails}>
                High-performance cognitive training aimed at mental sharpness, focus under pressure, and technical mastery.
              </p>
              <div className={styles.zoneChips}>
                <span className={styles.zoneChip}>Analytical Reasoning</span>
                <span className={styles.zoneChip}>Mental Agility</span>
                <span className={styles.zoneChip}>SQL & Code Tasks</span>
                <span className={styles.zoneChip}>Daily Streaks</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleProtectedAction('/dashboard/adults', 'adults')}
              className={styles.zoneActionBtn}
              style={{ background: '#BAE6FD', color: '#0369A1' }}
            >
              Explore Adults Zone →
            </button>
          </div>

          {/* Seniors Zone */}
          <div className={styles.zoneCard}>
            <div>
              <div className={styles.zoneIconRow}>
                <img src={seniorAvatarImg} alt="Seniors Zone" className={styles.zoneAvatarMini} />
                <div>
                  <h3 className={styles.zoneName}>Seniors Zone</h3>
                  <span className={styles.zoneAgeTag} style={{ color: '#34D399' }}>Ages 60+</span>
                </div>
              </div>
              <p className={styles.zoneDetails}>
                Relaxed, high-contrast activities designed to nurture neuroplasticity, memory retention, and mental vitality.
              </p>
              <div className={styles.zoneChips}>
                <span className={styles.zoneChip}>Memory Retention</span>
                <span className={styles.zoneChip}>Verbal Fluency</span>
                <span className={styles.zoneChip}>Calm Pacing</span>
                <span className={styles.zoneChip}>Audio Guidance</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleProtectedAction('/dashboard/seniors', 'seniors')}
              className={styles.zoneActionBtn}
              style={{ background: '#BBF7D0', color: '#15803D' }}
            >
              Explore Seniors Zone →
            </button>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. IN-PAGE GUEST PREVIEW: HOW IT WORKS (#how-it-works)
          ==================================================================== */}
      <section id="how-it-works" className={styles.contentSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>✨ Learning Pathway</div>
          <h2 className={styles.sectionTitle}>How SparkoMind Works</h2>
          <p className={styles.sectionSubtitle}>
            A scientifically structured 4-step framework designed to make mental growth effortless and fun.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>01</div>
            <h3 className={styles.stepTitle}>Choose Your Age Zone</h3>
            <p className={styles.stepDesc}>
              Personalize your starting difficulty and avatar according to your demographic.
            </p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>02</div>
            <h3 className={styles.stepTitle}>10-Minute Daily Challenges</h3>
            <p className={styles.stepDesc}>
              Complete quick micro-workouts that stimulate logic, visual memory, and quick reaction.
            </p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>03</div>
            <h3 className={styles.stepTitle}>Zero-Trust Verification</h3>
            <p className={styles.stepDesc}>
              Challenges are evaluated on the server with deterministic rules and tamper-proof scoring.
            </p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>04</div>
            <h3 className={styles.stepTitle}>Track Neural Growth</h3>
            <p className={styles.stepDesc}>
              Watch your neuro-metrics rise, maintain daily streaks, and unlock certified badges.
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. IN-PAGE GUEST PREVIEW: ABOUT (#about)
          ==================================================================== */}
      <section id="about" className={styles.contentSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>💡 Our Mission</div>
          <h2 className={styles.sectionTitle}>About SparkoMind</h2>
          <p className={styles.sectionSubtitle}>
            Bridging cognitive science, interactive play, and lifelong skill building.
          </p>
        </div>

        <div className={styles.aboutCard}>
          <div className={styles.aboutText}>
            <h3>Empowering Every Generation to Think Faster and Smarter</h3>
            <p>
              SparkoMind was founded with a singular purpose: to make brain training as engaging as modern gaming
              while remaining rooted in verified neuro-psychological principles. From a child discovering their first
              coding loop to a senior keeping their memory sharp, SparkoMind provides an inclusive ecosystem.
            </p>
            <div className={styles.ctaGroup}>
              <Link to="/register" className={styles.primaryCta}>
                Join Free Today →
              </Link>
            </div>
          </div>

          <div className={styles.aboutStatsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statVal}>98.4%</span>
              <span className={styles.statDesc}>Focus Improvement Rate</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statVal}>12+</span>
              <span className={styles.statDesc}>Cognitive Game Engines</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statVal}>100%</span>
              <span className={styles.statDesc}>Zero-Trust Verification</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statVal}>3</span>
              <span className={styles.statDesc}>Dedicated Age Zones</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          7. IN-PAGE SPLIT INTERACTIVE CONTACT SECTION (#contact)
          ==================================================================== */}
      <Contact />

      {/* ====================================================================
          8. COMPREHENSIVE 4-COLUMN ENTERPRISE FOOTER
          ==================================================================== */}
      <Footer />

      {/* Primary Circular Floating Smooth-Scroll Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className={styles.backToTopBtn}
          aria-label="Back to top"
        >
          <ArrowUp size={22} />
        </button>
      )}
    </div>
  );
};

export default LandingPage;
