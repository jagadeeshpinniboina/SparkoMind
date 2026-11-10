import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema(
  {
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: [true, 'Challenge must belong to a Game.']
    },
    level: {
      type: Number,
      required: [true, 'Challenge level number is required.'],
      min: 1
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy'
    },
    demographicTarget: {
      type: String,
      enum: ['kids', 'adults', 'seniors', 'all'],
      default: 'all'
    },
    prompt: {
      type: String,
      required: [true, 'Challenge prompt instruction is required.']
    },
    layout: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Challenge layout specification is required.']
    },
    parTimeSeconds: {
      type: Number,
      default: 30
    },
    baseXp: {
      type: Number,
      default: 100
    },
    // CRITICAL ZERO-TRUST CONSTRAINT:
    // solutionKey is NEVER sent to the client. Default query selection is disabled.
    solutionKey: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Challenge solution key must be stored securely in the database.'],
      select: false
    },
    validationRule: {
      type: String,
      enum: [
        'EXACT_ARRAY',
        'SET_EQUAL',
        'SINGLE_VALUE',
        'PATH_SEQUENCE',
        'KEY_VALUE_PAIR'
      ],
      default: 'EXACT_ARRAY'
    },
    hints: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Compound index to quickly find challenges by game, level, and demographic
challengeSchema.index({ gameId: 1, level: 1, demographicTarget: 1 });

const Challenge = mongoose.model('Challenge', challengeSchema);
export default Challenge;
