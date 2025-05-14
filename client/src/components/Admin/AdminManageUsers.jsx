import React, { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminManageUsers() {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState({});
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const filesPerPage = 5;

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) navigate("/");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const startEdit = (u) => {
    setEditingId(u._id);
    setFormState({ name: u.name, email: u.email, role: u.role, password: "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormState({});
  };

  const saveEdit = async (id) => {
    try {
      const body = { ...formState };
      if (!body.password) delete body.password;
      const res = await axios.put(`${BASE_URL}/api/admin/users/${id}`, body, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers((us) =>
        us.map((u) => (u._id === id ? { ...u, ...res.data } : u))
      );
      cancelEdit();
    } catch (err) {
      console.error(err);
      alert("Failed to save changes");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers((us) => us.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  const handleChange = (e) =>
    setFormState({ ...formState, [e.target.name]: e.target.value });

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter ? u.role === roleFilter : true;

    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / filesPerPage);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * filesPerPage,
    page * filesPerPage
  );

  const resetFilters = () => {
    setSearch("");
    setRoleFilter("");
    setPage(1);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Manage Users</h1>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 px-3 py-2 border border-gray-300 rounded-md w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          onClick={resetFilters}
          className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition w-full sm:w-auto cursor-pointer"
        >
          Clear Filters
        </button>
      </div>

      <div className="shadow-lg rounded-lg overflow-hidden">
        <table className="w-full bg-white">
          <thead className="bg-gradient-to-r from-cyan-100 to-blue-100 text-gray-700 font-semibold">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}

            {filteredUsers.map((u) => (
              <tr key={u._id} className="border-t transition hover:bg-gray-50 ">
                <td className="p-3">
                  <input
                    name="name"
                    value={editingId === u._id ? formState.name : u.name}
                    onChange={handleChange}
                    disabled={editingId !== u._id}
                    className={`w-full px-2 py-1 rounded-md transition ${
                      editingId === u._id
                        ? "border border-gray-300 bg-white"
                        : "border-none bg-transparent"
                    }`}
                  />
                </td>
                <td className="p-3">
                  <input
                    name="email"
                    value={editingId === u._id ? formState.email : u.email}
                    onChange={handleChange}
                    disabled={editingId !== u._id}
                    className={`w-full px-2 py-1 rounded-md transition ${
                      editingId === u._id
                        ? "border border-gray-300 bg-white"
                        : "border-none bg-transparent"
                    }`}
                  />
                </td>
                <td className="p-3">
                  <select
                    name="role"
                    value={editingId === u._id ? formState.role : u.role}
                    onChange={handleChange}
                    disabled={editingId !== u._id}
                    className={`w-full px-2 py-1 rounded-md transition ${
                      editingId === u._id
                        ? "border border-gray-300 bg-white cursor-pointer"
                        : "border-none bg-transparent"
                    }`}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-3 flex justify-center gap-3 text-lg">
                  {editingId === u._id ? (
                    <>
                      <button
                        onClick={() => saveEdit(u._id)}
                        className="text-green-600 hover:text-green-800 transition cursor-pointer"
                        title="Save"
                      >
                        💾
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-gray-500 hover:text-gray-800 transition cursor-pointer"
                        title="Cancel"
                      >
                        ✖️
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(u)}
                        className="text-blue-600 hover:text-blue-800 transition cursor-pointer"
                        title="Edit"
                      >
                        <FaRegEdit size={18} />
                      </button>
                      <button
                        onClick={() => deleteUser(u._id)}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center mt-4 gap-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-2 font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
