import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Trophy, Medal, Flame, Star, Sparkles, Filter, 
  Search, Shield, Users, ArrowUp, ArrowDown, Award,
  Rocket, Zap, HeartHandshake
} from 'lucide-react';
import { useLiveUserStats } from '../../utils/userStats.js';
import AvatarRenderer from '../../components/common/AvatarRenderer.jsx';
import styles from './LeaderboardPage.module.css';

// 1. Kids Universe Peer Explorers (Ages 6–12)
const KIDS_PEERS = [
  {
    id: 'kid-peer-1',
    name: 'Aarav Sharma',
    username: '@aarav_robot',
    avatar: '🤖',
    zone: 'kids',
    zoneLabel: 'Kids Universe',
    level: 4,
    streak: 9,
    xp: 1850,
    stars: 42,
    badge: 'Robot Architect',
    specialty: 'BotScript'
  },
  {
    id: 'kid-peer-2',
    name: 'Maya Lin',
    username: '@maya_orbits',
    avatar: '🪐',
    zone: 'kids',
    zoneLabel: 'Kids Universe',
    level: 3,
    streak: 6,
    xp: 1220,
    stars: 31,
    badge: 'Slingshot Ace',
    specialty: 'Gravity Sling'
  },
  {
    id: 'kid-peer-3',
    name: 'Ananya Roy',
    username: '@ananya_colors',
    avatar: '🧪',
    zone: 'kids',
    zoneLabel: 'Kids Universe',
    level: 3,
    streak: 4,
    xp: 940,
    stars: 22,
    badge: 'Photon Wizard',
    specialty: 'Color Lab'
  },
  {
    id: 'kid-peer-4',
    name: 'Kabir Das',
    username: '@kabir_circuits',
    avatar: '⚡',
    zone: 'kids',
    zoneLabel: 'Kids Universe',
    level: 4,
    streak: 7,
    xp: 1420,
    stars: 36,
    badge: 'Circuit Explorer',
    specialty: 'Circuit Connect'
  },
  {
    id: 'kid-peer-5',
    name: 'Zoya Khan',
    username: '@zoya_cosmos',
    avatar: '🌟',
    zone: 'kids',
    zoneLabel: 'Kids Universe',
    level: 5,
    streak: 11,
    xp: 2100,
    stars: 48,
    badge: 'Star Navigator',
    specialty: 'All Labs'
  }
];

// 2. Adults Neuro-Lab Peers (Ages 18–55)
const ADULTS_PEERS = [
  {
    id: 'adult-peer-1',
    name: 'Rohan Mehta',
    username: '@rohan_code',
    avatar: '⚡',
    zone: 'adults',
    zoneLabel: 'Adults Neuro-Lab',
    level: 4,
    streak: 8,
    xp: 1680,
    stars: 38,
    badge: 'Logic Master',
    specialty: 'Neon Sudoku'
  },
  {
    id: 'adult-peer-2',
    name: 'Elena Rostova',
    username: '@elena_synapse',
    avatar: '🧠',
    zone: 'adults',
    zoneLabel: 'Adults Neuro-Lab',
    level: 5,
    streak: 12,
    xp: 2320,
    stars: 54,
    badge: 'Synapse Architect',
    specialty: 'NeuroMatrix'
  },
  {
    id: 'adult-peer-3',
    name: 'Marcus Vance',
    username: '@marcus_grid',
    avatar: '👑',
    zone: 'adults',
    zoneLabel: 'Adults Neuro-Lab',
    level: 4,
    streak: 10,
    xp: 1890,
    stars: 44,
    badge: 'Spatial Strategist',
    specialty: 'CrownGrid'
  },
  {
    id: 'adult-peer-4',
    name: 'Priya Nair',
    username: '@priya_reflex',
    avatar: '⚡',
    zone: 'adults',
    zoneLabel: 'Adults Neuro-Lab',
    level: 3,
    streak: 5,
    xp: 1240,
    stars: 29,
    badge: 'Chrono Specialist',
    specialty: 'ChronoReflex'
  },
  {
    id: 'adult-peer-5',
    name: 'Liam Chen',
    username: '@liam_tactics',
    avatar: '🌟',
    zone: 'adults',
    zoneLabel: 'Adults Neuro-Lab',
    level: 4,
    streak: 7,
    xp: 1510,
    stars: 35,
    badge: 'Neural Tactician',
    specialty: 'All Labs'
  }
];

