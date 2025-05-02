import { useSelector } from "react-redux";
import { motion } from "framer-motion";

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
        className="text-sm sm:text-base md:text-lg text-[#546E7A]"
        variants={fadeUp}
        custom={2}
      >
        You have successfully logged in. Your analytics and uploads will appear here.
      </motion.p>
    </motion.div>
  );
}

export default DashboardHome;
