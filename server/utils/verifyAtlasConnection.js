import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env files
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// MongoDB Atlas connection string (directly hardcoded for testing)
const MONGO_URI = 'mongodb+srv://admin:Vxf3OkO4vVh9abMT@data.4o0pbic.mongodb.net/test?retryWrites=true&w=majority&appName=data';

// Simple function to check which server we're connected to
async function checkServerConnection() {
  try {
    console.log('Trying to connect to MongoDB...');
    console.log(`Using URI: ${MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//****:****@')}`);
    
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected successfully!');
    
    // Check connection details
    const connectionHost = mongoose.connection.host;
    const databaseName = mongoose.connection.db.databaseName;
    
    console.log('----------------------------------------');
    console.log(`Connected to host: ${connectionHost}`);
    console.log(`Database name: ${databaseName}`);
    
    // Determine if this is Atlas or local MongoDB
    const isAtlas = connectionHost && connectionHost.includes('mongodb.net');
    
    if (isAtlas) {
      console.log('✅ SUCCESS: You are connected to MongoDB Atlas cloud!');
    } else {
      console.log('❌ WARNING: You are connected to a local MongoDB server!');
    }
    
    // List collections
    console.log('----------------------------------------');
    console.log('Collections in this database:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('No collections found.');
    } else {
      collections.forEach(col => console.log(`- ${col.name}`));
    }
    
    // Check for users
    try {
      const usersCollection = mongoose.connection.db.collection('users');
      const userCount = await usersCollection.countDocuments();
      console.log(`Found ${userCount} users in database.`);
      
      if (userCount > 0) {
        const users = await usersCollection.find({}).limit(3).toArray();
        console.log('Sample users:');
        users.forEach(user => {
          console.log(`- ${user.name} (${user.email}) - ${user.role}`);
        });
      }
    } catch (err) {
      console.log('Could not access users collection:', err.message);
    }
    
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('Connection closed.');
    }
  }
}

// Run the check
checkServerConnection();