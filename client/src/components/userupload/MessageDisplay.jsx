import { motion } from "framer-motion";
import { fadeInUp } from "../animations/fadeInUp";

function MessageDisplay({ message }) {
  if (!message) return null;

  return (
    <motion.p
      custom={0.1}
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className={`mt-6 text-center text-sm font-medium ${
        message.startsWith("✅") ? "text-green-600" : "text-red-600"
      }`}
    >
      {message}
    </motion.p>
  );
}

export default MessageDisplay;
