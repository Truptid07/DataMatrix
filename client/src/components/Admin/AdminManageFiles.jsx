import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEye, FiTrash2, FiDownload, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminManageFiles() {
  const [files, setFiles] = useState([]);
  const [modalFile, setModalFile] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const filesPerPage = 5;

  const fetchFiles = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/admin/files`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
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
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
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
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      setFiles((f) => f.filter((x) => x._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const downloadFile = async (id, fileName) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/files/download/${id}`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  const filtered = files.filter((f) => {
    const matchSearch =
      f.fileName.toLowerCase().includes(search.toLowerCase()) ||
      f.user?.name.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter
      ? f.user?.role === roleFilter
      : true;
    return matchSearch && matchRole;
  });

  const totalPages = Math.ceil(filtered.length / filesPerPage);
  const paginated = filtered.slice((page - 1) * filesPerPage, page * filesPerPage);

  const resetFilters = () => {
    setSearch("");
    setRoleFilter("");
    setPage(1);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Manage Files</h1>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or uploader..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md w-full sm:max-w-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
        />
        <button
          onClick={resetFilters}
          className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition w-full sm:w-auto cursor-pointer"
        >
          Clear Filters
        </button>
      </div>

      {/* Table */}
      <div className="shadow-lg rounded-lg overflow-hidden">
        <table className="w-full bg-white">
          <thead className="bg-gradient-to-r from-cyan-100 to-blue-100 text-gray-700 font-semibold">
            <tr>
              <th className="p-3 text-left">Filename</th>
              <th className="p-3 text-left">Uploaded By</th>
              <th className="p-3 text-left">Uploaded At</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No files found.
                </td>
              </tr>
            )}

            {paginated.map((f) => (
              <tr key={f._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{f.fileName}</td>
                <td className="p-3">{f.user?.name || "—"}</td>
                <td className="p-3">
                  {new Date(f.createdAt).toLocaleString()}
                </td>
                <td className="p-3 flex justify-center gap-4 text-lg">
                  {/* <button
                    onClick={() => viewFile(f._id)}
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                    title="View"
                  >
                    <FiEye />
                  </button>
                  <button
                    onClick={() => downloadFile(f._id, f.fileName)}
                    className="text-green-600 hover:text-green-800 cursor-pointer"
                    title="Download"
                  >
                    <FiDownload />
                  </button> */}
                  <button
                    onClick={() => deleteFile(f._id)}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded-md border cursor-pointer ${
                page === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalFile && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="font-semibold text-lg">
                  {modalFile.fileName}
                </h2>
                <button
                  onClick={() => setModalFile(null)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <FiX size={20} />
                </button>
              </div>
              <div className="p-4 max-h-[60vh] overflow-auto text-sm">
                <table className="min-w-full border">
                  <thead className="bg-gray-100">
                    <tr>
                      {modalFile.headers.map((h) => (
                        <th key={h} className="p-1 border">
                          {h}
                        </th>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
