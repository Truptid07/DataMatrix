import { motion } from "framer-motion";

function MessageDisplay({ message }) {
  if (!message) return null;

  return (
    <motion.p
      className={`mt-6 text-center text-sm font-medium ${
        message.startsWith("✅") ? "text-green-600" : "text-red-600"
      }`}
    >
      {message}
    </motion.p>
  );
}

export default MessageDisplay;
