import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables directly here as a backup
dotenv.config({ path: '.env' });
dotenv.config({ path: '../.env' });

// Hardcoded backup connection string for Render (with actual password)
const BACKUP_URI = 'mongodb+srv://admin:Vxf3OkO4vVh9abMT@data.4o0pbic.mongodb.net/?retryWrites=true&w=majority&appName=data';

// Connection options
const options = {
  serverSelectionTimeoutMS: 5000,
  maxPoolSize: 10,
  retryWrites: true,
  w: 'majority'
};

// Get MongoDB URI from environment with fallbacks - ALWAYS USE ATLAS
const getMongoURI = () => {
  // 1. Try from direct environment variable
  if (process.env.MONGO_URI) {
    // Verify we're using Atlas
    if (process.env.MONGO_URI.includes('mongodb+srv') || process.env.MONGO_URI.includes('mongodb.net')) {
      console.log('Using MongoDB Atlas connection from MONGO_URI');
      return process.env.MONGO_URI;
    }
  }
  
  // 2. Try to build from separate credentials
  if (process.env.MONGO_USERNAME && process.env.MONGO_PASSWORD && process.env.MONGO_CLUSTER) {
    console.log('Building MongoDB Atlas URI from separate credentials');
    return `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/?retryWrites=true&w=majority&appName=data`;
  }
  
  // 3. Use backup URI in any environment
  console.warn('⚠️ Using backup MongoDB Atlas connection string.');
  return BACKUP_URI;
};

// Connect to MongoDB
export const connectMongoDB = async () => {
  try {
    const uri = getMongoURI();
    
    // Log sanitized connection string (hide credentials)
    const sanitizedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//****:****@');
    console.log(`Connecting to MongoDB: ${sanitizedUri}`);
    
    await mongoose.connect(uri, options);
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed!');
    console.error(`Error type: ${error.name}`);
    console.error(`Error message: ${error.message}`);
    if (error.code) {
      console.error(`Error code: ${error.code}`);
    }
    return false;
  }
};

// Disconnect from MongoDB
export const disconnectMongoDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB disconnected');
    return true;
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    return false;
  }
};

export default {
  connectMongoDB,
  disconnectMongoDB
};