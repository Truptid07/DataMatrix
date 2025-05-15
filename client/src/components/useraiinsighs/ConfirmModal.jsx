import { motion } from "framer-motion";

const ConfirmModal = ({ onCancel, onProceed }) => (
  <motion.div
    className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-lg font-semibold mb-4 text-red-600">⚠️ Data Privacy Warning</h2>
      <p className="text-gray-700 mb-4">
        By proceeding, you agree to share your selected data with our AI service (Gemini/OpenAI) to generate insights. Sensitive or personal data may be analyzed.
      </p>
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancel</button>
        <button onClick={onProceed} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Proceed</button>
      </div>
    </motion.div>
  </motion.div>
);

export default ConfirmModal;
