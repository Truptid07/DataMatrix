// src/pages/AdminManageFiles.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminManageFiles() {
  const [files, setFiles] = useState([]);
  const [modalFile, setModalFile] = useState(null);

  const fetchFiles = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/admin/files`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFiles(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load files");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const viewFile = async (id) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/admin/files/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setModalFile(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load file");
    }
  };

  const deleteFile = async (id) => {
    if (!window.confirm("Delete this file?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/admin/files/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFiles((f) => f.filter((x) => x._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Files</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Filename</th>
              <th className="p-2">Uploaded By</th>
              <th className="p-2">Uploaded At</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((f) => (
              <tr key={f._id} className="border-t hover:bg-gray-50">
                <td className="p-2">{f.fileName}</td>
                <td className="p-2">{f.user?.name || "—"}</td>
                <td className="p-2">
                  {new Date(f.createdAt).toLocaleString()}
                </td>
                <td className="p-2 flex gap-3">
                  <button
                    onClick={() => viewFile(f._id)}
                    className="text-blue-600 hover:underline"
                  >
                    🔍
                  </button>
                  <button
                    onClick={() => deleteFile(f._id)}
                    className="text-red-600 hover:underline"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {files.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No files found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold">Contents of {modalFile.fileName}</h2>
              <button onClick={() => setModalFile(null)}>✖️</button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-auto text-sm">
              {/* Render CSV-like table */}
              <table className="min-w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    {modalFile.headers.map((h) => (
                      <th key={h} className="p-1 border">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {modalFile.data.map((row, i) => (
                    <tr key={i} className={i % 2 ? "bg-gray-50" : ""}>
                      {modalFile.headers.map((h) => (
                        <td key={h} className="p-1 border">
                          {row[h]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
