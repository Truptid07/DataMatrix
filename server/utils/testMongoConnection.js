import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check multiple possible .env locations
console.log('Current directory:', __dirname);
console.log('Searching for .env file...');

const envPaths = [
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../.env'),
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'server/.env')
];

let envLoaded = false;
for (const envPath of envPaths) {
  console.log('Checking:', envPath);
  if (fs.existsSync(envPath)) {
    console.log('✅ Found .env at:', envPath);
    dotenv.config({ path: envPath });
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.warn('⚠️ No .env file found!');
}

// Hardcoded MongoDB URI as backup
const BACKUP_URI = 'mongodb+srv://admin:Vxf3OkO4vVh9abMT@data.4o0pbic.mongodb.net/?retryWrites=true&w=majority&appName=data';

// Get the MongoDB URI
let MONGO_URI = process.env.MONGO_URI;

// If no URI in env, try building from separate credentials
if (!MONGO_URI && process.env.MONGO_USERNAME && process.env.MONGO_PASSWORD && process.env.MONGO_CLUSTER) {
  MONGO_URI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/?retryWrites=true&w=majority&appName=data`;
}

// Use backup if still no URI
if (!MONGO_URI) {
  console.log('⚠️ Using backup MongoDB URI');
  MONGO_URI = BACKUP_URI;
}

const sanitizedUri = MONGO_URI?.replace(/\/\/([^:]+):([^@]+)@/, '//****:****@') || 'No URI found';
console.log('Using MongoDB URI:', sanitizedUri);

// User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Create test user
async function createTestUser() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');
    
    // Get database information
    console.log('Database name:', mongoose.connection.name);
    
    // List all collections
    console.log('Checking collections...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections found:', collections.length);
    collections.forEach(col => console.log(`- ${col.name}`));
    
    // Check if users collection exists and count documents
    console.log('Checking users collection...');
    const usersCount = await User.countDocuments();
    console.log(`Found ${usersCount} users in database`);
    
    if (usersCount > 0) {
      console.log('Sample user:');
      const sampleUser = await User.findOne().select('name email role');
      console.log(sampleUser);
    }
    
    // Create test user
    console.log('Creating test user...');
    const hashedPassword = await bcrypt.hash('testuser123', 10);
    
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@datamatrix.com',
      password: hashedPassword,
      role: 'user'
    });
    
    console.log('✅ Test user created successfully:');
    console.log({
      id: testUser._id,
      name: testUser.name,
      email: testUser.email,
      role: testUser.role
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'MongoServerSelectionError') {
      console.error('Could not connect to MongoDB server. Check your connection string and network.');
    }
    if (error.code === 11000) {
      console.error('Duplicate key error - test user email already exists');
    }
  } finally {
    if (mongoose.connection.readyState === 1) {
      console.log('Closing MongoDB connection...');
      await mongoose.connection.close();
      console.log('Connection closed');
    }
  }
}

// Run the function
createTestUser();