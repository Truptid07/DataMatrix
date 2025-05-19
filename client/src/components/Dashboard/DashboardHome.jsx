import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

function DashboardHome() {
  const { user } = useSelector((state) => state.auth);
  const [pinnedCharts, setPinnedCharts] = useState([]);
  const { token } = useSelector((state) => state.auth);

  const handleUnpin = async (chartId) => {
    try {
      await axios.delete(`${BASE_URL}/api/pinned-charts/${chartId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPinnedCharts((prev) => prev.filter((chart) => chart._id !== chartId));
    } catch (error) {
      console.error("Failed to unpin chart:", error);
    }
  };

  useEffect(() => {
    if (!token) return;

    axios
      .get(`${BASE_URL}/api/pinned-charts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setPinnedCharts(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch pinned charts:", err);
      });
  }, [token]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="p-4 sm:p-6 md:p-8 bg-white/80 rounded-2xl shadow-md w-full"
    >
      <motion.h1
        className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#2E3C43] mb-4 outfit"
        variants={fadeUp}
        custom={1}
      >
        Welcome {user?.name}!
      </motion.h1>

      <motion.p
        className="text-sm sm:text-base md:text-lg text-[#546E7A] mb-6"
        variants={fadeUp}
        custom={2}
      >
        You have successfully logged in. Your analytics and uploads will appear
        here.
      </motion.p>

      {pinnedCharts.length > 0 && (
        <motion.div variants={fadeUp} custom={3} className="mt-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            📌 Your Pinned Charts
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pinnedCharts.map((chart) => (
              <div
                key={chart._id}
                className="p-4 bg-white shadow rounded border border-gray-100 relative"
              >
                <h3 className="font-semibold text-indigo-600 mb-1">
                  {chart.title}
                </h3>
                <p className="text-sm text-gray-500 mb-1">Type: {chart.type}</p>
                <p className="text-sm text-gray-500 mb-2">
                  X: {chart.config?.xAxis}, Y: {chart.config?.yAxis}
                </p>
                <button
                  onClick={() => handleUnpin(chart._id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                  title="Unpin chart"
                >
                  ✖ Unpin
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default DashboardHome;
