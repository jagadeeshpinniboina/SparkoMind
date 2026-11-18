import dotenv from 'dotenv';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

async function runBackendAudit() {
  console.log('\n========================================');
  console.log('🔍 SPARKOMIND BACKEND INTEGRITY AUDIT');
  console.log('========================================\n');

  // 1. Env Variables Check
  const requiredEnv = ['MONGODB_URI', 'JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASS'];
  const missingEnv = requiredEnv.filter((key) => !process.env[key]);
  if (missingEnv.length > 0) {
    console.error('❌ Missing ENV variables:', missingEnv.join(', '));
  } else {
    console.log('✅ Environment Variables: Loaded successfully');
  }

  // 2. MongoDB Atlas Connection
  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB Atlas: Connected successfully (State: ' + mongoose.connection.readyState + ')');
    
    // Check Collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📦 Collections Found:', collections.map(c => c.name).join(', ') || 'None (Clean DB)');

    // 3. User collection schema & indexing check
    const usersCollection = collections.find(c => c.name === 'users');
    if (usersCollection) {
      const userCount = await mongoose.connection.db.collection('users').countDocuments();
      const userIndexes = await mongoose.connection.db.collection('users').indexes();
      console.log(`👤 User Collection: Operational (${userCount} users recorded)`);
      console.log('🔑 User Indexes:', userIndexes.map(idx => Object.keys(idx.key).join('+')).join(', '));
    } else {
      console.log('👤 User Collection: Initialized (Awaiting first registration)');
    }
  } catch (err) {
    console.error('❌ MongoDB Atlas Connection Failed:', err.message);
  }

  // 4. Nodemailer SMTP Check
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS || process.env.EMAIL_APP_PASSWORD;
  if (emailUser && emailPass) {
    try {
      console.log('⏳ Verifying Gmail SMTP Transporter...');
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass
        }
      });
      await transporter.verify();
      console.log('✅ Gmail SMTP Transporter: Verified and ready to dispatch OTPs');
    } catch (err) {
      console.error('❌ SMTP Transporter Verification Failed:', err.message);
    }
  }

  // 5. Crypto / Hashing Check
  try {
    const testHash = await bcrypt.hash('SparkoSecret2026', 10);
    const isMatch = await bcrypt.compare('SparkoSecret2026', testHash);
    if (isMatch) console.log('✅ Bcrypt Hashing: Operational');
  } catch (err) {
    console.error('❌ Bcrypt Test Failed:', err.message);
  }

  console.log('\n========================================');
  console.log('🏁 AUDIT COMPLETE');
  console.log('========================================\n');
  process.exit(0);
}

runBackendAudit();
