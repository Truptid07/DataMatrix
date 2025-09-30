import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define possible paths for .env file
const envPaths = [
  path.resolve(__dirname, '../.env'),            // server/.env
  path.resolve(__dirname, '../../.env'),         // project root/.env
  path.resolve(process.cwd(), '.env'),           // current working directory
  path.resolve(process.cwd(), 'server/.env')     // cwd/server/.env
];

// Try to load .env file from multiple locations
let envLoaded = false;

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    console.log(`Loading environment from: ${envPath}`);
    dotenv.config({ path: envPath });
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.warn('No .env file found. Using environment variables from the system.');
  // Still call config() to process any inline env vars
  dotenv.config();
}

// Validate critical environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.warn(`Warning: Missing required environment variables: ${missingVars.join(', ')}`);
  console.warn('Some features may not work correctly.');
}

export default {
  // Database
  MONGO_URI: process.env.MONGO_URI,
  
  // Auth
  JWT_SECRET: process.env.JWT_SECRET,
  
  // API keys
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  
  // Server config
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // URLs
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  
  // Email
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  
  // Helper function for checking environment
  isDev: () => (process.env.NODE_ENV !== 'production')
};