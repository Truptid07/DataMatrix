import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
import { motion } from "framer-motion";
import {
  FaUserCog,
  FaDatabase,
  FaThLarge,
  FaCog,
} from "react-icons/fa";
import Logo from "../components/Logo";

const sidebarVariants = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
};

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const SidebarItem = ({ icon, label, active }) => (
    <div
      className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 outfit
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

  return (
    <motion.div
      className="min-h-screen w-full bg-gradient-to-br from-[#E0F7FA] to-[#B2EBF2] flex transition-all duration-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        className="w-64 bg-[#00ACC1] text-white p-6 flex flex-col gap-6 shadow-lg rounded-tr-3xl rounded-br-3xl"
      >
        <Logo />
        <motion.h2
          variants={itemVariants}
          className="text-2xl font-bold mb-8 outfit tracking-wide"
        >
          Admin Panel
        </motion.h2>
        <motion.div variants={itemVariants}>
          <SidebarItem icon={<FaThLarge />} label="Admin Dashboard" active />
        </motion.div>
        <motion.div variants={itemVariants}>
          <SidebarItem icon={<FaUserCog />} label="Manage Users" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <SidebarItem icon={<FaDatabase />} label="Manage Files" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <SidebarItem icon={<FaCog />} label="Settings" />
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Top Bar */}
        <motion.div
          className="flex justify-end items-center gap-4 mb-6"
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            variants={itemVariants}
            className="text-[#2E3C43] outfit font-semibold"
          >
            {user?.name}
          </motion.span>
          <motion.button
            variants={itemVariants}
            onClick={handleLogout}
            className="bg-white text-[#00ACC1] px-4 py-2 rounded shadow-sm hover:bg-[#4DD0E1] hover:text-white transition-all cursor-pointer outfit font-semibold"
          >
            Logout
          </motion.button>
        </motion.div>

        {/* Content Area */}
        <div className="bg-white p-6 rounded-xl shadow-lg min-h-[300px] outfit">
          <h1 className="text-2xl font-semibold text-[#2E3C43] mb-4">
            Welcome, Admin {user?.name}!
          </h1>
          <p className="text-[#546E7A]">
            Here you can manage platform users and uploaded files. More features coming soon.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
