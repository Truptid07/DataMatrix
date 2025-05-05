// src/pages/AdminManageUsers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminManageUsers() {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState({});
  const navigate = useNavigate();

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
      const res = await axios.put(
        `${BASE_URL}/api/admin/users/${id}`,
        body,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-2">
                  <input
                    name="name"
                    value={
                      editingId === u._id ? formState.name : u.name
                    }
                    onChange={handleChange}
                    disabled={editingId !== u._id}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="p-2">
                  <input
                    name="email"
                    value={
                      editingId === u._id ? formState.email : u.email
                    }
                    onChange={handleChange}
                    disabled={editingId !== u._id}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="p-2">
                  <select
                    name="role"
                    value={
                      editingId === u._id ? formState.role : u.role
                    }
                    onChange={handleChange}
                    disabled={editingId !== u._id}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-2 flex gap-2">
                  {editingId === u._id ? (
                    <>
                      <button
                        onClick={() => saveEdit(u._id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        💾
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-gray-500 hover:text-gray-800"
                      >
                        ✖️
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(u)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteUser(u._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
