import React, { useEffect, useState } from "react";
import axios from "axios";

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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Uploaded Files</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">📄 Filename</th>
              <th className="p-3">🗓 Upload Date</th>
              <th className="p-3">🔍 View / ⬇️ Download</th>
              <th className="p-3">❌ Delete</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{file.fileName}</td>
                <td className="p-3">{new Date(file.createdAt).toLocaleString()}</td>
                <td className="p-3">
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
                <td className="p-3">
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(file._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
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

      {/* Modal for viewing file content */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">File Content</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-red-500 font-bold"
              >
                ✖
              </button>
            </div>
            <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(selectedFileContent, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
