import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import env from "./config/envConfig.js";
import { connectMongoDB } from "./config/mongodb.js";

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import fileRoutes from "./routes/fileRoutes.js";
import insightsRoutes from "./routes/insightsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import adminFileRoutes from "./routes/adminFileRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import trendsRoutes from "./routes/trendsRoutes.js";
import explainRoutes from "./routes/explainRoutes.js";
import pinnedChartsRoutes from './routes/pinnedCharts.js';
import chartSuggestionsRoutes from './routes/chartSuggestions.js';

const app = express();
const PORT = env.PORT || 5000;

// Middleware
app.use(cors({
  origin: env.CLIENT_URL || 'http://localhost:5174',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/files", fileRoutes);

app.use("/api/insights", insightsRoutes);

app.use("/api/chat", chatRoutes);

app.use("/api/trends", trendsRoutes);

app.use("/api/explain", explainRoutes);

app.use('/api/pinned-charts', pinnedChartsRoutes);

app.use('/api/chart-type', chartSuggestionsRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/admin/users", adminUserRoutes);

app.use("/api/admin/files", adminFileRoutes);

// Health check route with MongoDB status
app.get("/health", async (req, res) => {
  console.log("🩺 Health check at:", new Date().toLocaleString());
  
  // Check MongoDB connection status
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  // Get sanitized MongoDB info
  const mongoInfo = process.env.MONGO_URI 
    ? { 
        host: process.env.MONGO_URI.split('@')[1]?.split('/')[0] || 'unknown',
        database: process.env.MONGO_URI.split('/')?.pop() || 'unknown'
      }
    : { host: 'unknown', database: 'unknown' };
  
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV || 'development',
    database: {
      status: dbStatus,
      host: mongoInfo.host
    },
    server: {
      node: process.version,
      uptime: Math.floor(process.uptime()) + ' seconds',
      workingDirectory: process.cwd()
    }
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({ 
    message: "DataMatrix API Server", 
    version: "1.0.0",
    status: "running" 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// Handle 404 - Keep this as the last route
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server independent of MongoDB connection
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} in ${env.NODE_ENV || 'development'} mode`);
});

// Handle server shutdown gracefully
process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  await mongoose.connection.close();
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION! 💥');
  console.error(error.name, error.message);
  console.error(error.stack);
  console.error('Server shutting down...');
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION! 💥');
  console.error('Reason:', reason);
  console.error('Server shutting down...');
  process.exit(1);
});

// Attempt database connection with retry
(async function initDatabase() {
  console.log('Initializing MongoDB Atlas connection...');
  console.log('Environment:', env.NODE_ENV || 'development');
  console.log('Server working directory:', process.cwd());
  
  const connected = await connectMongoDB();
  if (!connected) {
    console.log('Will retry MongoDB Atlas connection in 5 seconds...');
    setTimeout(initDatabase, 5000);
  } else {
    // Log database name and host for confirmation
    const dbName = mongoose.connection.db.databaseName;
    const host = mongoose.connection.host;
    console.log(`Connected to database "${dbName}" on host "${host}"`);
    
    // Verify we're connected to Atlas
    if (host && host.includes('mongodb.net')) {
      console.log('✅ Confirmed: Using MongoDB Atlas cloud database');
    } else {
      console.warn('⚠️ Warning: Not connected to MongoDB Atlas! Connected to:', host);
    }
  }
})();
