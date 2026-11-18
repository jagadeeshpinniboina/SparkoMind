export const ADULTS_GAMES = [
  {
    id: 'neuro-matrix',
    title: 'NeuroMatrix',
    tagline: 'Memorize and reconstruct spatial patterns across rotating coordinate matrices.',
    category: 'Working Memory',
    targetAge: 'Ages 18–55',
    totalLevels: 5,
    skills: ['Spatial Recall', 'Mental Rotation'],
    icon: '🧠',
    accentColor: '#06B6D4',
    levels: [
      { level: 1, title: 'Direct Recall', description: 'Memorize 4 spatial coordinates on a 4x4 matrix and reconstruct the exact pattern.' },
      { level: 2, title: '90° Clockwise Shift', description: 'Retain spatial coordinates and mentally rotate the matrix 90° clockwise.' },
      { level: 3, title: 'Counter-Clockwise Shift', description: 'Expand to a 5x5 matrix and execute a 90° CCW mental rotation.' },
      { level: 4, title: 'Horizontal Mirror Flip', description: 'Reflect 5 coordinates horizontally across the vertical reflection axis.' },
      { level: 5, title: 'Sequential Chain', description: 'Memorize 5 numbered neural nodes (1 to 5) and recall them in strict ascending order.' }
    ]
  },
  {
    id: 'chrono-reflex',
    title: 'ChronoReflex',
    tagline: 'React under millisecond pressure as dynamic color-ink and rule switches test your focus.',
    category: 'Executive Focus',
    targetAge: 'Ages 18–55',
    totalLevels: 5,
    skills: ['Cognitive Control', 'Reflex Speed'],
    icon: '⚡',
    accentColor: '#10B981',
    levels: [
      { level: 1, title: 'Color Calibration', description: 'Establish baseline neural reflex speed: React strictly to ink colors with congruent text.' },
      { level: 2, title: 'Stroop Conflict', description: 'Cognitive interference active: Suppress semantic text labels and react strictly to conflicting font ink.' },
      { level: 3, title: 'Rule Switcher', description: 'Dynamic task switching: React alternately to ink color or semantic word meaning on the fly.' },
      { level: 4, title: 'Spatial Vector Conflict', description: 'Simon Effect: Resolve spatial conflicts between arrow direction and screen position.' },
      { level: 5, title: 'Neuro Overdrive', description: 'High-velocity cognitive overdrive: Rapid 1.5s window alternating Color Stroop & Vector shifts.' }
    ]
  },
  {
    id: 'neon-sudoku',
    title: 'Neon Sudoku',
    tagline: 'Solve high-speed 4×4 and 6×6 number matrices using pure row, column, and box deduction.',
    category: 'Deductive Logic',
    targetAge: 'Ages 18–55',
    totalLevels: 5,
    skills: ['Deductive Logic', 'Pattern Elimination'],
    icon: '🔢',
    accentColor: '#06B6D4',
    levels: [
      { level: 1, title: 'Warmup Matrix', description: '4×4 grid with 2×2 sub-boxes and 10 starting clues. Fill numbers 1–4.' },
      { level: 2, title: 'Speed Matrix', description: '4×4 grid with 8 starting clues requiring quick elimination.' },
      { level: 3, title: 'Expert Quadrant', description: '4×4 grid with 6 minimal clues demanding precision deduction.' },
      { level: 4, title: 'Classic Arena', description: 'Full 9×9 Sudoku with 3×3 sub-boxes and 46 clues. Fill digits 1–9.' },
      { level: 5, title: 'Grandmaster Matrix', description: 'Full 9×9 Sudoku with 36 clues demanding deep row, column, and box deduction.' }
    ]
  },
  {
    id: 'crown-grid',
    title: 'Crown Grid',
    tagline: 'Place one crown per row, column, and color territory without letting any crowns touch.',
    category: 'Spatial Deduction',
    targetAge: 'Ages 18–55',
    totalLevels: 5,
    skills: ['Constraint Logic', 'Spatial Elimination'],
    icon: '👑',
    accentColor: '#F59E0B',
    levels: [
      { level: 1, title: 'Starter Regions', description: '5×5 grid with 5 color territories. Learn the 3 core crown placement rules.' },
      { level: 2, title: 'Interlocking Zones', description: '5×5 grid with irregular territories requiring corner deduction.' },
      { level: 3, title: 'Hexa Territories', description: '6×6 grid introducing 6 color territories with expanded elimination options.' },
      { level: 4, title: 'Diagonal Trap', description: '6×6 grid with winding territories designed around diagonal adjacency deduction.' },
      { level: 5, title: 'Sovereign Matrix', description: '7×7 grid with 7 territories for the ultimate grandmaster spatial deduction.' }
    ]
  }
];

export default ADULTS_GAMES;
