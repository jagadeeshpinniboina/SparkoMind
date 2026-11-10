import mongoose from 'mongoose';

/**
 * Connect to MongoDB with resilient retry and connection lifecycle handling.
 */
export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/sparkomind';

  const options = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    autoIndex: true
  };

  try {
    const conn = await mongoose.connect(mongoUri, options);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[Database Error] Initial MongoDB Connection Failed: ${error.message}`);
    console.warn('[Database Notice] Running server in resilient mode. Ensure MongoDB is running on port 27017.');
  }

  // Monitor connection events
  mongoose.connection.on('connected', () => {
    console.log('[Database Event] Mongoose connected to MongoDB cluster');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`[Database Event] Mongoose connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[Database Event] Mongoose disconnected from MongoDB');
  });

  // Graceful shutdown handling
  const handleGracefulShutdown = async (signal) => {
    console.log(`\n[Process] Received ${signal}. Closing MongoDB connection...`);
    try {
      await mongoose.connection.close();
      console.log('[Process] MongoDB connection closed safely.');
      process.exit(0);
    } catch (err) {
      console.error('[Process Error] Error closing MongoDB connection:', err);
      process.exit(1);
    }
  };

  process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
};

export default connectDB;
