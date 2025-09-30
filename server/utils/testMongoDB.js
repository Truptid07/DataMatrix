import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Log environment info
console.log('Testing MongoDB Connection');
console.log('--------------------------');
console.log('Environment: ', process.env.NODE_ENV || 'development');
console.log('Current directory: ', process.cwd());

// Determine which connection method to use
let connectionString;

// Option 1: Direct MONGO_URI
if (process.env.MONGO_URI) {
  console.log('Using MONGO_URI from environment variables');
  connectionString = process.env.MONGO_URI;
} 
// Option 2: Build from components
else if (process.env.MONGO_USERNAME && process.env.MONGO_PASSWORD && process.env.MONGO_CLUSTER) {
  console.log('Building connection string from separate credentials');
  connectionString = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/?retryWrites=true&w=majority&appName=data`;
}
// Fallback
else {
  console.error('❌ No MongoDB connection details found in environment variables!');
  process.exit(1);
}

// Hide password in logs
const sanitizedString = connectionString.replace(/\/\/([^:]+):([^@]+)@/, '//****:****@');
console.log(`Connection string: ${sanitizedString}`);

// Connect to MongoDB
async function testConnection() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    
    // Get database information
    const adminDb = mongoose.connection.db.admin();
    const dbInfo = await adminDb.serverStatus();
    
    console.log('--------------------------');
    console.log('MongoDB Server Information:');
    console.log(`- Version: ${dbInfo.version}`);
    console.log(`- Uptime: ${Math.floor(dbInfo.uptime / 86400)} days, ${Math.floor((dbInfo.uptime % 86400) / 3600)} hours`);
    console.log(`- Connections: ${dbInfo.connections.current} current / ${dbInfo.connections.available} available`);
    
    // List collections
    console.log('--------------------------');
    console.log('Available collections:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    console.log('--------------------------');
    console.log('MongoDB connection test completed successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection failed!');
    console.error(`Error type: ${error.name}`);
    console.error(`Error message: ${error.message}`);
    console.error(`Error code: ${error.code}`);
    console.error(`Error codeName: ${error.codeName}`);
    
    // More detailed troubleshooting
    if (error.name === 'MongoServerSelectionError') {
      console.error('This is likely a network connectivity or authentication issue.');
      console.error('- Check if MongoDB Atlas IP whitelist includes Render IPs (0.0.0.0/0 to allow all)');
      console.error('- Verify username and password are correct');
      console.error('- Check if the MongoDB cluster name is correct');
    }
  } finally {
    // Close the connection
    await mongoose.connection.close();
    process.exit(0);
  }
}

// Run the test
testConnection();