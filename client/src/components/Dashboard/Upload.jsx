import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Loader from "../Loader";
import { AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import { useLocalFile } from "../../context/LocalFileContext";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setLocalFile } = useLocalFile();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleRemoveFile = () => {
    setFile(null);
    setMessage("");
    document.getElementById("upload-input").value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("Please select a file.");

    setLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        const headers = Object.keys(jsonData[0] || {});
        const filePayload = {
          fileName: file.name,
          headers,
          data: jsonData,
        };

        setLocalFile(filePayload);
        setMessage("✅ File loaded locally. You can now analyze or upload.");
      } catch (err) {
        console.error("Parsing error:", err);
        setMessage("❌ Failed to parse the file.");
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setLoading(false);
      setMessage("❌ Failed to read the file.");
    };
    reader.readAsArrayBuffer(file);
  };

  const handleUploadToServer = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/api/files/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      alert("✅ File uploaded to server.");
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("❌ Upload failed.");
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 py-10 min-h-screen bg-gradient-to-br from-[#dff1fd] to-[#b3dcf3] flex justify-center items-center">
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white/70 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md"
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          className="text-xl sm:text-2xl font-bold text-center text-[#007ea7] mb-2 outfit"
          variants={fadeUp}
          custom={1}
        >
          Upload Excel File
        </motion.h2>

        <motion.p
          className="text-center text-xs sm:text-sm text-blue-900 mb-6"
          variants={fadeUp}
          custom={2}
        >
          Supported formats: .xls, .xlsx
        </motion.p>

        <motion.div
          className="mb-4 flex justify-center"
          variants={fadeUp}
          custom={3}
        >
          <input
            id="upload-input"
            type="file"
            accept=".xls,.xlsx"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="upload-input"
            className="inline-block px-4 py-2 bg-[#007ea7] text-white rounded-full cursor-pointer hover:bg-[#009dc4] text-sm"
          >
            Choose File
          </label>
        </motion.div>

        {file && (
          <motion.div
            className="relative bg-white border rounded-lg p-3 mb-4 flex items-center justify-between shadow-sm"
            variants={fadeUp}
            custom={4}
          >
            <span className="text-sm text-[#2E3C43] truncate max-w-[85%]">
              {file.name}
            </span>
            <motion.button
              type="button"
              onClick={handleRemoveFile}
              className="absolute top-1/2 -translate-y-1/2 right-2 text-[#ff4d4d] text-lg font-bold"
              title="Remove file"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              ×
            </motion.button>
          </motion.div>
        )}

        <motion.button
          type="submit"
          className="w-full bg-[#00ACC1] text-white py-2 rounded-xl shadow-md hover:bg-[#0097a7] transition duration-200"
          variants={fadeUp}
          custom={5}
        >
          Upload
        </motion.button>

        {message && (
          <motion.p
            className={`mt-6 text-center text-sm font-medium ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
            variants={fadeUp}
            custom={6}
          >
            {message}
          </motion.p>
        )}
        {message.startsWith("✅") && (
          <motion.div className="flex gap-2 mt-4" variants={fadeUp} custom={7}>
            <button
              onClick={() => navigate("/dashboard/analyze")}
              className="w-full bg-[#007ea7] text-white py-2 rounded-xl shadow-md hover:bg-[#009dc4] transition duration-200"
            >
              Analyze without saving
            </button>
            <button
              onClick={handleUploadToServer}
              className="w-full bg-green-600 text-white py-2 rounded-xl shadow-md hover:bg-green-700 transition duration-200"
            >
              Upload to server
            </button>
          </motion.div>
        )}
      </motion.form>
    </div>
  );
}

export default Upload;
