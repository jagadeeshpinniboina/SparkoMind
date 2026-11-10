import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';

import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import gameRoutes from './routes/game.routes.js';
import challengeRoutes from './routes/challenge.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.middleware.js';

// Load environment variables
dotenv.config();

// Initialize MongoDB connection
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// 1. HTTP Request Logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// 2. CORS Configuration
const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Dev-friendly fallback
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

// 3. Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 4. Base Health Check Route
app.get('/api/v1/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.status(200).json({
    status: 'online',
    platform: 'SparkoMind REST API',
    tagline: 'Spark Your Mind. Shape Your Future.',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: statusMap[dbStatus] || 'unknown',
      readyState: dbStatus
    },
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// 5. REST API v1 Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/v1/games', gameRoutes);
app.use('/api/v1/challenges', challengeRoutes);

// 6. 404 & Global Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// 7. Start Server Listener
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n=================================================`);
    console.log(`🚀 SparkoMind API Engine Online`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🩺 Health: http://localhost:${PORT}/api/v1/health`);
    console.log(`🌐 Allowed Client: ${CLIENT_URL}`);
    console.log(`=================================================\n`);
  });
}

export default app;
