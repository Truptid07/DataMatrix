// Minimal Express server for Render deployment testing
import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Basic middleware
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'DataMatrix API is running',
    status: 'OK',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Environment check route
app.get('/env-check', (req, res) => {
  res.json({
    node_env: process.env.NODE_ENV || 'not set',
    port: process.env.PORT || 'not set',
    mongo_uri_exists: !!process.env.MONGO_URI,
    jwt_secret_exists: !!process.env.JWT_SECRET,
    client_url_exists: !!process.env.CLIENT_URL,
    gemini_api_exists: !!process.env.GEMINI_API_KEY,
    openai_api_exists: !!process.env.OPENAI_API_KEY
  });
});

// Error route for testing error handling
app.get('/error-test', (req, res, next) => {
  try {
    // Simulate an error
    throw new Error('This is a test error');
  } catch (error) {
    next(error);
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('Available routes:');
  console.log('  - / (Root)');
  console.log('  - /health (Health check)');
  console.log('  - /env-check (Environment variables check)');
  console.log('  - /error-test (Error handling test)');
});