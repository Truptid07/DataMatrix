import React, { useEffect, useState } from "react";
import axios from "axios";
import FileTable from "../userhistory/FileTable";
import FileModal from "../userhistory/FileModal";
import { motion } from "framer-motion";
import { fadeInUp } from "../animations/fadeInUp";
import { useTranslation } from "react-i18next";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const History = () => {
  const { t } = useTranslation();

  const [files, setFiles] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFileContent, setSelectedFileContent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/files/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFiles(res.data);
        setHistory(res.data.map((file) => file.fileName));
      } catch (error) {
        console.error("Error fetching files", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/files/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles((prev) => prev.filter((file) => file._id !== id));
      setHistory((prev) => prev.filter((_, idx) => files[idx]._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleView = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/files/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedFileContent(res.data);
      setShowModal(true);
    } catch (err) {
      console.error("View failed", err);
    }
  };

  const handleDownload = async (id, fileName) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/files/${id}/download`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  if (loading) return <p className="text-center">{t("loading")}</p>;

  return (
    <div className="p-4 md:p-8 bg-[#f0f8ff] min-h-screen">
      <motion.h2
        custom={0}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="text-2xl font-bold text-blue-800 mb-6 animate-fade-in-up"
      >
        📁 {t("history.uploadedFiles")}
      </motion.h2>

      <FileTable
        custom={0.2}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        files={files}
        onView={handleView}
        onDownload={handleDownload}
        onDelete={handleDelete}
      />

      {showModal && (
        <FileModal
          custom={0.4}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          content={selectedFileContent}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default History;