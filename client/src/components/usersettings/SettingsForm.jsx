import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import SettingsInput from "./SettingsInput";
import SettingsMessage from "./SettingsMessage";
import { fadeInUp } from "../animations/fadeInUp";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SettingsForm = () => {
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
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        setFormData({
          ...formData,
          name: res.data.name,
          email: res.data.email,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BASE_URL}/api/auth/update`, formData, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed.");
    }
  };

  return (
    <>
      <motion.h2
        custom={0}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="text-2xl font-semibold mb-4 text-blue-700 text-center"
      >
        Update Profile
      </motion.h2>
      <SettingsMessage
        custom={0}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        message={message}
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        <SettingsInput
          custom={0.2}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
        />
        <SettingsInput
          custom={0.4}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          readOnly
        />
        <SettingsInput
          custom={0.6}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="New Password (optional)"
        />
        <motion.button
          custom={0.8}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
        >
          Update Profile
        </motion.button>
      </form>
    </>
  );
};

export default SettingsForm;
