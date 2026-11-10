import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true,
      index: true
    },
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
      index: true
    },
    submittedAnswer: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    },
    timeTakenSeconds: {
      type: Number,
      required: true,
      min: 0
    },
    parTimeSeconds: {
      type: Number,
      default: 30
    },
    xpEarned: {
      type: Number,
      default: 0
    },
    accuracyPercentage: {
      type: Number,
      default: 100
    },
    demographicAtAttempt: {
      type: String,
      enum: ['kids', 'adults', 'seniors'],
      required: true
    },
    feedback: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

attemptSchema.index({ userId: 1, createdAt: -1 });

const Attempt = mongoose.model('Attempt', attemptSchema);
export default Attempt;
