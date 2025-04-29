import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";

// function Dashboard() {
//   const { user } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/");
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded shadow-md w-96 text-center">
//         <h1 className="text-3xl font-bold mb-6">Welcome {user?.name}!</h1>
//         <p className="text-gray-600 mb-8">You have successfully logged in.</p>
//         <button
//           onClick={handleLogout}
//           className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;
import React from "react";
import { motion } from "framer-motion";

import {
  FaFileExcel,
  FaChartBar,
  FaRobot,
  FaHistory,
  FaDownload,
  FaCog,
  FaThLarge,
} from "react-icons/fa";

const SidebarItem = ({ icon, label, active }) => (
  <div
    className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-300
    ${
      active
        ? "bg-white text-[#2E3C43] font-semibold"
        : "text-white hover:bg-gradient-to-r hover:from-white hover:to-[#E0F7FA] hover:text-[#2E3C43]"
    }`}
  >
    <div className="text-lg">{icon}</div>
    <span className="text-sm">{label}</span>
  </div>
);

const Dashboard = () => {
  return (
    <motion.div
      className="min-h-screen w-full bg-gradient-to-br from-[#E0F7FA] to-[#B2EBF2] flex transition-all duration-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Sidebar */}
      <aside className="w-64 bg-[#00ACC1] text-white p-6 flex flex-col gap-6 shadow-md rounded-tr-3xl rounded-br-3xl">
        <h2 className="text-xl font-bold mb-6">SheetSense</h2>
        <SidebarItem icon={<FaThLarge />} label="Dashboard" active />
        <SidebarItem icon={<FaFileExcel />} label="Upload Excel" />
        <SidebarItem icon={<FaChartBar />} label="Analyze Data" />
        <SidebarItem icon={<FaHistory />} label="History" />
        <SidebarItem icon={<FaDownload />} label="Downloads" />
        <SidebarItem icon={<FaRobot />} label="AI Insights" />
        <SidebarItem icon={<FaCog />} label="Settings" />
      </aside>

      {/* Main content */}
      <div className="flex-1 p-8">
        {/* Top bar */}
        <div className="flex justify-end items-center gap-4 mb-6">
          <span className="text-[#2E3C43] font-medium">{user?.name}</span>
          <button className="bg-white text-[#00ACC1] px-4 py-2 rounded shadow-sm hover:bg-[#4DD0E1] hover:text-white transition-all cursor-pointer">
            Logout
          </button>
        </div>

        {/* Content area */}
        <div className="bg-white p-6 rounded-xl shadow-lg min-h-[300px]">
          <h1 className="text-2xl font-semibold text-[#2E3C43] mb-4">
            Dashboard
          </h1>
          <p className="text-[#546E7A]">
            Your analytics and uploads will appear here.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
