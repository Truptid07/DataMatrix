import { motion } from "framer-motion";

const ExportShareButtons = ({ onExportTxt, onExportPdf, onShareLink, onShowEmail }) => (
  <div className="mt-6 flex flex-wrap gap-4 animate-fade-in-up">
    <motion.button
      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
      onClick={onExportTxt}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Export .txt
    </motion.button>
    <motion.button
      className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
      onClick={onExportPdf}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Export .pdf
    </motion.button>
    <motion.button
      className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
      onClick={onShareLink}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Share Link
    </motion.button>
    <motion.button
      className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition"
      onClick={onShowEmail}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Email Link
    </motion.button>
  </div>
);

export default ExportShareButtons;
