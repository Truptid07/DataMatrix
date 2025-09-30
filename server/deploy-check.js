#!/usr/bin/env node

import { exec } from 'child_process';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

console.log('🔍 Running DataMatrix deployment check...');

// Check Node.js version
const nodeVersion = process.version;
console.log(`Node.js version: ${nodeVersion}`);
const majorVersion = parseInt(nodeVersion.substring(1).split('.')[0], 10);
if (majorVersion < 18) {
  console.warn('⚠️ Warning: Node.js version is below 18. This may cause compatibility issues.');
}

// Check MongoDB connection string
const mongoUri = process.env.MONGO_URI;
const hasSeparateCredentials = process.env.MONGO_USERNAME && process.env.MONGO_PASSWORD && process.env.MONGO_CLUSTER;

if (!mongoUri && !hasSeparateCredentials) {
  console.error('❌ ERROR: Neither MONGO_URI nor separate MongoDB credentials are defined in environment variables');
  if (process.env.NODE_ENV === 'production') {
    console.warn('⚠️ Running in production - will attempt to use backup connection string');
  } else {
    process.exit(1);
  }
}

// Check if PORT is defined
const port = process.env.PORT || 5000;
console.log(`PORT: ${port}`);

// Check if JWT_SECRET is defined
if (!process.env.JWT_SECRET) {
  console.warn('⚠️ Warning: JWT_SECRET is not defined. Using a default secret is not secure for production.');
}

// Function to check if a package is installed
async function checkPackage(packageName) {
  return new Promise((resolve) => {
    exec(`npm list ${packageName} --depth=0`, (error, stdout) => {
      resolve(!error && stdout.includes(packageName));
    });
  });
}

// Check for critical packages
const criticalPackages = ['express', 'mongoose', 'dotenv', 'cors'];
for (const pkg of criticalPackages) {
  const isInstalled = await checkPackage(pkg);
  if (isInstalled) {
    console.log(`✅ ${pkg} is installed`);
  } else {
    console.error(`❌ ERROR: ${pkg} is not installed. Run 'npm install ${pkg}'`);
    process.exit(1);
  }
}

console.log('✅ Deployment check completed. Ready to start server.');
console.log('🚀 Starting server...');