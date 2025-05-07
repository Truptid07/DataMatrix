import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const History = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFileContent, setSelectedFileContent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/files/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFiles(res.data);
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
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleView = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/files/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedFileContent(res.data); // Assuming res.data has content to display
      setShowModal(true);
    } catch (err) {
      console.error("View failed", err);
    }
  };

  const handleDownload = async (id, fileName) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/files/${id}/download`, {
        responseType: "blob", // Important for binary data
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-4 md:p-8 bg-[#f0f8ff] min-h-screen">
      <h2 className="text-2xl font-bold text-blue-800 mb-6 animate-fade-in-up">
        📁 Uploaded Files
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden animate-fade-in-up">
          <thead>
            <tr className="bg-blue-100 text-blue-800 text-left">
              <th className="p-4">📄 Filename</th>
              <th className="p-4">🗓 Upload Date</th>
              <th className="p-4">🔍 View / ⬇️ Download</th>
              <th className="p-4">❌ Delete</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <motion.tr
                key={file._id}
                className="border-t hover:bg-blue-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <td className="p-4">{file.fileName}</td>
                <td className="p-4">
                  {new Date(file.createdAt).toLocaleString()}
                </td>
                <td className="p-4">
                  <button
                    className="text-blue-600 hover:underline mr-4"
                    onClick={() => handleView(file._id)}
                  >
                    View
                  </button>
                  <button
                    className="text-green-600 hover:underline"
                    onClick={() => handleDownload(file._id, file.fileName)}
                  >
                    Download
                  </button>
                </td>
                <td className="p-4">
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(file._id)}
                  >
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))}
            {files.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No files uploaded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-3xl flex justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded shadow-lg max-w-2xl w-full max-h-[80vh] overflow-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-blue-700">File Content</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-red-500 font-bold"
              >
                ✖
              </button>
            </div>
            <pre className="text-sm whitespace-pre-wrap text-gray-700">
              {JSON.stringify(selectedFileContent, null, 2)}
            </pre>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default History;
