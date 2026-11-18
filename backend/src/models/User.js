import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDemographicFromAge } from '../utils/helpers.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name.'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters.']
    },
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address.'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password.'],
      minlength: [6, 'Password must be at least 6 characters long.'],
      select: false
    },
    age: {
      type: Number,
      required: [true, 'Please provide your age.'],
      min: [4, 'Age must be at least 4.'],
      max: [120, 'Age cannot exceed 120.']
    },
    demographic: {
      type: String,
      enum: ['kids', 'adults', 'seniors'],
      required: true
    },
    avatar: {
      type: String,
      default: '🚀'
    },
    preferences: {
      theme: {
        type: String,
        enum: ['auto', 'light', 'dark'],
        default: 'auto'
      },
      soundEnabled: {
        type: Boolean,
        default: true
      },
      fontSize: {
        type: String,
        enum: ['normal', 'large', 'xlarge'],
        default: 'normal'
      },
      highContrast: {
        type: Boolean,
        default: false
      }
    },
    resetPasswordOtp: {
      type: String
    },
    resetPasswordExpires: {
      type: Date
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Auto-derive demographic prior to validation
userSchema.pre('validate', function (next) {
  if (this.age && !this.demographic) {
    this.demographic = getDemographicFromAge(this.age);
  }
  next();
});

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  // Prevent double-hashing if already encrypted
  if (typeof this.password === 'string' && (this.password.startsWith('$2a$') || this.password.startsWith('$2b$'))) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT signed token
userSchema.methods.generateAuthToken = function () {
  const secret = process.env.JWT_SECRET || 'supersecretjwtkey_sparkomind_production_grade_token_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(
    {
      id: this._id,
      demographic: this.demographic,
      email: this.email
    },
    secret,
    { expiresIn }
  );
};

const User = mongoose.model('User', userSchema);
export default User;
