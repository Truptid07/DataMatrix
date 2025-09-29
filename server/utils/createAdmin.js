import User from "../models/User.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        
        // Admin credentials - CHANGE THESE!
        const adminData = {
            name: "DataMatrix Admin",
            email: "admin@datamatrix.com", // You can change this
            password: "datamatrix2025", // You can change this
            role: "admin"
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log("❌ Admin user already exists with this email");
            process.exit(1);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(adminData.password, 10);

        // Create admin user
        const admin = await User.create({
            name: adminData.name,
            email: adminData.email,
            password: hashedPassword,
            role: "admin"
        });

        console.log("✅ Admin user created successfully!");
        console.log("📧 Email:", adminData.email);
        console.log("🔐 Password:", adminData.password);
        console.log("⚠️  Please change the password after first login!");
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Error creating admin user:", error);
        process.exit(1);
    }
};

createAdminUser();