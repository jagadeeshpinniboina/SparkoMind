import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Game from '../models/Game.js';
import Challenge from '../models/Challenge.js';
import { games } from './gamesList.js';
import { getChallenges } from './generateChallenges.js';

dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/sparkomind';

export const seedDatabase = async () => {
  try {
    console.log('[Seeder] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 15000 });
    console.log('[Seeder] Connected successfully.');

    // Clear previous games and challenges
    await Game.deleteMany({});
    await Challenge.deleteMany({});
    console.log('[Seeder] Cleared previous games and challenges.');

    // 1. Insert 15 Core Games
    const insertedGames = await Game.insertMany(games);
    console.log(`[Seeder] Seeded ${insertedGames.length} games (5 Kids, 5 Adults, 5 Seniors).`);

    const gameMap = {};
    insertedGames.forEach((g) => {
      gameMap[g.slug] = g._id;
    });

    // 2. Generate and Insert 75 Challenges (15 games x 5 levels each)
    const challengesData = getChallenges(gameMap);
    const insertedChallenges = await Challenge.insertMany(challengesData);
    console.log(`[Seeder] Seeded ${insertedChallenges.length} challenges with Zero-Trust solution keys (Levels 1–5 for every game).`);

    console.log('----------------------------------------------------');
    console.log(`✅ SparkoMind Catalogue Scaling Completed:`);
    console.log(`🎮 Total Games: ${insertedGames.length}`);
    console.log(`🧩 Total Challenges: ${insertedChallenges.length}`);
    console.log('----------------------------------------------------');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error] Seeding failed:', error);
    process.exit(1);
  }
};

// Auto-run if executed directly via node
if (process.argv[1] && process.argv[1].endsWith('seedGames.js')) {
  seedDatabase();
}

export default seedDatabase;
