import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminSettings = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  // Fetch current user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setFormData({ ...formData, name: res.data.name, email: res.data.email });
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(""); // Clear message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BASE_URL}/api/auth/update`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessage("✅ Profile updated successfully!");
      setFormData((prev) => ({ ...prev, password: "" })); // Clear only password
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || "Update failed."}`);
    }
  };

  return (
    <div className="p-6 flex justify-center items-center min-h-screen bg-gradient-to-br from-[#dff1fd] to-[#b3dcf3]">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-semibold text-center text-[#2E3C43] mb-6">Update Profile</h2>

        {message && (
          <p
            className={`text-center mb-4 font-medium text-sm ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
            placeholder="Email Address"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed shadow-sm"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="New Password (optional)"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
          />
          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-[#007ea7] text-white font-semibold hover:bg-[#0097a7] shadow-md transition"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
