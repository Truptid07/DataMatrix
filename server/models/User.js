import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
// This code defines a Mongoose schema for a User model in a Node.js application. The schema includes fields for name, email, password, and role, with appropriate validation and default values. The model is then exported for use in other parts of the application.