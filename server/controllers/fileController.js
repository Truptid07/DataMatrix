import XLSX from "xlsx";
import FileUpload from "../models/FileUpload.js";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Read Excel buffer
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(sheet); // array of objects
    const headers = data.length ? Object.keys(data[0]) : [];

    const savedFile = await FileUpload.create({
      user: req.user.id,
      fileName: req.file.originalname,
      headers,
      data,
    });

    res.status(201).json({ message: "File uploaded successfully", file: savedFile });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

export const getUserFiles = async (req, res) => {
  try {
    const files = await FileUpload.find({ user: req.user.id }).select("fileName createdAt");
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch files", error: err.message });
  }
};

export const getSingleFile = async (req, res) => {
  try {
    const file = await FileUpload.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!file) {
      return res.status(404).json({ message: "File not found or unauthorized" });
    }

    res.status(200).json({
      fileName: file.fileName,
      headers: file.headers,
      data: file.data,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch file", error: err.message });
  }
};