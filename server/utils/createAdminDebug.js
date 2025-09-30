import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
console.log('Loading environment variables...');
dotenv.config();
console.log('Environment variables loaded');

// Check if MongoDB URI is available
console.log('Checking MongoDB URI...');
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in environment variables');
  process.exit(1);
}

// Define user schema
console.log('Defining user schema...');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

// Create model
const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    console.log(`Using URI: ${process.env.MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//****:****@')}`);
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully');

    // Check if admin exists
    console.log('Checking if admin already exists...');
    const existingAdmin = await User.findOne({ email: 'admin@datamatrix.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists with this email:', existingAdmin.email);
      await mongoose.connection.close();
      return;
    }

    // Hash password
    console.log('Creating new admin user...');
    const hashedPassword = await bcrypt.hash('datamatrix2025', 10);
    
    // Create admin
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@datamatrix.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    console.log('✅ Admin created successfully!');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    
  } catch (error) {
    console.error('❌ Error creating admin:');
    console.error('Type:', error.name);
    console.error('Message:', error.message);
    if (error.codeName) {
      console.error('Code name:', error.codeName);
    }
    if (error.code) {
      console.error('Error code:', error.code);
    }
    
  } finally {
    // Close connection
    console.log('Closing MongoDB connection...');
    await mongoose.connection.close();
    console.log('Connection closed');
  }
}

// Execute function
console.log('Starting admin user creation process...');
createAdmin();