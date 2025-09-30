import User from "../models/User.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const createNewAdmin = async () => {
    try {
        console.log("🔄 Connecting to MongoDB...");
        
        // Connect to MongoDB using the MONGO_URI from the environment variables
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB Atlas successfully!");
        
        // New admin credentials
        const adminData = {
            name: "DataMatrix Super Admin",
            email: "superadmin@datamatrix.com", // New admin email
            password: "Matrix2025!", // New admin password
            role: "admin"
        };

        // Check if admin already exists with this email
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log("⚠️ An admin with this email already exists.");
            console.log("🔄 Updating the password for the existing admin...");
            
            // Hash the new password
            const hashedPassword = await bcrypt.hash(adminData.password, 10);
            
            // Update the existing admin with the new password
            await User.findOneAndUpdate(
                { email: adminData.email },
                { 
                    password: hashedPassword,
                    name: adminData.name
                }
            );
            
            console.log("✅ Admin password updated successfully!");
        } else {
            // Hash password for new admin
            const hashedPassword = await bcrypt.hash(adminData.password, 10);

            // Create new admin user
            const admin = await User.create({
                name: adminData.name,
                email: adminData.email,
                password: hashedPassword,
                role: "admin"
            });

            console.log("✅ New admin user created successfully!");
        }
        
        console.log("==================================");
        console.log("📋 ADMIN LOGIN CREDENTIALS 📋");
        console.log("==================================");
        console.log("📧 Email:", adminData.email);
        console.log("🔐 Password:", adminData.password);
        console.log("==================================");
        console.log("⚠️  Please save these credentials securely!");
        
        // Check for existing default admin
        const defaultAdmin = await User.findOne({ email: "admin@datamatrix.com" });
        if (defaultAdmin) {
            console.log("\n📌 Note: The default admin account (admin@datamatrix.com) still exists.");
            console.log("   You may want to delete it for security purposes.");
        }
        
        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        mongoose.connection.close();
        process.exit(1);
    }
};

createNewAdmin();