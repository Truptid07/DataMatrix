import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFilesContext } from "../../context/FileContext";
import { useLocalFile } from "../../context/LocalFileContext";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp } from "../animations/fadeInUp";

import FileSelector from "../useraiinsighs/FileSelector";
import InsightControls from "../useraiinsighs/InsightControls";
import ExportShareButtons from "../useraiinsighs/ExportShareButtons";
import EmailInput from "../useraiinsighs/EmailInput";
import InsightList from "../useraiinsighs/InsightList";
import ConfirmModal from "../useraiinsighs/ConfirmModal";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AIInsights = () => {
  const { files, selectedFileId, setSelectedFileId, fileData, fetchFiles } =
    useFilesContext();
  const { localFile } = useLocalFile();

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    fetchFiles();
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
    if (activeFile) {
      setPayload({
        fileId: selectedFileId,
        data: activeFile.data,
        headers: activeFile.headers,
        xAxis,
        yAxis,
        chartType,
      });
    }
  }, [selectedFileId, fileData, localFile, xAxis, yAxis, chartType]);

  const handleGenerateInsights = () => {
    if (!confirmed) {
      setShowConfirmModal(true);
      return;
    }
    generateInsights();
  };

  const generateInsights = async () => {
    if (!payload) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${BASE_URL}/api/insights`, payload, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      setInsights(res.data);
    } catch {
      setError("Failed to fetch insights. Please try again.");
    } finally {
      setLoading(false);
      setConfirmed(false);
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

  const handleProceed = () => {
    setConfirmed(true);
    setShowConfirmModal(false);
    handleGenerateInsights();
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <FileSelector
        files={files}
        localFile={localFile}
        selectedFileId={selectedFileId}
        setSelectedFileId={setSelectedFileId}
      />

      {availableColumns.length > 0 && (
        <InsightControls
          custom={0.2}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          availableColumns={availableColumns}
          xAxis={xAxis}
          yAxis={yAxis}
          setXAxis={setXAxis}
          setYAxis={setYAxis}
          chartType={chartType}
          setChartType={setChartType}
          onGenerate={handleGenerateInsights}
          loading={loading}
        />
      )}

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {insights.length > 0 && (
        <>
          <ExportShareButtons
            onExportTxt={handleExportTxt}
            onExportPdf={handleExportPdf}
            onShareLink={handleShare}
            onShowEmail={() => setShowEmailInput((prev) => !prev)}
          />
          {showEmailInput && (
            <EmailInput
              email={email}
              setEmail={setEmail}
              onSend={handleEmailShare}
            />
          )}
          {shareLink && (
            <p className="mt-4 text-green-700 break-all">
              Share Link:{" "}
              <a
                href={shareLink}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                {shareLink}
              </a>
            </p>
          )}
          <InsightList insights={insights} onCopy={handleCopy} />
        </>
      )}

      <AnimatePresence>
        {showConfirmModal && (
          <ConfirmModal onCancel={handleCancel} onProceed={handleProceed} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIInsights;
