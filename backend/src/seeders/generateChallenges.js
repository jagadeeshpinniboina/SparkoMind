/**
 * Generates the complete array of 75 challenges (5 levels for each of the 15 games)
 */
export function getChallenges(gameMap) {
  const challenges = [];

  // =========================================================================
  // 1. KIDS ZONE
  // =========================================================================

  // 1.1 Memory Match (CardMemoryEngine)
  const memoryMatchCards = [
    // Level 1: 4 pairs (8 cards)
    [
      { id: 'c1', symbol: 'Puppy' }, { id: 'c2', symbol: 'Kitten' },
      { id: 'c3', symbol: 'Bunny' }, { id: 'c4', symbol: 'Puppy' },
      { id: 'c5', symbol: 'Bear' }, { id: 'c6', symbol: 'Kitten' },
      { id: 'c7', symbol: 'Bunny' }, { id: 'c8', symbol: 'Bear' }
    ],
    // Level 2: 4 pairs (8 cards)
    [
      { id: 'c1', symbol: 'Rocket' }, { id: 'c2', symbol: 'Star' },
      { id: 'c3', symbol: 'Train' }, { id: 'c4', symbol: 'Rocket' },
      { id: 'c5', symbol: 'Car' }, { id: 'c6', symbol: 'Star' },
      { id: 'c7', symbol: 'Train' }, { id: 'c8', symbol: 'Car' }
    ],
    // Level 3: 6 pairs (12 cards)
    [
      { id: 'c1', symbol: 'Apple' }, { id: 'c2', symbol: 'Banana' },
      { id: 'c3', symbol: 'Orange' }, { id: 'c4', symbol: 'Grape' },
      { id: 'c5', symbol: 'Berry' }, { id: 'c6', symbol: 'Melon' },
      { id: 'c7', symbol: 'Apple' }, { id: 'c8', symbol: 'Banana' },
      { id: 'c9', symbol: 'Orange' }, { id: 'c10', symbol: 'Grape' },
      { id: 'c11', symbol: 'Berry' }, { id: 'c12', symbol: 'Melon' }
    ],
    // Level 4: 6 pairs (12 cards)
    [
      { id: 'c1', symbol: 'Alien' }, { id: 'c2', symbol: 'UFO' },
      { id: 'c3', symbol: 'Comet' }, { id: 'c4', symbol: 'Planet' },
      { id: 'c5', symbol: 'Moon' }, { id: 'c6', symbol: 'Sun' },
      { id: 'c7', symbol: 'Alien' }, { id: 'c8', symbol: 'UFO' },
      { id: 'c9', symbol: 'Comet' }, { id: 'c10', symbol: 'Planet' },
      { id: 'c11', symbol: 'Moon' }, { id: 'c12', symbol: 'Sun' }
    ],
    // Level 5: 8 pairs (16 cards)
    [
      { id: 'c1', symbol: 'Diamond' }, { id: 'c2', symbol: 'Ruby' },
      { id: 'c3', symbol: 'Emerald' }, { id: 'c4', symbol: 'Sapphire' },
      { id: 'c5', symbol: 'Gold' }, { id: 'c6', symbol: 'Silver' },
      { id: 'c7', symbol: 'Crystal' }, { id: 'c8', symbol: 'Pearl' },
      { id: 'c9', symbol: 'Diamond' }, { id: 'c10', symbol: 'Ruby' },
      { id: 'c11', symbol: 'Emerald' }, { id: 'c12', symbol: 'Sapphire' },
      { id: 'c13', symbol: 'Gold' }, { id: 'c14', symbol: 'Silver' },
      { id: 'c15', symbol: 'Crystal' }, { id: 'c16', symbol: 'Pearl' }
    ]
  ];

  for (let lvl = 1; lvl <= 5; lvl++) {
    const cards = memoryMatchCards[lvl - 1];
    const totalPairs = cards.length / 2;
    challenges.push({
      gameId: gameMap['memory-match'],
      level: lvl,
      difficulty: lvl <= 2 ? 'easy' : lvl <= 4 ? 'medium' : 'hard',
      demographicTarget: 'kids',
      prompt: `Turn over the cards and find all ${totalPairs} matching pairs!`,
      layout: { cards, totalPairs },
      parTimeSeconds: 25 + lvl * 7,
      baseXp: 80 + lvl * 25,
      solutionKey: { totalPairs },
      validationRule: 'KEY_VALUE_PAIR',
      hints: ['Try to keep mental landmarks in each corner!']
    });
  }

  // 1.2 Pattern Planet (GridMatrixEngine)
  const patternPlanetConfigs = [
    { size: 3, tiles: [0, 4, 8], duration: 2500, hint: 'Notice the straight diagonal line from top-left to bottom-right!' },
    { size: 3, tiles: [0, 2, 6, 8], duration: 2300, hint: 'Look at the four corners of the universe!' },
    { size: 4, tiles: [1, 4, 7, 10, 13], duration: 2000, hint: 'The pattern forms a cosmic cross in the center.' },
    { size: 4, tiles: [0, 5, 10, 15, 3, 6], duration: 1800, hint: 'Follow the zigzag galaxy trail.' },
    { size: 5, tiles: [2, 6, 8, 10, 14, 16, 18, 22], duration: 1600, hint: 'A sparkling diamond ring in outer space!' }
  ];

  for (let lvl = 1; lvl <= 5; lvl++) {
    const cfg = patternPlanetConfigs[lvl - 1];
    challenges.push({
      gameId: gameMap['pattern-planet'],
      level: lvl,
      difficulty: lvl <= 2 ? 'easy' : lvl <= 4 ? 'medium' : 'hard',
      demographicTarget: 'kids',
      prompt: `Look closely at the ${cfg.tiles.length} glowing cosmic stars, then tap the same squares!`,
      layout: { gridSize: cfg.size, displayDurationMs: cfg.duration, previewTiles: cfg.tiles },
      parTimeSeconds: 20 + lvl * 5,
      baseXp: 90 + lvl * 25,
      solutionKey: { targetTiles: cfg.tiles },
      validationRule: 'SET_EQUAL',
      hints: [cfg.hint]
    });
  }

  // 1.3 Maze Explorer (SpatialPathEngine)
  const mazeConfigs = [
    {
      rows: 3, cols: 3, start: { row: 0, col: 0 }, end: { row: 2, col: 2 },
      blocked: [{ row: 1, col: 1 }],
      path: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }]
    },
    {
      rows: 4, cols: 4, start: { row: 0, col: 0 }, end: { row: 3, col: 3 },
      blocked: [{ row: 1, col: 1 }, { row: 2, col: 2 }],
      path: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 1, col: 3 }, { row: 2, col: 3 }, { row: 3, col: 3 }]
    },
    {
      rows: 4, cols: 4, start: { row: 0, col: 0 }, end: { row: 3, col: 3 },
      blocked: [{ row: 0, col: 2 }, { row: 1, col: 1 }, { row: 2, col: 3 }],
      path: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 3, col: 2 }, { row: 3, col: 3 }]
    },
    {
      rows: 5, cols: 5, start: { row: 0, col: 0 }, end: { row: 4, col: 4 },
      blocked: [{ row: 1, col: 1 }, { row: 2, col: 2 }, { row: 3, col: 3 }, { row: 1, col: 3 }],
      path: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 3, col: 0 }, { row: 4, col: 0 }, { row: 4, col: 1 }, { row: 4, col: 2 }, { row: 4, col: 3 }, { row: 4, col: 4 }]
    },
    {
      rows: 5, cols: 5, start: { row: 0, col: 0 }, end: { row: 4, col: 4 },
      blocked: [{ row: 0, col: 3 }, { row: 1, col: 1 }, { row: 2, col: 3 }, { row: 3, col: 1 }, { row: 4, col: 2 }],
      path: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }, { row: 2, col: 1 }, { row: 3, col: 1 }, { row: 3, col: 2 }, { row: 3, col: 3 }, { row: 3, col: 4 }, { row: 4, col: 4 }]
    }
  ];

  for (let lvl = 1; lvl <= 5; lvl++) {
    const cfg = mazeConfigs[lvl - 1];
    challenges.push({
      gameId: gameMap['maze-explorer'],
      level: lvl,
      difficulty: lvl <= 2 ? 'easy' : lvl <= 4 ? 'medium' : 'hard',
      demographicTarget: 'kids',
      prompt: 'Guide the adventurer from Start to the Goal without stepping into mud puddles!',
      layout: { gridRows: cfg.rows, gridCols: cfg.cols, startNode: cfg.start, endNode: cfg.end, blockedNodes: cfg.blocked },
      parTimeSeconds: 25 + lvl * 5,
      baseXp: 90 + lvl * 25,
      solutionKey: { path: cfg.path },
      validationRule: 'PATH_SEQUENCE',
      hints: ['Follow the outer paths when the center is blocked!']
    });
  }

  // 1.4 Robo Rescue (SequenceCodeEngine)
  const roboTokens = [
    { id: 'red', label: 'Ruby Red', color: '#EF4444' },
    { id: 'blue', label: 'Sky Blue', color: '#3B82F6' },
    { id: 'yellow', label: 'Sun Yellow', color: '#EAB308' },
    { id: 'green', label: 'Leaf Green', color: '#22C55E' }
  ];

  const roboSequences = [
    ['red', 'blue', 'green'],
    ['yellow', 'red', 'blue', 'green'],
    ['red', 'yellow', 'blue', 'red', 'green'],
    ['blue', 'green', 'yellow', 'red', 'blue', 'yellow'],
    ['green', 'red', 'yellow', 'blue', 'green', 'red', 'blue']
  ];

  for (let lvl = 1; lvl <= 5; lvl++) {
    const seq = roboSequences[lvl - 1];
    challenges.push({
      gameId: gameMap['robo-rescue'],
      level: lvl,
      difficulty: lvl <= 2 ? 'easy' : lvl <= 4 ? 'medium' : 'hard',
      demographicTarget: 'kids',
      prompt: `Watch the robot lights flash! Repeat the ${seq.length}-step color signal.`,
      layout: { tokens: roboTokens, previewSequence: seq, displaySpeedMs: Math.max(500, 900 - lvl * 70) },
      parTimeSeconds: 20 + lvl * 5,
      baseXp: 85 + lvl * 25,
      solutionKey: { sequence: seq },
      validationRule: 'EXACT_ARRAY',
      hints: [`Starts with ${seq[0].toUpperCase()} and ends with ${seq[seq.length - 1].toUpperCase()}!`]
    });
  }

  // 1.5 Math Quest (ChoiceLogicEngine)
  const mathQuestQuestions = [
    {
      prompt: 'If you have 3 shiny red apples and pick 4 more from the tree, how many apples do you have?',
      options: [{ id: 'opt-a', text: '5 Apples' }, { id: 'opt-b', text: '6 Apples' }, { id: 'opt-c', text: '7 Apples' }, { id: 'opt-d', text: '8 Apples' }],
      ans: 'opt-c',
      hint: 'Count forward 4 steps from 3: 4, 5, 6, 7!'
    },
    {
      prompt: 'A mother duck has 10 ducklings. 3 waddle into the pond. How many are still on the grass?',
      options: [{ id: 'opt-a', text: '6 Ducklings' }, { id: 'opt-b', text: '7 Ducklings' }, { id: 'opt-c', text: '8 Ducklings' }, { id: 'opt-d', text: '9 Ducklings' }],
      ans: 'opt-b',
      hint: 'Subtract 3 from 10: 10 - 3 = 7.'
    },
    {
      prompt: 'There are 4 treasure chests. Each chest holds 3 golden coins. How many coins in total?',
      options: [{ id: 'opt-a', text: '7 Coins' }, { id: 'opt-b', text: '10 Coins' }, { id: 'opt-c', text: '12 Coins' }, { id: 'opt-d', text: '14 Coins' }],
      ans: 'opt-c',
      hint: 'Multiply 4 chests by 3 coins: 4 x 3 = 12!'
    },
    {
      prompt: 'You collect 18 space stars and share them equally between 3 alien friends. How many does each friend get?',
      options: [{ id: 'opt-a', text: '5 Stars' }, { id: 'opt-b', text: '6 Stars' }, { id: 'opt-c', text: '7 Stars' }, { id: 'opt-d', text: '9 Stars' }],
      ans: 'opt-b',
      hint: 'Divide 18 by 3: 18 / 3 = 6!'
    },
    {
      prompt: 'A magical train has 12 passengers in Car A and 15 in Car B. If 8 passengers get off at Castle Station, how many remain?',
      options: [{ id: 'opt-a', text: '17 Passengers' }, { id: 'opt-b', text: '19 Passengers' }, { id: 'opt-c', text: '21 Passengers' }, { id: 'opt-d', text: '23 Passengers' }],
      ans: 'opt-b',
      hint: 'First add: 12 + 15 = 27. Then subtract 8: 27 - 8 = 19!'
    }
  ];

  for (let lvl = 1; lvl <= 5; lvl++) {
    const q = mathQuestQuestions[lvl - 1];
    challenges.push({
      gameId: gameMap['math-quest'],
      level: lvl,
      difficulty: lvl <= 2 ? 'easy' : lvl <= 4 ? 'medium' : 'hard',
      demographicTarget: 'kids',
      prompt: q.prompt,
      layout: { options: q.options },
      parTimeSeconds: 25 + lvl * 5,
      baseXp: 90 + lvl * 25,
      solutionKey: { correctOptionId: q.ans },
      validationRule: 'SINGLE_VALUE',
      hints: [q.hint]
    });
  }

  // =========================================================================
  // 2. ADULT ZONE
  // =========================================================================

  // 2.1 Code Sprint (SequenceCodeEngine)
  const codeTokens = [
    { id: 'fetch', label: 'FETCH', color: '#6366F1' },
    { id: 'parse', label: 'PARSE', color: '#10B981' },
    { id: 'mutate', label: 'MUTATE', color: '#F59E0B' },
    { id: 'render', label: 'RENDER', color: '#EC4899' },
    { id: 'cache', label: 'CACHE', color: '#06B6D4' }
  ];

  const codeSequences = [
    ['fetch', 'parse', 'render'],
    ['fetch', 'parse', 'mutate', 'render'],
    ['fetch', 'cache', 'parse', 'mutate', 'render'],
    ['fetch', 'parse', 'cache', 'mutate', 'render', 'cache'],
    ['cache', 'fetch', 'parse', 'mutate', 'cache', 'render', 'fetch']
  ];

  for (let lvl = 1; lvl <= 5; lvl++) {
    const seq = codeSequences[lvl - 1];
    challenges.push({
      gameId: gameMap['code-sprint'],
      level: lvl,
      difficulty: lvl <= 2 ? 'easy' : lvl <= 4 ? 'medium' : 'hard',
      demographicTarget: 'adults',
      prompt: `Memorize the execution pipeline sequence (${seq.length} stages) and trigger it with zero latency errors.`,
      layout: { tokens: codeTokens, previewSequence: seq, displaySpeedMs: Math.max(450, 800 - lvl * 70) },
      parTimeSeconds: 20 + lvl * 5,
      baseXp: 100 + lvl * 30,
      solutionKey: { sequence: seq },
      validationRule: 'EXACT_ARRAY',
      hints: [`Starts with ${seq[0].toUpperCase()} and ends with ${seq[seq.length - 1].toUpperCase()}.`]
    });
  }

  // 2.2 Logic Arena (ChoiceLogicEngine)
  const logicArenaQuestions = [
    {
      prompt: 'Premise 1: All microservices in Cluster Alpha run on port 8080. Premise 2: Service Payments runs on port 8080. Conclusion: Payments is in Cluster Alpha. Is this valid?',
      options: [
        { id: 'opt-1', text: 'Valid deduction (Modus Ponens)' },
        { id: 'opt-2', text: 'Invalid: Fallacy of Affirming the Consequent' },
        { id: 'opt-3', text: 'Valid only if Payments is containerized' },
        { id: 'opt-4', text: 'Invalid: Fallacy of Denying the Antecedent' }
      ],
      ans: 'opt-2',
      hint: 'If P then Q; Q; therefore P is a formal fallacy.'
    },
    {
      prompt: 'Rule: If the Deploy Pipeline succeeds, Alerts are cleared. Fact: Alerts are NOT cleared. What must logically be concluded?',
      options: [
        { id: 'opt-1', text: 'The Deploy Pipeline succeeded' },
        { id: 'opt-2', text: 'The Deploy Pipeline did not succeed (Modus Tollens)' },
        { id: 'opt-3', text: 'A network timeout occurred' },
        { id: 'opt-4', text: 'No conclusion can be drawn' }
      ],
      ans: 'opt-2',
      hint: 'If P then Q; Not Q; therefore Not P (Modus Tollens).'
    },
    {
      prompt: 'Process Benchmarks: Worker A finishes faster than Worker B. Worker C is slower than Worker B. Worker D finishes faster than Worker A. Rank from fastest to slowest:',
      options: [
        { id: 'opt-1', text: 'D > A > B > C' },
        { id: 'opt-2', text: 'A > D > B > C' },
        { id: 'opt-3', text: 'D > B > A > C' },
        { id: 'opt-4', text: 'C > B > A > D' }
      ],
      ans: 'opt-1',
      hint: 'D is faster than A, which is faster than B, which is faster than C.'
    },
    {
      prompt: 'Consensus Rule: In a 2-node failover pair, Node 1 is Leader XOR Node 2 is Leader. Telemetry proves Node 2 is NOT Leader. What is the status of Node 1?',
      options: [
        { id: 'opt-1', text: 'Node 1 is in Split-Brain state' },
        { id: 'opt-2', text: 'Node 1 is Leader' },
        { id: 'opt-3', text: 'Node 1 is Follower' },
        { id: 'opt-4', text: 'Undetermined without heartbeat ping' }
      ],
      ans: 'opt-2',
      hint: 'Exclusive OR (XOR) requires exactly one operand to be true.'
    },
    {
      prompt: 'Boolean Satisfiability: Determine the truth values that satisfy the expression: (A OR B) AND (NOT B OR C) AND (NOT A).',
      options: [
        { id: 'opt-1', text: 'A = true, B = false, C = true' },
        { id: 'opt-2', text: 'A = false, B = true, C = true' },
        { id: 'opt-3', text: 'A = false, B = true, C = false' },
        { id: 'opt-4', text: 'A = true, B = true, C = false' }
      ],
      ans: 'opt-2',
      hint: 'Since NOT A is true, A must be false. Then (A OR B) forces B = true. Then (NOT B OR C) forces C = true.'
    }
  ];

  for (let lvl = 1; lvl <= 5; lvl++) {
    const q = logicArenaQuestions[lvl - 1];
    challenges.push({
      gameId: gameMap['logic-arena'],
      level: lvl,
      difficulty: lvl <= 2 ? 'easy' : lvl <= 4 ? 'medium' : 'hard',
      demographicTarget: 'adults',
      prompt: q.prompt,
      layout: { options: q.options },
      parTimeSeconds: 25 + lvl * 5,
      baseXp: 100 + lvl * 30,
      solutionKey: { correctOptionId: q.ans },
      validationRule: 'SINGLE_VALUE',
      hints: [q.hint]
    });
  }

  // 2.3 SQL Quest (ChoiceLogicEngine)
  const sqlQuestQuestions = [
    {
      prompt: 'Which clause in a SQL SELECT statement is evaluated FIRST by the relational query execution engine?',
      options: [
        { id: 'opt-a', text: 'SELECT' },
        { id: 'opt-b', text: 'FROM (including JOINs)' },
        { id: 'opt-c', text: 'WHERE' },
        { id: 'opt-d', text: 'ORDER BY' }
      ],
      ans: 'opt-b',
      hint: 'The engine must determine the table source (FROM/JOIN) before filtering or projecting.'
    },
    {
      prompt: 'To identify duplicate email addresses in an `accounts` table, which combination of clauses is required?',
      options: [
        { id: 'opt-a', text: 'WHERE COUNT(email) > 1' },
        { id: 'opt-b', text: 'GROUP BY email HAVING COUNT(*) > 1' },
        { id: 'opt-c', text: 'ORDER BY email DISTINCT' },
        { id: 'opt-d', text: 'FILTER BY email > 1' }
      ],
      ans: 'opt-b',
      hint: 'HAVING filters aggregated groups produced by GROUP BY.'
    },
    {
      prompt: 'You must retrieve all customers from `customers`, including those who have never placed an order in `orders`. Which JOIN is appropriate?',
      options: [
        { id: 'opt-a', text: 'INNER JOIN orders ON customers.id = orders.cust_id' },
        { id: 'opt-b', text: 'LEFT OUTER JOIN orders ON customers.id = orders.cust_id' },
        { id: 'opt-c', text: 'CROSS JOIN orders' },
        { id: 'opt-d', text: 'RIGHT OUTER JOIN customers ON customers.id = orders.cust_id' }
      ],
      ans: 'opt-b',
      hint: 'LEFT OUTER JOIN retains all records from the left table regardless of matching right records.'
    },
    {
      prompt: 'Which window function calculates a customer running cumulative transaction total ordered by date?',
      options: [
        { id: 'opt-a', text: 'SUM(amount) OVER (PARTITION BY cust_id ORDER BY tx_date)' },
        { id: 'opt-b', text: 'CUMULATIVE_SUM(amount) GROUP BY cust_id' },
        { id: 'opt-c', text: 'SUM(amount) WINDOW (cust_id)' },
        { id: 'opt-d', text: 'ROLLUP(amount) BY cust_id' }
      ],
      ans: 'opt-a',
      hint: 'OVER (PARTITION BY ... ORDER BY ...) creates the frame for cumulative accumulation.'
    },
    {
      prompt: 'Under the READ COMMITTED isolation level, which concurrency phenomenon can still occur that REPEATABLE READ prevents?',
      options: [
        { id: 'opt-a', text: 'Dirty Read' },
        { id: 'opt-b', text: 'Non-Repeatable Read' },
        { id: 'opt-c', text: 'Deadlock' },
        { id: 'opt-d', text: 'Write Skew on non-overlapping keys' }
      ],
      ans: 'opt-b',
      hint: 'READ COMMITTED prevents Dirty Reads, but a re-read within the transaction can see committed changes (Non-Repeatable Read).'
    }
  ];

  for (let lvl = 1; lvl <= 5; lvl++) {
    const q = sqlQuestQuestions[lvl - 1];
    challenges.push({
      gameId: gameMap['sql-quest'],
      level: lvl,
      difficulty: lvl <= 2 ? 'easy' : lvl <= 4 ? 'medium' : 'hard',
      demographicTarget: 'adults',
      prompt: q.prompt,
      layout: { options: q.options },
      parTimeSeconds: 25 + lvl * 5,
      baseXp: 100 + lvl * 30,
      solutionKey: { correctOptionId: q.ans },
      validationRule: 'SINGLE_VALUE',
      hints: [q.hint]
    });
  }

  // 2.4 Memory Matrix (GridMatrixEngine)
  const memoryMatrixConfigs = [
    { size: 4, tiles: [1, 6, 9, 14], duration: 2000, hint: 'Alternating zigzag pattern across 4x4 matrix.' },
    { size: 4, tiles: [0, 3, 5, 10, 12, 15], duration: 1800, hint: 'Opposing corners plus internal cross nodes.' },
    { size: 5, tiles: [2, 6, 8, 12, 16, 18, 22], duration: 1700, hint: 'A centered diamond lattice on 5x5 silicon.' },
    { size: 5, tiles: [0, 4, 10, 12, 14, 20, 24], duration: 1500, hint: 'Perimeter anchors with a central synapse line.' },
    { size: 6, tiles: [1, 4, 7, 10, 13, 16, 22, 28, 31], duration: 1400, hint: 'Multi-node quantum bus distribution.' }
  ];

  for (let lvl = 1; lvl <= 5; lvl++) {
    const cfg = memoryMatrixConfigs[lvl - 1];
    challenges.push({
      gameId: gameMap['memory-matrix'],
      level: lvl,
      difficulty: lvl <= 2 ? 'easy' : lvl <= 4 ? 'medium' : 'hard',
      demographicTarget: 'adults',
      prompt: `Memorize the activation nodes on the ${cfg.size}x${cfg.size} matrix before dissipation.`,
      layout: { gridSize: cfg.size, displayDurationMs: cfg.duration, previewTiles: cfg.tiles },
      parTimeSeconds: 20 + lvl * 5,
      baseXp: 100 + lvl * 30,
      solutionKey: { targetTiles: cfg.tiles },
      validationRule: 'SET_EQUAL',
      hints: [cfg.hint]
    });
  }

  // 2.5 Cyber Detective (ChoiceLogicEngine)
  const cyberQuestions = [
    {
      prompt: 'Server logs reveal hundreds of HTTP GET queries containing parameter `?user=admin\' OR \'1\'=\'1`. What attack category is occurring?',
      options: [
        { id: 'opt-1', text: 'Cross-Site Scripting (XSS)' },
        { id: 'opt-2', text: 'SQL Injection (SQLi)' },
        { id: 'opt-3', text: 'Server-Side Request Forgery (SSRF)' },
        { id: 'opt-4', text: 'Buffer Overflow' }
      ],
      ans: 'opt-2',
      hint: 'The payload attempts to bypass authentication via Boolean tautology in SQL.'
    },
    {
      prompt: 'An adversary extracts user password hashes and uses precomputed rainbow tables to reverse them. What cryptographic control neutralizes this attack?',
      options: [
        { id: 'opt-1', text: 'Unique Per-User Cryptographic Salt' },
        { id: 'opt-2', text: 'Base64 Encoding' },
        { id: 'opt-3', text: 'MD5 without key stretching' },
        { id: 'opt-4', text: 'Symmetric AES-128-ECB' }
      ],
      ans: 'opt-1',
      hint: 'Salting invalidates precomputed lookup tables by making each hash unique.'
    },
    {
      prompt: 'An egress telemetry alert indicates a server sending periodic HTTPS POST packets of identical size every 300 seconds to an unknown foreign IP. What does this suggest?',
      options: [
        { id: 'opt-1', text: 'NTP Time synchronization' },
        { id: 'opt-2', text: 'Command and Control (C2) Heartbeat Beaconing' },
        { id: 'opt-3', text: 'Normal DNS zone transfer' },
        { id: 'opt-4', text: 'ARP cache poisoning' }
      ],
      ans: 'opt-2',
      hint: 'Regular periodic jittered communication to an unknown external server is characteristic of C2 malware.'
    },
    {
      prompt: 'A JWT token payload is tampered with by changing `role: "user"` to `role: "admin"`. The backend verifies it as valid. What vulnerability explains this?',
      options: [
        { id: 'opt-1', text: 'CORS misconfiguration' },
        { id: 'opt-2', text: 'Accepting `alg: none` or missing HMAC signature verification' },
        { id: 'opt-3', text: 'DNS poisoning' },
        { id: 'opt-4', text: 'HTTP 401 unhandled rejection' }
      ],
      ans: 'opt-2',
      hint: 'Failing to verify the cryptographic signature allows clients to forge arbitrary claims.'
    },
    {
      prompt: 'DNS telemetry reveals repeated queries for `a8f9c21.corp-exfil.attacker.net` with long encoded payloads in the subdomain labels. What covert technique is being used?',
      options: [
        { id: 'opt-1', text: 'DNS Tunneling for Data Exfiltration' },
        { id: 'opt-2', text: 'SYN Flood attack' },
        { id: 'opt-3', text: 'BGP Hijacking' },
        { id: 'opt-4', text: 'Clickjacking' }
      ],
      ans: 'opt-1',
      hint: 'Encoding data within DNS queries bypasses standard firewall port restrictions.'
    }
  ];

  for (let lvl = 1; lvl <= 5; lvl++) {
    const q = cyberQuestions[lvl - 1];
    challenges.push({
      gameId: gameMap['cyber-detective'],
      level: lvl,
      difficulty: lvl <= 2 ? 'easy' : lvl <= 4 ? 'medium' : 'hard',
      demographicTarget: 'adults',
      prompt: q.prompt,
      layout: { options: q.options },
      parTimeSeconds: 25 + lvl * 5,
      baseXp: 100 + lvl * 30,
      solutionKey: { correctOptionId: q.ans },
      validationRule: 'SINGLE_VALUE',
      hints: [q.hint]
    });
  }

  // =========================================================================
  // 3. SENIOR ZONE
  // =========================================================================

  // 3.1 Memory Garden (CardMemoryEngine)
  const memoryGardenCards = [
    // Level 1: 4 pairs (8 cards)
    [
      { id: 'c1', symbol: 'Rose' }, { id: 'c2', symbol: 'Sunflower' },
      { id: 'c3', symbol: 'Lavender' }, { id: 'c4', symbol: 'Rose' },
      { id: 'c5', symbol: 'Tulip' }, { id: 'c6', symbol: 'Sunflower' },
      { id: 'c7', symbol: 'Lavender' }, { id: 'c8', symbol: 'Tulip' }
    ],
    // Level 2: 4 pairs (8 cards)
    [
      { id: 'c1', symbol: 'Daisy' }, { id: 'c2', symbol: 'Orchid' },
      { id: 'c3', symbol: 'Lily' }, { id: 'c4', symbol: 'Daisy' },
      { id: 'c5', symbol: 'Iris' }, { id: 'c6', symbol: 'Orchid' },
      { id: 'c7', symbol: 'Lily' }, { id: 'c8', symbol: 'Iris' }
    ],
    // Level 3: 6 pairs (12 cards)
    [
      { id: 'c1', symbol: 'Rose' }, { id: 'c2', symbol: 'Sunflower' },
      { id: 'c3', symbol: 'Lavender' }, { id: 'c4', symbol: 'Daisy' },
      { id: 'c5', symbol: 'Orchid' }, { id: 'c6', symbol: 'Tulip' },
      { id: 'c7', symbol: 'Rose' }, { id: 'c8', symbol: 'Sunflower' },
      { id: 'c9', symbol: 'Lavender' }, { id: 'c10', symbol: 'Daisy' },
      { id: 'c11', symbol: 'Orchid' }, { id: 'c12', symbol: 'Tulip' }
    ],
    // Level 4: 6 pairs (12 cards)
    [
      { id: 'c1', symbol: 'Lotus' }, { id: 'c2', symbol: 'Peony' },
      { id: 'c3', symbol: 'Marigold' }, { id: 'c4', symbol: 'Violet' },
      { id: 'c5', symbol: 'Blossom' }, { id: 'c6', symbol: 'Fern' },
      { id: 'c7', symbol: 'Lotus' }, { id: 'c8', symbol: 'Peony' },
      { id: 'c9', symbol: 'Marigold' }, { id: 'c10', symbol: 'Violet' },
      { id: 'c11', symbol: 'Blossom' }, { id: 'c12', symbol: 'Fern' }
    ],
    // Level 5: 8 pairs (16 cards)
    [
      { id: 'c1', symbol: 'Rose' }, { id: 'c2', symbol: 'Sunflower' },
      { id: 'c3', symbol: 'Lavender' }, { id: 'c4', symbol: 'Daisy' },
      { id: 'c5', symbol: 'Orchid' }, { id: 'c6', symbol: 'Tulip' },
      { id: 'c7', symbol: 'Lotus' }, { id: 'c8', symbol: 'Peony' },
      { id: 'c9', symbol: 'Rose' }, { id: 'c10', symbol: 'Sunflower' },
      { id: 'c11', symbol: 'Lavender' }, { id: 'c12', symbol: 'Daisy' },
      { id: 'c13', symbol: 'Orchid' }, { id: 'c14', symbol: 'Tulip' },
      { id: 'c15', symbol: 'Lotus' }, { id: 'c16', symbol: 'Peony' }
    ]
  ];

  for (let lvl = 1; lvl <= 5; lvl++) {
    const cards = memoryGardenCards[lvl - 1];
    const totalPairs = cards.length / 2;
    challenges.push({
      gameId: gameMap['memory-garden'],
      level: lvl,
      difficulty: lvl <= 2 ? 'easy' : lvl <= 4 ? 'medium' : 'hard',
      demographicTarget: 'seniors',
      prompt: `Take your time to uncover all ${totalPairs} beautiful botanical flower pairs.`,
      layout: { cards, totalPairs },
      parTimeSeconds: 40 + lvl * 8,
      baseXp: 90 + lvl * 25,
      solutionKey: { totalPairs },
      validationRule: 'KEY_VALUE_PAIR',
      hints: ['Remember flowers by their warm colors and landmarks on the board.']
    });
  }

  // 3.2 Everyday Math (ChoiceLogicEngine)
  const everydayMathQuestions = [
    {
      prompt: 'At the bakery, a loaf of fresh sourdough is $3.50 and a carton of milk is $2.50. You give the cashier a $10 bill. How much change do you receive?',
      options: [
        { id: 'opt-1', text: '$3.00' },
        { id: 'opt-2', text: '$4.00' },
        { id: 'opt-3', text: '$4.50' },
        { id: 'opt-4', text: '$5.00' }
      ],
      ans: 'opt-2',
      hint: '$3.50 + $2.50 = $6.00. Then $10.00 - $6.00 = $4.00.'
    },
    {
      prompt: 'A pack of 4 honeycrisp apples costs $2.00. How much will 12 apples cost at the exact same rate?',
      options: [
        { id: 'opt-1', text: '$4.00' },
        { id: 'opt-2', text: '$5.00' },
        { id: 'opt-3', text: '$6.00' },
        { id: 'opt-4', text: '$8.00' }
      ],
      ans: 'opt-3',
      hint: '12 apples is 3 packs of 4. So 3 x $2.00 = $6.00.'
    },
    {
      prompt: 'A warm woolen sweater regularly priced at $40.00 is currently on a 25% discount. What is the sale price?',
      options: [
        { id: 'opt-1', text: '$28.00' },
        { id: 'opt-2', text: '$30.00' },
        { id: 'opt-3', text: '$32.00' },
        { id: 'opt-4', text: '$35.00' }
      ],
      ans: 'opt-2',
      hint: '25% of $40 is $10. Subtract $10 from $40 to get $30.'
    },
    {
      prompt: 'Your monthly electricity costs were $85 in January, $95 in February, and $90 in March. What was your average monthly bill?',
      options: [
        { id: 'opt-1', text: '$88.00' },
        { id: 'opt-2', text: '$90.00' },
        { id: 'opt-3', text: '$92.00' },
        { id: 'opt-4', text: '$95.00' }
      ],
      ans: 'opt-2',
      hint: '85 + 95 + 90 = 270. Then divide by 3: 270 / 3 = $90.'
    },
    {
      prompt: 'You deposit $500 into a certificate offering 6% annual simple interest. How much total interest do you earn after 2 years?',
      options: [
        { id: 'opt-1', text: '$30.00' },
        { id: 'opt-2', text: '$50.00' },
        { id: 'opt-3', text: '$60.00' },
        { id: 'opt-4', text: '$72.00' }
      ],
      ans: 'opt-3',
      hint: 'Interest = $500 x 0.06 x 2 = $60.'
    }
  ];

  for (let lvl = 1; lvl <= 5; lvl++) {
    const q = everydayMathQuestions[lvl - 1];
    challenges.push({
      gameId: gameMap['everyday-math'],
      level: lvl,
      difficulty: lvl <= 2 ? 'easy' : lvl <= 4 ? 'medium' : 'hard',
      demographicTarget: 'seniors',
      prompt: q.prompt,
      layout: { options: q.options },
      parTimeSeconds: 35 + lvl * 5,
      baseXp: 90 + lvl * 25,
      solutionKey: { correctOptionId: q.ans },
      validationRule: 'SINGLE_VALUE',
      hints: [q.hint]
    });
  }

  // 3.3 Word Garden (CardMemoryEngine)
  const wordGardenCards = [
    // Level 1: 4 pairs (8 cards)
    [
      { id: 'c1', symbol: 'Sun' }, { id: 'c2', symbol: 'Moon' },
      { id: 'c3', symbol: 'Day' }, { id: 'c4', symbol: 'Sun' },
      { id: 'c5', symbol: 'Night' }, { id: 'c6', symbol: 'Moon' },
      { id: 'c7', symbol: 'Day' }, { id: 'c8', symbol: 'Night' }
    ],
    // Level 2: 4 pairs (8 cards)
    [
      { id: 'c1', symbol: 'Spring' }, { id: 'c2', symbol: 'Winter' },
      { id: 'c3', symbol: 'Bloom' }, { id: 'c4', symbol: 'Spring' },
      { id: 'c5', symbol: 'Snow' }, { id: 'c6', symbol: 'Winter' },
      { id: 'c7', symbol: 'Bloom' }, { id: 'c8', symbol: 'Snow' }
    ],
    // Level 3: 6 pairs (12 cards)
    [
      { id: 'c1', symbol: 'Wisdom' }, { id: 'c2', symbol: 'Mind' },
      { id: 'c3', symbol: 'Peace' }, { id: 'c4', symbol: 'Heart' },
      { id: 'c5', symbol: 'Joy' }, { id: 'c6', symbol: 'Smile' },
      { id: 'c7', symbol: 'Wisdom' }, { id: 'c8', symbol: 'Mind' },
      { id: 'c9', symbol: 'Peace' }, { id: 'c10', symbol: 'Heart' },
      { id: 'c11', symbol: 'Joy' }, { id: 'c12', symbol: 'Smile' }
    ],
    // Level 4: 6 pairs (12 cards)
    [
      { id: 'c1', symbol: 'River' }, { id: 'c2', symbol: 'Stream' },
      { id: 'c3', symbol: 'Forest' }, { id: 'c4', symbol: 'Pine' },
      { id: 'c5', symbol: 'Morning' }, { id: 'c6', symbol: 'Dew' },
      { id: 'c7', symbol: 'River' }, { id: 'c8', symbol: 'Stream' },
      { id: 'c9', symbol: 'Forest' }, { id: 'c10', symbol: 'Pine' },
      { id: 'c11', symbol: 'Morning' }, { id: 'c12', symbol: 'Dew' }
    ],
    // Level 5: 8 pairs (16 cards)
    [
      { id: 'c1', symbol: 'Courage' }, { id: 'c2', symbol: 'Strength' },
      { id: 'c3', symbol: 'Patience' }, { id: 'c4', symbol: 'Calm' },
      { id: 'c5', symbol: 'Hope' }, { id: 'c6', symbol: 'Star' },
      { id: 'c7', symbol: 'Truth' }, { id: 'c8', symbol: 'Anchor' },
      { id: 'c9', symbol: 'Courage' }, { id: 'c10', symbol: 'Strength' },
      { id: 'c11', symbol: 'Patience' }, { id: 'c12', symbol: 'Calm' },
      { id: 'c13', symbol: 'Hope' }, { id: 'c14', symbol: 'Star' },
      { id: 'c15', symbol: 'Truth' }, { id: 'c16', symbol: 'Anchor' }
    ]
  ];

  for (let lvl = 1; lvl <= 5; lvl++) {
    const cards = wordGardenCards[lvl - 1];
    const totalPairs = cards.length / 2;
    challenges.push({
      gameId: gameMap['word-garden'],
      level: lvl,
      difficulty: lvl <= 2 ? 'easy' : lvl <= 4 ? 'medium' : 'hard',
      demographicTarget: 'seniors',
      prompt: `Match the complementary words and proverb pairs in the word sanctuary.`,
      layout: { cards, totalPairs },
      parTimeSeconds: 40 + lvl * 8,
      baseXp: 90 + lvl * 25,
      solutionKey: { totalPairs },
      validationRule: 'KEY_VALUE_PAIR',
      hints: ['Pairs connect meaning, such as Sun & Day, Moon & Night.']
    });
  }

  // 3.4 Sequence Steps (GridMatrixEngine)
  const sequenceStepsConfigs = [
    { size: 3, tiles: [1, 3, 5], duration: 3500, hint: 'The top center and the two side stones are lit.' },
    { size: 3, tiles: [0, 2, 4, 6, 8], duration: 3200, hint: 'An X shape forming a cross across the pond.' },
    { size: 4, tiles: [0, 3, 12, 15], duration: 3000, hint: 'The four corner stepping stones across the water.' },
    { size: 4, tiles: [1, 4, 9, 14], duration: 2800, hint: 'A gentle diagonal stream crossing the stones.' },
    { size: 4, tiles: [2, 5, 8, 10, 13], duration: 2600, hint: 'Gentle arch stepping stones towards the bridge.' }
  ];

  for (let lvl = 1; lvl <= 5; lvl++) {
    const cfg = sequenceStepsConfigs[lvl - 1];
    challenges.push({
      gameId: gameMap['sequence-steps'],
      level: lvl,
      difficulty: lvl <= 2 ? 'easy' : lvl <= 4 ? 'medium' : 'hard',
      demographicTarget: 'seniors',
      prompt: 'Take your time. Observe the illuminated stones, then step on the same stones.',
      layout: { gridSize: cfg.size, displayDurationMs: cfg.duration, previewTiles: cfg.tiles },
      parTimeSeconds: 30 + lvl * 6,
      baseXp: 90 + lvl * 25,
      solutionKey: { targetTiles: cfg.tiles },
      validationRule: 'SET_EQUAL',
      hints: [cfg.hint]
    });
  }

  // 3.5 Picture Puzzle (SpatialPathEngine)
  const picturePuzzleConfigs = [
    {
      rows: 3, cols: 3, start: { row: 0, col: 0 }, end: { row: 2, col: 2 },
      blocked: [{ row: 1, col: 1 }],
      path: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }]
    },
    {
      rows: 3, cols: 3, start: { row: 0, col: 0 }, end: { row: 2, col: 2 },
      blocked: [{ row: 0, col: 1 }],
      path: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }]
    },
    {
      rows: 4, cols: 4, start: { row: 0, col: 0 }, end: { row: 3, col: 3 },
      blocked: [{ row: 1, col: 1 }, { row: 1, col: 2 }],
      path: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 3, col: 3 }]
    },
    {
      rows: 4, cols: 4, start: { row: 0, col: 0 }, end: { row: 3, col: 3 },
      blocked: [{ row: 0, col: 2 }, { row: 2, col: 1 }],
      path: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 2, col: 3 }, { row: 3, col: 3 }]
    },
    {
      rows: 5, cols: 5, start: { row: 0, col: 0 }, end: { row: 4, col: 4 },
      blocked: [{ row: 1, col: 1 }, { row: 2, col: 2 }, { row: 3, col: 3 }],
      path: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }, { row: 1, col: 4 }, { row: 2, col: 4 }, { row: 3, col: 4 }, { row: 4, col: 4 }]
    }
  ];

  for (let lvl = 1; lvl <= 5; lvl++) {
    const cfg = picturePuzzleConfigs[lvl - 1];
    challenges.push({
      gameId: gameMap['picture-puzzle'],
      level: lvl,
      difficulty: lvl <= 2 ? 'easy' : lvl <= 4 ? 'medium' : 'hard',
      demographicTarget: 'seniors',
      prompt: 'Stroll along the calm garden path from the entrance to the gazebo without stepping on the hedge rows.',
      layout: { gridRows: cfg.rows, gridCols: cfg.cols, startNode: cfg.start, endNode: cfg.end, blockedNodes: cfg.blocked },
      parTimeSeconds: 35 + lvl * 6,
      baseXp: 90 + lvl * 25,
      solutionKey: { path: cfg.path },
      validationRule: 'PATH_SEQUENCE',
      hints: ['Take your time and follow the clear paved walkway around the hedges.']
    });
  }

  return challenges;
}
