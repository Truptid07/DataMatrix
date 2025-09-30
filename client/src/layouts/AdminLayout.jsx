// /src/layouts/AdminLayout.jsx

import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { motion } from "framer-motion";
import Sidebar from "../components/Admin/Sidebar";
import Topbar from "../components/Admin/Topbar";

function AdminLayout() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <motion.div
      className="min-h-screen w-full bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#8B5A9F] flex transition-all duration-500 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl"
          style={{ top: '10%', left: '10%' }}
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"
          style={{ bottom: '10%', right: '10%' }}
          animate={{
            x: [0, -80, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <Sidebar />

      <div className="flex-1 p-8 relative z-10">
        <Topbar user={user} handleLogout={handleLogout} />

        <div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/20 min-h-[300px] outfit">
          <Outlet />
        </div>
      </div>
    </motion.div>
  );
}

export default AdminLayout;
