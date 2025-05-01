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
