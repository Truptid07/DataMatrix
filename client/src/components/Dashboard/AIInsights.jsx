import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFilesContext } from "../../context/FileContext";
import AxisSelector from "../Analyze/AxisSelector";
import ChartTypeSelector from "../Analyze/ChartTypeSelector";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalFile } from "../../context/LocalFileContext";
import { FiCopy } from "react-icons/fi";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AIInsights = () => {
  const { files, selectedFileId, setSelectedFileId, fileData, fetchFiles } =
    useFilesContext();

  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartType, setChartType] = useState("none");
  const [availableColumns, setAvailableColumns] = useState([]);
  const [payload, setPayload] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState("");
  const [shareId, setShareId] = useState("");
  const { localFile } = useLocalFile();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    fetchFiles(); // refetch files on component mount
  }, []);

  useEffect(() => {
    const activeFile = selectedFileId === "local" ? localFile : fileData;

    if (activeFile?.data?.length) {
      setAvailableColumns(activeFile.headers);
      setXAxis("");
      setYAxis("");
      setChartType("none");
      setInsights([]);
      setError("");
    } else {
      setAvailableColumns([]);
    }
  }, [fileData, localFile, selectedFileId]);

  useEffect(() => {
    const activeFile = selectedFileId === "local" ? localFile : fileData;

    if (activeFile && xAxis && yAxis) {
      const fileName = activeFile.fileName;
      const headers = activeFile.headers;
      const data = activeFile.data.map((row) => ({
        [xAxis]: row[xAxis],
        [yAxis]: row[yAxis],
      }));
      setPayload({ fileName, headers, xAxis, yAxis, data });
    }
  }, [fileData, localFile, xAxis, yAxis, selectedFileId]);

  const handleGenerateInsights = () => {
    if (!confirmed) {
      setShowConfirmModal(true); // show modal
      return;
    }
    generateInsights(); // actual API call
  };

  const generateInsights = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${BASE_URL}/api/insights`, payload, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      setInsights(res.data);
    } catch (err) {
      setError("Failed to fetch insights. Please try again.");
    } finally {
      setLoading(false);
      setConfirmed(false); // reset for next time
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

  const handleExportTxt = () => {
    const blob = new Blob(
      [insights.map((i) => `${i.type}: ${i.text}`).join("\n\n")],
      { type: "text/plain;charset=utf-8" }
    );
    saveAs(blob, "insights.txt");
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    let y = 10;
    insights.forEach((insight) => {
      doc.text(`${insight.type}:`, 10, y);
      y += 7;
      const lines = doc.splitTextToSize(insight.text, 180);
      doc.text(lines, 10, y);
      y += lines.length * 7 + 5;
    });
    doc.save("insights.pdf");
  };

  const handleShare = async () => {
    if (!insights.length) return alert("Generate insights first!");
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${BASE_URL}/api/insights/share`,
        {
          fileName: fileData.fileName,
          insights: insights,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      const link = res.data.url;
      setShareLink(link);
      const id = link.split("/").pop();
      setShareId(id);
      await navigator.clipboard.writeText(link);
      alert("Link copied to clipboard!");
    } catch (err) {
      setError("Failed to generate share link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailShare = async () => {
    if (!email || !shareId)
      return alert("Please share first, then enter a valid email.");
    try {
      await axios.post(
        `${BASE_URL}/api/insights/email`,
        { email, shareId },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      alert("Email sent successfully!");
      setEmail("");
      setShowEmailInput(false);
    } catch {
      alert("Failed to send email.");
    }
  };

  return (
    <motion.div
      className="p-6 min-h-screen bg-[#E6F0FA] animate-fade-in-up"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-semibold mb-4 text-red-600">
                ⚠️ Data Privacy Warning
              </h2>
              <p className="text-gray-700 mb-4">
                By proceeding, you agree to share your selected data with our AI
                service (Gemini/OpenAI) to generate insights. Sensitive or
                personal data may be analyzed.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setConfirmed(true);
                    handleGenerateInsights(); // re-trigger
                  }}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Proceed
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <h2 className="text-2xl font-bold mb-6 text-blue-800">🧠 AI Insights</h2>

      <div className="mb-4 animate-fade-in-up">
        <label className="block text-blue-800 mb-2">Select File</label>
        <select
          className="w-full p-2 rounded border border-blue-300 bg-white"
          value={selectedFileId}
          onChange={(e) => setSelectedFileId(e.target.value)}
        >
          <option value="">-- Choose File --</option>
          {localFile?.fileName && (
            <option value="local">(Local) {localFile.fileName}</option>
          )}

          {files.map((f) => (
            <option key={f._id} value={f._id}>
              {f.fileName}
            </option>
          ))}
        </select>
      </div>

      {availableColumns.length > 0 && (
        <>
          <div className="animate-fade-in-up">
            <AxisSelector
              headers={availableColumns}
              xAxis={xAxis}
              yAxis={yAxis}
              setXAxis={setXAxis}
              setYAxis={setYAxis}
            />

            <ChartTypeSelector
              chartType={chartType}
              setChartType={setChartType}
            />

            <button
              onClick={handleGenerateInsights}
              disabled={!xAxis || !yAxis}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition duration-300"
            >
              {loading ? "Generating..." : "Generate Insights"}
            </button>
          </div>
        </>
      )}

      {error && <p className="mt-4 text-red-600 animate-fade-in-up">{error}</p>}

      {insights.length > 0 && (
        <>
          <div className="mt-6 flex flex-wrap gap-4 animate-fade-in-up">
            <motion.button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              onClick={handleExportTxt}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Export .txt
            </motion.button>
            <motion.button
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
              onClick={handleExportPdf}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Export .pdf
            </motion.button>
            <motion.button
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
              onClick={handleShare}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Share Link
            </motion.button>
            <motion.button
              className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition"
              onClick={() => setShowEmailInput(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Email Link
            </motion.button>
          </div>

          {showEmailInput && (
            <motion.div className="mt-4 flex flex-col sm:flex-row gap-2 items-start sm:items-center animate-fade-in-up">
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded w-full sm:w-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.button
                onClick={handleEmailShare}
                className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition"
              >
                Send Email
              </motion.button>
            </motion.div>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-1 md:grid-cols-2 animate-fade-in-up">
            {insights.map((insight, i) => (
              <motion.div
                key={i}
                className="p-4 bg-white rounded shadow transition duration-300"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.2 },
                  },
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-blue-800">
                    {insight.type}
                  </h3>
                  <button
                    onClick={() =>
                      handleCopy(`${insight.type}: ${insight.text}`)
                    }
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FiCopy className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-700">{insight.text}</p>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default AIInsights;
