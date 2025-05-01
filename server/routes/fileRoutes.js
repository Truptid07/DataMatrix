import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";
import { uploadFile } from "../controllers/fileController.js";

const router = express.Router();

router.post("/upload", protect, upload.single("file"), uploadFile);

export default router;
