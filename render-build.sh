#!/usr/bin/env bash
# Exit on error
set -o errexit

# Print version information
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Working directory: $(pwd)"

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Navigate to server directory
cd server

# Install server dependencies
echo "Installing server dependencies..."
npm install

# Make test server executable
chmod +x test-server.js

# Create a .env file if it doesn't exist with minimal settings
if [ ! -f .env ]; then
  echo "Creating minimal .env file..."
  echo "NODE_ENV=production" > .env
  echo "PORT=10000" >> .env
fi

echo "Server build completed successfully!"