// 3. Senior Sanctuary Peers (Ages 60+)
const SENIORS_PEERS = [
  {
    id: 'senior-peer-1',
    name: 'Dr. Evelyn Reed',
    username: '@evelyn_neuro',
    avatar: '🌟',
    zone: 'seniors',
    zoneLabel: 'Senior Sanctuary',
    level: 5,
    streak: 15,
    xp: 2450,
    stars: 58,
    badge: 'Heritage Sage',
    specialty: 'Heritage Match'
  },
  {
    id: 'senior-peer-2',
    name: 'Col. K. Verma',
    username: '@verma_timber',
    avatar: '🔩',
    zone: 'seniors',
    zoneLabel: 'Senior Sanctuary',
    level: 3,
    streak: 7,
    xp: 1100,
    stars: 26,
    badge: 'Timber Crafter',
    specialty: 'TimberUnbolt'
  },
  {
    id: 'senior-peer-3',
    name: 'Margaret Wood',
    username: '@margaret_quilt',
    avatar: '🧵',
    zone: 'seniors',
    zoneLabel: 'Senior Sanctuary',
    level: 4,
    streak: 9,
    xp: 1580,
    stars: 37,
    badge: 'Quilt Weaver',
    specialty: 'QuiltPatches'
  },
  {
    id: 'senior-peer-4',
    name: 'Samuel Bennett',
    username: '@samuel_zen',
    avatar: '🌾',
    zone: 'seniors',
    zoneLabel: 'Senior Sanctuary',
    level: 3,
    streak: 6,
    xp: 1250,
    stars: 28,
    badge: 'Zen Navigator',
    specialty: 'GoldenZip'
  },
  {
    id: 'senior-peer-5',
    name: 'Grace Thorne',
    username: '@grace_vitality',
    avatar: '🪔',
    zone: 'seniors',
    zoneLabel: 'Senior Sanctuary',
    level: 4,
    streak: 12,
    xp: 1920,
    stars: 45,
    badge: 'Golden Artisan',
    specialty: 'All Labs'
  }
];

const ZONE_CONFIG = {
  kids: {
    title: 'Kids Universe Star Leaderboard',
    subtitle: 'Live rankings based on Wonder Stars harvested, total STEM lab XP velocity, and exploration streaks.',
    icon: Trophy,
    filters: ['All Labs', 'BotScript', 'Circuit Connect', 'Gravity Sling', 'Color Lab'],
    peers: KIDS_PEERS,
    zoneLabel: 'Kids Universe',
    defaultBadge: 'Space Cadet Pioneer'
  },
  adults: {
    title: 'Adults Neuro-Lab Cognitive Leaderboard',
    subtitle: 'Live rankings based on cognitive accuracy, high-velocity logic puzzles, and daily synaptic workouts.',
    icon: Zap,
    filters: ['All Labs', 'NeuroMatrix', 'ChronoReflex', 'Neon Sudoku', 'CrownGrid'],
    peers: ADULTS_PEERS,
    zoneLabel: 'Adults Neuro-Lab',
    defaultBadge: 'Neural Specialist'
  },
  seniors: {
    title: 'Senior Sanctuary Vitality Leaderboard',
    subtitle: 'Live rankings celebrating cognitive vitality, cultural memory mastery, and mindful play streaks.',
    icon: HeartHandshake,
    filters: ['All Labs', 'Heritage Match', 'GoldenZip', 'QuiltPatches', 'TimberUnbolt'],
    peers: SENIORS_PEERS,
    zoneLabel: 'Senior Sanctuary',
    defaultBadge: 'Vitality Sage'
  }
};

