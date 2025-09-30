import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const resetAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/excel-analytics-platform');
        console.log('Connected to MongoDB');

        // Delete existing admin user
        await User.deleteOne({ email: 'admin@datamatrix.com' });
        console.log('Deleted existing admin user');

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('datamatrix2025', salt);

        // Create new admin user
        const adminUser = new User({
            name: 'Admin',
            email: 'admin@datamatrix.com',
            password: hashedPassword,
            role: 'admin'
        });

        await adminUser.save();
        console.log('✅ New admin user created successfully!');
        console.log('Email: admin@datamatrix.com');
        console.log('Password: datamatrix2025');
        console.log('Role: admin');

        // Test password verification
        const testMatch = await bcrypt.compare('datamatrix2025', hashedPassword);
        console.log('Password verification test:', testMatch ? '✅ PASSED' : '❌ FAILED');

        mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error.message);
        mongoose.disconnect();
        process.exit(1);
    }
};

resetAdmin();