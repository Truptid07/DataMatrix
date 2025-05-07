import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Settings = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${BASE_URL}/api/auth/update`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f2ff] to-[#cce7ff] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl"
      >
        <h2 className="text-2xl font-semibold mb-4 text-blue-700 text-center">
          Update Profile
        </h2>
        {message && (
          <p className="mb-4 text-sm text-green-600 text-center">
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
            className="w-full border border-blue-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full border border-gray-300 bg-gray-100 p-2 rounded-lg"
            readOnly
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="New Password (optional)"
            className="w-full border border-blue-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
          >
            Update Profile
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Settings;
