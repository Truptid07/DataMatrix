import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("Please select a file to upload.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("✅ File uploaded successfully!");
      console.log(res.data);
      setFile(null);
    } catch (error) {
      const msg = error?.response?.data?.message || "Upload failed.";
      setMessage(`❌ ${msg}`);
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 py-10 min-h-screen bg-gradient-to-br from-[#dff1fd] to-[#b3dcf3] flex justify-center items-center">
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

        <motion.input
          type="file"
          accept=".xls,.xlsx"
          onChange={handleFileChange}
          className="block w-full mb-6 file:px-4 file:py-2 file:border-0 file:rounded-full file:bg-[#007ea7] file:text-white file:cursor-pointer file:hover:bg-[#009dc4] text-sm text-[#2E3C43]"
          variants={fadeUp}
          custom={3}
        />

        <motion.button
          type="submit"
          className="w-full bg-[#00ACC1] text-white py-2 rounded-xl shadow-md hover:bg-[#0097a7] transition duration-200"
          variants={fadeUp}
          custom={4}
        >
          Upload
        </motion.button>

        {message && (
          <motion.p
            className={`mt-6 text-center text-sm font-medium ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
            variants={fadeUp}
            custom={5}
          >
            {message}
          </motion.p>
        )}
      </motion.form>
    </div>
  );
}

export default Upload;
