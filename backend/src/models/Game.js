import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Game title is required.'],
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Game slug is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Game description is required.']
    },
    tagline: {
      type: String,
      default: 'Train your brain with this challenge.'
    },
    engine: {
      type: String,
      required: [true, 'Game engine type is required.'],
      enum: [
        'GridMatrixEngine',
        'SequenceCodeEngine',
        'CardMemoryEngine',
        'ChoiceLogicEngine',
        'SpatialPathEngine'
      ]
    },
    category: {
      type: String,
      required: [true, 'Cognitive category is required.'],
      enum: ['memory', 'logic', 'spatial', 'sequence', 'speed']
    },
    demographics: {
      type: [String],
      enum: ['kids', 'adults', 'seniors'],
      default: ['kids', 'adults', 'seniors']
    },
    icon: {
      type: String,
      default: 'Brain'
    },
    color: {
      type: String,
      default: '#3B82F6'
    },
    difficultyLevels: [
      {
        level: { type: Number, required: true },
        title: { type: String, required: true },
        parTimeSeconds: { type: Number, default: 30 }
      }
    ],
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Game = mongoose.model('Game', gameSchema);
export default Game;
