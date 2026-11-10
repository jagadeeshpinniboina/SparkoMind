import mongoose from 'mongoose';

const categoryStatSchema = new mongoose.Schema(
  {
    xp: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
    accuracyAvg: { type: Number, default: 100 }
  },
  { _id: false }
);

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    totalXp: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    currentStreak: {
      type: Number,
      default: 1
    },
    highestStreak: {
      type: Number,
      default: 1
    },
    lastActiveDate: {
      type: Date,
      default: Date.now
    },
    gamesCompleted: {
      type: Number,
      default: 0
    },
    categoryStats: {
      memory: { type: categoryStatSchema, default: () => ({ xp: 0, gamesPlayed: 0, accuracyAvg: 100 }) },
      logic: { type: categoryStatSchema, default: () => ({ xp: 0, gamesPlayed: 0, accuracyAvg: 100 }) },
      spatial: { type: categoryStatSchema, default: () => ({ xp: 0, gamesPlayed: 0, accuracyAvg: 100 }) },
      sequence: { type: categoryStatSchema, default: () => ({ xp: 0, gamesPlayed: 0, accuracyAvg: 100 }) },
      speed: { type: categoryStatSchema, default: () => ({ xp: 0, gamesPlayed: 0, accuracyAvg: 100 }) }
    },
    achievements: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String },
        icon: { type: String, default: 'Award' },
        unlockedAt: { type: Date, default: Date.now }
      }
    ],
    // Tracks maximum level achieved per game
    completedGameLevels: {
      type: Map,
      of: Number,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

const UserProgress = mongoose.model('UserProgress', userProgressSchema);
export default UserProgress;
