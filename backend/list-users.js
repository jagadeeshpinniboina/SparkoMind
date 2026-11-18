import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './src/models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

async function displayUsers() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    const users = await User.find({}, 'name email role demographic createdAt isVerified').lean();
    
    console.log('\n========================================');
    console.log(`👥 REGISTERED USERS LIST (Total: ${users.length})`);
    console.log('========================================\n');
    
    console.table(users.map(u => ({
      Name: u.name || 'N/A',
      Email: u.email,
      Role: u.role || 'user',
      Joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'
    })));
  } catch (err) {
    console.error('Error fetching users:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

displayUsers();
