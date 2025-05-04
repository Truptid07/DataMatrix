// src/pages/AIInsights.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFilesContext } from "../../context/FileContext";
import AxisSelector from "../Analyze/AxisSelector";
import ChartTypeSelector from "../Analyze/ChartTypeSelector";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AIInsights = () => {
  const { files, selectedFileId, setSelectedFileId, fileData } =
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

  useEffect(() => {
    if (fileData && fileData.data?.length) {
      setAvailableColumns(fileData.headers);
      setXAxis("");
      setYAxis("");
      setChartType("none");
      setInsights([]);
      setError("");
    } else {
      setAvailableColumns([]);
    }
  }, [fileData]);

  useEffect(() => {
    if (fileData && xAxis && yAxis) {
      const fileName = fileData.fileName;
      const headers = availableColumns;
      const data = fileData.data.map((row) => ({
        [xAxis]: row[xAxis],
        [yAxis]: row[yAxis],
      }));
      setPayload({ fileName, headers, xAxis, yAxis, data });
    }
  }, [fileData, xAxis, yAxis, availableColumns]);

  const handleGenerateInsights = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${BASE_URL}/api/insights`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setInsights(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch insights. Please try again.");
    } finally {
      setLoading(false);
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
    insights.forEach((insight, i) => {
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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const link = res.data.url;
      setShareLink(link);
  
      // Extract shareId from the link (e.g., last segment of URL)
      const id = link.split("/").pop();
      setShareId(id);
  
      await navigator.clipboard.writeText(link);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Error sharing insight:", err);
      setError("Failed to generate share link. Please try again.");
    } finally {
      setLoading(false);
    }
  };  

  const handleEmailShare = async () => {
    if (!email || !shareId) return alert("Please share first, then enter a valid email.");
    try {
      const res = await axios.post(
        `${BASE_URL}/api/insights/email`,
        { email, shareId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Email sent successfully!");
      setEmail("");
      setShowEmailInput(false);
    } catch (err) {
      console.error("Error emailing insight:", err);
      alert("Failed to send email.");
    }
  };
  
  

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-[#34495E]">
      <h2 className="text-2xl font-semibold mb-6 text-white">🧠 AI Insights</h2>

      <div className="mb-4">
        <label className="block text-white mb-2">Select File</label>
        <select
          className="w-full p-2 rounded bg-white"
          value={selectedFileId}
          onChange={(e) => setSelectedFileId(e.target.value)}
        >
          <option value="">-- Choose File --</option>
          {files.map((f) => (
            <option key={f._id} value={f._id}>
              {f.fileName}
            </option>
          ))}
        </select>
      </div>

      {availableColumns.length > 0 && (
        <>
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
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Insights"}
          </button>
        </>
      )}

      {error && <p className="mt-4 text-red-600">{error}</p>}

      {insights.length > 0 && (
        <>
          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={handleExportTxt}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Export .txt
            </button>
            <button
              onClick={handleExportPdf}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Export .pdf
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Share Link
            </button>
            <button
              onClick={() => setShowEmailInput(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Email Link
            </button>
          </div>

          {showEmailInput && (
            <div className="mt-4 flex flex-col sm:flex-row gap-2 items-start sm:items-center">
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded w-full sm:w-auto"
              />
              <button
                onClick={handleEmailShare}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Send Email
              </button>
            </div>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {insights.map((insight, i) => (
              <div key={i} className="p-4 bg-white rounded shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{insight.type}</h3>
                  <button
                    onClick={() =>
                      handleCopy(`${insight.type}: ${insight.text}`)
                    }
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Copy
                  </button>
                </div>
                <p>{insight.text}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AIInsights;
