// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { FiUsers, FiFileText } from "react-icons/fi";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const AdminHome = () => {
//   const { token } = useSelector((state) => state.auth);
//   const [counts, setCounts] = useState({ users: 0, files: 0 });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchCounts = async () => {
//       try {
//         const [usersRes, filesRes] = await Promise.all([
//           axios.get(`${BASE_URL}/api/admin/total-users`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get(`${BASE_URL}/api/admin/total-files`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);
//         setCounts({
//           users: usersRes.data.count,
//           files: filesRes.data.count,
//         });
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load dashboard data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCounts();
//   }, [token]);

//   if (loading)
//     return (
//       <p className="text-center text-gray-600 font-medium py-10">
//         Loading Dashboard...
//       </p>
//     );

//   if (error)
//     return (
//       <p className="text-center text-red-600 font-semibold py-10">{error}</p>
//     );

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#007ea7] to-[#00c2cb]">
//         Welcome, Admin!
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Total Users Card */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 transition duration-300">
//           <div className="p-4 rounded-full bg-[#dff1fd] text-[#007ea7] text-3xl">
//             <FiUsers />
//           </div>
//           <div>
//             <h2 className="text-lg font-semibold text-gray-700">
//               Total Users
//             </h2>
//             <p className="text-3xl font-bold text-gray-900">{counts.users}</p>
//           </div>
//         </div>

//         {/* Total Files Card */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 transition duration-300">
//           <div className="p-4 rounded-full bg-[#dff1fd] text-[#007ea7] text-3xl">
//             <FiFileText />
//           </div>
//           <div>
//             <h2 className="text-lg font-semibold text-gray-700">
//               Total Files
//             </h2>
//             <p className="text-3xl font-bold text-gray-900">{counts.files}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminHome;

// src/pages/AdminHome.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { AreaChart, Area, PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { FaUser, FaFileAlt } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const COLORS = ["#00bcd4", "#2196f3"];

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

  const chartData = [
    { name: "Users", value: counts.users },
    { name: "Files", value: counts.files },
  ];

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#007ea7] to-[#00c2cb]">
        Welcome, Admin!
      </h1>

      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between bg-white p-6 rounded-lg shadow-lg"
        >
          <div>
            <p className="text-gray-500">Total Users</p>
            <h2 className="text-3xl font-bold text-gray-800">{counts.users}</h2>
          </div>
          <FaUser className="text-4xl text-sky-500" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-between bg-white p-6 rounded-lg shadow-lg"
        >
          <div>
            <p className="text-gray-500">Total Files</p>
            <h2 className="text-3xl font-bold text-gray-800">{counts.files}</h2>
          </div>
          <FaFileAlt className="text-4xl text-emerald-500" />
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Users & Files Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00bcd4" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#00bcd4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#00bcd4"
                fillOpacity={1}
                fill="url(#colorUsers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                fill="#8884d8"
                label
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminHome;
