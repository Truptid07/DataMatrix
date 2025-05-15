import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFilesContext } from "../../context/FileContext";
import { useLocalFile } from "../../context/LocalFileContext";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { motion, AnimatePresence } from "framer-motion";

import FileSelector from "../useraiinsighs/FileSelector";
import InsightControls from "../useraiinsighs/InsightControls";
import ExportShareButtons from "../useraiinsighs/ExportShareButtons";
import EmailInput from "../useraiinsighs/EmailInput";
import InsightList from "../useraiinsighs/InsightList";
import ConfirmModal from "../useraiinsighs/ConfirmModal";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AIInsights = () => {
  const { files, selectedFileId, setSelectedFileId, fileData, fetchFiles } = useFilesContext();
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
    setPayload(activeFile);
  }, [selectedFileId, fileData, localFile]);

  const generateInsights = () => {
    if (!confirmed) {
      setShowConfirmModal(true);
      return;
    }
    if (!payload) return;
    setLoading(true);
    setError("");
    axios
      .post(`${BASE_URL}/ai/insights`, {
        fileId: selectedFileId,
        data: payload.data,
        headers: payload.headers,
        xAxis,
        yAxis,
        chartType,
      })
      .then((res) => {
        setInsights(res.data.insights);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to generate insights.");
        setLoading(false);
      });
  };

  const onExportTxt = () => {
    if (!insights.length) return;
    const txt = insights.map((i) => `${i.type}: ${i.text}`).join("\n\n");
    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "insights.txt");
  };

  const onExportPdf = () => {
    if (!insights.length) return;
    const doc = new jsPDF();
    insights.forEach((insight, idx) => {
      doc.text(`${insight.type}: ${insight.text}`, 10, 10 + idx * 20);
    });
    doc.save("insights.pdf");
  };

  const onShareLink = () => {
    if (!insights.length) return;
    axios
      .post(`${BASE_URL}/ai/share`, { insights })
      .then((res) => {
        setShareId(res.data.shareId);
        setShareLink(`${window.location.origin}/shared/${res.data.shareId}`);
      })
      .catch(() => setError("Failed to create share link."));
  };

  const onSendEmail = () => {
    if (!email || !shareId) return;
    axios
      .post(`${BASE_URL}/ai/email`, { email, shareId })
      .then(() => alert("Email sent!"))
      .catch(() => alert("Failed to send email."));
  };

  const onCopyInsight = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleProceed = () => {
    setConfirmed(true);
    setShowConfirmModal(false);
    generateInsights();
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
        availableColumns={availableColumns}
        xAxis={xAxis}
        yAxis={yAxis}
        setXAxis={setXAxis}
        setYAxis={setYAxis}
        chartType={chartType}
        setChartType={setChartType}
        onGenerate={generateInsights}
        loading={loading}
      />
    )}

    {error && <p className="text-red-600 mt-2">{error}</p>}

    {insights.length > 0 && (
      <>
        <ExportShareButtons
          onExportTxt={onExportTxt}
          onExportPdf={onExportPdf}
          onShareLink={onShareLink}
          onShowEmail={() => setShowEmailInput((prev) => !prev)}
        />
        {showEmailInput && (
          <EmailInput email={email} setEmail={setEmail} onSend={onSendEmail} />
        )}
        {shareLink && (
          <p className="mt-4 text-green-700 break-all">
            Share Link:{" "}
            <a href={shareLink} target="_blank" rel="noreferrer" className="underline">
              {shareLink}
            </a>
          </p>
        )}
        <InsightList insights={insights} onCopy={onCopyInsight} />
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
