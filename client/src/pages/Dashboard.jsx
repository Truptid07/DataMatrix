// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { logout } from "../redux/authSlice";

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

const Dashboard = () => {
  return (
    <motion.div
      className="min-h-screen w-full bg-gradient-to-br from-[#E0F7FA] to-[#B2EBF2] flex items-center justify-center transition-all duration-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="text-center p-6">
        <h1 className="text-4xl font-bold text-[#2E3C43] mb-4">Welcome to Your Dashboard</h1>
        <p className="text-lg text-[#546E7A]">Upload your Excel files and start analyzing your data.</p>
      </div>
    </motion.div>
  );
};

export default Dashboard;
