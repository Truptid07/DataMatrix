// src/pages/AdminHome.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminHome = () => {
  const { token } = useSelector((state) => state.auth);
  const [counts, setCounts] = useState({ users: 0, files: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [usersRes, filesRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/admin/total-users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/api/admin/total-files`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setCounts({
          users: usersRes.data.count,
          files: filesRes.data.count,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [token]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#2E3C43]">
        Welcome, Admin!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Users Card */}
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-medium text-gray-700">Total Users</h2>
          <p className="text-4xl font-bold mt-4">{counts.users}</p>
        </div>

        {/* Total Files Card */}
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-medium text-gray-700">Total Files</h2>
          <p className="text-4xl font-bold mt-4">{counts.files}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
