import { motion } from "framer-motion";
import SettingsForm from "../usersettings/SettingsForm";

const Settings = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#e0f2ff] to-[#cce7ff] flex items-center justify-center px-4">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl"
    >
      <SettingsForm />
    </motion.div>
  </div>
);

export default Settings;
