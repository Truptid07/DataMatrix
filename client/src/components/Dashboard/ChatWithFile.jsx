// src/pages/ChatWithFile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { useFilesContext } from "../../context/FileContext";
import { useLocalFile } from "../../context/LocalFileContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ChatWithFile = () => {
  const {
    files,
    selectedFileId,
    setSelectedFileId,
    fileData,
    setFileData,
    fetchFiles,
  } = useFilesContext();
  const { localFile, setLocalFile } = useLocalFile();
  const activeFile = selectedFileId === "local" ? localFile : fileData;
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch backend files on mount
  useEffect(() => {
    fetchFiles();
  }, []);

  // Reset state when file changes
  useEffect(() => {
    setQuestion("");
    setAnswer("");
    setError("");
  }, [selectedFileId]);

  useEffect(() => {
    if (activeFile?.data?.length) {
      // Handle data here
      console.log("Headers:", activeFile.headers);
      console.log("Rows:", activeFile.data);
    }
  }, [selectedFileId, fileData, localFile]);

  // Determine active file source (backend vs local)
  const isLocal = selectedFileId === "local";
  const activeData = isLocal ? localFile : fileData;

  // Handle local file upload + parse Excel
  const handleLocalFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (jsonData.length === 0) {
          setError("Selected file is empty or invalid.");
          return;
        }

        const parsed = {
          data: jsonData,
          headers: Object.keys(jsonData[0]),
          fileName: file.name,
        };

        setLocalFile(parsed);
        setSelectedFileId("local");
        setError("");
      } catch (err) {
        setError("Failed to parse the Excel file.");
      }
    };

    reader.onerror = () => setError("Failed to read the file.");
    reader.readAsArrayBuffer(file);
  };

  // Handle Ask button click
  const handleSubmit = async () => {
    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }

    if (!activeData || !activeData.data || activeData.data.length === 0) {
      setError("No data to analyze. Please select or upload a valid file.");
      return;
    }

    setLoading(true);
    setAnswer("");
    setError("");

    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/api/chat/chat`,
        {
          question: question.trim(),
          fileData: activeData.data.slice(0, 100),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAnswer(res.data.answer);
    } catch (err) {
      setError("Failed to get a response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Chat with Your File Data</h1>

      <div className="mb-6">
        <label className="block font-semibold mb-2">
          Select or upload file:
        </label>
        <select
          className="w-full p-2 rounded border border-blue-300 bg-white mb-3"
          value={selectedFileId}
          onChange={(e) => setSelectedFileId(e.target.value)}
        >
          <option value="">-- Choose a file --</option>

          {localFile?.data && (
            <option value="local">
              (Local) {localFile.fileName || "Unnamed Local File"}
            </option>
          )}

          {files.map((file) => (
            <option key={file._id} value={file._id}>
              {file.fileName || "Unnamed File"}
            </option>
          ))}
        </select>

        {/* <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleLocalFileChange}
          className="block w-full mt-2"
        /> */}
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">
          Ask a question about your data:
        </label>
        <textarea
          rows={4}
          className="border p-2 w-full resize-none"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question here..."
          disabled={
            !activeData || !activeData.data || activeData.data.length === 0
          }
        />
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={
          loading ||
          !question.trim() ||
          !activeData ||
          !activeData.data ||
          activeData.data.length === 0
        }
        className={`px-6 py-2 font-semibold text-white rounded ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Thinking..." : "Ask"}
      </button>

      {answer && (
        <div className="mt-8 p-4 border rounded bg-gray-50 whitespace-pre-wrap">
          <h2 className="font-semibold mb-2">AI Response:</h2>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default ChatWithFile;
