import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import fileRoutes from "./routes/fileRoutes.js";
import insightsRoutes from "./routes/insightsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import adminFileRoutes from "./routes/adminFileRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/files", fileRoutes);

app.use("/api/insights", insightsRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/admin/users", adminUserRoutes);

app.use("/api/admin/files", adminFileRoutes);
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => console.error("MongoDB connection failed:", error));
