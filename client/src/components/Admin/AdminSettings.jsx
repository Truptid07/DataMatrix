import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileForm from "../adminsettings/ProfileForm";
import Message from "../adminsettings/Message";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminSettings = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        });
        setFormData((prev) => ({ ...prev, name: res.data.name, email: res.data.email }));
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BASE_URL}/api/auth/update`, formData, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      setMessage("✅ Profile updated successfully!");
      setFormData((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || "Update failed."}`);
    }
  };

  return (
    <div className="p-6 flex justify-center items-center min-h-screen bg-gradient-to-br from-[#dff1fd] to-[#b3dcf3]">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-semibold text-center text-[#2E3C43] mb-6">Update Profile</h2>
        <Message message={message} />
        <ProfileForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default AdminSettings;
