import { motion } from "framer-motion";

const EmailInput = ({ email, setEmail, onSend }) => (
  <motion.div className="mt-4 flex flex-col sm:flex-row gap-2 items-start sm:items-center animate-fade-in-up">
    <input
      type="email"
      placeholder="Enter email address"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded w-full sm:w-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    />
    <motion.button
      onClick={onSend}
      className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition"
    >
      Send Email
    </motion.button>
  </motion.div>
);

export default EmailInput;
