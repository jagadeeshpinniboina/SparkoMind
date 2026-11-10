import fs from 'fs';
import path from 'path';

const games = [
  // ---------------- KIDS ZONE ----------------
  {
    title: 'Memory Match',
    slug: 'memory-match',
    description: 'Flip colorful cards and uncover matching pairs of friendly animals, toys, and magical wonders.',
    tagline: 'Flip, match, and explore friendly wonders!',
    engine: 'CardMemoryEngine',
    category: 'memory',
    demographics: ['kids'],
    icon: 'Layers',
    color: '#3B82F6',
    difficultyLevels: [
      { level: 1, title: 'Level 1: Animal Friends', parTimeSeconds: 30 },
      { level: 2, title: 'Level 2: Cosmic Toys', parTimeSeconds: 40 },
      { level: 3, title: 'Level 3: Fruit Garden', parTimeSeconds: 45 },
      { level: 4, title: 'Level 4: Mini Monsters', parTimeSeconds: 50 },
      { level: 5, title: 'Level 5: Magic Wonders', parTimeSeconds: 60 }
    ]
  },
  {
    title: 'Pattern Planet',
    slug: 'pattern-planet',
    description: 'Watch the glowing cosmic stars illuminate the galaxy matrix and recreate their constellations.',
    tagline: 'Watch cosmic stars glow and recreate the constellation.',
    engine: 'GridMatrixEngine',
    category: 'spatial',
    demographics: ['kids'],
    icon: 'Grid',
    color: '#F59E0B',
    difficultyLevels: [
      { level: 1, title: 'Level 1: Little Stars', parTimeSeconds: 20 },
      { level: 2, title: 'Level 2: Star Corners', parTimeSeconds: 25 },
      { level: 3, title: 'Level 3: Cross Star', parTimeSeconds: 30 },
      { level: 4, title: 'Level 4: Galaxy Zigzag', parTimeSeconds: 35 },
      { level: 5, title: 'Level 5: Constellation Ring', parTimeSeconds: 40 }
    ]
  },
  {
    title: 'Maze Explorer',
    slug: 'maze-explorer',
    description: 'Guide the adventurer through winding trails to reach the treasure chest without touching mud puddles.',
    tagline: 'Plot safe paths around mud puddles to reach the treasure!',
    engine: 'SpatialPathEngine',
    category: 'spatial',
    demographics: ['kids'],
    icon: 'Compass',
    color: '#10B981',
    difficultyLevels: [
      { level: 1, title: 'Level 1: Meadow Trail', parTimeSeconds: 25 },
      { level: 2, title: 'Level 2: River Crossing', parTimeSeconds: 30 },
      { level: 3, title: 'Level 3: Forest Path', parTimeSeconds: 35 },
      { level: 4, title: 'Level 4: Mountain Track', parTimeSeconds: 40 },
      { level: 5, title: 'Level 5: Dragon Castle', parTimeSeconds: 45 }
    ]
  },
  {
    title: 'Robo Rescue',
    slug: 'robo-rescue',
    description: 'Send step-by-step color sequences to navigate and recharge the friendly rescue robot.',
    tagline: 'Send color sequence signals to guide the rescue bot!',
    engine: 'SequenceCodeEngine',
    category: 'sequence',
    demographics: ['kids'],
    icon: 'Binary',
    color: '#EC4899',
    difficultyLevels: [
      { level: 1, title: 'Level 1: Boot Signals', parTimeSeconds: 20 },
      { level: 2, title: 'Level 2: Battery Charge', parTimeSeconds: 25 },
      { level: 3, title: 'Level 3: Radar Beam', parTimeSeconds: 30 },
      { level: 4, title: 'Level 4: Turbo Thruster', parTimeSeconds: 35 },
      { level: 5, title: 'Level 5: Orbit Maneuver', parTimeSeconds: 40 }
    ]
  },
  {
    title: 'Math Quest',
    slug: 'math-quest',
    description: 'Solve cheerful arithmetic riddles and number challenges to unlock magical castle gates.',
    tagline: 'Solve cheerful number riddles to open mystery chests!',
    engine: 'ChoiceLogicEngine',
    category: 'logic',
    demographics: ['kids'],
    icon: 'BrainCircuit',
    color: '#6366F1',
    difficultyLevels: [
      { level: 1, title: 'Level 1: Apple Orchard', parTimeSeconds: 25 },
      { level: 2, title: 'Level 2: Duckling Pond', parTimeSeconds: 25 },
      { level: 3, title: 'Level 3: Star Baskets', parTimeSeconds: 30 },
      { level: 4, title: 'Level 4: Space Candy', parTimeSeconds: 35 },
      { level: 5, title: 'Level 5: Mystery Train', parTimeSeconds: 40 }
    ]
  },

  // ---------------- ADULT ZONE ----------------
  {
    title: 'Code Sprint',
    slug: 'code-sprint',
    description: 'Memorize and execute algorithmic token pipelines and execution triggers with peak velocity.',
    tagline: 'Memorize and execute algorithmic token pipelines with speed.',
    engine: 'SequenceCodeEngine',
    category: 'sequence',
    demographics: ['adults'],
    icon: 'Binary',
    color: '#6366F1',
    difficultyLevels: [
      { level: 1, title: 'Level 1: Data Pipeline', parTimeSeconds: 25 },
      { level: 2, title: 'Level 2: Auth Flow', parTimeSeconds: 25 },
      { level: 3, title: 'Level 3: Event Loop', parTimeSeconds: 30 },
      { level: 4, title: 'Level 4: Microservice Mesh', parTimeSeconds: 35 },
      { level: 5, title: 'Level 5: Zero-Knowledge Proof', parTimeSeconds: 40 }
    ]
  },
  {
    title: 'Logic Arena',
    slug: 'logic-arena',
    description: 'Evaluate formal syllogisms, Boolean constraints, and deduction matrices under par time.',
    tagline: 'Evaluate formal logic, syllogisms, and deduction trees.',
    engine: 'ChoiceLogicEngine',
    category: 'logic',
    demographics: ['adults'],
    icon: 'Brain',
    color: '#8B5CF6',
    difficultyLevels: [
      { level: 1, title: 'Level 1: Consequent Fallacy', parTimeSeconds: 25 },
      { level: 2, title: 'Level 2: Modus Tollens', parTimeSeconds: 30 },
      { level: 3, title: 'Level 3: Multi-Process Ordering', parTimeSeconds: 35 },
      { level: 4, title: 'Level 4: Leader Consensus', parTimeSeconds: 40 },
      { level: 5, title: 'Level 5: Boolean Satisfiability', parTimeSeconds: 45 }
    ]
  },
  {
    title: 'SQL Quest',
    slug: 'sql-quest',
    description: 'Debug relational algebra, JOIN topologies, window aggregates, and transactional isolation anomalies.',
    tagline: 'Debug relational operations, JOIN trees, and window aggregates.',
    engine: 'ChoiceLogicEngine',
    category: 'logic',
    demographics: ['adults'],
    icon: 'BrainCircuit',
    color: '#0EA5E9',
    difficultyLevels: [
      { level: 1, title: 'Level 1: Execution Order', parTimeSeconds: 25 },
      { level: 2, title: 'Level 2: Aggregation Filtering', parTimeSeconds: 30 },
      { level: 3, title: 'Level 3: Outer Join Topology', parTimeSeconds: 35 },
      { level: 4, title: 'Level 4: Window Partitions', parTimeSeconds: 40 },
      { level: 5, title: 'Level 5: Transaction Isolation', parTimeSeconds: 45 }
    ]
  },
  {
    title: 'Memory Matrix',
    slug: 'memory-matrix',
    description: 'High-density spatial pattern recall across expanding multi-dimensional coordinate grids.',
    tagline: 'High-density spatial pattern recall on expanding grids.',
    engine: 'GridMatrixEngine',
    category: 'memory',
    demographics: ['adults'],
    icon: 'Grid',
    color: '#10B981',
    difficultyLevels: [
      { level: 1, title: 'Level 1: 4x4 Quad Core', parTimeSeconds: 20 },
      { level: 2, title: 'Level 2: 4x4 Circuit', parTimeSeconds: 25 },
      { level: 3, title: 'Level 3: 5x5 Silicon Grid', parTimeSeconds: 30 },
      { level: 4, title: 'Level 4: 5x5 Neural Synapse', parTimeSeconds: 35 },
      { level: 5, title: 'Level 5: 6x6 Quantum Lattice', parTimeSeconds: 40 }
    ]
  },
  {
    title: 'Cyber Detective',
    slug: 'cyber-detective',
    description: 'Analyze digital telemetry, packet anomalies, and cryptographic indicators of compromise.',
    tagline: 'Analyze digital network forensics, IOCs, and protocol anomalies.',
    engine: 'ChoiceLogicEngine',
    category: 'logic',
    demographics: ['adults'],
    icon: 'Shield',
    color: '#EF4444',
    difficultyLevels: [
      { level: 1, title: 'Level 1: Web Intrusion Pattern', parTimeSeconds: 25 },
      { level: 2, title: 'Level 2: Credential Defense', parTimeSeconds: 30 },
      { level: 3, title: 'Level 3: C2 Beacon Detection', parTimeSeconds: 35 },
      { level: 4, title: 'Level 4: Token Signature Forgery', parTimeSeconds: 40 },
      { level: 5, title: 'Level 5: Exfiltration Channel', parTimeSeconds: 45 }
    ]
  },

  // ---------------- SENIOR ZONE ----------------
  {
    title: 'Memory Garden',
    slug: 'memory-garden',
    description: 'Delight in peaceful botanical flower pairings designed for soothing, zero-stress visual recall.',
    tagline: 'Peaceful botanical pairings for soothing visual recall.',
    engine: 'CardMemoryEngine',
    category: 'memory',
    demographics: ['seniors'],
    icon: 'Layers',
    color: '#059669',
    difficultyLevels: [
      { level: 1, title: 'Level 1: Spring Blossom', parTimeSeconds: 40 },
      { level: 2, title: 'Level 2: Greenhouse Flora', parTimeSeconds: 45 },
      { level: 3, title: 'Level 3: Rose Sanctuary', parTimeSeconds: 50 },
      { level: 4, title: 'Level 4: Perennial Meadow', parTimeSeconds: 55 },
      { level: 5, title: 'Level 5: Royal Arboretum', parTimeSeconds: 65 }
    ]
  },
  {
    title: 'Everyday Math',
    slug: 'everyday-math',
    description: 'Maintain practical financial sharpness, grocery budgeting, and mental calculations with calm clarity.',
    tagline: 'Maintain everyday financial clarity and mental calculations.',
    engine: 'ChoiceLogicEngine',
    category: 'logic',
    demographics: ['seniors'],
    icon: 'Brain',
    color: '#0284C7',
    difficultyLevels: [
      { level: 1, title: 'Level 1: Market Register', parTimeSeconds: 35 },
      { level: 2, title: 'Level 2: Produce Pricing', parTimeSeconds: 35 },
      { level: 3, title: 'Level 3: Seasonal Discount', parTimeSeconds: 40 },
      { level: 4, title: 'Level 4: Utility Averages', parTimeSeconds: 45 },
      { level: 5, title: 'Level 5: Savings Growth', parTimeSeconds: 50 }
    ]
  },
  {
    title: 'Word Garden',
    slug: 'word-garden',
    description: 'Reawaken vocabulary, proverbs, and soothing word associations in a calm garden atmosphere.',
    tagline: 'Reawaken vocabulary and soothing proverb associations.',
    engine: 'CardMemoryEngine',
    category: 'memory',
    demographics: ['seniors'],
    icon: 'Layers',
    color: '#D97706',
    difficultyLevels: [
      { level: 1, title: 'Level 1: Daily Horizons', parTimeSeconds: 40 },
      { level: 2, title: 'Level 2: Four Seasons', parTimeSeconds: 45 },
      { level: 3, title: 'Level 3: Mindful Harmony', parTimeSeconds: 50 },
      { level: 4, title: 'Level 4: Nature Whispers', parTimeSeconds: 55 },
      { level: 5, title: 'Level 5: Lifelong Virtues', parTimeSeconds: 65 }
    ]
  },
  {
    title: 'Sequence Steps',
    slug: 'sequence-steps',
    description: 'Follow gentle stepping stones across a calming zen pond with generous contrast and relaxed pacing.',
    tagline: 'Follow gentle stepping stones across a tranquil zen pond.',
    engine: 'GridMatrixEngine',
    category: 'sequence',
    demographics: ['seniors'],
    icon: 'Grid',
    color: '#10B981',
    difficultyLevels: [
      { level: 1, title: 'Level 1: Gentle Ripples', parTimeSeconds: 30 },
      { level: 2, title: 'Level 2: Garden Stream', parTimeSeconds: 35 },
      { level: 3, title: 'Level 3: Stone Pathway', parTimeSeconds: 40 },
      { level: 4, title: 'Level 4: Lotus Stepping', parTimeSeconds: 45 },
      { level: 5, title: 'Level 5: Zen Sanctuary', parTimeSeconds: 50 }
    ]
  },
  {
    title: 'Picture Puzzle',
    slug: 'picture-puzzle',
    description: 'Stroll scenic garden paths from the morning gate to the gazebo avoiding garden obstacles.',
    tagline: 'Stroll scenic garden paths from the rose pergola to the gazebo.',
    engine: 'SpatialPathEngine',
    category: 'spatial',
    demographics: ['seniors'],
    icon: 'Compass',
    color: '#06B6D4',
    difficultyLevels: [
      { level: 1, title: 'Level 1: Fountain Walk', parTimeSeconds: 35 },
      { level: 2, title: 'Level 2: Flower Border', parTimeSeconds: 40 },
      { level: 3, title: 'Level 3: Stone Walkway', parTimeSeconds: 45 },
      { level: 4, title: 'Level 4: Pergola Path', parTimeSeconds: 50 },
      { level: 5, title: 'Level 5: Lakeside Gazebo', parTimeSeconds: 55 }
    ]
  }
];

export { games };