export const LeaderboardPage = () => {
  const location = useLocation();
  const {
    displayName,
    avatar,
    totalStars,
    totalXp,
    level,
    streak
  } = useLiveUserStats();

  // Zone resolution: route path -> localStorage active zone -> default 'kids'
  const pathZone = location.pathname.includes('/adults') 
    ? 'adults' 
    : location.pathname.includes('/seniors') 
    ? 'seniors' 
    : location.pathname.includes('/kids') 
    ? 'kids' 
    : null;
  const storedZone = typeof window !== 'undefined' ? localStorage.getItem('sparkomind_active_zone') : null;
  const initialZone = pathZone || storedZone || 'kids';

  const [activeZone, setActiveZone] = useState(
    ['kids', 'adults', 'seniors'].includes(initialZone) ? initialZone : 'kids'
  );
  const [activeTab, setActiveTab] = useState('All Labs');
  const [searchQuery, setSearchQuery] = useState('');

  const currentZoneMeta = ZONE_CONFIG[activeZone] || ZONE_CONFIG.kids;

  // Current logged in user object dynamically merged
  const currentUserPeer = useMemo(() => ({
    id: 'current-user',
    name: displayName || 'Jagadeesh Pinniboina',
    username: '@' + (displayName || 'Jagadeesh').toLowerCase().replace(/\s+/g, '_'),
    avatar: avatar || '🚀',
    zone: activeZone,
    zoneLabel: currentZoneMeta.zoneLabel,
    level: level || 1,
    streak: streak || 1,
    xp: totalXp || 120,
    stars: totalStars || 0,
    badge: currentZoneMeta.defaultBadge,
    specialty: 'All Labs',
    isCurrentUser: true
  }), [displayName, avatar, activeZone, currentZoneMeta, level, streak, totalXp, totalStars]);

  // Merge and sort dynamically by XP descending
  const sortedLeaderboard = useMemo(() => {
    const list = [...currentZoneMeta.peers, currentUserPeer];
    list.sort((a, b) => b.xp - a.xp);
    return list.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [currentZoneMeta.peers, currentUserPeer]);

  // Filter by lab pill and search query
  const filteredList = useMemo(() => {
    return sortedLeaderboard.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.badge.toLowerCase().includes(searchQuery.toLowerCase());

      const matchLab =
        activeTab === 'All Labs' || activeTab === 'All'
          ? true
          : (item.specialty === activeTab || item.specialty === 'All Labs' || item.isCurrentUser);

      return matchSearch && matchLab;
    });
  }, [sortedLeaderboard, activeTab, searchQuery]);

  const top3 = sortedLeaderboard.slice(0, 3);
  const myRank = sortedLeaderboard.find((p) => p.isCurrentUser)?.rank || 1;
  const HeaderIcon = currentZoneMeta.icon;

  return (
    <div className={styles.container}>
      {/* 1. Header Row */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>
            <HeaderIcon size={28} className={styles.trophyIcon} />
            <span>{currentZoneMeta.title}</span>
          </h1>
          <p className={styles.pageSubtitle}>
            {currentZoneMeta.subtitle}
          </p>
        </div>

        {/* Zone Switch Tabs & Current User Rank Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.zoneSwitchTabs}>
            <button
              type="button"
              className={`${styles.zoneSwitchBtn} ${activeZone === 'kids' ? styles.zoneSwitchActive : ''}`}
              onClick={() => { setActiveZone('kids'); setActiveTab('All Labs'); }}
            >
              🚀 Kids Universe
            </button>
            <button
              type="button"
              className={`${styles.zoneSwitchBtn} ${activeZone === 'adults' ? styles.zoneSwitchActive : ''}`}
              onClick={() => { setActiveZone('adults'); setActiveTab('All Labs'); }}
            >
              ⚡ Adults Arena
            </button>
            <button
              type="button"
              className={`${styles.zoneSwitchBtn} ${activeZone === 'seniors' ? styles.zoneSwitchActive : ''}`}
              onClick={() => { setActiveZone('seniors'); setActiveTab('All Labs'); }}
            >
              🌿 Senior Sanctuary
            </button>
          </div>

          <div className={styles.myRankPill}>
            <span className={styles.myRankBadge}>#{myRank}</span>
            <div>
              <div className={styles.myRankName}>{displayName} (You)</div>
              <div className={styles.myRankScore}>⭐ {totalStars} Stars • {totalXp} XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top 3 Podium Cards */}
      <div className={styles.podiumGrid}>
        {top3.map((podiumItem, idx) => {
          const podiumClass = idx === 0 ? styles.podiumGold : idx === 1 ? styles.podiumSilver : styles.podiumBronze;
          const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';

          return (
            <div key={podiumItem.id} className={`${styles.podiumCard} ${podiumClass}`}>
              <div className={styles.podiumMedal}>{medal}</div>
              <div className={styles.podiumAvatar}>
                <AvatarRenderer avatar={podiumItem.avatar} name={podiumItem.name} size="lg" />
              </div>
              <h3 className={styles.podiumName}>
                {podiumItem.name}
                {podiumItem.isCurrentUser && <span className={styles.youBadge}>You</span>}
              </h3>
              <span className={styles.podiumBadge}>{podiumItem.badge}</span>
              <div className={styles.podiumStats}>
                <span className={styles.podiumStars}>⭐ {podiumItem.stars} Stars</span>
                <span className={styles.podiumXp}>{podiumItem.xp} XP</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Search & Filter Bar */}
      <div className={styles.controlBar}>
        <div className={styles.filterTabs}>
          {currentZoneMeta.filters.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search learners by name or badge..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* 4. Ranked List Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span className={styles.colRank}>Rank</span>
          <span className={styles.colLearner}>Learner</span>
          <span className={styles.colZone}>Zone</span>
          <span className={styles.colStreak}>Streak</span>
          <span className={styles.colStars}>Stars</span>
          <span className={styles.colXp}>Total XP</span>
        </div>

        <div className={styles.tableBody}>
          {filteredList.map((item) => (
            <div
              key={item.id}
              className={`${styles.tableRow} ${item.isCurrentUser ? styles.rowCurrentUser : ''}`}
            >
              <div className={styles.colRank}>
                <span className={`${styles.rankPill} ${item.rank <= 3 ? styles['rankPill_' + item.rank] : ''}`}>
                  #{item.rank}
                </span>
              </div>

              <div className={styles.colLearner}>
                <div className={styles.tableAvatar}>
                  <AvatarRenderer avatar={item.avatar} name={item.name} size="sm" />
                </div>
                <div>
                  <div className={styles.learnerName}>
                    {item.name}
                    {item.isCurrentUser && <span className={styles.youTag}>YOU</span>}
                  </div>
                  <div className={styles.learnerHandle}>{item.username} • {item.badge}</div>
                </div>
              </div>

              <div className={styles.colZone}>
                <span className={styles.zoneTag}>{item.zoneLabel}</span>
              </div>

              <div className={styles.colStreak}>
                <span className={styles.streakText}>🔥 {item.streak}d</span>
              </div>

              <div className={styles.colStars}>
                <span className={styles.starsText}>⭐ {item.stars}</span>
              </div>

              <div className={styles.colXp}>
                <span className={styles.xpText}>{item.xp} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
