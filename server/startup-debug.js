// startup-debug.js - Run this script to diagnose startup issues
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('================ STARTUP DIAGNOSTIC ================');
console.log('Current directory:', __dirname);
console.log('Working directory:', process.cwd());
console.log('Node version:', process.version);
console.log('Platform:', process.platform);

// Check for .env files
const envPaths = [
  path.resolve(__dirname, '.env'),            // server/.env
  path.resolve(__dirname, '../.env'),         // project root/.env
  path.resolve(process.cwd(), '.env'),        // cwd/.env
  path.resolve(process.cwd(), '../.env')      // cwd/../.env
];

console.log('\nChecking for .env files:');
envPaths.forEach(envPath => {
  const exists = fs.existsSync(envPath);
  console.log(`- ${envPath}: ${exists ? 'EXISTS' : 'NOT FOUND'}`);
  
  if (exists) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split('\n');
      console.log(`  Contains ${lines.length} lines`);
      console.log(`  Contains these keys: ${
        lines
          .filter(line => line.trim() && !line.trim().startsWith('#'))
          .map(line => line.split('=')[0])
          .join(', ')
      }`);
    } catch (error) {
      console.log(`  Error reading file: ${error.message}`);
    }
  }
});

// Load env vars
console.log('\nLoading environment variables...');
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('\nChecking critical environment variables:');
const criticalVars = ['MONGO_URI', 'JWT_SECRET', 'PORT', 'NODE_ENV'];
criticalVars.forEach(varName => {
  const exists = !!process.env[varName];
  const value = exists ? 
    (varName.includes('URI') || varName.includes('SECRET') || varName.includes('PASSWORD') ? 
      '****' : process.env[varName]) 
    : 'NOT SET';
  console.log(`- ${varName}: ${exists ? 'SET' : 'NOT SET'} (${value})`);
});

console.log('\nChecking file existence:');
const filesToCheck = [
  'server.js',
  'package.json',
  'config/mongodb.js',
  'config/envConfig.js'
];

filesToCheck.forEach(file => {
  const filePath = path.resolve(__dirname, file);
  const exists = fs.existsSync(filePath);
  console.log(`- ${file}: ${exists ? 'EXISTS' : 'NOT FOUND'}`);
});

console.log('\n================ END DIAGNOSTIC ================');