// render-debug.js - A comprehensive debug script for Render deployment
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dns from 'dns';
import { exec } from 'child_process';
import { promisify } from 'util';

// Convert exec to promise-based
const execAsync = promisify(exec);

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to mask sensitive info
const maskString = (str) => {
  if (!str) return 'undefined';
  if (str.includes('@')) {
    return str.replace(/\/\/([^:]+):([^@]+)@/, '//****:****@');
  }
  if (str.length > 30) {
    return str.substring(0, 10) + '...' + str.substring(str.length - 5);
  }
  return str;
};

console.log('===========================================');
console.log('📊 DATAMATRIX RENDER DEPLOYMENT DIAGNOSTICS');
console.log('===========================================');

// 1. System Information
console.log('\n🖥️  SYSTEM INFORMATION');
console.log('-------------------------------------------');
console.log(`Node Version: ${process.version}`);
console.log(`Platform: ${process.platform}`);
console.log(`Architecture: ${process.arch}`);
console.log(`Working Directory: ${process.cwd()}`);
console.log(`Script Directory: ${__dirname}`);
console.log(`Memory Usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`);
console.log(`Free Memory: ${Math.round(require('os').freemem() / 1024 / 1024)} MB`);
console.log(`Total Memory: ${Math.round(require('os').totalmem() / 1024 / 1024)} MB`);
console.log(`CPU Cores: ${require('os').cpus().length}`);

// 2. Directory Structure
console.log('\n📁 DIRECTORY STRUCTURE');
console.log('-------------------------------------------');
try {
  const currentDirFiles = fs.readdirSync(process.cwd());
  console.log(`Current directory (${process.cwd()}) contents:`);
  currentDirFiles.forEach(file => {
    const stats = fs.statSync(path.join(process.cwd(), file));
    console.log(`- ${file} (${stats.isDirectory() ? 'directory' : 'file'})`);
  });
} catch (error) {
  console.log(`Error reading directory: ${error.message}`);
}

// 3. Environment Variables Check
console.log('\n🔑 ENVIRONMENT VARIABLES CHECK');
console.log('-------------------------------------------');
// Load environment variables from multiple possible locations
const envFiles = [
  path.join(process.cwd(), '.env'),
  path.join(__dirname, '.env'),
  path.join(__dirname, '../.env'),
];

let envLoaded = false;
envFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`Found .env file: ${file}`);
    dotenv.config({ path: file });
    envLoaded = true;
  }
});

if (!envLoaded) {
  console.log('No .env files found, using system environment variables');
} else {
  console.log('Environment variables loaded from .env file(s)');
}

// Check critical environment variables
const criticalVars = [
  'MONGO_URI',
  'MONGO_USERNAME',
  'MONGO_PASSWORD',
  'MONGO_CLUSTER',
  'JWT_SECRET',
  'NODE_ENV',
  'PORT'
];

criticalVars.forEach(varName => {
  const varExists = !!process.env[varName];
  const varValue = process.env[varName];
  let displayValue = varExists ? 'set' : 'NOT SET';
  
  if (varExists && (varName.includes('URI') || varName.includes('SECRET') || 
      varName.includes('PASSWORD') || varName.includes('KEY'))) {
    displayValue = maskString(varValue);
  } else if (varExists) {
    displayValue = varValue;
  }
  
  console.log(`- ${varName}: ${displayValue}`);
});

// 4. MongoDB Connection Info
console.log('\n🗄️  MONGODB CONNECTION INFO');
console.log('-------------------------------------------');

// Determine MongoDB URI from various sources
let mongoUri = null;
if (process.env.MONGO_URI) {
  console.log('Found MONGO_URI in environment variables');
  mongoUri = process.env.MONGO_URI;
} else if (process.env.MONGO_USERNAME && process.env.MONGO_PASSWORD && process.env.MONGO_CLUSTER) {
  console.log('Building MONGO_URI from separate credentials');
  mongoUri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/?retryWrites=true&w=majority&appName=data`;
} else {
  console.log('❌ No MongoDB connection info found!');
}

if (mongoUri) {
  console.log(`MongoDB URI: ${maskString(mongoUri)}`);
  
  // Parse MongoDB URI for diagnostics
  try {
    const uriParts = mongoUri.split('@');
    if (uriParts.length > 1) {
      const hostPart = uriParts[1].split('/?')[0];
      console.log(`MongoDB Host: ${hostPart}`);
      
      // Try to resolve DNS
      console.log('\nTesting DNS resolution...');
      try {
        dns.lookup(hostPart, (err, address, family) => {
          if (err) {
            console.log(`❌ DNS resolution failed: ${err.message}`);
          } else {
            console.log(`✅ DNS resolved: ${hostPart} -> ${address} (IPv${family})`);
          }
        });
      } catch (dnsError) {
        console.log(`❌ DNS lookup error: ${dnsError.message}`);
      }
    }
  } catch (parseError) {
    console.log(`Error parsing MongoDB URI: ${parseError.message}`);
  }
}

// 5. Network Tests
console.log('\n🌐 NETWORK TESTS');
console.log('-------------------------------------------');

// Function to test connectivity to a host
const testConnectivity = async (host, port) => {
  try {
    console.log(`Testing connectivity to ${host}:${port}...`);
    const { stdout, stderr } = await execAsync(`ping -c 3 ${host}`);
    console.log(`✅ Ping successful: ${stdout.split('\n')[0]}`);
    return true;
  } catch (error) {
    console.log(`❌ Connectivity test failed: ${error.message}`);
    return false;
  }
};

// Test MongoDB connectivity
if (mongoUri) {
  try {
    const uriParts = mongoUri.split('@');
    if (uriParts.length > 1) {
      const hostPart = uriParts[1].split('/?')[0].split(':')[0];
      testConnectivity(hostPart, 27017);
    }
  } catch (error) {
    console.log(`Error testing connectivity: ${error.message}`);
  }
}

// 6. MongoDB Connection Test
console.log('\n🔌 MONGODB CONNECTION TEST');
console.log('-------------------------------------------');

const connectToMongoDB = async () => {
  if (!mongoUri) {
    console.log('❌ Cannot test connection: No MongoDB URI available');
    return;
  }

  console.log('Attempting to connect to MongoDB...');
  try {
    // Configure connection options
    const options = {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(mongoUri, options);
    console.log('✅ MongoDB connection successful!');
    
    // Get connection details
    const dbName = mongoose.connection.db.databaseName;
    const host = mongoose.connection.host;
    console.log(`Connected to database "${dbName}" on host "${host}"`);
    
    // Check for Atlas
    if (host && host.includes('mongodb.net')) {
      console.log('✅ Confirmed: Using MongoDB Atlas cloud database');
    } else {
      console.log('❓ Not connected to MongoDB Atlas, connected to:', host);
    }
    
    // List collections
    console.log('\nListing collections:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('No collections found in database.');
    } else {
      collections.forEach(col => {
        console.log(`- ${col.name}`);
      });
    }
    
    // Close connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  } catch (error) {
    console.log('❌ MongoDB connection failed!');
    console.log(`Error type: ${error.name}`);
    console.log(`Error message: ${error.message}`);
    if (error.code) {
      console.log(`Error code: ${error.code}`);
    }
  }
};

// Execute MongoDB connection test
connectToMongoDB().then(() => {
  console.log('\n===========================================');
  console.log('📊 DIAGNOSTICS COMPLETE');
  console.log('===========================================');
});